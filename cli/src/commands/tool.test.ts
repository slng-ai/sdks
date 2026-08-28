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
  globalThis.fetch = (async (_url: URL | string) =>
    new Response(JSON.stringify({ detail: "nope", error: { code: "X", message: "nope", request_id: "rid-1" } }), {
      status: 500,
    })) as typeof fetch;
  await expect(listAllTools()).rejects.toThrow(/nope/);
});

// ---------------------------------------------------------------------------
// Action-level tests. These spawn the real CLI against a local stub server, so
// they cover exit codes and the stdout/stderr split that unit tests cannot see.
// ---------------------------------------------------------------------------

const CLI_DIR = `${import.meta.dir}/../..`;

async function runCli(
  args: string[],
  handler: (req: Request) => Response,
): Promise<{ stdout: string; stderr: string; code: number }> {
  const server = Bun.serve({ port: 0, fetch: handler });
  try {
    const proc = Bun.spawn(["bun", "run", "src/index.ts", ...args], {
      cwd: CLI_DIR,
      env: {
        ...process.env,
        VOICEAI_AGENTS_BASE_URL: `http://localhost:${server.port}`,
        VOICEAI_API_KEY: "slng_test_key",
      },
      stdout: "pipe",
      stderr: "pipe",
    });
    const [stdout, stderr] = await Promise.all([
      new Response(proc.stdout).text(),
      new Response(proc.stderr).text(),
    ]);
    return { stdout, stderr, code: await proc.exited };
  } finally {
    server.stop(true);
  }
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

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

// --- get: code and MCP details ---------------------------------------------

test("get returns full code tool details", async () => {
  const rows = [item({ id: "id-code", name: "echo", latest_version: 3 })];
  const r = await runCli(["tool", "get", "echo"], detailServer(rows));
  expect(r.code).toBe(0);
  expect(r.stdout).toContain("latest_version        3");
  expect(r.stdout).toContain("code_src              3 lines");
});

test("get falls back to MCP and returns discovered tool schemas", async () => {
  const r = await runCli(["tool", "get", "knowledge", "--json"], (req) => {
    const path = new URL(req.url).pathname;
    if (path === "/v1/agents/tools") return json([]);
    if (path === "/v1/agents/mcp-servers") {
      return json([
        {
          id: "mcp-1",
          name: "knowledge",
          url_template: "https://mcp.example.com",
          transport: "streamable_http",
          revision: 2,
          capability_status: "healthy",
          capability_observed_at: "2026-08-28T12:00:00Z",
          capability_tool_count: 1,
        },
      ]);
    }
    return json({
      id: "mcp-1",
      name: "knowledge",
      url_template: "https://mcp.example.com",
      transport: "streamable_http",
      revision: 2,
      capability_status: "healthy",
      capability_observed_at: "2026-08-28T12:00:00Z",
      capability_tool_count: 1,
      capabilities: {
        tools: [{ name: "search", input_schema: { type: "object" }, output_schema: null }],
        truncated: false,
        pages_fetched: 1,
      },
    });
  });
  expect(r.code).toBe(0);
  const parsed = JSON.parse(r.stdout);
  expect(parsed.name).toBe("knowledge");
  expect(parsed.capabilities.tools[0].name).toBe("search");
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
