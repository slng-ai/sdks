# Contract: `voiceai tool` command surface

**Date**: 2026-08-26 | **Spec**: [spec.md](../spec.md)

The CLI's public interface is its command surface. This is the contract implementation must satisfy
and tests must assert.

## `voiceai tool list`

```
voiceai tool list [--source curated|org] [--json]
```

| Aspect | Contract |
|---|---|
| Retrieval | Pages `GET /v1/agents/tools` with `limit=200`, `offset` stepping by 200, until a short page returns. Stops at `offset=10000` with a stderr warning. |
| Human stdout | Header `NAME⇥TYPE⇥SOURCE⇥VERSION`, then one tab-separated row per tool. |
| Version cell | `latest_version`, or `-` when null. |
| `--source` | Filters rows client-side; the server exposes no source filter. |
| Empty result | `no tools found.` on stdout, exit `0`. Only reachable with `--source org` — curated tools are visible to every organisation. |
| `--json` | The tool array exactly as returned, concatenated across pages, `--source` applied. No wrapper object. |
| Exit | `0` on success, `1` on any failure. |

## `voiceai tool get <tool-name>`

```
voiceai tool get <tool-name> [--source curated|org] [--json]
```

| Aspect | Contract |
|---|---|
| Resolution | `GET /v1/agents/tools?name=<name>` → 0, 1, or 2 rows. Then `GET /v1/agents/tools/{id}` on the selected row. |
| Selection | With two rows and no `--source`: pick `source === "org"`, and write to stderr `note: a curated tool named <name> is shadowed by your organisation's tool; show it with --source curated`. With `--source`: pick that row, or fail not-found. |
| Human stdout | Labelled field block, `name` and `version` first, then the remaining `ToolDetail` fields. |
| `code_src` | Human output prints `<N> lines (use --json for the source)`. Full value always present in `--json`. |
| Secrets | `declared_secrets` prints names only. The API key never appears in any output. |
| Not found | stderr `tool "<name>" not found. names are matched exactly and are case-sensitive.` Exit `1`. |
| `--json` | The single `ToolDetail` object. Never an array. |
| Exit | `0` on success, `1` on any failure. |

## Cross-cutting

| Aspect | Contract |
|---|---|
| stdout | Data only. Never spinners, notes, warnings, or errors. |
| stderr | Spinner (TTY only), notes, warnings, errors. |
| `--json` on failure | stdout is still one valid JSON document describing the failure. |
| `--profile` / `VOICEAI_API_KEY` | Honoured identically to every other subcommand. No new environment variable. |
| Invalid `--source` | Rejected by the argument parser before the action runs, like any other usage error — stderr, exit `1`, and not JSON even under `--json`. |
| Colour | Only when `process.stdout.isTTY`. |
| Help | `voiceai tool --help` documents both subcommands, `--source`, and that names match exactly and case-sensitively. |

## Error contract

| Condition | stderr | Exit |
|---|---|---|
| No API key configured | existing `requireApiKey()` message | `1` |
| `401` / `403` rejected key | `HTTP 401 · <message> · request_id=<id>` | `1` |
| `403 PUBLIC_SHARED_RESOURCES_DISABLED` | message carries the server's prose plus the machine-readable code | `1` |
| `429` | message states rate limited, plus the wait when `Retry-After` is present | `1` |
| `404` on detail | `HTTP 404 · Tool not found · request_id=<id>` | `1` |
| Name resolves to nothing | not-found message above, mentioning case-sensitivity | `1` |
| Network failure / timeout | the underlying fetch error message | `1` |

Server error bodies are `{"detail": "...", "error": {"code", "message", "request_id"}}`. Rendering
requires the `formatAgentsError` change in [research.md](../research.md) D7; without it the nested
object prints as a raw JSON blob.

The `429` row additionally requires the `retryAfter` field D7 adds to `AgentsResult`. The wait time is
carried only in the `Retry-After` response header, and the helper discards headers today.

## Wire contract consumed (not owned)

| Operation | Shape |
|---|---|
| `GET /v1/agents/tools` | `limit` 1–200 (default 100), `offset` 0–10000, `name` repeatable exact/case-sensitive → bare array of `ToolListItem` |
| `GET /v1/agents/tools/{id}` | → `ToolDetail`; `404` when absent or owned by another organisation |
| Auth | `Authorization: Bearer <key>` (verified `200`) |

These routes are mounted `include_in_schema=False`, so they are absent from the OpenAPI document and
from the generated SDK by design. This is why the CLI calls them over raw fetch.
