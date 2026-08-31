import { test, expect, afterEach } from "bun:test";
import {
  redact,
  listSecrets,
  getSecret,
  partition,
  readSecretsFile,
  valueCell,
  type VaultEntry,
} from "./secret";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

process.env.VOICEAI_API_KEY = "slng_test_key";

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

/** A plaintext that must never reach any output stream. */
const SENTINEL = "sk_live_SENTINEL_must_never_print";

function entry(over: Partial<VaultEntry> = {}): VaultEntry {
  return {
    id: over.id ?? "00000000-0000-0000-0000-000000000000",
    organisation_id: "org-1",
    name: over.name ?? "A_SECRET",
    kind: over.kind ?? "secret",
    description: over.description ?? null,
    value: over.value ?? null,
    has_value: over.has_value ?? true,
    is_managed: over.is_managed ?? false,
    revision: over.revision ?? 1,
    created_by: over.created_by ?? "user_abc",
    last_rotated_by: over.last_rotated_by ?? null,
    last_rotated_at: over.last_rotated_at ?? null,
    created_at: "2026-08-11T06:52:56.962606Z",
    updated_at: "2026-08-11T06:52:56.962606Z",
    ...over,
  };
}

/** Stub fetch, recording every URL it is called with. */
function stub(bodies: unknown[], status = 200): { urls: string[] } {
  const urls: string[] = [];
  let n = 0;
  globalThis.fetch = (async (url: URL | string) => {
    urls.push(String(url));
    return new Response(JSON.stringify(bodies[n++] ?? []), {
      status,
      headers: { "content-type": "application/json" },
    });
  }) as unknown as typeof fetch;
  return { urls };
}

// --- redaction (FR-008) ----------------------------------------------------

test("redact removes a variable's plaintext value", () => {
  const v = entry({ name: "REGION", kind: "variable", value: SENTINEL });
  const out = redact(v);
  expect("value" in out).toBe(false);
  expect(JSON.stringify(out)).not.toContain(SENTINEL);
  expect(out.name).toBe("REGION");
});

test("redact is unconditional — it does not branch on kind", () => {
  expect("value" in redact(entry({ kind: "secret", value: null }))).toBe(false);
  expect("value" in redact(entry({ kind: "variable", value: SENTINEL }))).toBe(false);
});

// --- listSecrets (FR-002, research D4) -------------------------------------

test("listSecrets issues exactly one unparameterised request", async () => {
  const { urls } = stub([[entry({ name: "ONE" }), entry({ name: "TWO" })]]);
  const rows = await listSecrets();
  expect(rows.map((r) => r.name)).toEqual(["ONE", "TWO"]);
  expect(urls.length).toBe(1);
  expect(urls[0]).toContain("/v1/agents/secrets");
  // The route ignores limit/offset, so sending them would be dead weight.
  expect(urls[0]).not.toContain("limit");
  expect(urls[0]).not.toContain("offset");
});

test("listSecrets surfaces a failed request as an error", async () => {
  stub([{ detail: "nope", error: { code: "AUTH_REQUIRED", message: "Invalid API key", request_id: "rid-1" } }], 401);
  await expect(listSecrets()).rejects.toThrow(/Invalid API key/);
});

test("listSecrets returns an empty array for an empty vault", async () => {
  stub([[]]);
  expect(await listSecrets()).toEqual([]);
});

// --- valueCell (FR-004) ----------------------------------------------------

test("valueCell renders presence as yes/no, never blank", () => {
  expect(valueCell(true)).toBe("yes");
  expect(valueCell(false)).toBe("no");
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

const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });

/** One secret plus one variable carrying the sentinel plaintext. */
const vault = [
  entry({ name: "FIRECRAWL_API_KEY", description: "scraper" }),
  entry({ name: "REGION", kind: "variable", value: SENTINEL, description: null }),
];

