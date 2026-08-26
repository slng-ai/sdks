---
description: "Task list for SIP Trunk Listing"
---

# Tasks: SIP Trunk Listing

**Input**: Design documents from `.specify/specs/002-sip-trunk-listing/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/cli-commands.md](./contracts/cli-commands.md), [quickstart.md](./quickstart.md)

**Tests**: Included and **not optional**. The constitution's Development Workflow requires a test for
changes to argument parsing. `cli/src/commands/tool.test.ts` established both patterns this feature
copies — stubbed `fetch` for unit work, `Bun.serve` + `Bun.spawn` for exit codes and stream split.

**Organization**: Grouped by user story so each can be implemented and verified independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1 / US2 / US3, mapping to the user stories in spec.md

## Path Conventions

Everything lives in the existing `cli/` workspace. Paths are repository-relative.

**A note on `[P]` density**: this feature is two files. `cli/src/commands/trunks.ts` carries the whole
implementation and `cli/src/commands/trunks.test.ts` the whole test suite, so genuine parallelism is
rare and marked only where the files really are disjoint. Four tasks carry `[P]`; the rest are
sequential because they edit the same file.

---

## Phase 1: Setup

**Purpose**: Establish a known-good baseline so any later failure is attributable to this feature.

- [X] T001 Run `bun install` at the repository root, then `bun test cli/`, and record that it passes; per [plan.md](./plan.md) the two failures listed in `CLAUDE.md` (`streaming/ts/client.test.ts > rejects connect when aborted` and a stale `cli/src/lib/live-models.generated.ts` from `bun run sync-models:check`) predate this work and MUST NOT be fixed or bundled here

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The command file, its registration, and the test harness. All three user stories depend
on all of it.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T002 Create `cli/src/commands/trunks.ts` exporting `trunksCommand()`: the `trunks` command group with a `list` subcommand stub, the `Direction`, `TrunkOption`, `TrunkOptionsResponse`, `AgentRef`, `Report`, and `Trunk` interfaces from [data-model.md](./data-model.md), and the `row` / `spin` / `fail` helpers mirroring `cli/src/commands/tool.ts`. Import `agentsRequest` and `formatAgentsError` from `cli/src/lib/agents.ts` — per research D6 that file needs **no** change
- [X] T003 [P] Register `trunksCommand()` in `cli/src/flags.ts` beside `toolCommand()`, and add one `ROOT_EPILOGUE` example line (`$ voiceai trunks list — list your organisation's SIP trunks`). Different file from T002; depends only on T002 exporting the symbol
- [X] T004 [P] Create `cli/src/commands/trunks.test.ts` with the harness copied from `cli/src/commands/tool.test.ts`: `process.env.VOICEAI_API_KEY`, the `afterEach` fetch restore, a `runCli()` that spawns `src/index.ts` against `Bun.serve({port: 0})` with `VOICEAI_AGENTS_BASE_URL` pointed at it, a `json()` response helper, and `agent()` / `option()` fixture builders. Different file from T002 and T003

**Checkpoint**: `voiceai trunks --help` renders and `bun test cli/` still passes. All stories can now proceed.

---

## Phase 3: User Story 1 - See every SIP trunk my organisation can use (Priority: P1) 🎯 MVP

**Goal**: `voiceai trunks list` prints every trunk the platform exposes for the organisation — inbound
and outbound, each exactly once — with name, direction, numbers, and status.

**Independent Test**: Run `voiceai trunks list` against the probed organisation and confirm two rows,
one `inbound` (`test2slng`) and one `outbound` (`nicotestslng`), both carrying `+441423803084` with
status `active`, exit 0.

### Tests for User Story 1

> Write these first and confirm they fail.

- [X] T005 [US1] Write failing tests in `cli/src/commands/trunks.test.ts` covering: the fan-out issues exactly `1 + N` requests for N agents; an empty `GET /v1/agents` produces the distinct no-agents failure and exit 1 with no `no trunks found` on stdout (FR-009); a trunk reported by two agents appears exactly once (FR-007); an inbound trunk present only in agent A's response with `is_current: true` and absent from agent B's is still listed (FR-002, research D3/D4); an empty `numbers` array renders `-` and never a blank cell (FR-004); an organisation with one agent and two empty lists prints `no trunks found.` and exits 0 (FR-013)

### Implementation for User Story 1

