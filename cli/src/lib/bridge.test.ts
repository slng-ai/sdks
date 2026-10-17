import { test, expect } from "bun:test";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { ServerWebSocket } from "bun";
import { explainConnect, handshakeStatus, transcriptOf, wav } from "./bridge";

const CLI_DIR = `${import.meta.dir}/../..`;

// --- units -----------------------------------------------------------------

test("handshakeStatus reads the npm ws status and nothing from Bun's message", () => {
  expect(handshakeStatus(new Error("Unexpected server response: 403"))).toBe(403);
  expect(handshakeStatus(new Error("WebSocket connection to 'x' failed: Expected 101 status code"))).toBeUndefined();
});

test("explainConnect names the project only on a 403 handshake", async () => {
  // Not a regional gateway, so wrongRegionHint asks nothing and returns undefined.
  const fail = (msg: string) => () => Promise.reject(new Error(msg));
  const base = "http://localhost:1";
  await expect(explainConnect(fail("Unexpected server response: 403"), "k", base, "p-1")).rejects.toThrow(
    "project p-1, from --project or SLNG_PROJECT_ID, was not found",
  );
  for (const [msg, project] of [
    ["Unexpected server response: 401", "p-1"],
    ["Unexpected server response: 403", undefined],
    ["WebSocket connection to 'x' failed: Expected 101 status code", "p-1"],
  ] as const) {
    await expect(explainConnect(fail(msg), "k", base, project)).rejects.toThrow(new Error(msg));
  }
});

test("wav wraps PCM in a 44-byte header that names the rate and length", () => {
  const out = Buffer.from(wav(new Uint8Array([1, 2, 3, 4]), 24000));
  expect(out.length).toBe(48);
  expect(out.toString("ascii", 0, 4)).toBe("RIFF");
  expect(out.toString("ascii", 8, 12)).toBe("WAVE");
  expect(out.readUInt32LE(24)).toBe(24000);
  expect(out.readUInt32LE(40)).toBe(4);
});

test("transcriptOf reads the bridge's `transcript` field, and `text` as a fallback", () => {
  expect(transcriptOf({ type: "final_transcript", transcript: "hello" })).toEqual({ text: "hello", final: true });
  expect(transcriptOf({ type: "partial_transcript", text: "hel" })).toEqual({ text: "hel", final: false });
  expect(transcriptOf({ type: "ready" })).toBeUndefined();
});

test("transcriptOf ignores utterance_end, which repeats Soniox's final tokens", () => {
  expect(transcriptOf({ type: "utterance_end", tokens: [{ text: "Hello", is_final: true }] } as never)).toBeUndefined();
});

// --- action level: the real CLI against a stub bridge ------------------------

type Reply = (ws: ServerWebSocket<unknown>, msg: string | Buffer) => void;

/** What the stub serves at GET /v1/catalog/models/<code>: one voice, so names resolve. */
const CATALOG_MODEL = { code: "slng/fish/tts:s2.1-pro", voices: [{ voice_id: "8634617958764b539e0cdd5eb6c7723e", name: "Abel" }] };

async function runAgainstBridge(args: string[], reply: Reply, stdin?: Uint8Array) {
  const seen: { paths: string[]; text: string[]; audioBytes: number } = { paths: [], text: [], audioBytes: 0 };
  const server = Bun.serve({
    port: 0,
    fetch(req, srv) {
      const path = new URL(req.url).pathname;
      if (path.startsWith("/v1/catalog/models/")) return Response.json(CATALOG_MODEL);
      seen.paths.push(path);
      return srv.upgrade(req) ? undefined : new Response("websocket only", { status: 405 });
    },
    websocket: {
      message(ws, msg) {
        if (typeof msg === "string") seen.text.push(msg);
        else seen.audioBytes += msg.length;
        reply(ws, msg);
      },
    },
  });
  try {
    const proc = Bun.spawn(["bun", "run", "src/index.ts", ...args], {
      cwd: CLI_DIR,
      env: { ...process.env, VOICEAI_BASE_URL: `http://localhost:${server.port}`, VOICEAI_API_KEY: "slng_test_key" },
      stdin: stdin ?? "ignore",
      stdout: "pipe",
      stderr: "pipe",
    });
    const [stdout, stderr, code] = await Promise.all([
      new Response(proc.stdout).text(),
      new Response(proc.stderr).text(),
      proc.exited,
    ]);
    return { stdout, stderr, code, seen };
  } finally {
    server.stop(true);
  }
}

