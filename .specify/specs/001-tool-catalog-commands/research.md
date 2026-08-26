# Phase 0 Research: Tool Catalog Commands

**Date**: 2026-08-26 | **Spec**: [spec.md](./spec.md)

All open questions were resolved against the live production API
(`https://api.agents.slng.ai`) with the organisation credential in `.env`, using read-only `GET`
requests. Findings below are observed, not inferred.

## Live probe results

| Probe | Result |
|---|---|
| `GET /v1/agents/tools` with `Authorization: Bearer <key>` | `200` |
| `GET /v1/agents/tools` with `x-slng-api-key: <key>` | `200` |
| Response envelope | bare JSON array of `ToolListItem`, no wrapper object |
| Rows visible to this org | 17 — 13 `curated`, 4 `org` |
| Name collisions in this org | **3 already exist**: `end_call`, `send_sms`, `transfer_call` each appear as both `curated` and `org` |
| `latest_version` null | 7 of 17 rows |
| `?name=api_request&name=nope_missing` | returns only `api_request`; unknown names are ignored, not an error |
| `?name=API_REQUEST` | `[]` — matching is exact and case-sensitive, as documented |
| `GET /v1/agents/tools/{unknown-uuid}` | `404` with body `{"detail": "...", "error": {"code": "RESOURCE_NOT_FOUND", "message": "...", "request_id": "..."}}` |

The endpoints are already deployed to production, so this feature does not have to wait on a backend
release.

## D1 — Transport: raw `agentsRequest`, not the generated SDK

**Decision**: Call the endpoints through the existing `agentsRequest` helper in
[cli/src/lib/agents.ts](cli/src/lib/agents.ts), the same path `voiceai agents` uses.

