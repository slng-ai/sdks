# Feature Specification: Tool Catalog Commands

**Feature Branch**: `feat/pecify-integration-setup-648f7b`

**Created**: 2026-08-26

**Status**: Draft

**Input**: User description: "as part of this pr that is now available in the backend https://github.com/slng-ai/backend/pull/688 — We now have endpoints we can use to fetch tools by name and list tools. I want to extend this CLI (voiceai) to make sure we can run two new commands: `voiceai tool list` (list all tools and versions with the new endpoint) and `voiceai tool get <tool-name>` (returns the tool name and version, plus any additional property available). The way you access the endpoint is via the SLNG_API_KEY already available in `.env`."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See every tool my organisation can use, with its version (Priority: P1)

A developer building a voice agent needs to know which tools exist and which version of each is
current, without opening the dashboard. They run one command and get a compact table: every tool
available to their organisation — both the curated tools the platform ships and the ones their own
organisation authored — each with its name, type, source, and latest version.

**Why this priority**: This is the discovery entry point and the only way to answer "what do we
have?" It delivers standalone value even if `get` never ships.

**Independent Test**: Run `voiceai tool list` against an organisation with at least one curated tool
and one organisation tool; confirm both appear, each with a version column, and that the command
exits zero.

**Acceptance Scenarios**:

1. **Given** a valid credential for an organisation with tools, **When** the user runs `voiceai tool list`, **Then** every tool visible to that organisation is printed, one per line, including name, type, source, and latest version.
2. **Given** a tool that has never been built or published, **When** it appears in the list, **Then** its version cell shows an explicit "no version yet" indicator rather than a blank or a misleading `0`.
3. **Given** an organisation with no tools of its own, **When** the user runs `voiceai tool list`, **Then** the curated tools still appear and the command exits zero.
4. **Given** more tools exist than fit in one page of API results, **When** the user runs `voiceai tool list`, **Then** all tools are retrieved and printed — the user is never silently shown a truncated list.
5. **Given** the user passes `--source org`, **When** the list is printed, **Then** only organisation-authored tools appear; `--source curated` shows only curated tools.

---

### User Story 2 - Inspect one tool by name (Priority: P1)

A developer who already knows a tool's name — because they saw it in an agent config or in the list —
wants its full record: version, description, type, argument schema, declared secrets, and build/run
health, so they can decide whether to attach it to an agent or debug why it is failing.

**Why this priority**: Equal to User Story 1. Tool names already appear in agent configs and in the
dashboard, so a user arrives with a name in hand far more often than they arrive needing to browse.
Both commands together are the MVP; neither alone is the whole ask.

**Independent Test**: Run `voiceai tool get <known-tool-name>` and confirm the printed record
contains at minimum the name and the latest version, plus the remaining properties the API exposes.

**Acceptance Scenarios**:

1. **Given** a tool named `api_request` exists, **When** the user runs `voiceai tool get api_request`, **Then** the tool's name and latest version are printed, along with every other property the API returns for that tool.
2. **Given** no tool matches the supplied name, **When** the user runs `voiceai tool get nope`, **Then** a one-line "not found" message names the tool that was searched for, and the command exits non-zero.
3. **Given** the user supplies a name that differs only in letter case from a real tool, **When** the lookup returns nothing, **Then** the error message states that tool names are matched exactly and case-sensitively.
4. **Given** a name that matches both a curated tool and an organisation tool, **When** the user runs `voiceai tool get <name>`, **Then** the organisation tool's record is printed to stdout and a single line on stderr states that a curated tool of the same name was shadowed and can be shown with `--source curated`.
5. **Given** the same collision, **When** the user runs `voiceai tool get <name> --source curated`, **Then** the curated tool's record is printed and no shadowing note appears.

---

### User Story 3 - Script against tool data (Priority: P3)

An engineer wiring a CI check or a release script needs the same information as a machine-readable
document so they can assert, for example, that a tool's version advanced before a deploy.

