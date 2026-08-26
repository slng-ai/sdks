---
description: "Task list for Secret Vault Commands"
---

# Tasks: Secret Vault Commands

**Input**: Design documents from `.specify/specs/002-secret-vault-commands/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/cli-commands.md](./contracts/cli-commands.md), [quickstart.md](./quickstart.md)

**Tests**: Included and **not optional**. The constitution's Development Workflow requires a test for
changes to argument parsing, and FR-008/SC-005 (no vault value reaches any stream) is only
demonstrable by assertion. `cli/src/commands/tool.test.ts` is the pattern to copy.

**Organization**: Grouped by user story so each can be implemented and verified independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1 / US2 / US3, mapping to the user stories in spec.md

## Path Conventions

Everything lives in the existing `cli/` workspace. Paths are repository-relative.

**On `[P]` in this feature**: the whole change is two new files plus two edits, so genuine
parallelism is limited to "implementation in `secret.ts`" against "tests in `secret.test.ts`". Tasks
touching the same file are never marked `[P]`, even when they are conceptually independent. Do not
expect the fan-out a larger feature would offer.

---

## Phase 1: Setup

**Purpose**: Establish a known-good baseline before touching anything.

- [X] T001 Run `bun install` at the repository root, then `bun test cli/` and record which tests pass, so any later failure is attributable to this feature. The two known-unrelated failures are listed in [quickstart.md](./quickstart.md) (Full suite) — `streaming/ts/client.test.ts > rejects connect when aborted` and `bun run sync-models:check` reporting a stale `live-models.generated.ts`. Do not fix either here

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The command file skeleton and the redaction invariant. Both P1 stories depend on all of
it, and redaction must exist before any renderer does, so no output path can be written without it.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T002 Create `cli/src/commands/secret.ts` exporting `secretCommand(): Command`, with: the `VaultEntry` interface (all 14 fields from [data-model.md](./data-model.md), `kind` typed `"secret" | "variable"`); the `fail(json, message)`, `spin(label)`, and `row(cells)` helpers copied from `cli/src/commands/tool.ts`; and `addHelpText("afterAll", …)` documenting both subcommands, that names are matched exactly and case-sensitively, and that values are never displayed (FR-016). No subcommands yet — they arrive in Phases 3 and 4
- [X] T003 In `cli/src/commands/secret.ts`, add and export `redact<T extends Partial<VaultEntry>>(entry: T): Omit<T, "value">` — the single boundary that strips `value`. It MUST NOT branch on `kind`: `secret` entries carry `null` but `variable` entries carry decrypted plaintext (research D3), and one unconditional rule is what keeps a future renderer from leaking. Depends on T002, same file
- [X] T004 [P] Create `cli/src/commands/secret.test.ts` with the harness from `cli/src/commands/tool.test.ts`: `process.env.VOICEAI_API_KEY = "slng_test_key"`, the `realFetch` save/restore in `afterEach`, a `stub(rows)` helper that records requested URLs, and an `entry(over)` factory returning a `VaultEntry`. Add the first test: `redact` removes `value` from a `kind: "variable"` entry carrying a sentinel plaintext, and the sentinel is absent from `JSON.stringify` of the result
- [X] T005 Register `secretCommand()` in `cli/src/flags.ts` (import beside `toolCommand`, `program.addCommand(secretCommand())` after it) and add two `ROOT_EPILOGUE` example lines — `voiceai secret list` and `voiceai secret get STRIPE_KEY`. Leave the `ENVIRONMENT` block unchanged: this feature introduces no new environment variable (FR-012). Depends on T002

**Checkpoint**: `bun run --cwd cli dev secret --help` renders the group. Both stories can now proceed.

---

## Phase 3: User Story 1 - See which secrets my organisation has configured (Priority: P1) 🎯 MVP

**Goal**: `voiceai secret list` prints every vault entry the organisation holds, with name, kind,
whether a value is stored, and description — in one request, with no value ever printed.

**Independent Test**: Run `voiceai secret list` against the probed organisation and confirm three
rows (`FIRECRAWL_API_KEY`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`), each `secret` / `yes` / `-`,
and exit `0`.

### Tests for User Story 1

> Write these first and confirm they fail.

