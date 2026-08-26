import { test, expect, afterEach } from "bun:test";
import {
  collectTrunks,
  mergeReports,
  BATCH_SIZE,
  NO_AGENTS_ERROR,
  type AgentRef,
  type Report,
  type TrunkOption,
  type TrunkOptionsResponse,
} from "./trunks";

process.env.VOICEAI_API_KEY = "slng_test_key";

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

// --- fixtures --------------------------------------------------------------

function agent(id: string, name = `agent-${id}`): AgentRef {
  return { id, name };
}

function option(over: Partial<TrunkOption> = {}): TrunkOption {
  return {
    id: over.id ?? "trunk-1",
    name: over.name ?? "a_trunk",
    livekit_trunk_id: over.livekit_trunk_id ?? "ST_abc",
    numbers: over.numbers ?? ["+441423803084"],
    status: over.status ?? "active",
    selectable: over.selectable ?? true,
    is_current: over.is_current ?? false,
    unavailable_reason: over.unavailable_reason ?? null,
    ...over,
  };
}

function report(a: AgentRef, opts: Partial<TrunkOptionsResponse> = {}): Report {
  return { agent: a, options: { inbound: opts.inbound ?? [], outbound: opts.outbound ?? [] } };
}

/**
 * Stub fetch for the whole fan-out: one /v1/agents array, then a
 * sip-trunk-options body per agent id. Records every URL it was called with.
 */
