# Feature Specification: Secret Vault Commands

**Feature Branch**: `feat/vault-secret-cli-commands-9ec618`

**Created**: 2026-08-26

**Status**: Draft

**Input**: User description: "as part of this pr that is now available in the backend https://github.com/slng-ai/backend/pull/688 — We now have endpoints we can use to fetch vault values by name and list them. I want to extend this CLI (voiceai) to make sure we can run two new commands: `voiceai secret get <secretname>` (check if the secret is available by name) and `voiceai secret list` (lists all secrets by name). https://github.com/slng-ai/sdks/pull/32 is how we implemented for tools, we can mimic it. The way you access the endpoint is via the SLNG_API_KEY already available in `.env`."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See which secrets my organisation has configured (Priority: P1)

A developer wiring a tool that declares `STRIPE_KEY` needs to know whether their organisation's
vault already holds that entry, and what else is in there, without opening the dashboard. They run
one command and get a compact table: every secret their organisation has, by name, with whether a
value is actually stored, and a short description.

**Why this priority**: This is the discovery entry point and the only way to answer "what do we
have in the vault?" It delivers standalone value even if `get` never ships.

**Independent Test**: Run `voiceai secret list` against an organisation holding at least one vault
entry; confirm each entry appears by name, that a value-present indicator is shown, and that the
command exits zero.

**Acceptance Scenarios**:

1. **Given** a valid credential for an organisation with vault entries, **When** the user runs `voiceai secret list`, **Then** every secret belonging to that organisation is printed, one per line, by name.
2. **Given** an organisation with no vault entries, **When** the user runs `voiceai secret list`, **Then** the command prints an explicit "no secrets" message and exits zero — an empty vault is not an error.
3. **Given** a secret row that exists but holds no stored value, **When** it appears in the list, **Then** its value-present cell shows an explicit "no value stored" indicator, distinguishable from a secret that is populated.
4. **Given** any organisation, **When** the user runs `voiceai secret list`, **Then** no secret value, or any fragment of one, appears anywhere in the output.
5. **Given** an organisation holding more secrets than the platform returns in one response, **When** the user runs `voiceai secret list`, **Then** all of them are printed — the user is never silently shown a truncated list.

---

### User Story 2 - Check one secret by name (Priority: P1)

A developer, or a CI job about to deploy an agent, knows a secret's name — because a tool declares
it, or they saw it in the list — and needs to confirm it is present and populated before relying on
it. They ask for that one name and get either its record or a clear "not found".

**Why this priority**: Equal to User Story 1. This is the check that gates "will my agent work at
run time?", and secret names arrive from tool configs far more often than a user arrives needing to
browse. Both commands together are the MVP; neither alone is the whole ask.

**Independent Test**: Run `voiceai secret get <known-secret-name>` and confirm the printed record
names the secret and states whether a value is stored; run it against a name that does not exist and
confirm a non-zero exit.

**Acceptance Scenarios**:

1. **Given** a secret named `STRIPE_KEY` exists, **When** the user runs `voiceai secret get STRIPE_KEY`, **Then** the secret's name and whether a value is stored are printed, along with the remaining non-sensitive properties the platform exposes for it, and the command exits zero.
2. **Given** no secret matches the supplied name, **When** the user runs `voiceai secret get NOPE`, **Then** a one-line "not found" message names the secret that was searched for, and the command exits non-zero.
3. **Given** the user supplies a name that differs only in letter case from a real secret, **When** the lookup returns nothing, **Then** the error message states that secret names are matched exactly and case-sensitively.
4. **Given** a secret exists but holds no stored value, **When** the user runs `voiceai secret get <name>`, **Then** the command reports the entry as present-but-unpopulated rather than reporting it as ready to use.
5. **Given** any secret, **When** its record is printed, **Then** the stored value is absent from the output — the command reveals that a secret exists, never what it is.

---

### User Story 3 - Script against vault state (Priority: P3)

An engineer wiring a pre-deploy check needs the same information as a machine-readable document, and
needs the exit code alone to answer "is this secret ready?", so a shell script can gate a deploy on
it without parsing prose.

**Why this priority**: Additive convenience once the human-readable output exists, and it matches the
convention every other `voiceai` subcommand already follows.

**Independent Test**: Run both commands with `--json`, pipe the output to a JSON parser, and confirm
it parses; run `secret get` against a missing name in a shell `if` and confirm the branch is taken.

**Acceptance Scenarios**:

1. **Given** `--json` is passed to either command, **When** it succeeds, **Then** stdout contains only a valid JSON document and no decorative output.
2. **Given** `--json` is passed and the request fails, **When** the command exits non-zero, **Then** stdout still contains a valid JSON document describing the failure, so a parsing script does not choke.
3. **Given** the command is run without a terminal attached (piped or in CI), **When** it runs, **Then** no progress spinner or colour codes contaminate stdout.

---

### Edge Cases

- **Missing credential**: no API key is configured. The command exits non-zero with a message naming
  the exact ways to supply one, and never prints an empty table that reads like "your vault is
  empty" — a user must never conclude a secret is missing when the truth is that they were not
  authenticated.
- **Credential valid but organisation lacks access**: the platform reports the shared-resource
  surface as permanently disabled for this organisation. The command reports that the feature is not
  enabled for the organisation and that retrying will not help.
- **Rate limited**: the platform reports too many requests. The command reports that the request was
  rate limited and, when the response says how long to wait, includes that wait.
- **Network unreachable / timeout**: the command reports the connection failure and exits non-zero;
  it does not hang indefinitely with no output, and it does not report a network failure as
  "secret not found".
- **Entry exists with no stored value**: the vault row is present but unpopulated. Both commands
  distinguish this from both "populated" and "absent".
- **Platform-managed entry**: some entries are managed by the platform rather than set by the
  organisation. The record identifies them as such so a user does not try to reason about who set
  them.
- **Name containing shell- or URL-significant characters**: the supplied name is treated as a
  literal value, encoded before it reaches the platform, never interpolated into a command or a
  path unescaped.
- **Variable-kind entry**: the platform returns a variable's plaintext in the record. The CLI
  redacts it like any other value; the entry is still shown, with its kind, description, and value
  presence.
- **A value is somehow returned by the platform**: even if a response were to carry a secret value,
  the CLI does not print it, in any output mode.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The CLI MUST expose a `secret` command group with exactly two subcommands in this feature: `list` and `get <secret-name>`. Creating, rotating, editing descriptions, listing references, and deleting secrets are out of scope.
- **FR-002**: `secret list` MUST retrieve and print every vault entry belonging to the caller's organisation. Where the platform imposes a result ceiling the CLI cannot page past, `secret list` MUST print every entry up to that ceiling and MUST warn on stderr that the ceiling was reached — it MUST NOT truncate silently.
- **FR-003**: `secret list` MUST display, for each entry: its name, its kind (secret or variable), whether a value is stored, and its description.
- **FR-004**: `secret list` MUST render an entry that holds no stored value using an explicit placeholder that cannot be mistaken for a populated entry or for a blank name.
- **FR-005**: An organisation with an empty vault MUST produce an explicit "no secrets" message and a zero exit code, distinguishable from every failure mode.
- **FR-006**: `secret get <secret-name>` MUST resolve the entry by its exact, case-sensitive name and MUST display its name, whether a value is stored, and every other non-sensitive property the platform returns for it — including description, kind, whether the entry is platform-managed, its revision, who created it, who last rotated it, and the relevant timestamps.
- **FR-007**: `secret get` MUST exit non-zero with a single-line, actionable message when no secret matches the supplied name, and that message MUST state that matching is exact and case-sensitive.
- **FR-008**: Neither command MAY print, log, or write to any output stream a stored value or any fragment of one, in any output mode, including `--json` and including error paths. This applies to **both** vault kinds. Entries of kind `secret` are never readable back from the platform, but entries of kind `variable` do return their plaintext, and the CLI MUST redact that too rather than passing it through. A future opt-in flag may reveal variable plaintext; this feature ships no such flag, so the rule is unconditional.
- **FR-009**: Both commands MUST accept `--json`, which makes stdout a single valid JSON document — on success and on failure alike — with no spinner, colour, or human-facing prose mixed in.
- **FR-010**: Both commands MUST send progress indicators, warnings, and errors to stderr only, leaving stdout usable in a pipeline.
- **FR-011**: Both commands MUST exit zero only on success and non-zero on any failure, so shell scripts and CI can branch on the exit code. `secret get` against a name that does not exist is a failure.
- **FR-012**: Both commands MUST authenticate using the CLI's existing credential resolution unchanged — the active named profile, the `--profile` flag, and the `VOICEAI_API_KEY` environment variable — exactly as every other `voiceai` subcommand does. No new environment variable is introduced.
- **FR-013**: The commands MUST NOT print, log, or echo the API key, and MUST NOT include it in error output.
- **FR-014**: Failures MUST be distinguishable by the user: an unset credential, a rejected credential, a feature disabled for the organisation, a rate limit, a missing secret, and a network failure each produce a different message.
- **FR-015**: When the platform returns a request identifier alongside an error, the command MUST include it in the error message so the failure can be traced in support.
- **FR-016**: `voiceai secret --help` and each subcommand's help MUST document the flags, the case-sensitivity of name matching, and that values are never displayed, in the same style as the existing `tool` and `agents` command groups.

