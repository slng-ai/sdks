# Phase 1 Data Model: Tool Catalog Commands

**Date**: 2026-08-26 | **Spec**: [spec.md](./spec.md) | **Research**: [research.md](./research.md)

Both shapes below are read-only projections of what the platform returns. The CLI defines them as
TypeScript interfaces in `cli/src/lib/tools.ts`; it does not persist, cache, or mutate them.

## ToolListItem — one row of `GET /v1/agents/tools`

Field names and nullability confirmed against the live endpoint.

| Field | Type | Notes |
|---|---|---|
| `id` | `string` (UUID) | Identity for the follow-up detail request. Not shown in human output. |
| `name` | `string` | Not unique on its own — unique only with `source`. |
| `tool_type` | `string` | Observed: `api_request`, `code`, `end_call`, `send_sms`, `transfer_call`, `current_datetime`, `voicemail_detection`, `user_phone_number`. Treated as an open string, never an exhaustive union. |
| `description` | `string` | May be empty. |
| `last_run_status` | `string \| null` | |
| `source` | `"curated" \| "org"` | Closed set. Part of identity. |
| `latest_version` | `number \| null` | `null` = never published. Renders as `-`. |
| `config_valid` | `boolean \| null` | |
| `arg_schema` | `object \| null` | JSON Schema for the tool's arguments. |

## ToolDetail — `GET /v1/agents/tools/{id}`

Superset of the row above. Keys confirmed live:

`id`, `organisation_id`, `name`, `tool_type`, `config`, `description`, `declared_secrets`,
`dependencies`, `argument_defaults`, `code_src`, `last_run_status`, `source`, `latest_version`,
`content_hash`, `is_current_hash_green`, `is_current_version`, `schema_stale`, `arg_schema`,
`gate_status`.

Fields the list row does not carry, and the reason FR-006 needs this second request:

| Field | Type | Notes |
|---|---|---|
| `organisation_id` | `string` (UUID) | |
| `config` | `object \| null` | Type-specific configuration; for `api_request` holds the URL and parameter schema. |
| `declared_secrets` | `string[]` | **Secret names only, never values.** Safe to print. |
| `dependencies` | `string[]` | |
| `argument_defaults` | `object` | |
| `code_src` | `string \| null` | Can be long. Human output prints a line count and a pointer to `--json`; the full value is always in `--json`. |
| `content_hash` | `string` | |
| `is_current_hash_green` | `boolean` | Current content passed its last run. |
| `is_current_version` | `boolean` | Current content matches the published version. |
| `schema_stale` | `boolean` | `arg_schema` no longer matches the code. |
| `gate_status` | `object` | Keys observed: `static`, `green_run`, `config_valid`, `code_environment`, `content_current`. Nested shape varies by tool type, so it is rendered generically and passed through verbatim in `--json`. |

## Derived concepts

**Tool identity** = (`name`, `source`). Two tools may share a name; `end_call`, `send_sms`, and
`transfer_call` already do in the probed organisation. Every lookup path must carry `source`.

**Version** = `latest_version`. Absent means unpublished, not zero.

## Validation rules

| Rule | Source | Enforced |
|---|---|---|
| `<tool-name>` is required and non-empty | FR-006 | CLI, before any request |
| `--source` accepts only `curated` or `org` | FR-006b | CLI, before any request |
| Name matching is exact and case-sensitive | Server behaviour, confirmed live | Server; the CLI's not-found message says so |
| `latest_version` absent renders as `-` | FR-004 | CLI |
| An API key is present | FR-011 | `requireApiKey()`, existing |
| The key is never printed | FR-012 | CLI — no code path writes the key to stdout or stderr |

## Non-entities

No local state is introduced: no cache, no config keys, no persisted tool records. Every invocation
reads live. Both commands are pure reads — no CLI path in this feature issues a write.
