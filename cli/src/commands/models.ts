import { Command } from "commander";
import { TTS_MODELS, STT_MODELS } from "../lib/models";

export function modelsCommand(): Command {
  return new Command("models")
    .description("List available TTS and STT models")
    .option("--tts", "Show only TTS models")
    .option("--stt", "Show only STT models")
    .option("--json", "Output JSON")
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
      if (showTts) {
        console.log("TTS models:");
        for (const m of TTS_MODELS) console.log(`  ${m.id}`);
      }
      if (showTts && showStt) console.log();
      if (showStt) {
        console.log("STT models:");
        for (const m of STT_MODELS) console.log(`  ${m.id}`);
      }
    });
}
