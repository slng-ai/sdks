# slng-ai/sdks

Monorepo for the Slng unified-API CLI and SDKs. See [README.md](README.md) for layout and
[.specify/memory/constitution.md](.specify/memory/constitution.md) for the rules that bind changes.

## Testing the CLI against the live API

Run the CLI from source — no build step:

```bash
bun run --cwd cli dev <args>          # e.g. bun run --cwd cli dev tool list
```

Credentials resolve as `VOICEAI_API_KEY` → active profile → `~/.config/voiceai/config.json`.
`.env` holds the same token under `SLNG_API_KEY`, so:

```bash
set -a && source .env && set +a && export VOICEAI_API_KEY="$SLNG_API_KEY"
```

Override per invocation with `VOICEAI_API_KEY=… bun run --cwd cli dev …`, or per profile with
`--profile <name>`. The env var wins over `--profile`.

Base URLs: `VOICEAI_BASE_URL` for the main API, `VOICEAI_AGENTS_BASE_URL` for the agents host
(`https://api.agents.slng.ai`, which also serves `/v1/agents/tools`). Point the latter at a local
stub server to test failure paths.

**`env -u VOICEAI_API_KEY` does not test the missing-credential path.** The CLI falls back to the
profile store and quietly succeeds with whatever key is configured there — often a different
organisation's. Isolate `HOME` and `XDG_CONFIG_HOME` to reach that path.

## Tests

```bash
bun test cli/                          # CLI only
bun test                               # streaming/ + cli/
```

Two patterns in `cli/src/commands/tool.test.ts`, worth copying:

- **Unit**: stub `globalThis.fetch`, call exported helpers directly. Set
  `process.env.VOICEAI_API_KEY` so `requireApiKey()` does not throw.
- **Action-level**: `Bun.serve({port: 0})` as a stub API, `Bun.spawn` the real CLI with
  `VOICEAI_AGENTS_BASE_URL` pointed at it. This is the only way to assert exit codes, the
  stdout/stderr split, and failure modes (403, 429) that cannot be induced against a healthy org.

### Known failures that are not yours

Check this before debugging — it predates any current work:

- `bun run sync-models:check` reports `live-models.generated.ts is stale`. It drifts against the
  live model registry over time. Refresh it in its own commit (`bun run sync-models`), never
  bundled into an unrelated feature.

## Rules worth knowing before you edit

- **`specs/` is vendored, read-only.** It is synced from gateway-specs by `bun run sync-specs`.
  Never hand-edit it to add an endpoint. Spec Kit feature docs live in `.specify/specs/` for this
  reason.
- **Generated files are outputs.** `*.generated.ts`, `streaming/*/messages.*`, and the Stainless
  SDKs under `sdks/` are re-emitted by `bun run regen`. Fix the spec or the generator instead.
  Three of them are committed because CI needs them at compile time.
- **Some endpoints are absent from the SDK by design.** The public shared-resource routes
  (`/v1/agents/tools`, `/mcp-servers`, `/secrets`, `/client-models`) are mounted
  `include_in_schema=False`, so they never reach the OpenAPI document or the generated SDK. Call
  them through the raw-fetch helper in [cli/src/lib/agents.ts](cli/src/lib/agents.ts), the way
  `agents` and `tool` do.
- **The CLI never opens an audio device.** Audio goes through `ffmpeg`/`sox`/`arecord` as
  subprocesses so every command composes in a pipe.
- **Changes to argument parsing land with a test** (constitution, Development Workflow).
