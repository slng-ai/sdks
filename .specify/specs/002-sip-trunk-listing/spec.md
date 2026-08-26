# Feature Specification: SIP Trunk Listing

**Feature Branch**: `feat/sip-trunks-list-endpoint-35ebd5`

**Created**: 2026-08-26

**Status**: Draft

**Input**: User description: "as part of this pr that is now available in the backend https://github.com/slng-ai/backend/pull/688 — We now have endpoints we can use to fetch all the SIP trunks available and their specs. `voiceai trunks list` → Lists all trunks available. https://github.com/slng-ai/sdks/pull/32 → this is how we implemented for tools, we can mimic it. The way you access the endpoint is via the SLNG_API_KEY already available in `.env`."

> **Premise correction (recorded, not a blocker).** slng-ai/backend#688 mounts the shared-resource
> families — tools, MCP servers, Vault secrets, and client models — on `/v1/agents`. It does **not**
> add a SIP trunk resource. Probing the deployed API confirms there is no organisation-level trunk
> collection an API key can reach: the dashboard's trunk routes are gated to browser sessions, and
> every candidate organisation-level trunk path is unrouted. The one trunk view a consumer API key
> *can* reach today is agent-scoped and returns the organisation's trunks annotated for one agent.
> This specification is written against that reality and states its completeness ceiling plainly.
> See Assumptions and Q2 in Clarifications.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See every SIP trunk my organisation can use (Priority: P1)

An engineer wiring telephony to a voice agent needs to know which SIP trunks their organisation
already has — inbound and outbound — without opening the dashboard. They run one command and get a
compact table: each trunk's name, direction, the phone numbers it carries, and whether it is
currently healthy and usable.

**Why this priority**: This is the whole ask and the discovery entry point. Every downstream
telephony task — attaching a trunk to an agent, checking which number a caller reaches, confirming a
newly provisioned trunk went live — starts with "what do we have?".

**Independent Test**: Run `voiceai trunks list` against an organisation with at least one inbound and
one outbound trunk; confirm both appear, each with a direction and its numbers, and the command exits
zero.

**Acceptance Scenarios**:

1. **Given** a valid credential for an organisation with SIP trunks, **When** the user runs `voiceai trunks list`, **Then** every trunk the platform reports as visible to that organisation is printed, one per line, with at minimum its name, direction, phone numbers, and health status.
2. **Given** an organisation whose trunks are split between inbound and outbound, **When** the list is printed, **Then** each row states its direction unambiguously, and inbound and outbound trunks are never conflated into one indistinguishable set.
3. **Given** a trunk carrying several phone numbers, **When** it appears in the list, **Then** all of its numbers are represented; a trunk's numbers are never silently truncated to the first one.
4. **Given** a trunk with no phone numbers attached, **When** it appears in the list, **Then** its numbers cell shows an explicit placeholder that cannot be mistaken for a number or a blank name.
5. **Given** an organisation with no SIP trunks at all, **When** the user runs `voiceai trunks list`, **Then** the command states plainly that no trunks were found and exits zero — an empty organisation is not an error.
6. **Given** the platform's trunk view can only be reached through an agent and therefore cannot report trunks the platform withholds, **When** the list is printed, **Then** a single line on stderr states that the listing reflects what the platform exposes and may omit trunks the platform does not surface — the user is never led to believe an incomplete list is exhaustive.

---

### User Story 2 - Tell a usable trunk from a broken one (Priority: P2)

An engineer who provisioned a trunk yesterday, or who is debugging why an agent will not take calls,
needs to know whether each trunk is actually usable right now — active and synced with the telephony
backend — and, when it is not, why not.

**Why this priority**: A bare list of names answers "what exists" but not "what works", which is the
question a person debugging telephony actually has. It is separable from User Story 1 — the list
delivers value without it — but it is the difference between a directory and a diagnostic.

