#!/usr/bin/env bun
// Build cli/src/lib/voice-catalog.generated.ts from voice-manifests/.
//
// Input shape:
//   voice-manifests/index.json: { [modelVariant]: { manifests: [{ file, sampleDir }, ...] } }
//   voice-manifests/<name>.json: { voices: [{ voiceId, name, gender, tone, useCase, ageRange, language }] }
// Output shape:
//   export const VOICE_CATALOG: Record<string, Voice[]>
//   export interface Voice { ... }

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const REPO_ROOT = new URL("..", import.meta.url).pathname;
const MANIFEST_DIR = join(REPO_ROOT, "voice-manifests");
const OUT = join(REPO_ROOT, "cli/src/lib/voice-catalog.generated.ts");

interface Voice {
  voiceId: string;
  name: string;
  gender: string;
  tone: string;
  useCase: string;
  ageRange: string;
  language: string;
}

interface IndexEntry {
  manifests: { file: string; sampleDir?: string }[];
}

const index = JSON.parse(readFileSync(join(MANIFEST_DIR, "index.json"), "utf8")) as Record<
  string,
  IndexEntry
>;

const catalog: Record<string, Voice[]> = {};
let total = 0;

for (const [modelVariant, entry] of Object.entries(index)) {
  const voices: Voice[] = [];
  const seen = new Set<string>();
  for (const m of entry.manifests) {
    const path = join(MANIFEST_DIR, m.file);
    let manifest: { voices?: RawVoice[] };
    try {
      manifest = JSON.parse(readFileSync(path, "utf8"));
    } catch {
      console.warn(`skip ${m.file}: not readable`);
      continue;
    }
    for (const raw of manifest.voices ?? []) {
      if (seen.has(raw.voiceId)) continue;
      seen.add(raw.voiceId);
      const v: Voice = {
        voiceId: raw.voiceId,
        name: raw.name ?? raw.voiceId,
        gender: raw.gender ?? "",
        tone: raw.tone ?? "",
        useCase: raw.useCase ?? "",
        ageRange: raw.ageRange ?? "",
        language: raw.language ?? "",
      };
      if (raw.sampleUrl) v.sampleUrl = raw.sampleUrl;
      if (m.sampleDir) v.sampleDir = m.sampleDir;
      voices.push(v);
    }
  }
  if (voices.length > 0) {
    catalog[modelVariant] = voices;
    total += voices.length;
  }
}

const header =
  "// AUTO-GENERATED from voice-manifests/. Do not edit by hand.\n" +
  "// Run `bun run gen-voices` to regenerate.\n\n";

const body =
  `export interface Voice {
  voiceId: string;
  name?: string;
  gender?: string;
  tone?: string;
  useCase?: string;
  ageRange?: string;
  language?: string;
  /** Relative path under VOICE_TOOLS_DIR holding pre-generated <voiceId>.wav (if any). */
  sampleDir?: string;
  /** HTTP URL of a pre-uploaded sample (set on a minority of providers, e.g. KugelAudio). */
  sampleUrl?: string;
}

export const VOICE_CATALOG: Record<string, Voice[]> = ${JSON.stringify(catalog, null, 2)};
`;

writeFileSync(OUT, header + body);
console.log(
  `wrote ${OUT}\n  ${Object.keys(catalog).length} model variants, ${total} voices total`,
);