function vaultServer(rows: VaultEntry[]) {
  return (req: Request) => {
    const path = new URL(req.url).pathname;
    if (path === "/v1/agents/secrets") return json(rows);
    const name = decodeURIComponent(path.split("/").pop() ?? "");
    const row = rows.find((r) => r.name === name);
    return row
      ? json(row)
      : json(
          {
            detail: `No shared secret or variable named '${name}'`,
            error: {
              code: "RESOURCE_NOT_FOUND",
              message: `No shared secret or variable named '${name}'`,
              request_id: "rid-404",
            },
          },
          404,
        );
  };
}

// --- list (US1: FR-003, FR-005, FR-010) ------------------------------------

test("list prints a header and one row per entry, with nothing on stderr", async () => {
  const r = await runCli(["secret", "list"], vaultServer(vault));
  expect(r.code).toBe(0);
  expect(r.stdout.split("\n")[0]).toBe("NAME\tKIND\tVALUE\tDESCRIPTION");
  expect(r.stdout).toContain("FIRECRAWL_API_KEY\tsecret\tyes\tscraper");
  expect(r.stdout).toContain("REGION\tvariable\tyes\t-");
  expect(r.stderr).toBe("");
});

test("list reports an empty vault and still exits 0", async () => {
  const r = await runCli(["secret", "list"], vaultServer([]));
  expect(r.code).toBe(0);
  expect(r.stdout).toContain("no secrets found.");
});

test("list --json emits an array with no value key anywhere", async () => {
  const r = await runCli(["secret", "list", "--json"], vaultServer(vault));
  expect(r.code).toBe(0);
  const parsed = JSON.parse(r.stdout) as Record<string, unknown>[];
  expect(Array.isArray(parsed)).toBe(true);
  expect(parsed.some((e) => "value" in e)).toBe(false);
  expect(r.stdout).not.toContain(SENTINEL);
});

// --- getSecret (FR-006, research D5) ---------------------------------------

test("getSecret requests the name as a single path segment", async () => {
  const { urls } = stub([entry({ name: "STRIPE_KEY" })]);
  const res = await getSecret("STRIPE_KEY");
  expect(res.ok).toBe(true);
  expect(urls.length).toBe(1);
  expect(urls[0]).toEndWith("/v1/agents/secrets/STRIPE_KEY");
});

test("getSecret percent-encodes a name with path-significant characters", async () => {
  const { urls } = stub([entry()]);
  await getSecret("a/b#c d");
  expect(urls[0]).toEndWith("/v1/agents/secrets/a%2Fb%23c%20d");
});

test("getSecret returns the failed result rather than throwing", async () => {
  stub([{ detail: "gone", error: { code: "RESOURCE_NOT_FOUND", message: "gone", request_id: "r" } }], 404);
  const res = await getSecret("NOPE");
  expect(res.ok).toBe(false);
  expect(res.status).toBe(404);
});

// --- get (US2: FR-006, FR-007, FR-011) -------------------------------------

test("get prints a field block with no value line", async () => {
  const r = await runCli(["secret", "get", "FIRECRAWL_API_KEY"], vaultServer(vault));
  expect(r.code).toBe(0);
  expect(r.stdout).toContain("name");
  expect(r.stdout).toContain("FIRECRAWL_API_KEY");
  expect(r.stdout).toContain("has_value");
  // No line is the `value` field itself. `has_value` contains "value", so match
  // on the field label at the start of a line rather than anywhere in the text.
  expect(r.stdout.split("\n").some((l) => /^value\s/.test(l))).toBe(false);
  expect(r.stderr).toBe("");
});

test("get exits 1 and explains case sensitivity when nothing matches", async () => {
  const r = await runCli(["secret", "get", "firecrawl_api_key"], vaultServer(vault));
  expect(r.code).toBe(1);
  expect(r.stderr).toContain('secret "firecrawl_api_key" not found');
  expect(r.stderr).toContain("case-sensitive");
  expect(r.stdout).toBe("");
});

test("get --json still emits parseable JSON when it fails", async () => {
  const r = await runCli(["secret", "get", "NOPE", "--json"], vaultServer(vault));
  expect(r.code).toBe(1);
  const parsed = JSON.parse(r.stdout) as { ok: boolean; error: string };
  expect(parsed.ok).toBe(false);
  expect(typeof parsed.error).toBe("string");
});

