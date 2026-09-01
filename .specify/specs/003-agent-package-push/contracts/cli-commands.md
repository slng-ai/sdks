# Contract: `voiceai agents push` CLI Surface

**Feature**: [spec.md](../spec.md) · **Data model**: [data-model.md](../data-model.md) · **Date**: 2026-08-27

This is the feature's public interface. Every item below is a promise to users and scripts; changing
one is a breaking change. Each maps to a functional requirement and is asserted in
[quickstart.md](../quickstart.md).

---

## Command

```text
voiceai agents push <dir>        the only command this feature adds
```

It joins the existing `agents` group (`list`, `get`, `create`, `update`, `replace`, `duplicate`,
`delete`, `calls`, `web-sessions`). No existing command changes behaviour.

`<dir>` is required and positional. It is the package root **or** the compiled directory; both work
(FR-001).

---

## Options

| Option | Values | Default | Requirement |
|---|---|---|---|
| `--dry-run` | flag | off | FR-010, FR-030 |
| `--run-samples` | flag | off | D6 — consents to executing tool samples |
| `--agent-id <id>` | UUID | resolved by name | FR-031 — target an agent whose name differs from the package's |
| `--label <text>` | string ≤120 | derived | FR-033 — override the version label |
| `--json` | flag | off | FR-037 |
| `--profile <name>` | existing global option | active profile | credential selection |

