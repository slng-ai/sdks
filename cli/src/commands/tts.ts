import { Command } from "commander";
import { mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import ora from "ora";
import { makeClients } from "../lib/sdk";
import { playBytes, sniffExt } from "../lib/audio";
import { resolveVoice } from "../lib/voice-resolve";
import { allRegions, allWorldParts } from "../lib/models";
import { load } from "../lib/config";

const TTS_EPILOGUE = `
EXAMPLES
  $ voiceai tts "hello"                                  play + auto-save to a temp file
  $ voiceai tts "hi" -m slng/deepgram/aura:2-en -v amalthea
                                                         voice resolved by name → voiceId
  $ voiceai tts "save me" --out ~/voice.mp3              save to a specific file (also plays)
  $ voiceai tts "binary" > out.mp3                       pipe raw audio when stdout isn't a TTY
  $ voiceai tts "stream" --stream | ffplay -             stream chunks via WebSocket
  $ voiceai tts "regional" --region eu-north-1           pin a region

NOTES
  By default the audio is played AND saved to $TMPDIR/voiceai-tts/. Use --out to
  pick a path. --voice accepts a friendly name (e.g. "brooke") or a voiceId;
  we look it up in the catalog and substitute the upstream-native id.
`;

export function ttsCommand(): Command {
  const cfg = load();
  const liveRegions = allRegions();
  const liveWorldParts = allWorldParts();
  const cmd = new Command("tts");
  cmd
    .description("Synthesize speech (HTTP one-shot or --stream via WebSocket)")
    .argument("<text>", "Text to synthesize (or use --stream and pipe stdin)")
    .option(
      "-m, --model <id>",
      "TTS model variant (e.g. slng/deepgram/aura:2-en)",
      cfg.defaultTtsModel ?? "slng/deepgram/aura:2-en",
    )
    .option(
      "-v, --voice <name>",
      "Voice id or friendly name (resolved against the catalog)",
      cfg.defaultTtsVoice ?? "aura-2-thalia-en",
    )
    .option("-o, --out <file>", "Write audio to file instead of playing it")
    .option(
      "--region <region>",
      `Force region (auto if unset). Available: ${liveRegions.join(" | ")}`,
    )
    .option(
      "--world-part <wp>",
      `Force world part (auto if unset). Available: ${liveWorldParts.join(" | ")}`,
    )
    .option("--stream", "Stream via WebSocket (good for long text or piping audio)")
    .addHelpText("afterAll", TTS_EPILOGUE)
    .action(async (text: string, opts) => {
      if (opts.stream) {
        await streamTts(text, opts);
        return;
      }
      // Resolve --voice against the catalog (accepts voiceId OR friendly name).
      const resolved = resolveVoice(opts.model, opts.voice);
      if (!resolved.ok) {
        process.stderr.write(`${resolved.message}\n`);
        process.exit(1);
      }
      const voiceId = resolved.voiceId!;
      if (resolved.message && voiceId !== opts.voice) {
        process.stderr.write(`${resolved.message}\n`);
      }

      const { http } = makeClients();
      const params: Record<string, unknown> = { text, voice: voiceId };
      if (opts.region) params.region = opts.region;
      if (opts.worldPart) params["world-part"] = opts.worldPart;

      // Show a spinner only when stderr is interactive (don't pollute pipes/CI).
      const spinner = process.stderr.isTTY
        ? ora({ stream: process.stderr, text: `synthesizing with ${opts.model} · ${voiceId}` }).start()
        : null;

      let bytes: Uint8Array;
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await (http as any).textToSpeech.create(opts.model, params);
        const blob = await response.blob();
        bytes = new Uint8Array(await blob.arrayBuffer());
        spinner?.succeed(`got ${bytes.length} bytes (${blob.type})`);
      } catch (e) {
        const detail = extractApiError(e);
        // spinner is null when stderr isn't a TTY; write the failure unconditionally.
        if (spinner) spinner.fail(`synthesis failed: ${detail}`);
        else process.stderr.write(`synthesis failed: ${detail}\n`);
        process.exit(1);
      }

      // stdout piped → emit raw audio bytes (script-friendly).
      if (!opts.out && !process.stdout.isTTY) {
        process.stdout.write(bytes);
        return;
      }

      // Resolve the file path. Default to a temp file when --out isn't given,
      // so the user can always reach the audio after the run.
      const ext = sniffExt(bytes);
      const outPath = opts.out
        ? String(opts.out)
        : (() => {
            const tmp = join(tmpdir(), "voiceai-tts");
            mkdirSync(tmp, { recursive: true });
            return join(tmp, `voiceai-tts-${Date.now()}.${ext}`);
          })();
      writeFileSync(outPath, bytes);
      process.stderr.write(`saved → ${outPath}\n`);

      // Play if we're in a TTY (otherwise the user piped --out somewhere
      // and probably doesn't want playback).
      if (process.stdout.isTTY) {
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
      }
    });
  return cmd;
}