test("get on an unpopulated entry still exits 0 and says so", async () => {
  const rows = [entry({ name: "EMPTY_ONE", has_value: false })];
  const r = await runCli(["secret", "get", "EMPTY_ONE"], vaultServer(rows));
  expect(r.code).toBe(0);
  expect(r.stdout).toContain("no");
});

test("get on a variable never prints its plaintext (FR-008)", async () => {
  const plain = await runCli(["secret", "get", "REGION"], vaultServer(vault));
  expect(plain.code).toBe(0);
  expect(plain.stdout).not.toContain(SENTINEL);
  expect(plain.stderr).not.toContain(SENTINEL);

  const asJson = await runCli(["secret", "get", "REGION", "--json"], vaultServer(vault));
  expect(asJson.code).toBe(0);
  expect(asJson.stdout).not.toContain(SENTINEL);
  expect(JSON.parse(asJson.stdout)).not.toHaveProperty("value");
});

// --- US3: pipe safety and failure modes ------------------------------------

test("neither command emits ANSI escapes or spinner output when not a TTY", async () => {
  const list = await runCli(["secret", "list"], vaultServer(vault));
  const get = await runCli(["secret", "get", "FIRECRAWL_API_KEY"], vaultServer(vault));
  for (const r of [list, get]) {
    expect(r.stdout).not.toContain("\u001b");
    expect(r.stderr).toBe("");
  }
});

const errServer = (status: number, body: unknown, headers: Record<string, string> = {}) =>
  () => json(body, status, headers);

test("a rejected credential is distinguishable and carries the request id", async () => {
  const r = await runCli(
    ["secret", "list"],
    errServer(401, {
      detail: "Invalid API key",
      error: { code: "AUTH_REQUIRED", message: "Invalid API key", request_id: "rid-401" },
    }),
  );
  expect(r.code).toBe(1);
  expect(r.stderr).toContain("Invalid API key");
  expect(r.stderr).toContain("AUTH_REQUIRED");
  expect(r.stderr).toContain("rid-401");
});

test("a disabled organisation reports the machine-readable code", async () => {
  const r = await runCli(
    ["secret", "list"],
    errServer(403, {
      detail: "Shared resources are disabled",
      error: {
        code: "PUBLIC_SHARED_RESOURCES_DISABLED",
        message: "Shared resources are disabled",
        request_id: "rid-403",
      },
    }),
  );
  expect(r.code).toBe(1);
  expect(r.stderr).toContain("PUBLIC_SHARED_RESOURCES_DISABLED");
});

test("a rate limit reports the Retry-After wait", async () => {
  const r = await runCli(
    ["secret", "list"],
    errServer(
      429,
      { detail: "Too many requests", error: { code: "RATE_LIMITED", message: "Too many requests" } },
      { "retry-after": "30" },
    ),
  );
  expect(r.code).toBe(1);
  expect(r.stderr).toContain("rate limited");
  expect(r.stderr).toContain("30");
});

test("the three failure modes produce three different messages", async () => {
  const a = await runCli(["secret", "list"], errServer(401, { error: { code: "AUTH_REQUIRED", message: "Invalid API key" } }));
  const b = await runCli(["secret", "list"], errServer(403, { error: { code: "PUBLIC_SHARED_RESOURCES_DISABLED", message: "Disabled" } }));
  const c = await runCli(["secret", "get", "NOPE"], vaultServer(vault));
  expect(new Set([a.stderr, b.stderr, c.stderr]).size).toBe(3);
});

test("no output on any path contains the API key (FR-013)", async () => {
  const ok = await runCli(["secret", "list"], vaultServer(vault));
  const bad = await runCli(["secret", "list"], errServer(401, { error: { code: "AUTH_REQUIRED", message: "Invalid API key" } }));
  for (const r of [ok, bad]) {
    expect(r.stdout).not.toContain("slng_test_key");
    expect(r.stderr).not.toContain("slng_test_key");
  }
});

// ---------------------------------------------------------------------------
// SC-005. The load-bearing test: no vault value reaches any stream, from any
// command, in any output mode. `kind: "variable"` really does return decrypted
// plaintext from the platform, so this is a leak check, not a formality.
// Do not delete it.
// ---------------------------------------------------------------------------

