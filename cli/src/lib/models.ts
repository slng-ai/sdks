// Model catalog. Source of truth = Slng's admin API (LIVE_MODELS, refreshed
// via `bun run sync-live-models` with ADMIN_API_SECRET). Voice catalog
// (voice-tools manifests) drives `voicesFor()` independently.
//
// When LIVE_MODELS is empty (e.g. a fresh checkout where no one has yet run
// sync-live-models with the secret), we fall back to keys present in the
// voice catalog — better than nothing, and guaranteed deployable.

import { VOICE_CATALOG, type Voice } from "./voice-catalog.generated";
import { LIVE_MODELS, type LiveModel } from "./live-models.generated";

export type { Voice } from "./voice-catalog.generated";

export interface ModelDeployments {
  regions: string[];
  worldParts: string[];
  platforms: string[];
  protocols: string[];
}

export interface TtsModel {
  id: string;
  provider: string;
  family: string;
  languages?: string[];
  name?: string;
  shortDescription?: string;
  capabilities?: string[];
  useCases?: string[];
  streaming?: boolean;
  deployments?: ModelDeployments;
}

export interface SttModel {
  id: string;
  provider: string;
  family: string;
  languages?: string[];
  name?: string;
  shortDescription?: string;
  capabilities?: string[];
  streaming?: boolean;
  deployments?: ModelDeployments;
}

/** Best-effort parse: `[slng/]<provider>/<family>(:<variant>)?` */
function parseModelId(code: string): { provider: string; family: string } {
  const trimmed = code.startsWith("slng/") ? code.slice("slng/".length) : code;
  const [provider = "", rest = ""] = trimmed.split("/");
  const family = rest.split(":")[0] ?? "";
  return { provider, family };
}

function fromLive(m: LiveModel): TtsModel & SttModel {
  // The snapshot may pre-date the `deployments` field; pull defensively.
  const d = m.deployments as ModelDeployments | undefined;
  const hasAny = d && (d.regions?.length || d.worldParts?.length || d.platforms?.length || d.protocols?.length);
  return {
    id: m.code,
    ...parseModelId(m.code),
    languages: m.languages?.length ? m.languages : undefined,
    name: m.name || undefined,
    shortDescription: m.short_description || undefined,
    capabilities: m.capabilities?.length ? m.capabilities : undefined,
    useCases: m.use_cases?.length ? m.use_cases : undefined,
    streaming: m.streaming,
    deployments: hasAny ? d : undefined,
  };
}

/** Lookup: regions a TTS or STT model is currently deployed to. Empty if unknown. */
export function regionsFor(modelId: string): string[] {
  const m = [...TTS_MODELS, ...STT_MODELS].find((m) => m.id === modelId);
  return m?.deployments?.regions ?? [];
}

/** Lookup: world-parts (na/eu/ap) a model is deployed to. Empty if unknown. */
export function worldPartsFor(modelId: string): string[] {
  const m = [...TTS_MODELS, ...STT_MODELS].find((m) => m.id === modelId);
  return m?.deployments?.worldParts ?? [];
}

/** Static fallbacks (from the OAS spec) used only when the live snapshot is empty. */
const FALLBACK_REGIONS = ["us-east-1", "eu-north-1", "ap-southeast-2"];
const FALLBACK_WORLD_PARTS = ["na", "eu", "ap"];

/** Union of all regions any deployed model is reachable in.
 *  Derived from the live admin-API snapshot; refreshes on `bun run sync-live-models`. */
export function allRegions(): string[] {
  const set = new Set<string>();
  for (const m of [...TTS_MODELS, ...STT_MODELS]) {
    for (const r of m.deployments?.regions ?? []) set.add(r);
  }
  if (set.size === 0) FALLBACK_REGIONS.forEach((r) => set.add(r));
  return [...set].sort();
}

/** Union of all world-parts across live deployments. */
export function allWorldParts(): string[] {
  const set = new Set<string>();
  for (const m of [...TTS_MODELS, ...STT_MODELS]) {
    for (const w of m.deployments?.worldParts ?? []) set.add(w);
  }
  if (set.size === 0) FALLBACK_WORLD_PARTS.forEach((w) => set.add(w));
  return [...set].sort();
}

/** Fallback when LIVE_MODELS is empty: derive from voice catalog keys. */
function fromVoiceCatalog(): { tts: TtsModel[] } {
  const tts: TtsModel[] = Object.keys(VOICE_CATALOG).map((id) => {
    const voices = VOICE_CATALOG[id] ?? [];
    const langs = [...new Set(voices.map((v) => v.language).filter((l): l is string => Boolean(l)))];
    return {
      id,
      ...parseModelId(id),
      languages: langs.length ? langs : undefined,
    };
  });
  return { tts };
}

