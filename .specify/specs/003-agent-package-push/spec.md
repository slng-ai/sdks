# Feature Specification: Push an agent package

**Feature Branch**: `feat/voice-cli-agent-push-767044`

**Created**: 2026-08-27

**Status**: Draft

**Input**: User description: "voiceai agents push <dir> — push an unmute-compiled agent package (build/slng/) to SLNG, with pre-flight validation of vault secrets and tool name→id resolution"

## Overview

Unmute compiles an agent package into a directory of JSON bodies and stops. It opens no
connection to SLNG, reserves nothing, and — by design — writes **names** everywhere the
platform wants **identifiers**, because no compiler can invent an id a server assigns.

Today the gap between "unmute compiled it" and "SLNG is running it" is closed by hand:
read the emitted runbook, look ids up in the dashboard, hand-edit the JSON, post it.
The runbook says so in as many words. This feature closes that gap in one command.

The command's defining property is that **it tells you everything that is wrong with your
account before it changes anything in your account.** A push that cannot succeed must
fail while the organisation is still exactly as it was, naming every missing thing at
once and pointing at the dashboard page that fixes it — not failing on the first missing
secret, then the next, over five round trips.

The command is non-interactive throughout. It asks nothing and waits for nothing, so it
behaves the same at a terminal and in a pipeline.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Learn what my account is missing, before anything changes (Priority: P1)

An operator has an unmute package and an SLNG organisation and does not know whether the
two fit together. They point the command at the package. It reads every emitted file,
works out every account-level thing the package depends on — vault entries, tools it
expects to already exist — checks all of them, and reports the complete set of problems in
one pass. Nothing in the organisation is created, updated or reserved. Every problem names
the thing that is missing and the dashboard page where it is fixed.

**Why this priority**: This is the whole value of the feature even with no push attached.
An operator who runs only this already stops guessing, and it is the only part that is
safe to run against a production organisation with no consequences. It is also the
precondition for every other story: a push that skips it mutates an organisation into a
half-configured state.

**Independent Test**: Point the command at `examples/slng-support` in dry-run against an
organisation that lacks the `end_call` tool. It reports that one missing reference with
the tools dashboard link, exits non-zero, and a subsequent listing of agents, tools and
vault entries is byte-identical to the one taken before.

**Acceptance Scenarios**:

1. **Given** a package whose files name vault entries `STRIPE_KEY` and `CRM_TOKEN`, and an
   organisation holding neither, **When** the operator runs the command, **Then** both
   names are listed together in one message with the vault dashboard link, no tool or
   agent is created, and the command exits non-zero.
2. **Given** a package referencing a tool by a name no visible tool has, **When** the
   operator runs the command, **Then** the unresolved name is reported with the tools
   dashboard link and the instruction to rename the reference or create the tool, and
   nothing is created.
3. **Given** a package that is valid against a fully provisioned organisation, **When**
   the operator runs the command in dry-run, **Then** it reports what it *would* do —
   which tools it would create versus update, which references resolved to which existing
   tools, and, when an agent of that name already exists, what the update would remove
   from it — and changes nothing.
4. **Given** a package with several independent problems at once — a missing vault entry
   and an unresolvable tool name — **When** the operator runs the command, **Then** both
   are reported in a single run rather than one per attempt.
5. **Given** a directory that is not an agent package, **When** the operator runs the
   command, **Then** the command says which file it expected and where it looked, rather
   than reporting a parse error.

---

### User Story 2 - Push the agent itself (Priority: P2)

With validation passing, the operator pushes. Every reference the package wrote as a name
is resolved to the identifiers the platform requires, an attachment identifier is minted
for each reference, and the agent is created — or, if an agent of that name already
exists, updated in place so that the agent matches what the package declares. The command
reports the agent's identifier and labels the version it just wrote, so the operator can
tell which push produced the running agent.

**Why this priority**: Together with P1 this pushes the smallest real package — one whose
tools are all capabilities the platform already owns, which is the `examples/slng-support`
case — end to end, with no hand-editing. That is the first point at which the command
replaces the runbook.

