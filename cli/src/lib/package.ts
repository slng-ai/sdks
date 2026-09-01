// Reading an unmute-compiled agent package off disk.
//
// Pure filesystem and parse work — nothing here talks to the API, which is what
// makes the planner in commands/push.ts unit-testable without a stub server.
//
// Unmute writes build/<target>/ containing agent.json, tools/<name>.json for
// every tool that needs a body, and README.md. It writes NAMES where the
// platform wants identifiers, because no compiler can invent an id a server
// assigns; resolving those is push's job, not this module's.

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";

// --- types -----------------------------------------------------------------

export interface PackageLocation {
  agentBody: string; // absolute path to agent.json
  toolsDir: string; // <compiled>/tools — may not exist
  samplesDir: string; // <compiled>/samples — may not exist
  searched: string[]; // every candidate tried, for the not-found message
}

/** One tool_refs entry as unmute writes it: a name where ids belong. */
export interface PackageToolRef {
  tool: string;
  description?: string | null;
  invocation?: string;
  argument_overrides?: Record<string, unknown>;
  // execution_policy / config_overrides appear on richer packages. Preserved
  // verbatim, so they are carried in the index signature rather than typed.
  [k: string]: unknown;
}

/**
 * One mcp_refs entry as unmute writes it: names where identifiers belong, the
 * same bargain PackageToolRef makes.
 *
 * `server_name` is accepted alongside `server` because the only artefact naming
 * the key is this repository's own fixture — a reference carrying neither is
 * reported as unresolved rather than crashing on undefined.
 */
export interface PackageMcpRef {
  server?: string;
  server_name?: string;
  tool_name: string;
  // description / invocation / system / execution_policy / argument_overrides
  // appear on richer packages. Preserved verbatim, so carried in the index
  // signature rather than typed.
  [k: string]: unknown;
}

/** The server this reference names, under either spelling. */
export function mcpRefServer(ref: PackageMcpRef): string | undefined {
  const name = ref.server ?? ref.server_name;
  return typeof name === "string" && name !== "" ? name : undefined;
}

/**
 * agent.json. Only the fields push reads are named; everything else is carried
 * through untouched — push is a resolver, not a validator of the platform's own
 * schema, and the platform rejects what it dislikes with a better message.
 */
export interface CompiledAgent {
  schema_version?: number;
  name: string;
  system_prompt?: string;
  greeting?: string;
  tool_mode?: string;
  tool_refs?: PackageToolRef[];
  mcp_refs?: PackageMcpRef[];
  [k: string]: unknown;
}

/** tools/<name>.json — a ToolCreate body. */
export interface PackageToolBody {
  name: string;
  tool_type: string;
  description?: string;
  config?: Record<string, unknown> | null;
  code_src?: string;
  declared_secrets?: string[];
  dependencies?: string[];
  [k: string]: unknown;
}

export interface LoadedPackage {
  location: PackageLocation;
  agent: CompiledAgent;
  tools: PackageToolBody[];
  /** tool name -> sample_input. Operator-authored; unmute emits none. */
  samples: Map<string, Record<string, unknown>>;
}

/** Thrown for anything that makes the package unreadable. */
export class PackageError extends Error {}

// --- location --------------------------------------------------------------

export const COMPILED_SUBDIR = join("build", "slng");

/**
 * Find agent.json under `dir`, accepting either the package root or the
 * compiled directory. Both are reasonable things for an operator to name, so
 * both work; when neither hits, `searched` carries every path tried.
 */
export function locate(dir: string): PackageLocation {
  const root = resolve(dir);
  const candidates = [join(root, COMPILED_SUBDIR, "agent.json"), join(root, "agent.json")];
  const hit = candidates.find((c) => existsSync(c));
  if (!hit) {
    throw new PackageError(
      `no compiled agent package in ${root}\n` +
        `  looked for:\n${candidates.map((c) => `    ${c}`).join("\n")}\n` +
        "  pass the package directory or its build/slng directory. " +
        "compile one first with `unmute compile`.",
    );
  }
  const compiled = dirname(hit);
  return {
    agentBody: hit,
    toolsDir: join(compiled, "tools"),
    samplesDir: join(compiled, "samples"),
    searched: candidates,
  };
}

// --- parse -----------------------------------------------------------------

function readJson(path: string, what: string): unknown {
  let raw: string;
  try {
    raw = readFileSync(path, "utf8");
  } catch (e) {
    throw new PackageError(`could not read ${what} at ${path}: ${(e as Error).message}`);
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    throw new PackageError(`invalid JSON in ${what} at ${path}: ${(e as Error).message}`);
  }
}

/** Every *.json in `dir`, sorted. A missing directory is normal, not an error. */
function jsonFilesIn(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => join(dir, f));
}

/**
 * Read a package: the agent body, every shipped tool body, and every sample.
 *
 * `tools/` is absent for a package whose tools are all curated capabilities the
 * platform already owns — the smallest package, and not an error. `samples/` is
 * operator-authored and usually absent too.
 */