function stub(
  agents: AgentRef[],
  byAgent: Record<string, TrunkOptionsResponse | { status: number }>,
): { urls: string[]; peak: () => number } {
  const urls: string[] = [];
  let inFlight = 0;
  let peak = 0;
  globalThis.fetch = (async (url: URL | string) => {
    const u = String(url);
    urls.push(u);
    const path = new URL(u).pathname;
    if (path === "/v1/agents") {
      return new Response(JSON.stringify(agents), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }
    // Yield so overlapping trunk reads are observable as concurrency.
    inFlight += 1;
    peak = Math.max(peak, inFlight);
    await new Promise((r) => setTimeout(r, 1));
    inFlight -= 1;
    const id = path.split("/")[3];
    const entry = byAgent[id!] ?? { inbound: [], outbound: [] };
    if ("status" in entry) {
      return new Response(JSON.stringify({ detail: "nope" }), {
        status: entry.status,
        headers: { "content-type": "application/json" },
      });
    }
    return new Response(JSON.stringify(entry), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;
  return { urls, peak: () => peak };
}

// --- US1: gather (FR-002, FR-009, FR-020) ----------------------------------

test("collectTrunks issues exactly 1 + N requests for N agents", async () => {
  const agents = [agent("a"), agent("b")];
  const { urls } = stub(agents, {
    a: { inbound: [option()], outbound: [] },
    b: { inbound: [], outbound: [option({ id: "trunk-2" })] },
  });
  const reports = await collectTrunks();
  expect(reports.length).toBe(2);
  expect(urls.length).toBe(3);
  expect(urls.filter((u) => u.endsWith("/v1/agents")).length).toBe(1);
  expect(urls.filter((u) => u.includes("sip-trunk-options")).length).toBe(2);
});

test("collectTrunks throws the distinct no-agents error on an empty agent list", async () => {
  stub([], {});
  expect(collectTrunks()).rejects.toThrow(/no agents/i);
  // The message must not read like an empty trunk list (FR-009).
  expect(NO_AGENTS_ERROR).not.toMatch(/no trunks found/i);
});

test("collectTrunks skips an agent deleted mid-fan-out rather than failing", async () => {
  const agents = [agent("a"), agent("gone")];
  stub(agents, { a: { inbound: [option()], outbound: [] }, gone: { status: 404 } });
  const reports = await collectTrunks();
  expect(reports.map((r) => r.agent.id)).toEqual(["a"]);
});

test("collectTrunks aborts on a non-404 failure instead of returning a partial set", async () => {
  const agents = [agent("a"), agent("b")];
  stub(agents, { a: { inbound: [option()], outbound: [] }, b: { status: 500 } });
  expect(collectTrunks()).rejects.toThrow();
});

test("collectTrunks bounds the fan-out to BATCH_SIZE concurrent reads", async () => {
  const many = Array.from({ length: BATCH_SIZE * 2 + 3 }, (_, i) => agent(`a${i}`));
  const { urls, peak } = stub(many, {});
  const reports = await collectTrunks();
  expect(reports.length).toBe(many.length);
  expect(urls.length).toBe(many.length + 1);
  // Fails if the batching loop is ever replaced by one unbounded Promise.all.
  expect(peak()).toBeLessThanOrEqual(BATCH_SIZE);
  expect(peak()).toBeGreaterThan(1);
});

// --- US1: merge identity and ordering (FR-007) -----------------------------

test("mergeReports lists a trunk reported by two agents exactly once", () => {
  const shared = option({ id: "t1", name: "shared" });
  const trunks = mergeReports([
    report(agent("a"), { outbound: [shared] }),
    report(agent("b"), { outbound: [shared] }),
  ]);
  expect(trunks.length).toBe(1);
  expect(trunks[0]!.name).toBe("shared");
});

test("mergeReports recovers an inbound trunk visible only through the agent it is attached to", () => {
  // The real backend filters this trunk out of agent B's response entirely
  // (assigned_to_another_agent). A single-agent read would miss it — this is
  // the test that fails if the fan-out is ever collapsed. See research D3/D4.
  const hidden = option({ id: "t-in", name: "inbound-in-use", is_current: true });
  const shared = option({ id: "t-out", name: "outbound-shared" });
  const trunks = mergeReports([
    report(agent("a"), { inbound: [hidden], outbound: [shared] }),
    report(agent("b"), { inbound: [], outbound: [shared] }),
  ]);
  expect(trunks.map((t) => t.name).sort()).toEqual(["inbound-in-use", "outbound-shared"]);
});

test("mergeReports keeps inbound and outbound distinct even when ids collide", () => {
  const trunks = mergeReports([
    report(agent("a"), {
      inbound: [option({ id: "same", name: "in" })],
      outbound: [option({ id: "same", name: "out" })],
    }),
  ]);
  expect(trunks.length).toBe(2);
  expect(trunks.map((t) => t.direction)).toEqual(["inbound", "outbound"]);
});

test("mergeReports orders inbound first, then by name, then by id", () => {
  const trunks = mergeReports([
    report(agent("a"), {
      inbound: [option({ id: "z", name: "zeta" }), option({ id: "a", name: "alpha" })],
      outbound: [option({ id: "m", name: "mid" })],
    }),
  ]);
  expect(trunks.map((t) => `${t.direction}:${t.name}`)).toEqual([
    "inbound:alpha",
    "inbound:zeta",
    "outbound:mid",
  ]);
});

test("mergeReports carries the trunk's own properties through unchanged", () => {
  const trunks = mergeReports([
    report(agent("a"), {
      outbound: [option({ id: "t", name: "n", numbers: ["+1", "+2"], status: "degraded" })],
    }),
  ]);
  expect(trunks[0]!.numbers).toEqual(["+1", "+2"]);
  expect(trunks[0]!.status).toBe("degraded");
  expect(trunks[0]!.livekit_trunk_id).toBe("ST_abc");
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

/** A stub API serving an agent list and a per-agent trunk-options body. */
function trunkServer(
  agents: AgentRef[],
  byAgent: Record<string, TrunkOptionsResponse>,
  override?: (path: string) => Response | undefined,
) {
  return (req: Request) => {
    const path = new URL(req.url).pathname;
    const forced = override?.(path);
    if (forced) return forced;
    if (path === "/v1/agents") return json(agents);
    const id = path.split("/")[3];
    return json(byAgent[id!] ?? { inbound: [], outbound: [] });
  };
}

/** Data rows only — drops the header and any trailing blank line. */
function rows(stdout: string): string[] {
  return stdout.trim().split("\n").slice(1).filter(Boolean);
}

// --- US1: action-level (FR-004, FR-009, FR-013) ----------------------------

test("list prints one row per trunk with a header, and exits 0", async () => {
  const { stdout, stderr, code } = await runCli(
    ["trunks", "list"],
    trunkServer([agent("a"), agent("b")], {
      a: { inbound: [option({ id: "t-in", name: "test2slng" })], outbound: [] },
      b: { inbound: [], outbound: [option({ id: "t-out", name: "nicotestslng" })] },
    }),
  );
  expect(code).toBe(0);
  expect(stdout.split("\n")[0]).toBe("DIRECTION\tNAME\tNUMBERS\tSTATUS\tUSABLE\tIN USE BY");
  expect(rows(stdout).length).toBe(2);
  expect(stdout).toContain("inbound\ttest2slng");
  expect(stdout).toContain("outbound\tnicotestslng");
  expect(stderr).not.toContain("DIRECTION");
});

test("list renders a trunk with no numbers as - and never a blank cell", async () => {
  const { stdout } = await runCli(
    ["trunks", "list"],
    trunkServer([agent("a")], { a: { inbound: [option({ numbers: [] })], outbound: [] } }),
  );
  const cells = rows(stdout)[0]!.split("\t");
  expect(cells[2]).toBe("-");
  // Every column present: a blank cell would collapse two for cut/awk.
  expect(cells.length).toBe(6);
  expect(cells.every((c) => c !== "")).toBe(true);
});

test("list reports an empty organisation as success, not failure", async () => {
  const { stdout, code } = await runCli(
    ["trunks", "list"],
    trunkServer([agent("a")], { a: { inbound: [], outbound: [] } }),
  );
  expect(code).toBe(0);
  expect(stdout).toContain("no trunks found.");
});

test("list fails distinctly when the organisation has no agents", async () => {
  const { stdout, stderr, code } = await runCli(["trunks", "list"], trunkServer([], {}));
  expect(code).toBe(1);
  expect(stderr).toMatch(/no agents/i);
  // The false negative FR-009 exists to prevent.
  expect(stdout).not.toContain("no trunks found");
});

test("list emits the completeness note on stderr only", async () => {
  const { stdout, stderr } = await runCli(
    ["trunks", "list"],
    trunkServer([agent("a")], { a: { inbound: [option()], outbound: [] } }),
  );
  expect(stderr).toContain("not visible here");
  expect(stdout).not.toContain("note:");
});

// --- US2: usability merge (FR-005, FR-006) ---------------------------------

test("mergeReports treats a trunk selectable for any agent as usable", () => {
  // different_livekit_project is agent-relative: unusable for A says nothing
  // about the organisation. Usable-somewhere is the honest reading.
  const trunks = mergeReports([
    report(agent("a"), {
      outbound: [option({ id: "t", selectable: false, unavailable_reason: "different_livekit_project" })],
    }),
    report(agent("b"), { outbound: [option({ id: "t", selectable: true })] }),
  ]);
  expect(trunks.length).toBe(1);
  expect(trunks[0]!.usable).toBe(true);
  expect(trunks[0]!.unavailable_reason).toBeNull();
});

test("mergeReports keeps the reason when no agent finds the trunk selectable", () => {
  const trunks = mergeReports([
    report(agent("a"), {
      inbound: [option({ id: "t", selectable: false, is_current: true, unavailable_reason: "inactive" })],
    }),
  ]);
  expect(trunks[0]!.usable).toBe(false);
  expect(trunks[0]!.unavailable_reason).toBe("inactive");
});

test("mergeReports names the agent a trunk is attached to, not its id", () => {
  const trunks = mergeReports([
    report(agent("agent-uuid-1", "Support Line"), {
      outbound: [option({ id: "t", is_current: true })],
    }),
    report(agent("agent-uuid-2", "Other"), { outbound: [option({ id: "t" })] }),
  ]);
  expect(trunks[0]!.in_use_by).toBe("Support Line");
});

test("mergeReports leaves in_use_by null for a trunk attached to nobody", () => {
  const trunks = mergeReports([report(agent("a"), { outbound: [option({ id: "t" })] })]);
  expect(trunks[0]!.in_use_by).toBeNull();
});

// --- US2: action-level rendering -------------------------------------------

test("list shows usability and attachment columns", async () => {
  const { stdout } = await runCli(
    ["trunks", "list"],
    trunkServer([agent("a", "Support Line")], {
      a: { inbound: [], outbound: [option({ id: "t", name: "trunk-a", is_current: true })] },
    }),
  );
  expect(stdout.split("\n")[0]).toBe("DIRECTION\tNAME\tNUMBERS\tSTATUS\tUSABLE\tIN USE BY");
  const cells = rows(stdout)[0]!.split("\t");
  expect(cells[4]).toBe("yes");
  expect(cells[5]).toBe("Support Line");
});

test("list renders an unusable trunk with the reason in human phrasing", async () => {
  const { stdout } = await runCli(
    ["trunks", "list"],
    trunkServer([agent("a")], {
      a: {
        inbound: [option({ id: "t", selectable: false, is_current: true, unavailable_reason: "not_synced" })],
        outbound: [],
      },
    }),
  );
  const cells = rows(stdout)[0]!.split("\t");
  expect(cells[4]).toBe("no (not yet synced with the telephony backend)");
});

test("list prints an unrecognised reason verbatim rather than dropping it", async () => {
  const novel = "some_future_reason_we_have_never_seen";
  const { stdout } = await runCli(
    ["trunks", "list"],
    trunkServer([agent("a")], {
      a: {
        inbound: [option({ id: "t", selectable: false, is_current: true, unavailable_reason: novel })],
        outbound: [],
      },
    }),
  );
  expect(stdout).toContain(`no (${novel})`);
});

test("list renders an unattached trunk's IN USE BY as - and never blank", async () => {
  const { stdout } = await runCli(
    ["trunks", "list"],
    trunkServer([agent("a")], { a: { inbound: [], outbound: [option({ id: "t" })] } }),
  );
  const cells = rows(stdout)[0]!.split("\t");
  expect(cells[5]).toBe("-");
  expect(cells.length).toBe(6);
});

// --- US3: --json and --direction (FR-010, FR-011, FR-012) ------------------

const twoDirections = (agents: AgentRef[] = [agent("a")]) =>
  trunkServer(agents, {
    a: {
      inbound: [option({ id: "t-in", name: "in-one" })],
      outbound: [option({ id: "t-out", name: "out-one" })],
    },
  });

test("list --json emits a parseable array carrying every Trunk field", async () => {
  const { stdout, code } = await runCli(["trunks", "list", "--json"], twoDirections());
  expect(code).toBe(0);
  const parsed = JSON.parse(stdout);
  expect(Array.isArray(parsed)).toBe(true);
  expect(parsed.length).toBe(2);
  expect(Object.keys(parsed[0]).sort()).toEqual([
    "direction",
    "id",
    "in_use_by",
    "livekit_trunk_id",
    "name",
    "numbers",
    "status",
    "unavailable_reason",
    "usable",
  ]);
});

test("list --json emits [] for an empty organisation, not null and not an object", async () => {
  const { stdout, code } = await runCli(
    ["trunks", "list", "--json"],
    trunkServer([agent("a")], { a: { inbound: [], outbound: [] } }),
  );
  expect(code).toBe(0);
  expect(JSON.parse(stdout)).toEqual([]);
});

test("list --json keeps stdout parseable when the command fails", async () => {
  const { stdout, code } = await runCli(["trunks", "list", "--json"], trunkServer([], {}));
  expect(code).toBe(1);
  const parsed = JSON.parse(stdout);
  expect(parsed.ok).toBe(false);
  expect(parsed.error).toMatch(/no agents/i);
});

test("list --json suppresses the completeness note on both streams", async () => {
  const { stdout, stderr } = await runCli(["trunks", "list", "--json"], twoDirections());
  expect(stdout).not.toContain("note:");
  expect(stderr).not.toContain("not visible here");
});

test("list --direction filters to one direction", async () => {
  const inbound = await runCli(["trunks", "list", "--direction", "inbound"], twoDirections());
  expect(inbound.code).toBe(0);
  expect(rows(inbound.stdout).length).toBe(1);
  expect(inbound.stdout).toContain("in-one");
  expect(inbound.stdout).not.toContain("out-one");

  const outbound = await runCli(["trunks", "list", "--direction", "outbound"], twoDirections());
  expect(rows(outbound.stdout).length).toBe(1);
  expect(outbound.stdout).toContain("out-one");
  expect(outbound.stdout).not.toContain("in-one");
});

test("list --direction filters --json output too", async () => {
  const { stdout } = await runCli(
    ["trunks", "list", "--direction", "outbound", "--json"],
    twoDirections(),
  );
  const parsed = JSON.parse(stdout);
  expect(parsed.map((t: { direction: string }) => t.direction)).toEqual(["outbound"]);
});

test("list rejects an invalid --direction and names the valid values", async () => {
  const { stderr, code } = await runCli(["trunks", "list", "--direction", "sideways"], twoDirections());
  expect(code).not.toBe(0);
  expect(stderr).toContain("inbound");
  expect(stderr).toContain("outbound");
});

test("list emits no spinner control characters when stdout is not a TTY", async () => {
  const { stdout } = await runCli(["trunks", "list"], twoDirections());
  expect(stdout.includes(String.fromCharCode(27))).toBe(false);
});

// --- Polish: failure modes (FR-017, FR-018, FR-020) ------------------------

const API_KEY = "slng_test_key";

test("a rejected credential is reported as such, with the request id", async () => {
  const { stderr, code } = await runCli(["trunks", "list"], () =>
    json(
      {
        detail: "Invalid API key",
        error: { code: "AUTH_REQUIRED", message: "Invalid API key", request_id: "rid-401" },
      },
      401,
    ),
  );
  expect(code).toBe(1);
  expect(stderr).toContain("Invalid API key");
  expect(stderr).toContain("AUTH_REQUIRED");
  expect(stderr).toContain("rid-401");
});

test("a rate limit reports the Retry-After wait", async () => {
  const { stderr, code } = await runCli(["trunks", "list"], () => {
    const res = json({ detail: "Too many requests" }, 429);
    res.headers.set("retry-after", "30");
    return res;
  });
  expect(code).toBe(1);
  expect(stderr).toMatch(/rate limited/i);
  expect(stderr).toContain("30");
});

test("a failure partway through the fan-out prints no partial table", async () => {
  const { stdout, stderr, code } = await runCli(
    ["trunks", "list"],
    trunkServer([agent("a"), agent("b")], { a: { inbound: [option({ name: "visible" })], outbound: [] } }, (path) =>
      path.includes("/b/") ? json({ detail: "boom", error: { code: "INTERNAL", message: "boom" } }, 500) : undefined,
    ),
  );
  expect(code).toBe(1);
  // The one agent that succeeded must not be presented as the whole answer.
  expect(stdout).not.toContain("visible");
  expect(stdout).not.toContain("DIRECTION");
  expect(stderr).toContain("boom");
});

test("each failure mode produces a distinguishable message", async () => {
  const noAgents = await runCli(["trunks", "list"], trunkServer([], {}));
  const rejected = await runCli(["trunks", "list"], () =>
    json({ detail: "Invalid API key", error: { code: "AUTH_REQUIRED", message: "Invalid API key" } }, 401),
  );
  expect(noAgents.stderr).not.toBe(rejected.stderr);
  expect(noAgents.stderr).toMatch(/no agents/i);
  expect(rejected.stderr).not.toMatch(/no agents/i);
});

// --- Polish: credential safety (FR-015, FR-016) ----------------------------

test("no output in any mode contains the API key", async () => {
  const success = await runCli(["trunks", "list"], twoDirections());
  const successJson = await runCli(["trunks", "list", "--json"], twoDirections());
  const failure = await runCli(["trunks", "list"], trunkServer([], {}));
  const failureJson = await runCli(["trunks", "list", "--json"], trunkServer([], {}));

  for (const run of [success, successJson, failure, failureJson]) {
    expect(run.stdout).not.toContain(API_KEY);
    expect(run.stderr).not.toContain(API_KEY);
    expect(run.stdout.toLowerCase()).not.toContain("authorization");
  }
});

test("no trunk output carries a SIP credential field", async () => {
  // The reachable payload has no auth_username / auth_password / webhook token
  // (research D9). If the backend ever starts sending them, this notices.
  const { stdout } = await runCli(["trunks", "list", "--json"], twoDirections());
  for (const secret of ["auth_username", "auth_password", "twilio_webhook_token"]) {
    expect(stdout).not.toContain(secret);
  }
});