`--run-samples` is the *only* way `push` will execute a tool. Without it, no `/run` call is made
under any circumstance. The platform requires `confirm_side_effects: true` on every run and this flag
is what supplies it; a push that forged it would execute the operator's real webhooks on every
deploy ([D6](../research.md#d6--can-push-run-a-tool-sample-unattended)).

`--label` defaults to a value the command derives (see **Version label** below), so an operator never
has to invent one.

---

## Exit codes

| Code | Meaning |
|---|---|
| 0 | push completed, or `--dry-run` found no blockers |
| 1 | any failure — blockers, a rejected body, a failed sample, a 409 publish, an unreadable package |

There is no distinct code for "changed nothing". A blocker exit and a mid-apply failure both return
1; the **output** is what distinguishes them, and it always says which happened (FR-021).

---

## Interaction model

`push` never prompts. It has no TTY branch and behaves identically at a terminal and in a pipeline
(FR-036). Spinners are stderr-only and suppressed when stderr is not a TTY, matching `tool`,
`secret` and `trunks`.

Everything an operator could be asked is instead an option: `--run-samples` for consent,
`--agent-id` for ambiguity, `--label` for the version name.

---

## Output streams

| Stream | Carries |
|---|---|
| stdout | the result — the human report, or the `--json` document |
| stderr | the pre-write header (FR-011, FR-032), spinners, the shadowed-tool note (FR-027), warnings, blocker and partial-failure reports |

Before the first mutating request, and regardless of whether stderr is a TTY, the command writes:

```text
organisation  Acme (0b1f…)
agent         slng — creating
```

This is on **stderr**, not stdout, so `--json` output stays a single parseable document. It is not
carried by the spinner: `spin()` returns null when stderr is not a TTY, which would leave a pipeline
run announcing nothing at all. Naming the organisation before the write is the point — the CLI
resolves credentials from an env var *or* a stored profile, and the two can be different
organisations.

`--json` output stays parseable on failure (FR-037): a blocker exit prints a JSON document with
`ok: false`, matching the `fail()` helper the other commands use.

---

## Output — human

### Dry run, clean

```text
organisation  Acme (0b1f…)
package       examples/slng-support/build/slng/agent.json
agent         slng — create

TOOLS
  (none shipped)

REFERENCES
  end_call        tool fd25f5c5… v3   attachment 9c2a…  new

would create agent "slng". no changes made.
```

### Dry run, updating — the removal warning (FR-030)

Replace semantics are lossy, and this block is the operator's only warning before it happens.

```text
agent         slng — update (d8b2eb22…)

REFERENCES
  end_call        tool fd25f5c5… v3   attachment 8a29…  reused

WILL BE DETACHED
  check_order     attachment 41bd…  — not declared by this package

WILL BE OVERWRITTEN
  system_prompt         differs from what this agent currently has

would replace agent d8b2eb22…. no changes made.
```

### Blockers (FR-005, FR-007, FR-014)

All blockers print together; the command never stops at the first.

```text
cannot push. 3 problems:

missing vault entries (2)
  CRM_TOKEN
  STRIPE_KEY
  create them at https://app.slng.ai/vault/secrets

unresolved tool reference (1)
  lookup_order — no tool of that name is visible to this organisation
  rename the reference, or create the tool at https://app.slng.ai/tools

nothing was created or changed.
```

A vault entry that exists as `kind: variable` is reported as missing, with the reason — the
platform's `secrets_exist` gate counts secrets only
([D4](../research.md#d4--what-gates-publish-and-which-tool-types-need-a-green-run)).

### Sample blockers (D7)

```text
cannot push. 1 problem:

tool needs a verified run before it can publish (1)
  check_order (code) — no sample found
  write build/slng/samples/check_order.json, then push with --run-samples
  a code tool cannot publish until one successful run proves it

nothing was created or changed.
```

When the sample exists but the flag does not, the same block reads
`sample found; re-run with --run-samples to execute it`.

### Success

```text
tool          check_order — created, introspected, ran (succeeded), published v1
agent         slng — created d8b2eb22-db5e-4bea-bb04-f9b9932b08fa
version       4  labelled "slng-support @ 2026-08-27T10:14:02Z"

pushed.
```

The organisation is **not** repeated here: the pre-write header named it moments ago, three
lines up, and a report that says the same thing twice teaches operators to skim it. The
`--json` document does carry `organisation`, because stdout is the durable record there
whereas the header is stderr.

### Partial failure (FR-021)

`DONE` accounts for everything that reached the organisation, **including a tool that was
created and then failed** — it exists now and the operator has to know. The closing line
distinguishes permanent damage from deletable debris.

```text
push failed at tool check_order.

DONE
  refund          created, published v1
  check_order     created, introspected, ran (failed)

NOT DONE
  check_order     sample run failed: Traceback (most recent call last):
      File "tool.py", line 13, in handler
    RuntimeError: boom
  the agent was not created or updated

the tools above were created but not published; you can delete them.
```

Rules this block follows:

| Rule | Why |
|---|---|
| a created-then-failed tool appears under DONE | it is in the organisation; listing it only under NOT DONE printed `DONE (nothing)` directly above "the tools above still exist" |
| the closing line names the actual remedy | `published tool versions cannot be unpublished` only when something was published; otherwise `created but not published; you can delete them` |
| the platform error is printed once | it is already in the NOT DONE item; repeating a four-line traceback verbatim is noise |
| continuation lines are indented | a code tool's sample failure is a Python traceback, and un-indented it destroys the list |

---

## Output — `--json`

Success is the `PushPlan` plus its outcome; failure is `{ok: false, …}`. Both are single JSON
documents on stdout.

The document is built by `planJson()`, **not** by spreading the internal plan. `PushPlan` is
a TypeScript shape whose fields are camelCase; this document is snake_case. Spreading the
plan once leaked `toolId` / `attachmentId` / `packagePath` / `existingId` into the published
surface, so `jq '.refs[].tool_id'` returned `null` against a live organisation. Tests pin
every key below by name.

```jsonc
// --dry-run
{ "ok": true, "dry_run": true,
  "organisation": {"id": "0b1f…", "name": "Acme"},
  "package": "examples/slng-support/build/slng/agent.json",
  "agent": {"name": "slng", "action": "create"},
  "tools": [], 
  "refs": [{"name": "end_call", "tool_id": "fd25f5c5…", "version": 3,
            "attachment_id": "9c2a…", "reused": false, "shadowed": "curated",
            "description": "…", "invocation": "model", "argument_overrides": {}}],
  "removals": [], "overwrites": [],
  "blockers": [] }

// blockers — organisation is carried here too, so a refused run still says where it looked
{ "ok": false, "changed": false,
  "organisation": {"id": "0b1f…", "name": "Acme"},
  "blockers": [{"kind": "vault_missing", "items": ["CRM_TOKEN", "STRIPE_KEY"],
                "detail": "create them, then push again. …",
                "url": "https://app.slng.ai/vault/secrets"}] }

// success
{ "ok": true, "organisation": {"id": "0b1f…", "name": "Acme"},
  "agent": {"id": "d8b2eb22…", "action": "create"},
  "version": {"number": 4, "label": "slng-support @ 2026-08-27T10:14:02Z"},
  "tools": [] }
```

`"changed": false` on a blocker exit is a machine-readable form of FR-009's guarantee.

---

## Version label

Derived, not invented by the operator (FR-033). Default: the package directory name and the push
timestamp, e.g. `slng-support @ 2026-08-27T10:14:02Z` — ≤120 chars, the platform's cap.

Overridable with `--label`.

**A push that changes nothing writes no version.** The platform only records a version when a field
actually changed, so `push` reads the newest version after the write and labels it only if it is
new; otherwise the report says `version  unchanged`
([D9](../research.md#d9--how-is-an-agent-version-labelled)). Labelling unconditionally would rename
the previous push's version.

---

## What this command does not do

| Not done | Why |
|---|---|
| attach a SIP trunk, or check trunks | telephony is out of scope by decision (spec, Out of Scope). `sip_inbound_trunk_id` / `sip_outbound_trunk_id` are omitted from the pushed body entirely. |
| create vault entries, tools, or numbers | reported and linked, never created (FR-006) |
| print a vault value | FR-040; only names are shown, and no value is ever fetched |
| push a package with `mcp_refs` | ~~refused in pre-flight~~ — **superseded** by [004](../../004-mcp-push-validation/contracts/cli-commands.md): references now resolve, no connection needed |
| send `declared_secrets` / `dependencies` on a non-`code` tool | the platform rejects them outright; `toolWriteBody()` strips them, because a compiled package may carry them as empty arrays the operator never wrote ([D17](../research.md#d17--declared_secrets-and-dependencies-are-code-only)) |
| change a tool's `tool_type` | immutable on update; refused in pre-flight with both types named ([D3](../research.md#d3--what-are-the-tool-lifecycle-contracts)) |
| roll back a partial push | published tool versions cannot be unpublished; the state is reported instead (FR-021) |
| talk to the agent | `agents web-sessions create` and `agents calls dispatch` already exist |

---

## Help text

`voiceai agents push --help` follows the house shape (`COMMANDS` / `EXAMPLES` / `NOTES`), matching
`tool`, `secret` and `trunks`.

```text
EXAMPLES
  $ voiceai agents push examples/slng-support              push a package
  $ voiceai agents push build/slng --dry-run               check without changing anything
  $ voiceai agents push . --run-samples                    also execute each tool's sample
  $ voiceai agents push . --json | jq -r '.agent.id'       scriptable

NOTES
  The directory may be the package root or the compiled build/slng directory.

  Nothing is created until every check passes. Missing vault entries and unresolved
  tool names are reported together, with the dashboard page that fixes each.

  Updating REPLACES the agent with what the package declares: a reference the package
  no longer names is detached. Use --dry-run to see what would be removed first.

  --run-samples executes each tool's sample against your real dependencies. A code or
  api_request tool cannot be published without one successful run.
```