- [X] T006 [US1] In `cli/src/commands/secret.test.ts`, unit-test `listSecrets()`: it issues exactly **one** request to `/v1/agents/secrets` with no query parameters (research D4 — the route ignores `limit`/`offset`, so a paging loop would be dead code), returns every row, and throws with `formatAgentsError`'s message when the request fails
- [X] T007 [US1] In `cli/src/commands/secret.test.ts`, unit-test `valueCell()`: `true → "yes"`, `false → "no"`. Never blank, never a bare boolean (FR-004)
- [X] T008 [US1] In `cli/src/commands/secret.test.ts`, add action-level tests using `Bun.serve({port: 0})` and `Bun.spawn` with `VOICEAI_AGENTS_BASE_URL` pointed at the stub: (a) a populated vault prints the `NAME⇥KIND⇥VALUE⇥DESCRIPTION` header plus one row per entry on stdout with empty stderr when not a TTY (FR-010); (b) an empty vault prints `no secrets found.` and exits `0` (FR-005); (c) `--json` output parses as an array and `[.[] | has("value")] | any` is false, with a `variable` entry carrying a sentinel in the stub payload

### Implementation for User Story 1

- [X] T009 [US1] In `cli/src/commands/secret.ts`, add and export `listSecrets(): Promise<VaultEntry[]>` — a single `agentsRequest<VaultEntry[]>("GET", "/v1/agents/secrets")`, throwing `new Error(formatAgentsError(res))` when `!res.ok`, returning `[]` when the body is not an array. No `PAGE_SIZE`, no `MAX_OFFSET`, no loop
- [X] T010 [US1] In `cli/src/commands/secret.ts`, add and export `valueCell(hasValue: boolean): string` returning `"yes"` / `"no"`, and a `descriptionCell` rule rendering null or empty as `-`
- [X] T011 [US1] In `cli/src/commands/secret.ts`, add the `list` subcommand with `--json`: spinner on stderr when TTY, `listSecrets()`, then either `console.log(JSON.stringify(rows.map(redact), null, 2))` or the tab-separated table with the `NAME⇥KIND⇥VALUE⇥DESCRIPTION` header. Empty vault prints `no secrets found.` and exits `0`. Failures go through `fail(opts.json, …)`. Depends on T009, T010, and T003

**Checkpoint**: `voiceai secret list` is fully functional and independently testable. This is the MVP.

---

## Phase 4: User Story 2 - Check one secret by name (Priority: P1)

**Goal**: `voiceai secret get <name>` prints one entry's full non-sensitive record, or exits non-zero
with a message that explains exact, case-sensitive matching.

**Independent Test**: `voiceai secret get FIRECRAWL_API_KEY` prints a field block with no `value`
line and exits `0`; `voiceai secret get firecrawl_api_key` exits `1` naming case sensitivity.

### Tests for User Story 2

> Write these first and confirm they fail.

- [X] T012 [US2] In `cli/src/commands/secret.test.ts`, unit-test `getSecret(name)`: it requests `/v1/agents/secrets/<name>` exactly once, and percent-encodes a name containing `/`, `#`, and a space so the path is not broken (spec Edge Cases, research D5). Assert against the recorded URL
- [X] T013 [US2] In `cli/src/commands/secret.test.ts`, add action-level tests against the `Bun.serve` stub: (a) a `404` body `{"detail":…,"error":{"code":"RESOURCE_NOT_FOUND",…}}` produces stderr `secret "<name>" not found. names are matched exactly and are case-sensitive.` and exit `1` (FR-007, FR-011); (b) `--json` on that failure still emits a parseable `{"ok": false, "error": …}` on stdout and exits `1`; (c) an entry with `has_value: false` still exits `0` and renders as present-but-unpopulated
- [X] T014 [US2] In `cli/src/commands/secret.test.ts`, add a test asserting `get` on a `kind: "variable"` entry whose stub payload carries a sentinel plaintext emits the sentinel in neither stdout nor stderr, in both default and `--json` modes (FR-008)

### Implementation for User Story 2

- [X] T015 [US2] In `cli/src/commands/secret.ts`, add and export `getSecret(name: string)` returning the raw `AgentsResult<VaultEntry>` from a single `agentsRequest("GET", \`/v1/agents/secrets/${encodeURIComponent(name)}\`)`. Return the result rather than throwing, so the caller can distinguish `404` from every other failure
- [X] T016 [US2] In `cli/src/commands/secret.ts`, add and export `printSecret(entry)` — a labelled field block leading with `name`, `kind`, `has_value`, then the remaining fields, reusing `tool.ts`'s `summarise` conventions (`-` for null/empty, padded labels). It takes an already-redacted entry; it does not redact for itself
- [X] T017 [US2] In `cli/src/commands/secret.ts`, add the `get <secret-name>` subcommand with `--json`: `getSecret()`, then map `res.status === 404` to the not-found message from [contracts/cli-commands.md](./contracts/cli-commands.md) and every other failure to `formatAgentsError(res)`, both via `fail(opts.json, …)`. On success, `redact()` first, then `console.log(JSON.stringify(…))` or `printSecret()`. Depends on T015, T016, and T003

