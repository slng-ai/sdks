# Quickstart: Validating Tool Catalog Commands

**Date**: 2026-08-26 | **Spec**: [spec.md](./spec.md) | **Contract**: [contracts/cli-commands.md](./contracts/cli-commands.md)

Run from the repository root. Every scenario below was chosen because it can actually fail; each maps
to a requirement in the spec.

## Prerequisites

```bash
bun install
```

Export the credential under the name the CLI reads. `SLNG_API_KEY` in `.env` and `VOICEAI_API_KEY`
hold the same token:

```bash
export VOICEAI_API_KEY="$(grep -m1 '^SLNG_API_KEY=' .env | cut -d= -f2- | tr -d '"'"'"')"
```

Verify the credential before blaming the feature:

```bash
bun run --cwd cli dev whoami
```

## Automated check

```bash
bun test cli/
```

Must pass before the feature is considered done — the constitution requires a test for argument-parsing
changes. Coverage: collision selection, multi-page assembly, null-version rendering, `--source`
filtering, exit codes.

## Scenario 1 — List with versions (FR-002/003/004, SC-001)

```bash
bun run --cwd cli dev tool list
```

Expected: header `NAME TYPE SOURCE VERSION`, then one row per tool. The probed organisation returns
17 rows — 13 `curated`, 4 `org` — and 7 of them show `-` in the version column because they have
never been published. A `0` in that column is a defect.

## Scenario 2 — Source filter (FR-005)

```bash
bun run --cwd cli dev tool list --source org
```

Expected: only `org` rows. `--source curated` returns the complement, and the two counts sum to the
unfiltered total.

## Scenario 3 — Get one tool (FR-006, SC-002)

```bash
bun run --cwd cli dev tool get api_request
```

Expected: name and version first, then description, type, source, argument schema, declared secret
names, dependencies, and gate status. `code_src` shows a line count, not the whole body.

## Scenario 4 — Name collision (FR-006a/006b)

`end_call`, `send_sms`, and `transfer_call` already exist as both curated and organisation tools, so
this needs no setup:

```bash
bun run --cwd cli dev tool get end_call
bun run --cwd cli dev tool get end_call --source curated
bun run --cwd cli dev tool get end_call 2>/dev/null   # stdout only
```

Expected: the first prints the `org` tool and writes a shadowing note **to stderr**; the second prints
the `curated` tool with no note; the third shows the note is absent from stdout. One tool in each
case, never two.

## Scenario 5 — Not found and case sensitivity (FR-007)

```bash
bun run --cwd cli dev tool get nope_missing; echo "exit=$?"
bun run --cwd cli dev tool get API_REQUEST;  echo "exit=$?"
```

Expected: both `exit=1`, both messages state that names are matched exactly and case-sensitively. The
second is the trap — the server returns an empty array rather than an error, so a naive implementation
reports success.

## Scenario 6 — Scriptable output (FR-008/009, SC-006)

```bash
bun run --cwd cli dev tool list --json | jq -e '.[0].name'
bun run --cwd cli dev tool get api_request --json | jq -e '.latest_version'
bun run --cwd cli dev tool get nope_missing --json | jq -e '.' ; echo "exit=$?"
bun run --cwd cli dev tool list | cut -f4          # version column alone
```

Expected: `list --json` is an array, `get --json` is a single object (never an array, even on a
collision), the failing `--json` run still emits parseable JSON, and `cut -f4` yields the version
column — proving no spinner or colour leaked into stdout.

## Scenario 7 — Failure modes (FR-013, SC-004)

```bash
# Unsetting the env var is NOT enough — the CLI falls back to the profile store
# in ~/.config/voiceai/config.json, so on a configured machine this still succeeds.
# Isolate HOME to actually reach the no-credential path.
TMPHOME=$(mktemp -d)
env -u VOICEAI_API_KEY HOME="$TMPHOME" XDG_CONFIG_HOME="$TMPHOME/.config" \
  bun run --cwd cli dev tool list; echo "exit=$?"
rm -rf "$TMPHOME"

VOICEAI_API_KEY=slng_invalid bun run --cwd cli dev tool list; echo "exit=$?"
VOICEAI_AGENTS_BASE_URL=http://127.0.0.1:9 bun run --cwd cli dev tool list; echo "exit=$?"
```

Expected: three distinct messages — missing credential, rejected credential (with `request_id`), and
connection failure — each exiting `1`. An empty table that resembles "you have no tools" is a defect.
The rejected-credential message must not contain the key.

Profile selection is inherited, but confirm it is not broken for the new group:

```bash
bun run --cwd cli dev --profile nonexistent tool list; echo "exit=$?"
```

Expected: the same profile behaviour as `voiceai agents list` under an unknown profile.

The remaining two failure modes in FR-013 — `403` with `PUBLIC_SHARED_RESOURCES_DISABLED` and `429`
with `Retry-After` — cannot be induced against a healthy organisation. Cover them with a stubbed
`fetch` in `cli/src/commands/tool.test.ts` and assert that the first says retrying will not help and
the second reports the wait.

## Scenario 8 — Pagination (FR-002, SC-005)

The probed organisation has 17 tools, well under one page, so paging cannot be proven here. Cover it
in `cli/src/commands/tool.test.ts` with a stubbed `fetch` returning a full 200-row page followed by a
short page, and assert the command issues the second request and returns all rows.
