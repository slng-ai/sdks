# Quickstart & Validation: Push an agent package

**Feature**: [spec.md](../spec.md) · **Contract**: [contracts/cli-commands.md](./contracts/cli-commands.md) · **Date**: 2026-08-27

How to run the feature, and the scenarios that prove it works. Shapes live in
[data-model.md](./data-model.md); decisions and their evidence in [research.md](./research.md).

---

## Prerequisites

The CLI runs from source — no build step:

```bash
bun run --cwd cli dev agents push --help
```

Credentials resolve `VOICEAI_API_KEY` → active profile → `~/.config/voiceai/config.json`.

**This repository's `.env` and default profile are different organisations.** Set the key explicitly
when probing live, or you will read the wrong org's catalogue:

```bash
set -a && source .env && set +a && export VOICEAI_API_KEY="$SLNG_API_KEY"
```

The example package is not in every worktree — `examples/` is untracked, so it exists in the main
checkout and is not copied into new worktrees. Point at the main checkout, or compile a package with
`unmute compile`.

---

## Run it

```bash
bun run --cwd cli dev agents push ../../examples/slng-support --dry-run
```

Then, once it reports clean:

```bash
bun run --cwd cli dev agents push ../../examples/slng-support
```

---

## Manual validation

### 1. Dry run changes nothing (FR-009, FR-010, SC-002)

The core guarantee. Capture the organisation before and after and diff.

```bash
bun run --cwd cli dev agents list --json  > /tmp/before-agents.json
bun run --cwd cli dev tool list --json    > /tmp/before-tools.json
bun run --cwd cli dev secret list --json  > /tmp/before-secrets.json

bun run --cwd cli dev agents push ../../examples/slng-support --dry-run

bun run --cwd cli dev agents list --json  | diff /tmp/before-agents.json  -
bun run --cwd cli dev tool list --json    | diff /tmp/before-tools.json   -
bun run --cwd cli dev secret list --json  | diff /tmp/before-secrets.json -
```

**Expected**: three empty diffs. Run the same triple after a *blocker* exit — it must also be clean.

### 2. Name resolution and the real collision (FR-022, FR-027, D10)

`end_call` exists twice in the probed org: curated `952eb6b1…` v1, and org `fd25f5c5…` v3.

```bash
bun run --cwd cli dev agents push ../../examples/slng-support --dry-run --json \
  | jq '.refs[] | {name, tool_id, version, shadowed}'
```

**Expected**: `tool_id` is the **org** one (`fd25f5c5…`) at version 3, `shadowed: "curated"`, and a
note on **stderr** that a curated tool of the same name is shadowed. No bare name survives anywhere
in `.refs`.

### 3. Missing vault entries are reported together, with kind checked (FR-005, FR-012, D4)

Compile a package whose tool declares two secrets the org lacks.

**Expected**: both names in one message with `https://app.slng.ai/vault/secrets`, exit 1, nothing
created. Then create **one of them as `kind: variable`** and re-run: it must still be reported as
missing, because the platform's gate counts secrets only.

### 4. Unresolvable tool name (FR-007, FR-013)

Edit a compiled `agent.json` to reference `lookup_order_typo`.

**Expected**: that name, the rename-or-create instruction, and `https://app.slng.ai/tools`. Exit 1,
nothing created.

### 5. Every problem in one run (FR-008, SC-003)

A package with a missing vault entry *and* an unresolved tool name.

**Expected**: both blocks in a single run. Fixing one and re-running must reveal no new class of
problem — the first run was already complete.

### 6. Create, then update the same agent (FR-028, FR-029, SC-005)

```bash
bun run --cwd cli dev agents push ../../examples/slng-support --json | jq -r '.agent.id'
bun run --cwd cli dev agents push ../../examples/slng-support --json | jq '.agent.action'
```

**Expected**: first run `"create"`, second `"update"`, **same id**. `agents list` shows one agent of
that name, not two.

### 7. Attachment identity survives an unchanged push (FR-024, SC-005)

```bash
AID=$(bun run --cwd cli dev agents push ../../examples/slng-support --json | jq -r '.agent.id')
bun run --cwd cli dev agents get "$AID" --json | jq -r '.tool_refs[].attachment_id' > /tmp/att1
bun run --cwd cli dev agents push ../../examples/slng-support >/dev/null
bun run --cwd cli dev agents get "$AID" --json | jq -r '.tool_refs[].attachment_id' | diff /tmp/att1 -
```

**Expected**: empty diff. A re-push must not churn attachment identity.

### 8. Replace detaches what the package dropped, and warns first (FR-029, FR-030, SC-006)

Attach a second tool in the dashboard, then dry-run.

**Expected**: a `WILL BE DETACHED` block naming it. Then push for real and confirm `agents get`
no longer carries it. The warning must appear **before** the removal is possible — that is the only
protection replace semantics leave.

### 9. A no-op push labels nothing (D9)

Push twice with no edits.

**Expected**: the second run reports `version  unchanged` and does **not** relabel the previous
version. `GET /versions` shows the same `version_number` and its original label.

