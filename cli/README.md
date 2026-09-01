# voiceai

[![npm](https://img.shields.io/npm/v/voiceai-cli?label=voiceai-cli&color=F2DD52)](https://www.npmjs.com/package/voiceai-cli)

The official [Voiceai](https://slng.ai) CLI — text-to-speech, speech-to-text,
real-time streaming, and voice agents.

```
 ███████╗ ██╗      ███╗   ██╗  ██████╗      ██╗     ██╗
 ██╔════╝ ██║      ████╗  ██║ ██╔════╝     ██╔╝    ██╔╝
 ███████╗ ██║      ██╔██╗ ██║ ██║  ███╗   ██╔╝    ██╔╝
 ╚════██║ ██║      ██║╚██╗██║ ██║   ██║  ██╔╝    ██╔╝
 ███████║ ███████╗ ██║ ╚████║ ╚██████╔╝ ██╔╝    ██╔╝
 ╚══════╝ ╚══════╝ ╚═╝  ╚═══╝  ╚═════╝  ╚═╝     ╚═╝

   Voice AI for builders — text-to-speech, speech-to-text, real-time.
   v0.1.14

   ❯ 🗣  Text → Speech - Synthesize
     👂  Speech → Text - Transcribe
     🤖  Agents - Browse & dispatch
     ⚙️   Settings
     ❌   Quit

   ctrl+c quit
```

Run `voiceai` to open the interactive TUI above, or pass flags to script it.

## Install

### Homebrew (macOS, Linux)

```sh
brew install slng-ai/tap/voiceai
```

### curl one-liner

```sh
curl -fsSL https://docs.slng.ai/install.sh | sh
```

Installs to `/usr/local/bin/voiceai`. To install elsewhere:
`curl -fsSL https://docs.slng.ai/install.sh | PREFIX=$HOME/.local/bin sh`.

### npm

```sh
npm i -g voiceai-cli
```

Package name is `voiceai-cli`; the installed binary is `voiceai`. The
postinstall step downloads a pre-built binary for your platform. Use
Homebrew or the curl one-liner if you want to skip that network call.

### macOS Gatekeeper note

The pre-built macOS binary is currently unsigned. The first time you run it,
Gatekeeper may block it. To clear the quarantine:

```sh
xattr -d com.apple.quarantine $(which voiceai)
```

Or right-click `voiceai` in Finder and choose **Open** once.

## Configure

The fastest way:

```sh
voiceai login                          # interactive: prompts for profile name + key, verifies it
```

Or set values directly:

```sh
voiceai config set apiKey slng_cu_…
```

You can also set `VOICEAI_API_KEY` in your environment. The first time you
launch the TUI without a key, it'll prompt for one and save it.

Get a key at <https://app.slng.ai/api-keys>.

### Profiles

Credentials and settings live in named profiles, AWS-style. Run `voiceai
login` (or `voiceai config add <name>`) to create one; switch with
`voiceai config use <name>`; override per command with `--profile <name>`
or `VOICEAI_PROFILE=<name>`.

```sh
voiceai login --profile work           # create / update the "work" profile
voiceai config profiles                # list all profiles (★ marks the current)
voiceai config use work                # persistent default
voiceai --profile default whoami       # one-off override
voiceai config remove staging          # delete a profile
```

The TUI's **Settings → Profile** menu does the same things interactively
(add, switch, remove with confirmation).

## Quick start

```sh
voiceai tts "Hello from Voiceai"               # synth + play locally
voiceai tts "Save this" --out hi.mp3           # save to a file
voiceai stt audio.wav                          # transcribe a file
voiceai stt --stream                           # live mic → transcripts
```

## Interactive mode

`voiceai` with no args opens the TUI. It remembers your last-used model
and voice in `~/.config/voiceai/config.json`, so subsequent runs skip the
pickers. The **Settings → Profile** menu lets you switch, add, or remove
profiles without leaving the TUI.

**TTS flow**

```
Language: English ▼
Model:    ★ slng/deepgram/aura:2-en
Voice:    Amalthea · feminine · Engaging
Text:     Hello from Voiceai
          (enter to synthesize)
```

Slng-hosted models float to the top of the picker with a yellow ★. Per-model
voice catalogs include name, gender, tone, and language so you're not
picking from a wall of UUIDs.

**STT flow**

```
Model:  ★ slng/deepgram/nova:3-en
Source: 🎙  Microphone (realtime) | 📂 Audio file (one-shot)
Input:  MacBook Pro Microphone

● slng/deepgram/nova:3-en  (space to pause)
  Hello world how are you
```

Mic mode opens a WebSocket and streams 16-bit PCM frames; partial
transcripts appear in dim italic, finals get appended. File mode does a
one-shot HTTP upload.

**Agents**

Browse your voice agents and run quick actions without leaving the terminal.

```
  AGENT                         LANGUAGE  TELEPHONY  UPDATED
❯ Lovable Travel Agent (demo)   English   Web only   21h
  Attio CRM Lead Intake         English   Phone      15d

  Lovable Travel Agent (demo)
  language: en · region: eu-central · created: 2026-05-28 14:06
  ❯ 📞  Dispatch a call
    📋  View calls
    🌐  Test in browser (dashboard)
    📑  Duplicate
    🗑   Delete
```

The list is a table (`AGENT · LANGUAGE · TELEPHONY · UPDATED`); enter opens an
agent. **Dispatch a call** only appears when the agent has outbound telephony.
**View calls** shows a color-coded table (green = completed, red = failed) with
local-time dates. **Test in browser** opens the dashboard tester. Creating or
editing agents is flag-mode only, via `--file` (see [Agents](#agents) below).

## Flag mode

### Text → speech

```sh
# Friendly voice name resolves to the upstream voiceId.
voiceai tts "hi" -m slng/deepgram/aura:2-en -v amalthea

# Save to a path of your choice (audio still plays unless stdout is a pipe).
voiceai tts "save me" --out ~/voice.mp3

# Pipe raw audio bytes — useful in scripts.
voiceai tts "binary" > out.mp3

# Stream chunks via WebSocket for low-latency playback.
voiceai tts "stream me" --stream | ffplay -

# Pin a deployment region.
voiceai tts "regional" --region eu-north-1
```

Without `--out`, audio is also written to `$TMPDIR/voiceai-tts/` so you
can replay or re-export later.

### Speech → text

```sh
# One-shot transcription of an audio file.
voiceai stt audio.wav -m slng/deepgram/nova:3-en

# Live mic → transcripts.
voiceai stt --stream

# Pipe raw 16-bit PCM (16 kHz mono) from any source.
arecord -f S16_LE -r 16000 -c 1 | voiceai stt --stream --source stdin
```

### Catalogs

```sh
# All deployed models, both TTS and STT.
voiceai models

# Filter by service type and machine-readable output for scripts.
voiceai models --tts
voiceai models --json | jq '.tts[] | .id'

# Voices for a specific TTS model. --voice in `tts` accepts the friendly
# name from this list (case-insensitive).
voiceai voices --model slng/deepgram/aura:2-en
voiceai voices --model cartesia/sonic:3 --language fr
voiceai voices --model slng/deepgram/aura:2-en --json | jq '.[] | .name'
```

### Auth check

```sh
# Verify VOICEAI_API_KEY against GET /v1/me (no TTS/STT credits used).
# Prints the account it resolves to: name, org, and plan tier.
voiceai whoami
voiceai whoami --json | jq .ok
```

### Agents

Manage voice agents, their calls, and browser web sessions. These hit the Voice
Agents API (`https://api.agents.slng.ai` by default; override with
`VOICEAI_AGENTS_BASE_URL` or `voiceai config set agentsBaseUrl <url>`).

```sh
voiceai agents list                            # list agents
voiceai agents list --json | jq '.[].id'       # scriptable
voiceai agents get <agent_id>

# Create / update / replace take a JSON body matching the Voice Agents API.
voiceai agents create --file agent.json
cat agent.json | voiceai agents update <agent_id> --file -   # PATCH from stdin
voiceai agents replace <agent_id> --file agent.json          # PUT
voiceai agents duplicate <agent_id>
voiceai agents delete <agent_id>

# Calls
voiceai agents calls dispatch <agent_id> --phone +15551234567
voiceai agents calls dispatch <agent_id> --phone +15551234567 --file args.json
voiceai agents calls list <agent_id> --page 1 --page-size 20
voiceai agents calls get <agent_id> <call_id>
voiceai agents calls tool-exec <agent_id> <call_id> --file result.json

# Web sessions (returns LiveKit connection details)
voiceai agents web-sessions create <agent_id>
```

IDs are positional or named flags, whichever you prefer:

```sh
voiceai agents calls get a1b2 c3d4
voiceai agents calls get --agent-id a1b2 --call-id c3d4   # equivalent
```

Every subcommand supports `--json`. On failure the exit code is non-zero and,
with `--json`, the API's error body is printed to stdout.

#### Pushing a compiled package

`unmute compile --target slng` writes a deployment body into `build/slng/` and
stops — it opens no connection to SLNG, and it writes **names** everywhere the
platform wants identifiers, because no compiler can invent an id a server
assigns. `agents push` closes that gap: it resolves every name, mints the
attachment ids the platform requires, and creates or replaces the agent.

```sh
voiceai agents push examples/slng-support --dry-run   # check, change nothing
voiceai agents push examples/slng-support             # push it
voiceai agents push . --json | jq -r '.agent.id'      # scriptable
```

The directory may be the package root or the compiled `build/slng` directory.

Nothing is created until every check passes. Missing vault entries and
unresolved tool names are reported **together**, each with the dashboard page
that fixes it — a push that cannot succeed leaves your organisation exactly as
it was. Note that a vault entry of kind `variable` does not satisfy a tool's
secret requirement; the platform counts secrets only.

Updating **replaces** the agent with what the package declares: a reference the
package no longer names is detached, and configuration added in the dashboard
since the last push is overwritten. `--dry-run` lists what would be detached
before you commit to it.

```sh
voiceai agents push . --run-samples          # also execute each tool's sample
```

A package that ships its own tool bodies needs each one created and published
before the agent can reference it, and the platform will not publish a `code` or
`api_request` tool until one successful run has proved it. Those runs execute
against your real dependencies — a webhook really fires — so `push` never
performs one without `--run-samples`. Write the input as
`build/slng/samples/<tool>.json`; a tool that needs a run and has no sample is
reported before anything is created, not discovered halfway through.

Packages carrying `mcp_refs` are resolved like any other reference: the server
name becomes its id, and each tool's `observed_schema_hash` is copied from the
platform's own capability snapshot — the same value `voiceai mcp tools <server>
--json` prints. Nothing connects to the MCP server to compute it.

That snapshot does go stale. When it has, `push` says so and names the fix:

```sh
voiceai mcp run <server>       # connect now; also refreshes the snapshot
```

If the platform rejects a write because it has no current record of a server,
`push` refreshes and retries once on its own.

Updating an agent **replaces** its MCP attachments as well as its tool
references, so an MCP server attached in the dashboard and not declared by the
package is detached. `--dry-run` names every attachment that would go.

### Tools

Read-only view of the tools your agents can call.

```sh
voiceai tool list                          # every tool your agents can call
voiceai tool list --json | jq '.[].name'   # scriptable
voiceai tool get api_request               # one tool, every property
voiceai tool get check_order --json | jq .arg_schema   # the tool's input schema
```

`list` prints `NAME`, `TYPE`, and `VERSION`, tab-separated, so `cut -f3` works. A
tool that has never been published shows `-` rather than a version.

Tool names are matched **exactly and case-sensitively** — `API_REQUEST` will not
find `api_request`.

`--json` carries `arg_schema`, the JSON Schema of the tool's input — derived from
the pydantic model for a `code` tool. `get --json` is always a single object,
never an array.

`run` executes a tool for real, so you can prove one works before an agent
depends on it:

```sh
echo '{"id":7}' | voiceai tool run check_order --confirm-side-effects
voiceai tool run check_order --input sample.json --confirm-side-effects
```

The input comes from `--input <file>`, from stdin, or is `{}` when neither is
given, and is never printed back — it may hold a secret. **Nothing runs without
`--confirm-side-effects`**: a run reaches the tool's real dependencies, and a
webhook really fires. Exit is `0` only when the run succeeded.

### MCP servers

The MCP servers your agents can call.

```sh
voiceai mcp list                            # every server your agents can call
voiceai mcp list --json | jq '.[].name'     # scriptable
voiceai mcp get firecrawl-mcp               # one server, every property
voiceai mcp tools firecrawl-mcp             # the tools that server exposes
voiceai mcp tools firecrawl-mcp --json | jq '.[].input_schema'
voiceai mcp run firecrawl-mcp               # connect right now, and report
```

`list` prints `NAME`, `TRANSPORT`, `STATUS`, and `TOOLS`, tab-separated. Server
names are matched **exactly and case-sensitively**.

`STATUS` and `TOOLS` come from the last capability probe, not from a live call —
a server can be listed and still be unreachable. `capability_observed_at` on
`get` says when the probe ran.

`tools` lists what one server exposes — `NAME` and the first line of each
description, tab-separated. `tools --json` gives the whole array, with every
tool's `input_schema`, `output_schema`, and `schema_hash`.

`run` is the one command here that actually calls the server. It reports how
long the server took, what it identifies itself as, and which tools appeared or
went away since the last probe. A successful run also refreshes the platform's
snapshot — which is what makes an agent referencing that server publishable
again once the snapshot has gone stale.

Every subcommand reads the stored probe; none calls the server. If the probe was
truncated, `tools` says so on stderr rather than presenting a short list as
complete.

Auth is reported as the vault secret's **name**, never its value.

### Secrets

Read-only view of your organisation's vault. Use it to check that a secret a tool
declares is actually present before you rely on it.

```sh
voiceai secret list                        # every secret and variable
voiceai secret list --json | jq '.[].name' # scriptable
voiceai secret get STRIPE_KEY              # one entry, every property
voiceai secret get STRIPE_KEY >/dev/null   # exit 0 if present, 1 if not
```

`list` prints `NAME`, `KIND`, `VALUE`, and `DESCRIPTION`, tab-separated, so
`cut -f1` works. The `VALUE` column is `yes`/`no` — whether a value is stored,
never the value itself.

**Values are never displayed.** The vault holds two kinds: a `secret` is
write-once and cannot be read back at all, while a `variable` is non-sensitive
config the API *would* return in plaintext. The CLI redacts both, in every output
mode including `--json`, so no vault value can end up in your terminal scrollback
or your CI logs. Use `has_value` to tell whether an entry is populated.

Secret names are matched **exactly and case-sensitively** — `stripe_key` will not
find `STRIPE_KEY`. `get` exits non-zero when the name does not exist, so a shell
script can gate on it without parsing output.
`create` makes a new entry, or every entry in a dotenv-style file:

```sh
voiceai secret create STRIPE_KEY                  # prompts for the value, no echo
voiceai secret create --secrets-file .env.local   # one entry per KEY=VALUE
voiceai secret create --secrets-file .env --overwrite     # replace what exists
voiceai secret create --kind variable REGION      # a variable, not a secret
```

It reads the vault first and **never overwrites silently**. Any name already
present is listed by name and confirmed before anything is written; `--overwrite`
answers in advance. Without it the run is refused whole — not even the safe
creates go through — so `--json` reports `would_create` and `would_overwrite` for
a script to act on.

The file is parsed with the platform's own dotenv parser, so comments, `export `
prefixes, quoting and multi-line values all behave as they do in a shell. A
`KEY=` with no value is kept, not skipped.

**There is no `--value` flag.** A value passed as an argument is recorded in
shell history and visible in `ps` to every user on the machine, so the value is
prompted for without echo, or read from stdin when piped:

```sh
printf %s "$TOKEN" | voiceai secret create STRIPE_KEY
```

### SIP trunks

Read-only view of your organisation's SIP trunks, inbound and outbound.

```sh
voiceai trunks list                              # every trunk, both directions
voiceai trunks list --direction outbound         # only outbound trunks
voiceai trunks list --json | jq -r '.[].name'    # scriptable
voiceai trunks list --json | jq '[.[] | select(.usable | not)]'   # what is broken
voiceai trunks get nicotestslng                  # one trunk, per agent
voiceai trunks get t --direction inbound         # when the name is on both sides
```

`list` prints `DIRECTION`, `NAME`, `NUMBERS`, `STATUS`, `USABLE`, and `IN USE BY`,
tab-separated, so `cut -f3` works. Every empty cell is `-`, never blank.

Inbound and outbound trunks are separate objects, so the same name can exist on
both sides and `DIRECTION` is part of a trunk's identity.

The listing is organisation-wide. The platform exposes trunks only through an
agent, so the command reads every agent in your organisation and merges the
results — that is what makes an inbound trunk already attached to one agent
visible. An organisation with no agents cannot be enumerated at all, and says so
rather than reporting an empty list.

`get` adds no fields — the reachable view carries no SIP address, transport,
provider, or setup mode, and there is no per-trunk route, so it costs the same
reads as `list`. What it adds is the breakdown `list` folds away: `selectable`,
`is_current`, and `unavailable_reason` are **per agent**, and `list` reduces them
to one `usable` flag and the first `in_use_by` name it sees. A trunk listed as
usable can still be unusable for the agent you care about — `get` says which.
A name on both sides is refused rather than guessed; pass `--direction`.

One limit worth knowing. The platform withholds any trunk that is both unusable
and attached to no agent, so such a trunk cannot appear in either command; both
say so on stderr on every run.

### Configuration

```sh
voiceai config get                         # print the current profile (apiKey masked)
voiceai config get defaultTtsModel         # single value
voiceai config set apiKey slng_cu_…           # write to the current profile
voiceai config set --profile work apiKey slng_cu_…   # write to a specific profile
voiceai config set defaultTtsModel slng/deepgram/aura:2-en
voiceai config set defaultTtsVoice amalthea
voiceai config profiles                    # list profiles (★ marks the current), alias: list
voiceai config use work                    # set persistent default
voiceai config add staging                 # add a profile interactively
voiceai config remove staging              # delete a profile, alias: rm
voiceai config reset --force               # wipe ~/.config/voiceai + legacy slng dir
```

Setting `defaultTtsModel` (and optionally `defaultTtsVoice`) skips the
picker steps in the TUI. Same for `defaultSttModel` / `defaultSttMode` /
`defaultSttInput`.

`config reset` is what `brew uninstall` won't do for you — Homebrew leaves
files in `~/.config/` untouched. Run it before uninstalling, or any time
you want the TUI to show the first-run API-key prompt again. Pass `--all`
to also clear the `$TMPDIR/voiceai-tts/` replay cache.

## Configuration reference

`~/.config/voiceai/config.json` stores one or more named profiles:

```json
{
  "currentProfile": "default",
  "profiles": {
    "default": { "apiKey": "slng_cu_…", "defaultTtsModel": "slng/deepgram/aura:2-en" },
    "work":    { "apiKey": "slng_cu_…", "baseUrl": "https://stageapi.slng.ai" }
  }
}
```

The file is written with mode `0600`. Older flat-shaped configs auto-migrate
into a `default` profile on first run.

Profile resolution precedence (highest wins): `--profile <name>` flag →
`VOICEAI_PROFILE` env → `currentProfile` in the file → literal `"default"`.

Per-profile keys (env overrides apply to the resolved profile):

| Key | Env override | Description |
|---|---|---|
| `apiKey` | `VOICEAI_API_KEY` | Bearer token (slng_cu_…). |
| `baseUrl` | `VOICEAI_BASE_URL` | Override the API base URL (e.g. `https://stageapi.slng.ai`). |
| `agentsBaseUrl` | `VOICEAI_AGENTS_BASE_URL` | Override the Voice Agents API base URL (used by `voiceai agents …`). |
| `region` | — | Pin every request to a region (auto if unset). |
| `worldPart` | — | Pin every request to a world-part (auto if unset). |
| `defaultTtsModel` | — | Skip the TTS model picker in the TUI. |
| `defaultTtsVoice` | — | Skip the TTS voice picker (requires `defaultTtsModel`). |
| `defaultSttModel` | — | Skip the STT model picker. |
| `defaultSttMode` | — | `mic` or `file` — skip the source picker. |
| `defaultSttInput` | — | Audio input device for mic mode (skip device picker). |

Additional environment variables:

| Env var | Description |
|---|---|
| `VOICEAI_PROFILE` | Select a named profile (overridden by `--profile`). |
| `VOICEAI_LOG` | `debug` for verbose SDK logging (also enabled by `--debug`). |

## External audio dependencies

The CLI shells out to your system's audio tools rather than opening devices
directly. Install whichever's appropriate:

- **macOS**: `afplay` (built-in). For STT mic: `brew install sox`.
- **Linux**: `ffplay` (`apt install ffmpeg`) or `paplay`. For STT mic:
  `apt install sox` or `apt install alsa-utils`.

## More

- Full SDKs (Node + Python) → `voiceai-sdk` on
  [npm](https://www.npmjs.com/package/voiceai-sdk) and
  [PyPI](https://pypi.org/project/voiceai-sdk/)
- API reference → <https://docs.slng.ai>
- Source → <https://github.com/slng-ai/sdks/tree/main/cli>
