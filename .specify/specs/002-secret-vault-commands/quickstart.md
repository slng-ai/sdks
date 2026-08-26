# Quickstart: Validating `voiceai secret`

**Date**: 2026-08-26 | **Contract**: [contracts/cli-commands.md](./contracts/cli-commands.md)

Runnable checks that prove the feature works end to end. Every command runs from the repo root
against source — no build step.

## Prerequisites

```bash
set -a && source .env && set +a && export VOICEAI_API_KEY="$SLNG_API_KEY"
```

`.env` holds the token under `SLNG_API_KEY`; the CLI reads `VOICEAI_API_KEY`. Same token, different
name — no new environment variable is introduced by this feature.

> `.env` sets `PATH` among other things. If a later command reports `curl: command not found`, you
> sourced it into an interactive shell — open a fresh one.

Run the CLI from source:

```bash
bun run --cwd cli dev secret list
```

## Scenario 1 — List (US1, FR-002, FR-003)

```bash
bun run --cwd cli dev secret list
```

Expect a header `NAME⇥KIND⇥VALUE⇥DESCRIPTION` and one row per vault entry. Against the probed
organisation that is three rows: `FIRECRAWL_API_KEY`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, each
`secret`/`yes`/`-`. Exit `0`.

Completeness check against the platform's own count (SC-007):

```bash
bun run --cwd cli dev secret list --json | jq 'length'
curl -sS -H "Authorization: Bearer $VOICEAI_API_KEY" \
  https://api.agents.slng.ai/v1/agents/secrets | jq 'length'
```

Both numbers must match.

## Scenario 2 — Get an existing entry (US2, FR-006)

```bash
bun run --cwd cli dev secret get FIRECRAWL_API_KEY
```

Expect a labelled field block leading with `name`, `kind`, `has_value`, then description, managed
flag, revision, actors, and timestamps. **No `value` line.** Exit `0`.

## Scenario 3 — Not found and case sensitivity (FR-007, FR-011)

```bash
bun run --cwd cli dev secret get NOPE_DOES_NOT_EXIST; echo "exit=$?"
bun run --cwd cli dev secret get firecrawl_api_key; echo "exit=$?"
```

Both print a one-line not-found message on **stderr** naming the secret and stating that matching is
exact and case-sensitive, and both exit `1`. The second proves case sensitivity — that name differs
from a real entry only in case.

Exit-code gating (SC-004):

```bash
if bun run --cwd cli dev secret get FIRECRAWL_API_KEY >/dev/null 2>&1; then
  echo "present"; else echo "absent"; fi
```

## Scenario 4 — Values never leak (FR-008, SC-005) — the critical check

The platform returns decrypted plaintext for `kind: "variable"` entries (research D3), so this is a
real check, not a formality. Run it against a stub rather than the live vault:

```bash
bun test cli/src/commands/secret.test.ts
```

The suite must contain a test that stubs a `variable` entry carrying a sentinel plaintext, runs both
commands in both output modes, and asserts the sentinel appears in neither stdout nor stderr. Live
spot-check that no `value` key survives:

```bash
bun run --cwd cli dev secret list --json | jq '[.[] | has("value")] | any'   # false
bun run --cwd cli dev secret get FIRECRAWL_API_KEY --json | jq 'has("value")' # false
```

## Scenario 5 — JSON on success and on failure (US3, FR-009)

```bash
bun run --cwd cli dev secret list --json | jq -e 'type == "array"'
bun run --cwd cli dev secret get NOPE --json | jq -e '.ok == false and (.error | type == "string")'
```

Both must parse. The failing one still emits a valid JSON document on stdout and still exits `1`.

## Scenario 6 — Pipe safety (FR-010, US3)

```bash
(cd cli && bun run src/index.ts secret list > /tmp/out.txt 2>/tmp/err.txt); echo "exit=$?"
grep -c $'\t' /tmp/out.txt     # data rows present
wc -c < /tmp/err.txt           # 0 — no spinner when stderr is not a TTY
```

> Invoke `src/index.ts` directly here, not `bun run --cwd cli dev`. The `dev`
> script wrapper echoes its own `$ bun run …` banner to stderr, which is not the
> CLI's output and would make this check look like a failure.

No ANSI escape sequences in `/tmp/out.txt`:

```bash
grep -c $'\x1b' /tmp/out.txt   # 0
```

## Scenario 7 — Credential failures (FR-012, FR-013, FR-014)

Rejected key:

```bash
VOICEAI_API_KEY=zpka_bogus bun run --cwd cli dev secret list; echo "exit=$?"
```

Expect `HTTP 401 · Invalid API key · AUTH_REQUIRED · slng_request_id=…` on stderr, exit `1`.

Missing key — **`env -u VOICEAI_API_KEY` is not enough**, the CLI falls back to the profile store and
succeeds with whatever key is configured there. Isolate the config:

```bash
HOME=$(mktemp -d) XDG_CONFIG_HOME=$(mktemp -d) \
  env -u VOICEAI_API_KEY bun run --cwd cli dev secret list; echo "exit=$?"
```

Expect the existing `requireApiKey()` message naming how to supply a credential, exit `1`, and
crucially **not** an empty table that reads like an empty vault.

No output on any path contains the key:

```bash
bun run --cwd cli dev secret list 2>&1 | grep -c "$VOICEAI_API_KEY"   # 0
```

## Scenario 8 — Help (FR-016)

```bash
bun run --cwd cli dev secret --help
bun run --cwd cli dev secret get --help
```

Both must document the subcommands, `--json`, that names match exactly and case-sensitively, and that
values are never displayed.

## Full suite

```bash
bun test cli/
```

Two pre-existing failures are **not** caused by this feature — confirm they are the only ones:

- `streaming/ts/client.test.ts > rejects connect when aborted` (fails on a clean checkout)
- `bun run sync-models:check` reporting `live-models.generated.ts is stale`

## Regeneration check (Constitution II)

```bash
bun run regen && git status --porcelain
```

Must produce no diff. This feature touches no spec, no manifest, and no generator.