### Key Entities

- **Secret (vault entry)**: A named credential an organisation stores for its agents and tools to use
  at run time. Carries a name, a kind, a description, a revision number, whether a value is currently
  stored, whether the platform manages it, who created it, who last rotated it and when, and creation
  and update timestamps. The stored value itself is never readable back — it is write-only from the
  caller's point of view.
- **Kind**: A vault entry is either a **secret** — write-once, never readable back — or a
  **variable** — a non-sensitive configuration value the platform will return in plaintext. Both live
  in the same vault and both appear in these commands. The kind changes what the entry means to the
  user and what the platform is willing to disclose, so it is displayed on both commands.
- **Value presence**: The distinction between an entry that holds a usable value and one that exists
  as a name only. This is what "is the secret available?" actually means, and it is separate from
  whether the entry exists at all.
- **Managed entry**: A vault entry the platform provisions and controls rather than the organisation.
  Relevant because the user cannot reason about its provenance the way they can for their own entries.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user who has a working credential can see every secret name their organisation holds in a single command, with no prior configuration beyond what they already use for other `voiceai` commands.
- **SC-002**: A user who knows a secret's name can determine, in one command, all three of: whether it exists, whether it is populated, and when it was last rotated.
- **SC-003**: Output of both commands, without `--json`, is one record per line and parseable by standard line-and-column shell tools, so a user can extract any single column without writing a parser.
- **SC-004**: A shell script can gate a deploy on `voiceai secret get <name>` using the exit code alone, with no output parsing, and gets the right answer for both "absent" and "present".
- **SC-005**: Across every scenario in this specification — success, empty vault, missing name, and each failure mode — no stored secret value appears in stdout, stderr, or any log the commands produce. This is verified by asserting a sentinel value never appears in any output stream.
- **SC-006**: Every failure mode identified in Edge Cases produces a non-zero exit and a message that names both what went wrong and what the user can do next; no failure mode produces a silent success or an empty result that resembles one.
- **SC-007**: An organisation holding more secrets than a single platform response returns still sees all of them; a completeness check comparing the command's output against the platform's own count matches exactly.
- **SC-008**: With `--json`, the output of both commands parses successfully on the first attempt in 100% of runs, including error runs.

## Assumptions

- The platform endpoints described in slng-ai/backend#688 are, or will be, deployed to the
  environment the CLI targets before this feature ships. If they are absent, both commands fail with
  the standard error path rather than crashing.
- "Fetch vault values by name" means fetching a vault entry's **record** by name. Secret values are
  not readable back from the platform by design, so this feature reports presence and metadata, never
  plaintext. A command that printed a secret to a terminal would violate constitution Principle V and
  is deliberately not being built.
- Secrets are read-only from the CLI in this feature. Create, rotate, description edit, reference
  listing, and delete are deliberately excluded even though the platform exposes them.
- Vault entries belong to exactly one organisation and have no curated/organisation split, so this
  feature has no `--source` flag and no name-collision handling — unlike the `tool` command group it
  otherwise mirrors.
- The `secret` command group follows the conventions already set by `voiceai tool`: subcommand tree,
  `--json`, spinner on stderr only when attached to a terminal, tab-separated human output, and
  profile-aware credentials.
- Secrets live under the same platform surface as agents and tools, so the command group honours the
  same base-URL override that those groups already support.
- Name matching is exact and case-sensitive because the platform matches that way; the CLI does not
  attempt fuzzy matching or "did you mean" suggestions in this feature.
- The token stored as `SLNG_API_KEY` in a local `.env` is the same credential the CLI already reads
  as `VOICEAI_API_KEY`; a developer testing this feature exports it under that name. Reading `.env`
  files is not being added to the CLI as a product behaviour, and no second environment variable name
  is introduced.
- The singular `secret` is used rather than `secrets` to match the existing singular `tool` group.
  The group covers the whole vault, variables included, because the platform mounts both kinds under
  the same surface and the user asked for `voiceai secret`.
- Redacting variable plaintext is a deliberate choice, not an oversight. The platform is willing to
  return it, but this feature is a presence check, and the laziest safe default is one rule — never
  print a value — rather than a per-kind rule the user has to remember. `--reveal` is the obvious
  escape hatch if someone needs it; it is not built here.
