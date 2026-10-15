// Voice preview with a fallback chain so we re-use existing samples when we can:
//
//   1. CLI cache: ~/.cache/voiceai/preview-<model>-<voice>.{mp3,wav}
//   2. The catalog's sample for the voice (sampleUrl, an HTTP fetch)
//   3. Synthesize via the API as a last resort, then cache to (1)
//
// Step 3 is the only path that costs an API call.

import { mkdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import type { Voice } from "./catalog";
import { synthesize, TTS_SAMPLE_RATE, wav } from "./bridge";
import { playBytes, sniffExt } from "./audio";

const CACHE_DIR = join(homedir(), ".cache", "voiceai");

function cachePath(model: string, voice: string, ext = "mp3"): string {
  const safe = `${model}-${voice}`.replace(/[^A-Za-z0-9._-]+/g, "_");
  return join(CACHE_DIR, `preview-${safe}.${ext}`);
}

export const PREVIEW_TEXT = (name: string): string =>
  `Hi, I'm ${name}. This is what I sound like on Slng.`;

export interface PreviewResult {
  source: "cache" | "sample-url" | "synth";
  bytes: number;
}

export async function previewVoice(
  model: string,
  voice: Voice,
  opts: { synthIfMissing?: boolean } = {},
): Promise<PreviewResult> {
  const voiceId = voice.voiceId;
  const synthIfMissing = opts.synthIfMissing ?? true;

  // 1. CLI cache (mp3 first, then wav).
  for (const ext of ["mp3", "wav"]) {
    const p = cachePath(model, voiceId, ext);
    if (existsSync(p)) {
      const bytes = new Uint8Array(readFileSync(p));
      await playBytes(bytes);
      return { source: "cache", bytes: bytes.length };
    }
  }

  // 2. The catalog's sample.
  if (voice.sampleUrl) {
    const resp = await fetch(voice.sampleUrl);
    if (resp.ok) {
      const bytes = new Uint8Array(await resp.arrayBuffer());
      mkdirSync(CACHE_DIR, { recursive: true });
      writeFileSync(cachePath(model, voiceId, sniffExt(bytes) === "wav" ? "wav" : "mp3"), bytes);
      await playBytes(bytes);
      return { source: "sample-url", bytes: bytes.length };
    }
  }

  // 3. Synthesize via the API.
  if (!synthIfMissing) {
    throw new Error(`no sample for ${voiceId} and synthIfMissing=false`);
  }
  const bytes = wav(await synthesize(model, voiceId, PREVIEW_TEXT(voice.name ?? voiceId)), TTS_SAMPLE_RATE);
  mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(cachePath(model, voiceId, "wav"), bytes);
  await playBytes(bytes);
  return { source: "synth", bytes: bytes.length };
}
