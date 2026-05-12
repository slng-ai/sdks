#!/usr/bin/env bun
// Entry. Two modes:
//   - flag mode (args present, or stdin/stdout not a TTY) -> commander handles it
//   - TUI mode (no args, interactive terminal) -> Ink renders App
//
// Rationale: same binary works for `voiceai tts "hi" | ffplay -` (scriptable)
// and for `voiceai` alone (humans).

import { runFlagMode } from "./flags";

const args = process.argv.slice(2);
const stdinIsTty = process.stdin.isTTY === true;
const stdoutIsTty = process.stdout.isTTY === true;

if (args.length === 0 && stdinIsTty && stdoutIsTty) {
  // Lazy-load Ink so flag-mode invocations stay fast.
  const { runTui } = await import("./tui");
  await runTui();
} else {
  await runFlagMode(args);
}
