# Feature Specification: Push agents with MCP references, and validate before publishing

**Feature Branch**: `004-mcp-push-validation`

**Created**: 2026-09-01

**Status**: Draft

**Input**: User description: "Fix publishing an agent with MCP servers via the CLI, and add pre-publish validation commands. `push` unconditionally refuses any package carrying `mcp_refs`, and the refusal's stated reason is wrong — nothing needs to connect to the server to compute a schema hash, because the platform already caches one and the CLI already reads it. Resolve the server name to its id, copy each cached tool schema hash into `observed_schema_hash`, mint the attachment id client-side as `tool_refs` already does, and treat a capability-unavailable rejection as retryable. Also add `tool run <tool-name>` and `mcp run <server-name>` so an operator can prove a tool or a server works before publishing, and so a server whose capability snapshot has gone stale can be made publishable again by running it."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Push an agent that uses MCP tools (Priority: P1)

An operator has compiled an agent package whose `agent.json` references tools hosted on an MCP
server. Today `push` refuses the package outright, names a reason that is not true, and tells the
operator to go and attach the server by hand in the dashboard — which discards the whole point of
having a package under version control. The operator wants `push` to resolve those references the
same way it already resolves ordinary tool references, and publish.

**Why this priority**: This is the reported defect and the only thing standing between an operator
and a reproducible, file-driven agent. Every other story in this spec exists to make this one
reliable. Shipped alone it delivers the entire reported value.

**Independent Test**: Compile a package that references one or more tools on an existing MCP server,
run `push`, and confirm the published agent carries a working MCP attachment for each reference —
verifiable by reading the agent back and seeing each reference resolved to a server identity, a tool
name, and the schema fingerprint the platform observed.

**Acceptance Scenarios**:

1. **Given** a package referencing a tool on an MCP server that exists in the organisation and whose
   capability snapshot is current, **When** the operator runs `push`, **Then** the push proceeds with
   no MCP-related blocker and the resulting agent exposes that MCP tool.
2. **Given** the same package, **When** the operator runs `push --dry-run`, **Then** the plan lists
   each MCP reference — server name, tool name, whether its attachment is new or reused — before
   anything is created, and creates nothing.
3. **Given** an agent that is already live with MCP attachments, **When** the operator pushes a
   package that declares the same references, **Then** the existing attachment identity for each
   unchanged reference is reused rather than replaced.
4. **Given** an agent that is already live with MCP attachments made in the dashboard and a package
   that does not declare them, **When** the operator runs `push`, **Then** they are warned by name
   about every attachment the push would remove, before it is removed.
5. **Given** a package referencing a server name that no organisation server matches, **When** the
   operator runs `push`, **Then** the push is refused, names the reference that failed to resolve,
   and nothing is created or changed.
6. **Given** a package referencing a tool name the server's capability snapshot does not contain,
   **When** the operator runs `push`, **Then** the push is refused, names the server and the missing
   tool, lists what the snapshot does contain, and nothing is created or changed.

---

### User Story 2 - Prove an MCP server works, and refresh a stale snapshot (Priority: P2)

The platform only accepts an MCP attachment while its own capability snapshot of that server is
fresh; a snapshot observed yesterday is rejected at publish time. An operator wants a single command
that connects to the server right now, reports whether it answered and what it exposes, and — as a
consequence of having connected — leaves the snapshot fresh enough to publish against.

**Why this priority**: Without it, a push of a perfectly correct package fails for a reason the
operator can neither see nor fix from the CLI, and the only recovery is to wait or open the
dashboard. It converts an opaque intermittent failure into a one-command fix.

**Independent Test**: Take a server whose snapshot is older than the freshness window, run
`mcp run <server-name>`, and confirm the command reports a live connection and that a subsequent
`mcp get` shows a newly observed snapshot.

**Acceptance Scenarios**:

1. **Given** an MCP server that is reachable, **When** the operator runs `mcp run <server-name>`,
   **Then** the command reports success, how long the server took to answer, what the server
   identifies itself as, and how many tools it exposes.
2. **Given** the same server, **When** the operator runs `mcp run <server-name> --json`, **Then**
   stdout is a single valid JSON document carrying the connection result and the observed tools, and
   nothing else is written to stdout.
