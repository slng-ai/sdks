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

## CLI commands

Full reference in [`cli/README.md`](./cli/README.md). The command trees:

| Tree | Subcommands |
|---|---|
| `tts` / `stt` | synth and transcribe, one-shot or `--stream` |
| `models` / `voices` / `whoami` / `login` | catalogs and auth |
| `agents` | `list get create update replace delete duplicate`, `calls {dispatch list get}`, `web-sessions create`, `push` |
| `tool` | `list get create update build run publish` (`create` takes a Python file) |
| `mcp` | `list get tools` (read-only; attach servers in the dashboard) |
| `secret` | `list get create` (`--secrets-file`, `--kind`, `--overwrite`; values never readable back) |
| `trunks` | `list get` (`--direction`; read-only) |
| `config` | `get set profiles use add remove reset` |

Every subcommand takes `--json` and `--profile <name>`. Names are matched exactly and
case-sensitively. The shared-resource trees (`tool`, `mcp`, `secret`, `trunks`) hit routes that
are mounted `include_in_schema=False`, so they are absent from `specs/` and from the generated
SDKs — they go through the raw-fetch helper in `cli/src/lib/agents.ts`.

## CLI design

The CLI shells out to `ffmpeg` / `sox` / `arecord` for audio I/O — it never opens an audio device directly. Stream audio via pipes:

```bash
voiceai tts "hello" --model slng/deepgram/aura:2-en | ffplay -
arecord -f S16_LE -r 16000 | voiceai stt --stream --model deepgram/nova:3
```

## Releasing the CLI

Push a tag from `main`. Nothing else is done by hand:

```bash
git switch main && git pull
git tag -a cli-v0.1.23 -m "cli 0.1.23"
git push origin cli-v0.1.23
```

The tag is the version. The workflow writes it into `cli/package.json` before it
builds, so don't bump that file. The committed version stays `0.0.0-dev`. If the
AsyncAPI specs changed, run `bun run regen` and merge the diff before tagging.

A failed run can be re-run from the Actions page, or started by hand with the
tag as input (`workflow_dispatch`).

The compile depends on one committed generated file, `streaming/ts/messages.ts`,
refreshed by `bun run regen`. Models and voices are not bundled: the CLI reads
them live from the public catalog (`GET /v1/catalog/models`). The CLI imports
the HTTP SDK as `voiceai-sdk` from npm (published from this repo via Stainless),
so the Stainless working copies in `sdks/` aren't needed at release time.

The workflow then:
1. Builds `voiceai-{darwin-arm64,darwin-x64,linux-arm64,linux-x64}` via `bun build --compile`.
2. Attaches them to a GitHub Release at the tag.
3. Publishes `voiceai-cli` to npm with provenance, through npm trusted publishing (no token).
4. Commits `Formula/voiceai.rb` with the new version and SHAs straight to `main` of `slng-ai/homebrew-tap` (uses `HOMEBREW_TAP_GITHUB_TOKEN`).

Required, one-time, before the first tag:
- Create `slng-ai/homebrew-tap` on GitHub. **Must be a public repo** — Homebrew clones the tap over HTTPS without auth on every `brew install`. The repo can start empty; the workflow's tap step writes `Formula/voiceai.rb` on first release.
- Reserve `voiceai` on npmjs.com.

Required secret on `slng-ai/sdks` (a repo or org secret):
- `HOMEBREW_TAP_GITHUB_TOKEN`: a fine-grained token, owner `slng-ai`, only the repository
  `slng-ai/homebrew-tap`, with `Contents: read and write`. Unmute's release writes to the
  same tap, so one org secret can serve both repos.

The curl installer at `scripts/install.sh` resolves the latest `cli-v*` tag on the fly, so users always get the most recent release without us hardcoding versions.