**Independent Test**: Push `examples/slng-support` to an organisation that has `end_call`.
An agent appears, its reference to `end_call` carries resolved identifiers rather than a
name, and re-running the command updates that same agent instead of creating a second one.

**Acceptance Scenarios**:

1. **Given** a package referencing `end_call` and an organisation that has it, **When**
   the operator pushes, **Then** the created agent's reference carries the tool's own
   identifier and version plus a freshly minted attachment identifier, and no reference
   in the posted body carries a bare name.
2. **Given** a successful push, **When** it completes, **Then** the command prints the
   agent identifier and the version label it wrote, and the operator can reach the agent
   by that identifier without consulting the dashboard.
3. **Given** an organisation already holding an agent with the package's name, **When**
   the operator pushes, **Then** that agent is updated rather than duplicated, and the
   command says which of the two it did before doing it.
4. **Given** an existing agent carrying a reference the package no longer declares,
   **When** the operator pushes, **Then** that reference is detached, because the package
   is the source of truth for what it declares.
5. **Given** a package that is pushed twice with no edits in between, **When** the second
   push runs, **Then** the agent's existing attachments are reused rather than replaced,
   so a reference that did not change keeps its attachment identity.
6. **Given** a push that the platform rejects — an unavailable model, a rejected region —
   **When** it fails, **Then** the command surfaces the platform's own error naming the
   offending field, rather than a generic failure.

---

### User Story 3 - Sync the package's own tools (Priority: P3)

A package that carries its own tool bodies needs each one to exist on the platform before
the agent can reference it. For every tool the package ships, the command creates it or
updates the existing one of that name, confirms the platform accepted its configuration,
exercises it against its own sample if it ships one, and publishes a version. The
published version is what the agent's reference then points at. A sample that fails stops
the push: a tool that does not work does not reach a live agent.

**Why this priority**: It extends the command from packages that only borrow the
platform's own capabilities to packages that bring their own. It is strictly more work
than P2 and the smallest package needs none of it, so it slices off cleanly.

**Independent Test**: Push a package carrying one tool body. The tool appears on the
platform, published at a version, and the pushed agent's reference names that version.

**Acceptance Scenarios**:

1. **Given** a package shipping a tool whose name no existing tool has, **When** the
   operator pushes, **Then** that tool is created, published, and referenced at the
   version just published.
2. **Given** a package shipping a tool whose name an existing tool already has, **When**
   the operator pushes, **Then** the existing tool is updated and published as a new
   version rather than a second tool of the same name being created.
3. **Given** a shipped tool that carries a sample invocation, **When** the operator
   pushes, **Then** the tool is exercised against that sample and the outcome is reported.
4. **Given** a shipped tool whose sample fails when exercised, **When** the push runs,
   **Then** the push stops, the agent is not created or updated, and the command reports
   which tool failed and what the failure was.
5. **Given** a shipped tool that carries no sample, **When** the operator pushes, **Then**
   it is created and published without being exercised, and the report says it was not
   exercised rather than silently implying it passed.
6. **Given** a package shipping several tools where one fails partway through, **When**
   the push aborts, **Then** the command reports exactly which tools were already created
   or published and which were not, so the operator knows the state they are in.

---

### Edge Cases

- **The package points at a directory, not a file.** The operator may reasonably name
  either the package root or the compiled output directory inside it. Both must work, and
  a directory that is neither must be told which file was expected and where the command
  looked.
- **A tool name resolves to more than one tool.** A name can belong both to a capability
  the platform curates and to one the organisation authored. The command must resolve this
  the same way the rest of the CLI already does rather than inventing a second rule, and
  must say which one it chose.
- **A reference has no shipped body and no existing tool.** This is the "create it in the
  dashboard" case and must be reported as such — it is not a bug in the package.
- **An existing agent was edited in the dashboard since the last push.** Updating replaces
  what the package declares, so those edits are overwritten. The operator's protection is
  that dry-run shows what an update would change before it changes it.