**Checkpoint**: Both P1 stories work. The feature as the user asked for it is complete.

---

## Phase 5: User Story 3 - Script against vault state (Priority: P3)

**Goal**: Both commands are usable from a shell script without parsing prose — valid JSON on every
path, and an exit code that alone answers "is this secret there?".

**Independent Test**: `voiceai secret get NOPE --json | jq -e '.ok == false'` parses and the shell
`if` branch on `voiceai secret get <known> >/dev/null 2>&1` takes the success path.

Most of this story falls out of T011 and T017; the tasks below are the assertions that keep it true.

### Tests for User Story 3

- [X] T018 [US3] In `cli/src/commands/secret.test.ts`, add an action-level test that both commands produce **no ANSI escape sequences and no spinner output** when spawned without a TTY, and that stderr is empty on the success path (FR-010, quickstart Scenario 6)
- [X] T019 [US3] In `cli/src/commands/secret.test.ts`, add action-level tests for the credential and platform failure modes against the `Bun.serve` stub, asserting each produces a *different* stderr message and exit `1` (FR-014): `401 AUTH_REQUIRED`, `403 PUBLIC_SHARED_RESOURCES_DISABLED`, and `429` with a `Retry-After` header whose wait appears in the message. Also assert no output on any of these paths contains the API key (FR-013)

### Implementation for User Story 3

- [X] T020 [US3] Fix whatever T018 and T019 surface in `cli/src/commands/secret.ts`. Expect this to be empty: `formatAgentsError` already unwraps the nested envelope, appends the `Retry-After` wait, and surfaces the machine-readable code (research D2). If it is not empty, the fix belongs in `cli/src/lib/agents.ts` and benefits every `agents` and `tool` subcommand too

**Checkpoint**: All three stories independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T021 In `cli/src/commands/secret.test.ts`, add the cross-cutting sentinel test that closes SC-005: a stub vault containing one `secret` and one `variable` entry, the latter carrying a unique sentinel plaintext; run `list` and `get` × default and `--json` (four runs) and assert the sentinel appears in neither stdout nor stderr in any of them. This is the single test that must never be deleted
- [X] T022 [P] Document the `secret` group in `cli/README.md` beside the `tool` group: both subcommands, `--json`, exact case-sensitive matching, and an explicit line that values are never displayed — including for `variable` entries, where the platform would return plaintext
- [X] T023 Run `bun test cli/` and confirm the only failures are the two recorded in T001
- [X] T024 Run `bun run regen && git status --porcelain` and confirm no diff. This feature touches no spec, no manifest, and no generator (Constitution II)
  - **Partially verified — environment gap, see Implementation notes.** `bun run regen` cannot complete on this machine: `sync-specs` needs a `GATEWAY_SPECS_DIR` checkout and `gen-voices` needs an untracked `voice-manifests/` directory, neither of which exists here. The three steps that do run (`gen-ws-types`, `gen-sdk-catalogs`, `sync-voice-tools`) produced **no diff**. Re-run the full command on a machine with both inputs before merge
- [X] T025 Walk [quickstart.md](./quickstart.md) Scenarios 1–8 against the live API with the credential from `.env` exported as `VOICEAI_API_KEY`. Scenario 7's missing-credential case **must** isolate `HOME` and `XDG_CONFIG_HOME` — `env -u VOICEAI_API_KEY` alone silently falls back to the profile store and succeeds with another organisation's key
- [X] T026 Confirm `git diff --stat` touches only `cli/src/commands/secret.ts`, `cli/src/commands/secret.test.ts`, `cli/src/flags.ts`, and `cli/README.md`. Any change to `cli/src/lib/agents.ts` means T020 found something — call it out in the PR description rather than burying it

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (T001)**: no dependencies
- **Foundational (T002–T005)**: depends on Setup — **blocks both P1 stories**
- **US1 (T006–T011)** and **US2 (T012–T017)**: both depend only on Foundational; independent of each other in logic, but they edit the same file (see below)
- **US3 (T018–T020)**: depends on both P1 stories, because it asserts behaviour of both commands
- **Polish (T021–T026)**: depends on everything

### Within Foundational

