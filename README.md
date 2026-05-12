# slng-ai/sdks

Monorepo for the Slng Unified API CLI and SDKs.

## Layout

```
specs/         # vendored OpenAPI + AsyncAPI specs from gateway-specs
sdks/ts/       # TypeScript SDK (Stainless-generated HTTP + hand-written WS)
sdks/python/   # Python SDK (Stainless-generated HTTP + hand-written WS)
cli/           # Bun CLI (depends on sdks/ts via workspace)
scripts/       # spec sync + WS type generation
```

## Quick start

```bash
bun install
bun run regen          # sync specs + regenerate WS message types
cd cli && bun run dev  # run the CLI from source
```

## Stainless (HTTP SDKs)

See [`STAINLESS_SETUP.md`](./STAINLESS_SETUP.md) for one-time onboarding.

## CLI design

The CLI shells out to `ffmpeg` / `sox` / `arecord` for audio I/O — it never opens an audio device directly. Stream audio via pipes:

```bash
slng tts "hello" --model slng/deepgram/aura:2-en | ffplay -
arecord -f S16_LE -r 16000 | slng stt --stream --model deepgram/nova:3
```
