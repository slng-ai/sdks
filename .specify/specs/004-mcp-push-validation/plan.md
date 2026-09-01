# Implementation Plan: Push agents with MCP references, and validate before publishing

**Branch**: `004-mcp-push-validation` | **Date**: 2026-09-01 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `.specify/specs/004-mcp-push-validation/spec.md`

## Summary

Spec 003 refused every package carrying `mcp_refs` on the strength of [D8](../003-agent-package-push/research.md),
which concluded that `observed_schema_hash` could only be produced by opening an MCP session. D8 was
half right: the hash *is* a sha256 over the server's own `tools/list` response — and the platform
already computes it, caches it, and serves it as `capabilities.tools[].schema_hash` on the MCP server
detail route. A live agent's stored `observed_schema_hash` is byte-identical to it (verified). No
protocol client is needed; a name lookup and a copy are.

So the change is small and lands in three files:

1. **`push.ts`** — delete the `mcp_unsupported` blocker; resolve each `mcp_ref`'s server name to an
   id and its tool name to a cached `schema_hash`; mint the attachment id locally; stop sending the
   hardcoded `mcp_refs: []` that would otherwise wipe dashboard-made attachments; retry once through
   a capability refresh when the platform reports capabilities unavailable.
2. **`mcp.ts`** — add `mcp run <server-name>`, a live connect that reports the outcome and, as a side
   effect, leaves the platform's snapshot freshly observed. Export the server-loading helpers so the
   planner can reuse them instead of growing its own.
3. **`tool.ts`** — add `tool run <tool-name>`, a thin wrapper over the same execution `push
   --run-samples` already performs, with the same explicit consent requirement.

## Technical Context

**Language/Version**: TypeScript, run on Bun `>=1.2.0`; published binary targets Node `>=18` for its shim only.

**Primary Dependencies**: `commander` (argument parsing), `ora` (stderr spinner). No new dependency.

**Storage**: None. Credentials resolve through the existing profile store / `VOICEAI_API_KEY`.

**Testing**: `bun test cli/`. Two established patterns, both in `cli/src/commands/tool.test.ts` —
unit (stub `globalThis.fetch`, call exported helpers) and action-level (`Bun.serve({port:0})` stub +
`Bun.spawn` the real CLI with `VOICEAI_AGENTS_BASE_URL` pointed at it, the only way to assert exit
codes and the stdout/stderr split).

**Target Platform**: `darwin-arm64`, `darwin-x64`, `linux-arm64`, `linux-x64`.

**Project Type**: CLI (single project, `cli/`).

**Performance Goals**: A push with no MCP references issues exactly the requests it issues today. A
push with MCP references adds one list request plus one detail request per distinct server referenced
(typically one server).

**Constraints**: The MCP and tool shared-resource routes are mounted `include_in_schema=False`, so
they are absent from the vendored OpenAPI document and from the generated SDK. They must be called
through the raw-fetch helper in `cli/src/lib/agents.ts`, exactly as `agents`, `tool`, `secret` and
`mcp` already do.

**Scale/Scope**: ~3 source files, ~3 test files, 2 docs touch-ups. No schema, generator or spec change.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design — still passing, no new
violations introduced by the design.*

| Principle | Assessment |
|---|---|
| **I. Specs Are Upstream** | PASS. Nothing under `specs/` is touched. The routes this feature uses are deliberately absent from the OpenAPI document and are reached by raw fetch, which is the documented path for them. |
| **II. Generated Code Is Never Hand-Edited** | PASS. No `*.generated.ts`, no `streaming/*/messages.*`, no `sdks/`. No `regen` needed. |
| **III. The CLI Is a Pipe** | PASS, and actively served. Both new commands are non-interactive; `tool run` reads its input from a file **or stdin** (FR-021) so it composes; results go to stdout, spinners/notes/errors to stderr; `--json` keeps stdout a single valid document on success and on failure. No audio device, no TUI-only path. |
| **IV. Releases Are Tag-Driven** | N/A to this change. No version bump here; that happens at release time. |
| **V. Credentials Live in the Environment** | PASS. MCP server auth continues to be reported by vault entry **name** only — the connect response carries `server_info` and `protocol_version`, never credentials. `tool run` echoes the platform's status and error text, and must not print the input document back when it may carry a secret. |
| **Development Workflow — parsing changes land with a test** | PASS by construction. Two new subcommands and new `push` plan output; every one is covered in [contracts/cli-commands.md](./contracts/cli-commands.md) and has a named test in the plan below. |

No violations. **Complexity Tracking section omitted — nothing to justify.**

One inherited obligation, not a violation: spec 003's `tasks.md` T012 and T022 asserted the very
behaviour FR-001 removes. Those tests are **inverted, not deleted** — the package that used to yield
three blockers now yields two, and the test that asserted MCP refusal becomes the test that asserts
MCP resolution.

## Project Structure

### Documentation (this feature)

```text
.specify/specs/004-mcp-push-validation/
├── plan.md              # This file
├── spec.md              # /speckit-specify output
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── cli-commands.md  # Phase 1 output
├── checklists/
│   └── requirements.md
└── tasks.md             # /speckit-tasks output — NOT created by this command
```

### Source Code (repository root)

```text
cli/
├── src/
│   ├── commands/
│   │   ├── push.ts        # MODIFIED — blocker removed, MCP resolution, retry, render, --json
│   │   ├── push.test.ts   # MODIFIED — two inverted tests, ~8 new
│   │   ├── mcp.ts         # MODIFIED — `run` subcommand; export loadServers/serverDetail
│   │   ├── mcp.test.ts    # MODIFIED — `mcp run` unit + action-level
│   │   ├── tool.ts        # MODIFIED — `run` subcommand
│   │   └── tool.test.ts   # MODIFIED — `tool run` unit + action-level
│   ├── lib/
│   │   ├── package.ts     # MODIFIED — type PackageMcpRef; mcp_refs stops being unknown[]
│   │   └── agents.ts      # UNCHANGED — agentsRequest/formatAgentsError used as-is
│   ├── commands/agents.ts # MODIFIED — push help text drops "MCP is unsupported"
│   ├── flags.ts           # MODIFIED — root epilogue gains two examples
│   └── README.md ->
└── README.md              # MODIFIED — line 315 currently states packages with mcp_refs are refused
```

