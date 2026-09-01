# Contract: `voiceai mcp run`, `voiceai tool run`, and `agents push` with MCP references

**Date**: 2026-09-01 | **Spec**: [spec.md](../spec.md) | **Data model**: [data-model.md](../data-model.md)

The CLI's public interface is its command surface. This is the contract implementation must satisfy
and tests must assert. It extends, and does not replace,
[003's contract](../003-agent-package-push/contracts/cli-commands.md) — whose last row, "push a
package with `mcp_refs` → refused in pre-flight", this document **supersedes**.

---

## `voiceai mcp run <server-name>`

```
voiceai mcp run <server-name> [--json]
```

| Aspect | Contract |
|---|---|
| Resolution | `GET /v1/agents/mcp-servers?name=<name>` → one row, then `GET /v1/agents/mcp-servers/{id}` for the *previous* snapshot. Exactly as `mcp get` and `mcp tools` already resolve. |
| Action | `POST /v1/agents/mcp-servers/{id}/connect`, no body. |
| Request count | Three. The detail read is what makes the added/removed diff possible; without it the command could report a count but not a change. |
| Human stdout | Labelled field block, one field per line, same 26-column layout `printServer` uses: `server`, `status`, `serving`, `protocol`, `tools`, `changes`. |
| `status` cell | `connected in 1060 ms` on success; the platform's status verbatim otherwise. |
| `serving` cell | `<server_info.name> <server_info.version>`, or `-` when the server sends neither. |
| `changes` cell | `none`; or `+firecrawl_extract, -firecrawl_deep_research`; or `first probe — 26 tools discovered` when there was no previous snapshot. |
| Side effect | A successful connect leaves `capability_observed_at` set to now. This is the documented remedy for `mcp_stale` and the reason the command exists. It is **not** announced as a side effect in the output — the freshness *is* the success. |
| Not found | stderr `mcp server "<name>" not found. names are matched exactly and are case-sensitive.` Exit `1`. Identical wording to `mcp get`. |
| Unreachable / auth rejected | stderr carries the platform's own reason via `formatAgentsError`. Exit `1`. |
| `--json` | The connect response object, plus `added: string[]` and `removed: string[]`. One object, never an array. |
| `--json` on failure | `{ "ok": false, "error": "…" }` — one valid document, exit `1`, matching `mcp list` / `mcp get`. |
| Exit | `0` only when `status` is `connected`. |

**Example**

```
$ voiceai mcp run firecrawl-mcp-2
server                    firecrawl-mcp-2 (dc517114-1e63-4bc5-b4ad-d2a6c67754f3)
status                    connected in 1060 ms
serving                   firecrawl-fastmcp 3.24.1
protocol                  2025-03-26
tools                     26
changes                   none
```

---

## `voiceai tool run <tool-name>`

```
voiceai tool run <tool-name> [--input <file>|-] [--confirm-side-effects] [--json]
```

| Aspect | Contract |
|---|---|
| Resolution | `GET /v1/agents/tools?name=<name>` → one row. Exactly as `tool get` resolves. |
| Action | `POST /v1/agents/tools/{id}/run` with `{ sample_input, confirm_side_effects: true }`. |
| Input source | `--input <path>` reads that file; `--input -` reads stdin; with neither flag, stdin is read when it is not a TTY; otherwise `sample_input` is `{}`. |
| Invalid input JSON | stderr names the file (or `stdin`) and the parse error. Exit `1`. **Nothing is executed.** |
| Consent | Without `--confirm-side-effects`, nothing is executed. stderr: `running <name> executes the tool against your real dependencies. re-run with --confirm-side-effects to consent.` Exit `1`. |
| Human stdout | `status <status>`, then `error` / `validation` when present, each indented if multi-line. |
| Failure detail | The platform's `error` verbatim, indented so a code tool's Python traceback stays inside its field. |
| Schema violation | The platform's `validation` text, which names the offending fields. |
| Not found | stderr `tool "<name>" not found. names are matched exactly and are case-sensitive.` Exit `1`. |
| `--json` | The run result object as returned. One object, never an array. |
| `--json` on failure | `{ "ok": false, "error": "…" }`, exit `1`. A run that *completed* with `status: "failed"` returns the run result itself and exits `1` — the run is data, not a transport error. |
| Exit | `0` only when `status` is `succeeded`. `failed` and `timed_out` both exit `1`. |
| Secrets | The input document is never echoed back to stdout or stderr. It may carry a secret; the command has no reason to print it. |

**Examples**

```
$ echo '{"url":"https://slng.ai"}' | voiceai tool run fetch_page --confirm-side-effects
status        succeeded

$ voiceai tool run fetch_page --input bad.json --confirm-side-effects
status        failed
error         HTTPError: 404 Not Found
                at fetch_page.py line 12
$ echo $?
1
```

---

## `voiceai agents push <dir>` — MCP behaviour

No new flags. The existing `--dry-run`, `--json`, `--run-samples`, `--agent-id` and `--label` are
unchanged.

### Planning

| Aspect | Contract |
|---|---|
| Extra reads | Only when `agent.json` declares at least one `mcp_ref`. A package with none issues **exactly** the requests it issues today (SC-010). |
| Read shape | One list-by-name for all distinct server names, then one detail per matched server. |
| Server resolution | Exact, case-sensitive, on `mcp_refs[].server` (alias `server_name`). |
| Hash | `observed_schema_hash` ← the snapshot's `capabilities.tools[].schema_hash` for the matching `tool_name`. The CLI never connects to the MCP server to compute it. |
| Attachment id | Reused from the live agent when it already has an attachment for that `(server_id, tool_name)`; otherwise minted locally, via the same seam `tool_refs` uses. |
| Purity | `buildPlan` stays pure. Every MCP blocker is decided before any write, like every other blocker. |

### Blockers

| Kind | Condition | Detail names |
|---|---|---|
| `mcp_unresolved` | no server of that name / more than one / `tool_name` absent from the snapshot / neither `server` nor `server_name` present | the reference at fault; for a missing tool, the names the snapshot does contain; when the snapshot is `truncated`, that it was truncated rather than that the tool does not exist |
| `mcp_stale` | a referenced server's snapshot is stale per [data-model §2](../data-model.md#staleness) | the server, its status, when it was last observed, and `voiceai mcp run <name>` as the remedy |

`mcp_unsupported` is removed from `BlockerKind` and from `KIND_TITLE`. Blockers still accumulate in
one pass; nothing is created or changed when any fires.

### Rendered plan (`--dry-run`)

A new block, after `REFERENCES`, printed only when the package declares MCP references:

```
MCP REFERENCES
  firecrawl-mcp-2 firecrawl_map      attachment 4bff2987  reused
  firecrawl-mcp-2 firecrawl_search   attachment 5a366921  new
```

MCP detachments join the existing `WILL BE DETACHED` block, distinguished by naming the server:

```
WILL BE DETACHED
  firecrawl-mcp-2/firecrawl_search   attachment 5a366921 — not declared by this package
```

### Writing

| Aspect | Contract |
|---|---|
| Body | `mcp_refs` carries one object per planned reference: `attachment_id`, `server_id`, `tool_name`, `observed_schema_hash`, plus every field the package carried. |
| No references declared | `mcp_refs: []` — today's behaviour, and today's documented replace semantics. |
| Replace is lossy | An MCP attachment the package does not declare **is** removed. It is named in `WILL BE DETACHED` first, every time. |
| Capability rejection | The write is retried **once**: connect each distinct referenced server, re-read each planned reference's `schema_hash`, write again. One retry, not a loop. |
| Retry failure | The platform's own error, plus the `mcp run` remedy. The partial-failure report is unchanged in shape. |
| Retry visibility | A note on stderr before the retry: `mcp capabilities were stale; refreshing and retrying`. Never silent — an operator watching a push must be able to explain the extra second. |

### `--json`

Two new keys, `mcp_refs` and `mcp_removals`, shapes in
[data-model §6](../data-model.md#6---json-additions). No existing key changes shape.

---

## Cross-cutting

Identical to [001's contract](../001-tool-catalog-commands/contracts/cli-commands.md), restated
because these are the rows tests assert:

| Aspect | Contract |
|---|---|
| stdout | Data only. Never spinners, notes, warnings, or errors. |
| stderr | Spinner (TTY only), notes, warnings, errors. |
| `--json` on failure | stdout is still one valid JSON document describing the failure. |
| `--profile` / `VOICEAI_API_KEY` | Honoured identically to every other subcommand. No new environment variable. |
| Colour | Only when `process.stdout.isTTY`. |
| Help | `voiceai mcp --help` and `voiceai tool --help` document `run` with a worked example. The root epilogue in `flags.ts` gains one line each. |

## Error contract

| Condition | stderr | Exit |
|---|---|---|
| No API key configured | existing `requireApiKey()` message, no stack trace | `1` |
| `401` / `403` rejected key | `HTTP 401 · <message> · request_id=<id>` | `1` |
| `403 PUBLIC_SHARED_RESOURCES_DISABLED` | the server's prose plus the machine-readable code | `1` |
| `429` | rate limited, plus the wait when `Retry-After` is present | `1` |
| MCP server unreachable (`mcp run`) | the platform's connect error verbatim | `1` |
| Tool run not `succeeded` (`tool run`) | `status` plus the platform's `error` / `validation` | `1` |

## Test obligations

Per the constitution's Development Workflow — changes to argument parsing land with a test.

| # | Test | Pattern |
|---|---|---|
| 1 | `buildPlan` resolves a reference to `server_id` + `schema_hash` | unit |
| 2 | `buildPlan` reuses a live attachment id for an unchanged `(server_id, tool_name)` | unit |
| 3 | Unknown server name → one `mcp_unresolved` naming the reference | unit |
| 4 | Two servers share the name → `mcp_unresolved`, not an arbitrary pick | unit |
| 5 | Unknown `tool_name` → `mcp_unresolved` listing what the snapshot holds | unit |
| 6 | Unknown `tool_name` on a `truncated` snapshot → wording says truncated | unit |
| 7 | Stale snapshot → `mcp_stale` naming `mcp run` | unit |
| 8 | Live attachment the package omits → `mcpRemovals`, and named in the render | unit |
| 9 | `buildAgentBody` emits the planned `mcp_refs`, not `[]` | unit |
| 10 | **Inverted from 003 T012**: vault + tool + MCP package now yields two blockers, not three | unit |
| 11 | **Inverted from 003 T022**: a package with `mcp_refs` is no longer refused | action-level |
| 12 | Package with no `mcp_refs` issues no MCP request | action-level, assert request log |
| 13 | Capability rejection → one connect per server, one retry, then success | action-level |
| 14 | `mcp run` success: exit `0`, fields on stdout, spinner on stderr | action-level |
| 15 | `mcp run` on an unreachable server: exit `1`, platform reason on stderr | action-level |
| 16 | `mcp run --json` on failure: stdout is one valid JSON document | action-level |
| 17 | `mcp run` reports added/removed against the previous snapshot | unit |
| 18 | `tool run` without `--confirm-side-effects`: nothing executed, exit `1` | action-level |
| 19 | `tool run` reads its input from stdin | action-level |
| 20 | `tool run` with `status: "failed"`: exit `1`, error on stdout under `--json` | action-level |
