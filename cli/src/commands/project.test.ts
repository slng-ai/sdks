import { afterAll, describe, expect, test } from "bun:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Action-level: spawn the real CLI against a local stub gateway that answers
// the bridge WebSocket, and record the project header the handshake carried.

const CLI_DIR = `${import.meta.dir}/../..`;
// An empty HOME, so the spawned CLI never reads or migrates the real profile store.
const HOME = mkdtempSync(join(tmpdir(), "voiceai-project-test-"));
afterAll(() => rmSync(HOME, { recursive: true, force: true }));

interface Run {
  code: number;
  header: string | null;
  stderr: string;
}

async function runBridge(args: string[], env: Record<string, string> = {}, opts: { reject?: boolean } = {}): Promise<Run> {
  let header: string | null = null;
  const server = Bun.serve({
    port: 0,
    fetch(req, srv) {
      if (new URL(req.url).pathname.startsWith("/v1/bridges/unmute/")) {
        header = req.headers.get("x-slng-project-id");
        if (opts.reject) return new Response("forbidden", { status: 403 });
        if (srv.upgrade(req)) return undefined;
      }
      return new Response("not found", { status: 404 }); // catalog: voice passes through
    },
    websocket: {
      message(ws, msg) {
        if (typeof msg !== "string") return;
        const type = JSON.parse(msg).type;
        if (type === "flush") {
          ws.send(new Uint8Array([0, 0, 1, 0]));
          ws.send(JSON.stringify({ type: "audio_end" }));
        } else if (type === "close") {
          ws.close();
        }
      },
    },
  });
  try {
    const base = { ...process.env };
    delete base.SLNG_PROJECT_ID;
    const proc = Bun.spawn(["bun", "run", "src/index.ts", ...args], {
      cwd: CLI_DIR,
      env: {
        ...base,
        VOICEAI_BASE_URL: `http://localhost:${server.port}`,
        VOICEAI_API_KEY: "slng_test_key",
        HOME,
        XDG_CONFIG_HOME: HOME,
        ...env,
      },
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

const tts = ["tts", "hi", "--stream"];
const stt = ["stt", "--stream", "--source", "stdin"];

describe("--project and SLNG_PROJECT_ID", () => {
  test("tts sends --project as X-SLNG-Project-Id", async () => {
    const r = await runBridge([...tts, "--project", "flag-project"]);
    expect(r.code).toBe(0);
    expect(r.header).toBe("flag-project");
  });

  test("stt sends --project as X-SLNG-Project-Id", async () => {
    const r = await runBridge([...stt, "--project", "flag-project"]);
    expect(r.code).toBe(0);
    expect(r.header).toBe("flag-project");
  });

  test("falls back to SLNG_PROJECT_ID", async () => {
    const r = await runBridge(tts, { SLNG_PROJECT_ID: "env-project" });
    expect(r.code).toBe(0);
    expect(r.header).toBe("env-project");
  });

  test("--project wins over SLNG_PROJECT_ID", async () => {
    const r = await runBridge([...stt, "--project", "flag-project"], { SLNG_PROJECT_ID: "env-project" });
    expect(r.header).toBe("flag-project");
  });

  test("sends no header with neither set", async () => {
    const r = await runBridge(tts);
    expect(r.code).toBe(0);
    expect(r.header).toBeNull();
  });

  test("a rejected handshake names the project that was sent", async () => {
    const r = await runBridge([...tts, "--project", "bad-project"], {}, { reject: true });
    expect(r.code).toBe(1);
    expect(r.stderr).toContain("sent project bad-project");
  });
});
