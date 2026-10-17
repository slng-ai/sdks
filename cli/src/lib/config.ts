// Persistent config at ~/.config/voiceai/config.json. Env vars win over file.
// Don't write secrets through the SDK; the CLI is the user's local agent.

import {
  chmodSync,
  copyFileSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
  existsSync,
} from "node:fs";
import { homedir, tmpdir } from "node:os";
import { join } from "node:path";

// The 13 API regions listed at docs.slng.ai "Region availability". Each has a
// gateway at https://<region>.api.slng.ai, and a key works at exactly one.
// LiveKit Cloud's agent regions have no gateway, so they are not here.
// ponytail: fixed list, it drifts when regions are added or retired.
// Replace with a backend route that returns a key's region once one exists.
export const REGIONS = [
  "eu-north", "eu-west", "us-east", "us-west", "au", "br", "gb", "id", "il", "in", "jp", "sg", "za",
] as const;
export type Region = (typeof REGIONS)[number];

export function isRegion(v: string): v is Region {
  return (REGIONS as readonly string[]).includes(v);
}

/** The gateway URL for a region code. Throws, naming the valid codes, for anything else. */
export function gatewayUrl(region: string): string {
  if (!isRegion(region)) throw new Error(`unknown region "${region}". use one of: ${REGIONS.join(", ")}`);
  return `https://${region}.api.slng.ai`;
}

/** The region code of a gateway URL, or undefined for any other host. */
export function regionOf(baseUrl: string | undefined): Region | undefined {
  const host = baseUrl ? URL.parse(baseUrl)?.hostname : undefined;
  const code = host?.endsWith(".api.slng.ai") ? host.slice(0, -".api.slng.ai".length) : undefined;
  return code && isRegion(code) ? code : undefined;
}

export type SttMode = "mic" | "file";

// Per-profile, on-disk fields plus the resolved flat shape callers consume.
export interface ProfileConfig {
  apiKey?: string;
  baseUrl?: string;
  // Base URL for the Voice Agents API (`voiceai agents …`). Distinct host from baseUrl.
  agentsBaseUrl?: string;
  /** API region, e.g. eu-west. Older profiles may hold a retired code here (see apiBaseUrl). */
  region?: string;
  defaultTtsModel?: string;
  defaultTtsVoice?: string;
  defaultSttModel?: string;
  defaultSttMode?: SttMode;
  defaultSttInput?: string;
}

// Resolved config — what the rest of the CLI sees. Same field shape as ProfileConfig
// today, kept as a distinct type so we can extend either side independently.
export type Config = ProfileConfig;

export interface ConfigFile {
  currentProfile?: string;
  profiles?: Record<string, ProfileConfig>;
}

export const DEFAULT_PROFILE = "default";

// Resolved on each use, not at import, so a test that sets HOME is honoured
// whichever module imported this one first.
// Bun's homedir() ignores a HOME changed at runtime, so read the env first.
const home = () => process.env.HOME || homedir();
const configDir = () => join(home(), ".config", "voiceai");
const configPath = () => join(configDir(), "config.json");
const legacyConfigDir = () => join(home(), ".config", "slng");
const legacyConfigPath = () => join(legacyConfigDir(), "config.json");

// Set by `flags.ts` when --profile is passed at the CLI. load() reads it
// after VOICEAI_PROFILE env var. Module-level so each command call site stays
// uncluttered.
let activeProfileOverride: string | undefined;

export function setActiveProfile(name: string | undefined): void {
  activeProfileOverride = name && name.length > 0 ? name : undefined;
}

let migrationChecked = false;
function migrateLegacy(): void {
  if (migrationChecked) return;
  migrationChecked = true;

  // Step 1: copy from legacy ~/.config/slng/ if our dir is empty.
  if (!existsSync(configPath()) && existsSync(legacyConfigPath())) {
    mkdirSync(configDir(), { recursive: true });
    copyFileSync(legacyConfigPath(), configPath());
    process.stderr.write(
      `migrated config from ${legacyConfigPath()} → ${configPath()}\n`,
    );
  }

  // Step 2: reshape flat single-profile config into the profiles map.
  if (!existsSync(configPath())) return;
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(configPath(), "utf8"));
  } catch {
    return; // corrupt file — leave it alone, load() treats it as empty
  }
  if (!parsed || typeof parsed !== "object") return;
  const obj = parsed as Record<string, unknown>;
  if (obj.profiles && typeof obj.profiles === "object") return; // already migrated

  const profile: ProfileConfig = {};
  for (const key of [
    "apiKey",
    "baseUrl",
    "agentsBaseUrl",
    "region",
    "defaultTtsModel",
    "defaultTtsVoice",
    "defaultSttModel",
    "defaultSttMode",
    "defaultSttInput",
  ] as const) {
    const v = obj[key];
    if (typeof v === "string") (profile as Record<string, string>)[key] = v;
  }
  const reshaped: ConfigFile = {
    currentProfile: DEFAULT_PROFILE,
    profiles: { [DEFAULT_PROFILE]: profile },
  };
  writeConfigFile(reshaped);
  process.stderr.write(
    `migrated config to profile layout (profile: ${DEFAULT_PROFILE})\n`,
  );
}

