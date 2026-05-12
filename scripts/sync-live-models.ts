#!/usr/bin/env bun
// Fetch the deployed-model registry from Slng's internal admin API and emit it
// as a typed constant for the CLI to consume. Without ADMIN_API_SECRET in env,
// skips gracefully (regen still completes; CLI uses whatever snapshot exists).
//
// The admin API is internal: only Slng team members with the secret can refresh
// the snapshot. Other contributors get the committed snapshot from this repo.

import { writeFileSync } from "node:fs";
import { join } from "node:path";

const REPO_ROOT = new URL("..", import.meta.url).pathname;
const OUT = join(REPO_ROOT, "cli/src/lib/live-models.generated.ts");
const ADMIN_API_BASE_URL =
  process.env.ADMIN_API_BASE_URL ?? "https://api.int.slng.ai";

const secret = process.env.ADMIN_API_SECRET;
if (!secret) {
  console.log(
    "skip: ADMIN_API_SECRET not set — live-models.generated.ts NOT refreshed",
  );
  console.log(
    "      (CLI will keep using whatever snapshot is committed to this repo)",
  );
  process.exit(0);
}

interface ModelOut {
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
  // any other fields the admin API adds are preserved verbatim
  [k: string]: unknown;
}

interface ModelDeploymentSummary {
  regions: string[];
  worldParts: string[];
  platforms: string[];
  protocols: string[];
}

type EnrichedModel = ModelOut & { deployments?: ModelDeploymentSummary };

interface PaginatedResponse<T> {
  items?: T[];
  data?: T[];
  total?: number;
  page?: number;
  page_size?: number;
}

interface DeploymentOut {
  model_code: string;
  platform_code: string;
  region_code?: string | null;
  protocol: string;
  enabled: boolean;
  [k: string]: unknown;
}

async function fetchAll<T>(path: string, params: Record<string, string>): Promise<T[]> {
  const url = new URL(path, ADMIN_API_BASE_URL);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  console.log(`GET ${url.toString()}`);
  const r = await fetch(url.toString(), {
    headers: { "X-Internal-Secret": secret!, Accept: "application/json" },
  });
  if (!r.ok) {
    console.error(`error: ${r.status} ${r.statusText}`);
    console.error(await r.text());
    process.exit(1);
  }
  const body = (await r.json()) as PaginatedResponse<T> | T[];
  return Array.isArray(body) ? body : (body.items ?? body.data ?? []);
}

// Two queries: which models are configured + which actually have a deployment.
const [allModels, allDeployments] = await Promise.all([
  fetchAll<ModelOut>("/admin/models", { page: "1", page_size: "500" }),
  fetchAll<DeploymentOut>("/admin/deployments", { page: "1", page_size: "500", enabled: "true" }),
]);

// Group deployments by model_code and collect distinct dimensions per model.
const deploymentsByModel = new Map<string, ModelDeploymentSummary>();
for (const d of allDeployments) {
  if (d.enabled !== true) continue;
  let entry = deploymentsByModel.get(d.model_code);
  if (!entry) {
    entry = { regions: [], worldParts: [], platforms: [], protocols: [] };
    deploymentsByModel.set(d.model_code, entry);
  }
  if (d.region_code && !entry.regions.includes(d.region_code)) entry.regions.push(d.region_code);
  const wp = (d as { region_world_part_code?: string | null }).region_world_part_code;
  if (wp && !entry.worldParts.includes(wp)) entry.worldParts.push(wp);
  if (d.platform_code && !entry.platforms.includes(d.platform_code)) entry.platforms.push(d.platform_code);
  if (d.protocol && !entry.protocols.includes(d.protocol)) entry.protocols.push(d.protocol);
}
for (const summary of deploymentsByModel.values()) {
  summary.regions.sort();
  summary.worldParts.sort();
  summary.platforms.sort();
  summary.protocols.sort();
}

const deployed: EnrichedModel[] = allModels
  .filter(
    (m) =>
      m.enabled === true &&
      m.internal === false &&
      deploymentsByModel.has(m.code),
  )
  .map((m) => ({ ...m, deployments: deploymentsByModel.get(m.code) }))
  .sort((a, b) => {
    if (a.service_type !== b.service_type)
      return a.service_type.localeCompare(b.service_type);
    return a.code.localeCompare(b.code);
  });

console.log(
  `models: ${allModels.length} total · ${deploymentsByModel.size} with enabled deployments · ${deployed.length} kept after filter`,
);

const tts = deployed.filter((m) => m.service_type === "tts").length;
const stt = deployed.filter((m) => m.service_type === "stt").length;

const header =
  "// AUTO-GENERATED from `api.int.slng.ai/admin/models`.\n" +
  "// Do not edit by hand. Run `bun run sync-live-models` (with ADMIN_API_SECRET) to refresh.\n\n";

const body_ts = `export interface ModelDeployments {
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
  /** Aggregated from enabled deployments at sync time. */
  deployments?: ModelDeployments;
  [k: string]: unknown;
}

export const LIVE_MODELS: readonly LiveModel[] = ${JSON.stringify(
  deployed,
  null,
  2,
)} as const;
`;

writeFileSync(OUT, header + body_ts);
console.log(
  `wrote ${OUT}\n  ${deployed.length} deployed models (${tts} tts, ${stt} stt)`,
);
