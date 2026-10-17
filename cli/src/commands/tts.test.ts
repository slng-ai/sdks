import { describe, expect, test } from "bun:test";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Action-level: spawn the real CLI against a local stub gateway that answers
// the bridge WebSocket, and record the project header the handshake carried.

const CLI_DIR = `${import.meta.dir}/../..`;
// An empty HOME, so the spawned CLI never reads or migrates the real profile store.
const HOME = mkdtempSync(join(tmpdir(), "voiceai-tts-test-"));

async function ttsProjectHeader(args: string[], env: Record<string, string> = {}): Promise<{ code: number; header: string | null; stderr: string }> {
  let header: string | null = null;
  const server = Bun.serve({
    port: 0,
    fetch(req, srv) {
      if (new URL(req.url).pathname.startsWith("/v1/bridges/unmute/tts/")) {
        header = req.headers.get("x-slng-project-id");
        if (srv.upgrade(req)) return undefined;
      }
      return new Response("not found", { status: 404 }); // catalog: voice passes through
    },
    websocket: {
      message(ws, msg) {
        if (typeof msg === "string" && JSON.parse(msg).type === "flush") {
          ws.send(new Uint8Array([0, 0, 1, 0]));
          ws.send(JSON.stringify({ type: "audio_end" }));
        }
      },
    },
  });
  try {
    const base = { ...process.env };
    delete base.SLNG_PROJECT_ID;
    const proc = Bun.spawn(["bun", "run", "src/index.ts", "tts", "hi", "--stream", ...args], {
      cwd: CLI_DIR,
      env: { ...base, VOICEAI_BASE_URL: `http://localhost:${server.port}`, VOICEAI_API_KEY: "slng_test_key", HOME, XDG_CONFIG_HOME: HOME, ...env },
      stdin: "ignore",
      stdout: "pipe",
      stderr: "pipe",
    });
    const [, stderr] = await Promise.all([new Response(proc.stdout).text(), new Response(proc.stderr).text()]);
    return { code: await proc.exited, header, stderr };
  } finally {
    server.stop(true);
  }
}

describe("tts --project", () => {
  test("sends --project as X-SLNG-Project-Id", async () => {
    const r = await ttsProjectHeader(["--project", "flag-project"]);
    expect(r.stderr).toBe("");
    expect(r.code).toBe(0);
    expect(r.header).toBe("flag-project");
  });

  test("falls back to SLNG_PROJECT_ID", async () => {
    const r = await ttsProjectHeader([], { SLNG_PROJECT_ID: "env-project" });
    expect(r.code).toBe(0);
    expect(r.header).toBe("env-project");
  });

  test("--project wins over SLNG_PROJECT_ID", async () => {
    const r = await ttsProjectHeader(["--project", "flag-project"], { SLNG_PROJECT_ID: "env-project" });
    expect(r.header).toBe("flag-project");
  });

  test("sends no header with neither set", async () => {
    const r = await ttsProjectHeader([]);
    expect(r.code).toBe(0);
    expect(r.header).toBeNull();
  });
});
