# Phase 0 Research: SIP Trunk Listing

**Feature**: [spec.md](./spec.md) · **Date**: 2026-08-26

Every wire-level question below was settled by probing the deployed API at
`https://api.agents.slng.ai` with the organisation credential in `.env`, or by reading the backend
source on `slng-ai/backend` `main`. Nothing here is inferred from documentation.

---

## D1 — Does an organisation-level SIP trunk endpoint exist on the public API?

**Decision**: No. There is no organisation-level trunk collection a consumer API key can reach.

**Evidence**:

- `app/api/public_shared_resources.py` on `main` mounts exactly four families under the `/v1/agents`
  prefix — `/tools`, `/mcp-servers`, `/secrets`, `/client-models`. This is the whole of
  slng-ai/backend#688. No trunk router is registered there.
- Probed candidate paths on the agents host. Every one falls through to the `/v1/agents/{agent_id}`
  catch-all and returns `422 AGENT_VALIDATION_FAILED` complaining that `path.agent_id` is not a UUID:
  `/v1/agents/sip-trunks`, `/v1/agents/trunks`, `/v1/agents/sip_trunks`. That 422 is itself the proof
  the literal segment is unrouted — a registered literal route would shadow the catch-all, exactly as
  `/v1/agents/tools` does.
- The dashboard *does* have full trunk CRUD at `app/api/client/telephony.py`
  (`/client/telephony/inbound-trunks`, `/client/telephony/outbound-trunks`), but those handlers depend
  on `get_current_user` — a browser session, not an API key — and the whole `/client` surface returns
  a plain-text `403 Forbidden` at the edge when reached with a bearer token. Confirmed live.

**Alternatives considered**: Calling the dashboard routes with the API key (blocked at the edge);
waiting for a backend endpoint (rejected in spec Q2 — ship now, track the follow-up).

---

## D2 — What is the reachable trunk view, and is it organisation-scoped or agent-scoped?

**Decision**: `GET /v1/agents/{agent_id}/sip-trunk-options`. It is reached *through* an agent but
returns the **organisation's** trunks, annotated relative to that agent.

**Evidence**: `VoiceAgentService.get_sip_trunk_assignment_options` selects
`SipInboundTrunk` / `SipOutboundTrunk` filtered on `organisation_id == agent.organisation_id` and
`deleted_at IS NULL`, ordered by name then id. The agent is used only to compute the per-trunk
annotations. Confirmed empirically: three different agents in the probed organisation return an
identical trunk set.

Response shape, verified live (HTTP 200):

```json
{
  "inbound":  [ { "id": "…", "name": "test2slng",    "livekit_trunk_id": "ST_fG9H7tB2rGvQ",
                  "numbers": ["+441423803084"], "status": "active",
                  "selectable": true, "is_current": false, "unavailable_reason": null } ],
  "outbound": [ { "id": "…", "name": "nicotestslng", "livekit_trunk_id": "ST_vhQRCs7hW4Cy",
                  "numbers": ["+441423803084"], "status": "active",
                  "selectable": true, "is_current": false, "unavailable_reason": null } ]
}
```

Two lists, not one. No pagination envelope, no cursor, no `limit`/`offset` — the whole organisation's
trunks come back in one response.

**Alternatives considered**: `GET /v1/agents/{agent_id}` exposes only `sip_inbound_trunk_id` and
`sip_outbound_trunk_id` — two bare UUIDs with no name, numbers, or status. Insufficient for the list,
and it would require a second lookup per id that no endpoint provides.

---

## D3 — Exactly which trunks does the endpoint withhold?

**Decision**: A trunk is emitted only when it is assignable to the queried agent **or** is that
agent's current trunk. The filter in `voice_agent.py` is literally
`if unavailable_reason is None or is_current`.

`unavailable_reason` is computed in this order:

| Order | Reason | Applies to | Relative to the queried agent? |
|---|---|---|---|
| 1 | `different_livekit_project` | both | **Yes** — compares the trunk's LiveKit URL to *the agent's* |
| 2 | `inactive` | both | No — `trunk.status != "active"` |
| 3 | `not_synced` | inbound only | No — `livekit_trunk_id` is empty |
| 4 | `assigned_to_another_agent` | inbound only | **Yes** — assigned to any agent other than this one |

Consequences that drive the merge design:

- **Outbound trunks are shareable.** No assignment filter runs for them, so an active outbound trunk
  attached to agent A is still returned (with `is_current: false`) when queried through agent B.
- **Inbound trunks are exclusive.** An inbound trunk attached to A gets `assigned_to_another_agent`
  from B's view and is therefore dropped from B's response. It is visible **only** through A, where
  `is_current` is `true` and the reason is `null`.
- **A trunk that is unusable *and* attached to nobody is invisible from every agent.** This is the
  completeness ceiling in spec FR-008. No client-side change can lift it.
- `assigned_to_another_agent` is therefore unreachable in practice — the trunk it describes has
  already been filtered out. The CLI must still pass through unrecognised reasons (FR-005), because
  the backend can start emitting reasons at any time.

---

## D4 — Given D3, how does the CLI answer an organisation-level question?

**Decision**: `GET /v1/agents` for the agent list, then one `sip-trunk-options` read per agent, then
merge into a single deduplicated set. This is spec Q1 answer A.

**What the merge recovers over a single read**: every trunk currently attached to an agent, including
inbound trunks (invisible from every other agent) and unhealthy trunks (visible only as their owner's
`is_current`). At the probed organisation a single-agent read and the merge agree, because nothing is
attached yet; they diverge the moment telephony is wired up, which is the normal state.

