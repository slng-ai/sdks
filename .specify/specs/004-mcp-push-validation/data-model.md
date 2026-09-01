# Data Model: Push agents with MCP references, and validate before publishing

**Date**: 2026-09-01 | **Spec**: [spec.md](./spec.md) | **Research**: [research.md](./research.md)

Field shapes below marked *(live)* were read from the production agents API on 2026-09-01. Nothing
here is generated: these routes are mounted `include_in_schema=False`, so the shapes are hand-written
in the CLI exactly as `ToolListItem` and `McpServerListItem` already are.

---

## 1. Package input — `PackageMcpRef`

One entry of `agent.json`'s `mcp_refs`, as an unmute-compiled package writes it. Names where the
platform wants identifiers; resolving them is push's job.

```ts
export interface PackageMcpRef {
  /** MCP server NAME. `server_name` accepted as an alias (research D2). */
  server?: string;
  server_name?: string;
  /** Tool name as the server exposes it. */
  tool_name: string;
  // description / invocation / system / execution_policy / argument_overrides
  // appear on richer packages. Preserved verbatim, so carried in the index
  // signature rather than typed — same choice PackageToolRef already makes.
  [k: string]: unknown;
}
```

| Field | Required | Rule |
|---|---|---|
| `server` \| `server_name` | yes | Exactly one must be a non-empty string. Neither → `mcp_unresolved`, naming the keys the reference *did* carry. |
| `tool_name` | yes | Non-empty string. Must appear in the resolved server's capability snapshot. |
| everything else | no | Carried through untouched into the attachment. |

`CompiledAgent.mcp_refs` changes from `unknown[]` to `PackageMcpRef[]`.

---

## 2. Platform read — capability snapshot

`GET /v1/agents/mcp-servers/{id}` *(live)*. The fields this feature reads; the record carries more,
and `printServer` already walks it generically.

| Field | Type | Used for |
|---|---|---|
| `id` | uuid | The attachment's `server_id`. |
| `name` | string | Matching the package's `server`. Exact, case-sensitive. |
| `capability_status` | `"healthy"` \| error state \| null | Staleness test (D4). |
| `capability_observed_at` | ISO-8601 \| null | Null means never probed — a *different* message from stale. |
| `next_refresh_at` | ISO-8601 \| null | Staleness threshold. In the past → stale. |
| `capabilities.tools[]` | array | Tool lookup by `name`. |
| `capabilities.tools[].name` | string | Matched against the reference's `tool_name`. |
| `capabilities.tools[].schema_hash` | 64 hex chars | **Copied verbatim into `observed_schema_hash`.** |
| `capabilities.truncated` | bool \| null | When true, a missing tool name is reported as "not in the last snapshot, which was truncated" (D7). |

Already modelled in `cli/src/commands/mcp.ts` as `McpServerDetail` / `McpCapabilities` / `McpTool`.
`McpServerDetail` gains no new typed field — `next_refresh_at` arrives through its
`Record<string, unknown>` tail and is read with a narrowing accessor.

### Staleness

```
stale  ⇔  capability_status !== "healthy"
       ∨  capability_observed_at == null
       ∨  next_refresh_at != null ∧ next_refresh_at < now
```

Warning threshold only, never a refusal on its own — the platform's response to the write is
authoritative (D4, D5).

---

## 3. Plan — `PlannedMcpRef`

Added to `PushPlan`. Mirrors `PlannedRef` field for field where the concepts correspond.

```ts
export interface PlannedMcpRef {
  /** Server name, for display and messages. */
  server: string;
  serverId: string;
  toolName: string;
  /** Copied from the snapshot. Refreshed in place if the retry path fires. */
  schemaHash: string;
  attachmentId: string;
  reused: boolean;
  /** Everything unmute wrote alongside the names, preserved verbatim. */
  carried: Record<string, unknown>;
}
```

`PushPlan` gains:

| Field | Type | Note |
|---|---|---|
| `mcpRefs` | `PlannedMcpRef[]` | Empty for a package with no MCP references. |
| `mcpRemovals` | `{ attachment_id, server_id, tool_name }[]` | Live attachments this push would detach. **Separate from `removals`**, which is typed around `tool_id`; widening it would change a `--json` shape scripts pin. |

### Attachment identity

| Case | `attachmentId` | `reused` |
|---|---|---|
| Live agent already has an attachment for this `(server_id, tool_name)` | that attachment's id | `true` |
| Anything else | freshly minted locally, via the same `mintId` seam `PlannedRef` uses | `false` |

Keyed on `(server_id, tool_name)` — the pair that identifies one MCP tool on one agent — mirroring
`PlannedRef`'s keying on `tool_id`. The `mintId` injection point already exists in `PlanInputs`, so
tests stay deterministic without new machinery.

---

## 4. Platform write — MCP attachment

What `buildAgentBody` emits per planned reference, matching the shape a live agent stores *(live)*:

```json
{
  "attachment_id": "4bff2987-e8ce-473e-b2f2-9428e56dcd6f",
  "server_id": "dc517114-1e63-4bc5-b4ad-d2a6c67754f3",
  "tool_name": "firecrawl_map",
  "observed_schema_hash": "6757acb2bac6db6cfcbe046458828ee12eb3ce3c67957643e1899b9f020a08b4",
  "invocation": "model",
  "description": "…",
  "system": null,
  "execution_policy": null,
  "argument_overrides": {}
}
```

The last five are carried from the package. Note the key is **`server_id`**, not `mcp_server_id`.

`buildAgentBody`'s hardcoded `mcp_refs: []` is removed. It becomes
`mcp_refs: plan.mcpRefs.map(…)` — which is `[]` when the package declares none, preserving today's
behaviour for the common case while making a declared reference actually reach the platform (D6).

---

## 5. Blockers

`BlockerKind` loses `mcp_unsupported` and gains two.

| Kind | Fires when | Item text names | Remedy in `detail` | `url` |
|---|---|---|---|---|
| `mcp_unresolved` | no server of that name; more than one server of that name; `tool_name` absent from the snapshot; neither `server` nor `server_name` present | the reference at fault, and for a missing tool, what the snapshot *does* contain | rename the reference, or create the server | MCP dashboard |
| `mcp_stale` | snapshot stale per §2 for a server the package references | the server, its status, and when it was last observed | `voiceai mcp run <name>` | — |

`KIND_TITLE` gains `mcp_unresolved: "unresolved MCP reference"` and
`mcp_stale: "MCP capability snapshot is stale"`, and loses `mcp_unsupported`.

Blockers still accumulate in one pass — an unresolved MCP reference and a missing vault entry are
reported together, never one at a time.

---

## 6. `--json` additions

New keys only. No existing key changes shape (plan.md, Risks).

**`planJson`** gains, in the same snake_case style as the rest of the document:

```json
"mcp_refs": [
  { "server": "firecrawl-mcp-2", "server_id": "dc51…", "tool_name": "firecrawl_map",
    "observed_schema_hash": "6757…", "attachment_id": "4bff…", "reused": true }
],
"mcp_removals": [
  { "attachment_id": "5a36…", "server_id": "dc51…", "tool_name": "firecrawl_search" }
]
```

Carried fields are spread in alongside, exactly as `refs` already spreads `r.carried`.

---

## 7. `mcp run` — connection result

`POST /v1/agents/mcp-servers/{id}/connect`, no body *(live)*.

| Field | Type | Shown as |
|---|---|---|
| `status` | `"connected"` \| error state | success / failure |
| `latency_ms` | number | how long the server took to answer |
| `server_info.name`, `.version` | string | what the server calls itself |
| `protocol_version` | string | MCP protocol the server speaks |
| `capabilities.tools[]` | array | tool count, and the added/removed diff |

Derived, computed in the CLI against the snapshot read immediately before the connect:

| Field | Meaning |
|---|---|
| `added` | tool names present now, absent from the previous snapshot |
| `removed` | tool names in the previous snapshot, absent now |

A server that has never been probed has no previous snapshot: every tool is reported as `added`, and
the human output says the server had not been probed before rather than implying 26 new tools.

---

## 8. `tool run` — run result

`POST /v1/agents/tools/{id}/run`, body `{ sample_input, confirm_side_effects: true }`. Already
modelled as `RunResult` in `push.ts`; move it somewhere both callers can import rather than
duplicating the interface.

| Field | Type | Note |
|---|---|---|
| `status` | `"succeeded"` \| `"failed"` \| `"timed_out"` | Exit `0` only on `succeeded`. |
| `error` | string \| null | Platform's detail. Multi-line for a code tool (a Python traceback) — indent it, as `renderPartial` already does. |
| `validation` | string | Named-field detail when the input fails the tool's `arg_schema`. |

`sample_input` is the operator's input document: `--input <file>`, `--input -`, or stdin when stdin is
not a TTY; `{}` when none is supplied.

---

## 9. Entity relationships

```
agent.json (package)
  └── mcp_refs[]  PackageMcpRef { server: NAME, tool_name: NAME, …carried }
                        │
                        │  resolve  (buildPlan, pure)
                        ▼
          McpServerDetail            ← GET /v1/agents/mcp-servers?name=…  then  /{id}
            ├── id                   ──────────────────┐
            ├── next_refresh_at      → staleness       │
            └── capabilities.tools[]                   │
                  ├── name           → matched         │
                  └── schema_hash    ────────┐         │
                        │                    │         │
                        ▼                    ▼         ▼
              PlannedMcpRef { serverId, toolName, schemaHash, attachmentId, reused, carried }
                        │
                        │  buildAgentBody
                        ▼
              agent.mcp_refs[] { attachment_id, server_id, tool_name, observed_schema_hash, …carried }
```

The live agent's existing `mcp_refs` feed back into the plan twice: as the source of reused
`attachment_id`s, and as the source of `mcpRemovals`.
