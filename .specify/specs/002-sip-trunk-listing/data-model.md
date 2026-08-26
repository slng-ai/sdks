# Phase 1 Data Model: SIP Trunk Listing

**Feature**: [spec.md](./spec.md) · **Research**: [research.md](./research.md) · **Date**: 2026-08-26

Three shapes matter: what the platform returns, what the CLI merges it into, and what `--json` emits.
All types are hand-written in `cli/src/commands/trunks.ts`, mirroring the backend schema the way
`tool.ts` mirrors `ToolListItem`.

---

## 1. Wire shape — what the platform returns

`GET /v1/agents/{agent_id}/sip-trunk-options` → `200`, mirroring `SipTrunkAssignmentOptionsOut`:

```ts
interface TrunkOptionsResponse {
  inbound: TrunkOption[];
  outbound: TrunkOption[];
}

interface TrunkOption {
  id: string;                        // UUID, unique within its direction's table
  name: string;
  livekit_trunk_id: string | null;   // opaque backend id; null until synced
  numbers: string[];                 // E.164, may be empty
  status: string;                    // free-form; "active" observed
  selectable: boolean;               // assignable to the queried agent
  is_current: boolean;               // this agent's currently attached trunk
  unavailable_reason: string | null; // see the reason table below
}
```

No pagination envelope. Both lists arrive whole, ordered by name then id.

### `unavailable_reason` values

Typed as a `string | null`, **not** a closed union — the backend can add values, and FR-005 requires
unrecognised reasons to pass through verbatim rather than be dropped.

| Value | Direction | Agent-relative? | Human phrasing |
|---|---|---|---|
| `different_livekit_project` | both | **yes** | `belongs to a different telephony project` |
| `inactive` | both | no | `not active` |
| `not_synced` | inbound | no | `not yet synced with the telephony backend` |
| `assigned_to_another_agent` | inbound | **yes** | `already attached to another agent` |
| anything else | — | unknown | printed verbatim |

`assigned_to_another_agent` is unreachable in practice — a trunk carrying it has already been filtered
out of the response (research D3) — but is mapped anyway so the code does not depend on that quirk.

### What the wire shape does **not** carry

`provider`, `setup_mode`, `address`, `transport`, `destination_country`, `sip_domain`,
`auth_username`, `twilio_webhook_path`, `twilio_webhook_token`, `created_at`, `updated_at`. These
exist on `SipInboundTrunkOut` / `SipOutboundTrunkOut` but only on the session-gated dashboard routes.
Two consequences: `trunks get` would show nothing new (research D8), and no credential-bearing field
ever reaches the CLI (research D9, FR-016).

---

## 2. Merged shape — the CLI's own entity

```ts
type Direction = "inbound" | "outbound";

interface Trunk {
  direction: Direction;
  id: string;
  name: string;
  numbers: string[];
  status: string;
  livekit_trunk_id: string | null;
  usable: boolean;                   // assignable to at least one agent
  unavailable_reason: string | null; // null whenever usable
  in_use_by: string | null;          // name of the agent it is attached to
}
```

`Trunk` is what `--json` emits and what the table renders. It is deliberately not the wire shape:
`selectable` and `is_current` are per-agent facts that have no organisation-level meaning until merged.

### Identity

`` `${direction}:${id}` ``. Direction is part of the key because inbound and outbound ids come from
separate tables and are not guaranteed distinct from each other.

### Merge rules

Given every report for one trunk across all agents:

| Field | Rule |
|---|---|
| `direction`, `id`, `name`, `numbers`, `status`, `livekit_trunk_id` | Any report. Trunk properties, identical everywhere. |
| `usable` | `true` if **any** report has `selectable: true`. `different_livekit_project` is agent-relative, so usable-somewhere is the honest organisation-level reading. |
| `unavailable_reason` | When `usable` is `false`, the first non-null reason seen; otherwise `null`. A trunk usable somewhere has no organisation-level reason to show. |
| `in_use_by` | The name of an agent whose report has `is_current: true`; `null` if none. An inbound trunk has at most one such agent. |

**Ordering**: direction (inbound first), then name, then id — matching the server's own
`ORDER BY name, id` so output is stable across runs.

### Invariants

- `usable === true` implies `unavailable_reason === null`.
- Every trunk appears exactly once (FR-007).
- `in_use_by` is `null` or a real agent name, never an id — the agent list is already in hand.

---

## 3. Rendered shape — the human table

Tab-separated, one trunk per line, header row first:

```text
DIRECTION  NAME           NUMBERS          STATUS  USABLE  IN USE BY
inbound    test2slng      +441423803084    active  yes     -
outbound   nicotestslng   +441423803084    active  yes     Support Line
```

| Column | Source | Empty rendering |
|---|---|---|
| `DIRECTION` | `direction` | never empty |
| `NAME` | `name` | never empty |
| `NUMBERS` | `numbers.join(",")` | `-` when the array is empty (FR-004) |
| `STATUS` | `status` | `-` |
| `USABLE` | `yes`, or `no (<reason>)` | never empty |
| `IN USE BY` | `in_use_by` | `-` |

Every empty cell renders as `-`, never blank — a blank cell in tab-separated output collapses two
columns into one for anything reading with `cut` or `awk`.

---

## 4. Gather inputs

```ts
interface AgentRef { id: string; name: string; }   // from GET /v1/agents
interface Report { agent: AgentRef; options: TrunkOptionsResponse; }
```

`GET /v1/agents` returns a bare, unpaginated array of full agent objects; only `id` and `name` are
used. A report is skipped when its agent read returns 404 — a delete-during-fan-out race, benign.
Any other failure aborts the whole command rather than yielding a partial set (FR-020).

---

## 5. State and lifecycle

None. The command is a stateless read: no cache, no config key, no persisted file, no state machine.
The only lifecycle in play is the backend's trunk `status`, which the CLI reports and never changes.
