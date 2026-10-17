import { Command } from "commander";
import { decodeToPcm, openTranscriber, STT_SAMPLE_RATE } from "../lib/bridge";
import { recordPcm } from "../lib/audio";
import { load, REGIONS } from "../lib/config";

const STT_EPILOGUE = `
EXAMPLES
  $ voiceai stt audio.wav -m soniox/speech-ai:rt-v5      transcribe a file
  $ voiceai stt --stream                                 live mic → transcripts
  $ arecord -f S16_LE -r 16000 -c 1 | voiceai stt --stream --source stdin
                                                      pipe raw PCM

NOTES
  Everything goes over the bridge WebSocket. A file is decoded to 16 kHz mono
  PCM with sox (or ffmpeg) first. Final transcripts go to stdout, one per line; partial
  ones are shown on stderr.
`;

export function sttCommand(): Command {
  const cfg = load();
  const cmd = new Command("stt");
  cmd
    .description("Transcribe audio (file or live streaming)")
    .argument("[file]", "Audio file to transcribe (omit + use --stream to read mic / stdin)")
    .option(
      "-m, --model <id>",
      "STT model variant (e.g. soniox/speech-ai:rt-v5)",
      cfg.defaultSttModel ?? "deepgram/nova:3",
    )
    .option("--stream", "Stream live audio from the mic or stdin")
    .option("--source <kind>", "When streaming, where to get audio from: mic | stdin", "mic")
    .option("--region <code>", `API region to use (default: found from the key). One of: ${REGIONS.join(", ")}`)
    .option("--project <id>", "Project UUID to bill this call to (default: SLNG_PROJECT_ID). Needed with an org-level API key")
    .addHelpText("afterAll", STT_EPILOGUE)
    .action(async (file: string | undefined, opts) => {
      if (!opts.stream && !file) {
        throw new Error("file required for non-streaming STT (or pass --stream)");
      }
      const stt = await openTranscriber(opts.model, (text, final) => {
        if (final) {
          process.stderr.write("\r\x1b[K");
          process.stdout.write(`${text}\n`);
        } else if (process.stderr.isTTY) {
          process.stderr.write(`\r\x1b[K\x1b[2m${text}\x1b[0m`);
        }
      }, opts.region, opts.project);

      if (!opts.stream) {
        stt.sendAudio(await decodeToPcm(file!));
      } else if (opts.source === "mic") {
        const rec = await recordPcm({ sampleRate: STT_SAMPLE_RATE, channels: 1 });
        process.stderr.write("recording... press Ctrl-C to stop\n");
        process.on("SIGINT", () => rec.stop());
        for await (const frame of rec.frames) stt.sendAudio(frame);
      } else {
        for await (const chunk of process.stdin) stt.sendAudio(chunk as Buffer);
      }
      await stt.end();
    });
  return cmd;
}
