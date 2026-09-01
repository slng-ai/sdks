# Research: Push agents with MCP references, and validate before publishing

**Date**: 2026-09-01 | **Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

All evidence marked *(live)* was taken from the production agents API (`https://api.agents.slng.ai`)
on 2026-09-01 against organisation `firecrawl-mcp-2` / agent `mymcptest`, using read-only requests
plus one idempotent connect. No agent, tool or server was created, changed or deleted.

---

## D1 — D8 of spec 003 is wrong, and this is exactly how

**Decision**: Delete the `mcp_unsupported` blocker. `observed_schema_hash` is read, not computed.

**Evidence**: D8 concluded that `observed_schema_hash` is "a sha256 over the schemas in the MCP
server's own `tools/list` response … which no offline compiler can produce", and inferred that `push`
would therefore need to be an MCP protocol client. The first clause is true. The inference is not,
because the platform already performs that probe on its own schedule and publishes the result.

*(live)* `GET /v1/agents/mcp-servers/{id}` returns a `capabilities` object whose every tool carries a
`schema_hash`:

```
firecrawl_scrape  60865ff5ec8f4f1e66b431b6a9a3c6a5c093096c6b53f2b5ad26abf0324204be
firecrawl_map     6757acb2bac6db6cfcbe046458828ee12eb3ce3c67957643e1899b9f020a08b4
firecrawl_search  c9a8ca1b8268d051a024f572e2e152b18e37657e18b8569a9d8a74d979eab8c3
```

*(live)* `GET /v1/agents` shows agent `mymcptest` storing, for its `firecrawl_map` attachment:

```json
{ "attachment_id": "4bff2987-…", "server_id": "dc517114-…", "tool_name": "firecrawl_map",
  "observed_schema_hash": "6757acb2bac6db6cfcbe046458828ee12eb3ce3c67957643e1899b9f020a08b4" }
```

Byte-identical. The value the attachment must carry is already on the wire, in a response the CLI
already parses — `mcp tools <name> --json` prints these very objects today.

**Alternatives considered**: implementing an MCP client in the CLI (rejected — it is the work D8
correctly declined, and it is unnecessary); keeping the blocker behind an opt-in flag (rejected — a
flag to disable a refusal that has no reason to exist is two features where zero are wanted).

---

## D2 — The reference's server is named, its id is looked up

**Decision**: `mcp_refs[].server` is a **name**. Resolve it through the list-by-name route, then read
that server's detail for the capability snapshot.

**Rationale**: This is the same shape `tool_refs` already has — unmute writes names where the
platform wants identifiers, because no compiler can invent an id a server assigns, and resolving them
is push's job. Nothing in the MCP path justifies a different convention.

**Evidence and its limit**: the only artefact naming the key is spec 003's own test fixture,
`{ server: "docs", tool_name: "search" }` (`cli/src/commands/push.test.ts:258`). We have not read an
unmute-emitted package that contains `mcp_refs`.

**Consequence**: accept `server_name` as an alias, and make a reference carrying neither key fail as
an *unresolved reference* — printing the keys it did find — rather than throwing on `undefined`. Two
lines that convert an unknown into a message.

**Cost**: one list request plus one detail request per **distinct** server referenced. A ten-tool
agent on one server costs two requests, not twenty.

---

## D3 — A live connect is the refresh, and it is the only thing `mcp run` can mean

**Decision**: `mcp run <server-name>` connects to the server and reports the outcome. It cannot, and
will not, invoke an individual MCP tool.

**Evidence** *(live)*, `POST /v1/agents/mcp-servers/{id}/connect` with no body → `200`:

```json
{ "status": "connected", "latency_ms": 1060,
  "server_info": { "name": "firecrawl-fastmcp", "version": "3.24.1" },
  "protocol_version": "2025-03-26",
  "capabilities": { "tools": [ … 26 tools, each with schema_hash … ] } }
```

And it refreshes the stored snapshot. Before/after the connect, the detail's timestamps moved:

| Field | After connect |
|---|---|
| `capability_status` | `healthy` |
| `capability_observed_at` | `2026-09-01T09:38:54Z` — set to now |
| `capability_attempted_at` | `2026-09-01T09:38:54Z` |
| `next_refresh_at` | `2026-09-01T09:43:12Z` — **≈ 4m18s later** |

That `next_refresh_at` is the origin of the operator's "connected 5 minutes ago" constraint, and it
is what makes "validated yesterday → run it" work: one connect and the snapshot is current.

**Non-existence is also evidence.** Every plausible route for invoking one MCP tool returns `404`:
`POST …/{id}/call`, `…/invoke`, `…/tools/call`, `…/tools/{tool}/call`. So do `…/probe`, `…/refresh`,
`…/capabilities`, `…/test`, `…/run`, `…/validate`, `…/discover`, `…/sync`. `connect` is the only one
that answers. `mcp run` is therefore scoped to connect-and-report, and the spec says so in its
Assumptions rather than leaving a reader to expect otherwise.

**Alternatives considered**: naming the command `mcp connect` (rejected — the operator asked for
`mcp run`, it parallels `tool run`, and "run this server" is what they mean); adding a
`push --refresh-mcp` flag instead of a command (rejected — it hides a useful diagnostic inside a
command that already does a great deal, and answers "is my server up?" only as a side effect of
publishing).

---

## D4 — Staleness is read from the platform, never hard-coded

**Decision**: A snapshot is treated as stale when `capability_status` is not `healthy`,
`capability_observed_at` is null, or `next_refresh_at` is in the past. Five minutes appears in no
source file.

**Rationale**: the window is the platform's to choose and it will change. `next_refresh_at` is the
platform stating, per server, when it next intends to look — a self-updating threshold, obtained from
a response the plan already fetches, costing nothing.

**Known ceiling, stated plainly**: `next_refresh_at` is when the platform intends to refresh, which
is a *proxy* for when a snapshot stops being acceptable, not a definition of it. It is used to decide
a **warning**, never to decide a refusal. The authoritative answer is the platform's response to the
write, which D5 handles. If the two ever disagree, D5 is what saves the push.

---

## D5 — The capability rejection is retried once, through a refresh

**Decision**: On a failed agent write, when the plan carries MCP references and the failure reads as
a capability problem, connect each distinct referenced server, re-read each planned reference's
`schema_hash`, and retry the write **once**.

**Rationale**: the operator reports the platform flags this rejection retryable and that it
self-heals. A refresh is precisely the thing that heals it, and the CLI can perform one without
asking. A push that fails for a condition the CLI could have cleared in one request is a bad push.

**Detection, and its ceiling**: `must()` discards the response envelope and throws
`formatAgentsError`'s string — which *does* append the machine-readable code, so a match on the
thrown message reads the code without restructuring the call path. Match the named code **or** a
capability-shaped message, so a renamed code degrades to the current behaviour rather than to silence.
Worth a `ponytail:` comment naming the upgrade path: thread the raw `AgentsResult` through if a second
capability error code ever appears.

**Not reproduced live, deliberately.** Inducing the rejection means writing an agent with a stale or
wrong hash into a production organisation. The design does not depend on being right: if the code
never matches, the operator still receives the platform's own error plus the `mcp run` remedy, which
is strictly better than today. Confirming the code string is a task, not a blocker.

**Alternatives considered**: refreshing every referenced server on every push before writing
(rejected — an outbound call to a third-party server on every push, to fix a case that mostly does not
arise); retrying in a loop with backoff (rejected — if one refresh does not fix it, the problem is not
staleness).

---

## D6 — `mcp_refs: []` is the data-loss bug hiding behind the blocker

**Decision**: `buildAgentBody` must emit the planned references, and MCP detachments must be warned
about by name.

