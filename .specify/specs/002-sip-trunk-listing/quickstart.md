# Quickstart & Validation: SIP Trunk Listing

**Feature**: [spec.md](./spec.md) · **Contract**: [contracts/cli-commands.md](./contracts/cli-commands.md) · **Date**: 2026-08-26

Runnable checks that prove the feature works end to end. Scenarios 1–3 need the live API; 4–10 run
against a local stub and need no credential. Together they cover every functional requirement.

## Prerequisites

- Bun ≥ 1.2, repo checked out, `bun install` done.
- A `.env` holding `SLNG_API_KEY` for Scenarios 1–3.
- `jq` for the JSON assertions.

The CLI runs from source — no build step:

```bash
bun run --cwd cli dev trunks list
```

Export the credential under the name the CLI actually reads:

```bash
set -a && source .env && set +a && export VOICEAI_API_KEY="$SLNG_API_KEY"
```

---

## Live scenarios

### Scenario 1 — The list appears, both directions (US1, FR-002, FR-003)

```bash
bun run --cwd cli dev trunks list
```

**Expected**: a header row, then one tab-separated line per trunk. Against the probed organisation,
two rows — one `inbound` (`test2slng`), one `outbound` (`nicotestslng`) — each carrying
`+441423803084`, status `active`, usable `yes`. Exit 0.

**Fails if**: directions are conflated, a trunk appears twice, or any cell is blank rather than `-`.

### Scenario 2 — stdout is clean, stderr carries the note (FR-008, FR-012)

```bash
bun run --cwd cli dev trunks list > /tmp/out.txt 2> /tmp/err.txt; echo "exit=$?"
grep -c . /tmp/out.txt                       # rows, header included
grep -i "not visible here" /tmp/err.txt      # the completeness note
grep -ci "note:" /tmp/out.txt                # MUST be 0
```

**Expected**: exit 0; the note appears exactly once on stderr and never on stdout; stdout holds no
spinner control characters, because it is not a TTY.

### Scenario 3 — `--json` parses, and carries the merged shape (US3, FR-011)

```bash
bun run --cwd cli dev trunks list --json | jq -e 'type == "array"'
bun run --cwd cli dev trunks list --json | jq -r '.[] | "\(.direction)\t\(.name)\t\(.usable)"'
bun run --cwd cli dev trunks list --json 2>/dev/null | jq -e 'all(has("in_use_by"))'
bun run --cwd cli dev trunks list --json 2>&1 >/dev/null | grep -ci "note:"   # MUST be 0
```

**Expected**: parses first try; every element has the nine fields of
[data-model.md §2](./data-model.md); the completeness note is suppressed under `--json`.

---

## Stub-server scenarios

These follow the action-level pattern already in `cli/src/commands/tool.test.ts`: `Bun.serve({port: 0})`
as a fake API, `Bun.spawn` the real CLI with `VOICEAI_AGENTS_BASE_URL` pointed at it. They assert exit
codes and the stdout/stderr split, which unit tests cannot see, and they induce failures that cannot
be produced against a healthy organisation.

### Scenario 4 — Merge recovers an inbound trunk hidden from other agents (FR-007, research D3/D4)

**Stub**: two agents, `A` and `B`. `A`'s response returns inbound trunk `T` with `is_current: true`;
`B`'s response omits `T` entirely (as the real backend does — it would be
`assigned_to_another_agent`). Both return the same outbound trunk `O` with `is_current: false`.

**Expected**: output holds exactly two trunks. `T` appears once, `usable yes`, `IN USE BY` naming
agent `A`. `O` appears once, `IN USE BY` `-`.

**Fails if**: `T` is missing (proving a single-agent read was used), or `O` is duplicated.

### Scenario 5 — Usable-somewhere beats unusable-here (FR-005, data-model §2)

**Stub**: agent `A` reports trunk `X` as `selectable: false`, `unavailable_reason:
"different_livekit_project"`. Agent `B` reports the same `X` as `selectable: true`.