- **The agent name matches more than one existing agent.** Name is not guaranteed unique.
  The command must not guess which one to update.
- **The push is interrupted partway.** Published tool versions cannot be unpublished. The
  command must report the state it left rather than implying it rolled back.
- **Credentials resolve to a different organisation than the operator expects.** The
  command reports which organisation it is about to write to before it writes.
- **The package declares a region, and the models it names are not served there.** This is
  rejected by the platform at push, not by the command, and the platform's own message
  naming the model and region is what the operator needs to see.

## Requirements *(mandatory)*

### Functional Requirements

#### Reading the package

- **FR-001**: The command MUST accept a single directory and locate the compiled agent
  body within it, accepting both the package root and the compiled output directory.
- **FR-002**: The command MUST report a directory that contains no compiled agent body by
  naming the file it expected and the locations it searched.
- **FR-003**: The command MUST treat the compiled package as the source of truth for what
  it declares, and MUST NOT require the operator to hand-edit any emitted file before
  pushing.

#### Pre-flight validation (runs before any change)

- **FR-004**: The command MUST determine every vault entry the package depends on,
  including entries named by shipped tool bodies and entries named by tokens embedded in
  the agent's own text.
- **FR-005**: The command MUST verify that every such vault entry already exists in the
  organisation's vault, and MUST report every missing name together in one message rather
  than stopping at the first.
- **FR-006**: The command MUST NOT create, modify or read the value of any vault entry.
- **FR-007**: The command MUST resolve every tool reference that ships no body to an
  existing tool by exact name, and MUST report every name it could not resolve together in
  one message.
- **FR-008**: The command MUST complete all of FR-004 through FR-007 and report their
  combined result before creating or modifying anything in the organisation.
- **FR-009**: The command MUST exit non-zero and change nothing when pre-flight validation
  fails.
- **FR-010**: The command MUST offer a way to run pre-flight validation and report its
  findings without proceeding to any change.
- **FR-011**: The command MUST report which organisation it is operating against before
  making any change.

#### Actionable failure messages

- **FR-012**: A missing vault entry MUST be reported with the missing names and a link to
  the vault dashboard at `https://app.slng.ai/vault/secrets`.
- **FR-013**: An unresolvable tool name MUST be reported with the name, the instruction to
  either rename the reference or create the tool, and a link to the tools dashboard at
  `https://app.slng.ai/tools`.
- **FR-014**: Every failure message MUST name the specific thing that is wrong, not only
  that something is.

#### Syncing the package's tools

- **FR-015**: For each tool body the package ships, the command MUST create a tool of that
  name, or update the existing tool of that name.
- **FR-016**: The command MUST confirm that the platform accepted each synced tool's
  configuration.
- **FR-017**: The command MUST exercise a synced tool against its own sample when the
  package ships one, and MUST report the outcome.
- **FR-018**: The command MUST stop the push when a sample fails, MUST NOT create or
  update the agent, and MUST report which tool failed and what the failure was.
- **FR-019**: The command MUST report a synced tool that ships no sample as not exercised,
  and MUST NOT present it as having been verified by execution.
- **FR-020**: The command MUST publish a version of each synced tool, and the agent's
  reference to it MUST point at the version just published.
- **FR-021a**: A tool that reached the organisation before the failure MUST be reported as
  left behind, and the report MUST distinguish a published version (permanent) from a
  created-but-unpublished tool (deletable), because the remedies differ.
- **FR-021**: When syncing fails partway, the command MUST report which tools were created,
  updated or published before the failure.
- **FR-041**: The command MUST refuse to ship a tool body whose type the platform allows only
  one of per organisation, when the organisation already holds one, and MUST name the tool it
  already has. Numbered out of sequence because it was discovered during live testing, after
  the rest of this section was written.

#### Resolving references

- **FR-022**: The command MUST replace every reference written as a name with the
  identifiers the platform requires, so that no reference in the pushed body carries a bare
  name.
- **FR-023**: The command MUST mint an attachment identifier for each reference that does
  not already have one on this agent, because the platform requires one and does not
  generate it.