**Rationale**: The public shared-resource routers are mounted with `include_in_schema=False`
(`app/api/public_shared_resources.py` in slng-ai/backend#688), so these operations will never appear
in the OpenAPI document, never reach the vendored `specs/`, and never reach the Stainless-generated
SDK. Constitution Principle I forbids hand-editing `specs/` to add them, and Principle II forbids
hand-editing generated SDK output. Raw fetch is the only route that respects both.

**Alternatives considered**: Wait for the endpoints in `voiceai-sdk` — rejected, they are excluded
from the schema by design. Add them to `specs/agents/agents.oas.yaml` by hand — rejected, violates
Principle I.

## D2 — Authentication: unchanged

**Decision**: No change to credential resolution. `requireApiKey()` and the `Authorization: Bearer`
header that `agentsRequest` already sends are sufficient.

**Rationale**: The gateway accepted `Authorization: Bearer` with a `slng_`-prefixed key and returned
`200`. `SLNG_API_KEY` and `VOICEAI_API_KEY` hold the same token, so the developer exports it under the
name the CLI already reads. Spec FR-011 forbids introducing a second variable name.

**Alternatives considered**: Send `x-slng-api-key` (also returns `200`) — rejected, it would make the
`tool` group the only subcommand authenticating differently from every other one.

## D3 — Repeated `name` query parameters

**Decision**: Widen `AgentsRequestOptions.query` to accept `string[]` and use
`searchParams.append` for array values, keeping `set` for scalars.

**Rationale**: `agentsRequest` currently builds queries with `searchParams.set`, which cannot emit the
repeated `?name=` the filter requires. The change is roughly three lines, is backward compatible with
every existing caller, and lets `tool get` resolve a name in a single request instead of paging the
whole catalogue and filtering locally.

**Alternatives considered**: Fetch all pages and filter client-side — rejected; correct at 17 tools,
but it turns one request into up to 50 at the server's 10,000-row ceiling. Build the URL by hand
inside the tool command — rejected, duplicates transport logic the helper already owns.

## D4 — Resolving `tool get <name>` to a full record

**Decision**: Two requests. First `GET /v1/agents/tools?name=<name>` to resolve the name to zero, one,
or two rows; then `GET /v1/agents/tools/{id}` on the selected row for the complete record.

**Rationale**: The detail endpoint is keyed by UUID, not name — there is no by-name detail route. The
list row (`ToolListItem`) omits `config`, `code_src`, `declared_secrets`, `dependencies`,
`argument_defaults`, `content_hash`, and `gate_status`, all of which FR-006 requires.

**Selection rule** (FR-006a/006b): with two rows, prefer `source === "org"` and write one stderr line
naming the shadowed curated tool. `--source` forces a side and turns a non-match into the standard
not-found error. This is not hypothetical — three names already collide in the probed organisation.

**Alternatives considered**: Print the list row only — rejected, fails FR-006. Print both full records
— rejected by the spec's clarification; it would also force `--json` to emit an array for a command
whose contract is one tool.

## D5 — Pagination

**Decision**: Page with `limit=200` (the server's documented maximum), incrementing `offset` by 200
until a page returns fewer than 200 rows. Stop at `offset = 10000`, the server's maximum, and emit a
stderr warning if that ceiling is reached.

**Rationale**: FR-002 and SC-005 require completeness, and the server caps `limit` at 200 and `offset`
at 10,000. Silently truncating at the ceiling would violate SC-004; a warning makes the boundary
visible.

**Alternatives considered**: A single `limit=200` request — rejected, silently truncates any
organisation with more than 200 tools.

## D6 — Output shape

**Decision**: Reuse the `row()` tab-separated helper and the uppercase header line from
[cli/src/commands/agents.ts](cli/src/commands/agents.ts). `tool list` prints
`NAME  TYPE  SOURCE  VERSION`; `tool get` prints a labelled field block like `printAgent`.

**Rationale**: SC-003 asks for one record per line, cuttable by column. Matching `agents list` exactly
means no new convention for users to learn and no new helper to maintain.

**`latest_version` rendering**: `null` renders as `-`. Seven of the seventeen live tools have no
version, so this is the common case, and `-` cannot be misread as version zero (FR-004).

## D7 — Error rendering

**Decision**: Two changes in `cli/src/lib/agents.ts`. First, extend `formatAgentsError` to unwrap a
nested error object before falling back to its current behaviour: read `error.message`, `error.code`,
and `error.request_id` when `data.error` is an object. Second, add `retryAfter?: string` to
`AgentsResult` and populate it from the `Retry-After` response header in `agentsRequest`.

**Rationale**: The helper's current shape assumption is `{ error: string, slng_request_id }`. The
shared-resource endpoints return `{ detail, error: { code, message, request_id } }`, so today
`d.error` is an object and gets rendered as a raw JSON blob. Unwrapping it satisfies FR-013 and
FR-014, and improves every existing `agents` subcommand at the same time.

**Why the header capture is needed**: `AgentsResult` is `{ok, status, data, error}` — it discards
response headers entirely. The spec's rate-limit edge case and the CLI contract both promise the wait
time on a `429`, and that value lives only in the `Retry-After` header. Without this field the promise
is unbuildable, not merely unimplemented. It is two lines and benefits every `agents` subcommand.

**Alternatives considered**: A tool-specific error formatter — rejected, two formatters that drift is
worse than one that handles both shapes. Dropping the wait time from the spec — rejected, the backend
explicitly returns rate-limit headers on a real `429` (slng-ai/backend#688), so the information is
there for the taking.

## D8 — Testing

**Decision**: Add `cli/src/commands/tool.test.ts`, run by the existing `bun test` target, stubbing
`fetch` so no network or credential is needed.

**Rationale**: The constitution's Development Workflow requires a test for changes to argument
parsing. `cli/` currently has no tests, so this establishes the pattern. Coverage targets the logic
that can actually break: collision selection, pagination assembly, `latest_version` null rendering,
`--source` filtering, and exit codes.

**Alternatives considered**: Rely on manual verification — rejected by the constitution.

## D9 — Scope boundaries confirmed

The `tool` group registers in [cli/src/flags.ts](cli/src/flags.ts) only. No TUI flow is added — the
spec describes no interactive journey, and every TUI screen is additional surface to maintain. The
other 29 operations in slng-ai/backend#688 (create, build, run, publish, duplicate, version history,
delete, plus MCP servers, secrets, and client models) stay out of scope per FR-001.
