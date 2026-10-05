// Live model catalog: GET /v1/agents/model-catalog on the agents host.
//
// The same SurfaceResolver.catalog() the dashboard's agent pickers read,
// gated to what the calling organisation may select. Keyed by agent region
// bucket (us-east, eu-central, …), then language. `models list` flattens it;
// `agents push` checks a package's models and voices against it before writing.

import { agentsRequest, type AgentsResult } from "./agents";

export type ServiceType = "stt" | "tts" | "llm";
export const SERVICE_TYPES: readonly ServiceType[] = ["stt", "tts", "llm"];

export interface CatalogVoice {
  voice_id: string;
  label?: string;
}

export interface CatalogOption {
  model_code: string;
  label?: string;
  service_type: ServiceType;
  region: string;
  language: string;
  hosting_world_part_code?: string | null;
  cross_region?: boolean;
  provider_name?: string | null;
  is_slng_hosted?: boolean;
  voices?: CatalogVoice[];
}

export interface CatalogLanguage {
  language: string;
  stt_options?: CatalogOption[];
  tts_options?: CatalogOption[];
  llm_options?: CatalogOption[];
}

export interface ModelCatalog {
  default_region?: string | null;
  regions: { region: string; languages: CatalogLanguage[] }[];
}

export function fetchModelCatalog(
  query: { language?: string; region?: string; service_type?: string } = {},
): Promise<AgentsResult<ModelCatalog>> {
  // Without this the platform hides a region that lacks any one of STT/TTS/LLM.
  return agentsRequest<ModelCatalog>("GET", "/v1/agents/model-catalog", {
    query: { ...query, require_all_services: "false" },
  });
}

// --- models list ------------------------------------------------------------

export interface ListedModel {
  id: string;
  name: string;
  type: ServiceType;
  provider: string | null;
  slng_hosted: boolean;
  regions: { id: string; hosted_in: string | null; cross_region: boolean }[];
  languages: string[];
  voices?: { id: string; name: string | null; languages: string[] }[];
}

/** One entry per model code, merging every region and language it appears in. */
export function flattenCatalog(catalog: ModelCatalog): ListedModel[] {
  const byId = new Map<string, ListedModel>();
  for (const r of catalog.regions) {
    for (const l of r.languages) {
      for (const type of SERVICE_TYPES) {
        for (const o of l[`${type}_options`] ?? []) {
          let m = byId.get(o.model_code);
          if (!m) {
            m = {
              id: o.model_code,
              name: o.label ?? o.model_code,
              type,
              provider: o.provider_name ?? null,
              slng_hosted: Boolean(o.is_slng_hosted),
              regions: [],
              languages: [],
              ...(type === "tts" ? { voices: [] } : {}),
            };
            byId.set(o.model_code, m);
          }
          if (!m.regions.some((x) => x.id === r.region)) {
            m.regions.push({
              id: r.region,
              hosted_in: o.hosting_world_part_code ?? null,
              cross_region: Boolean(o.cross_region),
            });
          }
          if (!m.languages.includes(l.language)) m.languages.push(l.language);
          for (const v of o.voices ?? []) {
            let voice = m.voices!.find((x) => x.id === v.voice_id);
            if (!voice) {
              voice = { id: v.voice_id, name: v.label ?? null, languages: [] };
              m.voices!.push(voice);
            }
            if (!voice.languages.includes(l.language)) voice.languages.push(l.language);
          }
        }
      }
    }
  }
  return [...byId.values()].sort((a, b) =>
    a.type === b.type ? a.id.localeCompare(b.id) : SERVICE_TYPES.indexOf(a.type) - SERVICE_TYPES.indexOf(b.type),
  );
}

// --- push validation ----------------------------------------------------------

export interface ModelProblem {
  /** The field the platform would name: models.tts_voice, models.fallbacks.llm[0], … */
  path: string;
  message: string;
}

const SUGGEST = 5;

