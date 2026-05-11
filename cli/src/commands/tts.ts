import { Command } from "commander";
import { writeFileSync } from "node:fs";
import ora from "ora";
import { makeClients } from "../lib/sdk";
import { playBytes } from "../lib/audio";

export function ttsCommand(): Command {
  const cmd = new Command("tts");
  cmd
    .description("Synthesize speech (HTTP one-shot)")
    .argument("<text>", "Text to synthesize")
    .option("-m, --model <id>", "TTS model variant (e.g. slng/deepgram/aura:2-en)", "slng/deepgram/aura:2-en")
    .option("-v, --voice <name>", "Voice id passed through to the upstream provider", "aura-2-thalia-en")
    .option("-o, --out <file>", "Write audio to file instead of playing it")
    .option("--region <region>", "Force region: us-east-1 | eu-north-1 | ap-southeast-2")
    .option("--world-part <wp>", "Force world part: na | eu | ap")
    .action(async (text: string, opts) => {
      const { http } = makeClients();
      const params: Record<string, unknown> = { text, voice: opts.voice };
      if (opts.region) params.region = opts.region;
      if (opts.worldPart) params["world-part"] = opts.worldPart;

      // Show a spinner only when stderr is interactive (don't pollute pipes/CI).
      const spinner = process.stderr.isTTY
        ? ora({ stream: process.stderr, text: `synthesizing with ${opts.model} · ${opts.voice}` }).start()
        : null;

      let bytes: Uint8Array;
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await (http as any).textToSpeech.create(opts.model, params);
        const blob = await response.blob();
        bytes = new Uint8Array(await blob.arrayBuffer());
        spinner?.succeed(`got ${bytes.length} bytes (${blob.type})`);
      } catch (e) {
        spinner?.fail(`synthesis failed: ${(e as Error).message}`);
        throw e;
      }

      if (opts.out) {
        writeFileSync(opts.out, bytes);
        process.stderr.write(`wrote to ${opts.out}\n`);
      } else if (process.stdout.isTTY) {
        const playing = process.stderr.isTTY
          ? ora({ stream: process.stderr, text: "playing…" }).start()
          : null;
        try {
          await playBytes(bytes);
          playing?.stop();
        } catch (e) {
          playing?.fail((e as Error).message);
          throw e;
        }
      } else {
        process.stdout.write(bytes);
      }
    });
  return cmd;
}
