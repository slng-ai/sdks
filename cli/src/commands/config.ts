import { Command } from "commander";
import { load, save } from "../lib/config";

const CONFIG_EPILOGUE = `
KEYS
  apiKey              Bearer token (zpka_…). Get one at https://app.slng.ai/api-keys.
                      Overridden by SLNG_API_KEY env.
  baseUrl             Override the API base URL. Default: https://api.slng.ai.
                      Overridden by SLNG_BASE_URL env.
  region              Force a region for every request (auto if unset).
  worldPart           Force a world-part for every request (auto if unset).
  defaultTtsModel     Skip the TTS model picker in the TUI.
  defaultTtsVoice     Skip the TTS voice picker (requires defaultTtsModel).
  defaultSttModel     Skip the STT model picker in the TUI.

EXAMPLES
  $ slng config set api-key zpka_…
  $ slng config set defaultTtsModel slng/deepgram/aura:2-en
  $ slng config get                                   show everything (apiKey masked)

  Or open the interactive Settings screen by running \`slng\` with no args.
`;

export function configCommand(): Command {
  const cmd = new Command("config")
    .description("Read and write CLI configuration (~/.config/slng/config.json)")
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
    .description("Persist a config value to ~/.config/slng/config.json")
    .action((key: string, value: string) => {
      const merged = save({ [key]: value });
      console.log(`${key} = ${key === "apiKey" ? maskKey(merged.apiKey) : merged[key as keyof typeof merged]}`);
    });

  return cmd;
}

function maskKey(k?: string): string {
  if (!k) return "(unset)";
  if (k.length < 12) return "********";
  return `${k.slice(0, 8)}...${k.slice(-4)}`;
}