function readConfigFile(): ConfigFile {
  if (!existsSync(configPath())) return {};
  try {
    const parsed = JSON.parse(readFileSync(configPath(), "utf8")) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as ConfigFile;
  } catch {
    return {};
  }
}

function writeConfigFile(file: ConfigFile): void {
  mkdirSync(configDir(), { recursive: true });
  writeFileSync(configPath(), JSON.stringify(file, null, 2));
  try {
    chmodSync(configPath(), 0o600);
  } catch {
    // chmod failures shouldn't kill the CLI on exotic filesystems.
  }
}

// Resolve which profile name a load/save should target.
// Precedence: explicit arg > --profile flag > VOICEAI_PROFILE env > file.currentProfile > "default".
export function resolveProfileName(
  file: ConfigFile,
  explicit?: string,
): string {
  if (explicit && explicit.length > 0) return explicit;
  if (activeProfileOverride) return activeProfileOverride;
  const env = process.env.VOICEAI_PROFILE;
  if (env && env.length > 0) return env;
  if (file.currentProfile && file.currentProfile.length > 0) {
    return file.currentProfile;
  }
  return DEFAULT_PROFILE;
}

export function activeProfileName(explicit?: string): string {
  migrateLegacy();
  return resolveProfileName(readConfigFile(), explicit);
}

export function listProfiles(): string[] {
  migrateLegacy();
  const file = readConfigFile();
  return Object.keys(file.profiles ?? {}).sort();
}

export function currentProfile(): string {
  migrateLegacy();
  return resolveProfileName(readConfigFile());
}

export function profileExists(name: string): boolean {
  migrateLegacy();
  const file = readConfigFile();
  return Boolean(file.profiles && file.profiles[name]);
}

/** Resolve a profile to its on-disk values, before env overrides. */
function readProfile(name: string): ProfileConfig {
  const file = readConfigFile();
  return file.profiles?.[name] ?? {};
}

/**
 * The key from the environment. VOICEAI_API_KEY wins, because callers such as
 * unmute set it on purpose; SLNG_API_KEY is the name the SDK and docs use.
 */
export function envApiKey(): string | undefined {
  return process.env.VOICEAI_API_KEY ?? process.env.SLNG_API_KEY;
}

/**
 * The project that runtime calls (tts, stt) are billed and limited under:
 * the --project flag, then SLNG_PROJECT_ID. Sent as X-SLNG-Project-Id.
 * Undefined sends no header. Agent commands take the project from the URL.
 */
export function resolveProjectId(flag?: string): string | undefined {
  return flag || process.env.SLNG_PROJECT_ID || undefined;
}

/**
 * Load the active config (selected profile flattened + env overrides applied).
 * If `profile` is provided it overrides every other source for this call only.
 */
export function load(profile?: string): Config {
  migrateLegacy();
  const file = readConfigFile();
  const name = resolveProfileName(file, profile);
  const fromFile = file.profiles?.[name] ?? {};
  return {
    ...fromFile,
    apiKey: envApiKey() ?? fromFile.apiKey,
    baseUrl: process.env.VOICEAI_BASE_URL ?? fromFile.baseUrl,
    region: process.env.VOICEAI_REGION || fromFile.region,
    agentsBaseUrl: process.env.VOICEAI_AGENTS_BASE_URL ?? fromFile.agentsBaseUrl,
  };
}

/** Profile region codes from before the 13 API regions. Nothing ever read them. */
const RETIRED_REGIONS = new Set(["us-east-1", "eu-north-1", "ap-southeast-2"]);
let warnedRetired = false;

/**
 * The main-API base URL the user chose, or undefined to find it from the key.
 * Env beats profile; within each, a full base URL beats a region:
 * VOICEAI_BASE_URL, then `override` (--region) or VOICEAI_REGION, then the
 * profile's baseUrl, then the profile's region. An unknown region throws.
 */
