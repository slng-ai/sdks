import { expect, test } from "bun:test";

// Action-level: the real CLI against a stub agents host, for `agents config`,
// `agents import` and `agents versions`.

const CLI_DIR = `${import.meta.dir}/../..`;
const H64 = (c: string) => c.repeat(64);

type Handler = (req: Request, url: URL, body: unknown) => Response | undefined;

async function run(args: string[], handler: Handler, stdin?: string) {
  const calls: { method: string; path: string; query: string; body: unknown }[] = [];
  const server = Bun.serve({
    port: 0,
    async fetch(req) {
      const url = new URL(req.url);
      const text = req.method === "GET" ? "" : await req.text();
      const body = text ? JSON.parse(text) : undefined;
      calls.push({ method: req.method, path: url.pathname, query: url.search, body });
      return handler(req, url, body) ?? new Response("unstubbed", { status: 500 });
    },
  });
  try {
    const proc = Bun.spawn(["bun", "run", "src/index.ts", "agents", ...args], {
      cwd: CLI_DIR,
      env: { ...process.env, VOICEAI_AGENTS_BASE_URL: `http://localhost:${server.port}`, VOICEAI_API_KEY: "slng_test_key" },
      stdin: stdin === undefined ? "ignore" : new TextEncoder().encode(stdin),
      stdout: "pipe",
      stderr: "pipe",
    });
    const [stdout, stderr] = await Promise.all([new Response(proc.stdout).text(), new Response(proc.stderr).text()]);
    return { stdout, stderr, code: await proc.exited, calls };
  } finally {
    server.stop(true);
  }
}

// --- config -----------------------------------------------------------------

test("config prints the current config; --version reads a past one", async () => {
  const handler: Handler = (_r, url) => Response.json({ schema_version: 2, name: url.pathname });
  const now = await run(["config", "a1"], handler);
  expect(now.code).toBe(0);
  expect(JSON.parse(now.stdout).name).toBe("/v1/agents/a1/config");

  const past = await run(["config", "a1", "--version", "3"], handler);
  expect(JSON.parse(past.stdout).name).toBe("/v1/agents/a1/versions/3/config");
});

test("config --version 0 is refused before any request", async () => {
  const r = await run(["config", "a1", "--version", "0"], () => Response.json({}));
  expect(r.code).toBe(1);
  expect(r.stderr).toContain("--version must be a whole number of 1 or more");
  expect(r.calls).toEqual([]);
});

test("config errors go to stderr, not into a redirected file", async () => {
  const r = await run(["config", "a1"], () => Response.json({ detail: "Agent not found" }, { status: 404 }));
  expect(r.code).toBe(1);
  expect(r.stdout).toBe("");
});

// --- import -----------------------------------------------------------------

const doc = JSON.stringify({ schema_version: 2, name: "copy", region: "eu-west", language: "en" });

test("import posts the file with the trunk, and waits out a 202", async () => {
  let posts = 0;
  const r = await run(["import", "--file", "-", "--trunk", "t1", "--json"], (req, url) => {
    if (req.method === "POST" && url.pathname === "/v1/agents/import") {
      return posts++ === 0
        ? Response.json({ state: "preparing", retry_after_seconds: 1 }, { status: 202 })
        : Response.json({ id: "new-agent", name: "copy" }, { status: 201 });
    }
  }, doc);
  expect(r.code).toBe(0);
  expect(JSON.parse(r.stdout).id).toBe("new-agent");
  const imports = r.calls.filter((c) => c.path === "/v1/agents/import");
  expect(imports.length).toBe(2);
  expect(imports[0]!.query).toBe("?sip_outbound_trunk_id=t1");
  expect(imports[0]!.body).toEqual(JSON.parse(doc));
});