**Independent Test**: Run `voiceai trunks list` against an organisation holding at least one trunk
that is not in a usable state and confirm the row shows both that it is unusable and the reason.

**Acceptance Scenarios**:

1. **Given** a trunk the platform reports as healthy and usable, **When** it appears in the list, **Then** its row shows it as usable.
2. **Given** a trunk the platform reports as not usable, **When** it appears in the list, **Then** its row shows it as not usable and names the platform's stated reason in human-readable form.
3. **Given** a trunk that is already attached to an agent, **When** the list is printed, **Then** the row indicates that the trunk is in use rather than presenting it as free.
4. **Given** a trunk whose reason for being unusable is one the CLI has never seen before, **When** it appears in the list, **Then** the reason is passed through verbatim rather than dropped or shown as blank.

---

### User Story 3 - Filter and script against trunk data (Priority: P3)

An engineer wiring a provisioning check or a CI guard needs the same information as a
machine-readable document, and a human at the terminal often wants only one direction.

**Why this priority**: Additive convenience once the human-readable output exists, and it matches the
convention every other `voiceai` subcommand already follows.

**Independent Test**: Run the command with `--json`, pipe it to a JSON parser, and confirm it parses
and contains each trunk's direction and numbers; run it with a direction filter and confirm only that
direction appears.

**Acceptance Scenarios**:

1. **Given** `--json` is passed, **When** the command succeeds, **Then** stdout contains only a valid JSON document and no decorative output.
2. **Given** `--json` is passed and the request fails, **When** the command exits non-zero, **Then** stdout still contains a valid JSON document describing the failure, so a parsing script does not choke.
3. **Given** the user passes a direction filter for inbound, **When** the list is printed, **Then** only inbound trunks appear; the outbound filter behaves symmetrically.
4. **Given** the command is run without a terminal attached (piped or in CI), **When** it runs, **Then** no progress spinner or colour codes contaminate stdout.

---

### Edge Cases

- **Missing credential**: no API key is configured. The command exits non-zero with a message naming
  the exact ways to supply one, and never prints an empty table that reads like "you have no trunks".
- **Rejected credential**: the platform rejects the key. The command says the credential was rejected
  rather than reporting an empty organisation.
- **Organisation has no agents**: the platform's only reachable trunk view is agent-scoped, so an
  organisation with zero agents yields no trunk data. The command MUST say that trunks could not be
  enumerated because the organisation has no agent to read them through — it MUST NOT print "no
  trunks found", which would be a false negative for an organisation that owns trunks.
- **Trunk withheld by the platform**: the platform omits trunks it considers unusable and unattached.
  Such a trunk exists but cannot appear. The stderr completeness note covers this; the command never
  claims exhaustiveness it cannot deliver.
- **Same trunk reported more than once**: the same trunk can be reported through more than one agent,
  with per-agent annotations that disagree. Each trunk MUST appear exactly once in the output.
- **Rate limited**: the platform reports too many requests. The command reports that the request was
  rate limited and, when the response says how long to wait, includes that wait.
- **Network unreachable / timeout**: the command reports the connection failure and exits non-zero;
  it does not hang indefinitely with no output.
- **Partial failure while gathering**: some reads succeed and others fail. The command MUST NOT
  present a partial result as complete — it either reports the failure or clearly marks the result as
  partial, and exits accordingly.
- **Trunk name containing shell-significant or non-ASCII characters**: the name is treated as a
  literal value and never interpolated into a command or a URL path without encoding.
- **Very many trunks**: output stays one record per line and remains legible; the full record is
  always available via `--json`.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The CLI MUST expose a `trunks` command group whose only subcommand in this feature is `list`. Creating, editing, attaching, detaching, and deleting trunks are out of scope.
