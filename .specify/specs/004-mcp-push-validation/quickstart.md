# Quickstart: validating this feature

**Date**: 2026-09-01 | **Spec**: [spec.md](./spec.md) | **Contract**: [contracts/cli-commands.md](./contracts/cli-commands.md)

Runnable checks that prove the feature works. Scenarios 1–3 need only the test suite; 4–7 hit the
live API and are the acceptance pass.

## Prerequisites

```bash
bun test cli/                         # must be green before you start
```

Credentials — note the trap documented in CLAUDE.md: **`.env` and the default profile resolve to
different organisations**, so set the key explicitly rather than relying on the profile store.

```bash
set -a && source .env && set +a && export VOICEAI_API_KEY="$SLNG_API_KEY"
bun run --cwd cli dev whoami          # confirm which org you are about to write to
```

Everything below runs from source. No build step.

---

## 1. The suite, including the two inverted tests

```bash
bun test cli/
```

**Expect**: green. Two tests from spec 003 now assert the opposite of what they used to —
`push.test.ts:258` yields two blockers where it once yielded three, and `push.test.ts:681` asserts an
MCP package is *accepted*. If either still asserts refusal, the inversion was skipped.

Known failure that is **not yours**: `bun run sync-models:check` reporting
`live-models.generated.ts is stale`. It predates this work. Refresh it in its own commit, never
bundled here.

---

## 2. No MCP references means no MCP requests (SC-010)

```bash
bun test cli/src/commands/push.test.ts -t "no mcp request"
```

**Expect**: the request log from the stub server contains no `/v1/agents/mcp-servers` path. This is
the regression guard for the overwhelmingly common package.

---

## 3. Every blocker still lands before any write

```bash
bun test cli/src/commands/push.test.ts -t "blocker"
```

**Expect**: a package with a missing vault entry *and* an unresolved MCP reference reports both in one
pass, and the stub server records zero mutating requests. `buildPlan` must have stayed pure.

---

## 4. `mcp run` against a real server

```bash
bun run --cwd cli dev mcp list                      # pick a server name
bun run --cwd cli dev mcp run <server-name>
echo $?
```

**Expect**: exit `0`, and a field block naming the server, `connected in <n> ms`, what the server calls
itself, the protocol version, the tool count, and a `changes` line.

Then prove the refresh, which is the whole point:

```bash
bun run --cwd cli dev mcp get <server-name> --json | jq -r '.capability_observed_at, .next_refresh_at'
```

**Expect**: `capability_observed_at` is within seconds of now, and `next_refresh_at` is a few minutes
ahead. Compare against the same two fields read *before* the run — they must have moved.

Failure path, without needing a broken server:

```bash
bun run --cwd cli dev mcp run definitely-not-a-server
echo $?
```

**Expect**: exit `1`, and `not found. names are matched exactly and are case-sensitive.` on **stderr**
with nothing on stdout.

```bash
bun run --cwd cli dev mcp run definitely-not-a-server --json | jq .
```

**Expect**: stdout parses. `--json` must stay one valid document on failure.

---

## 5. `tool run` against a real tool

Consent gate first — the check that must fail:

```bash
bun run --cwd cli dev tool run <tool-name>
echo $?
```

**Expect**: exit `1`, nothing executed, and stderr explaining that running the tool reaches your real
dependencies and how to consent.

Then the real thing, input over a pipe (Principle III):

```bash
echo '{"…": "…"}' | bun run --cwd cli dev tool run <tool-name> --confirm-side-effects
echo $?
```

**Expect**: `status succeeded` and exit `0`; or the platform's `error` / `validation` text and exit
`1`. A tool whose input does not satisfy its `arg_schema` must name the offending fields, not just
say "invalid".

---

## 6. Push a package with MCP references — the acceptance test

This is the journey the spec exists for. Build a minimal package that references a tool on a real
server:

