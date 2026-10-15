// Speech models and voices for direct API use (`tts`, `stt`, the TUI), read live
// from the public catalog. No key needed:
//
//   GET /v1/catalog/models?service_type=tts   models; served_regions = the
//                                             API regions that serve each one
//   GET /v1/catalog/models/<code>             one model, with its voices
//
// Agent commands use a different catalog: model-catalog.ts.

import { apiBaseUrl, gatewayUrl, regionOf, requireApiKey, type Region } from "./config";
import { resolveBaseUrl } from "./verify";

export type SpeechType = "tts" | "stt";

export interface SpeechModel {
  id: string;
  name?: string;
  languages: string[];
  /** API regions whose gateway serves this model. */
  regions: string[];
}

export interface Voice {
  voiceId: string;
  name?: string;
  gender?: string;
  tone?: string;
  useCase?: string;
  ageRange?: string;
  language?: string;
  /** A ready-made sample of this voice. */
  sampleUrl?: string;
}

interface RawModel {
  code: string;
  name?: string;
  languages?: string[];
  served_regions?: string[];
  voices?: RawVoice[];
}

interface RawVoice {
  voice_id: string;
  name?: string;
  gender?: string;
  tone?: string;
  use_case?: string;
  age_range?: string;
  language?: string;
  preview_url?: string;
  enabled?: boolean;
}

const PAGE_SIZE = 100;

// ponytail: every gateway serves the same public catalog, so any one will do
// and no probe is needed. VOICEAI_BASE_URL still wins, for stubs.
const catalogBase = (): string => apiBaseUrl() ?? gatewayUrl("eu-west");

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${catalogBase()}${path}`, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`could not read the model catalog: ${res.status} ${res.statusText}`.trim());
  return (await res.json()) as T;
}

const lists = new Map<SpeechType, Promise<SpeechModel[]>>();
const voiceLists = new Map<string, Promise<Voice[]>>();

async function fetchModels(type: SpeechType): Promise<SpeechModel[]> {
  const out: SpeechModel[] = [];
  for (let page = 1; ; page++) {
    const body = await getJson<{ items?: RawModel[] }>(
      `/v1/catalog/models?service_type=${type}&page=${page}&page_size=${PAGE_SIZE}`,
    );
    const items = body.items ?? [];
    for (const m of items) {
      out.push({ id: m.code, name: m.name, languages: m.languages ?? [], regions: m.served_regions ?? [] });
    }
    if (items.length < PAGE_SIZE) break;
  }
  return out.sort(slngFirst);
}

/** All models of one type, read once per run. With `region`, only those it serves. */
export async function listModels(type: SpeechType, region?: string): Promise<SpeechModel[]> {
  let list = lists.get(type);
  if (!list) {
    list = fetchModels(type);
    lists.set(type, list);
    list.catch(() => lists.delete(type));
  }
  const all = await list;
  return region ? all.filter((m) => m.regions.includes(region)) : all;
}

/**
 * Models served at the caller's own API region, and that region. When the
 * region can't be found (no key yet, or a custom base URL), every model is returned.
 */
export async function listMyModels(type: SpeechType): Promise<{ region?: Region; models: SpeechModel[] }> {
  const region = await resolveBaseUrl(requireApiKey())
    .then(regionOf)
    .catch(() => undefined);
  return { region, models: await listModels(type, region) };
}

/** A model's enabled voices, read once per model per run. Unknown model → []. */
export function voicesFor(model: string): Promise<Voice[]> {
  let voices = voiceLists.get(model);
  if (!voices) {
    voices = getJson<RawModel>(`/v1/catalog/models/${model}`).then((m) =>
      (m.voices ?? []).filter((v) => v.enabled !== false).map(toVoice),
    );
    voiceLists.set(model, voices);
    voices.catch(() => voiceLists.delete(model));
  }
  return voices;
}

function toVoice(v: RawVoice): Voice {
  return {
    voiceId: v.voice_id,
    name: v.name || undefined,
    gender: v.gender || undefined,
    tone: v.tone || undefined,
    useCase: v.use_case || undefined,
    ageRange: v.age_range || undefined,
    language: v.language || undefined,
    sampleUrl: v.preview_url || undefined,
  };
}

/** Forget what was read, so the next call fetches again. For tests. */
export function resetCatalog(): void {
  lists.clear();
  voiceLists.clear();
}

/** True when the model is routed through Slng's own infra. */
export function isSlngHosted(id: string): boolean {
  return id.startsWith("slng/");
}

/** Slng-hosted models (`slng/*`) first, alphabetical within. */
function slngFirst(a: { id: string }, b: { id: string }): number {
  const aSlng = isSlngHosted(a.id);
  if (aSlng !== isSlngHosted(b.id)) return aSlng ? -1 : 1;
  return a.id.localeCompare(b.id);
}

/** Picker label: "★ Fish TTS S2.1 Pro (slng/fish/tts:s2.1-pro)". */
export function modelLabel(m: SpeechModel): string {
  const display = m.name ? `${m.name} (${m.id})` : m.id;
  return isSlngHosted(m.id) ? `★ ${display}` : `  ${display}`;
}

/**
 * Voices in one language. Multilingual models carry voices for every language,
 * so without this the picker shows hundreds. An empty `lang` keeps them all,
 * and so does a filter that would leave none.
 */
export function voicesForLanguage(voices: Voice[], lang: string): Voice[] {
  if (!lang) return voices;
  const matching = voices.filter((v) => v.language === lang);
  return matching.length > 0 ? matching : voices;
}

/** Compose a short picker label: "Amalthea - feminine". */
export function voiceLabel(v: Voice): string {
  if (v.gender) return `${v.name ?? v.voiceId} - ${v.gender}`;
  return v.name ?? v.voiceId;
}

/** Common languages we'd rather see at the top of any picker. */
const TOP_LANGUAGES = ["en", "es", "fr", "de", "it", "pt", "ja", "zh", "ko", "hi"];

/** Distinct languages of these models. Common ones first, then by display name. */
export function allLanguages(models: SpeechModel[]): string[] {
  const set = new Set(models.flatMap((m) => m.languages));
  const top = TOP_LANGUAGES.filter((l) => set.has(l));
  const rest = [...set]
    .filter((l) => !TOP_LANGUAGES.includes(l))
    .sort((a, b) => languageLabel(a).localeCompare(languageLabel(b)));
  return [...top, ...rest];
}

/** Models for a language. A model with no languages listed counts as multilingual. */
export function modelsForLanguage(models: SpeechModel[], lang: string): SpeechModel[] {
  if (!lang) return models;
  return models.filter((m) => m.languages.length === 0 || m.languages.includes(lang));
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