3. **Given** an MCP server whose snapshot is stale, **When** the operator runs `mcp run` and then
   `push`, **Then** the push is no longer rejected for a stale snapshot.
4. **Given** an MCP server that is unreachable or rejects the configured credentials, **When** the
   operator runs `mcp run <server-name>`, **Then** the command exits non-zero and reports the
   platform's own reason on stderr.
5. **Given** a server whose tools have changed since the last snapshot, **When** the operator runs
   `mcp run`, **Then** the command reports which tool names were added or removed relative to the
   previous snapshot.

---

### User Story 3 - Prove a tool works before publishing (Priority: P3)

An operator wants to execute one catalogue tool with a chosen input and see the result, without
compiling a package, without pushing, and without opening the dashboard — to confirm a tool is
healthy before it becomes an agent's dependency, or to diagnose one that is not.

**Why this priority**: `push --run-samples` already covers the publish-time gate for tools the
package ships. This story serves the separate case of an existing catalogue tool the operator did
not author in this package, and is the least urgent of the three.

**Independent Test**: Run `tool run <tool-name>` against a catalogue tool with a known-good input and
confirm the reported outcome matches what the same tool reports in the dashboard.

**Acceptance Scenarios**:

1. **Given** a catalogue tool and an input document, **When** the operator runs
   `tool run <tool-name>` supplying that input and explicit consent to cause side effects, **Then**
   the command reports whether the run succeeded, failed, or timed out, and exits non-zero for
   anything but success.
2. **Given** the same tool, **When** the operator runs it without supplying explicit consent to cause
   side effects, **Then** nothing is executed and the command explains that running the tool will
   reach the tool's real dependencies and how to consent.
3. **Given** an input that does not satisfy the tool's declared argument schema, **When** the
   operator runs the tool, **Then** the failure names the offending fields.
4. **Given** a tool name no catalogue entry matches, **When** the operator runs it, **Then** the
   command exits non-zero saying the name was not found and that names are matched exactly.

---

### Edge Cases

- **Snapshot goes stale between plan and publish.** The plan is built from a snapshot that is fresh,
  the write happens seconds later, and the platform still rejects the attachment as unavailable.
  Push must recover on the operator's behalf — refresh the affected servers and retry once — rather
  than surfacing a transient rejection as a failed push.
- **Snapshot is stale at plan time.** Push should say so with the remedy in the same breath, not fail
  later with a platform error code.
- **Server has never been probed.** Distinct from stale: there is no snapshot at all, so no schema
  fingerprint exists to copy. The remedy is the same command, and the message must not read as "not
  found".
- **The previous probe was truncated.** The snapshot's tool list is knowingly incomplete, so a
  reference that appears missing may exist on the server. A reference that fails to resolve against a
  truncated snapshot must say the snapshot was truncated rather than assert the tool does not exist.
- **A tool's schema changed since the snapshot.** The fingerprint copied into the attachment is
  whatever the platform last observed; that is the contract. Refreshing the snapshot before pushing
  is what makes the attachment describe reality.
- **Two servers share a name.** Server names are matched exactly and case-sensitively; if more than
  one matches, the reference is ambiguous and must be refused by name rather than resolved to an
  arbitrary one.
- **An update would silently drop existing MCP attachments.** Push replaces rather than merges, so an
  agent's dashboard-made MCP attachments are lost unless the package declares them. This must be
  warned about by name, exactly as tool detachments already are.
- **A package declares no MCP references at all.** The overwhelmingly common case must be unaffected:
  no extra reads, no extra output, no behaviour change.
- **`--json` output stays machine-readable on failure.** Every new command keeps stdout a single
  valid JSON document under `--json`, including when it exits non-zero, with diagnostics on stderr.
- **No credentials configured.** Both new commands fail the same way every other authenticated
  command does, without a stack trace.

## Requirements *(mandatory)*

### Functional Requirements

**Pushing MCP references**

- **FR-001**: `push` MUST NOT refuse a package because it carries MCP references. The blanket refusal
  and its stated reason are removed.
- **FR-002**: For each MCP reference in a package, `push` MUST resolve the server named in the
  package to that server's platform identity.
- **FR-003**: For each MCP reference, `push` MUST set the reference's observed schema fingerprint to
  the fingerprint the platform's own capability snapshot records for that tool. `push` MUST NOT
  connect to the MCP server itself to compute it.