const ttsBridge: Reply = (ws, msg) => {
  if (typeof msg !== "string") return;
  const m = JSON.parse(msg);
  if (m.type === "init") ws.send(JSON.stringify({ type: "ready" }));
  if (m.type === "flush") {
    ws.send(new Uint8Array([1, 0, 2, 0]));
    ws.send(new Uint8Array([3, 0]));
    ws.send(JSON.stringify({ type: "audio_end" }));
  }
  if (m.type === "close") ws.close();
};

test("tts --out writes a WAV of the binary frames the bridge sends", async () => {
  const out = join(mkdtempSync(join(tmpdir(), "voiceai-tts-")), "a.wav");
  const r = await runAgainstBridge(["tts", "hi", "-m", "slng/fish/tts:s2.1-pro", "-v", "v1", "--out", out], ttsBridge);
  expect(r.code).toBe(0);
  expect(r.seen.paths).toEqual(["/v1/bridges/unmute/tts/slng/fish/tts:s2.1-pro"]);
  expect(JSON.parse(r.seen.text[0]!)).toEqual({ type: "init", voice: "v1", config: { encoding: "linear16", sample_rate: 24000 } });
  const file = readFileSync(out);
  expect(file.toString("ascii", 0, 4)).toBe("RIFF");
  expect([...file.subarray(44)]).toEqual([1, 0, 2, 0, 3, 0]);
});

test("tts -v resolves a voice name from the live catalog", async () => {
  const r = await runAgainstBridge(["tts", "hi", "-m", "slng/fish/tts:s2.1-pro", "-v", "abel", "--stream"], ttsBridge);
  expect(r.code).toBe(0);
  expect(JSON.parse(r.seen.text[0]!).voice).toBe("8634617958764b539e0cdd5eb6c7723e");
  expect(r.stderr).toContain('resolved "abel" → 8634617958764b539e0cdd5eb6c7723e (Abel)');
});

test("tts --stream writes raw PCM to stdout", async () => {
  const r = await runAgainstBridge(["tts", "hi", "-m", "slng/fish/tts:s2.1-pro", "-v", "v1", "--stream"], ttsBridge);
  expect(r.code).toBe(0);
  expect([...Buffer.from(r.stdout, "latin1")]).toEqual([1, 0, 2, 0, 3, 0]);
});

test("tts exits 1 with the bridge's error message", async () => {
  const r = await runAgainstBridge(["tts", "hi", "-m", "slng/fish/tts:s2.1-pro", "-v", "nope"], (ws, msg) => {
    if (typeof msg === "string" && JSON.parse(msg).type === "init") {
      ws.send(JSON.stringify({ type: "error", code: "invalid_voice", message: "unknown voice" }));
    }
  });
  expect(r.code).toBe(1);
  expect(r.stderr).toContain("synthesis failed: invalid_voice · unknown voice");
});

function sttBridge(final: object): Reply {
  return (ws, msg) => {
    if (typeof msg !== "string") return;
    const m = JSON.parse(msg);
    if (m.type === "init") ws.send(JSON.stringify({ type: "ready" }));
    if (m.type === "finalize") ws.send(JSON.stringify(final));
    if (m.type === "close") ws.close();
  };
}

test("stt --stream --source stdin prints the final transcript", async () => {
  const pcm = new Uint8Array(3200);
  const r = await runAgainstBridge(
    ["stt", "--stream", "--source", "stdin", "-m", "deepgram/nova:3"],
    sttBridge({ type: "final_transcript", transcript: "hello world" }),
    pcm,
  );
  expect(r.code).toBe(0);
  expect(r.stdout).toBe("hello world\n");
  expect(r.seen.paths).toEqual(["/v1/bridges/unmute/stt/deepgram/nova:3"]);
  expect(r.seen.audioBytes).toBe(3200);
});

test("stt <file> decodes the file before sending it", async () => {
  const dir = mkdtempSync(join(tmpdir(), "voiceai-stt-"));
  const file = join(dir, "in.wav");
  writeFileSync(file, wav(new Uint8Array(32000), 16000)); // 1 s of silence at 16 kHz
  const r = await runAgainstBridge(["stt", file, "-m", "deepgram/nova:3"], sttBridge({ type: "final_transcript", transcript: "ok" }));
  expect(r.stderr).not.toContain("needs sox or ffmpeg");
  expect(r.code).toBe(0);
  expect(r.stdout).toBe("ok\n");
  expect(r.seen.audioBytes).toBe(32000);
});
