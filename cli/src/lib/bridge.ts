// TTS and STT over the unmute bridge WebSocket (/v1/bridges/unmute/{tts,stt}/<model>).
//
// The bridge is WebSocket only: an HTTP POST to it answers 405. TTS audio comes
// back as raw binary frames, ended by an `audio_end` message. STT takes binary
// PCM and answers with `partial_transcript` / `final_transcript` messages.

import type { StreamingEvent } from "../../../streaming/ts/client";
import { makeClients } from "./sdk";
import { wrongRegionHint } from "./verify";

/** TTS output: 16-bit little-endian mono PCM. Every bridge TTS target accepts linear16 at this rate. */
export const TTS_SAMPLE_RATE = 24_000;
/** STT input: 16-bit little-endian mono PCM. */
export const STT_SAMPLE_RATE = 16_000;

export interface SynthOptions {
  /** API region whose gateway to use (e.g. eu-west); found from the key when unset. */
  region?: string;
  /** Called with each audio frame as it arrives. */
  onChunk?: (pcm: Uint8Array) => void;
}

/** Synthesize `text` and return the whole utterance as raw PCM at TTS_SAMPLE_RATE. */
export async function synthesize(model: string, voice: string, text: string, opts: SynthOptions = {}): Promise<Uint8Array> {
  const { streaming, apiKey, baseUrl } = await makeClients(opts.region);
  const session = await explainConnect(() => streaming.connectTts(model), apiKey, baseUrl);
  session.send({ type: "init", voice, config: { encoding: "linear16", sample_rate: TTS_SAMPLE_RATE } });
  session.send({ type: "text", text });
  session.send({ type: "flush" });

  const chunks: Uint8Array[] = [];
  for await (const msg of session) {
    if (msg.type === "binary" && "bytes" in msg) {
      chunks.push(msg.bytes);
      opts.onChunk?.(msg.bytes);
    } else if (msg.type === "audio_end") {
      session.send({ type: "close" });
      session.close();
      break;
    } else if (msg.type === "error") {
      session.close();
      throw new Error(`synthesis failed: ${describeError(msg)}`);
    }
  }
  if (!chunks.length) throw new Error("synthesis failed: the connection closed before any audio arrived");
  return Buffer.concat(chunks);
}

/** Wrap raw 16-bit mono PCM in a WAV header, so players and files know the format. */
export function wav(pcm: Uint8Array, sampleRate: number): Uint8Array {
  const head = Buffer.alloc(44);
  head.write("RIFF", 0);
  head.writeUInt32LE(36 + pcm.length, 4);
  head.write("WAVEfmt ", 8);
  head.writeUInt32LE(16, 16); // fmt chunk size
  head.writeUInt16LE(1, 20); // PCM
  head.writeUInt16LE(1, 22); // mono
  head.writeUInt32LE(sampleRate, 24);
  head.writeUInt32LE(sampleRate * 2, 28); // byte rate
  head.writeUInt16LE(2, 32); // block align
  head.writeUInt16LE(16, 34); // bits per sample
  head.write("data", 36);
  head.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([head, pcm]);
}

/** Decoders tried in order. sox is the CLI's preferred audio tool; ffmpeg is the fallback. */
const DECODERS = (path: string, rate: string) => [
  ["sox", path, "-t", "raw", "-e", "signed-integer", "-b", "16", "-c", "1", "-r", rate, "-"],
  ["ffmpeg", "-v", "error", "-i", path, "-f", "s16le", "-ac", "1", "-ar", rate, "-"],
];

/** Decode any audio file to raw PCM at STT_SAMPLE_RATE with sox or ffmpeg. */
export async function decodeToPcm(path: string): Promise<Uint8Array> {
  for (const argv of DECODERS(path, String(STT_SAMPLE_RATE))) {
    let proc;
    try {
      proc = Bun.spawn(argv, { stdout: "pipe", stderr: "pipe" });
    } catch {
      continue; // not installed
    }
    const [pcm, err, code] = await Promise.all([
      new Response(proc.stdout).arrayBuffer(),
      new Response(proc.stderr).text(),
      proc.exited,
    ]);
    if (code !== 0) throw new Error(`${argv[0]} could not decode ${path}: ${err.trim()}`);
    return new Uint8Array(pcm);
  }
  throw new Error("transcribing a file needs sox or ffmpeg to decode it. install one: brew install sox / apt install sox");
}

export interface Transcriber {
  sendAudio(pcm: Uint8Array): void;
  /** Ask for the last transcript, close, and wait until the server is done. */
  end(): Promise<void>;
}

/**
 * Open an STT session. `onText` gets every partial and final transcript.
 * Errors from the server reject `end()`.
 */
export async function openTranscriber(
  model: string,
  onText: (text: string, final: boolean) => void,
  region?: string,
): Promise<Transcriber> {
  const { streaming, apiKey, baseUrl } = await makeClients(region);
  const session = await explainConnect(() => streaming.connectStt(model), apiKey, baseUrl);
  session.send({
    type: "init",
    config: { language: "en", sample_rate: STT_SAMPLE_RATE, encoding: "linear16", enable_partial_transcripts: true },
  });

  const reader = (async () => {
    for await (const msg of session) {
      if (msg.type === "error") throw new Error(`transcription failed: ${describeError(msg)}`);
      const t = transcriptOf(msg);
      if (t?.text) onText(t.text, t.final);
    }
  })();
  reader.catch(() => {}); // surfaced by end(); this only stops an early unhandled rejection

  return {
    sendAudio: (pcm) => session.sendAudio(pcm),
    end: async () => {
      session.send({ type: "finalize" });
      session.send({ type: "close" });
      await reader;
    },
  };
}

/** Pull the transcript out of one server message, or undefined if it carries none. */
export function transcriptOf(msg: StreamingEvent): { text: string; final: boolean } | undefined {
  if (msg.type !== "partial_transcript" && msg.type !== "final_transcript") return undefined;
  if (!("transcript" in msg || "text" in msg)) return undefined;
  return { text: msg.transcript ?? msg.text ?? "", final: msg.type === "final_transcript" };
}

/**
 * Open the socket. If it fails at a chosen region's gateway, check whether the
 * key belongs to another region and say which. The WebSocket error carries no
 * HTTP status, so this asks the gateways only after a failure.
 */
async function explainConnect<T>(open: () => Promise<T>, apiKey: string, baseUrl: string): Promise<T> {
  try {
    return await open();
  } catch (e) {
    const hint = await wrongRegionHint(apiKey, baseUrl);
    throw hint ? new Error(hint) : e;
  }
}

function describeError(msg: StreamingEvent): string {
  const m = msg as { code?: unknown; message?: unknown; slng_request_id?: unknown };
  return [m.code, m.message, m.slng_request_id && `slng_request_id=${m.slng_request_id}`].filter(Boolean).join(" · ");
}
