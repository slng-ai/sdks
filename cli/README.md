# voiceai

The official Voiceai CLI — text-to-speech, speech-to-text, real-time streaming.

```
$ voiceai                       # interactive TUI
$ voiceai tts "hello" --out hi.mp3
$ voiceai stt audio.wav -m slng/deepgram/nova:3-en
$ voiceai stt --stream          # live mic transcription
```

## Install

### Homebrew (macOS, Linux)

```sh
brew install slng-ai/tap/voiceai
```

### curl one-liner

```sh
curl -fsSL https://slng.ai/install.sh | sh
```

Installs to `/usr/local/bin/voiceai`. Override with `PREFIX=$HOME/.local/bin`.

### npm

```sh
npm i -g voiceai
```

The npm package downloads the matching pre-built binary on install. Use the
Homebrew or curl path if you'd rather skip the postinstall network call.

### macOS Gatekeeper note

The pre-built macOS binary is currently unsigned. The first time you run it,
Gatekeeper may block the binary. To clear:

```sh
xattr -d com.apple.quarantine $(which voiceai)
```

Or right-click `voiceai` in Finder and choose **Open** once.

## Configure

Drop your API key into `~/.config/voiceai/config.json`:

```sh
voiceai config set apiKey zpka_…
```

Or set `VOICEAI_API_KEY` in your environment.

Get a key at <https://app.slng.ai/api-keys>.

## More

- Full SDKs (Node + Python) → `voiceai-sdk` on [npm](https://www.npmjs.com/package/voiceai-sdk)
  and [PyPI](https://pypi.org/project/voiceai-sdk/)
- API reference → <https://docs.slng.ai>
- Source → <https://github.com/slng-ai/sdks/tree/main/cli>
