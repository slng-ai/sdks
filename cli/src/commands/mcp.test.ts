import { test, expect, afterEach } from "bun:test";
import { listAllServers, cell, firstLine, PAGE_SIZE, type McpServerListItem } from "./mcp";

process.env.VOICEAI_API_KEY = "slng_test_key";

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

function item(over: Partial<McpServerListItem> = {}): McpServerListItem {
  return {
    id: "00000000-0000-0000-0000-000000000000",
    name: "a_server",
    url_template: "https://mcp.example.com/mcp",
    transport: "streamable_http",
    revision: 1,
    capability_status: "healthy",
    capability_observed_at: "2026-08-25T07:51:14.049890Z",
    capability_tool_count: 26,
    ...over,
  };
}

/** Stub fetch, recording every URL it is called with. */
function stub(pages: McpServerListItem[][]): { urls: string[] } {
  const urls: string[] = [];
  let n = 0;
  globalThis.fetch = (async (url: URL | string) => {
    urls.push(String(url));
    const body = JSON.stringify(pages[n++] ?? []);
    return new Response(body, { status: 200, headers: { "content-type": "application/json" } });
  }) as typeof fetch;
  return { urls };
}

// --- cell ------------------------------------------------------------------

test("cell renders an unset field as - and never blank", () => {
  expect(cell(null)).toBe("-");
  expect(cell(undefined)).toBe("-");
  expect(cell("")).toBe("-");
  // A server with no tools is 0, not missing.
  expect(cell(0)).toBe("0");
  expect(cell("healthy")).toBe("healthy");
});

// --- firstLine -------------------------------------------------------------

test("firstLine takes the first non-empty line, since descriptions open with a newline", () => {
  expect(firstLine("\nRetrieve a page.\n\nMore prose.")).toBe("Retrieve a page.");
});

test("firstLine clips a long line and marks it", () => {
  const out = firstLine("x".repeat(200));
  expect(out.length).toBe(100);
  expect(out.endsWith("\u2026")).toBe(true);
});

test("firstLine renders a missing description as -", () => {
  expect(firstLine(null)).toBe("-");
  expect(firstLine("   \n  ")).toBe("-");
});

// --- pagination ------------------------------------------------------------

test("listAllServers stops after a short page and issues one request", async () => {
  const { urls } = stub([[item({ name: "one" }), item({ name: "two" })]]);
  const servers = await listAllServers();
  expect(servers.map((s) => s.name)).toEqual(["one", "two"]);
  expect(urls.length).toBe(1);
  expect(urls[0]).toContain("/v1/agents/mcp-servers");
});

test("listAllServers pages past a full page and returns every row", async () => {
  const full = Array.from({ length: PAGE_SIZE }, (_, i) => item({ name: `s${i}` }));
  const { urls } = stub([full, [item({ name: "last" })]]);
  const servers = await listAllServers();
  expect(servers.length).toBe(PAGE_SIZE + 1);
  expect(servers[servers.length - 1]!.name).toBe("last");
  expect(urls[0]).toContain("offset=0");
  expect(urls[1]).toContain(`offset=${PAGE_SIZE}`);
});

test("listAllServers sends repeated name filters", async () => {
  const { urls } = stub([[item({ name: "firecrawl-mcp" })]]);
  await listAllServers(["firecrawl-mcp"]);
  expect(urls[0]).toContain("name=firecrawl-mcp");
});

test("listAllServers surfaces a failed request as an error", async () => {
  globalThis.fetch = (async () =>
    new Response(
      JSON.stringify({ detail: "nope", error: { code: "X", message: "nope", request_id: "rid-1" } }),
      { status: 500 },
    )) as unknown as typeof fetch;
  await expect(listAllServers()).rejects.toThrow(/nope/);
});

// ---------------------------------------------------------------------------
// Action-level: the real CLI against a stub API. The only way to assert exit
// codes and the stdout/stderr split.
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

const single = [item({ id: "id-1", name: "firecrawl-mcp" })];

function detailServer(rows: McpServerListItem[]) {
  return (req: Request) => {
    const path = new URL(req.url).pathname;
    if (path === "/v1/agents/mcp-servers") return json(rows);
    const id = path.split("/").pop();
    const row = rows.find((r) => r.id === id);
    return row
      ? json({
          ...row,
          organisation_id: "org-1",
          description: "web tools",
          auth: { type: "bearer", secret_name: "FIRECRAWL_API_KEY" },
          headers: [],
          capabilities: {
            tools: [
              { name: "scrape", description: "\nFetch one page.\n\nDetails.", input_schema: { required: ["url"] } },
              { name: "search", description: "Search the web." },
            ],
            truncated: false,
          },
          capabilities_hash: "h",
          capability_error_code: null,
          capability_error_message: null,
        })
      : json(
          {
            detail: "MCP server not found",
            error: { code: "RESOURCE_NOT_FOUND", message: "MCP server not found", request_id: "rid-9" },
          },
          404,
        );
  };
}

test("list writes only data to stdout when not a TTY", async () => {
  const r = await runCli(["mcp", "list"], () =>
    json([item({ name: "solo", capability_tool_count: null })]),
  );
  expect(r.code).toBe(0);
  expect(r.stdout).toBe("NAME\tTRANSPORT\tSTATUS\tTOOLS\nsolo\tstreamable_http\thealthy\t-\n");
});

test("list reports an empty catalogue and still exits 0", async () => {
  const r = await runCli(["mcp", "list"], () => json([]));
  expect(r.code).toBe(0);
  expect(r.stdout.trim()).toBe("no mcp servers found.");
});

