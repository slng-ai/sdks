# Pushing agent packages

Reference for `voiceai agents push`: deploying a compiled agent package to SLNG, including
sample runs, MCP snapshots, and the guarded `--require-resolved` mode. For the rest of the CLI,
see the [main README](../README.md).

## Pushing a compiled package

`unmute compile --target slng` writes a deployment body into `build/slng/` and stops. It opens
no connection to SLNG, and it writes **names** everywhere the platform wants identifiers,
because no compiler can invent an id that a server assigns. `agents push` closes that gap. It
resolves every name, mints the attachment ids the platform requires, and creates or replaces
the agent.

```sh
voiceai agents push examples/slng-support --dry-run   # check, change nothing
voiceai agents push examples/slng-support             # push it
voiceai agents push . --json | jq -r '.agent.id'      # scriptable
```

The directory may be the package root or the compiled `build/slng` directory.

Nothing is created until every check passes. Missing vault entries and unresolved tool names
are reported **together**, each with the dashboard page that fixes it, so a push that cannot
succeed leaves your organisation exactly as it was. Note that a vault entry of kind `variable`
does not satisfy a tool's secret requirement; the platform counts secrets only.

Updating **replaces** the agent with what the package declares: a reference the package no
longer names is detached, and configuration added in the dashboard since the last push is
overwritten. `--dry-run` lists what would be detached before you commit to it.

## Sample runs

```sh
voiceai agents push . --run-samples          # also execute each tool's sample
```

A package that ships its own tool bodies needs each one created and published before the agent
can reference it, and the platform will not publish a `code` or `api_request` tool until one
successful run has proved it. Those runs execute against your real dependencies (a webhook
really fires), so `push` never performs one without `--run-samples`. Write the input as
`build/slng/samples/<tool>.json`. A tool that needs a run and has no sample is reported before
anything is created, not discovered halfway through.

## MCP references

Packages carrying `mcp_refs` are resolved like any other reference: the server name becomes its
id, and each tool's `observed_schema_hash` is copied from the platform's own capability
snapshot, the same value `voiceai mcp tools <server> --json` prints. Nothing connects to the
MCP server to compute it.

That snapshot does go stale. When it has, `push` says so and names the fix:

```sh
voiceai mcp run <server>       # connect now; also refreshes the snapshot
```

If the platform rejects a write because it has no current record of a server, `push` refreshes
and retries once on its own.

Updating an agent **replaces** its MCP attachments as well as its tool references, so an MCP
server attached in the dashboard and not declared by the package is detached. `--dry-run` names
every attachment that would go.

## Guarded resolved push

`--require-resolved` is a stricter mode for a caller that has already resolved every reference
to an exact checked identity: a `tool_id`/`version`, or an MCP
`server_id`/`observed_schema_hash`. It honours those exactly, never re-resolving by name and
never refreshing.

```sh
voiceai agents push staged/ --require-resolved --expect-org org_abc --dry-run --json
voiceai agents push staged/ --require-resolved --expect-org org_abc --json
```

`--expect-org` is checked against the credential's real account before anything happens: no
write, discovery, sample run, or tool operation runs first. If the org doesn't match, or can't
be confirmed at all, the push aborts without changing anything.

The mode is deliberately unforgiving about what it will attach:

- Authored tool bodies are refused outright. It attaches checked published versions only, never
  a body it would create or update itself.
- Every reference is checked directly against the platform, never resolved to the first
  same-name record. That covers its id, its organisation scope, and its name when a name is
  also given. An unavailable version, or a changed MCP schema hash, is refused rather than
  silently replaced.
- An MCP snapshot is refused if the platform would itself refuse to attach against it: not
  healthy, probed at an older server revision, or past its refresh. That holds even when the
  snapshot still carries the checked hash.
- It never runs a sample, and never refreshes a stale MCP capability snapshot on its own.

The JSON output carries the explicit marker `resolution_contract: 1`, in both the dry-run and
the success document. A caller can use it to tell a supporting release apart from an older CLI,
which would otherwise reject the flag or, worse, ignore it and push unchecked.
