# Implementation Plan: Push an agent package

**Branch**: `feat/voice-cli-agent-push-767044` | **Date**: 2026-08-27 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `.specify/specs/003-agent-package-push/spec.md`

## Summary

`voiceai agents push <dir>` reads an unmute-compiled package, resolves every name it carries into the
identifiers the platform requires, and creates or replaces the agent — reporting everything the
organisation is missing *before* it changes anything.

The approach is two hard-separated phases. **Plan** is pure and read-only: it reads the package,
reads the org's tool catalogue, vault and (when updating) the live agent, and produces a `PushPlan`
plus a list of `Blocker`s. **Apply** takes a blocker-free plan and executes it in a fixed order —
tools first (create/update → introspect → run → publish), then the agent, then the version label.
`--dry-run` runs Plan and prints it. Every blocker check lives in Plan, so FR-009's "changed nothing"
guarantee is structural rather than a discipline.

Research turned up one blocker that reshapes US3: unmute emits no tool samples, and `code` and
`api_request` tools cannot publish without a successful run ([research D7](./research.md#d7--unmute-ships-no-samples-what-does-that-do-to-us3)).
This plan introduces an operator-supplied `samples/<tool>.json` convention and gates running behind
an explicit `--run-samples` flag, because the platform's `confirm_side_effects` is a consent gate
`push` must not forge ([D6](./research.md#d6--can-push-run-a-tool-sample-unattended)).

## Technical Context

**Language/Version**: TypeScript on Bun ≥1.2.0 (CLI source is run directly, no build step for dev)

**Primary Dependencies**: `commander` (arg parsing), `ora` (stderr spinners), `node:crypto`
(`randomUUID` for attachment ids), `node:fs` — all already in `cli/`. No new dependency.

**Storage**: None. The package holds no identifiers and gains none; every run re-derives state from
the organisation (spec, Out of Scope).

**Testing**: `bun test cli/`. Two existing patterns, both from `cli/src/commands/tool.test.ts`:
unit tests against exported pure helpers with `globalThis.fetch` stubbed, and action-level tests
that `Bun.serve({port: 0})` a stub API and `Bun.spawn` the real CLI with `VOICEAI_AGENTS_BASE_URL`
pointed at it. The second is the only way to assert exit codes and the stdout/stderr split.

**Target Platform**: `darwin-arm64`, `darwin-x64`, `linux-arm64`, `linux-x64`

**Project Type**: CLI subcommand added to an existing monorepo command tree

**Performance Goals**: Not latency-bound. One catalogue read, one vault read, at most one agent read
in Plan; tool writes in Apply are sequential because publish ordering is observable. Tool catalogue
reads reuse `listAllTools(names)` server-side name filtering rather than fetching the whole
catalogue.

**Constraints**:
- Non-interactive end to end (FR-036) — no prompt, no TTY branch. Telephony being out of scope is
  what makes this achievable.
- Result on stdout, progress and diagnostics on stderr (FR-038); `--json` parseable on failure too
  (FR-037).
- No vault value may be printed (FR-040). `redact()` from `secret.ts` is reused at the response
  boundary.
- The API's `confirm_side_effects` consent gate must never be supplied without an explicit operator
  flag ([D6](./research.md#d6--can-push-run-a-tool-sample-unattended)).
- **Two hosts.** Everything this feature does runs against the agents host (`VOICEAI_AGENTS_BASE_URL`,
  default `https://api.agents.slng.ai`) — except the identity probe in `cli/src/lib/verify.ts`, which
  targets `VOICEAI_BASE_URL` (default `https://api.slng.ai`). `push` is the first command to touch
  both. Two consequences, both binding: the organisation id for FR-011 comes from the agents-host
  reads already being made, with the probe only enriching the display name best-effort, so a
  misconfigured `VOICEAI_BASE_URL` cannot fail a push the agents host would have accepted; and the
  test harness must stub **both** hosts, because the three existing command test files stub only the
  agents host and copying one would send every action-level test to the live API.

**Scale/Scope**: One new command file plus a small package-reading module. `tool_refs` is capped at
128 by the platform; vault and catalogue reads are single-request or name-filtered.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate | Status |
|---|---|---|
| **I. Specs Are Upstream** | No file under `specs/` is edited. The routes this feature calls are mounted `include_in_schema=False` and can never reach the vendored document, so hand-written types + the raw-fetch helper in `cli/src/lib/agents.ts` are the sanctioned path — the same one `tool`, `secret` and `trunks` already take. | **PASS** (re-checked post-design) |
| **II. Generated Code Is Never Hand-Edited** | No `*.generated.ts`, no `streaming/` message file, no `sdks/` working copy is touched. `bun run regen` output is unaffected. | **PASS** |
| **III. The CLI Is a Pipe** | No audio device. Fully non-interactive (FR-036). Result on stdout, diagnostics on stderr (FR-038), `--json` for scripts (FR-037), non-zero exit on every failure (FR-039). | **PASS** |
| **IV. Releases Are Tag-Driven** | No release machinery touched; no version bump in this change. | **PASS** (n/a) |
| **V. Credentials Live in the Environment** | Key read through existing `requireApiKey()`. `redact()` applied to every vault record before any renderer sees it. Vault **names** are printed; values never are, and no value is ever fetched. Sample files are operator-authored inputs and are echoed only in failure detail, never merged with secret values. | **PASS** |
| **Dev Workflow — parsing changes land with a test** | This adds a command and its option surface; [quickstart.md](./quickstart.md) defines the assertions and `/speckit-tasks` will emit them as tasks. | **PASS** |

No violations. The Complexity Tracking table below records one addition that is not a violation but
is new surface area, so it is justified in the open rather than buried.

## Project Structure

### Documentation (this feature)

```text
.specify/specs/003-agent-package-push/
├── plan.md              # This file
├── spec.md              # Phase -1 (/speckit-specify)
├── research.md          # Phase 0 — D1..D13, all settled live
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/
│   └── cli-commands.md  # Phase 1 — the public CLI surface
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 (/speckit-tasks — NOT created here)
```

Note the location: this repo's Spec Kit docs live under `.specify/specs/`, because top-level
`specs/` is the vendored read-only OpenAPI mirror (CLAUDE.md, Constitution I).

### Source Code (repository root)

```text
cli/src/
├── commands/
│   ├── agents.ts              # MODIFIED — register `push` on the existing agents command
│   ├── push.ts                # NEW — plan/apply, rendering, the command tree
│   └── push.test.ts           # NEW — unit + action-level tests
├── lib/
│   ├── agents.ts              # UNCHANGED — agentsRequest / formatAgentsError reused as-is
│   ├── package.ts             # NEW — locate and parse a compiled package; pure, no I/O to the API
│   └── config.ts              # UNCHANGED
└── commands/
    ├── tool.ts                # UNCHANGED — listAllTools + pickTool imported by push
    └── secret.ts              # UNCHANGED — listSecrets + redact imported by push
```

**Structure Decision**: `push` lives in its own `commands/push.ts` rather than growing `agents.ts`,
which is already ~470 lines covering six verbs plus two subcommand groups. `agents.ts` gains one
`cmd.addCommand(pushCommand())` line. Package reading is separated into `lib/package.ts` because it
is pure filesystem-and-parse work with no API dependency, which makes the majority of the blocker
logic unit-testable without a stub server.

Three existing exports are imported rather than reimplemented — `listAllTools` and `pickTool` from
`tool.ts` (D10 requires the *same* collision precedence, not a compatible one), and `listSecrets` +
`redact` from `secret.ts`. This is the main reason the diff stays small.

## Phase ordering (Apply)

Fixed, because the platform's own dependencies fix it:

1. **Tools**, one at a time: `POST`/`PATCH` → `introspect` (code only) → `run` (only with
   `--run-samples`) → `publish`. A published `version_number` is what the agent's ref points at
   ([D11](./research.md#d11--where-do-the-identifiers-for-a-reference-come-from)).
2. **Agent**: `POST /v1/agents` or `PUT /v1/agents/{id}` — `PUT`, not `PATCH`, because FR-029 chose
   replace and `PATCH` merges ([D12](./research.md#d12--create-vs-update-transport)).
3. **Version label**: read `GET /v1/agents/{id}/versions`, and label the newest version **only if a
   new one was written** — a no-op push creates none
   ([D9](./research.md#d9--how-is-an-agent-version-labelled)).

Steps 1 and 2 are not atomic and cannot be: a published tool version cannot be unpublished. FR-021
requires reporting what was left behind, which is why Apply accumulates an outcome record per tool
rather than throwing on first failure.

## Complexity Tracking

> Recorded for transparency. Neither is a constitution violation; both are new surface area that a
> reviewer should agree to rather than discover.

| Addition | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| `samples/<tool>.json` convention | Without a sample there is no green run, and without a green run `code` and `api_request` tools cannot publish at all ([D7](./research.md#d7--unmute-ships-no-samples-what-does-that-do-to-us3)). US3 is otherwise unimplementable. | Synthesising a sample from the tool's `input` JSON Schema was rejected: fabricated arguments fired at a live webhook is exactly the harm `confirm_side_effects` exists to prevent. Waiting for unmute to emit samples was rejected as an upstream block; the convention is forward-compatible if it lands. |
| `--run-samples` flag | The platform requires `confirm_side_effects: true` on every run, and a push that supplied it automatically would execute the operator's real webhooks on every deploy ([D6](./research.md#d6--can-push-run-a-tool-sample-unattended)). | Defaulting it on was rejected on consent grounds. Defaulting it off *silently* was rejected because publish would then fail at 409 after mutations — so the absence is raised as a pre-flight blocker instead. |

## Post-design Constitution re-check

Re-evaluated after data-model, contracts and quickstart: **PASS**, unchanged. The design adds no
dependency, no generated file, no audio path, and no interactive branch; it prints vault names and
never values; and it reads the two shapes it needs through the existing raw-fetch helper rather than
through `specs/`.
