import { test, expect, afterEach } from "bun:test";
import { listAllTools, versionCell, PAGE_SIZE, type ToolListItem } from "./tool";

process.env.VOICEAI_API_KEY = "slng_test_key";

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

function item(over: Partial<ToolListItem> = {}): ToolListItem {
  return {
    id: over.id ?? "00000000-0000-0000-0000-000000000000",
    name: over.name ?? "a_tool",
    tool_type: over.tool_type ?? "code",
    description: over.description ?? "",
    last_run_status: null,
    latest_version: over.latest_version ?? 1,
    config_valid: null,
    arg_schema: null,
    ...over,
  };
}

/** Stub fetch, recording every URL it is called with. */
function stub(pages: ToolListItem[][]): { urls: string[] } {
  const urls: string[] = [];
  let n = 0;
  globalThis.fetch = (async (url: URL | string) => {
    urls.push(String(url));
    const body = JSON.stringify(pages[n++] ?? []);
    return new Response(body, { status: 200, headers: { "content-type": "application/json" } });
  }) as typeof fetch;
  return { urls };
}

// --- versionCell (FR-004) --------------------------------------------------

test("versionCell renders a missing version as - and never 0", () => {
  expect(versionCell(null)).toBe("-");
  expect(versionCell(undefined)).toBe("-");
  expect(versionCell(0)).toBe("0");
  expect(versionCell(3)).toBe("3");
});

// --- pagination (FR-002, SC-005) -------------------------------------------

test("listAllTools stops after a short page and issues one request", async () => {
  const { urls } = stub([[item({ name: "one" }), item({ name: "two" })]]);
  const tools = await listAllTools();
  expect(tools.map((t) => t.name)).toEqual(["one", "two"]);
  expect(urls.length).toBe(1);
});

test("listAllTools pages past a full page and returns every row", async () => {
  const full = Array.from({ length: PAGE_SIZE }, (_, i) => item({ name: `t${i}` }));
  const { urls } = stub([full, [item({ name: "last" })]]);
  const tools = await listAllTools();
  expect(tools.length).toBe(PAGE_SIZE + 1);
  expect(tools[tools.length - 1]!.name).toBe("last");
  expect(urls.length).toBe(2);
  expect(urls[0]).toContain("offset=0");
  expect(urls[1]).toContain(`offset=${PAGE_SIZE}`);
});

test("listAllTools sends repeated name filters", async () => {
  const { urls } = stub([[item({ name: "end_call" })]]);
  await listAllTools(["end_call"]);
  expect(urls[0]).toContain("name=end_call");
});

test("listAllTools surfaces a failed request as an error", async () => {
  globalThis.fetch = (async () =>
    new Response(JSON.stringify({ detail: "nope", error: { code: "X", message: "nope", request_id: "rid-1" } }), {
      status: 500,
    })) as unknown as typeof fetch;
  await expect(listAllTools()).rejects.toThrow(/nope/);
});

// ---------------------------------------------------------------------------
// Action-level tests. These spawn the real CLI against a local stub server, so
// they cover exit codes and the stdout/stderr split that unit tests cannot see.
// ---------------------------------------------------------------------------

const CLI_DIR = `${import.meta.dir}/../..`;

