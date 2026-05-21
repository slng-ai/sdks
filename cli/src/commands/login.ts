import { Command } from "commander";
import { createInterface } from "node:readline/promises";
import {
  addProfile,
  currentProfile,
  load,
  profileExists,
  save,
  useProfile,
  DEFAULT_PROFILE,
} from "../lib/config";

const DEFAULT_AGENTS_BASE_URL = "https://api.agents.slng.ai";

export function loginCommand(): Command {
  return new Command("login")
    .description("Interactively add or update a credential profile and verify the key")
    .option("--profile <name>", "Profile name to create or update (default: prompts)")
    .option("--no-verify", "Skip the auth probe after saving")
    .addHelpText("afterAll", `
EXAMPLES
  $ voiceai login                            create or update the default profile
  $ voiceai login --profile work             target a specific profile
`)
    .action(async (opts: { profile?: string; verify?: boolean }) => {
      if (!process.stdin.isTTY) {
        console.error("voiceai login: refusing to run non-interactively. Use `config set apiKey <token>` or set VOICEAI_API_KEY instead.");
        process.exit(1);
      }

      const rl = createInterface({ input: process.stdin, output: process.stdout });
      try {
        const promptedName = opts.profile
          ? opts.profile
          : (await rl.question(`Profile name [${DEFAULT_PROFILE}]: `)).trim();
        const name = promptedName || DEFAULT_PROFILE;

        const existing = profileExists(name);
        if (existing) {
          console.log(`updating existing profile "${name}".`);
        } else {
          console.log(`creating new profile "${name}".`);
        }

        const apiKey = (await rl.question("API key (zpka_…): ")).trim();
        if (!apiKey) {
          console.error("aborted: no API key provided.");
          process.exit(1);
        }
        const baseUrl = (await rl.question("Base URL (optional, press enter to skip): ")).trim();

        if (existing) {
          save({ apiKey, ...(baseUrl ? { baseUrl } : {}) }, { profile: name });
        } else {
          addProfile(name, { apiKey, ...(baseUrl ? { baseUrl } : {}) });
        }
        useProfile(name);
        console.log(`saved. current profile: ${name}`);

        if (opts.verify === false) return;

        // Verify with the same /v1/agents probe whoami uses.
        const cfg = load(name);
        const agentsBase = process.env.VOICEAI_AGENTS_BASE_URL ?? DEFAULT_AGENTS_BASE_URL;
        const url = `${agentsBase}/v1/agents`;
        try {
          const res = await fetch(url, { headers: { Authorization: `Bearer ${cfg.apiKey ?? apiKey}` } });
          if (res.status === 200) {
            console.log(`verified: key works against ${agentsBase}.`);
          } else if (res.status === 401) {
            console.error(`warning: key was saved but failed auth (401). Run \`voiceai login --profile ${name}\` again to fix.`);
            process.exit(1);
          } else {
            console.error(`warning: unexpected status ${res.status} ${res.statusText} from ${agentsBase}.`);
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          console.error(`warning: could not verify key (${message}). It was still saved.`);
        }

        if (currentProfile() !== name) {
          // Defensive — useProfile should already have set this.
          console.log(`hint: \`voiceai config use ${name}\` to make this the default.`);
        }
      } finally {
        rl.close();
      }
    });
}