**Why this priority**: Additive convenience once the human-readable output exists, and it matches the
convention every other `voiceai` subcommand already follows.

**Independent Test**: Run both commands with `--json`, pipe the output to a JSON parser, and confirm
it parses and contains the version field.

**Acceptance Scenarios**:

1. **Given** `--json` is passed to either command, **When** it succeeds, **Then** stdout contains only a valid JSON document and no decorative output.
2. **Given** `--json` is passed and the request fails, **When** the command exits non-zero, **Then** stdout still contains a valid JSON document describing the failure, so a parsing script does not choke.
3. **Given** the command is run without a terminal attached (piped or in CI), **When** it runs, **Then** no progress spinner or colour codes contaminate stdout.

---

### Edge Cases

- **Missing credential**: no API key is configured. The command exits non-zero with a message naming
  the exact ways to supply one, and never prints a partial or empty table that reads like "you have
  no tools".
- **Credential valid but organisation lacks access**: the platform reports the shared-resource
  surface as permanently disabled for this organisation. The command reports that the feature is not
  enabled for the organisation and that retrying will not help.
- **Rate limited**: the platform reports too many requests. The command reports that the request was
  rate limited and, when the response says how long to wait, includes that wait.
- **Network unreachable / timeout**: the command reports the connection failure and exits non-zero;
  it does not hang indefinitely with no output.
- **Name collision across sources**: one name maps to two distinct tools. `list` shows both rows; `get` shows the organisation tool and reports the shadowed curated one on stderr.
- **Tool with no version**: `latest_version` is absent for tools that have never been built.
- **Very large properties**: a tool's source code or argument schema can be large. Human-readable
  output must stay legible; the full value is always available via `--json`.
- **Name containing shell-significant characters**: the supplied name is treated as a literal value,
  never interpolated into a command or a URL path without encoding.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The CLI MUST expose a `tool` command group with exactly two subcommands in this feature: `list` and `get <tool-name>`. Creating, editing, running, publishing, and deleting tools are out of scope.
- **FR-002**: `tool list` MUST retrieve every tool visible to the caller's organisation, including both curated (platform-provided) and organisation-authored tools, requesting further pages until a page comes back short. Where the platform imposes a pagination ceiling the CLI cannot page past, `tool list` MUST print every tool up to that ceiling and MUST warn on stderr that the ceiling was reached — it MUST NOT truncate silently.
- **FR-003**: `tool list` MUST display, for each tool: name, tool type, source (curated or organisation), and latest version.
- **FR-004**: `tool list` MUST render a tool with no published version using an explicit placeholder that cannot be mistaken for version zero or an empty name.
- **FR-005**: `tool list` MUST accept an optional `--source` filter restricting output to curated or organisation tools.
- **FR-006**: `tool get <tool-name>` MUST resolve the tool by its exact, case-sensitive name and MUST display the tool's name and latest version plus every other property the platform returns for it, including description, type, argument schema, declared secrets, dependencies, last run status, and build/publish health.
- **FR-006a**: When one name resolves to both an organisation tool and a curated tool, `tool get` MUST print the organisation tool and MUST emit a single stderr line naming the shadowed curated tool and how to view it. Human and `--json` output therefore always describe exactly one tool.
- **FR-006b**: `tool get` MUST accept `--source curated|org` to select which side of a name collision to show, and MUST report a not-found error if no tool matches that name under the requested source.
- **FR-007**: `tool get` MUST exit non-zero with a single-line, actionable message when no tool matches the supplied name, and that message MUST state that matching is exact and case-sensitive.
- **FR-008**: Both commands MUST accept `--json`, which makes stdout a single valid JSON document — on success and on failure alike — with no spinner, colour, or human-facing prose mixed in.
- **FR-009**: Both commands MUST send progress indicators, warnings, and errors to stderr only, leaving stdout usable in a pipeline.
- **FR-010**: Both commands MUST exit zero only on success and non-zero on any failure, so shell scripts and CI can branch on the exit code.
- **FR-011**: Both commands MUST authenticate using the CLI's existing credential resolution unchanged — the active named profile, the `--profile` flag, and the `VOICEAI_API_KEY` environment variable — exactly as every other `voiceai` subcommand does. No new environment variable is introduced.
- **FR-012**: The commands MUST NOT print, log, or echo the API key, and MUST NOT include it in error output.
- **FR-013**: Failures MUST be distinguishable by the user: an unset credential, a rejected credential, a feature disabled for the organisation, a rate limit, a missing tool, and a network failure each produce a different message.
- **FR-014**: When the platform returns a request identifier alongside an error, the command MUST include it in the error message so the failure can be traced in support.
- **FR-015**: `voiceai tool --help` and each subcommand's help MUST document the flags, the source concept, and the case-sensitivity of name matching, in the same style as the existing `agents` command group.

