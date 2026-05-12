// Persistent config at ~/.config/voiceai/config.json. Env vars win over file.
// Don't write secrets through the SDK; the CLI is the user's local agent.

import { copyFileSync, mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

export type Region = "us-east-1" | "eu-north-1" | "ap-southeast-2";
export type WorldPart = "na" | "eu" | "ap";

export type SttMode = "mic" | "file";

export interface Config {
  apiKey?: string;
  baseUrl?: string;
  region?: Region;
  worldPart?: WorldPart;
  defaultTtsModel?: string;
  defaultTtsVoice?: string;
  defaultSttModel?: string;
  defaultSttMode?: SttMode;
  defaultSttInput?: string;
}

const CONFIG_DIR = join(homedir(), ".config", "voiceai");
const CONFIG_PATH = join(CONFIG_DIR, "config.json");
const LEGACY_CONFIG_DIR = join(homedir(), ".config", "slng");
const LEGACY_CONFIG_PATH = join(LEGACY_CONFIG_DIR, "config.json");

let migrationChecked = false;
function migrateLegacy(): void {
  if (migrationChecked) return;
  migrationChecked = true;
  if (existsSync(CONFIG_PATH)) return;
  if (!existsSync(LEGACY_CONFIG_PATH)) return;
  mkdirSync(CONFIG_DIR, { recursive: true });
  copyFileSync(LEGACY_CONFIG_PATH, CONFIG_PATH);
  process.stderr.write(
    `migrated config from ${LEGACY_CONFIG_PATH} → ${CONFIG_PATH}\n`,
  );
}

export function load(): Config {
  migrateLegacy();
  let file: Config = {};
  if (existsSync(CONFIG_PATH)) {
    try {
      file = JSON.parse(readFileSync(CONFIG_PATH, "utf8")) as Config;
    } catch {
      // ignore — corrupt config, treat as empty
    }
  }
  // Env vars override file.
  return {
    ...file,
    apiKey: process.env.VOICEAI_API_KEY ?? file.apiKey,
    baseUrl: process.env.VOICEAI_BASE_URL ?? file.baseUrl,
  };
}

export function save(updates: Partial<Config>): Config {
  migrateLegacy();
  mkdirSync(CONFIG_DIR, { recursive: true });
  const current: Config = existsSync(CONFIG_PATH)
    ? (JSON.parse(readFileSync(CONFIG_PATH, "utf8")) as Config)
    : {};
  const merged: Config = { ...current, ...updates };
  writeFileSync(CONFIG_PATH, JSON.stringify(merged, null, 2));
  return merged;
}

export function requireApiKey(): string {
  const { apiKey } = load();
  if (!apiKey) {
    throw new Error(
      "no VOICEAI_API_KEY set. Run `voiceai config set api-key <token>` or set VOICEAI_API_KEY in your env.",
    );
  }
  return apiKey;
}
