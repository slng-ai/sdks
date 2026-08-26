# Implementation Plan: Tool Catalog Commands

**Branch**: `feat/pecify-integration-setup-648f7b` | **Date**: 2026-08-26 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `.specify/specs/001-tool-catalog-commands/spec.md`

## Summary

Add a read-only `voiceai tool` command group with two subcommands — `tool list` (every tool visible to
the organisation, with its latest version) and `tool get <tool-name>` (one tool's full record). Both
call the public shared-resource endpoints shipped in slng-ai/backend#688, already live in production.

Technical approach: reuse the raw-fetch `agentsRequest` helper that `voiceai agents` already uses,
because these routes are mounted `include_in_schema=False` and therefore never reach the OpenAPI
document or the generated SDK. Two small changes to `cli/src/lib/agents.ts` — repeatable query
parameters, and unwrapping the nested server error object — plus one new command file and its test.
No new dependency, no new environment variable, no generated file touched.

Every wire-level unknown was resolved by probing the live API; see [research.md](./research.md).

## Technical Context

**Language/Version**: TypeScript 5.6 on Bun ≥ 1.2 for development, build, and test. The published npm
shim targets Node ≥ 18.

**Primary Dependencies**: `commander` ^14 and `ora` ^9, both already in `cli/package.json`. **No new
dependency is added.** The generated `voiceai-sdk` is deliberately not used here (see research D1).

**Storage**: N/A — both commands are stateless live reads. No cache, no config keys.

**Testing**: `bun test`. New `cli/src/commands/tool.test.ts` with a stubbed `fetch`, so the suite needs
no network and no credential.

**Target Platform**: The four compiled release targets (`darwin-arm64`, `darwin-x64`, `linux-arm64`,
`linux-x64`) plus the npm shim. Nothing here is platform-specific.

**Project Type**: CLI.

**Performance Goals**: `tool get` is exactly two requests regardless of catalogue size. `tool list` is
one request per 200 tools — a single request for the 17 tools observed in the probed organisation.

**Constraints**: The server caps `limit` at 200 and `offset` at 10,000, so `tool list` has a hard
ceiling of 10,200 tools and must warn rather than truncate silently. No new external binary. No edits
to `specs/` or to any generated file.

**Scale/Scope**: 2 subcommands, 2 files added, 3 modified. 17 tools observed live, 3 of which already
collide by name across sources.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate | Pre-Phase 0 | Post-Phase 1 |
|---|---|---|---|
| I. Specs Are Upstream | No file under `specs/` is modified | PASS | PASS — the routes are `include_in_schema=False`, so there is nothing to sync and nothing to hand-add |
| II. Generated Code Is Never Hand-Edited | No `*.generated.ts`, no `streaming/*/messages.*`, no Stainless output touched; no `bun run regen` needed | PASS | PASS — no spec, manifest, or generator changes, so `regen` produces no diff |
| III. The CLI Is a Pipe | No audio device; stdout is data only; stderr carries diagnostics; fully non-interactive | PASS | PASS — no audio path at all; `--json` and the stdout/stderr split are contract items, asserted in quickstart Scenario 6 |
| IV. Releases Are Tag-Driven | No release performed; no version bump in this feature | PASS | PASS — shipping is a separate tagged release |
| V. Credentials Live in the Environment | Key read from the existing resolution; never printed or logged | PASS | PASS — FR-012 is a contract item; the rejected-credential message is asserted not to contain the key |
| Toolchain constraints | No new runtime dependency, no new external binary, no change to release targets | PASS | PASS |
| Development Workflow | `bun test` passes; argument-parsing change lands with a test | PASS | PASS — `cli/src/commands/tool.test.ts` is required, not optional |

No violations. Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
.specify/specs/001-tool-catalog-commands/
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

Feature docs live under `.specify/specs/` rather than Spec Kit's default `specs/`, because `specs/` is
the vendored gateway-specs copy that Principle I declares read-only. `.specify/feature.json` points
downstream commands at the right directory.

### Source Code (repository root)

```text
cli/
├── src/
│   ├── flags.ts                  # MODIFIED — register `tool`, add two epilogue example lines
│   ├── commands/
│   │   ├── agents.ts             # unchanged — reference implementation for conventions
│   │   ├── tool.ts               # NEW — command group, rendering, exported helpers
│   │   └── tool.test.ts          # NEW — stubbed-fetch tests
│   └── lib/
│       └── agents.ts             # MODIFIED — array query values; unwrap nested error object
└── README.md                     # MODIFIED — document the new command group
```

**Structure Decision**: The feature lives entirely in the existing `cli/` workspace and follows the
layout `voiceai agents` already established: a command file under `cli/src/commands/`, transport in
`cli/src/lib/agents.ts`, registration in `cli/src/flags.ts`.

Deliberately **not** creating `cli/src/lib/tools.ts`. The whole feature is two read-only calls; a
transport module for it would hold a type alias and two thin wrappers. Pagination and name resolution
are exported from `cli/src/commands/tool.ts` so the test can reach them directly. Split it out if a
second consumer appears — a TUI flow, or write operations.

The two changes to `cli/src/lib/agents.ts` are shared infrastructure, not tool-specific: repeatable
query parameters and correct rendering of the platform's nested error envelope both benefit every
existing `agents` subcommand.

## Complexity Tracking

No Constitution Check violations. Nothing to justify.
