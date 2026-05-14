# voiceai

The official [Voiceai](https://slng.ai) CLI — text-to-speech, speech-to-text,
real-time streaming.

```
         _|    _|    _|_|_|  _|        _|      _|    _|_|_|
       _|    _|    _|        _|        _|_|    _|  _|
     _|    _|        _|_|    _|        _|  _|  _|  _|  _|_|
   _|    _|              _|  _|        _|    _|_|  _|    _|
 _|    _|          _|_|_|    _|_|_|_|  _|      _|    _|_|_|

   Voice AI for builders — text-to-speech, speech-to-text, real-time.

   ❯ 🗣  Text → Speech - Synthesize
     👂  Speech → Text - Transcribe
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

Drop your API key into `~/.config/voiceai/config.json`:

```sh
voiceai config set apiKey zpka_…
```

Or set `VOICEAI_API_KEY` in your environment. The first time you launch
the TUI without a key, it'll prompt for one and save it.

Get a key at <https://app.slng.ai/api-keys>.

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
pickers.

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

### Configuration

```sh
voiceai config get                         # print everything (apiKey masked)
voiceai config get defaultTtsModel         # single value
voiceai config set apiKey zpka_…
voiceai config set defaultTtsModel slng/deepgram/aura:2-en
voiceai config set defaultTtsVoice amalthea
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

`~/.config/voiceai/config.json`. Env vars override the file.

| Key | Env override | Description |
|---|---|---|
| `apiKey` | `VOICEAI_API_KEY` | Bearer token (zpka_…). |
| `baseUrl` | `VOICEAI_BASE_URL` | Override the API base URL (e.g. `https://stageapi.slng.ai`). |
| `region` | — | Pin every request to a region (auto if unset). |
| `worldPart` | — | Pin every request to a world-part (auto if unset). |
| `defaultTtsModel` | — | Skip the TTS model picker in the TUI. |
| `defaultTtsVoice` | — | Skip the TTS voice picker (requires `defaultTtsModel`). |
| `defaultSttModel` | — | Skip the STT model picker. |
| `defaultSttMode` | — | `mic` or `file` — skip the source picker. |
| `defaultSttInput` | — | Audio input device for mic mode (skip device picker). |

Additional environment variable:

| Env var | Description |
|---|---|
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
