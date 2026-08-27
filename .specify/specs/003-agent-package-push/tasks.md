---
description: "Task list for: Push an agent package"
---

# Tasks: Push an agent package

**Input**: Design documents from `.specify/specs/003-agent-package-push/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/cli-commands.md](./contracts/cli-commands.md), [quickstart.md](./quickstart.md)

**Tests**: **Required, not optional.** The constitution's Development Workflow states that changes to
argument parsing MUST land with a test, and this feature adds a command with five options.
[quickstart.md](./quickstart.md) defines the assertions; the tasks below implement them.

**Organization**: Grouped by user story so each is independently implementable and testable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: US1 / US2 / US3, mapping to spec.md
- Every task names an exact file path

## Path Conventions

CLI monorepo, TypeScript on Bun. Feature source lives in `cli/src/`; there is no separate `tests/`
tree — tests sit beside the code as `*.test.ts`, matching `tool.test.ts`, `secret.test.ts` and
`trunks.test.ts`.

**Parallelism is genuinely limited here.** The feature is two new files plus a one-line edit, and
most work lands in `cli/src/commands/push.ts`. `[P]` is marked only where files truly differ —
inflating it would mislead.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the files and register the command so everything downstream is runnable

- [X] T001 [P] Create `cli/src/lib/package.ts` with the on-disk type declarations from [data-model.md](./data-model.md) §1 — `PackageLocation`, `CompiledAgent`, `PackageToolRef`, `PackageToolBody`, `PackageSample`
- [X] T002 [P] Create `cli/src/commands/push.ts` exporting `pushCommand()` — the `push <dir>` command with all five options (`--dry-run`, `--run-samples`, `--agent-id`, `--label`, `--json`) per [contracts/cli-commands.md](./contracts/cli-commands.md) §Options, action stubbed
- [X] T003 [P] Create `cli/src/commands/push.test.ts` with the stub-server harness — `Bun.serve({port: 0})` + `Bun.spawn`, pointing **both** `VOICEAI_AGENTS_BASE_URL` **and** `VOICEAI_BASE_URL` at the stub. `push` is the first command to touch two hosts: the existing harnesses in `tool.test.ts` / `secret.test.ts` / `trunks.test.ts` stub only the agents host, so copying one verbatim would let every action-level test reach the live API at `https://api.slng.ai`. Assert in the harness that the stub receives no request it was not primed for, so a new unstubbed host fails loudly instead of silently escaping to the network
- [X] T004 Register the command in `cli/src/commands/agents.ts` — add `cmd.addCommand(pushCommand())` and a `push <dir>` line to the group's `COMMANDS` help block (depends on T002)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Package reading and the shared plan types — every user story reads a package

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Implement package location resolution in `cli/src/lib/package.ts` — try `<dir>/build/slng/agent.json` then `<dir>/agent.json`, record both in `searched[]`, derive `toolsDir` and `samplesDir` (FR-001, FR-002)
- [X] T006 Implement package parsing in `cli/src/lib/package.ts` — parse `agent.json`, every `tools/*.json`, every `samples/*.json`; a missing `tools/` or `samples/` directory is normal, not an error
- [X] T007 [P] Unit-test location resolution and parsing in `cli/src/commands/push.test.ts` — package root, compiled dir, neither present (both paths named), `tools/` absent (quickstart §13)
- [X] T008 Declare the internal plan types in `cli/src/commands/push.ts` — `PushPlan`, `PlannedTool`, `PlannedRef`, `Blocker`, `ApplyOutcome` per [data-model.md](./data-model.md) §3
- [X] T009 Add the shared output helpers to `cli/src/commands/push.ts` — `fail(json, message)`, `spin(label)` and a stderr-only note writer, matching the shapes already in `tool.ts` and `secret.ts` (FR-037, FR-038)

**Checkpoint**: A package can be located and parsed; plan types exist; the command runs and exits.

---

## Phase 3: User Story 1 - Learn what my account is missing (Priority: P1) 🎯 MVP

**Goal**: One read-only pass that reports every account-level problem at once, with the dashboard
page that fixes each, and changes nothing.

**Independent Test**: Point at `examples/slng-support` in dry-run against an org lacking `end_call`.
It names that unresolved reference with the tools link, exits non-zero, and `agents list` /
`tool list` / `secret list` are byte-identical before and after.

### Tests for User Story 1 ⚠️

> Write these first and watch them fail before implementing.