**Expected**: one row for `X`, `USABLE` = `yes`, and no reason shown — the reason was agent-relative.

### Scenario 6 — An unrecognised reason survives (FR-005)

**Stub**: one agent, one trunk, `selectable: false`,
`unavailable_reason: "some_future_reason_we_have_never_seen"`, `is_current: true`.

**Expected**: `USABLE` = `no (some_future_reason_we_have_never_seen)`. The string is printed verbatim,
not dropped, not blanked, not replaced with "unknown".

### Scenario 7 — Zero agents is a named failure, not an empty list (FR-009, FR-013)

**Stub**: `GET /v1/agents` returns `[]`.

**Expected**: exit 1. stderr explains that trunks cannot be enumerated because the organisation has no
agent to read them through. stdout does **not** contain `no trunks found`.

**Fails if**: the command exits 0 with an empty table — the false negative FR-009 exists to prevent.

### Scenario 8 — Zero trunks is a success (FR-013)

**Stub**: one agent, both lists empty.

**Expected**: exit 0, stdout `no trunks found.`, the completeness note on stderr.

### Scenario 9 — Failures are distinguishable and JSON stays parseable (FR-017, FR-018, FR-011)

**Stub**: a 401 `AUTH_REQUIRED` run, a 429 with `Retry-After: 30`, and a mid-fan-out 500.

**Expected**:

- 401 → exit 1, message says the credential was rejected, includes the request id.
- 429 → exit 1, message says rate limited and mentions the 30-second wait.
- 500 mid-fan-out → exit 1, and stdout does **not** contain a partial table (FR-020).
- Each of the three, re-run with `--json`, emits a parseable document on stdout: `jq -e . ` succeeds.

### Scenario 10 — No output ever contains a credential (FR-015, FR-016)

Across every scenario above, success and failure, with and without `--json`:

```bash
{ stdout; stderr; } | grep -c "$VOICEAI_API_KEY"   # MUST be 0
```

**Expected**: zero matches. Mirrors the equivalent assertion in `tool.test.ts`. Research D9 establishes
that no SIP credential field reaches the CLI at all, so this test guards the API key specifically.

---

## Option validation

```bash
bun run --cwd cli dev trunks list --direction inbound     # exit 0, inbound rows only
bun run --cwd cli dev trunks list --direction outbound    # exit 0, outbound rows only
bun run --cwd cli dev trunks list --direction sideways    # exit non-zero, names valid values
```

## Full suite

```bash
bun test cli/
```

**Expected**: all green. Two failures documented in `CLAUDE.md` predate this work and are not in
`cli/` — `streaming/ts/client.test.ts > rejects connect when aborted`, and a stale
`live-models.generated.ts` from `bun run sync-models:check`. Neither is touched here; do not bundle a
model-catalogue refresh into this feature.

## Requirement coverage

| Requirement | Covered by |
|---|---|
| FR-001 command tree | Contract; help output |
| FR-002, FR-003 org-wide list | Scenario 1, 4 |
| FR-004 empty-cell placeholder | Scenario 1 |
| FR-005 reason passthrough | Scenario 5, 6 |
| FR-006 in-use marking | Scenario 4 |
| FR-007 exactly once | Scenario 4 |
| FR-008 completeness note | Scenario 2, 3 |
| FR-009 no-agents failure | Scenario 7 |
| FR-010 direction filter | Option validation |
| FR-011 `--json` | Scenario 3, 9 |
| FR-012 stream discipline | Scenario 2 |
| FR-013 exit codes | Scenario 7, 8 |
| FR-014 credentials | Prerequisites; stub env |
| FR-015, FR-016 no secrets | Scenario 10 |
| FR-017, FR-018 distinguishable errors | Scenario 9 |
| FR-019 help text | Contract; `--help` review |
| FR-020 no partial results | Scenario 9 |
