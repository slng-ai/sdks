# Phase 0 Research: Push an agent package

**Feature**: [spec.md](./spec.md) · **Date**: 2026-08-27

Every wire-level question below was settled by probing the deployed API at
`https://api.agents.slng.ai` with the organisation credential in `.env`, by reading the backend
source at `slng-ai/backend` (local checkout, `develop` @ `cff21d6a`), or by reading the unmute
compiler source (local checkout of `unmute_cli`). Nothing here is inferred from documentation, and
where source and deployment disagree the deployment wins — see D2.

---

## D1 — Does the live agent create body match the vendored OpenAPI document?

**Decision**: No. `specs/agents/agents.oas.yaml` is behind the deployed API and must not be used to
derive shapes for this feature.

**Evidence**: The vendored `VoiceAgentCreate` has `tools: [ToolCreate]`, a `region` enum of
`us-east | eu-central | ap-south`, and no `schema_version`, `tool_mode`, `tool_refs` or `mcp_refs`.
The deployed API has all four and accepts `region: "any"`. Read live from an existing agent:

```json
{ "tool_mode": "shared", "region": "any",
  "tool_refs": [ { "attachment_id": "8a294047-…", "tool_id": "fd25f5c5-…", "version": 3,
                   "description": "End the call when the caller is finished or says goodbye.",
                   "invocation": "model", "system": null, "execution_policy": null,
                   "argument_overrides": {}, "config_overrides": null } ] }
```

Backend `app/schemas/voice_agent.py:960` confirms: `schema_version: Literal[2] | None`,
`tool_mode: Literal["legacy","shared"] = "shared"`, `tool_refs: list[ToolAttachment]` (max 128).

Two validator rules bind the pusher (`voice_agent.py:974-1005`):

- `schema_version: 2` **requires** an explicit `tool_mode` — omitting it raises
  `"native AgentConfig v2 requests require explicit tool_mode"`.
- `tool_mode: "shared"` and a non-empty `tools` array are mutually exclusive, as are
  `tool_mode: "legacy"` and `tool_refs`/`mcp_refs`.

Unmute writes `schema_version: 2` + `tool_mode: "shared"` + `tool_refs`, which is the valid
combination. `schema_version` is not echoed back on read (comes back `null`); `tool_mode` is.

**Consequence**: these routes are mounted `include_in_schema=False`, so no `bun run sync-specs` will
ever bring them into the vendored document. This feature uses the raw-fetch helper in
`cli/src/lib/agents.ts` with hand-written types, exactly as `tool`, `secret` and `trunks` already do.
Constitution I is respected: `specs/` is not edited.

---

## D2 — Can an API key reach the tool write verbs?

**Decision**: Yes. All of create, update, introspect, run and publish are routed on the public
`/v1/agents/tools` prefix and reachable with a bearer API key.

**Evidence**: Probed live. An invalid UUID in the path is the discriminator — a routed path returns
`422 VALIDATION_FAILED` on the path parameter, an unrouted one returns 404.

| Method | Path | Status |
|---|---|---|
| `GET` | `/v1/agents/tools` | 200 |
| `POST` | `/v1/agents/tools` | 422 (routed) |
| `PATCH` | `/v1/agents/tools/not-a-uuid` | 422 (routed) |
| `POST` | `/v1/agents/tools/not-a-uuid/introspect` | 422 (routed) |
| `POST` | `/v1/agents/tools/not-a-uuid/run` | 422 (routed) |
| `POST` | `/v1/agents/tools/not-a-uuid/publish` | 422 (routed) |
| `GET` | `/v1/agents/tools/not-a-uuid/versions` | 422 (routed) |

**Note on the source checkout**: `build_tool_router` in `app/api/shared_tool_router.py` is called
exactly twice in the `develop` checkout — `app/api/admin/tools.py` (`/admin/organisations/{org_id}/tools`)
and `app/api/client/tools.py` (`/orgs/{org_id}/tools`). Neither is the public prefix. The deployed
build nevertheless routes the public mount, as the table above proves. **The local checkout is behind
the deployment**; handler semantics below are read from it, but reachability was established live.

---

## D3 — What are the tool lifecycle contracts?

**Decision**: The five verbs the spec needs exist, with these shapes
(`app/api/shared_tool_router.py`, `app/schemas/tool.py`).

