import { Command } from "commander";
import { load, save } from "../lib/config";

export function configCommand(): Command {
  const cmd = new Command("config").description("Read and write CLI configuration");

  cmd
    .command("get [key]")
    .description("Print one or all config values")
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