### Key Entities

- **Tool**: A named, versioned capability an agent can call. Visible to an organisation either because the organisation authored it or because the platform curates it for everyone. Carries a name, a type, a description, an argument schema, declared secret names, dependencies, a latest version, and health signals describing whether its current content has been built and published successfully.
- **Tool source**: The origin of a tool — curated (platform-wide) or organisation. Two distinct tools may share a name if they have different sources, so source is part of a tool's identity from the user's point of view.
- **Tool version**: A monotonically increasing number identifying the most recently published revision of a tool. Absent for a tool that has never been published.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user who has a working credential can see the full list of tools available to their organisation, with versions, in a single command and with no prior configuration beyond what they already use for other `voiceai` commands.
- **SC-002**: A user who knows a tool's name can retrieve that tool's version and full properties in one command, with no need to first look up an identifier.
- **SC-003**: Output of both commands, without `--json`, is one record per line and parseable by standard line-and-column shell tools, so a user can extract any single column without writing a parser.
- **SC-004**: Every failure mode identified in Edge Cases produces a non-zero exit and a message that names both what went wrong and what the user can do next; no failure mode produces a silent success or an empty result that resembles one.
- **SC-005**: An organisation holding more tools than a single page of platform results still sees all of them, up to the platform's pagination ceiling; a completeness check comparing the command's output against the platform's own count matches exactly. Reaching the ceiling produces a visible stderr warning, never a quietly short list.
- **SC-006**: With `--json`, the output of both commands parses successfully on the first attempt in 100% of runs, including error runs.

## Assumptions

- The platform endpoints described in slng-ai/backend#688 are, or will be, deployed to the environment the CLI targets before this feature ships. If they are absent, both commands fail with the standard not-found error rather than crashing.
- Tools are read-only from the CLI in this feature. Draft creation, build, run, publish, duplicate, version listing, attachment upgrade, and delete are deliberately excluded even though the platform exposes them.
- "Version" means the tool's latest published version number as reported by the platform. Enumerating a tool's full version history is out of scope for `tool get`.
- Both curated and organisation tools are shown by default, because the platform returns both and hiding curated tools would make agent configs that reference them look broken. `--source` exists for users who want one or the other.
- The `tool` command group follows the conventions already set by `voiceai agents`: subcommand tree, `--json`, spinner on stderr only when attached to a terminal, tab-separated human output, and profile-aware credentials.
- Tools live under the same platform surface as agents, so the command group honours the same base-URL override that the `agents` group already supports.
- Name matching is exact and case-sensitive because the platform matches that way; the CLI does not attempt fuzzy matching or "did you mean" suggestions in this feature.
- The token stored as `SLNG_API_KEY` in a local `.env` is the same credential the CLI already reads as `VOICEAI_API_KEY`; a developer testing this feature exports it under that name. Reading `.env` files is not being added to the CLI as a product behaviour, and no second environment variable name is introduced.
- On a name collision, the organisation tool wins because an organisation that authors a tool under a curated name is overriding it deliberately; the curated tool stays reachable through `--source curated` so nothing is hidden.
