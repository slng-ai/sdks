import { Command, Option } from "commander";
import { formatAgentsError } from "../lib/agents";
import { fetchModelCatalog, flattenCatalog, SERVICE_TYPES, type ListedModel, type ServiceType } from "../lib/model-catalog";
import { printJson } from "../lib/output";

const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

export interface ListFilter {
  type?: ServiceType;
  /** An agent region (eu-central) or a hosting world part (eu-north). */
  region?: string;
  language?: string;
}

export function filterModels(models: ListedModel[], f: ListFilter): ListedModel[] {
  return models.filter(
    (m) =>
      (!f.type || m.type === f.type) &&
      (!f.region || m.regions.some((r) => r.id === f.region || r.hosted_in === f.region)) &&
      (!f.language || m.languages.includes(f.language)),
  );
}

function short(values: string[], max = 4): string {
  if (values.length <= max) return values.join(",") || "-";
  return `${values.slice(0, max).join(",")} +${values.length - max}`;
}

function printTable(models: ListedModel[], color: boolean): void {
  const idWidth = Math.max(2, ...models.map((m) => m.id.length)) + 2;
  const nameWidth = Math.max(4, ...models.map((m) => m.name.length)) + 2;
  console.log(`  ${"TYPE".padEnd(6)}${"ID".padEnd(idWidth)}${"NAME".padEnd(nameWidth)}${"REGIONS".padEnd(24)}LANGUAGES`);
  for (const m of models) {
    const regions = short(m.regions.map((r) => r.id), 3);
    const line = `${m.type.padEnd(6)}${m.id.padEnd(idWidth)}${m.name.padEnd(nameWidth)}${regions.padEnd(24)}${short(m.languages)}`;
    if (!m.slng_hosted) console.log(`  ${line}`);
    else console.log(color ? `${YELLOW}★ ${line}${RESET}` : `★ ${line}`);
  }
}

function listCommand(): Command {
  return new Command("list")
    .description("List the STT, TTS and LLM models your organisation can use, by region (★ = Slng-hosted)")
    .addOption(new Option("--type <type>", "Only one model type").choices([...SERVICE_TYPES]))
    .option("--region <code>", "Agent region (eu-central) or hosting world part (eu-north)")
    .option("--language <code>", "Language code (en, de, …)")
    .option("--json", "Output JSON: { data: [...] }")
    // The old spellings of --type, kept so existing scripts keep working.
    .addOption(new Option("--tts").hideHelp())
    .addOption(new Option("--stt").hideHelp())
    .addHelpText("afterAll", `
EXAMPLES
  $ voiceai models list                                    every model, every region
  $ voiceai models list --type tts --region eu-north       TTS models hosted in or serving eu-north
  $ voiceai models list --type llm --language de --json
  $ voiceai models list --type tts --json | jq '.data[] | {id, voices: [.voices[].id]}'

  Read live from the platform, filtered to what your organisation may select.
  The model ids and voice ids here are the values agent.json takes in
  models.stt, models.llm, models.tts and models.tts_voice.
`)
    .action(async (opts: ListFilter & { json?: boolean; tts?: boolean; stt?: boolean }) => {
      const type = opts.type ?? (opts.tts ? "tts" : opts.stt ? "stt" : undefined);
      const res = await fetchModelCatalog({ service_type: type, language: opts.language });
      if (!res.ok || !res.data) {
        const message = `could not read the model catalog: ${formatAgentsError(res)}`;
        if (opts.json) printJson({ ok: false, error: message });
        else process.stderr.write(`${message}\n`);
        process.exit(1);
      }
      const models = filterModels(flattenCatalog(res.data), { ...opts, type });
      if (opts.json) {
        printJson({ data: models });
        return;
      }
      if (!models.length) {
        process.stderr.write("no models match.\n");
        return;
      }
      printTable(models, process.stdout.isTTY === true);
    });
}

export function modelsCommand(): Command {
  return new Command("models")
    .description("Browse the models your organisation can use")
    .addCommand(listCommand(), { isDefault: true });
}
