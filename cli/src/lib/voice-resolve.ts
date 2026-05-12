// Resolve a user-supplied voice spec to the actual voiceId the API expects.
//
// Some providers (Deepgram Aura) use readable voiceIds like `aura-2-thalia-en`,
// so users typing `--voice thalia` would fail without help.
// Other providers (Cartesia, Sarvam) use UUIDs as voiceIds and friendly
// `name` fields like "Brooke - Big Sister" — users will obviously type
// `brooke`, not the UUID. Both cases need name → voiceId resolution.

import { voicesFor, type Voice } from "./models";

export interface ResolveResult {
  ok: boolean;
  voiceId?: string;
  /** If ambiguous, candidates that matched. */
  candidates?: Voice[];
  /** Human-readable explanation suitable for stderr. */
  message?: string;
}

/** Match by exact voiceId, then exact name, then case-insensitive substring of name. */
export function resolveVoice(model: string, query: string): ResolveResult {
  const voices = voicesFor(model);
  if (voices.length === 0) {
    // Unknown model in our catalog — pass through verbatim and let the API decide.
    return { ok: true, voiceId: query };
  }

  // 1. Exact voiceId
  const byId = voices.find((v) => v.voiceId === query);
  if (byId) return { ok: true, voiceId: byId.voiceId };

  // 2. Exact name (case-insensitive)
  const q = query.toLowerCase();
  const exactName = voices.filter((v) => (v.name ?? "").toLowerCase() === q);
  if (exactName.length === 1) {
    return {
      ok: true,
      voiceId: exactName[0]!.voiceId,
      message: `resolved "${query}" → ${exactName[0]!.voiceId} (${exactName[0]!.name})`,
    };
  }
  if (exactName.length > 1) {
    return {
      ok: false,
      candidates: exactName,
      message: `"${query}" matches ${exactName.length} voices by name. Use one of:\n${formatCandidates(exactName)}`,
    };
  }

  // 3. Substring (e.g. "brooke" matches "Brooke - Big Sister")
  const partial = voices.filter((v) => (v.name ?? "").toLowerCase().includes(q));
  if (partial.length === 1) {
    return {
      ok: true,
      voiceId: partial[0]!.voiceId,
      message: `resolved "${query}" → ${partial[0]!.voiceId} (${partial[0]!.name})`,
    };
  }
  if (partial.length > 1 && partial.length <= 8) {
    return {
      ok: false,
      candidates: partial,
      message: `"${query}" matches ${partial.length} voices for ${model}. Pass a more specific voice (name or voiceId):\n${formatCandidates(partial)}`,
    };
  }
  if (partial.length > 8) {
    return {
      ok: false,
      candidates: partial.slice(0, 8),
      message: `"${query}" matches ${partial.length} voices for ${model}. Try a more specific name. First 8:\n${formatCandidates(partial.slice(0, 8))}`,
    };
  }

  return {
    ok: false,
    message: `no voice matching "${query}" for ${model}. Try \`voiceai voices --model ${model}\` to list options.`,
  };
}

function formatCandidates(vs: Voice[]): string {
  return vs
    .map((v) => `  ${v.voiceId.padEnd(40)}  ${v.name ?? ""}${v.gender ? `  (${v.gender})` : ""}`)
    .join("\n");
}
