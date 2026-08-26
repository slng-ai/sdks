# Implementation Plan: SIP Trunk Listing

**Branch**: `feat/sip-trunks-list-endpoint-35ebd5` | **Date**: 2026-08-26 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `.specify/specs/002-sip-trunk-listing/spec.md`

## Summary

Add a read-only `voiceai trunks` command group with one subcommand, `trunks list`: every SIP trunk the
platform exposes for the caller's organisation, inbound and outbound, with each trunk's phone numbers,
health, usability, and which agent (if any) it is attached to.

Technical approach: there is no organisation-level trunk endpoint on the public API — slng-ai#688
shipped tools, MCP servers, secrets, and client models, not trunks, and the dashboard's trunk routes
are session-gated. The one view a consumer API key can reach is
`GET /v1/agents/{agent_id}/sip-trunk-options`, which returns the *organisation's* trunks annotated for
one agent. So the command reads `GET /v1/agents` once, fans out one trunk read per agent in batches of
8, and merges the reports into one deduplicated set. That fan-out is what recovers inbound trunks
already attached to an agent, which the platform withholds from every other agent's view.

Everything goes through the existing `agentsRequest` helper. **No change to any shared library, no new
dependency, no new environment variable, no generated file touched.** One new command file, one new
test file, one line in `flags.ts`.

Every wire-level unknown was resolved by probing the live API; see [research.md](./research.md).

## Technical Context

**Language/Version**: TypeScript 5.6 on Bun ≥ 1.2 for development, build, and test. The published npm
shim targets Node ≥ 18.

**Primary Dependencies**: `commander` ^14 and `ora` ^9, both already in `cli/package.json`. **No new
dependency is added.** The generated `voiceai-sdk` is deliberately not used (research D6).

**Storage**: N/A — the command is a stateless live read. No cache, no new config key.

**Testing**: `bun test`. New `cli/src/commands/trunks.test.ts`, following both patterns already
established in `cli/src/commands/tool.test.ts` — unit tests against a stubbed `globalThis.fetch` for
the merge logic, and action-level tests that `Bun.spawn` the real CLI against a `Bun.serve({port: 0})`
stub so exit codes and the stdout/stderr split are actually asserted. No network, no credential.

**Target Platform**: The four compiled release targets (`darwin-arm64`, `darwin-x64`, `linux-arm64`,
`linux-x64`) plus the npm shim. Nothing here is platform-specific.

**Project Type**: CLI.

**Performance Goals**: `1 + N` requests for an organisation with `N` agents, issued in concurrent
batches of 8. The probed organisation has 4 agents and 2 trunks — one batch, two round trips total.

**Constraints**:

- The trunk read is reachable only through an agent, so an organisation with zero agents cannot be
  enumerated at all. That is a distinct, named failure (FR-009), not an empty list.
- The platform withholds any trunk that is both unusable and attached to no agent. This ceiling cannot
  be lifted client-side; FR-008 discloses it on stderr instead of hiding it.
- No edits to `specs/`, no `*.generated.ts` touched, no `bun run regen` needed.
- No new external binary.

**Scale/Scope**: 1 subcommand. 2 files added, 1 modified. 4 agents and 2 trunks observed live.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate | Pre-Phase 0 | Post-Phase 1 |
|---|---|---|---|
| I. Specs Are Upstream | No file under `specs/` is modified | PASS | PASS — `sip-trunk-options` is already in the vendored `specs/agents/agents.oas.yaml`; nothing to sync, nothing to hand-add |
| II. Generated Code Is Never Hand-Edited | No `*.generated.ts`, no `streaming/*/messages.*`, no Stainless output touched; no `bun run regen` needed | PASS | PASS — no spec, manifest, or generator change, so `regen` produces no diff |
| III. The CLI Is a Pipe | No audio device; stdout is data only; stderr carries diagnostics; fully non-interactive | PASS | PASS — no audio path at all. `--json`, the stdout/stderr split, and the stderr-only completeness note are contract items asserted in quickstart Scenarios 4, 6, and 7 |
| IV. Releases Are Tag-Driven | No release performed; no version bump in this feature | PASS | PASS — shipping is a separate tagged release |
| V. Credentials Live in the Environment | Key read from the existing resolution; never printed or logged | PASS | PASS — research D9 establishes that no reachable trunk field is a credential; FR-015/FR-016 are covered by an assertion test |
| Toolchain constraints | No new runtime dependency, no new external binary, no change to release targets | PASS | PASS |
| Development Workflow | `bun test` passes; an argument-parsing change lands with a test | PASS | PASS — `cli/src/commands/trunks.test.ts` is required, not optional |

No violations. Complexity Tracking is empty.

### Note on the two pre-existing failures

`CLAUDE.md` records two failures that predate this work and must not be attributed to it:
`streaming/ts/client.test.ts > rejects connect when aborted`, and a stale
`live-models.generated.ts` reported by `bun run sync-models:check`. Neither is touched here; the model
catalogue is refreshed in its own commit, never bundled into a feature.

## Project Structure

### Documentation (this feature)

```text
.specify/specs/002-sip-trunk-listing/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── cli-commands.md  # Phase 1 output — the CLI's public surface
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
cli/
├── src/
│   ├── flags.ts                    # MODIFIED — import + register trunksCommand()
│   ├── commands/
│   │   ├── trunks.ts               # ADDED — the command group, merge logic, rendering
│   │   ├── trunks.test.ts          # ADDED — unit + action-level tests
│   │   ├── tool.ts                 # unchanged — the pattern this mimics
│   │   └── agents.ts               # unchanged
│   └── lib/
│       └── agents.ts               # unchanged — agentsRequest / formatAgentsError as-is
└── package.json                    # unchanged — no new dependency
```

**Structure Decision**: The monorepo's CLI package already places one file per command group under
`cli/src/commands/`, with its shared REST client in `cli/src/lib/`. This feature adds exactly one
command-group file and its test beside `tool.ts` / `tool.test.ts`, and registers it in `flags.ts`
where the other nine groups are registered. No new directory, no new layer.

## Implementation Sketch

Everything below lives in `cli/src/commands/trunks.ts` and is exported for unit testing.

**Types** — hand-written to mirror `SipTrunkAssignmentOptionOut`, the way `tool.ts` mirrors
`ToolListItem`. See [data-model.md](./data-model.md) for the full field list and the merge rules.

**Gather** (`collectTrunks`): `GET /v1/agents` → if the array is empty, throw the distinct
no-agents error of FR-009. Otherwise slice the agents into batches of 8 and `Promise.all` each batch
over `GET /v1/agents/{id}/sip-trunk-options`. A 404 on one agent is a delete-during-read race: skip
that agent. Any other failure aborts with `formatAgentsError` rather than returning a partial set
(FR-020).

**Merge** (`mergeReports`): pure function, no I/O, the unit-test surface. Key on
`` `${direction}:${id}` ``. Usable if any report said `selectable`. Reason taken from a
non-selectable report only when no report found it usable. In-use when some report has
`is_current: true`; record that agent's name. Sort by direction then name then id, matching the
server's own ordering.

**Render**: tab-separated `DIRECTION  NAME  NUMBERS  STATUS  USABLE  IN USE BY`, one trunk per line,
numbers comma-joined, `-` for every empty cell. `--json` prints the merged array and nothing else.
The completeness note goes to stderr, and is suppressed under `--json` (FR-008).

Sizing: roughly 150 lines of command file, comparable to `tool.ts`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations. This section is intentionally empty.
