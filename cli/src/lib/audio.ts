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

/** Play raw bytes (any format ffmpeg/afplay can sniff: WAV, MP3, OGG, etc.). */
export async function playBytes(bytes: Uint8Array): Promise<void> {
  const player = await detectPlayer();
  if (!player) {
    throw new Error(
      "no audio player found. install one of: afplay (macOS, built-in), ffplay (brew install ffmpeg), paplay (linux).",
    );
  }
  const args: string[] =
    player === "afplay"
      ? ["-"]
      : player === "ffplay"
        ? ["-autoexit", "-nodisp", "-loglevel", "error", "-i", "pipe:0"]
        : ["--raw", "--rate=24000", "--format=s16le", "--channels=1"];
  const proc = spawn([player, ...args], { stdin: "pipe", stdout: "ignore", stderr: "ignore" });
  proc.stdin.write(bytes);
  await proc.stdin.end();
  await proc.exited;
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