export function loadPackage(dir: string): LoadedPackage {
  const location = locate(dir);
  const agent = readJson(location.agentBody, "agent.json") as CompiledAgent;
  if (!agent || typeof agent !== "object" || Array.isArray(agent)) {
    throw new PackageError(`${location.agentBody} is not a JSON object`);
  }
  if (typeof agent.name !== "string" || !agent.name) {
    throw new PackageError(`${location.agentBody} has no "name" — it identifies the agent to push`);
  }

  const tools: PackageToolBody[] = [];
  for (const path of jsonFilesIn(location.toolsDir)) {
    const body = readJson(path, "tool body") as PackageToolBody;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw new PackageError(`${path} is not a JSON object`);
    }
    // The file name is the tool name in unmute's output; trust the body's own
    // `name` when present and fall back to the file name when it is not.
    if (typeof body.name !== "string" || !body.name) body.name = basename(path, ".json");
    tools.push(body);
  }

  const samples = new Map<string, Record<string, unknown>>();
  for (const path of jsonFilesIn(location.samplesDir)) {
    const sample = readJson(path, "sample") as Record<string, unknown>;
    if (!sample || typeof sample !== "object" || Array.isArray(sample)) {
      throw new PackageError(`${path} is not a JSON object — a sample is one set of arguments`);
    }
    samples.set(basename(path, ".json"), sample);
  }

  return { location, agent, tools, samples };
}

// --- vault names -----------------------------------------------------------

/**
 * Secret names a tool needs at run time, mirroring the backend's own per-type
 * rule (app/services/tools.py: derive_tool_secret_names). Kept in step with it
 * deliberately: the platform re-checks this as a publish gate, and a CLI that
 * derived a different set would disagree with the gate rather than pre-empt it.
 */
export function toolSecretNames(tool: PackageToolBody): string[] {
  if (tool.tool_type === "code") return [...new Set(tool.declared_secrets ?? [])].sort();
  if (tool.tool_type !== "api_request") return [];

  const config = (tool.config ?? {}) as Record<string, unknown>;
  const auth = (config.auth ?? {}) as Record<string, unknown>;
  const names = new Set<string>();
  if ((auth.type === "bearer" || auth.type === "hmac") && typeof auth.secret_name === "string") {
    names.add(auth.secret_name);
  }
  for (const header of (config.headers ?? []) as Record<string, unknown>[]) {
    if (header && typeof header.secret_name === "string") names.add(header.secret_name);
  }
  return [...names].sort();
}

// `{{$NAME}}` — a Vault token in prompt text. The `$` is what distinguishes it
// from `{{customer_name}}`, which is a template variable resolved per session.
const VAULT_TOKEN = /\{\{\s*\$([A-Za-z_][A-Za-z0-9_]*)\s*\}\}/g;

/** Vault names referenced by tokens in the agent's own text. */
export function promptSecretNames(agent: CompiledAgent): string[] {
  const names = new Set<string>();
  for (const field of [agent.system_prompt, agent.greeting]) {
    if (typeof field !== "string") continue;
    for (const m of field.matchAll(VAULT_TOKEN)) if (m[1]) names.add(m[1]);
  }
  return [...names].sort();
}

/** Every vault name the package depends on, from tool bodies and prompt text. */
export function requiredSecretNames(pkg: LoadedPackage): string[] {
  const names = new Set<string>(promptSecretNames(pkg.agent));
  for (const tool of pkg.tools) for (const n of toolSecretNames(tool)) names.add(n);
  return [...names].sort();
}

// --- tool classification ---------------------------------------------------

/**
 * Tool types that cannot publish until one successful run sets `proven_hash`.
 *
 * Context-bound types (end_call, transfer, send_sms, voicemail_detection) gate
 * on config_valid alone and never execute, so they publish without a sample.
 * These two do not, which is what makes a missing sample a blocker rather than
 * a detail — see research D4/D7.
 */
const GREEN_RUN_TYPES = new Set(["code", "api_request"]);

export function needsGreenRun(tool: PackageToolBody): boolean {
  return GREEN_RUN_TYPES.has(tool.tool_type);
}

/**
 * Types the platform allows exactly ONE of per organisation
 * (app/schemas/tool.py: MANAGED_SINGLETON_TYPES).
 *
 * This is load-bearing, and it bites silently. `POST /v1/agents/tools` for one
 * of these does NOT create a tool when the organisation already has one — it
 * returns the existing instance, ignoring the name in the request. Publishing
 * that result then mints a version of a tool the operator never meant to touch,
 * one that other agents may already reference. Publish is content-addressed, so
 * identical content returns the existing version and hides the problem; a
 * one-character difference does not.
 *
 * push therefore refuses to ship a body for one of these when the organisation
 * already has it, rather than adopting and republishing shared state.
 */
export const MANAGED_SINGLETON_TYPES = new Set(["send_sms", "transfer_call", "end_call"]);

export function isManagedSingleton(tool: PackageToolBody): boolean {
  return MANAGED_SINGLETON_TYPES.has(tool.tool_type);
}