/** Sort comparator: Slng-hosted variants (`slng/*`) first, alphabetical within. */
function slngFirstCompare(a: { id: string }, b: { id: string }): number {
  const aSlng = a.id.startsWith("slng/");
  const bSlng = b.id.startsWith("slng/");
  if (aSlng !== bSlng) return aSlng ? -1 : 1;
  return a.id.localeCompare(b.id);
}

/** True when the model is routed through Slng's own infra. */
export function isSlngHosted(id: string): boolean {
  return id.startsWith("slng/");
}

/** Provider code for a model id (`deepgram`, `cartesia`, `sarvam`, …).
 *  Strips the optional `slng/` prefix and returns the next segment. */
export function providerFor(id: string): string {
  const trimmed = id.startsWith("slng/") ? id.slice("slng/".length) : id;
  return trimmed.split("/")[0] ?? "";
}

// `catalog_visible: false` upstream means "deployed but hidden from pickers"
// (e.g. previews, in-flight launches). `!== false` keeps older snapshots that
// don't carry the field at all.
const isCatalogVisible = (m: LiveModel): boolean => m.catalog_visible !== false;

export const TTS_MODELS: TtsModel[] = (LIVE_MODELS.length > 0
  ? LIVE_MODELS.filter((m) => m.service_type === "tts" && isCatalogVisible(m)).map(fromLive)
  : fromVoiceCatalog().tts
).sort(slngFirstCompare);

export const STT_MODELS: SttModel[] = (LIVE_MODELS.length > 0
  ? LIVE_MODELS.filter((m) => m.service_type === "stt" && isCatalogVisible(m)).map(fromLive)
  : []
).sort(slngFirstCompare);

/** Return rich Voice records for a model_variant, in catalog order. */
export function voicesFor(modelId: string): Voice[] {
  return VOICE_CATALOG[modelId] ?? [];
}

/**
 * Voices for a model, filtered to a language. Multilingual models like
 * `cartesia/sonic:3` carry voices for every supported language; without
 * this filter the picker drowns the user in 700+ entries.
 *
 * Pass an empty `lang` (or omit it) to skip the filter.
 */
export function voicesForLanguage(modelId: string, lang: string): Voice[] {
  const all = voicesFor(modelId);
  if (!lang) return all;
  const matching = all.filter((v) => v.language === lang);
  // If the model itself is language-pinned (e.g. slng/deepgram/aura:2-en),
  // the catalog already filtered; fall back to "all" if our filter zeroed it.
  return matching.length > 0 ? matching : all;
}

/** Compose a short picker label: "Amalthea - feminine". */
export function voiceLabel(v: Voice): string {
  if (v.gender) return `${v.name ?? v.voiceId} - ${v.gender}`;
  return v.name ?? v.voiceId;
}

/** Common languages we'd rather see at the top of any picker. */
const TOP_LANGUAGES = ["en", "es", "fr", "de", "it", "pt", "ja", "zh", "ko", "hi"];

/** Distinct languages in the catalog. Top common ones first (in our order),
 *  then the rest sorted alphabetically by their display name. */
export function allLanguages(): string[] {
  const set = new Set<string>();
  for (const m of TTS_MODELS) for (const lang of m.languages ?? []) set.add(lang);
  const top = TOP_LANGUAGES.filter((l) => set.has(l));
  const rest = [...set]
    .filter((l) => !TOP_LANGUAGES.includes(l))
    .sort((a, b) => languageLabel(a).localeCompare(languageLabel(b)));
  return [...top, ...rest];
}

/**
 * Return TTS models matching a language code. Models without `languages`
 * declared are treated as multilingual and included for every language.
 */
export function ttsModelsForLanguage(lang: string): TtsModel[] {
  if (!lang) return TTS_MODELS;
  return TTS_MODELS.filter((m) => !m.languages || m.languages.includes(lang));
}

// Use the platform's locale data instead of a hand-curated map — covers every
// ISO 639-1 code (en, fr, zh, ja, hi, …) without us maintaining a list.
const DISPLAY_NAMES = new Intl.DisplayNames(["en"], { type: "language" });

/** "en" -> "English". Falls back to the code if the platform doesn't know it. */
export function languageLabel(code: string): string {
  if (!code) return code;
  try {
    return DISPLAY_NAMES.of(code) ?? code;
  } catch {
    return code;
  }
}