| Verb | Path | Body | Success |
|---|---|---|---|
| create | `POST /v1/agents/tools` | `ToolCreate` | 201 + `ToolDetail` |
| update | `PATCH /v1/agents/tools/{id}` | `ToolUpdate` | 200 + `ToolDetail` |
| introspect | `POST /v1/agents/tools/{id}/introspect` | none | 200 + `ToolDetail` |
| run | `POST /v1/agents/tools/{id}/run` | `RunRequest` | 200 + `RunResult` |
| publish | `POST /v1/agents/tools/{id}/publish` | none | 200 + `PublishResult`; **409 + `PublishResult`** on gate failure |

`ToolCreate` is a strict discriminated union on `tool_type` (`extra="forbid"`, `strict=True`).
Common fields: `name` (pattern-constrained, ≤200), `description` (≤2000), `argument_defaults`.
The `code` variant adds `config`, `code_src`, `declared_secrets`, `dependencies`.

Three constraints that shape the design:

1. **`tool_type` is immutable on update.** `ToolUpdate` has no `tool_type` field, and the service
   re-validates `config` against the stored row's type (`tool.py:457`). A package that changes a
   tool's type cannot be updated in place.
2. **`run` is forbidden on curated tools** — `403 "Duplicate a curated tool before running an editor
   test"` — and on context-bound types, `400 "Context-bound tools are previewed in the editor and
   cannot be test-run"` (`shared_tool_router.py:166-175`).
3. **`RunRequest.confirm_side_effects: Literal[True]` is required.** Not a default, not optional —
   the request is rejected without it. See D6.

---

## D4 — What gates publish, and which tool types need a green run?

**Decision**: Gate sets differ by `tool_type`, and two of the three require a successful run before
publish is possible (`app/services/tool_versions.py:121-210`).

| `tool_type` | Gates | Green run required to publish? |
|---|---|---|
| context-bound (`end_call`, `voicemail_detection`, transfer, `send_sms`) | `config_valid` (+ `secrets_exist` for `send_sms`) | **No** — never executes |
| typed data (`api_request`) | `config_valid`, `secrets_exist`, `name_unique`, **`green_run`** | **Yes** |
| `code` | introspection (`parse`/`models`/`schema`), **`green_run`**, `code_environment`, `content_current` | **Yes** |

`green_run` passes only when `tool.proven_hash == compute_run_hash(code_src, dependencies,
declared_secrets, argument_defaults, egress_policy)`. `proven_hash` is set **only** by a run that
returns `status: "succeeded"`. There is no other way to set it through the public API.

**`secrets_exist` counts only `kind: "secret"`.** `_secrets_exist_check` filters
`OrgSecret.kind == ORG_SECRET_KIND_SECRET` (`tool_versions.py:92`). A vault entry of kind
`variable` with the right name does **not** satisfy a tool's secret requirement. Pre-flight must
check kind, not just presence — `voiceai secret list` already surfaces `kind`.

---

## D5 — Which vault names does a package depend on?

**Decision**: Derive them from the shipped tool bodies using the backend's own rule, per tool type
(`app/services/tools.py:156-177`).

```text
code         → declared_secrets, verbatim
send_sms     → the fixed SEND_SMS_SECRET_NAMES set
api_request  → config.auth.secret_name when auth.type ∈ {bearer, hmac},
               plus every config.headers[].secret_name
everything else → none
```

The CLI must not re-derive this from first principles; it mirrors the table above against the tool
bodies the package ships, and the backend re-checks it as a publish gate anyway.

**The agent body contributes names too.** The example package's runbook states that a package which
"writes a `{{$NAME}}` Vault token into a prompt" needs that entry. `examples/slng-support` has none,
so this path is unexercised by the smallest package.

**Alternatives considered**: calling publish and reading `checks.static.secrets_exist.detail`
(`"missing org secrets: A, B"`) — rejected as the *primary* mechanism because it only reports after
the tool has been created, violating FR-008. It is a useful cross-check, not the pre-flight.

---

## D6 — Can `push` run a tool sample unattended?

**Decision**: Not silently. `confirm_side_effects: Literal[True]` is a deliberate consent gate, and
`push` must not forge it. Running samples requires an explicit operator opt-in on the command line.