- **FR-004**: `push` MUST assign each new MCP attachment an identity generated locally, in the same
  manner it already does for tool attachments.
- **FR-005**: When updating an agent, `push` MUST reuse the existing attachment identity for any MCP
  reference that already exists on the live agent, and MUST preserve every additional field the
  package wrote alongside the reference verbatim.
- **FR-006**: `push` MUST send the resolved MCP references when it writes the agent. It MUST NOT
  send an empty MCP reference list when the package declares references.
- **FR-007**: `push` MUST refuse, before creating or changing anything, any package whose MCP
  reference names a server that does not resolve, resolves ambiguously, or names a tool absent from
  that server's capability snapshot — naming the offending reference in each case.
- **FR-008**: `push` MUST warn by name about every MCP attachment currently on the live agent that
  the push would remove, in the same way it warns about tool detachments.
- **FR-009**: `push --dry-run` MUST list the planned MCP attachments — server name, tool name, and
  whether the attachment is new or reused — and MUST create and change nothing.
- **FR-010**: The `--json` plan document MUST carry the planned MCP references, in the same
  snake_case shape as the rest of that document.
- **FR-011**: When the platform rejects a write because a server's capabilities are unavailable,
  `push` MUST treat it as retryable: refresh the affected servers and retry the write once. If it
  fails again, `push` MUST report the platform's reason and name the command that refreshes a
  snapshot.
- **FR-012**: When a referenced server's snapshot is already older than the platform's freshness
  window at plan time, `push` MUST say so and name the command that refreshes it.
- **FR-013**: A package that declares no MCP references MUST behave exactly as it does today,
  including issuing no additional requests.

**`mcp run`**

- **FR-014**: Operators MUST be able to run `mcp run <server-name>` to connect to one MCP server by
  its exact name and report the outcome.
- **FR-015**: `mcp run` MUST report, on success: that the server answered, how long it took, how the
  server identifies itself, and how many tools it exposes.
- **FR-016**: `mcp run` MUST report which tool names were added or removed relative to the previous
  capability snapshot, or state that the set is unchanged.
- **FR-017**: A successful `mcp run` MUST leave the platform's capability snapshot for that server
  freshly observed, such that a push made immediately afterwards is not rejected for staleness.
- **FR-018**: `mcp run` MUST exit non-zero when the server cannot be reached, rejects the configured
  credentials, or reports an error, and MUST surface the platform's own reason.
- **FR-019**: `mcp run --json` MUST write a single valid JSON document to stdout and nothing else,
  on both success and failure.

**`tool run`**

- **FR-020**: Operators MUST be able to run `tool run <tool-name>` to execute one catalogue tool by
  its exact name with an operator-supplied input.
- **FR-021**: `tool run` MUST accept the input from a file path and from standard input, so it
  composes in a pipeline.
- **FR-022**: `tool run` MUST NOT execute anything unless the operator has explicitly consented to
  side effects on that invocation. Without consent it MUST explain that running the tool reaches the
  tool's real dependencies, and how to consent.
- **FR-023**: `tool run` MUST report the run outcome — succeeded, failed, or timed out — together
  with the platform's error detail when the run did not succeed, and MUST exit non-zero for anything
  other than success.
- **FR-024**: `tool run --json` MUST write a single valid JSON document to stdout and nothing else,
  on both success and failure.
- **FR-025**: Both new commands MUST fail with a clear message, and no stack trace, when no
  credentials resolve.

**Discoverability**

- **FR-026**: Both new commands MUST appear in their parent command's help text with a worked
  example, and `mcp run` MUST be named as the remedy in every message about a stale or absent
  capability snapshot.

### Key Entities

- **MCP reference (in a package)**: what the operator writes — a server named by name, a tool named
  by name, plus any invocation settings and argument overrides. Carries no platform identifiers,
  because a compiler cannot invent identifiers a server assigns.
- **MCP attachment (on an agent)**: what the platform stores — a locally generated attachment
  identity, the server's platform identity, the tool name, the schema fingerprint observed at
  attachment time, and the invocation settings carried over from the reference.