test("no vault value reaches any stream, from any command, in any mode", async () => {
  const runs = await Promise.all([
    runCli(["secret", "list"], vaultServer(vault)),
    runCli(["secret", "list", "--json"], vaultServer(vault)),
    runCli(["secret", "get", "REGION"], vaultServer(vault)),
    runCli(["secret", "get", "REGION", "--json"], vaultServer(vault)),
  ]);
  for (const r of runs) {
    expect(r.code).toBe(0);
    expect(r.stdout).not.toContain(SENTINEL);
    expect(r.stderr).not.toContain(SENTINEL);
  }
});

// ---------------------------------------------------------------------------
// create
// ---------------------------------------------------------------------------

function envFile(body: string): string {
  const dir = mkdtempSync(join(tmpdir(), "secret-env-"));
  const path = join(dir, ".env.local");
  writeFileSync(path, body);
  return path;
}

/** Records every write so a test can assert nothing was sent. */
function writableVault(rows: VaultEntry[]) {
  const writes: { method: string; path: string; body: unknown }[] = [];
  const handler = async (req: Request) => {
    const path = new URL(req.url).pathname;
    if (req.method !== "GET") {
      writes.push({ method: req.method, path, body: await req.json().catch(() => null) });
      return json({ ok: true }, req.method === "POST" ? 201 : 200);
    }
    if (path === "/v1/agents/secrets") return json(rows);
    return json({ detail: "nope", error: { code: "RESOURCE_NOT_FOUND", message: "nope" } }, 404);
  };
  return { handler: handler as unknown as (req: Request) => Response, writes };
}

test("readSecretsFile uses the platform parser: comments, export, quotes, blanks", () => {
  const path = envFile('# a comment\nFOO=bar\nexport BAZ="two words"\nEMPTY=\n');
  expect(readSecretsFile(path)).toEqual([
    { name: "FOO", value: "bar" },
    { name: "BAZ", value: "two words" },
    // Written deliberately in the file, so kept — not silently dropped.
    { name: "EMPTY", value: "" },
  ]);
});

test("readSecretsFile names the file it could not read", () => {
  expect(() => readSecretsFile("/nope/missing.env")).toThrow(/cannot read \/nope\/missing.env/);
});

test("partition splits against what the vault already holds", () => {
  const { creates, overwrites } = partition(
    [{ name: "NEW", value: "a" }, { name: "OLD", value: "b" }],
    [entry({ name: "OLD" })],
  );
  expect(creates.map((p) => p.name)).toEqual(["NEW"]);
  expect(overwrites.map((p) => p.name)).toEqual(["OLD"]);
});

test("create refuses a name and --secrets-file together, and neither alone", async () => {
  const both = await runCli(
    ["secret", "create", "FOO", "--secrets-file", envFile("A=1")],
    vaultServer(vault),
  );
  expect(both.code).toBe(1);
  expect(both.stderr).toContain("not both and not neither");

  const neither = await runCli(["secret", "create"], vaultServer(vault));
  expect(neither.code).toBe(1);
});

// The whole point: existing entries are named, and nothing is written.
test("create refuses to overwrite without --overwrite and writes nothing", async () => {
  const v = writableVault(vault);
  const r = await runCli(
    ["secret", "create", "--secrets-file", envFile("FIRECRAWL_API_KEY=new\nBRAND_NEW=x\n")],
    v.handler,
  );
  expect(r.code).toBe(1);
  expect(r.stderr).toContain("FIRECRAWL_API_KEY");
  expect(r.stderr).toContain("--overwrite");
  // Not even the safe creates go through: the run is all-or-nothing.
  expect(v.writes).toEqual([]);
});

test("create --json reports both lists so a script can decide", async () => {
  const r = await runCli(
    ["secret", "create", "--secrets-file", envFile("FIRECRAWL_API_KEY=new\nBRAND_NEW=x\n"), "--json"],
    vaultServer(vault),
  );
  expect(r.code).toBe(1);
  const doc = JSON.parse(r.stdout);
  expect(doc.ok).toBe(false);
  expect(doc.would_overwrite).toEqual(["FIRECRAWL_API_KEY"]);
  expect(doc.would_create).toEqual(["BRAND_NEW"]);
});