**Evidence**: `RunRequest` (`app/schemas/tool.py:585`) declares `confirm_side_effects` as
`Literal[True]` with no default. A run executes the operator's real handler against their real
dependencies — for an `api_request` tool it issues the actual HTTP request, resolving real org
secrets into headers (`shared_tool_router.py:186-206`). The field exists because a test run can
charge a card, send a message, or mutate a third-party system.

A `push` that supplied `confirm_side_effects: true` on the operator's behalf would convert
"deploy my agent" into "execute my webhooks", silently, on every push.

**Consequence**: samples run only under an explicit flag. Without it, `push` does not call `/run`.

---

## D7 — Unmute ships no samples. What does that do to US3?

**Decision**: This is a **blocking gap**, not a detail. As specified, US3 cannot publish a `code` or
`api_request` tool from an unmute package.

**Evidence**: The emitted tool body is a `ToolCreate` shape and nothing more
(`unmute_cli/internal/generate/slng_v1.go:110-125`):

```go
type slngCodeTool struct {
    Name, Description, ToolType string
    Config      slngCodeConfig   // import_probes, egress
    CodeSrc     string
    Secrets     []string         // declared_secrets
    Dependencies []string
}
```

There is no sample field, and `grep -ri sample` across the unmute package fixtures and docs returns
nothing. The source tool YAML (`internal/testdata/slng_tools/tools/*.yaml`) carries `input:` — a JSON
Schema — but no example instance of it.

The chain closes with no exit:

```text
no sample  →  cannot call /run  →  proven_hash stays null
           →  green_run gate fails  →  publish returns 409
           →  no published version  →  tool_ref has no `version` to point at
```

Context-bound tools (which is all of `examples/slng-support`) are unaffected: they gate on
`config_valid` only and publish without ever running.

**Resolution taken**: `push` reads an optional sample per tool from `samples/<tool-name>.json`
alongside the tool bodies, supplied by the operator, not by unmute. Combined with D6:

- A tool type that needs a green run, shipping no sample → **pre-flight failure** (FR-008), naming
  the tool and the file to write. Caught before anything is created, not discovered at publish.
- A sample present but `--run-samples` not passed → same pre-flight failure, naming the flag.
- `--run-samples` + sample present → run with `confirm_side_effects: true`, abort on failure
  (FR-018).

**Alternatives considered**: minting a sample from the tool's `input` JSON Schema (rejected —
fabricated inputs against a live webhook is exactly what D6 forbids); publishing what can publish and
reporting the rest (rejected — leaves the agent referencing an unpublished tool, which the platform
will not accept); waiting for unmute to emit samples (rejected — this feature cannot block on an
upstream compiler change, and the convention above is compatible with one if it lands).

---

## D8 — MCP references cannot be resolved offline *or* by this feature

**Decision**: `mcp_refs` are **out of scope**, and a package carrying one must be refused in
pre-flight with a clear reason.

**Evidence**: `McpAttachment` (`app/schemas/shared_tool_contract.py:501`) requires
`observed_schema_hash: str = Field(..., pattern=r"^[0-9a-f]{64}$")` — a sha256 over the schemas in
the MCP server's own `tools/list` response. Unmute says so itself:

> SLNG also wants `observed_schema_hash`, a sha256 over schemas read from the live server's own
> tools/list response, which no offline compiler can produce.

Producing it means `push` opening an MCP session to the operator's server, enumerating its tools, and
hashing the result — a protocol client, not a name lookup. The spec never mentions MCP; the smallest
package has none. Refusing loudly beats emitting a body the platform rejects on a field the operator
has never heard of.

---

## D9 — How is an agent version labelled?

**Decision**: `PATCH /v1/agents/{agent_id}/versions/{version_number}` with `{"label": "..."}`.
The version number is discovered by reading the version list after the write.

**Evidence**: Live, `GET /v1/agents/{id}/versions?page=1&page_size=3` returns 200:

```json
{"items": [{"version_number": 3, "config_hash": "115199cb…", "changed_fields": ["models"],
            "source": "update", "actor_type": "api", "label": null,
            "created_at": "2026-08-26T07:07:22.656885Z"}],
 "meta": {"page": 1, "page_size": 3, "total": 3, "pages": 1}}
```

Newest first, paginated envelope. `VoiceAgentVersionLabelUpdate` (`voice_agent.py:1248`) has exactly
one field, `label: str | None`, ≤120 chars, `extra="forbid"` — the docstring says "the label is the
only mutable field on a version".