### 10. Samples: the blocker, and the consent gate (FR-018, D6, D7)

With a package shipping a `code` tool:

| Setup | Expected |
|---|---|
| no `samples/check_order.json` | blocker naming the tool and the file to write; nothing created |
| sample present, no `--run-samples` | blocker naming the flag; nothing created |
| sample present, `--run-samples`, run succeeds | tool created → introspected → ran → published; agent references the published version |
| sample present, `--run-samples`, run fails | push stops; **agent not created**; report names the tool and the failure |

The last row is FR-018. Verify `agents list` does not contain the agent afterwards, and that the
report says which tools were left behind (FR-021).

### 11. Ambiguous agent name (FR-031) — NOT PERFORMABLE

**Do not attempt this scenario.** The platform enforces unique agent names per organisation;
`agents create` refuses a duplicate with `AGENT_NAME_CONFLICT`, and soft-deleted agents do not
appear in `agents list`. The collision cannot be constructed
([D16](./research.md#d16--agent-names-are-unique-so-fr-031-is-a-guard-not-a-path)).

What *is* testable is the flag's real use:

```bash
bun run --cwd cli dev agents push <pkg> --dry-run --agent-id <id-of-a-differently-named-agent>
```

**Expected**: the push targets that id and reports `update`, ignoring the package's name. The
`agent_ambiguous` blocker itself is covered by a unit test against a stub, which is the only
place two same-named agents can exist.

### 12. Composition and secrecy (FR-036, FR-037, FR-038, FR-040, SC-009, SC-010)

```bash
bun run --cwd cli dev agents push ../../examples/slng-support --dry-run --json 2>/dev/null | jq .
bun run --cwd cli dev agents push /tmp/not-a-package --json 2>/dev/null | jq .ok
bun run --cwd cli dev agents push ../../examples/slng-support --dry-run 2>&1 | grep -i "secret\|token\|key"
```

**Expected**: valid JSON with stderr discarded; `false` on the failure path (parseable on failure);
and the third command prints vault **names** only — never a value. Run every scenario with stdin
closed and stderr not a TTY: no scenario may block waiting for input.

### 13. Package location (FR-001, FR-002)

```bash
bun run --cwd cli dev agents push ../../examples/slng-support --dry-run              # root
bun run --cwd cli dev agents push ../../examples/slng-support/build/slng --dry-run   # compiled
bun run --cwd cli dev agents push /tmp --dry-run                                     # neither
```

**Expected**: the first two behave identically. The third names **both** searched paths.

### 14. What a replace would overwrite (FR-030, SC-006)

Replace semantics are lossy, and this is the operator's only warning. Push once, edit the package's
prompt, then dry-run:

```bash
bun run --cwd cli dev agents push <pkg> --dry-run
```

**Expected**: a `WILL BE OVERWRITTEN` block naming `system_prompt`, **and nothing else**.

The "nothing else" half is the real assertion. Push an *unmodified* package and the block must not
appear at all. This failed live on the first attempt: `models` was reported as overwritten on every
push, because the platform returns the object enriched with `stt_kwargs: {punctuate: true}`,
`fallbacks`, four timeout fields and `failure_audio_enabled` that the package never wrote. A warning
that always fires is one nobody reads. A stub server cannot catch this — it echoes back what it was
sent — so this check only means something against the live API.

### 15. A tool nothing ran says so (FR-019)

Push a package shipping a context-bound tool body, which publishes without a run.

**Expected**: the outcome line reads `created, not exercised, published v1`. A blank where the run
status belongs reads as "fine", which is exactly what FR-019 forbids.

### 16. A managed singleton is refused, not adopted (FR-041, D14)

Ship a tool body of type `end_call`, `send_sms` or `transfer_call` in a package, against an
organisation that already has one of that type.

**Expected**: a blocker naming the shipped tool, its type, and the tool the organisation already
holds. Exit 1, nothing created.

**Why this one matters more than it looks**: `POST /v1/agents/tools` for these types does not create
anything when the org already has one — it returns the **existing** tool, ignoring the requested
name, with a 201. Publishing that result cuts a new version of a shared production tool. Verify the
existing tool's `latest_version` is unchanged afterwards:

```bash
bun run --cwd cli dev tool list --source org
```

Publish is content-addressed, so identical content returns the existing version and hides the
damage. Do not read "the version did not change" as proof the blocker worked — check that the
blocker fired.

---

## Automated tests

Both patterns come from `cli/src/commands/tool.test.ts`.

### Unit — pure, no network

`lib/package.ts` and the planner take fixtures and return `PushPlan` / `Blocker[]`, so most of the
feature is testable without a server:

- location resolution: root, compiled dir, neither (FR-001, FR-002)
- vault name derivation per `tool_type` — `declared_secrets` for `code`, `auth.secret_name` plus
  `headers[].secret_name` for `api_request`, none otherwise ([D5](./research.md#d5--which-vault-names-does-a-package-depend-on))
- a `kind: "variable"` entry does **not** satisfy a required secret (D4)
- blocker accumulation: three independent problems yield three blockers, not one
- ref building: `tool` key removed; `description` / `invocation` / `argument_overrides` preserved
  byte-for-byte (FR-026); no bare name survives
- attachment reuse: same `tool_id` on the live agent reuses its `attachment_id`; a new tool mints one
- removal diff: a live ref the package omits appears in `removals`
- `needsGreenRun` is true for `code` and `api_request`, false for context-bound types
- label derivation is ≤120 chars

Stub `globalThis.fetch` and set `process.env.VOICEAI_API_KEY` so `requireApiKey()` does not throw.

### Action-level — real CLI against a stub server

`Bun.serve({port: 0})` + `Bun.spawn` with `VOICEAI_AGENTS_BASE_URL` pointed at it. The only way to
assert exit codes, the stdout/stderr split, and failures that cannot be induced against a healthy
org:

- exit 1 + zero mutating requests received on every blocker class (the stub asserts this — it is the
  strongest form of SC-002)
- `--json` parseable on both success and failure (FR-037)
- the shadowed-tool note is on **stderr**, the result on stdout (FR-038)
- publish returning **409 with a `PublishResult` body** is rendered as gate failures, not as a
  generic error envelope — it is not an error shape
  ([D3](./research.md#d3--what-are-the-tool-lifecycle-contracts))
- a failed run aborts before the agent request is sent (FR-018) — assert the stub never receives
  `POST /v1/agents`
- `confirm_side_effects: true` is present on `/run` **only** when `--run-samples` was passed, and no
  `/run` request arrives without it (D6)
- a partial failure reports what was left behind (FR-021)
- no `/run` and no mutating call is made during `--dry-run`
- the platform's own error, including the field it names, is surfaced verbatim (FR-035)
- the organisation and the create/update decision reach **stderr before the first mutating
  request** (FR-011, FR-032) — this one freezes the first non-GET on the stub and samples stderr at
  that instant, because every other test here reads stderr after exit and cannot tell "before" from
  "after"
- a shipped body for a managed singleton type the org already holds is refused (FR-041, D14)
- `planJson` publishes snake_case keys and no internal name (`toolId`, `attachmentId`,
  `packagePath`, `existingId`) survives the boundary — this is the machine-facing contract and
  it drifted precisely because nothing pinned it
- the success report does not repeat the organisation the pre-write header just named
- a name at or over the column width keeps a separating space (`push_test_webhookcreate`)
- `toolWriteBody` strips `declared_secrets` / `dependencies` for non-`code` types (D17)
- the partial report files a created-then-failed tool under DONE, names the right remedy, and
  prints the platform error once (FR-021a)
- `declaredDiffers` ignores keys the platform added but the package never declared, so `models` is
  not reported as overwritten on every push (FR-030)

Per the constitution (Development Workflow), the argument-parsing surface — `--dry-run`,
`--run-samples`, `--agent-id`, `--label`, `--json` — must land with tests.

---

## Known failures that are not yours

Both predate this work (CLAUDE.md):

- `streaming/ts/client.test.ts > rejects connect when aborted` fails on a clean checkout.
- `bun run sync-models:check` reports `live-models.generated.ts is stale`. Refresh in its own commit,
  never bundled into a feature.

### 17. An `api_request` tool derives vault names from two places (D5, D17)

Ship a webhook body whose `auth.secret_name` **and** one `config.headers[].secret_name` name
entries the organisation does not have.

**Expected**: both names in one `missing vault entries` block, sorted. Then point them at real
secrets and push with `--run-samples`:

**Expected**: `created, ran (succeeded), published v1` — note **no** `introspected`, which is a
`code`-only step.

If the package carries `declared_secrets` or `dependencies` on this tool, the push must still
succeed: the platform rejects those two fields on any non-`code` type, and `push` strips them
([D17](./research.md#d17--declared_secrets-and-dependencies-are-code-only)). Before that fix
the operator got `HTTP 422 · Request validation failed. Fix the highlighted fields` naming no
fields at all — verify the fields are now listed by breaking the body deliberately.

### 18. The abort report accounts for what it left behind (FR-021, FR-021a)

Ship a `code` tool whose sample raises, and push with `--run-samples`.

**Expected**, exactly:

- `DONE` lists the tool as `created, introspected, ran (failed)` — it exists in the
  organisation now, and reporting `DONE (nothing)` above "the tools above still exist" is the
  contradiction this guards against
- `NOT DONE` carries the traceback, indented so the list survives
- the closing line reads `created but not published; you can delete them` — **not** "cannot be
  unpublished", which would be false
- the traceback appears **once**
- `agents get` shows the agent's `tool_refs` byte-identical to before the push

Confirm the last point by capturing `tool_refs` before and after and diffing; a passing exit
code is not the assertion here, an untouched agent is.

### 19. Deleting a tool an agent still references (operational note)

`DELETE /v1/agents/tools/<id>` returns **409** while a live agent references the tool. Delete
the agent first, then the tool. This matters when cleaning up after a test round.