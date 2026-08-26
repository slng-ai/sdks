# Implementation Plan: Secret Vault Commands

**Branch**: `feat/vault-secret-cli-commands-9ec618` | **Date**: 2026-08-26 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `.specify/specs/002-secret-vault-commands/spec.md`

## Summary

Add a read-only `voiceai secret` command group with two subcommands — `secret list` (every vault
entry the organisation holds) and `secret get <secret-name>` (one entry by exact name). Both call the
public shared-resource vault endpoints shipped in slng-ai/backend#688, verified live during Phase 0.

Technical approach: reuse the raw-fetch `agentsRequest` helper unchanged, add one command file and
its test, register the group. This feature is materially simpler than the `tool` group it mirrors —
the vault list is unpaginated, entries are addressed by name rather than id, and there is no
curated/organisation tier — so `list` is one request, `get` is one request, and there is no paging
loop, no id lookup, and no collision handling.

The one non-obvious requirement is redaction. The vault holds two kinds, and `kind: "variable"`
entries return **decrypted plaintext** in the `value` field. A `--json` command that echoed the
response verbatim would print a live vault value to stdout. `value` is therefore stripped once at the
response boundary, for both kinds and both output modes. See [research.md](./research.md) D3; spec.md
was amended in Phase 0 to record this.

## Technical Context

**Language/Version**: TypeScript 5.6 on Bun ≥ 1.2 for development, build, and test. The published npm
shim targets Node ≥ 18.

**Primary Dependencies**: `commander` ^14 and `ora` ^9, both already in `cli/package.json`. **No new
dependency is added.** The generated `voiceai-sdk` is deliberately not used (research D1).

**Storage**: N/A — both commands are stateless live reads. No cache, no config keys.

**Testing**: `bun test`. New `cli/src/commands/secret.test.ts` with a stubbed `fetch`, so the suite
needs no network and no credential. Action-level cases use `Bun.serve({port: 0})` plus `Bun.spawn`,
the pattern `tool.test.ts` established, because exit codes and the stdout/stderr split cannot be
asserted any other way.

**Target Platform**: The four compiled release targets (`darwin-arm64`, `darwin-x64`, `linux-arm64`,
`linux-x64`) plus the npm shim. Nothing here is platform-specific.

**Project Type**: CLI.

**Performance Goals**: `secret list` is exactly one request regardless of vault size. `secret get` is
exactly one request — one fewer than `tool get`, which needs an id lookup first.

**Constraints**: No value, of either kind, may reach any output stream (FR-008, constitution
Principle V). No new external binary. No edits to `specs/` or to any generated file.

**Scale/Scope**: 2 subcommands, 2 files added, 2 modified. 3 vault entries observed in the probed
organisation, all `kind: "secret"`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate | Pre-Phase 0 | Post-Phase 1 |
|---|---|---|---|
| I. Specs Are Upstream | No file under `specs/` is modified | PASS | PASS — the vault routes are `include_in_schema=False`, so there is nothing to sync and nothing to hand-add |
| II. Generated Code Is Never Hand-Edited | No `*.generated.ts`, no `streaming/*/messages.*`, no Stainless output touched; no `bun run regen` needed | PASS | PASS — no spec, manifest, or generator changes, so `regen` produces no diff (quickstart, Regeneration check) |
| III. The CLI Is a Pipe | No audio device; stdout is data only; stderr carries diagnostics; fully non-interactive | PASS | PASS — no audio path at all; `--json` and the stdout/stderr split are contract items, asserted in quickstart Scenario 6 |
| IV. Releases Are Tag-Driven | No release performed; no version bump in this feature | PASS | PASS — shipping is a separate tagged release |
| V. Credentials Live in the Environment | Key read from the existing resolution; never printed or logged | PASS | **PASS, and load-bearing** — Phase 0 found that variable-kind entries return plaintext, so this principle is what forces unconditional redaction. FR-008 and SC-005 are contract items with a sentinel assertion (quickstart Scenario 4) |
| Toolchain constraints | No new runtime dependency, no new external binary, no change to release targets | PASS | PASS |
| Development Workflow | `bun test` passes; argument-parsing change lands with a test | PASS | PASS — `cli/src/commands/secret.test.ts` is required, not optional |