function suggest(values: string[]): string {
  if (!values.length) return "";
  const head = values.slice(0, SUGGEST).join(", ");
  return `. try ${head}${values.length > SUGGEST ? `, … (${values.length - SUGGEST} more)` : ""}`;
}

/**
 * Check an agent's models and voices against the catalog. Mirrors the
 * platform's SurfaceResolver checks so the CLI is never stricter than the
 * write it precedes:
 *  - region "any" (unpinned) matches a model offered in any region;
 *  - an LLM named in `byokLlms` (the org's client models) skips the catalog;
 *  - a voice must be listed on that model for that region and language.
 */
export function checkAgentModels(
  agent: { region?: string; language?: string; models?: Record<string, unknown> },
  catalog: ModelCatalog,
  byokLlms: ReadonlySet<string> = new Set(),
): ModelProblem[] {
  const models = agent.models;
  if (!models || typeof models !== "object") return [];
  const region = agent.region && agent.region !== "any" ? agent.region : undefined;
  const where = `${region ?? "any region"}/${agent.language ?? "any language"}`;

  const regions = region ? catalog.regions.filter((r) => r.region === region) : catalog.regions;
  if (region && !regions.length) {
    return [{
      path: "region",
      message: `region "${region}": no models are offered there${suggest(catalog.regions.map((r) => r.region))}`,
    }];
  }
  const langs = regions.flatMap((r) => r.languages).filter((l) => !agent.language || l.language === agent.language);
  if (agent.language && !langs.length) {
    const offered = [...new Set(regions.flatMap((r) => r.languages.map((l) => l.language)))].sort();
    return [{ path: "language", message: `language "${agent.language}": no models in ${region ?? "any region"}${suggest(offered)}` }];
  }

  const problems: ModelProblem[] = [];
  const optionsFor = (type: ServiceType, code: string) =>
    langs.flatMap((l) => l[`${type}_options`] ?? []).filter((o) => o.model_code === code);
  const codesFor = (type: ServiceType) =>
    [...new Set(langs.flatMap((l) => (l[`${type}_options`] ?? []).map((o) => o.model_code)))];

  const checkModel = (type: ServiceType, path: string, code: unknown): CatalogOption[] | undefined => {
    if (typeof code !== "string" || !code) return undefined; // absent: the platform decides
    if (type === "llm" && byokLlms.has(code)) return undefined;
    const found = optionsFor(type, code);
    if (!found.length) {
      problems.push({ path, message: `${path} "${code}": not available in ${where}${suggest(codesFor(type))}` });
      return undefined;
    }
    return found;
  };
  const checkVoice = (path: string, model: string, found: CatalogOption[] | undefined, voice: unknown) => {
    if (!found || typeof voice !== "string" || !voice) return;
    const ids = [...new Set(found.flatMap((o) => (o.voices ?? []).map((v) => v.voice_id)))];
    if (!ids.includes(voice)) {
      problems.push({ path, message: `${path} "${voice}": not a voice of ${model} in ${where}${suggest(ids)}` });
    }
  };

  checkModel("stt", "models.stt", models.stt);
  checkModel("llm", "models.llm", models.llm);
  const tts = checkModel("tts", "models.tts", models.tts);
  checkVoice("models.tts_voice", String(models.tts), tts, models.tts_voice);

  const fb = (models.fallbacks ?? {}) as Record<string, unknown>;
  const list = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
  list(fb.stt).forEach((c, i) => checkModel("stt", `models.fallbacks.stt[${i}]`, c));
  list(fb.llm).forEach((c, i) => checkModel("llm", `models.fallbacks.llm[${i}]`, c));
  list(fb.tts).forEach((e, i) => {
    const entry = (e ?? {}) as Record<string, unknown>;
    const found = checkModel("tts", `models.fallbacks.tts[${i}].model`, entry.model);
    checkVoice(`models.fallbacks.tts[${i}].voice`, String(entry.model), found, entry.voice);
  });
  return problems;
}
