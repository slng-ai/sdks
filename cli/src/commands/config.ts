import { Command } from "commander";
import { createInterface } from "node:readline/promises";
import {
  addProfile,
  currentProfile,
  listProfiles,
  load,
  profileExists,
  removeProfile,
  reset,
  save,
  useProfile,
  DEFAULT_PROFILE,
} from "../lib/config";

const CONFIG_EPILOGUE = `
KEYS
  apiKey              Bearer token (slng_cu_…). Get one at https://app.slng.ai/api-keys.
                      Overridden by VOICEAI_API_KEY env.
  baseUrl             Override the API base URL. Default: https://api.slng.ai.
                      Overridden by VOICEAI_BASE_URL env.
  region              Force a region for every request (auto if unset).
  worldPart           Force a world-part for every request (auto if unset).
  defaultTtsModel     Skip the TTS model picker in the TUI.
  defaultTtsVoice     Skip the TTS voice picker (requires defaultTtsModel).
  defaultSttModel     Skip the STT model picker in the TUI.

PROFILES
  Each profile is a named set of credentials and settings, stored together in
  ~/.config/voiceai/config.json. Switch the persistent default with
  \`voiceai config use <name>\` or override per command with --profile.

EXAMPLES
  $ voiceai config set apiKey slng_cu_…                  write to the current profile
  $ voiceai config set --profile work apiKey slng_cu_…   write to a specific profile
  $ voiceai config profiles                           list profiles, * marks the current one
  $ voiceai config use work                           set persistent default to "work"
  $ voiceai config add staging                        interactive add (use \`voiceai login\` instead)
  $ voiceai config remove staging                     delete a profile
  $ voiceai config get                                show the current profile (apiKey masked)
  $ voiceai config reset --force                      wipe ~/.config/voiceai (and legacy slng dir)
`;

interface WithProfileOpts {
  profile?: string;
}

export function configCommand(): Command {
  const cmd = new Command("config")
    .description("Read and write CLI configuration (~/.config/voiceai/config.json)")
    .addHelpText("afterAll", CONFIG_EPILOGUE);

  cmd
    .command("get [key]")
    .description("Print one or all config values for a profile (apiKey is masked)")
    .option("--profile <name>", "Read from a specific profile (default: current)")
    .action((key: string | undefined, opts: WithProfileOpts) => {
      const cfg = load(opts.profile);
      if (!key) {
        console.log(JSON.stringify({ ...cfg, apiKey: maskKey(cfg.apiKey) }, null, 2));
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const value = (cfg as any)[key];
      console.log(value === undefined ? "" : String(value));
    });

  cmd
    .command("set <key> <value>")
    .description("Persist a config value (default: into the current profile)")
    .option("--profile <name>", "Write to a specific profile (default: current)")
    .action((key: string, value: string, opts: WithProfileOpts) => {
      const merged = save({ [key]: value }, { profile: opts.profile });
      const echoed = key === "apiKey" ? maskKey(merged.apiKey) : (merged as Record<string, unknown>)[key];
      console.log(`${key} = ${echoed} (profile: ${opts.profile ?? currentProfile()})`);
    });

  cmd
    .command("profiles")
    .alias("list")
    .description("List configured profiles (marks the current one with *)")
    .action(() => {
      const names = listProfiles();
      const active = currentProfile();
      if (names.length === 0) {
        console.log("(no profiles yet — run `voiceai login` to create one)");
        return;
      }
      for (const name of names) {
        console.log(`${name === active ? "*" : " "} ${name}`);
      }
    });

  cmd
    .command("use <name>")
    .description("Set the persistent default profile")
    .action((name: string) => {
      useProfile(name);
      console.log(`current profile: ${name}`);
    });

  cmd
    .command("add <name>")
    .description("Create a new profile interactively (prompts for apiKey and optional baseUrl)")
    .option("-f, --force", "overwrite if a profile with this name already exists")
    .action(async (name: string, opts: { force?: boolean }) => {
      if (profileExists(name) && !opts.force) {
        console.error(`profile "${name}" already exists. Pass --force to overwrite, or \`config set --profile ${name}\` to update fields.`);
        process.exit(1);
      }
      if (!process.stdin.isTTY) {
        console.error("voiceai config add: refusing to prompt non-interactively. Use `config set --profile <name> apiKey <token>` instead.");
        process.exit(1);
      }
      const rl = createInterface({ input: process.stdin, output: process.stdout });
      try {
        const apiKey = (await rl.question("API key: ")).trim();
        if (!apiKey) {
          console.error("aborted: no API key provided.");
          process.exit(1);
        }
        const baseUrl = (await rl.question("Base URL (optional, press enter to skip): ")).trim();
        if (opts.force && profileExists(name)) removeProfile(name);
        addProfile(name, { apiKey, ...(baseUrl ? { baseUrl } : {}) });
        console.log(`added profile "${name}". Use \`voiceai config use ${name}\` to make it the default.`);
      } finally {
        rl.close();
      }
    });

  cmd
    .command("remove <name>")
    .alias("rm")
    .description("Delete a profile")
    .option("-f, --force", "delete even if it's the current profile")
    .action((name: string, opts: { force?: boolean }) => {
      if (!profileExists(name)) {
        console.error(`profile "${name}" not found.`);
        process.exit(1);
      }
      const active = currentProfile();
      if (name === active && !opts.force) {
        console.error(`refusing to remove the current profile ("${name}"). Switch with \`voiceai config use <other>\` first, or pass --force.`);
        process.exit(1);
      }
      removeProfile(name);
      const newCurrent = currentProfile();
      console.log(`removed profile "${name}".`);
      if (name === active) {
        console.log(`current profile is now: ${newCurrent}${profileExists(newCurrent) ? "" : " (no profiles remain)"}`);
      }
    });

  cmd
    .command("reset")
    .description("Remove persisted config (~/.config/voiceai and legacy ~/.config/slng)")
    .option("-f, --force", "skip the confirmation prompt")
    .option("--all", "also clear the $TMPDIR/voiceai-tts replay cache")
    .action(async (opts: { force?: boolean; all?: boolean }) => {
      if (!opts.force) {
        if (!process.stdin.isTTY) {
          console.error("voiceai config reset: refusing to run non-interactively. Pass --force to confirm.");
          process.exit(1);
        }
        const rl = createInterface({ input: process.stdin, output: process.stdout });
        const answer = (await rl.question("Remove ~/.config/voiceai/ and ~/.config/slng/? [y/N] ")).trim().toLowerCase();
        rl.close();
        if (answer !== "y" && answer !== "yes") {
          console.log("aborted.");
          return;
        }
      }

      const result = reset({ all: opts.all });
      for (const p of result.removed) console.log(`removed: ${p}`);
      for (const p of result.skipped) console.log(`skipped (not present): ${p}`);
      if (process.env.VOICEAI_API_KEY) {
        console.log("\nnote: VOICEAI_API_KEY is set in your env — `unset VOICEAI_API_KEY` to see the first-run prompt.");
      }
    });

  return cmd;
}

function maskKey(k?: string): string {
  if (!k) return "(unset)";
  if (k.length < 12) return "********";
  return `${k.slice(0, 8)}...${k.slice(-4)}`;
}

// Re-export so other modules can keep the same import surface.
export { DEFAULT_PROFILE };
