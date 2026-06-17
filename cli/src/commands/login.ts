import { Command } from "commander";
import { createInterface } from "node:readline/promises";
import ora from "ora";
import {
  addProfile,
  currentProfile,
  load,
  profileExists,
  save,
  useProfile,
  DEFAULT_PROFILE,
} from "../lib/config";
import { verifyApiKey } from "../lib/verify";

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

        const apiKey = (await rl.question("API key (slng_cu_…): ")).trim();
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

        // Quietly check the key works before we hand back to the prompt.
        const cfg = load(name);
        const spinner = ora({ text: "Checking your key", color: "yellow", spinner: "line" }).start();
        const result = await verifyApiKey(cfg.apiKey ?? apiKey, cfg.baseUrl);
        if (result.ok) {
          const account = result.account ?? {};
          const detail = account.name
            ? ` Signed in as ${account.name}${account.org_name ? `, ${account.org_name}` : ""}.`
            : "";
          spinner.succeed(`Key verified.${detail}`);
        } else if (result.error) {
          spinner.warn("Couldn't reach SLNG to check your key. It's saved; try again when you're back online.");
        } else if (result.status === 401 || result.status === 403) {
          spinner.fail(`That key didn't work. It's saved, but run \`voiceai login --profile ${name}\` again to fix it.`);
          process.exit(1);
        } else {
          spinner.warn(`Couldn't check your key right now (status ${result.status}). It's saved.`);
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