/** Streaming TTS via WebSocket. Pipes audio_chunk frames to stdout (or --out).
 *  When stdout is a TTY, we buffer + play after audio_end. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function streamTts(text: string, opts: any): Promise<void> {
  const resolved = resolveVoice(opts.model, opts.voice);
  if (!resolved.ok) {
    process.stderr.write(`${resolved.message}\n`);
    process.exit(1);
  }
  const voiceId = resolved.voiceId!;

  const { streaming } = makeClients();
  const spinner = process.stderr.isTTY
    ? ora({ stream: process.stderr, text: `streaming via WebSocket · ${opts.model} · ${voiceId}` }).start()
    : null;

  const session = await streaming.connectTts(opts.model);
  session.send({ type: "init", voice: voiceId } as never);
  session.send({ type: "text", text } as never);
  session.send({ type: "flush" } as never);

  const buf: Uint8Array[] = [];
  const collectToFileOrTty = Boolean(opts.out) || process.stdout.isTTY;

  for await (const msg of session) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const m = msg as any;
    if (m.type === "audio_chunk" && typeof m.data === "string") {
      const chunk = Buffer.from(m.data, "base64");
      if (collectToFileOrTty) buf.push(new Uint8Array(chunk));
      else process.stdout.write(chunk);
    } else if (m.type === "audio_end") {
      spinner?.succeed(`stream complete${m.duration ? ` (~${m.duration}s)` : ""}`);
      session.close();
      break;
    } else if (m.type === "error") {
      spinner?.fail(`stream error: ${JSON.stringify(m)}`);
      session.close();
      process.exit(1);
    }
  }

  if (collectToFileOrTty) {
    const merged = Buffer.concat(buf.map((b) => Buffer.from(b)));
    if (opts.out) {
      writeFileSync(opts.out, merged);
      process.stderr.write(`wrote to ${opts.out}\n`);
    } else {
      await playBytes(new Uint8Array(merged));
    }
  }
}

/** Pull a useful message out of a Stainless API error.
 *
 * The SDK populates either `e.error` (parsed JSON body) or, for endpoints
 * declared as binary, sometimes leaves the body unparsed. We dig through
 * the common shapes and fall back to the request-id so support can
 * always trace the failure. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractApiError(e: any): string {
  if (!e) return "unknown error";
  const status = e.status ?? e.statusCode ?? "";
  // Likely sources of the parsed body across Stainless versions:
  //   e.error           — parsed JSON body
  //   e.body            — raw response body
  //   e.cause?.error    — wrapped error
  const body = e.error ?? e.body ?? e.cause?.error ?? undefined;

  const reqId =
    e.headers?.["x-slng-request-id"] ??
    e.headers?.get?.("x-slng-request-id") ??
    (typeof body === "object" && body && "slng_request_id" in body
      ? (body as Record<string, unknown>).slng_request_id
      : undefined);

  const bits: string[] = [];
  if (status) bits.push(`HTTP ${status}`);
  if (body) {
    const detail = typeof body === "string" ? body : JSON.stringify(body);
    bits.push(detail);
  } else if (e.message) {
    bits.push(e.message);
  } else {
    bits.push("(no body parsed; server returned an empty/binary error)");
  }
  if (reqId) bits.push(`slng_request_id=${reqId}`);
  return bits.join(" · ");
}
