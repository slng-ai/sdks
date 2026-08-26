# Contract: `voiceai secret` command surface

**Date**: 2026-08-26 | **Spec**: [spec.md](../spec.md) | **Data model**: [data-model.md](../data-model.md)

The CLI's public interface is its command surface. This is the contract implementation must satisfy
and tests must assert.

## `voiceai secret list`

```
voiceai secret list [--json]
```

| Aspect | Contract |
|---|---|
| Retrieval | One `GET /v1/agents/secrets`. No paging — the route ignores `limit`/`offset` and returns every entry (research D4). |
| Human stdout | Header `NAME⇥KIND⇥VALUE⇥DESCRIPTION`, then one tab-separated row per entry. |
| Value cell | `yes` when `has_value`, `no` otherwise. Never blank, never the value itself. |
| Description cell | `description`, or `-` when null or empty. |
| Ordering | Server order, unchanged. |
| Empty vault | `no secrets found.` on stdout, exit `0`. |
| `--json` | The entry array as returned, with `value` stripped from every element. No wrapper object. |
| Exit | `0` on success, `1` on any failure. |

## `voiceai secret get <secret-name>`

```
voiceai secret get <secret-name> [--json]
```

| Aspect | Contract |
|---|---|
| Resolution | One `GET /v1/agents/secrets/{encodeURIComponent(name)}`. No list-then-detail — the vault is name-addressed. |
| Human stdout | Labelled field block. `name`, `kind`, `has_value` first, then the remaining fields. |
| `value` | Absent from the field block and absent from `--json`, for both kinds. |
| Unpopulated entry | `has_value: no` is rendered plainly; the command still exits `0` — the entry exists. |
| Not found (`404`) | stderr `secret "<name>" not found. names are matched exactly and are case-sensitive.` Exit `1`. |
| `--json` | The single redacted entry object. Never an array. |
| Exit | `0` on success, `1` on any failure, including not-found. |

## Cross-cutting

| Aspect | Contract |
|---|---|
| Redaction | `value` is stripped once, at the response boundary, before any renderer sees the record. Applies to both commands, both kinds, both output modes, and every error path. |
| stdout | Data only. Never spinners, notes, warnings, or errors. |
| stderr | Spinner (TTY only), warnings, errors. |
| `--json` on failure | stdout is still one valid JSON document describing the failure: `{"ok": false, "error": "<message>"}`. |
| `--profile` / `VOICEAI_API_KEY` | Honoured identically to every other subcommand. No new environment variable. |
| API key | Never printed, in any stream, on any path. |
| Colour | Only when `process.stdout.isTTY`. |
| Help | `voiceai secret --help` documents both subcommands, that names match exactly and case-sensitively, and that values are never displayed. |

## Error contract

| Condition | stderr | Exit |
|---|---|---|
| No API key configured | existing `requireApiKey()` message | `1` |
| `401` rejected key | `HTTP 401 · Invalid API key · AUTH_REQUIRED · slng_request_id=<id>` | `1` |
| `403 PUBLIC_SHARED_RESOURCES_DISABLED` | server prose plus the machine-readable code | `1` |
| `429` | states rate limited, plus the wait when `Retry-After` is present | `1` |
| `404` on `get` | the not-found message above, mentioning case-sensitivity | `1` |
| `404` unexpected elsewhere | `formatAgentsError` output | `1` |
| Network failure / timeout | the underlying fetch error message | `1` |

Rendered by the existing `formatAgentsError`, unchanged. It already unwraps the nested envelope and
already appends the `Retry-After` wait (research D2).

## Wire contract consumed (not owned)

| Operation | Shape |
|---|---|
| `GET /v1/agents/secrets` | no parameters → bare array of `VaultEntry` |
| `GET /v1/agents/secrets/{name}` | exact, case-sensitive name in the path → `VaultEntry`; `404 RESOURCE_NOT_FOUND` when absent or owned by another organisation |
| Auth | `Authorization: Bearer <key>` |
| Error body | `{"detail": "...", "error": {"code", "message", "request_id"}}` |

`value` in `VaultEntry` is `null` for `kind: "secret"` and **decrypted plaintext** for
`kind: "variable"`. The CLI strips it either way. This is the reason redaction is a contract item and
not an implementation detail.

These routes are mounted `include_in_schema=False`, so they are absent from the OpenAPI document and
from the generated SDK by design. This is why the CLI calls them over raw fetch.

## Not in this contract

`--source` (no curated tier for vault entries), `--reveal` (no value disclosure at all in this
feature), and `secret references` (live server-side, out of scope). See research D6.