test("import refuses a voice the catalog does not offer, and sends nothing", async () => {
  const bad = JSON.stringify({ region: "eu-west", language: "en", models: { tts: "m", tts_voice: "nope" } });
  const r = await run(["import", "--file", "-"], (_req, url) => {
    if (url.pathname === "/v1/agents/model-catalog") {
      return Response.json({
        regions: [{ region: "eu-west", languages: [{ language: "en", tts_options: [
          { model_code: "m", service_type: "tts", region: "eu-west", language: "en", voices: [{ voice_id: "v1" }] },
        ] }] }],
      });
    }
  }, bad);
  expect(r.code).toBe(1);
  expect(r.stderr).toContain('models.tts_voice "nope"');
  expect(r.calls.some((c) => c.path === "/v1/agents/import")).toBe(false);
});

// --- versions ---------------------------------------------------------------

test("versions list prints one row per version", async () => {
  const r = await run(["versions", "list", "a1"], () =>
    Response.json({
      items: [
        { version_number: 2, source: "restore", restored_from_version: 1, changed_fields: ["models"], label: null, created_at: "t2" },
        { version_number: 1, source: "create", changed_fields: [], label: "first", created_at: "t1" },
      ],
    }),
  );
  expect(r.code).toBe(0);
  expect(r.stdout.trim().split("\n")).toEqual([
    "VERSION\tSOURCE\tCHANGED\tLABEL\tCREATED",
    "2\trestore (from 1)\tmodels\t\tt2",
    "1\tcreate\t\tfirst\tt1",
  ]);
  expect(r.calls[0]!.query).toBe("?page=1");
});

const ready = {
  state: "ready",
  target_version: 1,
  current_version: 3,
  candidate_config_hash: H64("c"),
  acceptance_hash: H64("a"),
  changed_fields: ["models", "prompt"],
  issues: [],
  preparation: { resource_hash: H64("r"), dependency_hash: null },
};

function restoreStub(preview: object): Handler {
  return (req, url) => {
    if (url.pathname.endsWith("/restore/preview")) return Response.json(preview);
    if (url.pathname.endsWith("/restore/accept")) return Response.json({ id: "a1", name: "restored" });
  };
}

test("versions restore without a terminal needs --yes, and sends nothing", async () => {
  const r = await run(["versions", "restore", "a1", "1"], restoreStub(ready));
  expect(r.code).toBe(1);
  expect(r.stderr).toContain("pass --yes");
  expect(r.calls).toEqual([]);
});

test("versions restore --yes accepts with the preview's hashes", async () => {
  const r = await run(["versions", "restore", "a1", "1", "--yes", "--restore-name"], restoreStub(ready));
  expect(r.code).toBe(0);
  expect(r.stderr).toContain("restore version 1 over version 3. changes: models, prompt");
  const accept = r.calls.find((c) => c.path === "/v1/agents/a1/versions/1/restore/accept")!;
  expect(accept.body).toEqual({
    restore_historical_name: true,
    acceptance_hash: H64("a"),
    candidate_hash: H64("c"),
    resource_hash: H64("r"),
    dependency_hash: null,
  });
});

test("versions restore stops on a failed preview and names the issue", async () => {
  const r = await run(
    ["versions", "restore", "a1", "1", "--yes"],
    restoreStub({ ...ready, state: "failed", acceptance_hash: null, issues: [{ code: "TOOL_GONE", message: "tool x was deleted" }] }),
  );
  expect(r.code).toBe(1);
  expect(r.stderr).toContain("tool x was deleted · TOOL_GONE");
  expect(r.calls.some((c) => c.path.endsWith("/accept"))).toBe(false);
});

test("versions restore stops while dependencies are preparing", async () => {
  const r = await run(
    ["versions", "restore", "a1", "1", "--yes"],
    restoreStub({ ...ready, state: "preparing", acceptance_hash: null, preparation: { retry_after_seconds: 7 } }),
  );
  expect(r.code).toBe(1);
  expect(r.stderr).toContain("try again in about 7s");
  expect(r.calls.some((c) => c.path.endsWith("/accept"))).toBe(false);
});
