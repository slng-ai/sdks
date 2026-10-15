import { Command } from "commander";
import { formatAgentsError } from "../lib/agents";
import { fetchModelCatalog, flattenCatalog } from "../lib/model-catalog";
import { languageLabel } from "../lib/models";
import { printJson } from "../lib/output";

export function voicesCommand(): Command {
  return new Command("voices")
    .description("List a TTS model's voices from the live catalog")
    .requiredOption("-m, --model <id>", "TTS model variant id")
    .option("--json", "Output JSON")
    .option("--language <code>", "Filter by language code (e.g. en, es, fr)")
    .option("--region <code>", "Agent region or hosting world part (e.g. eu-west)")
    .addHelpText("afterAll", `
EXAMPLES
  $ voiceai voices --model slng/fish/tts:s2.1-pro
  $ voiceai voices --model cartesia/sonic:3 --language fr --region eu-west
  $ voiceai voices --model deepgram/aura:2 --json | jq '.[] | .name'

NOTES
  The list is what your organisation may select, read from the same catalog
  the dashboard uses. The ids go in agent.json's models.tts_voice.
`)
    .action(async (opts: { model: string; json?: boolean; language?: string; region?: string }) => {
      const res = await fetchModelCatalog({ service_type: "tts", language: opts.language });
      if (!res.ok || !res.data) {
        console.error(`could not read the model catalog: ${formatAgentsError(res)}`);
        process.exit(1);
      }
      const model = flattenCatalog(res.data).find(
        (m) =>
          m.id === opts.model &&
          (!opts.region || m.regions.some((r) => r.id === opts.region || r.hosted_in === opts.region)),
      );
      const voices = (model?.voices ?? []).filter((v) => !opts.language || v.languages.includes(opts.language));
      if (voices.length === 0) {
        const where = [opts.language && `in ${opts.language}`, opts.region && `in ${opts.region}`].filter(Boolean).join(" ");
        console.error(`no voices for ${opts.model}${where ? ` ${where}` : ""}. see \`voiceai models list --type tts\`.`);
        process.exit(1);
      }
      if (opts.json) {
        printJson(voices);
        return;
      }
      for (const v of voices) {
        console.log(`${v.id}\t${v.name ?? ""}\t${v.languages.map(languageLabel).join(", ")}`);
      }
    });
}