export function apiBaseUrl(override?: string): string | undefined {
  if (process.env.VOICEAI_BASE_URL) return process.env.VOICEAI_BASE_URL;
  const chosen = override ?? process.env.VOICEAI_REGION;
  if (chosen) return gatewayUrl(chosen);
  const cfg = load();
  if (cfg.baseUrl) return cfg.baseUrl;
  if (!cfg.region) return undefined;
  if (RETIRED_REGIONS.has(cfg.region)) {
    if (!warnedRetired) {
      process.stderr.write(`note: ignoring old region "${cfg.region}"; set one with \`voiceai config set region <code>\`.\n`);
      warnedRetired = true;
    }
    return undefined;
  }
  return gatewayUrl(cfg.region);
}

export interface SaveOptions {
  profile?: string;
}

/**
 * Persist updates into the targeted profile (default: current). Returns the
 * resolved (post-env) config for the updated profile so callers can echo it.
 */
export function save(updates: Partial<ProfileConfig>, opts: SaveOptions = {}): Config {
  migrateLegacy();
  const file = readConfigFile();
  const name = resolveProfileName(file, opts.profile);
  const profiles = { ...(file.profiles ?? {}) };
  const current = profiles[name] ?? {};
  const merged: ProfileConfig = { ...current };
  for (const [k, v] of Object.entries(updates) as [keyof ProfileConfig, unknown][]) {
    if (v === undefined || v === "") {
      delete (merged as Record<string, unknown>)[k as string];
    } else {
      (merged as Record<string, unknown>)[k as string] = v;
    }
  }
  profiles[name] = merged;
  const nextFile: ConfigFile = {
    currentProfile: file.currentProfile ?? name,
    profiles,
  };
  writeConfigFile(nextFile);
  return {
    ...merged,
    apiKey: envApiKey() ?? merged.apiKey,
    baseUrl: process.env.VOICEAI_BASE_URL ?? merged.baseUrl,
    region: process.env.VOICEAI_REGION || merged.region,
    agentsBaseUrl: process.env.VOICEAI_AGENTS_BASE_URL ?? merged.agentsBaseUrl,
  };
}

/** Set the persistent default profile. Errors if the profile doesn't exist. */
export function useProfile(name: string): void {
  migrateLegacy();
  const file = readConfigFile();
  if (!file.profiles || !file.profiles[name]) {
    const available = Object.keys(file.profiles ?? {}).sort().join(", ") || "(none)";
    throw new Error(`profile "${name}" not found. Available: ${available}`);
  }
  writeConfigFile({ ...file, currentProfile: name });
}

/** Create a brand-new profile. Errors if it already exists. */
export function addProfile(name: string, values: ProfileConfig): void {
  migrateLegacy();
  const file = readConfigFile();
  const profiles = { ...(file.profiles ?? {}) };
  if (profiles[name]) {
    throw new Error(`profile "${name}" already exists. Use \`config set --profile ${name}\` to update it.`);
  }
  profiles[name] = values;
  writeConfigFile({
    currentProfile: file.currentProfile ?? name,
    profiles,
  });
}

/** Remove a profile. Caller is responsible for confirming if it's the current one. */
export function removeProfile(name: string): void {
  migrateLegacy();
  const file = readConfigFile();
  const profiles = { ...(file.profiles ?? {}) };
  if (!profiles[name]) {
    throw new Error(`profile "${name}" not found.`);
  }
  delete profiles[name];
  let nextCurrent = file.currentProfile;
  if (nextCurrent === name) {
    nextCurrent = profiles[DEFAULT_PROFILE] ? DEFAULT_PROFILE : Object.keys(profiles)[0];
  }
  writeConfigFile({ currentProfile: nextCurrent, profiles });
}

export interface ResetResult {
  removed: string[];
  skipped: string[];
}

/**
 * Remove persisted CLI state. By default clears both the active config dir
 * and the legacy `~/.config/slng/` dir (which `load()` auto-migrates from).
 * Pass `all: true` to also clear the `$TMPDIR/voiceai-tts/` replay cache.
 */
export function reset({ all = false }: { all?: boolean } = {}): ResetResult {
  const targets = [configDir(), legacyConfigDir()];
  if (all) targets.push(join(tmpdir(), "voiceai-tts"));

  const removed: string[] = [];
  const skipped: string[] = [];
  for (const path of targets) {
    if (existsSync(path)) {
      rmSync(path, { recursive: true, force: true });
      removed.push(path);
    } else {
      skipped.push(path);
    }
  }
  // Force re-migration on next load() in this process (after reset, the file is gone).
  migrationChecked = false;
  return { removed, skipped };
}

export function requireApiKey(profile?: string): string {
  const { apiKey } = load(profile);
  if (!apiKey) {
    throw new Error(
      "no API key set. Run `voiceai login`, `voiceai config set apiKey <token>`, or set SLNG_API_KEY (or VOICEAI_API_KEY) in your env.",
    );
  }
  return apiKey;
}
