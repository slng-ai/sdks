# Phase 1 Data Model: Secret Vault Commands

**Date**: 2026-08-26 | **Spec**: [spec.md](./spec.md) | **Research**: [research.md](./research.md)

Both commands are stateless reads. There is no local persistence, no cache, and no config key. The
only model is the wire shape the CLI consumes and the redacted shape it emits.

## `VaultEntry` — consumed from the platform

One shape serves both endpoints: `GET /v1/agents/secrets` returns a bare array of it, and
`GET /v1/agents/secrets/{name}` returns exactly one. There is no separate list-row/detail split, so
unlike `voiceai tool` there is no second request to enrich a row.

| Field | Type | Notes |
|---|---|---|
| `id` | `string` (uuid) | Not used for addressing — the vault is name-addressed. |
| `organisation_id` | `string` (uuid) | Always the caller's own organisation; isolation is server-side. |
| `name` | `string` | The user-facing identity. Exact, case-sensitive. Conventionally `SCREAMING_SNAKE_CASE`. |
| `kind` | `"secret" \| "variable"` | See Kind below. Drives what the platform discloses. |
| `description` | `string \| null` | Free text, often null. |
| `value` | `string \| null` | **Never surfaced.** `null` for secrets; plaintext for variables. Stripped at the boundary — see Redaction. |
| `has_value` | `boolean` | Whether a value is stored. This is the answer to "is the secret available?". |
| `is_managed` | `boolean` | True when the platform provisions the entry rather than the organisation. |
| `revision` | `number` | Increments on rotation. `1` for an entry never rotated. |
| `created_by` | `string \| null` | Clerk user id (`user_…`) or consumer API key id. Null when an internal actor is hidden. |
| `last_rotated_by` | `string \| null` | Same domain as `created_by`. |
| `last_rotated_at` | `string \| null` (ISO 8601) | Null when never rotated. |
| `created_at` | `string` (ISO 8601) | |
| `updated_at` | `string` (ISO 8601) | |

Typed by hand in the command file, as `ToolListItem` is, because these routes are
`include_in_schema=False` and never reach the generated SDK.

## Kind

| Kind | Platform discloses value? | Meaning |
|---|---|---|
| `secret` | No — `value` is always `null` | Write-once credential. Set it, rotate it, never read it back. |
| `variable` | **Yes — decrypted plaintext** | Non-sensitive configuration living in the same vault. |

Both kinds appear in `secret list` and are reachable by `secret get`. `kind` is a displayed column
because it tells the user whether an entry is a credential or a config value, and because the two
behave differently everywhere else in the platform.

## Redaction — the one invariant that matters

`value` is stripped from every record before anything is written to any stream. One function, applied
once, at the point the response is received:

```
redact(entry) → { ...entry, value: undefined }
```

Applied to both the human renderer and the `--json` renderer, and to both `list` and `get`. Not a
per-renderer branch and not a per-kind branch — a single boundary, so no future output path can
forget it.

This is not defensive theatre. `kind: variable` genuinely returns plaintext (research D3), so
`--json` without redaction would print a live vault value to stdout. Constitution Principle V.

Validation, per FR-008 and SC-005: seed a stubbed response with a sentinel plaintext under a
`variable` entry, run both commands in both output modes, assert the sentinel appears in no stream.

## Derived display values

| Display | Source | Rule |
|---|---|---|
| Value-present cell | `has_value` | `yes` / `no`. Never blank, never a bare boolean that reads as a name. |
| Description cell | `description` | `-` when null or empty. |
| Managed cell | `is_managed` | Shown on `get`; omitted from the `list` table to keep it four columns. |
| Rotation | `last_rotated_at`, `last_rotated_by` | `-` when null — an entry at revision 1 has never been rotated. |
| Any null / empty field | any | `-`, matching `voiceai tool`'s `summarise`. |

## Not modelled

- **Pagination state.** The list endpoint is unpaginated and ignores `limit`/`offset` (research D4).
- **Source / curated tier.** Vault entries have no curated variant, so no collision and no
  `--source` (research D6).
- **References.** `GET /{name}/references` is live but out of scope (spec FR-001, research D6).
- **Write state.** Create, rotate, describe, and delete are out of scope.
