#!/usr/bin/env bun
// Refresh cli/src/lib/live-models.generated.ts from the PUBLIC catalog API
// (`GET /v1/catalog/models`). Unlike sync-live-models.ts (internal admin API,
// needs ADMIN_API_SECRET), this hits production and works anonymously, so it
// can run unattended in CI — see .github/workflows/sync-models.yml.
//
// Usage:
//   bun run sync-models           # rewrite the generated file
//   bun run sync-models:check     # exit 1 if the committed file is stale
//
// Env:
//   SLNG_API_BASE_URL  override the API base (default https://api.slng.ai)
//   SLNG_API_KEY       optional bearer token (anonymous returns the public set)

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const CHECK = process.argv.slice(2).includes("--check");
const REPO_ROOT = new URL("..", import.meta.url).pathname;
const OUT = join(REPO_ROOT, "cli/src/lib/live-models.generated.ts");
const API_BASE = process.env.SLNG_API_BASE_URL ?? "https://api.slng.ai";
const API_KEY = process.env.SLNG_API_KEY;
const PAGE_SIZE = 100;

interface CatalogRegionDetail {
  code?: string;
  world_part_code?: string | null;
}
interface CatalogModel {
  code: string;
  name?: string;
  service_type: "tts" | "stt" | string;
  provider_code?: string | null;
  short_description?: string | null;
  long_description?: string | null;
  best_for?: string | null;
  use_cases?: string[];
  capabilities?: string[];
  languages?: string[];
  streaming?: boolean;
  api_path?: string | null;
  code_example?: string | null;
  code_examples?: unknown;
  docs_url?: string | null;
  available_regions?: string[];
  region_details?: CatalogRegionDetail[];
  supported_protocols?: string[] | null;
}
interface ListResponse {
  items?: CatalogModel[];
  data?: CatalogModel[];
  meta?: { pages?: number };
}

async function fetchAllModels(serviceType: "tts" | "stt"): Promise<CatalogModel[]> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (API_KEY) headers.Authorization = `Bearer ${API_KEY}`;
  const out: CatalogModel[] = [];
  for (let page = 1; ; page++) {
    const url = `${API_BASE}/v1/catalog/models?service_type=${serviceType}&page=${page}&page_size=${PAGE_SIZE}`;
    const res = await fetch(url, { headers });
    if (!res.ok) {
      console.error(`error: GET ${url} -> ${res.status} ${res.statusText}`);
      console.error(await res.text());
      process.exit(1);
    }
    const body = (await res.json()) as ListResponse | CatalogModel[];
    const items = Array.isArray(body) ? body : (body.items ?? body.data ?? []);
    out.push(...items);
    const pages = Array.isArray(body) ? 1 : (body.meta?.pages ?? 1);
    if (items.length < PAGE_SIZE && page >= pages) break;
    if (items.length === 0) break;
  }
  return out;
}

function uniqSorted(values: (string | null | undefined)[]): string[] {
  return [...new Set(values.filter((v): v is string => Boolean(v)))].sort();
}

// Map a public CatalogModel onto the LiveModel shape the CLI already consumes
// (cli/src/lib/models.ts). Key order is fixed and arrays are sorted so the
// generated file is byte-stable across runs (clean diffs).
function toLiveModel(m: CatalogModel): Record<string, unknown> {
  const regions = uniqSorted(m.available_regions ?? (m.region_details ?? []).map((r) => r.code));
  const worldParts = uniqSorted((m.region_details ?? []).map((r) => r.world_part_code));
  const protocols = uniqSorted(m.supported_protocols ?? []);
  const deployments = { regions, worldParts, platforms: [] as string[], protocols };

  const out: Record<string, unknown> = {
    code: m.code,
    enabled: true,
    internal: false,
    service_type: m.service_type,
  };
  if (m.name) out.name = m.name;
  if (m.provider_code) out.provider_code = m.provider_code;
  if (m.short_description) out.short_description = m.short_description;
  if (m.long_description) out.long_description = m.long_description;
  if (m.best_for) out.best_for = m.best_for;
  if (m.use_cases?.length) out.use_cases = m.use_cases;
  if (m.capabilities?.length) out.capabilities = m.capabilities;
  if (m.languages?.length) out.languages = m.languages;
  if (typeof m.streaming === "boolean") out.streaming = m.streaming;
  if (m.api_path) out.api_path = m.api_path;
  if (m.code_example) out.code_example = m.code_example;
  if (m.code_examples) out.code_examples = m.code_examples;
  if (m.docs_url) out.docs_url = m.docs_url;
  if (regions.length || worldParts.length || protocols.length) out.deployments = deployments;
  return out;
}

function render(models: Record<string, unknown>[]): string {
  const header =
    "// AUTO-GENERATED from `api.slng.ai/v1/catalog/models`.\n" +
    "// Do not edit by hand. Run `bun run sync-models` to refresh (CI does this daily).\n\n";
  const interfaces = `export interface ModelDeployments {
  regions: string[];
  worldParts: string[];
  platforms: string[];
  protocols: string[];
}

export interface LiveModel {
  code: string;
  enabled: boolean;
  internal: boolean;
  service_type: "tts" | "stt" | "llm" | string;
  name?: string;
  provider_code?: string | null;
  short_description?: string | null;
  long_description?: string | null;
  best_for?: string | null;
  use_cases?: string[];
  capabilities?: string[];
  languages?: string[];
  streaming?: boolean;
  auth_secret_key?: string | null;
  /** Aggregated from the catalog's region details at sync time. */
  deployments?: ModelDeployments;
  [k: string]: unknown;
}

`;
  return `${header}${interfaces}export const LIVE_MODELS: readonly LiveModel[] = ${JSON.stringify(models, null, 2)} as const;\n`;
}

const [tts, stt] = await Promise.all([fetchAllModels("tts"), fetchAllModels("stt")]);
const models = [...tts, ...stt]
  .map(toLiveModel)
  .sort((a, b) => {
    const at = String(a.service_type),
      bt = String(b.service_type);
    if (at !== bt) return at.localeCompare(bt);
    return String(a.code).localeCompare(String(b.code));
  });

const next = render(models);

if (CHECK) {
  const current = existsSync(OUT) ? readFileSync(OUT, "utf8") : "";
  if (current !== next) {
    console.error("live-models.generated.ts is stale. Run `bun run sync-models` and commit the result.");
    process.exit(1);
  }
  console.log(`up to date: ${models.length} models (${tts.length} tts, ${stt.length} stt)`);
} else {
  writeFileSync(OUT, next);
  console.log(`wrote ${OUT}\n  ${models.length} models (${tts.length} tts, ${stt.length} stt) from ${API_BASE}${API_KEY ? " (authenticated)" : " (anonymous)"}`);
}