- [X] T006 [US1] Implement and export `collectTrunks()` in `cli/src/commands/trunks.ts`: `GET /v1/agents` once (a bare unpaginated array per research D5 — send no `limit`/`offset`); throw the FR-009 no-agents error when it is empty; otherwise slice agents into batches of 8 and `Promise.all` each batch over `GET /v1/agents/{id}/sip-trunk-options`; skip an agent whose read returns 404 as a delete-during-fan-out race (research D7); abort via `formatAgentsError` on any other failure rather than returning a partial set (FR-020)
- [X] T007 [US1] Implement and export `mergeReports()` in `cli/src/commands/trunks.ts` as a pure function over `Report[]`: key each trunk on `` `${direction}:${id}` ``, carry `name` / `numbers` / `status` / `livekit_trunk_id` from any report, and sort by direction (inbound first), then name, then id to match the server's own `ORDER BY name, id`. Usability and attachment fields are added in US2 — leave them out here. Depends on T006
- [X] T008 [US1] Implement the `trunks list` action in `cli/src/commands/trunks.ts`: print the `DIRECTION⇥NAME⇥NUMBERS⇥STATUS` header and one tab-separated row per trunk, comma-join `numbers`, render every empty cell as `-` (FR-004), print `no trunks found.` and exit 0 for an empty organisation (FR-013), and write the single completeness note of FR-008 to stderr on every successful run — exact wording in [contracts/cli-commands.md](./contracts/cli-commands.md). Spinner only when `process.stderr.isTTY` (FR-012). Depends on T007
- [X] T009 [US1] Run quickstart Scenarios 1, 2, 4, 7, and 8 from [quickstart.md](./quickstart.md) — Scenarios 1 and 2 against the live API with `VOICEAI_API_KEY` exported from `.env`'s `SLNG_API_KEY` — and confirm T005 now passes

**Checkpoint**: `trunks list` is a working organisation-wide trunk directory and is shippable on its own.

---

## Phase 4: User Story 2 - Tell a usable trunk from a broken one (Priority: P2)

**Goal**: each row states whether the trunk is usable, why not when it is not, and which agent it is
attached to.

**Independent Test**: Against a stub where agent A reports a trunk `selectable: false` with
`different_livekit_project` and agent B reports the same trunk `selectable: true`, confirm one row
showing `USABLE yes` with no reason — the reason was agent-relative.

### Tests for User Story 2

> Write these first and confirm they fail.

- [X] T010 [US2] Write failing tests in `cli/src/commands/trunks.test.ts` covering: a trunk selectable for any agent merges to `usable: true` with `unavailable_reason: null`; a trunk selectable for no agent keeps the first non-null reason; an `unavailable_reason` the CLI has never seen is printed verbatim rather than dropped, blanked, or replaced with "unknown" (FR-005); `is_current: true` in one agent's report sets `in_use_by` to that agent's **name**, not its id, and a trunk attached to nobody renders `-` (FR-006)

### Implementation for User Story 2

- [X] T011 [US2] Extend `mergeReports()` in `cli/src/commands/trunks.ts` with the three agent-relative fields per [data-model.md](./data-model.md) §2: `usable` is true when **any** report has `selectable: true`; `unavailable_reason` is the first non-null reason seen and only when `usable` is false; `in_use_by` is the name of an agent whose report has `is_current: true`, else `null`. Preserve the invariant `usable === true ⟹ unavailable_reason === null`
- [X] T012 [US2] Add the `USABLE` and `IN USE BY` columns to the `trunks list` renderer in `cli/src/commands/trunks.ts`, with the reason-phrasing map from [data-model.md](./data-model.md) §1 (`different_livekit_project`, `inactive`, `not_synced`, `assigned_to_another_agent`) and a verbatim fallback for anything unrecognised. `USABLE` renders `yes` or `no (<reason>)`; `IN USE BY` renders the agent name or `-`. Depends on T011
- [X] T013 [US2] Run quickstart Scenarios 5 and 6 from [quickstart.md](./quickstart.md) and confirm T010 now passes

**Checkpoint**: the list is a diagnostic, not just a directory.

---

## Phase 5: User Story 3 - Filter and script against trunk data (Priority: P3)

**Goal**: `--json` makes stdout a single parseable document on success and failure alike, and
`--direction` narrows the human table.

**Independent Test**: `voiceai trunks list --json | jq -e 'type == "array"'` succeeds, and
`--direction inbound` prints only inbound rows.

### Tests for User Story 3

> Write these first and confirm they fail.

- [X] T014 [US3] Write failing tests in `cli/src/commands/trunks.test.ts` covering: `--json` emits a parseable array whose elements carry all nine `Trunk` fields; an empty organisation emits `[]` rather than `null` or an object; a failed run under `--json` still leaves stdout parseable (FR-011); the FR-008 completeness note never appears on stdout and is suppressed entirely under `--json`; `--direction inbound` and `--direction outbound` each filter correctly (FR-010); an invalid `--direction` exits non-zero naming the valid values; a non-TTY run emits no spinner control characters to stdout (FR-012)

### Implementation for User Story 3