- [X] T010 [P] [US1] Unit-test vault name derivation per `tool_type` in `cli/src/commands/push.test.ts` — `declared_secrets` for `code`, `config.auth.secret_name` + every `config.headers[].secret_name` for `api_request`, none for context-bound ([research D5](./research.md#d5--which-vault-names-does-a-package-depend-on))
- [X] T011 [P] [US1] Unit-test that a vault entry of `kind: "variable"` does **not** satisfy a required secret in `cli/src/commands/push.test.ts` ([research D4](./research.md#d4--what-gates-publish-and-which-tool-types-need-a-green-run))
- [X] T012 [P] [US1] Unit-test blocker accumulation in `cli/src/commands/push.test.ts` — a package with a missing vault entry, an unresolved tool name and a non-empty `mcp_refs` yields three blockers in one pass, never one (FR-008, quickstart §5)
- [X] T013 [US1] Action-level test in `cli/src/commands/push.test.ts`: every blocker class exits 1 and the stub server receives **zero** mutating requests — the strongest form of FR-009/SC-002
- [X] T014 [US1] Action-level test in `cli/src/commands/push.test.ts`: `--json` stays parseable on a blocker exit and carries `ok: false, changed: false` (FR-037)
- [X] T015 [US1] Action-level test in `cli/src/commands/push.test.ts`: `--dry-run` issues no mutating request, and the shadowed-curated-tool note goes to **stderr** while the result goes to stdout (FR-027, FR-038)
- [X] T016 [US1] Action-level test in `cli/src/commands/push.test.ts`: the command never prompts — spawn with stdin closed and stderr not a TTY, on both a clean `--dry-run` and a blocker path, and assert it exits rather than blocks. This is the one property Constitution III mandates by name ("New commands MUST be usable non-interactively"), and it is otherwise asserted nowhere (FR-036, quickstart §12)

### Implementation for User Story 1

- [X] T017 [US1] Implement organisation reporting in `cli/src/commands/push.ts` — take `organisation_id` from the pre-flight reads already made against the agents host (`GET /v1/agents`, `listSecrets()`), so the org is known without a second call. Enrich with `org_name` via `verifyApiKey()` in `cli/src/lib/verify.ts` **best-effort only**: that helper targets a different host (`VOICEAI_BASE_URL`, default `https://api.slng.ai`), and its failure MUST NOT abort a push the agents host would have accepted. When a brand-new organisation has neither an agent nor a vault entry to read an id from and the probe also fails, report the organisation as unknown and continue (FR-011)
- [X] T018 [US1] Implement vault name derivation in `cli/src/commands/push.ts` — mirror the backend's per-type rule over the shipped tool bodies, plus `{{$NAME}}` tokens in the agent's `system_prompt` and `greeting` (FR-004)
- [X] T019 [US1] Implement the vault existence check in `cli/src/commands/push.ts` — one `listSecrets()` from `cli/src/commands/secret.ts`, match on name **and** `kind === "secret"`, emit one `vault_missing` blocker carrying every missing name (FR-005, FR-006)
- [X] T020 [US1] Implement tool-name resolution in `cli/src/commands/push.ts` — `listAllTools(names)` + `pickTool` imported unchanged from `cli/src/commands/tool.ts`, emit one `tool_unresolved` blocker carrying every unresolved name, record `shadowed` on resolved refs (FR-007, FR-027)
- [X] T021 [US1] Implement the agent-name lookup in `cli/src/commands/push.ts` — `GET /v1/agents`, match the package's `name`, set `action: "create" | "update"`; more than one match emits an `agent_ambiguous` blocker listing every id and naming `--agent-id` (FR-028, FR-031)
- [X] T022 [US1] Implement the `mcp_unsupported` blocker in `cli/src/commands/push.ts` — refuse a non-empty `mcp_refs` with the reason, since `observed_schema_hash` requires an MCP session ([research D8](./research.md#d8--mcp-references-cannot-be-resolved-offline-or-by-this-feature))
- [X] T023 [US1] Assemble `planPush()` in `cli/src/commands/push.ts` as a pure read-only function returning `PushPlan` with all blockers collected — no mutating call may exist on this path (FR-008)
- [X] T024 [US1] Implement human blocker rendering in `cli/src/commands/push.ts` — grouped by kind, count per group, every group carrying its dashboard URL (`https://app.slng.ai/vault/secrets`, `https://app.slng.ai/tools`), closing with `nothing was created or changed.` (FR-012, FR-013, FR-014)
- [X] T025 [US1] Implement human dry-run rendering in `cli/src/commands/push.ts` — the organisation / package / agent header plus `TOOLS` and `REFERENCES` blocks, per [contracts/cli-commands.md](./contracts/cli-commands.md) §Output — human
- [X] T026 [US1] Implement `--json` rendering in `cli/src/commands/push.ts` for both the dry-run plan and the blocker document, per contracts §Output — `--json` (FR-037)
- [X] T027 [US1] Wire `--dry-run` in `cli/src/commands/push.ts` — run `planPush()`, render, exit 0 when clean and 1 when blocked, never proceeding to apply (FR-009, FR-010, FR-039)

**Checkpoint**: US1 is fully functional. `--dry-run` and every blocker path work end to end, and the organisation is provably untouched.

---

## Phase 4: User Story 2 - Push the agent itself (Priority: P2)

**Goal**: Resolve every name to identifiers, create or replace the agent, and label the version written.

**Independent Test**: Push `examples/slng-support` to an org that has `end_call`. An agent appears, its ref carries resolved identifiers rather than a name, and re-running updates that same agent instead of creating a second.

### Tests for User Story 2 ⚠️

- [X] T028 [P] [US2] Unit-test reference building in `cli/src/commands/push.test.ts` — the `tool` key is removed, `description` / `invocation` / `argument_overrides` / `execution_policy` / `config_overrides` survive byte-for-byte, and no bare name remains anywhere (FR-022, FR-026)
- [X] T029 [P] [US2] Unit-test attachment identity in `cli/src/commands/push.test.ts` — a tool already attached to the live agent reuses its `attachment_id`; a new tool mints a fresh one; no id is ever taken from another agent (FR-023, FR-024, FR-025)
- [X] T030 [P] [US2] Unit-test the removals diff in `cli/src/commands/push.test.ts` — a live ref the package no longer declares appears in `plan.removals` (FR-030)
- [X] T031 [P] [US2] Unit-test label derivation in `cli/src/commands/push.test.ts` — derived from package directory name plus timestamp, ≤120 characters, overridden by `--label` (FR-033)
- [X] T032 [US2] Action-level test in `cli/src/commands/push.test.ts`: first push creates, second push updates the **same** id, and only one agent of that name exists (FR-028, FR-029, quickstart §6)
- [X] T033 [US2] Action-level test in `cli/src/commands/push.test.ts`: a push that changes nothing writes no new version and does **not** relabel the previous one — the report says `unchanged` ([research D9](./research.md#d9--how-is-an-agent-version-labelled), quickstart §9)
- [X] T034 [US2] Action-level test in `cli/src/commands/push.test.ts`: a platform rejection is surfaced verbatim including the field it names, via `formatAgentsError` (FR-035)

### Implementation for User Story 2

- [X] T035 [US2] Implement reference building in `cli/src/commands/push.ts` — map each `PackageToolRef` to a `ToolAttachment`, substituting `tool_id` and `version` while preserving every other field (FR-022, FR-026)
- [X] T036 [US2] Implement attachment mint-or-reuse in `cli/src/commands/push.ts` — build the reuse map from the live agent's `tool_refs` keyed by `tool_id`, else `randomUUID()` from `node:crypto` (FR-023, FR-024, FR-025)
- [X] T037 [US2] Implement the removals diff in `cli/src/commands/push.ts` — live `tool_refs` minus package refs, populating `plan.removals` (FR-030)
- [X] T038 [US2] Extend dry-run rendering in `cli/src/commands/push.ts` with the `WILL BE DETACHED` block — the only warning replace semantics allow (FR-030, contracts §Dry run, updating)
- [X] T039 [US2] Implement the agent write in `cli/src/commands/push.ts` — `POST /v1/agents` to create, `PUT /v1/agents/{id}` to replace; **not** `PATCH`, which merges and would leave dropped refs attached ([research D12](./research.md#d12--create-vs-update-transport), FR-029)
- [X] T040 [US2] Implement version labelling in `cli/src/commands/push.ts` — read `GET /v1/agents/{id}/versions?page=1&page_size=1` after the write, compare against the pre-write newest, and `PATCH /v1/agents/{id}/versions/{n}` with `{label}` only when a new version exists (FR-033)
- [X] T041 [US2] Implement success rendering in `cli/src/commands/push.ts` — organisation, agent id, action, version number and label, in both human and `--json` form (FR-032, FR-034, contracts §Success)
- [X] T042 [US2] Wire the apply path in `cli/src/commands/push.ts` — `planPush()` → refuse on any blocker → agent write → label, exiting non-zero on failure (FR-039)

**Checkpoint**: US1 and US2 both work. `examples/slng-support` pushes end to end with zero hand-edits.

---

## Phase 5: User Story 3 - Sync the package's own tools (Priority: P3)

**Goal**: Create/update, introspect, optionally run, and publish every tool the package ships, so the agent can reference it at a published version.

**Independent Test**: Push a package carrying one tool body. The tool appears on the platform, published at a version, and the pushed agent's ref names that version.

> **Read [research D6](./research.md#d6--can-push-run-a-tool-sample-unattended) and [D7](./research.md#d7--unmute-ships-no-samples-what-does-that-do-to-us3) before starting.** Unmute ships no samples, and `code` / `api_request` tools cannot publish without a successful run. Sample absence is therefore a **pre-flight blocker**, not a publish-time surprise, and running is gated behind `--run-samples` because the platform's `confirm_side_effects` is a consent gate this command must never forge.

### Tests for User Story 3 ⚠️

- [X] T043 [P] [US3] Unit-test green-run classification in `cli/src/commands/push.test.ts` — `needsGreenRun` true for `code` and `api_request`, false for context-bound types (research D4)
- [X] T044 [P] [US3] Unit-test the sample blockers in `cli/src/commands/push.test.ts` — `sample_missing` when a green-run type ships none; `samples_not_enabled` when the sample exists but `--run-samples` was not passed (research D6, D7)
- [X] T045 [P] [US3] Unit-test the `tool_type_immutable` blocker in `cli/src/commands/push.test.ts` — a shipped body whose `tool_type` differs from the existing tool's is refused with both types named (research D3)
- [X] T046 [US3] Action-level test in `cli/src/commands/push.test.ts`: `confirm_side_effects: true` appears on `/run` **only** with `--run-samples`, and no `/run` request reaches the stub without it (research D6, quickstart §10)
- [X] T047 [US3] Action-level test in `cli/src/commands/push.test.ts`: a failed run aborts before the agent is written — assert the stub never receives `POST /v1/agents` (FR-018)
- [X] T048 [US3] Action-level test in `cli/src/commands/push.test.ts`: publish returning **409 with a `PublishResult` body** is rendered as named gate failures, not as a generic error envelope — it is a result shape, not an error shape (research D3)
- [X] T049 [US3] Action-level test in `cli/src/commands/push.test.ts`: a failure partway through several tools reports exactly which were created, updated or published and which were not (FR-021, contracts §Partial failure)

### Implementation for User Story 3

- [X] T050 [US3] Implement sample reading in `cli/src/lib/package.ts` — load `samples/<tool-name>.json` per shipped tool, absence being a normal state the planner interprets
- [X] T051 [US3] Implement green-run classification and the sample blockers in `cli/src/commands/push.ts` — `needsGreenRun` per `tool_type`, emitting `sample_missing` or `samples_not_enabled` with the file to write or the flag to pass (research D6, D7)
- [X] T052 [US3] Implement the `tool_type_immutable` blocker in `cli/src/commands/push.ts` — compare each shipped body's `tool_type` against the resolved existing tool's, refusing rather than attempting a delete-and-recreate (research D3)
- [X] T053 [US3] Implement tool create/update in `cli/src/commands/push.ts` — `POST /v1/agents/tools` for a new name, `PATCH /v1/agents/tools/{id}` for an existing one, recording the outcome in `ApplyOutcome` rather than throwing (FR-015, FR-021)
- [X] T054 [US3] Implement introspection in `cli/src/commands/push.ts` — `POST /v1/agents/tools/{id}/introspect` for `code` tools only, since it is what populates their parse/models/schema gates (FR-016)
- [X] T055 [US3] Implement the sample run in `cli/src/commands/push.ts` — `POST /v1/agents/tools/{id}/run` with `{sample_input, confirm_side_effects: true}`, reached only when `willRun`; abort the whole push on any status other than `succeeded` (FR-017, FR-018)
- [X] T056 [US3] Implement publish in `cli/src/commands/push.ts` — `POST /v1/agents/tools/{id}/publish`, treating a 409 body as a `PublishResult` and rendering its failed gates by name; record `version_number` on success (FR-020)
- [X] T057 [US3] Feed published versions into reference building in `cli/src/commands/push.ts` — a ref to a tool this push published points at that `version_number`, replacing the `"after-publish"` placeholder (FR-020)
- [X] T058 [US3] Implement partial-outcome rendering in `cli/src/commands/push.ts` — `DONE` / `NOT DONE` blocks and the note that published tool versions cannot be unpublished (FR-021, FR-019 for tools not exercised)
- [X] T059 [US3] Wire tool sync into the apply path in `cli/src/commands/push.ts` — tools complete before the agent is written, so a tool failure never leaves an agent referencing an unpublished version

**Checkpoint**: All three stories work independently. Packages with their own tool bodies push end to end.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T060 [P] Write the `afterAll` help text in `cli/src/commands/push.ts` — `EXAMPLES` and `NOTES` per [contracts/cli-commands.md](./contracts/cli-commands.md) §Help text, matching the house shape used by `tool`, `secret` and `trunks`
- [X] T061 [P] Document the command in `cli/README.md` — one section covering the two-phase behaviour, the `samples/` convention, and that updating replaces rather than merges
- [X] T062 Verify no vault value can reach any output path in `cli/src/commands/push.ts` — `redact()` from `cli/src/commands/secret.ts` applied at the response boundary, and no code path fetches a value (FR-040, SC-010)
- [X] T063 Run the full manual validation in [quickstart.md](./quickstart.md) §1–13 against a live organisation, including the before/after triple-diff that proves SC-002
  - Run against `[SLNG] Nicola Croon's Workspace` on 2026-08-27. §1–§10, §12, §13 pass; the organisation was returned to its exact starting state (same four agents, same four tools at the same versions).
  - §11 (ambiguous agent name) covered by unit test only — it needs two agents deliberately sharing a name.
  - Live testing found one real defect that no unit test had reached: managed singleton adoption ([research D14](./research.md#d14--managed-singleton-types-silently-adopt-an-existing-tool)). Fixed, with regression tests.
- [X] T064 Run `bun test cli/` and confirm green, ignoring the two known pre-existing failures recorded in CLAUDE.md (`streaming/ts/client.test.ts`, `sync-models:check`)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: no dependencies
- **Foundational (Phase 2)**: depends on Setup — **blocks all user stories**
- **US1 (Phase 3)**: depends on Foundational
- **US2 (Phase 4)**: depends on Foundational, and on **US1's `planPush()`** (T023) — apply refuses on blockers, which US1 defines
- **US3 (Phase 5)**: depends on Foundational and on US1's blocker framework (T023); its apply step (T059) sequences **before** US2's agent write (T039)
- **Polish (Phase 6)**: depends on the stories being delivered

### User Story Dependencies

These stories are **not** fully independent, and the plan does not pretend otherwise:

- **US1 (P1)** stands alone. It is the MVP and needs nothing from US2 or US3.
- **US2 (P2)** needs US1's plan-and-blocker pass. Delivering US2 without it would mean an apply path
  with no pre-flight, which FR-009 forbids.
- **US3 (P3)** adds blocker kinds to US1's framework and inserts a stage ahead of US2's agent write.
  It is independently *testable* (a package with tool bodies), but not independently *shippable*
  before US2.

### Within Each User Story

- Tests are written first and must fail before implementation
- Package reading before planning; planning before rendering; rendering before wiring
- Plan is pure and read-only throughout — a mutating call on the plan path is a defect, not an optimisation

### Parallel Opportunities

Limited by design: the feature is two files plus a one-line edit.

- T001, T002, T003 — three different new files
- T007 — `push.test.ts` while `package.ts` work continues
- Unit-test tasks within a story (T010–T012, T028–T031, T043–T045) — all in `push.test.ts` but
  independent cases, safe to write together
- T060 and T061 — different files

Everything touching `cli/src/commands/push.ts` is sequential. Action-level tests depend on the
implementation they exercise and are not parallel with it.

---

## Parallel Example: Phase 1

```bash
# Three new files, no shared state:
Task: "Create cli/src/lib/package.ts with the on-disk type declarations"
Task: "Create cli/src/commands/push.ts exporting pushCommand() with all five options"
Task: "Create cli/src/commands/push.test.ts with the stub-server harness"
```

## Parallel Example: User Story 1 tests

```bash
# Independent cases in one file:
Task: "Unit-test vault name derivation per tool_type"
Task: "Unit-test that kind:variable does not satisfy a required secret"
Task: "Unit-test blocker accumulation across three independent problems"
```

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Phase 1: Setup
2. Phase 2: Foundational
3. Phase 3: US1
4. **STOP and VALIDATE**: run quickstart §1 (the triple-diff), §3, §4, §5, §13
5. Ship it — `push --dry-run` is useful on its own and is the only part that is risk-free against a
   production organisation

### Incremental Delivery

1. Setup + Foundational → package reading works
2. US1 → dry-run and blockers → **MVP, safe against production**
3. US2 → the smallest package (`examples/slng-support`) pushes end to end
4. US3 → packages carrying their own tool bodies

### Notes

- `[P]` means different files with no dependency on incomplete work
- Every blocker check belongs in `planPush()`. A check that runs during apply violates FR-009 —
  that structural rule is what makes "changed nothing" a guarantee rather than a discipline
- Apply records outcomes rather than throwing, because published tool versions cannot be unpublished
  and FR-021 requires reporting what was left behind
- Never supply `confirm_side_effects` without `--run-samples`; it is a consent gate, not a formality
- Commit per task or logical group; stop at any checkpoint to validate a story on its own

---

## Phase 7: Convergence

Appended by `/speckit-converge` on 2026-08-27, after `/speckit-implement`. Each item traces to
the requirement it closes. No existing task was renumbered or rewritten.

- [X] T065 Report the organisation on stderr before `applyPush` runs, not only in `renderOutcome` after it, in `cli/src/commands/push.ts` per FR-011 (partial) — HIGH: this repository's `.env` and default profile resolve to different organisations, so "which org am I writing to" must be answerable before the write, not after
- [X] T066 State whether the push is creating or updating on stderr regardless of TTY in `cli/src/commands/push.ts` per FR-032 (partial) — the announcement currently lives only in the `ora` spinner, which is `null` when stderr is not a TTY, so a pipeline run writes silently
- [X] T067 Report a synced tool that ships no sample as explicitly "not exercised" in `renderOutcome` in `cli/src/commands/push.ts` per FR-019 (missing) — a blank slot in the outcome line reads as "fine", which is what FR-019 forbids
- [X] T068 Diff the agent's scalar fields (`system_prompt`, `greeting`, `models`, `language`, `region`) against the live agent and show what a replace would overwrite in `renderPlan` in `cli/src/commands/push.ts` per FR-030 and SC-006 (partial) — dry-run currently shows detached references only, so the lossy half of replace is invisible
- [X] T069 Add a test in `cli/src/commands/push.test.ts` asserting the organisation and the create/update decision reach stderr before any mutating request is issued, per FR-011 and FR-032 (missing) — the existing suite cannot catch F1 or F2 because it only inspects output after the run completes
- [X] T070 Document the `singleton_exists` blocker in `spec.md` (Requirements, Edge Cases) and `data-model.md` §3 per data-model §3 (unrequested) — it is implemented and tested, and justified by [research D14](./research.md#d14--managed-singleton-types-silently-adopt-an-existing-tool), but appears in no intent artifact
- [X] T071 Reconcile `package_not_found` between `data-model.md` §3, which declares it a `Blocker` kind, and `cli/src/lib/package.ts`, which raises `PackageError` instead, per data-model §3 (partial) — FR-002 is satisfied either way, so pick one shape and make both say it

---

## Phase 8: Convergence

Appended by `/speckit-converge` on 2026-08-27, after the Phase 7 implement pass. All six Phase 7
findings verified closed in code. These three are documentation gaps that Phase 7's own additions
opened — the code is correct, the artifacts do not yet describe it.

- [X] T072 Document the subset comparison used for overwrite detection in `data-model.md` §3 per FR-030 (unrequested) — `declaredDiffers` compares only the keys the package declares, which is what keeps `models` from being flagged on every push once the platform adds `stt_kwargs` defaults, `fallbacks` and timeout fields; data-model explains the fixed field list but not this rule, and the rule is the load-bearing half
- [X] T073 Add the pre-write header to the Output streams table in `contracts/cli-commands.md` per FR-011 and FR-032 (partial) — stderr now carries the organisation and the create/update decision before the first write, and the table still lists only spinners, the shadowed-tool note and warnings
- [X] T074 Add quickstart scenarios for the overwrite warning, the "not exercised" report, and the managed-singleton refusal in `quickstart.md` per FR-030, FR-019 and FR-041 (partial) — the contract states every item is asserted in quickstart, and these three behaviours were added after quickstart was written