```bash
mkdir -p /tmp/mcp-push-check
cat > /tmp/mcp-push-check/agent.json <<'JSON'
{
  "name": "slng-cli-mcp-check",
  "system_prompt": "You are a test agent for CLI MCP push validation.",
  "tool_refs": [],
  "mcp_refs": [
    { "server": "firecrawl-mcp-2", "tool_name": "firecrawl_map", "invocation": "model" }
  ]
}
JSON
```

Plan it first — nothing is written:

```bash
bun run --cwd cli dev agents push /tmp/mcp-push-check --dry-run
```

**Expect**: an `MCP REFERENCES` block naming the server, the tool, the attachment id and `new`. No
blocker. The closing line says nothing was changed.

```bash
bun run --cwd cli dev agents push /tmp/mcp-push-check --dry-run --json \
  | jq '.mcp_refs[] | {server, tool_name, observed_schema_hash, reused}'
```

**Expect**: `observed_schema_hash` is 64 hex characters. Prove it was **read, not invented**:

```bash
bun run --cwd cli dev mcp tools firecrawl-mcp-2 --json \
  | jq -r '.[] | select(.name=="firecrawl_map") | .schema_hash'
```

**Expect**: byte-identical to the plan's `observed_schema_hash`. This single comparison is the
refutation of spec 003's D8 and the core of the whole feature.

Then push for real, and read it back:

```bash
bun run --cwd cli dev agents push /tmp/mcp-push-check --json | jq -r '.agent.id'
bun run --cwd cli dev agents get <that-id> --json | jq '.mcp_refs'
```

**Expect**: one attachment carrying `server_id`, `tool_name`, `observed_schema_hash` and the
`invocation` the package declared.

Push again unchanged:

```bash
bun run --cwd cli dev agents push /tmp/mcp-push-check --dry-run
```

**Expect**: the same attachment id, now marked `reused`. A second push must not churn the attachment.

**Clean up** — this created an agent in a real organisation:

```bash
bun run --cwd cli dev agents delete <that-id>
```

---

## 7. Nothing is silently detached (SC-007)

The regression this feature could most easily have introduced. Take an agent whose MCP servers were
attached in the dashboard, and dry-run a package that does **not** declare them:

```bash
bun run --cwd cli dev agents push <package-without-mcp-refs> --dry-run
```

**Expect**: a `WILL BE DETACHED` block naming each MCP attachment as `<server>/<tool_name>`. If that
block is empty while the live agent has MCP attachments, `buildAgentBody` is still sending
`mcp_refs: []` unannounced — stop and fix it before shipping. See
[research D6](./research.md#d6--mcp_refs--is-the-data-loss-bug-hiding-behind-the-blocker).

---

## 8. The stale-snapshot path

Hard to induce on demand: it needs a server whose snapshot has aged past `next_refresh_at`, which
resolves itself in minutes. Two ways to reach it.

**Deterministically, in a test** (this is the one that must exist):

```bash
bun test cli/src/commands/push.test.ts -t "capability"
```

**Expect**: the stub rejects the first agent write with the capability error, the CLI connects each
referenced server exactly once, retries the write exactly once, and succeeds. A note appears on
stderr; nothing extra appears on stdout.

**Opportunistically, live**: find a server whose `next_refresh_at` is in the past —

```bash
bun run --cwd cli dev mcp list --json \
  | jq -r '.[] | select(.capability_status != "healthy") | .name'
```

— then push a package referencing it and confirm the `mcp_stale` blocker names `voiceai mcp run`.
Run that command, push again, and expect it to proceed.

---

## Definition of done

| Check | Proves |
|---|---|
| §1 green, both inversions present | FR-001, and 003's tests were updated rather than deleted |
| §2 no MCP request without MCP refs | FR-013, SC-010 |
| §3 both blockers in one pass, zero writes | SC-006 |
| §4 `capability_observed_at` moves | FR-017, SC-003 |
| §5 consent gate refuses | FR-022 |
| §6 hashes match byte for byte | FR-003, SC-001 |
| §6 second push reuses the attachment | FR-005 |
| §7 detachments named first | FR-008, SC-007 |
| §8 one connect, one retry | FR-011, SC-004 |
| §4–§6 `--json` parses on success and failure | FR-019, FR-024, SC-009 |