test("create --overwrite POSTs the new ones and PATCHes the existing ones", async () => {
  const v = writableVault(vault);
  const r = await runCli(
    ["secret", "create", "--secrets-file", envFile("FIRECRAWL_API_KEY=rotated\nBRAND_NEW=x\n"), "--overwrite"],
    v.handler,
  );
  expect(r.code).toBe(0);
  expect(v.writes).toEqual([
    { method: "POST", path: "/v1/agents/secrets", body: { name: "BRAND_NEW", kind: "secret", value: "x" } },
    { method: "PATCH", path: "/v1/agents/secrets/FIRECRAWL_API_KEY", body: { value: "rotated" } },
  ]);
  expect(r.stdout).toContain("BRAND_NEW\tcreated");
  expect(r.stdout).toContain("FIRECRAWL_API_KEY\toverwritten");
});

test("create --kind variable is carried on the create body", async () => {
  const v = writableVault([]);
  await runCli(
    ["secret", "create", "--secrets-file", envFile("REGION=eu\n"), "--kind", "variable"],
    v.handler,
  );
  expect(v.writes[0]?.body).toEqual({ name: "REGION", kind: "variable", value: "eu" });
});

test("create rejects an unknown --kind before any request", async () => {
  const v = writableVault([]);
  const r = await runCli(
    ["secret", "create", "--secrets-file", envFile("A=1"), "--kind", "nonsense"],
    v.handler,
  );
  expect(r.code).toBe(1);
  expect(r.stderr).toContain("Allowed choices are secret, variable");
  expect(v.writes).toEqual([]);
});

test("create reports an empty file rather than writing nothing silently", async () => {
  const r = await runCli(
    ["secret", "create", "--secrets-file", envFile("# only a comment\n")],
    vaultServer([]),
  );
  expect(r.code).toBe(1);
  expect(r.stderr).toContain("no KEY=VALUE entries");
});

// Piped stdin is the non-interactive path for a single value.
test("create <name> reads a piped value and never echoes it", async () => {
  const v = writableVault([]);
  const server = Bun.serve({ port: 0, fetch: v.handler });
  try {
    const proc = Bun.spawn(["bun", "run", "src/index.ts", "secret", "create", "NEW_KEY"], {
      cwd: CLI_DIR,
      env: {
        ...process.env,
        VOICEAI_AGENTS_BASE_URL: `http://localhost:${server.port}`,
        VOICEAI_API_KEY: "slng_test_key",
      },
      stdin: new Blob([`${SENTINEL}\n`]),
      stdout: "pipe",
      stderr: "pipe",
    });
    const [stdout, stderr] = await Promise.all([
      new Response(proc.stdout).text(),
      new Response(proc.stderr).text(),
    ]);
    expect(await proc.exited).toBe(0);
    expect(v.writes[0]?.body).toEqual({ name: "NEW_KEY", kind: "secret", value: SENTINEL });
    // The value reaches the API and nowhere else.
    expect(stdout).not.toContain(SENTINEL);
    expect(stderr).not.toContain(SENTINEL);
    expect(stdout).toContain("NEW_KEY\tcreated");
  } finally {
    server.stop(true);
  }
});

test("a failed write exits 1 and names the entry that failed", async () => {
  const handler = (req: Request) => {
    const path = new URL(req.url).pathname;
    if (req.method === "GET" && path === "/v1/agents/secrets") return json([]);
    return json(
      { detail: "d", error: { code: "QUOTA_EXCEEDED", message: "vault is full", request_id: "rid-1" } },
      403,
    );
  };
  const r = await runCli(["secret", "create", "--secrets-file", envFile("A=1")], handler);
  expect(r.code).toBe(1);
  expect(r.stdout).toContain("A\tFAILED");
  expect(r.stdout).toContain("QUOTA_EXCEEDED");
});
