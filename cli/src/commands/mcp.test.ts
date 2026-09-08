import { test, expect, afterEach } from "bun:test";
import {
  listAllServers,
  cell,
  firstLine,
  isSnapshotStale,
  diffToolNames,
  PAGE_SIZE,
  type McpServerDetail,
  type McpServerListItem,
} from "./mcp";

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

// --- isSnapshotStale -------------------------------------------------------

const NOW = new Date("2026-09-01T10:00:00Z");

function detail(over: Partial<McpServerDetail> = {}): McpServerDetail {
  return {
    ...item(),
    capability_observed_at: "2026-09-01T09:58:00Z",
    next_refresh_at: "2026-09-01T10:03:00Z",
    ...over,
  } as McpServerDetail;
}

test("a healthy snapshot with a future refresh is fresh", () => {
  expect(isSnapshotStale(detail(), NOW)).toBe(false);
});

test("a snapshot whose refresh time has passed is stale", () => {
  expect(isSnapshotStale(detail({ next_refresh_at: "2026-09-01T09:59:00Z" }), NOW)).toBe(true);
});

test("an unhealthy server is stale whatever its timestamps say", () => {
  expect(isSnapshotStale(detail({ capability_status: "unreachable" }), NOW)).toBe(true);
});

test("a server that has never been probed is stale", () => {
  expect(isSnapshotStale(detail({ capability_observed_at: null }), NOW)).toBe(true);
});

// No scheduled refresh is not evidence of staleness — only a past one is.
test("a healthy server with no scheduled refresh is fresh", () => {
  expect(isSnapshotStale(detail({ next_refresh_at: null }), NOW)).toBe(false);
});

// --- diffToolNames ---------------------------------------------------------

test("diffToolNames reports what appeared and what went away", () => {
  const d = diffToolNames([{ name: "a" }, { name: "b" }], [{ name: "b" }, { name: "c" }]);
  expect(d).toEqual({ added: ["c"], removed: ["a"], firstProbe: false });
});

test("diffToolNames reports no change when the set is identical", () => {
  const d = diffToolNames([{ name: "a" }], [{ name: "a" }]);
  expect(d).toEqual({ added: [], removed: [], firstProbe: false });
});