- **Capability snapshot**: the platform's own cached record of what an MCP server exposes — a status,
  the moment it was observed, when it is next due for refresh, the tool list, a per-tool schema
  fingerprint, and a flag for whether the probe was cut short. It is the sole source of the
  fingerprint an attachment records.
- **Connection result**: the outcome of connecting to an MCP server on demand — reachable or not,
  how long it took, how the server identifies itself, and the tools it currently exposes.
- **Tool run result**: the outcome of executing one catalogue tool — succeeded, failed, or timed out,
  with the platform's error detail on anything but success.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An operator can publish an agent that uses MCP tools entirely from a compiled package,
  with no dashboard step. The dashboard is required for zero steps of that journey, down from at
  least one today.
- **SC-002**: Pushing a package with MCP references requires no more operator commands than pushing
  the equivalent package with ordinary tool references.
- **SC-003**: A package whose MCP snapshot went stale overnight becomes publishable with exactly one
  additional command, and that command is named in the message the operator sees.
- **SC-004**: A push whose only problem is a stale snapshot succeeds without operator intervention,
  because the retry resolves it.
- **SC-005**: 100% of MCP-related push refusals name the specific reference at fault; none report a
  bare category.
- **SC-006**: No push creates or changes anything when an MCP reference cannot be resolved.
- **SC-007**: No push removes an existing MCP attachment without having named it first.
- **SC-008**: An operator can determine whether an MCP server or a catalogue tool is currently
  working with one command and no arguments beyond its name (plus, for a tool, its input and
  consent).
- **SC-009**: Every new command's `--json` stdout parses as a single JSON document on success and on
  failure, so the commands are usable from a script.
- **SC-010**: Pushing a package with no MCP references issues the same number of requests as before
  this change.

## Assumptions

Facts below marked *(verified live)* were confirmed against the production agents API on 2026-09-01
before this spec was written.

- **A capability snapshot already carries a per-tool schema fingerprint** *(verified live)*, and the
  value a live agent stores as its attachment's observed fingerprint is byte-identical to it. This is
  the basis for FR-003: nothing needs to connect to compute it.
- **Connecting to a server on demand is an existing, supported operation** *(verified live)*, it
  returns the server's live capabilities, and performing it refreshes the stored snapshot's observed
  time. This is the mechanism behind `mcp run` and FR-017.
- **The freshness window is approximately five minutes** *(verified live, from the refresh time the
  platform schedules after a connect)*. The spec deliberately does not hard-code the number: push and
  `mcp run` read the platform's own scheduled refresh time rather than assuming a constant.
- **There is no way to invoke an individual MCP tool through the platform** *(verified live: no such
  operation exists)*. `mcp run <server-name>` therefore means "connect to this server and report what
  it exposes", not "call one of its tools". Invoking a single MCP tool is out of scope.
- **`tool run` wraps the same execution the publish gate already uses**, so it inherits that
  operation's consent requirement — which is why FR-022 requires explicit consent rather than
  inventing a new safety rule.
- **Server and tool names are matched exactly and are case-sensitive**, consistent with every other
  name-addressed command in the CLI.
- **MCP references are resolved, never created.** As with tools, `push` will not create an MCP server
  that does not exist; the operator is sent to the dashboard for that, deliberately.
- **A capability-unavailable rejection is retryable and self-healing**, per the reporting operator.
  One retry after a refresh is the assumed remedy; repeated retries are not.
- **Scope excludes** creating, editing or deleting MCP servers from the CLI, and excludes any change
  to how the platform probes or caches capabilities.

## Dependencies

- The organisation must already contain the MCP servers a package references, with working
  credentials configured on them.
- The public shared-resource routes for tools and MCP servers are not part of the published API
  schema and never reach the generated SDK, so this feature is bound to the CLI's existing direct
  access path for them.

## Constitutional Notes

- **Principle III (The CLI Is a Pipe)**: both new commands must be usable non-interactively, with
  results on stdout and diagnostics on stderr. FR-021's standard-input path exists for this reason.
- **Development Workflow**: this feature adds argument parsing, so it lands with tests. The existing
  test that asserts MCP references are refused is inverted by FR-001 and must be replaced, not
  deleted.
- **Principle V (Credentials Live in the Environment)**: MCP server credentials are reported by the
  name of the vault entry holding them, never by value, in every new output path.