**Structure Decision**: Single project, existing layout, no new directories. Every change lands in
`cli/src/commands/` beside the code it extends. The one piece of shared plumbing — loading an MCP
server's detail by name — is exported from `cli/src/commands/mcp.ts` rather than promoted to
`cli/src/lib/`, because `push.ts` already imports `listAllTools` from `cli/src/commands/tool.ts` the
same way. Following the existing seam beats inventing a new one for a second caller.

## Implementation Outline

Ordered so each step is independently testable. Detail and rationale in
[research.md](./research.md); exact I/O in [contracts/cli-commands.md](./contracts/cli-commands.md).

### Step 1 — Make MCP servers loadable without exiting (`mcp.ts`)

`resolveServer()` is private and calls `fail()`, which is `process.exit`. A planner cannot use it.
Extract `loadServers(names: string[]): Promise<McpServerDetail[]>` — list-by-name, then detail per
match, returning what it found and letting the caller decide what an empty result means. Rewrite the
existing `resolveServer` as a thin exiting wrapper over it, so `mcp get` / `mcp tools` are unchanged.

*Test*: existing `mcp.test.ts` cases must still pass untouched.

### Step 2 — Type the package's MCP reference (`package.ts`)

`mcp_refs?: unknown[]` becomes `mcp_refs?: PackageMcpRef[]` — `{ server, tool_name, ...carried }`.
Everything not named is carried verbatim, exactly as `PackageToolRef` already does. Accept
`server_name` as an alias for `server`; a reference carrying neither is a resolution failure that
names the reference rather than a crash.

### Step 3 — Resolve MCP references in the plan (`push.ts`, pure)

`PlanInputs` gains `mcpServers?: McpServerDetail[]`; `PushPlan` gains `mcpRefs: PlannedMcpRef[]` and
`mcpRemovals`. `buildPlan` stays pure — every blocker still decided before anything can change, which
is what FR-009 of spec 003 guarantees and this feature must not weaken.

Replace `mcp_unsupported` with two blockers, because the remedies differ:
`mcp_unresolved` (rename it, or create the server — dashboard) and `mcp_stale` (run
`voiceai mcp run <name>` — CLI).

*Tests*: unit, no network. Resolution, attachment reuse, unknown server, ambiguous server, unknown
tool name, truncated snapshot wording, stale snapshot, removals.

### Step 4 — Read the servers the plan needs (`push.ts`, I/O)

In `planPush`, **only when `pkg.agent.mcp_refs?.length`**, call `loadServers([...distinct names])`.
FR-013 and SC-010: a package without MCP references must issue no additional request.

### Step 5 — Stop wiping MCP attachments (`push.ts`)

`buildAgentBody` currently hardcodes `mcp_refs: []`. With the blocker gone that becomes silent data
loss on the first update of any agent whose MCP servers were attached in the dashboard. Emit the
planned references instead, and surface `mcpRemovals` under the existing `WILL BE DETACHED` heading.

*Test*: an agent with two live MCP attachments and a package declaring one → the second appears in
`mcpRemovals` and is named in the rendered plan.

### Step 6 — Retry through a refresh (`push.ts`)

Wrap the agent write. If it fails, the plan has MCP references, and the failure reads as a capability
problem, connect each distinct referenced server, re-read the fresh `schema_hash` for each planned
reference, and write **once** more. Not a loop.

*Test*: action-level, stub API rejects the first write with the capability error and accepts the
second; assert exactly one connect per server and one retry.

### Step 7 — `mcp run <server-name>` (`mcp.ts`)

Detail before connect (for the added/removed diff), connect, report. See the contract for exact
output.

### Step 8 — `tool run <tool-name>` (`tool.ts`)

Resolve name → id, read input from `--input <file>` or stdin, require explicit consent, execute,
report status, exit non-zero on anything but `succeeded`.

### Step 9 — Documentation

`cli/README.md:315` currently tells operators that packages carrying `mcp_refs` are refused — it must
now describe the resolution and name `mcp run` as the staleness remedy. `agents.ts` push help text and
the `flags.ts` root epilogue gain the two new commands.

## Risks

| Risk | Mitigation |
|---|---|
| The package's key for the server name is `server` on the strength of spec 003's own test fixture, not of an unmute package we have read. | Accept `server_name` as an alias (Step 2), and make a reference carrying neither fail as an unresolved reference that prints the keys it did find. Cheap, and turns a crash into a message. |
| The exact error code for a stale snapshot is `MCP_CAPABILITY_UNAVAILABLE` on the reporting operator's word; it was not reproduced live, because doing so means writing an agent to a production organisation. | Step 6 matches the code **or** a capability-shaped message, retries once, and is harmless if it never fires — the operator still gets the platform's own error plus the `mcp run` remedy. Verifying the code is a task in `tasks.md`, not a blocker for the design. |
| `next_refresh_at` is when the platform intends to refresh, which is a proxy for — not a definition of — when a snapshot stops being acceptable. | Used as a warning threshold only. The authoritative answer stays the platform's response, which Step 6 handles. Better than hard-coding five minutes. |
| Widening the `--json` plan document could break a script pinning it. | MCP data lands under **new** keys (`mcp_refs`, `mcp_removals`); no existing key changes shape. |
