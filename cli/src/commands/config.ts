import { Command } from "commander";
import { createInterface } from "node:readline/promises";
import { load, reset, save } from "../lib/config";

const CONFIG_EPILOGUE = `
KEYS
  apiKey              Bearer token (zpka_…). Get one at https://app.slng.ai/api-keys.
                      Overridden by VOICEAI_API_KEY env.
  baseUrl             Override the API base URL. Default: https://api.slng.ai.
                      Overridden by VOICEAI_BASE_URL env.
  region              Force a region for every request (auto if unset).
  worldPart           Force a world-part for every request (auto if unset).
  defaultTtsModel     Skip the TTS model picker in the TUI.
  defaultTtsVoice     Skip the TTS voice picker (requires defaultTtsModel).
  defaultSttModel     Skip the STT model picker in the TUI.

EXAMPLES
  $ voiceai config set apiKey zpka_…
  $ voiceai config set defaultTtsModel slng/deepgram/aura:2-en
  $ voiceai config get                                show everything (apiKey masked)
  $ voiceai config reset --force                      wipe ~/.config/voiceai (and legacy slng dir)

  Or open the interactive Settings screen by running \`voiceai\` with no args.
`;

export function configCommand(): Command {
  const cmd = new Command("config")
    .description("Read and write CLI configuration (~/.config/voiceai/config.json)")
    .addHelpText("afterAll", CONFIG_EPILOGUE);

  cmd
    .command("get [key]")
    .description("Print one or all config values (apiKey is masked)")
    .action((key?: string) => {
      const cfg = load();
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
    .description("Persist a config value to ~/.config/voiceai/config.json")
    .action((key: string, value: string) => {
      const merged = save({ [key]: value });
      console.log(`${key} = ${key === "apiKey" ? maskKey(merged.apiKey) : merged[key as keyof typeof merged]}`);
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
