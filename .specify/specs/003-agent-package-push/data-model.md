# Data Model: Push an agent package

**Feature**: [spec.md](./spec.md) · **Research**: [research.md](./research.md) · **Date**: 2026-08-27

Wire shapes are hand-written because the routes involved are mounted `include_in_schema=False` and
never reach the vendored OpenAPI document ([D1](./research.md#d1--does-the-live-agent-create-body-match-the-vendored-openapi-document)).
Each is transcribed from a live response or from the backend schema named beside it.

---

## 1. On disk — what the package carries

### `PackageLocation`

Resolution order, first hit wins ([D13](./research.md#d13--locating-the-package)):

| Order | Path | Meaning |
|---|---|---|
| 1 | `<dir>/build/slng/agent.json` | operator named the package root |
| 2 | `<dir>/agent.json` | operator named the compiled directory |

```ts
interface PackageLocation {
  agentBody: string;   // absolute path to agent.json
  toolsDir: string;    // <compiled>/tools — may not exist
  samplesDir: string;  // <compiled>/samples — introduced by this feature
  searched: string[];  // both candidates, for the FR-002 message
}
```

Neither present → fail naming **both** candidates. `tools/` absent is normal, not an error: a
package whose tools are all curated emits none.

### `CompiledAgent` — `agent.json`

Transcribed from `examples/slng-support/build/slng/agent.json`.

| Field | Type | Notes |
|---|---|---|
| `schema_version` | `2` | must be present with `tool_mode` (D1) |
| `name` | string | the identity `push` matches an existing agent on |
| `system_prompt` | string | scanned for `{{$NAME}}` vault tokens (D5) |
| `greeting` | string | required by the platform |
| `language` | string | |
| `region` | `any \| us-east \| eu-central \| ap-south` | `any` is live-valid despite the vendored enum |
| `models` | object | `stt`, `llm`, `tts`, `tts_voice`, `*_kwargs`; forwarded verbatim |
| `enable_interruptions` | boolean | |
| `tool_mode` | `"shared"` | |
| `tool_refs` | `PackageToolRef[]` | names where ids belong — the whole point of the feature |
| `mcp_refs` | array | **must be empty**; non-empty is a blocker (D8) |
| `runtime_variables` | string[] | |
| `template_defaults` | `Record<string,string>` | |
| `template_variable_options` | `Record<string,{required:boolean}>` | |

`push` forwards unrecognised fields untouched. It is a resolver, not a validator of the platform's
own schema — the platform rejects what it dislikes, and FR-035 surfaces that verbatim.

### `PackageToolRef` — one entry of `tool_refs` as unmute writes it

```jsonc
{ "tool": "end_call",                    // NAME — becomes tool_id + version
  "description": "End the call when …",  // preserved verbatim (FR-026)
  "invocation": "model",                 // preserved
  "argument_overrides": {} }             // preserved
```

`execution_policy` and `config_overrides` appear on richer packages and are likewise preserved. The
`tool` key is removed and replaced by `attachment_id` + `tool_id` + `version`; nothing else changes.

### `PackageToolBody` — `tools/<name>.json`

A `ToolCreate` body as unmute emits it (`unmute_cli/internal/generate/slng_v1.go:110`).

| Field | Type | Present for |
|---|---|---|
| `name` | string | all |
| `description` | string | all |
| `tool_type` | `code \| api_request \| end_call \| …` | all — **immutable on update** (D3.1) |
| `config` | object | all; `code` carries `import_probes` + `egress` |
| `code_src` | string | `code` |
| `declared_secrets` | string[] | `code` — the vault names (D5) |
| `dependencies` | string[] | `code` — exact `name==version` pins, pre-canonicalised |

### `PackageSample` — `samples/<name>.json` *(new in this feature)*

Not an unmute concept. Introduced because `code` and `api_request` cannot publish without a green
run ([D7](./research.md#d7--unmute-ships-no-samples-what-does-that-do-to-us3)).

```jsonc
{ "order_id": "A-1024" }   // becomes RunRequest.sample_input verbatim
```

A JSON object, matching the tool's declared `input`. `push` does not validate it against that
schema — the run does, and reports `validation: "mismatch"`.

---

## 2. On the wire — shapes read and written

### `ToolListItem` — already modelled

`cli/src/commands/tool.ts` defines it and `listAllTools` / `pickTool` are imported unchanged.
`id` → `tool_id`, `latest_version` → `version`, `source` drives collision precedence (D10).

### `VaultEntry` — already modelled

`cli/src/commands/secret.ts`. Only `name` and **`kind`** are consulted. Kind matters: the platform's
`secrets_exist` gate counts `kind: "secret"` only, so a `variable` of the right name does not satisfy
a tool's requirement ([D4](./research.md#d4--what-gates-publish-and-which-tool-types-need-a-green-run)).
`redact()` is applied before any record reaches a renderer (FR-040).

### `ToolAttachment` — what the platform requires

`app/schemas/shared_tool_contract.py:481`, verified live (D1).

| Field | Type | Source |
|---|---|---|
| `attachment_id` | UUID | minted, or reused from the live agent (D11) |
| `tool_id` | UUID | resolved from the catalogue |
| `version` | int ≥ 1 | `latest_version`, or `PublishResult.version_number` |
| `description` | string \| null | from the package |
| `invocation` | `model \| system` | from the package |
| `system`, `execution_policy`, `argument_overrides`, `config_overrides` | | from the package |

Validator: `invocation: "system"` requires `system`; `invocation: "model"` requires its absence.
`attachment_id` must be unique within the agent (`agent_config.py:352`).

### `RunRequest` / `RunResult` / `PublishResult`

`app/schemas/tool.py:585`.

```ts
interface RunRequest  { sample_input: Record<string, unknown>;
                        confirm_side_effects: true; }   // required literal — never forged (D6)
interface RunResult   { status: "succeeded" | "failed" | "timed_out"; latency_ms: number;
                        output_json?: unknown; logs: string[];
                        validation: "valid" | "mismatch" | "na"; error?: string | null;
                        proven_hash?: string | null; gate_status?: GateStatus | null; }
interface PublishResult { published: boolean; version_number: number | null; checks: GateStatus; }
```

`publish` returns **409 with a `PublishResult` body** on gate failure — not an error envelope. It
must be read as a result, not passed to `formatAgentsError`.

### `AgentVersion`

`GET /v1/agents/{id}/versions?page=1&page_size=1`, newest first, `{items, meta}` envelope (D9).
Only `version_number` and `config_hash` are used. Label via
`PATCH /v1/agents/{id}/versions/{n}` with `{"label": string}` — ≤120 chars, `extra: forbid`.

---

## 3. Internal — what Plan produces

### `PushPlan`

The complete, read-only description of the intended push. Rendered by `--dry-run`; consumed by Apply.

```ts
interface PushPlan {
  organisation: { id: string; name?: string };   // FR-011
  agent: { name: string; action: "create" | "update"; existingId?: string };
  tools: PlannedTool[];
  refs: PlannedRef[];
  removals: { attachment_id: string; tool_id: string; name?: string }[];  // FR-030
  overwrites: string[];                          // scalar fields a replace would change (FR-030)
  blockers: Blocker[];
}

interface PlannedTool {
  name: string;
  action: "create" | "update";
  toolType: string;
  existingId?: string;
  needsGreenRun: boolean;    // code | api_request (D4)
  hasSample: boolean;
  willRun: boolean;          // needsGreenRun && hasSample && --run-samples
}

interface PlannedRef {
  name: string;
  toolId: string;
  version: number | "after-publish";  // unknown until the tool publishes
  attachmentId: string;
  reused: boolean;                     // FR-024 vs FR-023
  shadowed?: "curated";                // FR-027 — reported, not hidden
}
```

`overwrites` lists the scalar fields (`system_prompt`, `greeting`, `language`, `region`, `models`,
`enable_interruptions`) whose value differs from the live agent's.

Two rules make this warning usable, and both were learned from a live push rather than reasoned out:

1. **A fixed field list, not a generic diff.** `schema_version` reads back null and
   `template_variable_options` returns as `template_variables`, so a generic diff flags both on every
   push.
2. **Objects compare on the keys the package declares, not on the whole value** (`declaredDiffers`
   in `push.ts`, recursive). The platform enriches what it stores: a `models` object sent as
   `{stt, llm, tts, tts_voice, *_kwargs}` comes back with `stt_kwargs: {punctuate: true}`,
   `fallbacks`, four timeout fields and `failure_audio_enabled`. A whole-value comparison therefore
   reported `models` as overwritten on **every single push**.

Both rules exist for the same reason: a warning that always fires is a warning nobody reads, and
this one is the operator's only protection against replace semantics (FR-030, SC-006). Simplifying
`declaredDiffers` to a `JSON.stringify` equality would reintroduce the noise silently — the unit
tests in `push.test.ts` pin the behaviour precisely because a stub echoes back what it was sent and
cannot catch it.

`removals` is populated only when updating, by diffing the live agent's `tool_refs` against the
package's. It is what makes FR-030 concrete: replace semantics are lossy, and this is the operator's
only warning ([D12](./research.md#d12--create-vs-update-transport)).

### `Blocker`

One reason the push cannot proceed. Plan collects **all** of them — FR-005, FR-007 and FR-014 all
require reporting the complete set in one pass, never the first.

| `kind` | Raised when | Message carries |
|---|---|---|
| *(not a blocker)* | neither candidate path exists | Raised as a `PackageError` from `lib/package.ts`, **not** a `Blocker`: blockers are a field of `PushPlan`, and there is no plan to attach one to when the package cannot be read. The message names both searched paths (FR-002). |
| `vault_missing` | a required name is absent, or present with `kind: "variable"` | every missing name + `https://app.slng.ai/vault/secrets` (FR-012) |
| `tool_unresolved` | a bodiless ref matches no visible tool | every unresolved name + `https://app.slng.ai/tools` (FR-013) |
| `tool_type_immutable` | a shipped body's `tool_type` differs from the existing tool's | both types, the tool name (D3.1) |
| `sample_missing` | `needsGreenRun` and no `samples/<name>.json` | the tool, the file to write, why (D7) |
| `singleton_exists` | a shipped body's type is one the platform keeps one of per org, and the org has one | the shipped name, its type, and the name of the tool the org already holds ([D14](./research.md#d14--managed-singleton-types-silently-adopt-an-existing-tool), FR-041) |
| `samples_not_enabled` | `needsGreenRun`, sample present, `--run-samples` absent | the flag name and what it consents to (D6) |
| `mcp_unsupported` | `mcp_refs` is non-empty | that MCP is unsupported and why (D8) |
| `agent_ambiguous` | more than one agent has the package's name | every matching id, and `--agent-id` (FR-031) |

Any blocker ⇒ print all, change nothing, exit non-zero (FR-009, FR-010).

### `ApplyOutcome`

Accumulated during Apply so a partial push can report its exact state (FR-021). Never discarded on
failure — that is the whole reason Apply records rather than throws.

```ts
interface ApplyOutcome {
  tools: { name: string; created?: boolean; updated?: boolean;
           introspected?: boolean; ran?: RunResult["status"];
           published?: number | false; error?: string }[];
  agent?: { id: string; action: "create" | "update" };
  version?: { number: number; label: string } | "unchanged";   // D9 — no-op push labels nothing
  failedAt?: string;
}
```

---

## 4. State transitions

### Per tool (Apply step 1)

```text
                         ┌─ ctx-bound ─────────────────────────────┐
                         │  (end_call, send_sms, …)                │
create|update ──────────►┤                                          ├──► publish ──► version n
   (POST|PATCH)          │                                          │      │
                         └─ code ──► introspect ──► run ────────────┘      └─ 409 ─► ABORT
                            api_request ────────► run                          (gates in body)
```

- `introspect` runs for `code` only — it is what populates the parse/models/schema gates.
- `run` is reached only when `willRun`; Plan has already guaranteed a sample and the flag, so a
  missing one is never discovered here.
- `run` returning anything but `succeeded` ⇒ abort (FR-018). `proven_hash` stays null, so publishing
  anyway would 409 regardless.
- `publish` 409 ⇒ abort, rendering `checks` as the reason.

### Per agent (Apply steps 2–3)

```text
create ─► POST /v1/agents ──────────► id ─► GET versions ─► PATCH label
update ─► PUT  /v1/agents/{id} ─────► id ─► GET versions ─┬─ new version ─► PATCH label
                                                          └─ unchanged ───► report "unchanged"
```

`PUT`, not `PATCH` — replace, per FR-029 (D12). The version read is what distinguishes "wrote a new
version" from "nothing changed"; labelling without that check would relabel the previous push's
version (D9).

---

## 5. Validation rules, and where each is enforced

| Rule | Enforced by | Requirement |
|---|---|---|
| Package exists and parses | `lib/package.ts`, before any network call | FR-001, FR-002 |
| Every vault name exists **with `kind: "secret"`** | Plan, against one `listSecrets()` | FR-004, FR-005 |
| Every bodiless ref resolves to one tool | Plan, `listAllTools(names)` + `pickTool` | FR-007, FR-027 |
| Org tool shadows curated, and the shadow is reported | `pickTool`, unchanged from `tool.ts` | FR-027 |
| `tool_type` unchanged for an existing tool | Plan | D3.1 |
| A green-run type has a sample, and running is consented to | Plan | D6, D7 |
| A shipped body's type is not one the org already holds one of | Plan, against the full org catalogue matched on `tool_type` | FR-041, D14 |
| `mcp_refs` empty | Plan | D8 |
| Exactly one agent matches the name | Plan | FR-031 |
| `attachment_id` unique, reused where possible | Plan (mint/reuse), platform re-checks | FR-023–FR-025 |
| Everything else about the body | the platform; surfaced verbatim | FR-035 |

The last row is deliberate. `push` does not duplicate the platform's schema validation — models,
regions and language combinations are the platform's to reject, and `formatAgentsError` already
renders those envelopes.