**Evidence**: `cli/src/commands/push.ts:679-683` destructures `mcp_refs` out of the package and
writes back a literal `mcp_refs: []` on every agent write. That is currently harmless *only* because
the blocker makes the code path unreachable for any package that has references — but the write is a
`PUT`, replace not merge, so it applies to an agent whose MCP servers were attached in the dashboard
too. The moment FR-001 removes the blocker, the first update push of such an agent silently deletes
every MCP attachment it has.

Agent `mymcptest` in the reporting operator's own organisation is exactly this shape.

**Consequence**: this is why FR-006, FR-008 and SC-007 exist, and why Step 5 of the plan is a separate
step rather than a line inside Step 3. Replace semantics are kept — they are what spec 003 chose and
what `tool_refs` does — but a lossy replace has to be announced first, which is what the existing
`WILL BE DETACHED` block is for.

---

## D7 — Two blockers, not one, because the remedies differ

**Decision**: `mcp_unsupported` is replaced by `mcp_unresolved` and `mcp_stale`.

**Rationale**: `renderBlockers` prints one `detail` and one `url` per kind. An unresolved reference is
fixed by renaming it or creating the server, and points at the dashboard. A stale snapshot is fixed by
`voiceai mcp run <name>`, and points at nothing. Folding both into one kind means one of the two
groups gets the wrong instruction, which is the failure mode this whole feature exists to remove.

Three conditions collapse into `mcp_unresolved` because they share a remedy — no server of that name,
more than one server of that name, and a tool name absent from the snapshot — each naming the specific
reference at fault (SC-005).

**Truncation is a wording rule, not a fourth blocker**: when the snapshot's `truncated` flag is set,
the tool list is knowingly incomplete, so a missing tool name must be reported as "not in the last
snapshot, which was truncated" rather than as "this server does not have that tool". `mcp tools`
already warns on `truncated`; the blocker inherits the same honesty.

---

## D8 — `tool run` inherits the publish gate's execution, and its consent

**Decision**: `tool run <tool-name>` performs the same tool execution `push --run-samples` already
performs, and requires explicit per-invocation consent.

**Rationale**: `syncTool` already sends `{ sample_input, confirm_side_effects: true }` and treats
anything but `succeeded` as fatal, with `confirm_side_effects` supplied *only* because the operator
passed `--run-samples` — the flag is the consent. `tool run` executes the operator's real
dependencies just as surely, so it carries the same gate. Inventing a softer rule for the
lower-ceremony command would be the wrong asymmetry.

**Input from stdin as well as a file** is Principle III, not a nicety: a validation command that
cannot sit in a pipeline is half a command.

**Alternatives considered**: prompting interactively for consent (rejected — Principle III: every
command must work non-interactively, and a prompt is unanswerable in CI); defaulting consent to true
because the operator typed `run` (rejected — `push` sets the precedent that executing real
dependencies is opted into explicitly, and quietly diverging from it is how someone's webhook fires
in a demo).

---

## Summary of what changes, per open question

| Question | Answer | Source |
|---|---|---|
| Where does `observed_schema_hash` come from? | `capabilities.tools[].schema_hash` on the server detail | D1 *(live)* |
| Does anything need to connect to compute it? | No | D1 |
| How is the server named in a package? | By name, key `server` (alias `server_name`) | D2 |
| What refreshes a stale snapshot? | `POST …/mcp-servers/{id}/connect` | D3 *(live)* |
| How long is the freshness window? | ≈ 4m18s observed; read `next_refresh_at`, never hard-code | D3, D4 *(live)* |
| Can the CLI invoke one MCP tool? | No such operation exists | D3 *(live)* |
| What happens on a capability rejection? | Refresh the servers, retry once | D5 |
| What breaks if the blocker is simply deleted? | Dashboard-made MCP attachments are silently wiped | D6 |
| How many blocker kinds? | Two — `mcp_unresolved`, `mcp_stale` | D7 |
| Does `tool run` need consent? | Yes, the same explicit consent `--run-samples` is | D8 |
