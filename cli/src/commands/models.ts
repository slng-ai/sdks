import { Command } from "commander";
import { TTS_MODELS, STT_MODELS, isSlngHosted, type TtsModel, type SttModel } from "../lib/models";

const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

function format(m: TtsModel | SttModel, color: boolean): string {
  const display = m.name ? `${m.name} (${m.id})` : m.id;
  if (isSlngHosted(m.id)) {
    return color ? `${YELLOW}★ ${display}${RESET}` : `★ ${display}`;
  }
  return `  ${display}`;
}

export function modelsCommand(): Command {
  return new Command("models")
    .description("List currently-deployed TTS and STT models (★ = Slng-hosted)")
    .option("--tts", "Show only TTS models")
    .option("--stt", "Show only STT models")
    .option("--json", "Output JSON with full metadata")
    .addHelpText("afterAll", `
EXAMPLES
  $ slng models                                       both TTS and STT
  $ slng models --tts                                 just TTS
  $ slng models --json | jq '.tts[] | .id'            scriptable

  Models are sourced from Slng's deployed-model registry; running with no
  deployments hides ghost variants that return 503.
`)
    .action((opts) => {
      const showTts = opts.tts || !opts.stt;
      const showStt = opts.stt || !opts.tts;
      if (opts.json) {
        console.log(JSON.stringify({
          tts: showTts ? TTS_MODELS : undefined,
          stt: showStt ? STT_MODELS : undefined,
        }, null, 2));
        return;
      }
      const color = process.stdout.isTTY === true;
      if (showTts) {
        console.log("TTS models:");
        for (const m of TTS_MODELS) console.log(format(m, color));
      }
      if (showTts && showStt) console.log();
      if (showStt) {
        console.log("STT models:");
        for (const m of STT_MODELS) console.log(format(m, color));
      }
    });
}