async function runCli(
  args: string[],
  handler: (req: Request) => Response | Promise<Response>,
  opts: { stdin?: string } = {},
): Promise<{ stdout: string; stderr: string; code: number; calls: string[] }> {
  const calls: string[] = [];
  const server = Bun.serve({
    port: 0,
    fetch(req) {
      calls.push(`${req.method} ${new URL(req.url).pathname}`);
      return handler(req);
    },
  });
  try {
    const proc = Bun.spawn(["bun", "run", "src/index.ts", ...args], {
      cwd: CLI_DIR,
      env: {
        ...process.env,
        VOICEAI_AGENTS_BASE_URL: `http://localhost:${server.port}`,
        VOICEAI_API_KEY: "slng_test_key",
      },
      stdin: opts.stdin === undefined ? "ignore" : new TextEncoder().encode(opts.stdin),
      stdout: "pipe",
      stderr: "pipe",
    });
    const [stdout, stderr] = await Promise.all([
      new Response(proc.stdout).text(),
      new Response(proc.stderr).text(),
    ]);
    return { stdout, stderr, code: await proc.exited, calls };
  } finally {
    server.stop(true);
  }
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

const single = [item({ id: "id-org", name: "end_call", latest_version: 3 })];

function detailServer(rows: ToolListItem[]) {
  return (req: Request) => {
    const path = new URL(req.url).pathname;
    if (path === "/v1/agents/tools") return json(rows);
    const id = path.split("/").pop();
    const row = rows.find((r) => r.id === id);
    return row
      ? json({ ...row, organisation_id: "org-1", config: null, declared_secrets: [], dependencies: [], argument_defaults: {}, code_src: "a\nb\nc", content_hash: "h", is_current_hash_green: true, is_current_version: true, schema_stale: false, gate_status: {} })
      : json({ detail: "Tool not found", error: { code: "RESOURCE_NOT_FOUND", message: "Tool not found", request_id: "rid-9" } }, 404);
  };
}

// --- get: the resolved row (FR-006, FR-009) --------------------------------

test("get resolves the name to its detail record", async () => {
  const r = await runCli(["tool", "get", "end_call"], detailServer(single));
  expect(r.code).toBe(0);
  expect(r.stdout).toContain("latest_version        3");
  expect(r.stderr).toBe("");
});

test("get --json emits a single object, never an array", async () => {
  const r = await runCli(["tool", "get", "end_call", "--json"], detailServer(single));
  const parsed = JSON.parse(r.stdout);
  expect(Array.isArray(parsed)).toBe(false);
  expect(parsed.latest_version).toBe(3);
});

// --- get: not found (FR-007) -----------------------------------------------

test("get exits 1 and explains case sensitivity when nothing matches", async () => {
  const r = await runCli(["tool", "get", "NOPE"], () => json([]));
  expect(r.code).toBe(1);
  expect(r.stderr).toContain("case-sensitive");
  expect(r.stdout).toBe("");
});

test("get --json still emits parseable JSON when it fails", async () => {
  const r = await runCli(["tool", "get", "NOPE", "--json"], () => json([]));
  expect(r.code).toBe(1);
  expect(JSON.parse(r.stdout).ok).toBe(false);
});

// --- list: piping and empty state (FR-008, FR-009, SC-003) -----------------

test("list writes only data to stdout when not a TTY", async () => {
  const r = await runCli(["tool", "list"], () => json([item({ name: "solo", tool_type: "code", latest_version: null })]));
  expect(r.code).toBe(0);
  expect(r.stdout).toBe("NAME\tTYPE\tVERSION\nsolo\tcode\t-\n");
});

test("list reports an empty catalogue and still exits 0", async () => {
  const r = await runCli(["tool", "list"], () => json([]));
  expect(r.code).toBe(0);
  expect(r.stdout.trim()).toBe("no tools found.");
});

// The server dropped `source` from the list row; the flag went with it.
test("list no longer accepts --source", async () => {
  const r = await runCli(["tool", "list", "--source", "org"], () => json([]));
  expect(r.code).toBe(1);
  expect(r.stderr).toContain("unknown option");
});

// --- failure modes that cannot be induced live (FR-013, SC-004) ------------

test("a disabled organisation gets the machine-readable code", async () => {
  const r = await runCli(["tool", "list"], () =>
    json({ detail: "d", error: { code: "PUBLIC_SHARED_RESOURCES_DISABLED", message: "Shared resources are disabled", request_id: "rid-1" } }, 403),
  );
  expect(r.code).toBe(1);
  expect(r.stderr).toContain("PUBLIC_SHARED_RESOURCES_DISABLED");
  expect(r.stderr).toContain("rid-1");
});

test("a rate limit reports the Retry-After wait", async () => {
  const r = await runCli(["tool", "list"], () =>
    new Response(JSON.stringify({ detail: "slow down", error: { code: "RATE_LIMITED", message: "slow down", request_id: "rid-2" } }), {
      status: 429,
      headers: { "content-type": "application/json", "retry-after": "42" },
    }),
  );
  expect(r.code).toBe(1);
  expect(r.stderr).toContain("retry after 42s");
});

test("no output contains the API key", async () => {
  const r = await runCli(["tool", "list"], () => json({ detail: "bad key", error: { code: "UNAUTHORIZED", message: "bad key", request_id: "r" } }, 401));
  expect(r.code).toBe(1);
  expect(r.stdout + r.stderr).not.toContain("slng_test_key");
});

// --- run -------------------------------------------------------------------

/** Stub answering the name lookup and the run, with a settable outcome. */
function runStub(result: Record<string, unknown> = { status: "succeeded" }, status = 200) {
  return (req: Request) =>
    new URL(req.url).pathname === "/v1/agents/tools" ? json(single) : json(result, status);
}

// push sets the precedent: executing real dependencies is opted into. A softer
// rule for the lower-ceremony command is how someone's webhook fires in a demo.
test("run refuses without consent, and executes nothing", async () => {
  const r = await runCli(["tool", "run", "end_call"], runStub());
  expect(r.code).toBe(1);
  expect(r.stderr).toContain("--confirm-side-effects");
  expect(r.calls).toEqual([]);
  expect(r.stdout).toBe("");
});

test("run executes with consent and exits 0 on success", async () => {
  const r = await runCli(["tool", "run", "end_call", "--confirm-side-effects"], runStub());
  expect(r.code).toBe(0);
  expect(r.stdout).toContain("status                succeeded");
  expect(r.calls).toContain("POST /v1/agents/tools/id-org/run");
});

test("run takes its input from stdin", async () => {
  let seen: unknown;
  const r = await runCli(
    ["tool", "run", "end_call", "--confirm-side-effects"],
    async (req) => {
      if (new URL(req.url).pathname === "/v1/agents/tools") return json(single);
      seen = await req.json();
      return json({ status: "succeeded" });
    },
    { stdin: '{"reason":"done"}' },
  );
  expect(r.code).toBe(0);
  expect(seen).toEqual({ sample_input: { reason: "done" }, confirm_side_effects: true });
});

test("run rejects malformed input before executing anything", async () => {
  const r = await runCli(["tool", "run", "end_call", "--confirm-side-effects"], runStub(), {
    stdin: "{not json",
  });
  expect(r.code).toBe(1);
  expect(r.stderr).toContain("invalid JSON in stdin");
  expect(r.calls).toEqual([]);
});

// A run that COMPLETED and failed is data, not a transport error: --json
// returns the run result itself, and the exit code still says it failed.
test("run exits 1 on a failed run and reports the platform's error", async () => {
  const r = await runCli(
    ["tool", "run", "end_call", "--confirm-side-effects", "--json"],
    runStub({ status: "failed", error: "HTTPError: 404" }),
  );
  expect(r.code).toBe(1);
  expect(JSON.parse(r.stdout)).toEqual({ status: "failed", error: "HTTPError: 404" });
});

test("run names the offending fields when the input fails the schema", async () => {
  const r = await runCli(
    ["tool", "run", "end_call", "--confirm-side-effects"],
    runStub({ status: "failed", validation: "reason: field required" }),
  );
  expect(r.code).toBe(1);
  expect(r.stdout).toContain("reason: field required");
});

test("run reports an unknown name the way get does", async () => {
  const r = await runCli(["tool", "run", "NOPE", "--confirm-side-effects"], () => json([]));
  expect(r.code).toBe(1);
  expect(r.stderr).toContain("not found. names are matched exactly and are case-sensitive.");
});

test("run --json stays one valid document on failure", async () => {
  const r = await runCli(["tool", "run", "NOPE", "--confirm-side-effects", "--json"], () => json([]));
  expect(r.code).toBe(1);
  expect(JSON.parse(r.stdout).ok).toBe(false);
});

// The input may carry a secret and nothing here needs to show it back.
test("run never echoes the input document", async () => {
  const r = await runCli(["tool", "run", "end_call", "--confirm-side-effects"], runStub(), {
    stdin: '{"token":"sk-super-secret"}',
  });
  expect(r.stdout + r.stderr).not.toContain("sk-super-secret");
});