- **FR-002**: `trunks list` MUST report the SIP trunks the platform exposes for the caller's organisation, covering both inbound and outbound trunks in a single invocation.
- **FR-003**: `trunks list` MUST display, for each trunk: its name, its direction (inbound or outbound), the phone numbers it carries, its health status, and whether it is currently usable.
- **FR-004**: `trunks list` MUST render a trunk with no phone numbers using an explicit placeholder that cannot be mistaken for a number or an empty name.
- **FR-005**: When the platform reports a reason a trunk is not usable, `trunks list` MUST surface that reason in the row, in human-readable form, and MUST pass through unrecognised reasons verbatim rather than discarding them.
- **FR-006**: `trunks list` MUST indicate which trunks are already attached to an agent, so a free trunk is distinguishable from one in use.
- **FR-007**: Each distinct trunk MUST appear exactly once in the output, however many times the platform reports it.
- **FR-008**: `trunks list` MUST emit a single stderr line stating that the listing reflects what the platform exposes and may omit trunks the platform withholds. This note MUST NOT appear on stdout and MUST NOT appear in `--json` output.
- **FR-009**: When trunks cannot be enumerated because the organisation has no agent to read them through, `trunks list` MUST say so explicitly and MUST NOT print "no trunks found".
- **FR-010**: `trunks list` MUST accept an optional direction filter restricting output to inbound or outbound trunks.
- **FR-011**: `trunks list` MUST accept `--json`, which makes stdout a single valid JSON document — on success and on failure alike — with no spinner, colour, or human-facing prose mixed in.
- **FR-012**: `trunks list` MUST send progress indicators, warnings, and errors to stderr only, leaving stdout usable in a pipeline.
- **FR-013**: `trunks list` MUST exit zero only on success and non-zero on any failure, so shell scripts and CI can branch on the exit code. An organisation with zero trunks is a success.
- **FR-014**: `trunks list` MUST authenticate using the CLI's existing credential resolution unchanged — the active named profile, the `--profile` flag, and the `VOICEAI_API_KEY` environment variable — exactly as every other `voiceai` subcommand does. No new environment variable is introduced.
- **FR-015**: `trunks list` MUST NOT print, log, or echo the API key, and MUST NOT include it in error output.
- **FR-016**: `trunks list` MUST NOT print SIP authentication credentials (usernames, passwords, or tokens) for any trunk, in either human-readable or `--json` output.
- **FR-017**: Failures MUST be distinguishable by the user: an unset credential, a rejected credential, no agents to read through, a rate limit, and a network failure each produce a different message.
- **FR-018**: When the platform returns a request identifier alongside an error, the command MUST include it in the error message so the failure can be traced in support.
- **FR-019**: `voiceai trunks --help` and `voiceai trunks list --help` MUST document the flags, the inbound/outbound distinction, and the completeness ceiling, in the same style as the existing `tool` and `agents` command groups.
- **FR-020**: A partial gather MUST NOT be presented as complete: if some reads succeed and others fail, the command reports the failure or marks the result as partial and exits accordingly.

### Key Entities

- **SIP trunk**: A named telephony connection belonging to an organisation, carrying one or more phone numbers. Has a direction, a health status, an identifier in the telephony backend, and may or may not be attached to a voice agent.
- **Direction**: Whether a trunk receives calls (inbound) or places them (outbound). Inbound and outbound trunks are separate objects; a name may exist on both sides, so direction is part of a trunk's identity from the user's point of view.
- **Usability**: Whether a trunk can currently be attached to and used by an agent, plus, when it cannot, the platform's stated reason — for example the trunk is inactive, has not finished syncing with the telephony backend, belongs to a different telephony project, or is already taken by another agent.
- **Attachment**: The relationship between a trunk and a voice agent. An inbound trunk is exclusive to one agent; an outbound trunk is not.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user with a working credential can see their organisation's SIP trunks, with numbers and health, in a single command and with no configuration beyond what they already use for other `voiceai` commands.
- **SC-002**: A user debugging telephony can tell, from the list alone and without a second command, which trunks are usable and which are not, and why the unusable ones are not.
- **SC-003**: Output without `--json` is one record per line and parseable by standard line-and-column shell tools, so a user can extract any single column without writing a parser.
- **SC-004**: Every failure mode identified in Edge Cases produces a message naming both what went wrong and what the user can do next, and a non-zero exit where the situation is a failure; no failure mode produces a silent success or an empty result that resembles one.
- **SC-005**: A completeness check comparing the command's output against the set of trunks the platform is willing to expose matches exactly, with no duplicates and no omissions within that set. Where the platform withholds trunks, the stderr note is present in 100% of runs.
- **SC-006**: With `--json`, the output parses successfully on the first attempt in 100% of runs, including error runs.
- **SC-007**: No run of the command, in any output mode or failure mode, emits a SIP credential or the API key.