- **FR-024**: The command MUST reuse the existing attachment identifier when updating an
  agent whose reference to the same tool is already attached, so that an unchanged
  reference keeps its attachment identity across pushes.
- **FR-025**: The command MUST NOT reuse an attachment identifier taken from a different
  agent.
- **FR-026**: The command MUST preserve the descriptive and behavioural fields the package
  wrote alongside each reference, changing only the identifiers.
- **FR-027**: When a referenced name belongs to both a curated and an organisation-authored
  tool, the command MUST apply the same precedence the CLI's existing tool commands apply,
  and MUST report which one it resolved to.

#### Pushing the agent

- **FR-028**: The command MUST create the agent when no agent of the package's name exists.
- **FR-029**: The command MUST update the existing agent when exactly one agent of the
  package's name exists, replacing what the package declares so that the agent matches the
  package. A reference the package no longer declares MUST be detached.
- **FR-030**: The command's dry-run MUST report what an update would change on an existing
  agent, including what it would detach or overwrite, before any change is made.
- **FR-031**: The command MUST refuse to guess when more than one agent of the package's
  name exists, and MUST offer a way for the operator to name the target. The platform
  enforces unique agent names per organisation, so this is a defensive guard rather than a
  reachable path; the operator-facing value of naming the target is pushing a package to an
  agent whose name differs from the package's ([D16](./research.md#d16--agent-names-are-unique-so-fr-031-is-a-guard-not-a-path)).
- **FR-032**: The command MUST say whether it is creating or updating before it does so.
- **FR-033**: The command MUST label the version it writes, so that a running agent can be
  traced back to the push that produced it.
- **FR-034**: The command MUST report the agent's identifier on success.
- **FR-035**: The command MUST surface the platform's own error, including any field it
  names, when the platform rejects the push.

#### Composition

- **FR-036**: The command MUST run without interaction. It MUST NOT prompt, and MUST behave
  identically at a terminal and in a pipeline.
- **FR-037**: The command MUST offer machine-readable output, and MUST keep that output
  parseable on failure as well as on success.
- **FR-038**: The command MUST keep progress and diagnostics separate from its result
  output, so the result composes in a pipeline.
- **FR-039**: The command MUST exit non-zero on any failure, including a pre-flight failure
  that changed nothing.
- **FR-040**: The command MUST NOT print any vault value.

### Key Entities

- **Agent package**: A directory unmute compiled. Carries the agent body, and optionally a
  set of tool bodies. Disposable and reproducible — it is compiled again rather than
  edited. Holds no identifiers and no local record of what was pushed before.
- **Agent body**: The declared agent — its name, prompt, greeting, language, region, model
  bindings, variable declarations and defaults, and its references to tools. Written with
  names where the platform wants identifiers.
- **Tool reference**: One entry in the agent body naming a capability the agent may call,
  plus the descriptive and behavioural fields the package derived. Requires a tool
  identifier, a version, and an attachment identifier before the platform accepts it.
- **Attachment identifier**: Identifies one reference's attachment to one agent. Not the
  tool's identity. Minted by the pusher, never copied between agents.
- **Shipped tool body**: A tool the package brings itself, which must exist and be
  published on the platform before the agent can reference it.
- **Curated reference**: A reference to a capability the platform already owns. Needs no
  body created, but still needs its identifier filled in.
- **Vault entry**: A named secret or variable held by the organisation. The package names
  it; the value never appears in the package, in any emitted file, or in any output.
- **Version label**: The mark placed on the agent version a push writes, connecting a
  running agent to the push that produced it.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An operator can take a freshly compiled package and a provisioned
  organisation and get a running agent with one command and zero hand-edits to any emitted
  file.
- **SC-002**: A push that cannot succeed leaves the organisation byte-identical to its
  state before the command ran, verifiable by comparing listings of agents, tools and vault
  entries taken before and after.
- **SC-003**: An operator whose organisation is missing several things learns all of them
  from one run, not one per run.
