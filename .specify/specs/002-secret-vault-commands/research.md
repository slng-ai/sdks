# Phase 0 Research: Secret Vault Commands

**Date**: 2026-08-26 | **Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

Every wire-level unknown was resolved by probing the live API at `https://api.agents.slng.ai` with
the organisation credential in `.env`, and by reading the merged backend source. No unknown is left
as NEEDS CLARIFICATION.

Probe hygiene: no secret value was printed at any point. The `value` field was replaced with a
placeholder before any response body was rendered, and the assertion below (D3) was made by
comparing against `null`, not by displaying the field.

---

## D1 — Transport: raw fetch via `agentsRequest`, not the generated SDK

**Decision**: Call `/v1/agents/secrets` through the existing `agentsRequest` helper in
[cli/src/lib/agents.ts](../../../cli/src/lib/agents.ts).

**Rationale**: The public shared-resource routes are mounted `include_in_schema=False`, so they never
reach the OpenAPI document and therefore never reach the Stainless-generated SDK. This is the same
constraint that forced the raw-fetch approach for `voiceai tool`, and constitution Principle I
forbids hand-adding the endpoint to `specs/` to work around it.

**Alternatives considered**: Adding the routes to the vendored spec — rejected, Principle I. Waiting
for the routes to be published in the OpenAPI document — rejected, they are deliberately hidden.

---

## D2 — `cli/src/lib/agents.ts` needs no change at all

**Decision**: Ship this feature without touching the transport layer.

**Rationale**: Feature 001 already added the two things this feature would otherwise need. Repeatable
query parameters are not used here (there is no name filter on the vault list — see D4), and
`formatAgentsError` already unwraps the nested `{detail, error:{code, message, request_id}}` envelope
and already surfaces `Retry-After`. Probed 404 and 401 bodies match that envelope exactly:

```
404  {"detail":"No shared secret or variable named 'NOPE'",
      "error":{"code":"RESOURCE_NOT_FOUND","message":"...","request_id":"d5da491e-..."}}
401  {"detail":"Invalid API key",
      "error":{"code":"AUTH_REQUIRED","message":"Invalid API key","request_id":"...","retryable":false}}
```

`formatAgentsError` renders these as `HTTP 404 · <message> · RESOURCE_NOT_FOUND · slng_request_id=<id>`,
satisfying FR-014 and FR-015 with no new code.

**Alternatives considered**: A dedicated `cli/src/lib/secrets.ts` transport module — rejected, see
plan.md Structure Decision. The whole feature is two read-only GETs.

---

## D3 — The vault holds two kinds, and one of them returns plaintext

**Decision**: Redact `value` unconditionally, for both kinds, in every output mode including `--json`.
Display `kind` as a column on `list` and a field on `get`.

**Rationale**: This is the one finding that contradicts the naive reading of the feature request.
`app/api/shared_resource_views.py` sets `value=service.readable_value(row)`, and
`app/services/org_secrets.py:453` defines:

```python
def readable_value(row: OrgSecret) -> str | None:
    """Plaintext for variables; None for secrets (write-once)."""
    if row.kind != ORG_SECRET_KIND_VARIABLE:
        return None
    return decrypt_string(row.encrypted_value)
```

So `kind: "secret"` is genuinely unreadable — confirmed live, all three entries in the probed
organisation returned `value: null` — but `kind: "variable"` returns decrypted plaintext in the
response body. A `--json` command that dumped the raw record verbatim would therefore print a
plaintext vault value to stdout. That is a real leak, not a hypothetical one, and constitution
Principle V ("MUST NOT appear in ... logs, or error messages") covers it.

One unconditional rule beats a per-kind rule: the user never has to remember which kinds are safe,
and the redaction is one line at the boundary rather than a branch in every renderer.

**Alternatives considered**:
- Pass `value` through for variables because the platform is willing to disclose it — rejected. A
  user who stores something sensitive under the wrong kind gets it echoed into their terminal
  scrollback and their CI logs. The feature is a presence check; it does not need the value.
- Add `--reveal` now to opt into variable plaintext — rejected as speculative. Nothing in the request
  asks for it. It is a one-flag addition when someone actually needs it, and the redaction point is
  already a single function.

**Consequence**: spec.md was amended during this phase — FR-003, FR-008, a Key Entity, an edge case,
and two assumptions — so the specification matches what the platform actually does.

---

## D4 — The vault list is unpaginated; `secret get` is a single request

**Decision**: `secret list` issues exactly one `GET /v1/agents/secrets`. `secret get` issues exactly
one `GET /v1/agents/secrets/{name}`. No paging loop, no ceiling warning, no list-then-detail dance.

