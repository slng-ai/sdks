// Voice preview with a fallback chain so we re-use existing samples when we can:
//
//   1. CLI cache: ~/.cache/voiceai/preview-<model>-<voice>.{mp3,wav}
//   2. voice-tools local sample: $VOICE_TOOLS_DIR/<sampleDir>/<voiceId>.wav
//   3. sampleUrl from the manifest (HTTP fetch; e.g. KugelAudio)
//   4. Synthesize via the SDK as a last resort, then cache to (1)
//
// Step 4 is the only path that costs an API call. Steps 2/3 read existing
// audio Slng has already generated for the voice-tools pipeline.

import { mkdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import type { Voice } from "./models";
import { makeClients } from "./sdk";
import { playBytes } from "./audio";

const CACHE_DIR = join(homedir(), ".cache", "voiceai");
const VOICE_TOOLS_DIR = process.env.VOICE_TOOLS_DIR ?? join(homedir(), "Dev", "SLNG", "voice-tools");

function cachePath(model: string, voice: string, ext = "mp3"): string {
  const safe = `${model}-${voice}`.replace(/[^A-Za-z0-9._-]+/g, "_");
  return join(CACHE_DIR, `preview-${safe}.${ext}`);
}

export const PREVIEW_TEXT = (name: string): string =>
  `Hi, I'm ${name}. This is what I sound like on Slng.`;

export interface PreviewResult {
  source: "cache" | "voice-tools" | "sample-url" | "synth";
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

  // 2. Local voice-tools sample if present.
  if (voice.sampleDir) {
    const localPath = join(VOICE_TOOLS_DIR, voice.sampleDir, `${voiceId}.wav`);
    if (existsSync(localPath)) {
      const bytes = new Uint8Array(readFileSync(localPath));
      // Promote to the cache so subsequent previews are instant even if
      // voice-tools/ goes away.
      mkdirSync(CACHE_DIR, { recursive: true });
      writeFileSync(cachePath(model, voiceId, "wav"), bytes);
      await playBytes(bytes);
      return { source: "voice-tools", bytes: bytes.length };
    }
  }

  // 3. Manifest sampleUrl (rare).
  if (voice.sampleUrl) {
    const resp = await fetch(voice.sampleUrl);
    if (resp.ok) {
      const bytes = new Uint8Array(await resp.arrayBuffer());
      mkdirSync(CACHE_DIR, { recursive: true });
      writeFileSync(cachePath(model, voiceId, "mp3"), bytes);
      await playBytes(bytes);
      return { source: "sample-url", bytes: bytes.length };
    }
  }

  // 4. Synthesize via the API.
  if (!synthIfMissing) {
    throw new Error(`no sample for ${voiceId} and synthIfMissing=false`);
  }
  const { http } = makeClients();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await (http as any).textToSpeech.create(model, {
    text: PREVIEW_TEXT(voice.name ?? voiceId),
    voice: voiceId,
  });
  const blob = await response.blob();
  const bytes = new Uint8Array(await blob.arrayBuffer());
  mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(cachePath(model, voiceId, "mp3"), bytes);
  await playBytes(bytes);
  return { source: "synth", bytes: bytes.length };
}