**A version is written only when something changed.** `changed_fields` is per-version and `source` is
`"update"`; a push that changes nothing produces no new version and therefore has nothing to label.
`push` must read the newest version *after* the write and compare — labelling blindly would relabel
the previous push's version.

**Not usable here**: the `X-Agent-Version-Created` response header exists but only on
`POST /{agent_id}/versions/{n}/restore/accept` (`agents.py:1113-1148`), not on create or update.

---

## D10 — Name collisions are real, and the org side wins

**Decision**: Reuse `pickTool` from `cli/src/commands/tool.ts` unchanged (FR-027).

**Evidence**: `end_call` genuinely collides in the probed organisation. Live:

| `source` | `id` | `latest_version` | `description` |
|---|---|---|---|
| `curated` | `952eb6b1-fa3f-47a5-9ec5-ccee65d5eba3` | 1 | "Let the agent hang up, with a goodbye spoken first." |
| `org` | `fd25f5c5-15e7-4662-b11b-62b82beba14c` | 3 | "End the call for the user when the user doesn't need anything else." |

The `tool_id` in the unmute runbook's worked example is `fd25f5c5-…` — the **org** one, at version 3.
That matches `pickTool`'s existing precedence (org shadows curated) and the live agent's `tool_refs`,
which carries exactly that id at version 3. The existing rule is already the right one; a second rule
would contradict a shipped command.

---

## D11 — Where do the identifiers for a reference come from?

**Decision**: `tool_id` and `version` from the tool catalogue; `attachment_id` minted locally or
reused from the live agent.

- `tool_id` — `id` from `GET /v1/agents/tools?name=<name>` after `pickTool`.
- `version` — `latest_version` from the same row for a curated/pre-existing tool; the
  `version_number` returned by `PublishResult` for a tool this push just published.
- `attachment_id` — a fresh v4 UUID, **except** when updating an agent whose existing `tool_refs`
  already carry an attachment for the same `tool_id`, in which case that `attachment_id` is reused
  (FR-024). `GET /v1/agents/{id}` returns `tool_refs` with `attachment_id`, so the reuse map is one
  read. Verified live in D1.

`ToolAttachment` validates `attachment_id` uniqueness within an agent
(`agent_config.py:352`), so a duplicated id is rejected rather than silently merged.

---

## D12 — Create vs update transport

**Decision**: `POST /v1/agents` to create; `PUT /v1/agents/{id}` to update, because the spec chose
replace semantics (FR-029).

`PATCH` merges — every field on `VoiceAgentUpdate` is nullable-optional, so an omitted `tool_refs`
leaves the existing refs attached. That is precisely the merge behaviour FR-029 rejects. `PUT`
(`agents replace` in the existing CLI) sends the whole body, so a reference the package dropped is
absent from the new document and detached.

**Consequence for the dry-run (FR-030)**: the diff shown is the live agent's `tool_refs` and
scalar fields against the body about to be sent. One `GET /v1/agents/{id}` supplies the left side.

---

## D13 — Locating the package

**Decision**: Accept both the package root and the compiled directory; search `<dir>/build/slng/agent.json`
then `<dir>/agent.json`, in that order, and report both paths when neither exists (FR-002).

`GenerateSlng` writes `agent.json`, `tools/<name>.json` per tool needing a body, and `README.md`
into `build/<target>/` (`slng_v1.go:34`). So `tools/` sits beside `agent.json`, and is absent when
every tool is curated — which is why `examples/slng-support` has no `build/slng/tools/`.

---

## D14 — Managed singleton types silently adopt an existing tool

**Decision**: A package shipping a body for `end_call`, `send_sms` or `transfer_call` is refused in
pre-flight when the organisation already holds one of that type.

**Found the hard way**, during live testing on 2026-08-27, not by reading the source first.

`MANAGED_SINGLETON_TYPES = {"send_sms", "transfer_call", "end_call"}` (`app/schemas/tool.py:54`).
`ToolService.create` (`app/services/tools.py:585`) short-circuits for these:

```python
if managed_singleton:
    existing = await self._org_instance_of(org_id, payload.tool_type)
    if existing is not None:
        return existing          # the requested NAME is ignored entirely
```

So `POST /v1/agents/tools` with `{"name": "push_test_tool", "tool_type": "end_call"}` returned the
organisation's **existing** `end_call` (`fd25f5c5…`) with a 201. push read that as "created", then
published it — a new version of a shared production tool the operator never asked to touch, one
other agents may already reference.