**Merge rules**:

| Field | Rule | Why |
|---|---|---|
| identity | `(direction, id)` | Inbound and outbound ids come from different tables and could collide |
| `name`, `numbers`, `livekit_trunk_id`, `status` | Take from any report — they are trunk properties, identical across agents | Not agent-relative |
| usable | `true` if **any** agent reported `selectable: true` | `different_livekit_project` is agent-relative; usable-somewhere is the honest organisation-level reading |
| reason | The reason from a report where `selectable` was `false`, only when no report found it selectable | A trunk usable somewhere has no organisation-level reason to show |
| in use | `is_current: true` in some agent's report; record **which** agent | Satisfies FR-006 and costs nothing — the agent list is already in hand |

**Alternatives considered**: reading through one auto-chosen agent (spec Q1 option B — under-reports
every attached inbound trunk); requiring `--agent` (option C — not the command that was asked for).
Rejected in the spec.

---

## D5 — Fan-out cost and bounding

**Decision**: `1 + N` requests for `N` agents, issued in fixed-size concurrent batches of 8.

`GET /v1/agents` is an unpaginated bare JSON array — the OpenAPI document declares
`type: array` with no query parameters, and passing `?limit=3` to an organisation with four agents
returns all four, confirming the parameter is ignored. So the agent list is always exactly one
request.

A batch of 8 keeps a large organisation from opening hundreds of sockets at once while staying a
`for`-loop over `Promise.all` slices — no queue, no dependency. The probed organisation has 4 agents,
so it is a single batch. No `--agent` narrowing flag ships in this feature (spec Q1); if a large
organisation makes the fan-out uncomfortable, that flag is the mitigation to add then.

**Alternatives considered**: unbounded `Promise.all` (fine at N=4, poor at N=500); a concurrency
library (violates the no-new-dependency constraint for something a slice loop does in six lines).

---

## D6 — Transport: raw fetch or the generated SDK?

**Decision**: `agentsRequest` from [cli/src/lib/agents.ts](../../../cli/src/lib/agents.ts), unchanged.

`/v1/agents/{agent_id}/sip-trunk-options` **is** in the vendored OpenAPI document — unlike the tool
routes of feature 001, which are `include_in_schema=False`. It could in principle come from the
generated SDK. It should not:

- `agentsRequest` already resolves the agents base URL, the profile credential, the
  `VOICEAI_AGENTS_BASE_URL` override, and both server error envelopes. Using the SDK here would mean
  two transport paths inside one command group.
- The `tool` and `agents` groups both use `agentsRequest`; `trunks` matching them keeps one idiom.
- It keeps the CLI independent of the SDK's publish cycle, which is why `verify.ts` and `agents.ts`
  took this route already.

**No change to `cli/src/lib/agents.ts` is required.** Feature 001 already added repeatable query
parameters and nested-envelope error formatting; this feature needs neither beyond what is there.

---

## D7 — Error envelopes and status codes

**Decision**: `formatAgentsError` handles every case unmodified. Verified live:

| Situation | Status | Body |
|---|---|---|
| Valid key, real agent | 200 | the two-list object |
| Valid key, unknown agent id | 404 | `{"detail":"Agent not found","error":{"code":"AGENT_NOT_FOUND","message":"Agent not found","request_id":"…"}}` |
| Invalid key | 401 | `{"detail":"Invalid API key","error":{"code":"AUTH_REQUIRED",…,"retryable":false}}` |
| No bearer token | 401 | `{"detail":"Missing bearer token","error":{"code":"AUTH_REQUIRED",…}}` |
| Non-UUID agent segment | 422 | `{"detail":"Voice agent config is invalid…","error":{"code":"AGENT_VALIDATION_FAILED","fields":[…]}}` |

All carry the nested `error.request_id` that `formatAgentsError` already extracts, satisfying FR-018.
Rate limiting was not induced against the live organisation; the 429 path is covered by a stub-server
test, as feature 001 did.

One case needs handling above the transport layer: a 404 on one agent mid-fan-out means that agent was
deleted between the list read and the trunk read. That is a benign race — skip the agent, do not fail
the command — and is distinct from a 404 that would indicate a real problem.

---

## D8 — Command surface and naming

**Decision**: `voiceai trunks list`, registered in `cli/src/flags.ts` alongside `toolCommand()`.

The group is plural, matching the feature request and the existing `voices` / `models` groups.
`voiceai tool` is singular because it takes a name argument; `trunks` takes none.

**No `trunks get`.** The reachable payload carries eight fields, all of which the list row already
shows. A detail subcommand would print nothing new. `SipInboundTrunkOut` / `SipOutboundTrunkOut` do
carry `provider`, `setup_mode`, `address`, `transport`, `sip_domain`, and timestamps — but only on the
session-gated dashboard routes of D1. When an organisation-level resource exposes them, `trunks get`
becomes worth specifying.

---

## D9 — Credential safety

**Decision**: nothing new is needed; the constraint is asserted, not built.

`agentsRequest` puts the key in an `Authorization` header only. No trunk field in the reachable
payload is a credential: `SipInboundTrunkOut.auth_username`, `twilio_webhook_token`, and
`twilio_webhook_path` exist on the dashboard schema but are **not** present on
`SipTrunkAssignmentOptionOut`, so the CLI never receives them. `livekit_trunk_id` is an opaque backend
identifier, not a secret. FR-015 and FR-016 are therefore satisfied by construction and covered by an
assertion test that greps all output for the key, mirroring `tool.test.ts`.