## Assumptions

- The organisation-level trunk collection implied by the feature request does not exist on the public
  API surface today. slng-ai/backend#688 shipped tools, MCP servers, Vault secrets, and client
  models; it did not ship trunks. The only trunk view a consumer API key can reach is agent-scoped
  and returns the organisation's trunks annotated for one agent.
- That agent-scoped view returns the organisation's trunks — not the single agent's — which is why it
  can answer an organisation-level question at all. Verified against the deployed API: the same trunk
  set comes back for different agents in the same organisation.
- The platform withholds trunks it deems unusable *and* unattached to the agent being queried. The
  practical consequence is a completeness ceiling this feature cannot lift from the client side: a
  trunk that is inactive and attached to nobody is invisible. FR-008 makes that visible to the user
  instead of hiding it.
- The platform does not expose full trunk detail — SIP address, transport, provider, setup mode, or
  SIP domain — on this surface. A `trunks get` subcommand would therefore show nothing a filtered
  `list` row does not already show, so it is deliberately excluded. When an organisation-level trunk
  resource with full detail ships, `trunks get` becomes worth specifying.
- Trunks are read-only from the CLI in this feature. Creating, updating, attaching, detaching, and
  deleting trunks are excluded even where the platform supports them elsewhere.
- The `trunks` command group follows the conventions already set by `voiceai tool` and
  `voiceai agents`: subcommand tree, `--json`, spinner on stderr only when attached to a terminal,
  tab-separated human output, and profile-aware credentials.
- Trunks live under the same platform surface as agents, so the command group honours the same
  base-URL override the `agents` and `tool` groups already support.
- The token stored as `SLNG_API_KEY` in a local `.env` is the same credential the CLI already reads as
  `VOICEAI_API_KEY`; a developer testing this feature exports it under that name. Reading `.env` files
  is not being added to the CLI as a product behaviour, and no second environment variable name is
  introduced.
- The group is named `trunks` (plural) because the feature request names it that way; `voices` and
  `models` set the plural precedent, so it is not out of place.

## Clarifications

### Session 2026-08-26

- **Q1 — What does "all trunks available" mean for a command with no agent argument?**
  **A: Merge what every agent reports into one organisation-wide, deduplicated list.** This is the
  most complete answer reachable today: it recovers trunks that are attached to one agent and
  therefore withheld from every other agent's view. A trunk appears once; "in use" means attached to
  some agent, and the command names which one. The cost is one read per agent, which is acceptable at
  the organisation sizes observed and is disclosed in the plan's performance constraints. No `--agent`
  flag is added in this feature — the command answers an organisation-level question, and narrowing
  it to one agent is a later addition if a large organisation makes the fan-out uncomfortable.

- **Q2 — Ship on the agent-scoped view now, or wait for a real trunk endpoint?**
  **A: Ship now on the agent-scoped view, with the completeness ceiling disclosed, and open a backend
  request so the follow-up is tracked rather than remembered.** Users get the command in this
  release; when an organisation-level trunk resource lands, the data source is swapped behind an
  unchanged command surface, and only then does `trunks get` become worth specifying.