test("get resolves the name to its detail record", async () => {
  const r = await runCli(["mcp", "get", "firecrawl-mcp"], detailServer(single));
  expect(r.code).toBe(0);
  expect(r.stdout).toContain("firecrawl-mcp");
  expect(r.stdout).toContain("streamable_http");
  expect(r.stderr).toBe("");
});

// The probe carries every tool's full description; the terminal gets a count.
test("get summarises capabilities as a tool count, not the whole probe", async () => {
  const r = await runCli(["mcp", "get", "firecrawl-mcp"], detailServer(single));
  expect(r.stdout).toContain("2 tools (use --json for the schemas)");
  expect(r.stdout).not.toContain("scrape");
});

// Auth names a vault secret. The name is safe to print; there is no value to leak.
test("get prints the auth secret's name only, never a value", async () => {
  const r = await runCli(["mcp", "get", "firecrawl-mcp", "--json"], detailServer(single));
  const parsed = JSON.parse(r.stdout);
  expect(parsed.auth.secret_name).toBe("FIRECRAWL_API_KEY");
  expect(parsed.auth).not.toHaveProperty("value");
});

test("get --json emits a single object, never an array", async () => {
  const r = await runCli(["mcp", "get", "firecrawl-mcp", "--json"], detailServer(single));
  expect(Array.isArray(JSON.parse(r.stdout))).toBe(false);
});

test("get exits 1 and explains case sensitivity when nothing matches", async () => {
  const r = await runCli(["mcp", "get", "NOPE"], () => json([]));
  expect(r.code).toBe(1);
  expect(r.stderr).toContain("case-sensitive");
  expect(r.stdout).toBe("");
});

test("get --json still emits parseable JSON when it fails", async () => {
  const r = await runCli(["mcp", "get", "NOPE", "--json"], () => json([]));
  expect(r.code).toBe(1);
  expect(JSON.parse(r.stdout).ok).toBe(false);
});

// A row can exist in the list and 404 on the detail fetch — a race, or a delete
// between the two requests.
test("get reports a detail 404 with the API's own code", async () => {
  const r = await runCli(["mcp", "get", "firecrawl-mcp"], (req) =>
    new URL(req.url).pathname === "/v1/agents/mcp-servers"
      ? json(single)
      : json(
          {
            detail: "MCP server not found",
            error: { code: "RESOURCE_NOT_FOUND", message: "gone", request_id: "rid-9" },
          },
          404,
        ),
  );
  expect(r.code).toBe(1);
  expect(r.stderr).toContain("RESOURCE_NOT_FOUND");
  expect(r.stdout).toBe("");
});

test("a disabled organisation gets the machine-readable code", async () => {
  const r = await runCli(["mcp", "list"], () =>
    json(
      {
        detail: "d",
        error: {
          code: "PUBLIC_SHARED_RESOURCES_DISABLED",
          message: "Shared resources are disabled",
          request_id: "rid-1",
        },
      },
      403,
    ),
  );
  expect(r.code).toBe(1);
  expect(r.stderr).toContain("PUBLIC_SHARED_RESOURCES_DISABLED");
  expect(r.stdout).toBe("");
});

test("a rate limit surfaces Retry-After", async () => {
  const r = await runCli(["mcp", "list"], () =>
    new Response(JSON.stringify({ detail: "slow down" }), {
      status: 429,
      headers: { "content-type": "application/json", "retry-after": "30" },
    }),
  );
  expect(r.code).toBe(1);
  expect(r.stderr).toContain("30");
});

// --- tools -----------------------------------------------------------------

test("tools lists the probed tools, one per line", async () => {
  const r = await runCli(["mcp", "tools", "firecrawl-mcp"], detailServer(single));
  expect(r.code).toBe(0);
  expect(r.stdout).toBe("NAME\tDESCRIPTION\nscrape\tFetch one page.\nsearch\tSearch the web.\n");
});

test("tools --json emits the array with each schema", async () => {
  const r = await runCli(["mcp", "tools", "firecrawl-mcp", "--json"], detailServer(single));
  const parsed = JSON.parse(r.stdout);
  expect(Array.isArray(parsed)).toBe(true);
  expect(parsed[0].input_schema.required).toEqual(["url"]);
});

// A truncated probe is a short list, not a short server.
test("tools warns on stderr when the probe was truncated", async () => {
  const r = await runCli(["mcp", "tools", "s"], (req) =>
    new URL(req.url).pathname === "/v1/agents/mcp-servers"
      ? json([item({ id: "id-1", name: "s" })])
      : json({ ...item({ id: "id-1", name: "s" }), capabilities: { tools: [{ name: "one" }], truncated: true } }),
  );
  expect(r.code).toBe(0);
  expect(r.stderr).toContain("truncated");
  expect(r.stdout).toContain("one");
});

test("tools distinguishes an unprobed server from one with no tools", async () => {
  const unprobed = (req: Request) =>
    new URL(req.url).pathname === "/v1/agents/mcp-servers"
      ? json([item({ id: "id-1", name: "s", capability_observed_at: null })])
      : json({ ...item({ id: "id-1", name: "s", capability_observed_at: null }), capabilities: null });
  const r = await runCli(["mcp", "tools", "s"], unprobed);
  expect(r.code).toBe(0);
  expect(r.stdout.trim()).toBe("this server has not been probed yet.");

  const probed = (req: Request) =>
    new URL(req.url).pathname === "/v1/agents/mcp-servers"
      ? json([item({ id: "id-1", name: "s" })])
      : json({ ...item({ id: "id-1", name: "s" }), capabilities: { tools: [] } });
  const r2 = await runCli(["mcp", "tools", "s"], probed);
  expect(r2.stdout.trim()).toBe("the last probe reported no tools.");
});
