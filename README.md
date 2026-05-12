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
voiceai tts "hello" --model slng/deepgram/aura:2-en | ffplay -
arecord -f S16_LE -r 16000 | voiceai stt --stream --model deepgram/nova:3
```

## Releasing the CLI

Tag-driven, runs the `release-cli.yml` workflow:

```bash
# 1. bump cli/package.json version
# 2. commit + push to main
git tag cli-v0.1.0
git push origin cli-v0.1.0
```

The workflow then:
1. Builds `voiceai-{darwin-arm64,darwin-x64,linux-arm64,linux-x64}` via `bun build --compile`.
2. Attaches them to a GitHub Release at the tag.
3. Publishes `voiceai` to npm with provenance (uses `NPM_TOKEN`).
4. Updates `Formula/voiceai.rb` in `slng-ai/homebrew-tap` with the new version + SHAs (uses `HOMEBREW_TAP_GITHUB_TOKEN`).

Required, one-time, before the first tag:
- Create `slng-ai/homebrew-tap` on GitHub. **Must be a public repo** — Homebrew clones the tap over HTTPS without auth on every `brew install`. The repo can start empty; the workflow's tap step writes `Formula/voiceai.rb` on first release.
- Reserve `voiceai` on npmjs.com.

Required repo secrets on `slng-ai/sdks`:
- `NPM_TOKEN` — automation token from the `voiceai` npm account.
- `HOMEBREW_TAP_GITHUB_TOKEN` — fine-grained PAT with `Contents: write` on `slng-ai/homebrew-tap`.

The curl installer at `scripts/install.sh` resolves the latest `cli-v*` tag on the fly, so users always get the most recent release without us hardcoding versions.
