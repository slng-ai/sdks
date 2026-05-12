// Audio I/O via system tools — no native bindings, just ffmpeg/sox/afplay etc.
// Detected once at process start; helpers throw with a clear message if missing.
//
// Playback strategy (in order of preference):
//   - macOS:   afplay
//   - linux:   ffplay (-autoexit, -nodisp) or paplay
//   - generic: ffplay
//
// Recording strategy (16kHz mono S16LE PCM is what STT bridges expect):
//   - sox    (cross-platform, single binary, our preferred choice)
//   - rec    (sox alias on linux/macos)
//   - arecord (linux ALSA)

import { spawn, type Subprocess } from "bun";
import { writeFileSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

type PlayerName = "afplay" | "ffplay" | "paplay";
type RecorderName = "sox" | "rec" | "arecord";

async function which(cmd: string): Promise<boolean> {
  const proc = spawn(["which", cmd], { stdout: "pipe", stderr: "pipe" });
  return (await proc.exited) === 0;
}

let cachedPlayer: PlayerName | null | undefined;
let cachedRecorder: RecorderName | null | undefined;

export async function detectPlayer(): Promise<PlayerName | null> {
  if (cachedPlayer !== undefined) return cachedPlayer;
  for (const name of ["afplay", "ffplay", "paplay"] as const) {
    if (await which(name)) {
      cachedPlayer = name;
      return name;
    }
  }
  cachedPlayer = null;
  return null;
}

export async function detectRecorder(): Promise<RecorderName | null> {
  if (cachedRecorder !== undefined) return cachedRecorder;
  for (const name of ["sox", "rec", "arecord"] as const) {
    if (await which(name)) {
      cachedRecorder = name;
      return name;
    }
  }
  cachedRecorder = null;
  return null;
}

/** Play raw bytes (any format the player can sniff: WAV, MP3, OGG, etc.).
 *
 * afplay does NOT read from stdin; it requires a file path. So for the
 * macOS path we write to a temp file, play it, then unlink. ffplay reads
 * pipe:0 fine. paplay supports stdin for the formats it knows about. */
export async function playBytes(bytes: Uint8Array): Promise<void> {
  const player = await detectPlayer();
  if (!player) {
    throw new Error(
      "no audio player found. install one of: afplay (macOS, built-in), ffplay (brew install ffmpeg), paplay (linux).",
    );
  }

  if (player === "afplay") {
    // Sniff the format from magic bytes for the extension. afplay relies on
    // the extension to dispatch the right CoreAudio decoder.
    const ext = sniffExt(bytes);
    const path = join(tmpdir(), `slng-play-${process.pid}-${Date.now()}.${ext}`);
    writeFileSync(path, bytes);
    try {
      const proc = spawn(["afplay", path], { stdout: "ignore", stderr: "pipe" });
      const code = await proc.exited;
      if (code !== 0) {
        const err = await new Response(proc.stderr).text();
        throw new Error(`afplay exited ${code}: ${err.trim()}`);
      }
    } finally {
      unlinkSync(path);
    }
    return;
  }

  const args: string[] =
    player === "ffplay"
      ? ["-autoexit", "-nodisp", "-loglevel", "error", "-i", "pipe:0"]
      : // paplay reads any libsndfile-supported format from stdin; passing
        // --raw forces interpretation as raw PCM, which is wrong for MP3/WAV
        // coming from the TTS API. Let paplay sniff instead.
        [];

  const proc = spawn([player, ...args], { stdin: "pipe", stdout: "ignore", stderr: "pipe" });
  proc.stdin.write(bytes);
  await proc.stdin.end();
  const code = await proc.exited;
  if (code !== 0) {
    const err = await new Response(proc.stderr).text();
    throw new Error(`${player} exited ${code}: ${err.trim()}`);
  }
}

/** Quick magic-byte sniff to choose a file extension afplay will recognize. */
export function sniffExt(b: Uint8Array): string {
  if (b.length >= 4 && b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46) return "wav"; // RIFF
  if (b.length >= 3 && b[0] === 0x49 && b[1] === 0x44 && b[2] === 0x33) return "mp3"; // ID3
  if (b.length >= 2 && b[0] === 0xff && (b[1]! & 0xe0) === 0xe0) return "mp3"; // MPEG sync
  if (b.length >= 4 && b[0] === 0x4f && b[1] === 0x67 && b[2] === 0x67 && b[3] === 0x53) return "ogg";
  if (b.length >= 12 && b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70) return "m4a"; // ftyp box
  return "mp3"; // safest default for our TTS outputs
}

/**
 * Record 16kHz mono S16LE PCM from the default input device until the
 * returned `stop` function is called. Yields raw PCM buffers as they arrive.
 */
export async function recordPcm(opts: { sampleRate?: number; channels?: number } = {}): Promise<{
  frames: AsyncIterable<Uint8Array>;
  stop: () => void;
  proc: Subprocess;
}> {
  const recorder = await detectRecorder();
  if (!recorder) {
    throw new Error(
      "no recorder found. install: sox (brew install sox / apt install sox) or arecord (linux ALSA).",
    );
  }
  const rate = opts.sampleRate ?? 16000;
  const channels = opts.channels ?? 1;

  const args: string[] =
    recorder === "sox" || recorder === "rec"
      ? [
          "-q",
          "-t",
          "coreaudio",
          "default",
          "-t",
          "raw",
          "-b",
          "16",
          "-e",
          "signed-integer",
          "--endian",
          "little",
          "-r",
          String(rate),
          "-c",
          String(channels),
          "-",
        ]
      : [
          "-q",
          "-f",
          "S16_LE",
          "-c",
          String(channels),
          "-r",
          String(rate),
          "-t",
          "raw",
          "-",
        ];

  // sox's `-t coreaudio default` only works on macOS; on Linux drop it.
  const platformArgs =
    (recorder === "sox" || recorder === "rec") && process.platform !== "darwin"
      ? args.filter((a, i, arr) => !(a === "coreaudio" || a === "default" || (a === "-t" && arr[i + 1] === "coreaudio")))
      : args;

  const proc = spawn([recorder, ...platformArgs], { stdout: "pipe", stderr: "pipe" });

  async function* frames(): AsyncIterable<Uint8Array> {
    const reader = proc.stdout.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) return;
        if (value && value.length > 0) yield value;
      }
    } finally {
      reader.releaseLock();
    }
  }

  return {
    frames: frames(),
    stop: () => proc.kill(),
    proc,
  };
}
