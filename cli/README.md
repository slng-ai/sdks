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
   v0.1.12

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

### Tools

Read-only view of the tools your agents can call.

```sh
voiceai tool list                          # curated + your organisation's tools
voiceai tool list --source org             # only tools your organisation authored
voiceai tool list --json | jq '.[].name'   # scriptable
voiceai tool get api_request               # one tool, every property
voiceai tool get end_call --source curated # disambiguate a name collision
```

`list` prints `NAME`, `TYPE`, `SOURCE`, and `VERSION`, tab-separated, so `cut -f4`
works. A tool that has never been published shows `-` rather than a version.

Tool names are matched **exactly and case-sensitively** — `API_REQUEST` will not
find `api_request`.

A name can belong to both a curated tool and one your organisation authored. In
that case `get` shows your organisation's tool and notes the shadowed curated one
on stderr; `--source curated|org` picks a side explicitly. `get --json` is always
a single object, never an array.

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

### Configuration

```sh
voiceai config get                         # print the current profile (apiKey masked)
voiceai config get defaultTtsModel         # single value
voiceai config set apiKey slng_cu_…           # write to the current profile
voiceai config set --profile work apiKey slng_cu_…   # write to a specific profile
voiceai config set defaultTtsModel slng/deepgram/aura:2-en
voiceai config set defaultTtsVoice amalthea
voiceai config profiles                    # list profiles (★ marks the current)
voiceai config use work                    # set persistent default
voiceai config add staging                 # add a profile interactively
voiceai config remove staging              # delete a profile
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
