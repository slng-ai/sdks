---
description: "Task list for Tool Catalog Commands"
---

# Tasks: Tool Catalog Commands

**Input**: Design documents from `.specify/specs/001-tool-catalog-commands/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/cli-commands.md](./contracts/cli-commands.md), [quickstart.md](./quickstart.md)

**Tests**: Included and **not optional**. The constitution's Development Workflow requires a test for
changes to argument parsing. `cli/` has no tests today, so this feature establishes the pattern.

**Organization**: Grouped by user story so each can be implemented and verified independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1 / US2 / US3, mapping to the user stories in spec.md

## Path Conventions

Everything lives in the existing `cli/` workspace. Paths are repository-relative.

---

## Phase 1: Setup

**Purpose**: Establish a known-good baseline before touching anything.

- [X] T001 Run `bun install` at the repository root and confirm `bun test` passes unchanged, so any later failure is attributable to this feature

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared transport and command scaffolding. Both P1 stories depend on all of it.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T002 Widen `AgentsRequestOptions.query` to accept `string | number | string[] | undefined` and use `searchParams.append` for array values (keeping `set` for scalars) in `cli/src/lib/agents.ts`, per research D3
- [X] T003 In `cli/src/lib/agents.ts`, per research D7: (a) add `retryAfter?: string` to `AgentsResult` and populate it from the `Retry-After` response header in `agentsRequest` — the helper discards headers today, so the spec's 429 wait-time promise is otherwise unbuildable; (b) extend `formatAgentsError` to unwrap a nested error object (`error.message`, `error.code`, `error.request_id`) before falling back to current behaviour, to append the wait when `retryAfter` is set, and to state that retrying will not help when the code is `PUBLIC_SHARED_RESOURCES_DISABLED`. Same file as T002, so run it after
- [X] T004 [P] Create `cli/src/commands/tool.ts` with the `tool` command group, the `ToolListItem` and `ToolDetail` interfaces from data-model.md, the `send`/`row` helpers mirroring `cli/src/commands/agents.ts`, and `addHelpText` documenting `--source` and that names match exactly and case-sensitively (FR-015)
- [X] T005 Register `toolCommand()` in `cli/src/flags.ts` and add two `ROOT_EPILOGUE` example lines (`voiceai tool list`, `voiceai tool get <name>`). Depends on T004

**Checkpoint**: `voiceai tool --help` renders. Both stories can now proceed.

---

## Phase 3: User Story 1 - See every tool with its version (Priority: P1) 🎯 MVP

**Goal**: `voiceai tool list` prints every tool visible to the organisation — curated and org — with
name, type, source, and latest version, paging until the catalogue is exhausted.

**Independent Test**: Run `voiceai tool list` against the probed organisation and confirm 17 rows
(13 curated, 4 org), with `-` in the version column for the 7 unpublished tools.

### Tests for User Story 1

> Write these first and confirm they fail.

- [X] T006 [US1] Write failing tests in `cli/src/commands/tool.test.ts` with a stubbed `fetch`, covering: multi-page assembly (a full 200-row page followed by a short page yields all rows and issues exactly two requests), `latest_version: null` rendering as `-` and never `0`, `--source` filtering both ways, and the empty-result path exiting `0`

### Implementation for User Story 1

- [X] T007 [US1] Implement and export `listAllTools()` in `cli/src/commands/tool.ts`: page `GET /v1/agents/tools` with `limit=200`, stepping `offset` by 200 until a short page returns, stopping at `offset=10000` with a stderr warning rather than silently truncating (FR-002, SC-005)
- [X] T008 [US1] Implement the `tool list` action in `cli/src/commands/tool.ts`: `NAME⇥TYPE⇥SOURCE⇥VERSION` header, one tab-separated row per tool, `-` for a null version, client-side `--source` filter, `--json` emitting the concatenated array with no wrapper, `no tools found.` plus exit `0` when empty
- [X] T009 [US1] Verify quickstart Scenarios 1 and 2 against the live API and confirm T006 passes

**Checkpoint**: `tool list` is fully functional and shippable on its own.

---

## Phase 4: User Story 2 - Inspect one tool by name (Priority: P1)

**Goal**: `voiceai tool get <tool-name>` resolves an exact name to exactly one tool and prints its
full record, handling the curated/org collision deterministically.

**Independent Test**: Run `voiceai tool get end_call` — a name that already collides in the probed
organisation — and confirm the org tool prints on stdout with the shadowing note on stderr only.

### Tests for User Story 2

- [X] T010 [US2] Write failing tests in `cli/src/commands/tool.test.ts` with a stubbed `fetch`, covering: two rows for one name selecting `source === "org"` and emitting the shadowing note on stderr not stdout, `--source curated` selecting the other row with no note, `--source` with no match producing not-found and exit `1`, an empty name filter result producing the case-sensitivity message and exit `1`, and `--json` emitting a single object even on a collision

### Implementation for User Story 2

- [X] T011 [US2] Implement and export `resolveToolByName()` in `cli/src/commands/tool.ts`: one `GET /v1/agents/tools?name=<name>` request using the repeatable-query support from T002, returning 0–2 rows, preferring `source === "org"` when unfiltered, honouring `--source`, and writing the shadowing note to stderr (FR-006a, FR-006b)
- [X] T012 [US2] Implement the `tool get` action in `cli/src/commands/tool.ts`: fetch `GET /v1/agents/tools/{id}` for the resolved row, print a labelled field block with name and version first, render `code_src` as `<N> lines (use --json for the source)`, print `declared_secrets` as names only, and emit the single `ToolDetail` object under `--json`
- [X] T013 [US2] Verify quickstart Scenarios 3, 4, and 5 against the live API and confirm T010 passes

**Checkpoint**: Both P1 stories work independently. This is the complete feature as requested.

---

## Phase 5: User Story 3 - Scriptable output (Priority: P3)

**Goal**: Both commands are safe to pipe and parse, in success and in failure.

**Independent Test**: `voiceai tool list | cut -f4` yields the version column alone, and a failing
`--json` run still parses.

- [X] T014 [US3] Write failing tests in `cli/src/commands/tool.test.ts` asserting that a failed request under `--json` still writes one valid JSON document to stdout, and that no spinner or colour escape reaches stdout when `process.stdout.isTTY` is false
- [X] T015 [US3] In `cli/src/commands/tool.ts`, gate the spinner on `process.stderr.isTTY` and colour on `process.stdout.isTTY`, and route every note, warning, and error to stderr so stdout carries data only (FR-008, FR-009)
- [X] T016 [US3] Verify quickstart Scenario 6 and confirm T014 passes

**Checkpoint**: All three stories independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T017 [P] Document the `tool` command group in `cli/README.md`, including `--source` and the exact/case-sensitive name matching
- [X] T018 Verify quickstart Scenario 7 live: confirm missing credential, rejected credential, and network failure each produce a distinct message and exit `1`; that the rejected-credential message carries `request_id` (FR-014); that no output contains the API key (FR-012); and that `--profile <name>` selects a profile for `tool` exactly as it does for `agents` (FR-011)
- [X] T019 Cover the two failure modes that cannot be induced live, with a stubbed `fetch` in `cli/src/commands/tool.test.ts`: a `403` carrying `PUBLIC_SHARED_RESOURCES_DISABLED` renders a message saying retrying will not help, and a `429` carrying `Retry-After` renders the wait. Completes FR-013's six distinguishable modes and SC-004
- [ ] T020 Run `bun test` and `bun run sync-models:check` at the repository root; both must pass per the constitution's Development Workflow
  - `bun test cli/` — **21 pass, 0 fail**
  - `bun test streaming/` — **1 pre-existing failure**, `rejects connect when aborted`, present on the baseline before any change in this feature
  - `bun run sync-models:check` — **fails**: `live-models.generated.ts is stale`. Pre-existing drift against the live model registry; `git diff` shows the file untouched by this feature. Regenerating it here would pull unrelated catalogue changes into this branch, which Principle II says belongs in its own commit. Left for a separate change.
- [X] T021 Confirm `git status` shows no modification under `specs/`, no `*.generated.ts`, and no `streaming/ts/messages.ts`, satisfying Principles I and II

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (T001)**: no dependencies
- **Foundational (T002–T005)**: depends on Setup; **blocks both P1 stories**
- **US1 (T006–T009)** and **US2 (T010–T013)**: both depend only on Foundational, and are independent of each other
- **US3 (T014–T016)**: depends on at least one of US1/US2 existing to test against
- **Polish (T017–T021)**: depends on all desired stories being complete

### User Story Dependencies

- **US1 (P1)**: independent. `tool list` needs nothing from `tool get`.
- **US2 (P1)**: independent. Name resolution uses the shared query support from T002, not anything US1 builds. A user who knows a name never needs `list`.
- **US3 (P3)**: cross-cutting polish over whichever commands exist.

### Within Each Story

Tests first and failing, then the helper, then the command action, then live verification.

### Parallel Opportunities

Genuinely limited, and worth stating plainly rather than inventing:

- **T004 is parallel with T002/T003** — different files.
- **T017 is parallel with T018–T021** — `cli/README.md` touches nothing else.
- **US1 and US2 are parallel across developers** once Foundational lands — but they share
  `cli/src/commands/tool.ts` and `cli/src/commands/tool.test.ts`, so two people on them at once will
  conflict in those files. One developer doing US1 then US2 is the lower-friction path.
- **T002 and T003 are NOT parallel** — both edit `cli/src/lib/agents.ts`.
- Tasks within a story are **not** parallel — they touch the same two files.

---

## Parallel Example: Foundational Phase

```bash
# Developer A:
Task: "T002 → T003: repeatable query params, then nested error unwrapping in cli/src/lib/agents.ts"

# Developer B, at the same time:
Task: "T004: create cli/src/commands/tool.ts scaffold with types and help text"
```

---

## Implementation Strategy

### MVP

Both `tool list` and `tool get` are P1 and were asked for together, so the MVP is
**Phases 1–4 (T001–T013)**. Shipping only `tool list` is a valid earlier checkpoint if you want to
demo sooner, but it is half the request.

### Incremental Delivery

1. T001–T005 → `voiceai tool --help` renders, nothing else changed
2. T006–T009 → `tool list` works and is tested → demoable
3. T010–T013 → `tool get` works and is tested → **feature complete as specified**
4. T014–T016 → pipe/CI hardening
5. T017–T021 → docs and constitution gates

### Suggested Commit Points

After T005, after T009, after T013, after T016, after T021.

---

## Notes

- The `end_call`, `send_sms`, and `transfer_call` collisions already exist in the probed
  organisation, so T013 needs no fixture setup.
- Seven of seventeen live tools have `latest_version: null`, so the `-` placeholder is the common
  case, not an edge case.
- No task adds a dependency, edits `specs/`, edits generated code, or introduces an environment
  variable. If a task seems to require any of those, stop — the plan is wrong, not the constitution.
