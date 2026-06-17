#!/usr/bin/env bun
// Live smoke test against the real Slng API.
//
// Usage:
//   SLNG_API_KEY=slng_cu_... bun scripts/smoke-test.ts
//
// Imports the Stainless-generated SDK directly from the working copy at
// sdks/slng-typescript/src — skips the build step. If you want to exercise
// the published-shaped artifact instead, run `pnpm build` first and import
// from sdks/slng-typescript/dist.

import Slng from "../sdks/slng-typescript/src/index";
import { writeFileSync } from "node:fs";

const apiKey = process.env.SLNG_API_KEY;
if (!apiKey) {
  console.error("set SLNG_API_KEY first");
  process.exit(1);
}

const client = new Slng({ apiKey });

console.log("→ synthesizing 'hello world' with slng/deepgram/aura:2-en…");
const response = await client.textToSpeech.create("slng/deepgram/aura:2-en", {
  voice: "aura-2-thalia-en",
  text: "Hello world. This is a Stainless SDK smoke test.",
});

const blob = await response.blob();
const bytes = new Uint8Array(await blob.arrayBuffer());
writeFileSync("/tmp/slng-smoke.wav", bytes);
console.log(`✓ wrote ${bytes.length} bytes to /tmp/slng-smoke.wav (Content-Type: ${blob.type})`);
console.log("  play with: ffplay -autoexit /tmp/slng-smoke.wav");