T002 → T003 (same file) → T005 (needs the export). T004 is the only genuinely parallel task in the
phase: it is the other file.

### Within Each User Story

Tests first, and confirm they fail. Then the exported helper, then the renderer, then the subcommand
that wires them — the subcommand task depends on both and on T003.

### File-conflict reality

- `cli/src/commands/secret.ts`: T002, T003, T005*, T009, T010, T011, T015, T016, T017, T020
- `cli/src/commands/secret.test.ts`: T004, T006, T007, T008, T012, T013, T014, T018, T019, T021
- `cli/src/flags.ts`: T005
- `cli/README.md`: T022

(*T005 edits `flags.ts`, but needs T002's export.)

US1 and US2 are independently *testable* but not independently *editable* — both append to the same
two files. One developer should take them in sequence. Two developers would conflict on every task.

### Parallel Opportunities

- T004 alongside T002/T003
- Within a story, the test tasks are one file and the implementation tasks are another, so a
  test-writer and an implementer can work concurrently if the interface signatures are agreed first
- T022 (README) any time after Phase 4

---

## Parallel Example: Foundational

```bash
# T002 then T003 in secret.ts, while T004 sets up the test harness in the other file:
Task: "Create cli/src/commands/secret.ts with VaultEntry, helpers, and help text"
Task: "Create cli/src/commands/secret.test.ts with the stub harness and the redact test"
```

---

## Implementation Strategy

### MVP (User Story 1 only)

1. T001 → T002–T005 → T006–T011
2. **Stop and validate**: quickstart Scenario 1, plus Scenario 4's `--json` value check
3. `voiceai secret list` is shippable on its own

### Incremental Delivery

1. Setup + Foundational → the group exists and `--help` renders
2. + US1 → `secret list` works (MVP)
3. + US2 → `secret get` works; this is the whole feature as requested
4. + US3 → scripting guarantees asserted
5. + Polish → docs, live walk-through, diff audit

### Suggested commits

One per phase, or one per checkpoint. Keep `bun run regen` out of every commit — it produces no diff
here, and bundling it would obscure that.

---

## Notes

- `[P]` = different files, no dependencies. This feature has very few; see File-conflict reality.
- Verify tests fail before implementing.
- **T021 is the load-bearing test.** Everything else in this feature is a convenience; that one is
  the difference between a presence check and a credential disclosure. Constitution Principle V.
- `cli/src/lib/agents.ts` should not change. If it does, say why in the PR — it is shared with
  `agents` and `tool`.

---

## Implementation notes

Recorded during `/speckit-implement`, 2026-08-26.

### What the plan predicted correctly

- **T020 was empty.** `formatAgentsError` already unwrapped the nested envelope, appended the
  `Retry-After` wait, and surfaced the machine-readable code. `cli/src/lib/agents.ts` was not
  touched, exactly as research D2 predicted. The 401 / 403 / 429 tests passed on first run.
- **No paging loop, no id lookup.** `listSecrets` is one request; `getSecret` is one request.
- Final diff is the four intended files and nothing else (T026 verified with `git diff --stat`).

### Two things the plan did not predict

- **`bun.lock` drifts on any `bun install`.** T001's install rewrote it: `cli/package.json` says
  version `0.1.13` but the lockfile still recorded `0.1.10` (the 0.1.13 release bumped the manifest
  and not the lock), and `@types/bun` re-resolved `1.3.14 → 1.4.0`. **Reverted**, on the same
  reasoning CLAUDE.md applies to the model catalog: a stale lockfile is a real problem but it is not
  this feature's, and bundling it here would hide it. Worth its own commit.
- **`bun run --cwd cli dev …` writes its own banner to stderr.** The `dev` script echoes
  `$ bun run src/index.ts …`, which is not CLI output. Scenario 6 of quickstart.md was checking
  stderr emptiness through that wrapper and would have read as a false failure; corrected to invoke
  `src/index.ts` directly. The action-level tests were already spawning it directly, which is why
  they passed while the manual check appeared not to.

### One test assertion was wrong, not the code

T013's first draft asserted `stdout` does not contain `"value  "`. That substring also occurs inside
`has_value             yes`, so a correct implementation failed the test. Fixed by matching the field
label at the start of a line instead. The implementation was right the whole time.

### Verification

- `bun test cli/` — 45 pass, 0 fail (21 pre-existing + 24 new).
- quickstart.md Scenarios 1–8 all walked against the live API, including the isolated-`HOME`
  missing-credential path.
- Live completeness check: CLI row count equals the platform's own count (3 = 3).