- [X] T015 [US3] Add `--json` to `trunks list` in `cli/src/commands/trunks.ts`: print the merged `Trunk[]` with 2-space indent and nothing else, `[]` for an empty organisation, the platform's JSON error body (or a synthesized `{ok: false, error}`) on failure, and suppress the FR-008 stderr note whenever `--json` is set
- [X] T016 [US3] Add `--direction <direction>` to `trunks list` in `cli/src/commands/trunks.ts` using commander's `new Option(...).choices(["inbound", "outbound"])`, mirroring `--source` on `tool list`, filtering the merged set client-side after `mergeReports()`. Depends on T015 so both options land on the same action
- [X] T017 [US3] Run quickstart Scenario 3 and the Option validation block from [quickstart.md](./quickstart.md) and confirm T014 now passes

**Checkpoint**: the command is scriptable and all three stories are complete.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T018 [P] Write the `addHelpText("afterAll", …)` block for the group and subcommand in `cli/src/commands/trunks.ts` per FR-019 and [contracts/cli-commands.md](./contracts/cli-commands.md): `COMMANDS`, `EXAMPLES`, and a `NOTES` block stating that inbound and outbound trunks are distinct objects, that the listing is assembled by reading through the organisation's agents, and what the platform withholds
- [X] T019 [P] Add a `trunks` section to `cli/README.md` beside the existing `tool` section (around line 281), with the four worked examples from [contracts/cli-commands.md](./contracts/cli-commands.md). Different file from every other task in this phase
- [X] T020 Add the credential-safety test of quickstart Scenario 10 to `cli/src/commands/trunks.test.ts`: assert that combined stdout and stderr contain zero occurrences of the API key across a success run, a failure run, and both under `--json` (FR-015, FR-016)
- [X] T021 Add the failure-mode tests of quickstart Scenario 9 to `cli/src/commands/trunks.test.ts`: a 401 `AUTH_REQUIRED` reports a rejected credential and includes the request id; a 429 with `Retry-After: 30` reports the 30-second wait; a 500 partway through the fan-out exits 1 with no partial table on stdout (FR-017, FR-018, FR-020)
- [X] T022 Run `bun test cli/` and confirm all green, then re-confirm against T001's baseline that neither pre-existing failure recorded in `CLAUDE.md` is newly attributed to this feature
- [ ] T023 Open an issue on `slng-ai/backend` requesting an organisation-level SIP trunk resource on the public `/v1/agents` surface, citing research D1 and D3: the current agent-scoped view withholds any trunk that is both unusable and attached to no agent, and exposes none of `provider`, `setup_mode`, `address`, `transport`, or `sip_domain`. This is the follow-up the spec's Q2 answer commits to; it is tracking work, not code

---

## Dependencies

```text
T001  Setup
  └─ T002  trunks.ts skeleton + types
       ├─ T003 [P]  register in flags.ts
       └─ T004 [P]  test harness
            └─ Phase 3 (US1)  T005 → T006 → T007 → T008 → T009      ← MVP, shippable here
                 └─ Phase 4 (US2)  T010 → T011 → T012 → T013
                      └─ Phase 5 (US3)  T014 → T015 → T016 → T017
                           └─ Phase 6  T018 [P] ‖ T019 [P] ‖ (T020 → T021) → T022 → T023
```

**Story independence**: US1 ships alone. US2 and US3 both extend the same action in `trunks.ts`, so
they are sequential against each other even though the spec treats them as separable increments — a
file-level constraint, not a logical one.

## Parallel Opportunities

Only four tasks are genuinely parallel, because the feature is two files:

- **T003 ‖ T004** — `cli/src/flags.ts` and `cli/src/commands/trunks.test.ts` are disjoint, and both
  need only the symbols T002 exports.
- **T018 ‖ T019** — help text lives in `cli/src/commands/trunks.ts`, the README section in
  `cli/README.md`.

T020 and T021 both append to `trunks.test.ts` and must be sequential. Everything in Phases 3–5 edits
`trunks.ts` in order.

## Implementation Strategy

**MVP = Phase 1 + Phase 2 + Phase 3 (T001–T009).** That delivers `voiceai trunks list` printing every
trunk the platform exposes for the organisation, deduplicated, with the completeness note — the whole
of the original ask. Nine tasks.

**Increment 2 = Phase 4 (T010–T013).** Turns the directory into a diagnostic. This is where the
feature starts answering "why won't my agent take calls?".

**Increment 3 = Phase 5 (T014–T017).** Scripting surface, matching every other `voiceai` subcommand.

**Increment 4 = Phase 6 (T018–T023).** Help text, README, the two cross-cutting test groups, and the
backend follow-up.

Each increment leaves `bun test cli/` green and the command usable, so any of the four is a legitimate
stopping point for a release.
