<!--
Sync Impact Report
Version change: (none) → 1.0.0
Rationale: Initial ratification. Template placeholders replaced with concrete,
repo-derived governance. MAJOR bump from unversioned scaffold to adopted document.

Modified principles:
  [PRINCIPLE_1_NAME] → I. Specs Are Upstream
  [PRINCIPLE_2_NAME] → II. Generated Code Is Never Hand-Edited
  [PRINCIPLE_3_NAME] → III. The CLI Is a Pipe
  [PRINCIPLE_4_NAME] → IV. Releases Are Tag-Driven and Version-Locked
  [PRINCIPLE_5_NAME] → V. Credentials Live in the Environment

Added sections:
  [SECTION_2_NAME]  → Toolchain and Platform Constraints
  [SECTION_3_NAME]  → Development Workflow

Removed sections: none

Follow-up TODOs: none
-->

# slng-ai/sdks Constitution

## Core Principles

### I. Specs Are Upstream

`specs/` is a vendored read-only copy of the gateway-specs OpenAPI and AsyncAPI
documents. Contributors MUST NOT edit files under `specs/` to change API surface;
the change goes upstream first, then lands here via `bun run sync-specs`. A PR that
modifies `specs/` without a corresponding upstream change is rejected.

Rationale: the specs are the contract shared by the gateway, both SDKs, and the CLI.
A local edit silently forks that contract and the next sync destroys it.

### II. Generated Code Is Never Hand-Edited

Stainless-generated SDK sources and every `*.generated.ts`, `streaming/ts/messages.ts`,
and `streaming/python/messages.py` file are outputs, not sources. Fixes MUST be made in
the spec or in the generator under `scripts/`, then re-emitted with `bun run regen`.
Generated files that CI needs at compile time (`cli/src/lib/live-models.generated.ts`,
`cli/src/lib/voice-catalog.generated.ts`, `streaming/ts/messages.ts`) MUST be committed
and MUST be regenerated in the same commit as the spec change that affects them.

Rationale: hand-edits to generated files survive exactly until the next `regen` and then
vanish without a failing test to announce it.

### III. The CLI Is a Pipe

The CLI MUST NOT open an audio device directly. Audio input and output go through
`ffmpeg` / `sox` / `arecord` invoked as subprocesses, with audio on stdin/stdout and
diagnostics on stderr, so every command composes in a shell pipeline. New commands MUST
be usable non-interactively; interactive TUI is an addition, never the only path.

Rationale: cross-platform audio device handling is the single largest source of
install-time breakage, and shipping it inside a compiled binary makes it unfixable by users.

### IV. Releases Are Tag-Driven and Version-Locked

CLI releases happen only by pushing a `cli-v*` tag. The version in `cli/package.json`
MUST match the tag suffix — the release workflow asserts this and fails otherwise.
Before tagging, `bun run regen` MUST have been run and any resulting diff committed.
Release artifacts (binaries, npm package, Homebrew formula) are produced by
`release-cli.yml` only; MUST NOT be published by hand from a developer machine.

Rationale: a hand-published build has no provenance and no reproducible input, and a
version/tag mismatch ships a binary that reports the wrong version to every user.

### V. Credentials Live in the Environment

API keys, npm tokens, and GitHub PATs MUST be read from environment variables or GitHub
Actions secrets. They MUST NOT appear in committed files, generated catalogs, fixtures,
logs, or error messages. `.env` files stay gitignored. Any credential that reaches a
commit is treated as leaked and MUST be rotated, not merely deleted.

Rationale: this repo publishes public binaries and packages; a leaked token is a supply-chain
compromise of everyone who ran `brew install voiceai`.

## Toolchain and Platform Constraints

- Bun `>=1.2.0` is the build and test runner for the monorepo; the published npm package
  requires Node `>=18` for its `bin/voiceai.js` shim only.
- `cli/` depends on `sdks/ts` via the workspace during development and on the published
  `voiceai-sdk` package at release time. The Stainless working copies under `sdks/` are
  separate git repos and MUST NOT be required for a release build to succeed.
- Supported release targets are `darwin-arm64`, `darwin-x64`, `linux-arm64`, `linux-x64`.
  Adding or dropping a target is a MINOR amendment to this constitution.
- External runtime dependencies are limited to `ffmpeg`, `sox`, and `arecord`. Adding a new
  required external binary MUST be justified in the PR and documented in the CLI README.

## Development Workflow

- After any change to `specs/`, voice manifests, or a generator in `scripts/`, run
  `bun run regen` and commit the resulting diff in the same commit.
- `bun test` (covering `streaming/` and `cli/`) MUST pass before merge. Changes to
  streaming protocol handling, argument parsing, or release scripting MUST land with a test.
- `bun run sync-models:check` MUST pass; a drifting model catalog blocks merge.
- PRs MUST state which principle any exception relies on and why. "It's faster this way" is
  not a justification.

## Governance

This constitution supersedes ad-hoc convention in this repository. Where it conflicts with a
README or a code comment, this document wins and the other MUST be corrected.

Amendments are made by PR editing `.specify/memory/constitution.md`, and MUST include an
updated Sync Impact Report and a version bump under semantic versioning:

- MAJOR — a principle is removed or redefined incompatibly.
- MINOR — a principle or section is added or materially expanded.
- PATCH — clarification, wording, or typo fixes with no change in obligation.

Reviewers MUST verify compliance with these principles before approving. Complexity that
violates a principle is allowed only with an explicit, written justification in the PR
description; an unjustified violation is a blocking review comment.

**Version**: 1.0.0 | **Ratified**: 2026-08-26 | **Last Amended**: 2026-08-26