No violations. Complexity Tracking is empty.

Principle V deserves the note it gets above: it is the only reason this feature diverges from the
naive reading of the request. Everything else follows the `tool` group verbatim.

## Project Structure

### Documentation (this feature)

```text
.specify/specs/002-secret-vault-commands/
├── plan.md              # This file
├── spec.md              # Feature specification (amended in Phase 0 — research D3)
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
│   ├── flags.ts                  # MODIFIED — register `secret`, add two epilogue example lines
│   ├── commands/
│   │   ├── tool.ts               # unchanged — reference implementation for conventions
│   │   ├── secret.ts             # NEW — command group, redaction, rendering, exported helpers
│   │   └── secret.test.ts        # NEW — stubbed-fetch and action-level tests
│   └── lib/
│       └── agents.ts             # UNCHANGED — see below
└── README.md                     # MODIFIED — document the new command group
```

**Structure Decision**: The feature lives entirely in the existing `cli/` workspace and follows the
layout `voiceai tool` established: a command file under `cli/src/commands/`, transport in
`cli/src/lib/agents.ts`, registration in `cli/src/flags.ts`.

`cli/src/lib/agents.ts` needs **no change at all**. Feature 001 already added repeatable query
parameters, nested-error-envelope unwrapping, and `Retry-After` capture; the probed 401/404/429
bodies for the vault routes use the identical envelope, so `formatAgentsError` already satisfies
FR-014 and FR-015 as written (research D2). This is the payoff for having put those two changes in
the shared helper rather than in `tool.ts`.

Deliberately **not** creating `cli/src/lib/secrets.ts`. The whole feature is two read-only calls with
no pagination and no resolution logic. Redaction and rendering are exported from
`cli/src/commands/secret.ts` so the test can reach them directly, exactly as `tool.ts` exports
`listAllTools` and `pickTool`. Split it out if a second consumer appears — a TUI flow, or write
operations.

Redaction is a single function applied at the response boundary, not a branch inside each renderer.
That is the whole point: no future output path can forget it, and the sentinel test in quickstart
Scenario 4 has one place to aim at.

## Phase 0 outcome

All wire-level unknowns resolved by probing the live API and reading the merged backend source. No
NEEDS CLARIFICATION remains. Seven decisions recorded in [research.md](./research.md):

| | Decision |
|---|---|
| D1 | Raw fetch via `agentsRequest`; the routes are hidden from the OpenAPI document and the SDK |
| D2 | `cli/src/lib/agents.ts` needs no change — 001 already added everything |
| D3 | The vault holds two kinds; `variable` returns plaintext; redact unconditionally |
| D4 | The list is unpaginated and `get` is name-addressed — one request each, no paging loop |
| D5 | Names are exact and case-sensitive; percent-encode into the path; map 404 to the spec's message |
| D6 | No `--source` (no curated tier) and no `references` subcommand (out of scope) |
| D7 | Actor fields are opaque ids, rendered as-is; internal actors are already nulled server-side |

D3 caused a surgical amendment to spec.md — FR-003, FR-008, one Key Entity, one edge case, two
assumptions — so the specification matches what the platform actually does rather than what the
feature request assumed.

## Phase 1 outcome

| Artifact | Contents |
|---|---|
| [data-model.md](./data-model.md) | The 14-field `VaultEntry` shape, the secret/variable kind split, the redaction invariant, derived display values, and what is deliberately not modelled |
| [contracts/cli-commands.md](./contracts/cli-commands.md) | Both command signatures, output shapes, exit codes, the cross-cutting stdout/stderr and redaction rules, the error table, and the consumed wire contract |
| [quickstart.md](./quickstart.md) | Eight runnable validation scenarios covering every user story and every edge case, plus the pre-existing test failures that are not this feature's fault |

## Complexity Tracking

No Constitution Check violations. Nothing to justify.