// A server nobody has probed has no previous set. Calling all 26 tools "added"
// would read as 26 new tools appearing, which is not what happened.
test("diffToolNames marks a never-probed server as a first probe", () => {
  const d = diffToolNames(null, [{ name: "a" }, { name: "b" }]);
  expect(d).toEqual({ added: [], removed: [], firstProbe: true });
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

// --- run -------------------------------------------------------------------

/** Stub that answers the list, the detail, and the connect. */
function runServer(
  over: {
    previous?: { name: string }[] | null;
    current?: { name: string }[];
    status?: string;
    observedAt?: string | null;
    connectStatus?: number;
  } = {},
) {
  const row = item({
    id: "id-1",
    name: "s",
    capability_observed_at: over.observedAt === undefined ? "2026-09-01T09:00:00Z" : over.observedAt,
  });
  return (req: Request) => {
    const path = new URL(req.url).pathname;
    if (path === "/v1/agents/mcp-servers") return json([row]);
    if (path.endsWith("/connect")) {
      return json(
        {
          status: over.status ?? "connected",
          latency_ms: 42,
          server_info: { name: "stub-mcp", version: "9.9" },
          protocol_version: "2025-03-26",
          capabilities: { tools: over.current ?? [{ name: "one" }] },
        },
        over.connectStatus ?? 200,
      );
    }
    return json({ ...row, capabilities: { tools: over.previous ?? [{ name: "one" }] } });
  };
}

test("run reports the connection and exits 0", async () => {
  const r = await runCli(["mcp", "run", "s"], runServer());
  expect(r.code).toBe(0);
  expect(r.stdout).toContain("connected in 42 ms");
  expect(r.stdout).toContain("stub-mcp 9.9");
  expect(r.stdout).toContain("2025-03-26");
  expect(r.stderr).toBe("");
});

test("run names the tools that appeared and went away", async () => {
  const r = await runCli(
    ["mcp", "run", "s"],
    runServer({
      previous: [{ name: "one" }, { name: "gone" }],
      current: [{ name: "one" }, { name: "new" }],
    }),
  );
  expect(r.stdout).toContain("+new");
  expect(r.stdout).toContain("-gone");
});

test("run says none when nothing changed", async () => {
  const r = await runCli(["mcp", "run", "s"], runServer());
  expect(r.stdout).toContain("none");
});

// 26 tools on a never-probed server is a first probe, not 26 additions.
test("run marks a never-probed server as a first probe", async () => {
  const r = await runCli(
    ["mcp", "run", "s"],
    runServer({ observedAt: null, previous: null, current: [{ name: "a" }, { name: "b" }] }),
  );
  expect(r.stdout).toContain("first probe — 2 tools discovered");
});

// A 200 that says anything but `connected` is still a server that did not work.
test("run exits 1 when the server answers with an error state", async () => {
  const r = await runCli(["mcp", "run", "s"], runServer({ status: "unreachable" }));
  expect(r.code).toBe(1);
  expect(r.stdout).toContain("unreachable");
});

test("run surfaces the platform's own reason when the connect fails", async () => {
  const r = await runCli(["mcp", "run", "s"], runServer({ connectStatus: 502, status: "x" }));
  expect(r.code).toBe(1);
  expect(r.stderr).toContain("502");
  expect(r.stdout).toBe("");
});

test("run reports an unknown name the way get does", async () => {
  const r = await runCli(["mcp", "run", "NOPE"], () => json([]));
  expect(r.code).toBe(1);
  expect(r.stderr).toContain("not found. names are matched exactly and are case-sensitive.");
  expect(r.stdout).toBe("");
});

test("run --json stays one valid document on failure", async () => {
  const r = await runCli(["mcp", "run", "NOPE", "--json"], () => json([]));
  expect(r.code).toBe(1);
  expect(JSON.parse(r.stdout).ok).toBe(false);
});

// --- --id: id-addressed get/run, no name lookup, no redirect on reuse ------

const ID_SERVER = "srv-abc-1";
const OTHER_SERVER = "srv-other-2";

/** Stub answering the by-id detail, the connect, and (optionally) a re-read. */
function idServer(opts: {
  detail?: Record<string, unknown>;
  connectStatus?: number;
  connectBody?: Record<string, unknown>;
  // What the post-connect re-read of ID_SERVER answers with. Defaults to the
  // same detail record, i.e. the happy path.
  reread?: Record<string, unknown> | "not_found";
}) {
  let connectCalls = 0;
  return (req: Request) => {
    const path = new URL(req.url).pathname;
    if (path === "/v1/agents/mcp-servers") {
      // --id must never hit the list-by-name endpoint. Any request here is a bug.
      return json(
        { detail: "should not be called in --id mode", error: { code: "X", message: "x", request_id: "r" } },
        500,
      );
    }
    if (path.endsWith("/connect")) {
      connectCalls++;
      return json(
        opts.connectBody ?? {
          status: "connected",
          latency_ms: 9,
          server_info: { name: "stub", version: "1.0" },
          protocol_version: "2025-03-26",
          capabilities: { tools: [{ name: "one" }] },
        },
        opts.connectStatus ?? 200,
      );
    }
    const dMatch = path.match(/^\/v1\/agents\/mcp-servers\/([^/]+)$/);
    if (dMatch) {
      const id = dMatch[1];
      // The re-read happens after the connect; distinguish it so a test can
      // answer the first (pre-connect) read and the re-read differently.
      const isReread = connectCalls > 0;
      if (isReread && opts.reread !== undefined) {
        return opts.reread === "not_found"
          ? json({ detail: "not found" }, 404)
          : json(opts.reread);
      }
      if (id === ID_SERVER && opts.detail) return json(opts.detail);
      return json({ detail: "MCP server not found" }, 404);
    }
    return json({ detail: "unstubbed" }, 500);
  };
}

function serverDetail(over: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    ...item({ id: ID_SERVER, name: "docs" }),
    organisation_id: "org-1",
    description: "docs",
    auth: { type: "none" },
    headers: [],
    capabilities: { tools: [{ name: "one" }], truncated: false },
    capabilities_hash: "h",
    capability_error_code: null,
    capability_error_message: null,
    ...over,
  };
}

test("get --id reads the server directly, skipping the name lookup entirely", async () => {
  const r = await runCli(["mcp", "get", ID_SERVER, "--id", "--json"], idServer({ detail: serverDetail() }));
  expect(r.code).toBe(0);
  expect(JSON.parse(r.stdout).id).toBe(ID_SERVER);
});

test("get --id on an unknown id exits 1 without ever listing by name", async () => {
  const r = await runCli(["mcp", "get", "nope-id", "--id", "--json"], idServer({}));
  expect(r.code).toBe(1);
});

// The whole point of --id: even if another server now holds the name this one
// used to have (or ever had), addressing by id cannot be redirected to it.
test("a same-named different server cannot redirect an --id probe", async () => {
  const decoy = (req: Request) => {
    const path = new URL(req.url).pathname;
    if (path === `/v1/agents/mcp-servers/${ID_SERVER}`) return json(serverDetail({ name: "docs" }));
    // Any other server, sharing the name "docs" — must never be reached.
    if (path === `/v1/agents/mcp-servers/${OTHER_SERVER}`) {
      return json(serverDetail({ id: OTHER_SERVER, name: "docs" }));
    }
    if (path === "/v1/agents/mcp-servers") {
      return json({ detail: "list must not be called in --id mode" }, 500);
    }
    return json({ detail: "unstubbed" }, 500);
  };
  const r = await runCli(["mcp", "get", ID_SERVER, "--id", "--json"], decoy);
  expect(r.code).toBe(0);
  expect(JSON.parse(r.stdout).id).toBe(ID_SERVER);
});

// --- pipe truncation regression ---------------------------------------------
//
// Bun-compiled binaries have repeatedly truncated a large stdout write at a
// power-of-two boundary (most often 64KB) when the output is captured
// through a real OS pipe rather than a TTY or a file redirect — see
// oven-sh/bun#25432, oven-sh/bun#28145, oven-sh/bun#20562. That is invisible
// to any test that only exercises the in-process formatter or writes to a
// file: it only shows up over a genuine pipe, which is what Bun.spawn's
// stdout: "pipe" gives runCli — the same transport a Go/Node parent reading
// this CLI through exec.Command/child_process actually uses.
test("get --json delivers a document past the 64KB pipe boundary whole", async () => {
  const manyTools = Array.from({ length: 90 }, (_, i) => ({
    name: `tool_${i}`,
    description: `Tool number ${i}. `.repeat(20),
    input_schema: {
      type: "object",
      properties: { arg: { type: "string", description: "x".repeat(80) } },
      required: ["arg"],
    },
    output_schema: { type: "object", properties: { ok: { type: "boolean" } } },
    schema_hash: `hash_${i}_${"a".repeat(40)}`,
  }));
  const big = serverDetail({ capabilities: { tools: manyTools, truncated: false } });
  const expected = `${JSON.stringify(big, null, 2)}\n`;
  // Confirms the fixture actually clears the boundary this test exists to
  // guard — Linux's default pipe buffer is 64KiB (65536 bytes).
  expect(Buffer.byteLength(expected, "utf8")).toBeGreaterThan(65536);

  const r = await runCli(["mcp", "get", ID_SERVER, "--id", "--json"], idServer({ detail: big }));

  expect(r.code).toBe(0);
  expect(Buffer.byteLength(r.stdout, "utf8")).toBe(Buffer.byteLength(expected, "utf8"));
  expect(r.stdout).toBe(expected);
  expect(JSON.parse(r.stdout).capabilities.tools.length).toBe(90);
});

test("run --id connects by id, skipping the name lookup", async () => {
  const r = await runCli(["mcp", "run", ID_SERVER, "--id"], idServer({ detail: serverDetail() }));
  expect(r.code).toBe(0);
  expect(r.stdout).toContain("connected in 9 ms");
});

test("run --id re-reads the same id after connecting and succeeds when identity holds", async () => {
  const r = await runCli(
    ["mcp", "run", ID_SERVER, "--id", "--json"],
    idServer({ detail: serverDetail(), reread: serverDetail() }),
  );
  expect(r.code).toBe(0);
  expect(JSON.parse(r.stdout).status).toBe("connected");
});

test("run --id fails when the post-connect re-read cannot find the server any more", async () => {
  const r = await runCli(
    ["mcp", "run", ID_SERVER, "--id", "--json"],
    idServer({ detail: serverDetail(), reread: "not_found" }),
  );
  expect(r.code).toBe(1);
  expect(JSON.parse(r.stdout).ok).toBe(false);
});

test("run --id fails when the post-connect re-read reports a different identity", async () => {
  const r = await runCli(
    ["mcp", "run", ID_SERVER, "--id"],
    idServer({ detail: serverDetail(), reread: serverDetail({ id: OTHER_SERVER }) }),
  );
  expect(r.code).toBe(1);
  expect(r.stderr).toContain("changed identity");
});

// Name mode is untouched: no re-read happens, and a failed connect still exits
// 1 exactly as it did before --id existed.
test("run without --id issues no post-connect re-read", async () => {
  const r = await runCli(["mcp", "run", "s"], runServer());
  expect(r.code).toBe(0);
});

test("run --json carries the connect result plus the diff", async () => {
  const r = await runCli(
    ["mcp", "run", "s", "--json"],
    runServer({ previous: [{ name: "gone" }], current: [{ name: "new" }] }),
  );
  const doc = JSON.parse(r.stdout);
  expect(doc.status).toBe("connected");
  expect(doc.added).toEqual(["new"]);
  expect(doc.removed).toEqual(["gone"]);
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