**Rationale**: Probed. `GET /v1/agents/secrets?limit=1&offset=0` returned all 3 entries — the
parameters are not declared on the route and are ignored. The backend route signature takes only the
organisation and the session, and calls `service.list(organisation.id)` unfiltered. Separately, the
vault is addressed **by name**, not by id, so `get` needs no id lookup first — unlike `tool get`,
which had to list by name and then fetch by id.

This makes the feature strictly simpler than 001: no `PAGE_SIZE`, no `MAX_OFFSET`, no
`listAllSecrets` paging helper, no shadow/collision resolution.

FR-002 and SC-007 still stand as written — "print everything, never truncate silently" — they are
simply satisfied by construction rather than by a loop. Nothing in the CLI limits the result set, so
there is no place a silent truncation could be introduced.

**Alternatives considered**: Writing the paging loop defensively in case the route gains `limit`
later — rejected, YAGNI. If pagination is added server-side the list would come back short and the
fix is the same loop 001 already demonstrates.

---

## D5 — Name lookup is exact, case-sensitive, and URL-path-addressed

**Decision**: `encodeURIComponent` the supplied name into the path. Map a `404` to the spec's
not-found message rather than passing the server's prose through.

**Rationale**: Probed. `GET /v1/agents/secrets/firecrawl_api_key` against an organisation holding
`FIRECRAWL_API_KEY` returns `404 RESOURCE_NOT_FOUND` — matching is exact and case-sensitive, as
FR-007 requires the message to state. The name is a path segment, so a name containing `/`, `#`, or
whitespace must be percent-encoded before it reaches the URL (spec Edge Cases).

The server's own 404 prose ("No shared secret or variable named 'x'") is accurate but does not tell
the user that matching is case-sensitive, which is the single most likely cause given the
`SCREAMING_SNAKE_CASE` convention these names follow. The CLI adds that sentence.

**Alternatives considered**: Fetching the full list and matching client-side, mirroring `tool get` —
rejected. It is one extra request, it loses the server's authoritative 404, and there is no
collision to resolve.

---

## D6 — No `--source` flag, and no `references` subcommand

**Decision**: Neither is built.

**Rationale**: `--source` exists on `voiceai tool` because a tool name can resolve to both a curated
and an organisation tool. Vault entries have no curated tier — they belong to exactly one
organisation, and cross-organisation isolation is enforced server-side (probed: another
organisation's key gets `[]` and `404`). There is nothing to disambiguate.

`GET /v1/agents/secrets/{name}/references` is live and useful — it returns the agents, tool drafts,
MCP servers, and agent versions that consume a secret, each with a `blocks_delete` flag. It is out of
scope per spec FR-001. It is the natural next feature, and it is the reason the eventual `secret
delete` will need it, but nothing in this request needs it.

**Alternatives considered**: Folding references into `secret get` as extra fields — rejected. It
doubles the request count for every `get` to serve information the request did not ask for.

---

## D7 — Actor fields are opaque identifiers, rendered as-is

**Decision**: Print `created_by` and `last_rotated_by` verbatim, `-` when null.

**Rationale**: The field carries a Clerk user id for dashboard-originated entries (probed:
`user_39yx49koexk...`) and a consumer API key id for API-originated ones. The public surface passes
`hide_admin_actor_ids=True`, which nulls out internal `admin:`-prefixed actors before they reach the
caller — so the CLI never sees an internal identifier and needs no filtering of its own. Resolving an
id to a human name would need a second API the CLI does not have.

**Alternatives considered**: Omitting the actor fields as noise — rejected, FR-006 requires "who
created it, who last rotated it".

---

## Live observations

| Observation | Value |
|---|---|
| `GET /v1/agents/secrets` | `200`, bare array, 3 entries in the probed organisation |
| Record fields | 14: `id`, `organisation_id`, `name`, `kind`, `description`, `value`, `has_value`, `is_managed`, `revision`, `created_by`, `last_rotated_by`, `last_rotated_at`, `created_at`, `updated_at` |
| `value` for `kind: secret` | `null` on every row, on both list and detail |
| `limit` / `offset` | Ignored — `?limit=1` still returned all 3 |
| `GET /{name}` exact | `200` with the full record |
| `GET /{name}` wrong case | `404 RESOURCE_NOT_FOUND` |
| `GET /{name}` absent | `404 RESOURCE_NOT_FOUND` |
| Bad bearer token | `401 AUTH_REQUIRED`, `retryable: false` |
| Request id | `x-request-id` header and `error.request_id` body field, matching |
| `GET /{name}/references` | `200`, array of `{resource_id, resource_type, resource_name, classification, location, blocks_delete}` |
