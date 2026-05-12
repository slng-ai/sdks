import { Command } from "commander";
import { voicesFor, languageLabel } from "../lib/models";

export function voicesCommand(): Command {
  return new Command("voices")
    .description("List catalogued voices for a TTS model")
    .requiredOption("-m, --model <id>", "TTS model variant id")
    .option("--json", "Output JSON with full metadata")
    .option("--language <code>", "Filter by language code (e.g. en, es, fr)")
    .addHelpText("afterAll", `
EXAMPLES
  $ voiceai voices --model slng/deepgram/aura:2-en
  $ voiceai voices --model cartesia/sonic:3 --language fr
  $ voiceai voices --model slng/deepgram/aura:2-en --json | jq '.[] | .name'

NOTES
  When calling \`voiceai tts\`, --voice accepts either a voiceId or the friendly
  Name from this list (case-insensitive). Cartesia voices in particular are
  UUIDs — type the readable name instead.
`)
    .action((opts: { model: string; json?: boolean; language?: string }) => {
      let voices = voicesFor(opts.model);
      if (opts.language) voices = voices.filter((v) => v.language === opts.language);
      if (voices.length === 0) {
        console.error(`no known voices catalogued for ${opts.model}${opts.language ? ` in ${opts.language}` : ""}`);
        console.error("(this model's voices may be passed through to the upstream provider — consult their docs)");
        process.exit(1);
      }
      if (opts.json) {
        // JSON keeps the raw 2-letter code for scripting/filtering.
        console.log(JSON.stringify(voices, null, 2));
        return;
      }
      // Human-readable: show the language as a full name.
      for (const v of voices) {
        console.log(
          `${v.voiceId}\t${v.name}\t${v.gender}\t${languageLabel(v.language ?? "")}\t${v.tone}`,
        );
      }
    });
}