- **SC-004**: Every failure caused by missing account state names the missing thing and the
  page that creates it, with no failure message requiring the operator to consult the
  emitted runbook to know what to do next.
- **SC-005**: Pushing the same unchanged package twice produces one agent, not two, and
  leaves the attachment identity of every unchanged reference intact.
- **SC-006**: An operator can see everything an update would change on an existing agent
  before it is changed.
- **SC-007**: An operator can trace any running agent back to the push that produced it
  from the version label alone.
- **SC-008**: A tool whose sample fails never reaches a live agent.
- **SC-009**: The command runs unattended in a pipeline and behaves identically there and
  at a terminal.
- **SC-010**: No vault value appears in any output, on success or on failure.

## Assumptions

- **The request enumerated four steps and called them five.** The fifth was telephony trunk
  verification and selection, described separately in the request. It is deferred out of
  this feature by decision; see Out of Scope.
- **All validation happens before any change is made.** The request's first step requires
  stopping "before anything is created", so pre-flight completes and reports in full before
  the mutating half of the command begins.
- **Updating replaces rather than merges.** The package is the source of truth for what it
  declares, so an update makes the agent match the package and detaches what the package
  dropped. This overwrites configuration added in the dashboard since the last push; the
  operator's protection is dry-run (FR-030), not a confirmation prompt.
- **A failing sample stops the push.** The tool exists and the platform accepted it, but it
  did not work, and a tool that does not work must not reach a live agent. Because tools
  are synced before the agent is written, the abort leaves published tool versions behind —
  which is why FR-021 requires reporting what was left.
- **`examples/slng-support` is the smallest case, not the representative one.** Its tools
  are all capabilities the platform owns and it needs no vault entries, so it exercises
  FR-007, FR-022 and FR-023 and none of the tool-syncing requirements. A package with
  shipped tool bodies is needed to exercise the rest.
- **The compiled output lives at `build/slng/` within the package.** Both that directory
  and its parent are accepted as the argument.
- **Shipped tool bodies live in a `tools/` directory alongside the compiled agent body**,
  and are absent for a package whose tools are all curated.
- **A package is pushed to the organisation the CLI's existing credential resolution
  selects.** This feature adds no new credential path. Note that the environment variable
  and the stored profile in this repository resolve to different organisations, so the
  organisation is reported before any change (FR-011) rather than assumed.
- **Published tool versions cannot be unpublished**, so a partial push is reported rather
  than rolled back.
- **The version label is derived by the command** from what it can observe about the push
  rather than requiring the operator to invent one, while remaining overridable.
- **The vendored OpenAPI document under `specs/` is behind the live agents API.** The
  compiled body in `examples/slng-support/build/slng/agent.json` uses a schema version,
  a tool mode, reference arrays and a region value that the vendored document does not
  describe. Request and response shapes must therefore be established against the live API
  during planning; the vendored document is not sufficient and, being read-only and synced
  from upstream, must not be edited to close the gap.

## Dependencies

- The organisation's tool catalogue and vault must be readable. The CLI already reads both.
- Creating, updating, exercising and publishing tools are capabilities the CLI does not
  have today; only reading them exists. US3 depends on establishing those during planning.
- Agent version labelling is likewise not something the CLI does today.

## Out of Scope

- **Telephony.** Trunk verification, direction handling and trunk selection are deferred to
  a later feature by decision. This command neither checks trunks nor attaches one, and a
  package needing telephony is completed in the dashboard after the push. The CLI can
  already list trunks (`voiceai trunks list`) for an operator doing that by hand.
- Compiling a package. Unmute does that; this command consumes its output.
- Creating vault entries, tools or phone numbers. Each is reported and linked, never
  created — the request is explicit that the operator is sent to the dashboard.
- Reading or printing vault values.
- Deleting anything. Detaching a reference the package dropped (FR-029) is not deletion:
  the tool itself is untouched.
- Any local record of what was pushed. The package holds no identifiers and gains none;
  re-running the command re-derives everything from the organisation.
- Talking to the pushed agent. Web sessions and call dispatch already exist as commands.