**Why it did not do damage in the test**: publish is content-addressed
(`app/services/tool_versions.py`):

```python
if latest is not None and latest.content_hash == derived_hash:
    return True, latest.version_number, checks
```

The fixture's content hashed identically to the existing tool, so v3 came back and no v4 was minted.
One different character in `description` or `config` and it would have published v4 over live state.
That the failure mode hides itself on identical content is exactly what makes it worth a blocker
rather than a warning.

**Consequence**: `isManagedSingleton` in `cli/src/lib/package.ts`, checked against the full org
catalogue (matched on `tool_type`, which a name-filtered catalogue cannot answer). Regression tests
in `push.test.ts`.

**Alternatives considered**: adopting the existing tool and skipping publish (rejected — the agent
would reference a tool the package did not describe, silently); publishing under the requested name
(impossible, the platform ignores it).

---

## D15 — `transfer_call` cannot be attached without outbound telephony

Attaching `transfer_call` returns `422 AGENT_OUTBOUND_TRUNK_REQUIRED — Select an outbound SIP trunk
for this agent`, confirmed live. Telephony is out of scope for this feature, so a package whose agent
references a human-transfer tool cannot be pushed by this command at all. The platform's error is
surfaced verbatim (FR-035), which is the correct behaviour, but it is a real scope boundary rather
than a bug — and a reason the deferred telephony work is not merely cosmetic.

---

## Open items carried into implementation

| Item | Disposition |
|---|---|
| Sample convention `samples/<tool>.json` | Introduced by this feature (D7). Not an unmute concept; documented in the contract. |
| `mcp_refs` | Refused in pre-flight (D8). Tracked as follow-up work. |
| Telephony / trunks | Out of scope by decision. `sip_inbound_trunk_id` / `sip_outbound_trunk_id` are omitted from the pushed body entirely, leaving the platform default. |
| `tool_type` change on an existing tool | Refused in pre-flight with the reason (D3.1); no delete-and-recreate. |
| Local backend checkout behind deployment | Reachability always verified live, never from source (D2). |

## D16 — Agent names are unique, so FR-031 is a guard, not a path

**Question**: FR-031 refuses to guess when two agents share the package's name. How does an
organisation reach that state?

**Answer, from the live platform**: it cannot. `POST /v1/agents` rejects a duplicate name:

```json
{ "error": { "code": "AGENT_NAME_CONFLICT",
             "message": "Agent with name 'push-test-DELETE-ME' already exists" } }
```

Soft-deleted agents carry a `deleted_at` field but do not appear in `agents list`, so they
cannot resurrect the collision either.

**Decision**: keep the blocker. It is five lines, and the alternative when the invariant
breaks is silently picking an arbitrary agent and replacing it — the worst possible failure
for a command with replace semantics. But stop advertising `--agent-id` as the fix for a
duplicated name: its real use is pushing a package to an agent whose name differs from the
package's (a rename, or one package deployed to several agents).

**How this was found**: by trying to *create* the collision for quickstart §11 and being
refused. The unit tests pass a stub two same-named agents quite happily — nothing in a
stub-backed suite can discover that the platform forbids the input.

## D17 — `declared_secrets` and `dependencies` are code-only

**Observed**: creating an `api_request` tool whose body carried `declared_secrets: []` and
`dependencies: []` fails:

```json
{ "error": { "code": "VALIDATION_FAILED", "fields": [
  { "path": "api_request.declared_secrets", "message": "Extra inputs are not permitted" },
  { "path": "api_request.dependencies",     "message": "Extra inputs are not permitted" } ] } }
```

The platform's per-type body model accepts these two fields only for `code`. This is the
same asymmetry [D5](#d5--which-vault-names-does-a-package-depend-on) already describes for
secret derivation, seen from the write side.

**Decision**: `toolWriteBody()` strips both fields for any non-`code` type before create or
update. A compiled package may legitimately carry them as empty arrays, and the operator did
not write them, so failing the push over them would be a defect in `push`, not in the
package.

**Second finding, same request**: the `fields[]` array was being dropped by
`formatAgentsError`, so the operator saw `HTTP 422 · Request validation failed. Fix the
highlighted fields and try again.` with no highlighted fields. Now surfaced. This affects
every command that calls the agents host, not just `push`.
