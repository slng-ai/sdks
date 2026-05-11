import { Command } from "commander";
import { readFileSync, createReadStream } from "node:fs";
import { makeClients } from "../lib/sdk";
import { recordPcm } from "../lib/audio";

export function sttCommand(): Command {
  const cmd = new Command("stt");
  cmd
    .description("Transcribe audio")
    .argument("[file]", "Audio file to transcribe (omit + use --stream to read mic / stdin)")
    .option("-m, --model <id>", "STT model variant (e.g. deepgram/nova:3)", "deepgram/nova:3")
    .option("--stream", "Open a WebSocket and stream audio chunks")
    .option("--source <kind>", "When streaming, where to get audio from: mic | stdin", "mic")
    .action(async (file: string | undefined, opts) => {
      if (opts.stream) {
        await streamTranscribe(opts);
      } else {
        if (!file) {
          throw new Error("file required for non-streaming STT (or pass --stream)");
        }
        await httpTranscribe(file, opts);
      }
    });
  return cmd;
}

async function httpTranscribe(file: string, opts: { model: string }): Promise<void> {
  const { http } = makeClients();
  const bytes = readFileSync(file);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await (http as any).speechToText.create(opts.model, {
    audio: new File([bytes], file, { type: "audio/wav" }),
  });
  console.log(JSON.stringify(response, null, 2));
}

async function streamTranscribe(opts: { model: string; source: string }): Promise<void> {
  const { streaming } = makeClients();
  const session = await streaming.connectStt(opts.model);

  // Read incoming messages in the background.
  (async () => {
    for await (const msg of session) {
      if (msg.type === "partial_transcript" && "text" in msg) {
        process.stderr.write(`\r\x1b[2m${msg.text}\x1b[0m`);
      } else if (msg.type === "final_transcript" && "text" in msg) {
        process.stderr.write("\r\x1b[K");
        process.stdout.write(`${msg.text}\n`);
      } else if (msg.type === "error") {
        process.stderr.write(`\nerror: ${JSON.stringify(msg)}\n`);
      }
    }
  })();

  // Init session.
  session.send({ type: "init" });

  if (opts.source === "mic") {
    const rec = await recordPcm({ sampleRate: 16000, channels: 1 });
    process.stderr.write("recording... press Ctrl-C to stop\n");
    process.on("SIGINT", () => {
      rec.stop();
      session.send({ type: "finalize" });
      session.close();
      process.exit(0);
    });
    for await (const frame of rec.frames) {
      session.sendAudio(frame);
    }
  } else {
    // stdin: read raw PCM
    const reader = process.stdin;
    reader.on("data", (chunk: Buffer) => session.sendAudio(chunk));
    reader.on("end", () => {
      session.send({ type: "finalize" });
      session.close();
    });
  }
}
