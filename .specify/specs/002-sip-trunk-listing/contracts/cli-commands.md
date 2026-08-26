# Contract: `voiceai trunks` CLI Surface

**Feature**: [spec.md](../spec.md) · **Data model**: [data-model.md](../data-model.md) · **Date**: 2026-08-26

This is the feature's public interface. Every item below is a promise to users and scripts; changing
one is a breaking change. Each maps to a functional requirement and is asserted in
[quickstart.md](../quickstart.md).

---

## Command tree

```text
voiceai trunks                    group; prints help
voiceai trunks list               the only subcommand in this feature
```

`trunks get`, and any create/update/attach/delete verb, are **out of scope** (FR-001).

---

## `voiceai trunks list`

List every SIP trunk the platform exposes for your organisation.

### Options

| Option | Values | Default | Requirement |
|---|---|---|---|
| `--direction <direction>` | `inbound` \| `outbound` | both | FR-010 |
| `--json` | flag | off | FR-011 |
| `--profile <name>` | existing global option | active profile | FR-014 |

An invalid `--direction` is rejected by the parser with a non-zero exit and a message naming the valid
values — commander's `.choices()`, matching `tool list --source`.

### Exit codes

| Code | Meaning |
|---|---|
| `0` | Success, including an organisation with zero trunks (FR-013) |
| `1` | Any failure: no credential, rejected credential, no agents, rate limit, network failure, invalid option |

### Stream discipline (FR-012)

| Stream | Carries |
|---|---|
| stdout | The table, or the `--json` document. Nothing else. |
| stderr | Spinner (TTY only), the completeness note, warnings, all error messages. |

The spinner is created only when `process.stderr.isTTY`, so piped and CI runs emit no control
characters (US3 scenario 4).

---

## Human output

Header row, then one tab-separated trunk per line:

```text
DIRECTION	NAME	NUMBERS	STATUS	USABLE	IN USE BY
inbound	test2slng	+441423803084	active	yes	-
outbound	nicotestslng	+441423803084	active	yes	Support Line
```

Column semantics and the `-` placeholder rule are specified in
[data-model.md §3](../data-model.md). Guarantees:

- One trunk per line, exactly once per trunk (FR-007), so `wc -l` minus the header is the trunk count.
- No cell is ever blank — `cut -f3` always addresses the numbers column (FR-004).
- `USABLE` is `yes`, or `no (<reason>)` with the reason in human phrasing; an unrecognised reason is
  printed verbatim rather than dropped (FR-005).

### Empty and unenumerable organisations

| Situation | stdout | stderr | Exit |
|---|---|---|---|
| Organisation has trunks | the table | completeness note | 0 |
| Organisation has zero trunks | `no trunks found.` | completeness note | 0 |
| Organisation has zero agents | *(nothing)* | the no-agents error | 1 |

The third row is the point of FR-009: an organisation with no agents cannot be enumerated at all, and
saying "no trunks found" there would be a false negative for an organisation that owns trunks.

### The completeness note (FR-008)

Exactly one line, on stderr, on every successful run:

```text
note: this lists the trunks the platform exposes; a trunk that is both unusable and attached to no agent is not visible here.
```

Never on stdout. Never emitted under `--json` — a machine consumer has no use for it and stderr noise
in a JSON pipeline is still noise.

---

## `--json` output

stdout is a single valid JSON document and nothing else, on success **and** on failure (FR-011).

**Success** — an array of merged `Trunk` objects, the shape in
[data-model.md §2](../data-model.md), pretty-printed with 2-space indent to match every other
`voiceai` command:

```json
[
  {
    "direction": "inbound",
    "id": "ad811164-026f-4c32-abe7-4c6cb19b729d",
    "name": "test2slng",
    "numbers": ["+441423803084"],
    "status": "active",
    "livekit_trunk_id": "ST_fG9H7tB2rGvQ",
    "usable": true,
    "unavailable_reason": null,
    "in_use_by": null
  }
]
```

An organisation with zero trunks emits `[]`, not `null` and not an object.

**Failure** — a JSON object describing the failure, so a parsing script does not choke:

```json
{ "ok": false, "error": "HTTP 401 · Invalid API key · AUTH_REQUIRED · slng_request_id=…" }
```

Where the platform returned a JSON error body, that body is emitted instead, as `agents.ts` already
does — it carries the machine-readable code and the request id.

---

## Error messages

One line each, on stderr, exit 1. Distinguishable by cause (FR-017):

| Cause | Message shape |
|---|---|
| No credential configured | names every way to supply one — env var, profile, `voiceai login` |
| Credential rejected | says the credential was rejected, with the platform's code and request id |
| No agents in the organisation | says trunks cannot be enumerated because the organisation has no agent to read them through, and that creating an agent makes them visible |
| Rate limited | says rate limited, and includes the wait when `Retry-After` is present |
| Network failure | the connection error, verbatim |
| Partial gather failure | says which read failed; never presents a partial set as complete (FR-020) |

Every message that came from the platform includes the request id when one was returned (FR-018).

**No message, in any mode, contains the API key or a SIP credential** (FR-015, FR-016). Asserted by a
test that greps combined stdout+stderr for the key across success and failure runs.

---

## Help text (FR-019)

`voiceai trunks --help` and `voiceai trunks list --help` follow the `tool` and `agents` house style:
a `COMMANDS` block, an `EXAMPLES` block, and a `NOTES` block. `NOTES` must state:

- inbound and outbound trunks are distinct objects, and a name can exist on both sides;
- the listing reflects what the platform exposes, and what it withholds;
- the listing is organisation-wide, assembled by reading through the organisation's agents.

Worked examples to include:

```bash
voiceai trunks list                              # every trunk, both directions
voiceai trunks list --direction outbound         # only outbound
voiceai trunks list --json | jq -r '.[].name'    # scriptable
voiceai trunks list --json | jq '[.[] | select(.usable | not)]'   # what is broken
```

---

## Credential resolution (FR-014)

Unchanged from every other `voiceai` subcommand: `VOICEAI_API_KEY` → `--profile <name>` → the active
profile in `~/.config/voiceai/config.json`. The env var wins over `--profile`.

**No new environment variable is introduced.** `SLNG_API_KEY` in a local `.env` is the same token; a
developer exports it as `VOICEAI_API_KEY` to test. Reading `.env` is not a CLI behaviour.

Base URL override: `VOICEAI_AGENTS_BASE_URL`, or `voiceai config set agentsBaseUrl <url>` — the same
override the `agents` and `tool` groups honour, which is what makes the stub-server tests possible.
