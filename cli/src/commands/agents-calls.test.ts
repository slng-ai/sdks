import { expect, test } from "bun:test";

// Action-level: the real CLI against a stub agents host, for `agents calls
// export` and `agents calls live-view`.

const CLI_DIR = `${import.meta.dir}/../..`;

async function run(args: string[], handler: (req: Request, url: URL) => Response) {
  const calls: { method: string; path: string; query: URLSearchParams }[] = [];
  const server = Bun.serve({
    port: 0,
    fetch(req) {
      const url = new URL(req.url);
      calls.push({ method: req.method, path: url.pathname, query: url.searchParams });
      return handler(req, url);
    },
  });
  try {
    const proc = Bun.spawn(["bun", "run", "src/index.ts", "agents", "calls", ...args], {
      cwd: CLI_DIR,
      env: { ...process.env, VOICEAI_AGENTS_BASE_URL: `http://localhost:${server.port}`, VOICEAI_API_KEY: "slng_test_key" },
      stdout: "pipe",
      stderr: "pipe",
    });
    const [stdout, stderr] = await Promise.all([new Response(proc.stdout).text(), new Response(proc.stderr).text()]);
    return { stdout, stderr, code: await proc.exited, calls };
  } finally {
    server.stop(true);
  }
}

const CSV = "id,status,direction\nc1,completed,outbound\n";

test("export writes the CSV to stdout and maps each filter to its query name", async () => {
  const r = await run(
    ["export", "a1", "--status", "completed", "--channel", "outbound", "--from", "2026-10-01", "--to", "2026-10-02", "--duration", "1_to_5_min"],
    () => new Response(CSV, { headers: { "content-type": "text/csv" } }),
  );
  expect(r.code).toBe(0);
  expect(r.stdout).toBe(CSV);
  expect(r.calls[0]!.path).toBe("/v1/agents/a1/calls/export");
  expect(Object.fromEntries(r.calls[0]!.query)).toEqual({
    status: "completed",
    channel: "outbound",
    date_from: "2026-10-01",
    date_to: "2026-10-02",
    duration_bucket: "1_to_5_min",
  });
});

test("export with no filters sends no query, and an error stays off stdout", async () => {
  const r = await run(["export", "a1"], () => Response.json({ detail: "Agent not found" }, { status: 404 }));
  expect(r.code).toBe(1);
  expect(r.stdout).toBe("");
  expect(r.stderr).toContain("Agent not found");
  expect([...r.calls[0]!.query]).toEqual([]);
});

test("live-view prints the room, url and token", async () => {
  const join = { call_id: "c1", room_name: "room-1", livekit_url: "wss://lk", livekit_token: "tok" };
  const r = await run(["live-view", "a1", "c1"], () => Response.json(join));
  expect(r.code).toBe(0);
  expect(r.calls[0]).toMatchObject({ method: "POST", path: "/v1/agents/a1/calls/c1/live-view" });
  expect(r.stdout).toBe("room:  room-1\nurl:   wss://lk\ntoken: tok\n");

  const j = await run(["live-view", "a1", "c1", "--json"], () => Response.json(join));
  expect(JSON.parse(j.stdout)).toEqual(join);
});
