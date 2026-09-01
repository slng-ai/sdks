---
description: "Task list for 004-mcp-push-validation"
---

# Tasks: Push agents with MCP references, and validate before publishing

**Input**: Design documents from `.specify/specs/004-mcp-push-validation/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/cli-commands.md](./contracts/cli-commands.md)

**Tests**: **Required, not optional.** The constitution's Development Workflow states that changes to
argument parsing MUST land with a test, and this feature adds two subcommands plus new `push` plan
output. Test tasks are written before the implementation they cover, and the 20 obligations in
[contracts/cli-commands.md](./contracts/cli-commands.md#test-obligations) are the checklist.

**Organization**: Tasks are grouped by user story so each can be implemented, tested and shipped
independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Exact file paths in every description

## Path Conventions

Single project. Everything is under `cli/` — `cli/src/commands/` for command surfaces,
`cli/src/lib/` for shared plumbing. Tests live beside the code as `*.test.ts`, per the existing
layout. No new directories.

**Two test patterns, both in `cli/src/commands/tool.test.ts`, worth copying rather than reinventing:**

- **Unit** — stub `globalThis.fetch`, call exported helpers directly. Set
  `process.env.VOICEAI_API_KEY` so `requireApiKey()` does not throw.
- **Action-level** — `Bun.serve({port: 0})` as a stub API, `Bun.spawn` the real CLI with
  `VOICEAI_AGENTS_BASE_URL` pointed at it. The only way to assert exit codes, the stdout/stderr
  split, and failure modes.

---

## Phase 1: Setup

**Purpose**: Establish a trustworthy baseline before changing anything.

- [X] T001 Run `bun test cli/` and confirm green; record the pre-existing `bun run sync-models:check` staleness in `cli/src/lib/live-models.generated.ts` as out of scope for this feature (CLAUDE.md, "Known failures that are not yours") — it is refreshed in its own commit, never bundled here

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared plumbing in `cli/src/commands/mcp.ts` that both US1 (push resolution, retry) and
US2 (`mcp run`) build on.

**⚠️ CRITICAL**: US1 and US2 cannot begin until this phase is complete. US3 is independent of it.

- [X] T002 [P] Extract `loadServers(names: string[]): Promise<McpServerDetail[]>` in `cli/src/commands/mcp.ts` — list-by-name then detail per match, returning what it found instead of calling `fail()`; rewrite the private `resolveServer` as a thin exiting wrapper over it so `mcp get` and `mcp tools` are unchanged. Every existing case in `cli/src/commands/mcp.test.ts` must pass untouched — that suite is this refactor's test
- [X] T003 [P] Add the `McpConnectResult` interface and `connectServer(id: string): Promise<AgentsResult<McpConnectResult>>` to `cli/src/commands/mcp.ts`, wrapping `POST /v1/agents/mcp-servers/{id}/connect` with no body, per [data-model §7](./data-model.md#7-mcp-run--connection-result)
- [X] T004 [P] Write failing unit tests for `isSnapshotStale` in `cli/src/commands/mcp.test.ts` — healthy with a future `next_refresh_at` is fresh; non-`healthy` status is stale; null `capability_observed_at` is stale (never probed); past `next_refresh_at` is stale; null `next_refresh_at` on a healthy server is fresh
- [X] T005 Implement `isSnapshotStale(server: McpServerDetail, now: Date): boolean` in `cli/src/commands/mcp.ts` per [data-model §2](./data-model.md#staleness), reading `next_refresh_at` and never hard-coding a five-minute window ([research D4](./research.md#d4--staleness-is-read-from-the-platform-never-hard-coded)) (depends on T004)

**Checkpoint**: MCP servers can be loaded, connected and staleness-tested from anywhere. US1 and US2 can now proceed in parallel.

---

## Phase 3: User Story 1 - Push an agent that uses MCP tools (Priority: P1) 🎯 MVP

**Goal**: `push` resolves `mcp_refs` and publishes, instead of refusing them with a reason that is not
true.

**Independent Test**: Compile a package referencing a tool on an existing MCP server, run
`push --dry-run --json`, and confirm the plan's `observed_schema_hash` is byte-identical to what
`voiceai mcp tools <server> --json` reports for that tool. Then push and read the agent back.

### Tests for User Story 1 ⚠️

> Write these first. They must FAIL before the implementation tasks below.

- [X] T006 [US1] Write failing unit tests for MCP resolution in `cli/src/commands/push.test.ts` — a reference resolves to `serverId` + the snapshot's `schemaHash`; a live agent's attachment for the same `(server_id, tool_name)` is reused with `reused: true`; anything else mints a new id through the existing `mintId` seam (contract tests 1–2)
- [X] T007 [US1] Write failing unit tests for the two MCP blockers in `cli/src/commands/push.test.ts` — unknown server name; two servers sharing the name (ambiguous, never an arbitrary pick); `tool_name` absent from the snapshot, listing what the snapshot does hold; the same on a `truncated` snapshot, whose wording must say truncated rather than assert the tool does not exist; a reference carrying neither `server` nor `server_name`; a stale snapshot yielding `mcp_stale` naming `voiceai mcp run` (contract tests 3–7)
- [X] T008 [US1] Invert the two spec-003 tests in `cli/src/commands/push.test.ts` — the package at line 258 now yields two blockers (`tool_unresolved`, `vault_missing`), not three; the test at line 681, "mcp references are refused before anything is created", becomes the test that a package with `mcp_refs` is accepted and planned. Inverted, never deleted (contract tests 10–11)
- [X] T009 [US1] Write failing unit tests for the write body and detachments in `cli/src/commands/push.test.ts` — `buildAgentBody` emits one attachment per planned reference with `attachment_id`, `server_id`, `tool_name`, `observed_schema_hash` and every carried field, and emits `[]` only when the package declares none; a live attachment the package omits appears in `mcpRemovals` and is named in the rendered plan (contract tests 8–9)
- [X] T010 [P] [US1] Write a failing action-level test in `cli/src/commands/push.test.ts` asserting that a package with no `mcp_refs` issues zero requests to `/v1/agents/mcp-servers`, using the stub server's request log (contract test 12, FR-013, SC-010)

### Implementation for User Story 1

- [X] T011 [P] [US1] Add the `PackageMcpRef` interface to `cli/src/lib/package.ts` and change `CompiledAgent.mcp_refs` from `unknown[]` to `PackageMcpRef[]`, accepting `server_name` as an alias for `server` and carrying every unnamed field verbatim in the index signature, exactly as `PackageToolRef` already does ([data-model §1](./data-model.md#1-package-input--packagemcpref))
- [X] T012 [US1] Add `PlannedMcpRef`, `PushPlan.mcpRefs`, `PushPlan.mcpRemovals` and `PlanInputs.mcpServers` to `cli/src/commands/push.ts` per [data-model §3](./data-model.md#3-plan--plannedmcpref); keep `mcpRemovals` separate from `removals`, which is typed around `tool_id`
- [X] T013 [US1] Delete the `mcp_unsupported` blocker at `cli/src/commands/push.ts:249-258`, remove the kind from `BlockerKind` and from `KIND_TITLE`, and add `mcp_unresolved` ("unresolved MCP reference") and `mcp_stale` ("MCP capability snapshot is stale") ([research D7](./research.md#d7--two-blockers-not-one-because-the-remedies-differ))
- [X] T014 [US1] Implement MCP resolution, attachment reuse keyed on `(server_id, tool_name)`, and `mcpRemovals` inside `buildPlan` in `cli/src/commands/push.ts`. `buildPlan` MUST stay pure — no I/O — so every blocker is still decided before anything can change (depends on T011, T012, T013)
- [X] T015 [US1] Fetch the referenced servers in `planPush` in `cli/src/commands/push.ts` via `loadServers([...distinct names])`, guarded on `pkg.agent.mcp_refs?.length` so a package without MCP references issues no additional request (depends on T002, T014)
- [X] T016 [US1] Replace the hardcoded `mcp_refs: []` in `buildAgentBody` at `cli/src/commands/push.ts:679-683` with the planned references. This is the silent-data-loss fix, not a cosmetic one — see [research D6](./research.md#d6--mcp_refs--is-the-data-loss-bug-hiding-behind-the-blocker) (depends on T014)
- [X] T017 [US1] Render the `MCP REFERENCES` block and add MCP detachments to the existing `WILL BE DETACHED` block, named `<server>/<tool_name>`, in `renderPlan` in `cli/src/commands/push.ts`; print the block only when the package declares MCP references (depends on T014)
- [X] T018 [US1] Add the `mcp_refs` and `mcp_removals` keys to `planJson` in `cli/src/commands/push.ts` in snake_case, spreading carried fields as `refs` already does. Do not change the shape of any existing key ([data-model §6](./data-model.md#6---json-additions)) (depends on T014)

### Retry path for User Story 1

- [X] T019 [US1] Write a failing action-level test in `cli/src/commands/push.test.ts` — the stub rejects the first agent write with the capability error and accepts the second; assert exactly one connect per distinct server, exactly one retry, the stderr note, and nothing extra on stdout (contract test 13)
- [X] T020 [US1] Implement the one-shot retry in `applyPush` in `cli/src/commands/push.ts` — on a failed agent write with MCP references in the plan and a capability-shaped failure, connect each distinct referenced server, re-read each planned reference's `schema_hash`, write once more. Emit `mcp capabilities were stale; refreshing and retrying` on stderr first. Match the named code **or** a capability-shaped message, and leave a `ponytail:` comment naming the ceiling — the match reads the code out of `formatAgentsError`'s string because `must()` discards the envelope; thread the raw `AgentsResult` through if a second capability error code ever appears ([research D5](./research.md#d5--the-capability-rejection-is-retried-once-through-a-refresh)) (depends on T003, T019)
- [X] T021 [US1] **Partially verified.** The *mechanism* is confirmed live: the platform's machine-readable code does reach the string `must()` throws — a real 422 surfaced as `… · AGENT_VALIDATION_FAILED · slng_request_id=…`, so `isCapabilityUnavailable` in `cli/src/commands/push.ts` is reading a field that exists. The exact `MCP_CAPABILITY_UNAVAILABLE` spelling is still on the reporting operator's word: inducing it means writing an agent with a deliberately stale hash into a production organisation, which was not done. The matcher accepts the code **or** a capability-shaped message, so a different spelling degrades to today's behaviour (the platform's own error plus the `mcp run` remedy) rather than to silence.

**Checkpoint**: An agent using MCP tools can be published entirely from a package. This alone is the reported defect fixed, and is shippable.

---

## Phase 4: User Story 2 - Prove an MCP server works, and refresh a stale snapshot (Priority: P2)

**Goal**: `mcp run <server-name>` connects, reports, and leaves the snapshot fresh.

**Independent Test**: Read `capability_observed_at` via `mcp get --json`, run `mcp run`, read it again
— it must have moved to within seconds of now, with `next_refresh_at` a few minutes ahead.

### Tests for User Story 2 ⚠️

- [X] T022 [P] [US2] Write failing unit tests for the tool-name diff in `cli/src/commands/mcp.test.ts` — names present now but absent before are `added`; names absent now but present before are `removed`; an unchanged set yields neither; a server with no previous snapshot reports every tool as a first probe rather than as an addition (contract test 17)
- [X] T023 [P] [US2] Write failing action-level tests for `mcp run` in `cli/src/commands/mcp.test.ts` — success exits `0` with the field block on stdout and the spinner on stderr; an unreachable server exits `1` with the platform's reason on stderr and nothing on stdout; an unknown name exits `1` with the same wording `mcp get` uses; `--json` on failure leaves stdout one valid JSON document (contract tests 14–16)

### Implementation for User Story 2

- [X] T024 [US2] Implement `diffToolNames(previous: McpTool[] | null, current: McpTool[])` in `cli/src/commands/mcp.ts`, returning `{ added, removed, firstProbe }` (depends on T022)
- [X] T025 [US2] Implement the `run <server-name>` subcommand in `cli/src/commands/mcp.ts` — resolve by name, read the detail for the previous snapshot, connect, render the `server`/`status`/`serving`/`protocol`/`tools`/`changes` field block in the same 26-column layout `printServer` uses; `--json` emits the connect response plus `added` and `removed`; exit `0` only when `status` is `connected` (depends on T002, T003, T024)
- [X] T026 [US2] Add `run` to the `COMMANDS`, `EXAMPLES` and `NOTES` sections of the `mcp` help epilogue in `cli/src/commands/mcp.ts`, stating that a successful run refreshes the capability snapshot (depends on T025)

**Checkpoint**: US1 and US2 both work independently, and US1's `mcp_stale` message now names a command that exists.

---

## Phase 5: User Story 3 - Prove a tool works before publishing (Priority: P3)

**Goal**: `tool run <tool-name>` executes one catalogue tool with an operator-supplied input.

**Independent Test**: Run a known-good catalogue tool with a known-good input and confirm the reported
outcome matches what the dashboard reports for the same tool.

**Note**: Independent of Phases 2–4. Can be built in parallel with US1 and US2 by a second developer.

### Tests for User Story 3 ⚠️

- [X] T027 [P] [US3] Write failing action-level tests for `tool run` in `cli/src/commands/tool.test.ts` — without `--confirm-side-effects` nothing is executed (assert the stub received no run request) and it exits `1` with the consent message on stderr; input arrives over stdin; a completed run with `status: "failed"` exits `1` and returns the run result itself under `--json`; an unknown name exits `1` with the same wording `tool get` uses; the input document is never echoed to stdout or stderr (contract tests 18–20, Principle V)

### Implementation for User Story 3

- [X] T028 [P] [US3] Move the `RunResult` interface from `cli/src/commands/push.ts` to `cli/src/commands/tool.ts` and export it, updating push's import. `push.ts` already imports `listAllTools` and `ToolListItem` from `tool.ts`, so the dependency direction is unchanged
- [X] T029 [US3] Implement input reading in `cli/src/commands/tool.ts` — `--input <path>` reads that file, `--input -` reads stdin, with neither flag stdin is read when it is not a TTY, otherwise `{}`. A parse failure names the file (or `stdin`) and the error, exits `1`, and executes nothing (depends on T027)
- [X] T030 [US3] Implement the `run <tool-name>` subcommand in `cli/src/commands/tool.ts` — resolve by name, require `--confirm-side-effects`, `POST /v1/agents/tools/{id}/run` with `{ sample_input, confirm_side_effects: true }`, print `status` plus `error` / `validation` indented for multi-line values, exit `0` only on `succeeded` (depends on T028, T029)
- [X] T031 [US3] Add `run` to the `COMMANDS`, `EXAMPLES` and `NOTES` sections of the `tool` help epilogue in `cli/src/commands/tool.ts`, stating that running a tool reaches its real dependencies (depends on T030)

**Checkpoint**: All three stories independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T032 [P] Rewrite the paragraph at `cli/README.md:315` — packages carrying `mcp_refs` are now resolved rather than refused; describe the name→id and cached-hash resolution, and name `voiceai mcp run` as the remedy for a stale snapshot
- [X] T033 [P] Update the `push` help epilogue in `cli/src/commands/agents.ts` — remove any claim that MCP is unsupported and note that MCP references resolve by server name
- [X] T034 [P] Add `voiceai mcp run <server>` and `voiceai tool run <tool>` example lines to the `ROOT_EPILOGUE` in `cli/src/flags.ts`
- [X] T035 [P] Add a one-line superseded-by pointer to this feature's contract on the `mcp_refs` row at `.specify/specs/003-agent-package-push/contracts/cli-commands.md:282`, and beside D8 in `.specify/specs/003-agent-package-push/research.md`. Do not rewrite 003 — it is the record of what was believed then, and [research D1](./research.md#d1--d8-of-spec-003-is-wrong-and-this-is-exactly-how) is the correction
- [X] T036 Run `bun test cli/` and confirm the full suite is green, including the two inverted tests from T008
- [X] T037 Walk [quickstart.md](./quickstart.md) §4–§8 against the live organisation, checking each row of its Definition of Done table. Delete the throwaway agent created in §6 when finished

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: no dependencies
- **Foundational (Phase 2)**: depends on Phase 1 — **blocks US1 and US2**, does not block US3
- **US1 (Phase 3)**: depends on Phase 2
- **US2 (Phase 4)**: depends on Phase 2 — independent of US1
- **US3 (Phase 5)**: depends on Phase 1 only — fully independent
- **Polish (Phase 6)**: depends on the stories being shipped are complete

### User Story Dependencies

- **US1 (P1)** — no dependency on US2 or US3. The retry path uses `connectServer` from Phase 2, not the `mcp run` command, so US1 ships without US2.
- **US2 (P2)** — no dependency on US1 or US3.
- **US3 (P3)** — no dependency on anything but Phase 1.

**One honest caveat**: US1's `mcp_stale` blocker message names `voiceai mcp run`. Ship US1 alone and
that message points at a command that does not exist yet. US1 is still *functionally* independent —
the Phase 2 retry clears the stale case automatically — but US1 and US2 belong in the same release.

### Within US1

Tests (T006–T010) → types (T011, T012) → blockers (T013) → plan (T014) → everything that reads the
plan (T015–T018, parallelisable in principle but all in `push.ts`) → retry test (T019) → retry
(T020) → verify the code string (T021).

### Parallel Opportunities

| Set | Tasks | Why safe |
|---|---|---|
| Foundational | T002, T003, T004 | T002/T003 add separate exports; T004 is a test file |
| US1 entry | T010, T011 | `push.test.ts` vs `package.ts` |
| US2 tests | T022, T023 | written together, both in `mcp.test.ts`, one author |
| US3 entry | T027, T028 | `tool.test.ts` vs `tool.ts` |
| Docs | T032, T033, T034, T035 | four different files |
| **Whole stories** | US1 ‖ US2 ‖ US3 | three developers, three command files |

**Not parallel**: T012–T020 all edit `cli/src/commands/push.ts`. One author, sequential.

---

## Parallel Example: after Phase 2

```bash
# Three developers, three command surfaces, no shared file:
Developer A: T006–T021  (US1)  cli/src/commands/push.ts  + push.test.ts
Developer B: T022–T026  (US2)  cli/src/commands/mcp.ts   + mcp.test.ts
Developer C: T027–T031  (US3)  cli/src/commands/tool.ts  + tool.test.ts
```

`mcp.ts` is touched by both Phase 2 and US2 — finish Phase 2 and merge before Developer B starts.

---

## Implementation Strategy

### MVP first (US1 only)

1. Phase 1 (T001)
2. Phase 2 (T002–T005) — blocking
3. Phase 3 (T006–T021)
4. **STOP and VALIDATE**: quickstart §6 — the hash comparison is the whole proof
5. Ship. The reported defect is fixed.

### Recommended first release (US1 + US2)

Add Phase 4 before releasing, so the `mcp_stale` message names a real command. Roughly 26 tasks.

### Incremental delivery

1. Phase 1 + Phase 2 → foundation
2. + US1 → publish MCP agents from a package **(MVP)**
3. + US2 → diagnose and refresh servers; the stale message becomes actionable
4. + US3 → validate any catalogue tool
5. + Phase 6 → docs and help text match the behaviour

---

## Notes

- `[P]` = different files, no dependencies on incomplete tasks
- Tests are written before the implementation they cover, and must fail first
- Commit after each task or logical group; `bun test cli/` before each commit
- **Nothing under `specs/` is edited** — those routes are `include_in_schema=False` by design and are
  reached through `cli/src/lib/agents.ts` (constitution, Principle I)
- **No generated file is edited** — this feature needs no `bun run regen` (Principle II)
- Do not bundle a `sync-models` refresh into any commit here (CLAUDE.md)
