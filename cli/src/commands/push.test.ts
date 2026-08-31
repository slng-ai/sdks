import { afterEach, expect, test } from "bun:test";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  loadPackage,
  locate,
  needsGreenRun,
  PackageError,
  promptSecretNames,
  requiredSecretNames,
  toolSecretNames,
  type PackageToolBody,
} from "../lib/package";
import {
  buildPlan,
  defaultLabel,
  describeGates,
  MAX_LABEL,
  declaredDiffers,
  planJson,
  toolWriteBody,
  renderHeader,
  renderOutcome,
  renderPartial,
  renderPlan,
  type PlanInputs,
} from "./push";
import type { VaultEntry } from "./secret";
import type { ToolListItem } from "./tool";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const temps: string[] = [];
afterEach(() => {
  for (const d of temps.splice(0)) rmSync(d, { recursive: true, force: true });
});

interface PkgSpec {
  compiled?: boolean; // write into build/slng (default) or the root
  agent?: Record<string, unknown>;
  tools?: PackageToolBody[];
  samples?: Record<string, Record<string, unknown>>;
}

/** Write a package to a temp dir and return its root. */
function writePackage(spec: PkgSpec = {}): string {
  const root = mkdtempSync(join(tmpdir(), "push-pkg-"));
  temps.push(root);
  const compiled = spec.compiled === false ? root : join(root, "build", "slng");
  mkdirSync(compiled, { recursive: true });
  const agent = {
    schema_version: 2,
    name: "slng",
    system_prompt: "You are the front desk.",
    greeting: "Hi",
    tool_mode: "shared",
    tool_refs: [{ tool: "end_call", description: "End the call.", invocation: "model", argument_overrides: {} }],
    mcp_refs: [],
    ...spec.agent,
  };
  writeFileSync(join(compiled, "agent.json"), JSON.stringify(agent, null, 2));
  if (spec.tools?.length) {
    mkdirSync(join(compiled, "tools"), { recursive: true });
    for (const t of spec.tools) {
      writeFileSync(join(compiled, "tools", `${t.name}.json`), JSON.stringify(t, null, 2));
    }
  }
  if (spec.samples) {
    mkdirSync(join(compiled, "samples"), { recursive: true });
    for (const [name, body] of Object.entries(spec.samples)) {
      writeFileSync(join(compiled, "samples", `${name}.json`), JSON.stringify(body));
    }
  }
  return root;
}

function toolRow(over: Partial<ToolListItem> = {}): ToolListItem {
  return {
    id: "tool-org",
    name: "end_call",
    tool_type: "end_call",
    description: "",
    last_run_status: null,
    latest_version: 3,
    config_valid: true,
    arg_schema: null,
    ...over,
  };
}

function secret(name: string, kind: "secret" | "variable" = "secret"): VaultEntry {
  return {
    id: `s-${name}`,
    organisation_id: "org-1",
    name,
    kind,
    description: null,
    has_value: true,
    is_managed: false,
    revision: 1,
    created_by: null,
    last_rotated_by: null,
    last_rotated_at: null,
    created_at: "",
    updated_at: "",
  };
}

let minted = 0;
function planFor(over: Partial<PlanInputs> & { pkgDir?: string } = {}) {
  minted = 0;
  const pkg = loadPackage(over.pkgDir ?? writePackage());
  return buildPlan({
    agents: [],
    secrets: [],
    catalogue: [toolRow()],
    runSamples: false,
    organisation: { id: "org-1" },
    mintId: () => `minted-${++minted}`,
    ...over,
    pkg: over.pkg ?? pkg,
  });
}

// ---------------------------------------------------------------------------
// T007 — location and parsing (FR-001, FR-002)
// ---------------------------------------------------------------------------

test("locate finds agent.json under build/slng from the package root", () => {
  const root = writePackage();
  expect(locate(root).agentBody).toBe(join(root, "build", "slng", "agent.json"));
});

test("locate accepts the compiled directory itself", () => {
  const root = writePackage();
  const compiled = join(root, "build", "slng");
  expect(locate(compiled).agentBody).toBe(join(compiled, "agent.json"));
});

test("locate names both searched paths when neither exists", () => {
  const empty = mkdtempSync(join(tmpdir(), "push-empty-"));
  temps.push(empty);
  try {
    locate(empty);
    throw new Error("expected locate to throw");
  } catch (e) {
    expect(e).toBeInstanceOf(PackageError);
    const msg = (e as Error).message;
    expect(msg).toContain(join(empty, "build", "slng", "agent.json"));
    expect(msg).toContain(join(empty, "agent.json"));
  }
});

test("a package with no tools/ directory loads with no tools", () => {
  const pkg = loadPackage(writePackage());
  expect(pkg.tools).toEqual([]);
  expect(pkg.samples.size).toBe(0);
});

test("shipped tool bodies and samples are read", () => {
  const root = writePackage({
    tools: [{ name: "check_order", tool_type: "code", declared_secrets: ["CRM_TOKEN"] }],
    samples: { check_order: { order_id: "A-1" } },
  });
  const pkg = loadPackage(root);
  expect(pkg.tools.map((t) => t.name)).toEqual(["check_order"]);
  expect(pkg.samples.get("check_order")).toEqual({ order_id: "A-1" });
});

// ---------------------------------------------------------------------------
// T010 — vault name derivation per tool_type (research D5)
// ---------------------------------------------------------------------------

test("a code tool declares its secrets verbatim", () => {
  expect(toolSecretNames({ name: "t", tool_type: "code", declared_secrets: ["B", "A", "A"] })).toEqual(["A", "B"]);
});

test("an api_request tool names bearer/hmac auth and header secrets", () => {
  const tool: PackageToolBody = {
    name: "t",
    tool_type: "api_request",
    config: {
      auth: { type: "bearer", secret_name: "REFUND_API_TOKEN" },
      headers: [{ secret_name: "X_SIG" }, { value: "literal" }],
    },
  };
  expect(toolSecretNames(tool)).toEqual(["REFUND_API_TOKEN", "X_SIG"]);
});

test("api_request auth of another type contributes no secret", () => {
  const tool: PackageToolBody = {
    name: "t",
    tool_type: "api_request",
    config: { auth: { type: "none", secret_name: "IGNORED" } },
  };
  expect(toolSecretNames(tool)).toEqual([]);
});

test("a context-bound tool needs no secrets", () => {
  expect(toolSecretNames({ name: "end_call", tool_type: "end_call" })).toEqual([]);
});

test("vault tokens in prompt text are collected, template variables are not", () => {
  const names = promptSecretNames({
    name: "a",
    system_prompt: "use {{$CRM_TOKEN}} and greet {{customer_name}}",
    greeting: "hello {{$GREETING_KEY}}",
  });
  expect(names).toEqual(["CRM_TOKEN", "GREETING_KEY"]);
});

test("required names merge tool bodies and prompt tokens", () => {
  const pkg = loadPackage(
    writePackage({
      agent: { system_prompt: "{{$PROMPT_KEY}}" },
      tools: [{ name: "t", tool_type: "code", declared_secrets: ["TOOL_KEY"] }],
    }),
  );
  expect(requiredSecretNames(pkg)).toEqual(["PROMPT_KEY", "TOOL_KEY"]);
});

// ---------------------------------------------------------------------------
// T011 — kind matters (research D4)
// ---------------------------------------------------------------------------

test("a vault entry of kind variable does not satisfy a required secret", () => {
  const plan = planFor({
    pkgDir: writePackage({ agent: { system_prompt: "{{$CRM_TOKEN}}" } }),
    secrets: [secret("CRM_TOKEN", "variable")],
  });
  const blocker = plan.blockers.find((b) => b.kind === "vault_missing");
  expect(blocker).toBeDefined();
  expect(blocker?.items[0]).toContain("CRM_TOKEN");
  expect(blocker?.items[0]).toContain("variable");
});

test("a vault entry of kind secret satisfies it", () => {
  const plan = planFor({
    pkgDir: writePackage({ agent: { system_prompt: "{{$CRM_TOKEN}}" } }),
    secrets: [secret("CRM_TOKEN")],
  });
  expect(plan.blockers.find((b) => b.kind === "vault_missing")).toBeUndefined();
});

// ---------------------------------------------------------------------------
// T012 — every problem in one pass (FR-008)
// ---------------------------------------------------------------------------

test("three independent problems yield three blockers in one pass", () => {
  const plan = planFor({
    pkgDir: writePackage({
      agent: {
        system_prompt: "{{$MISSING_KEY}}",
        tool_refs: [{ tool: "nope" }],
        mcp_refs: [{ server: "docs", tool_name: "search" }],
      },
    }),
    catalogue: [],
  });
  const kinds = plan.blockers.map((b) => b.kind).sort();
  expect(kinds).toEqual(["mcp_unsupported", "tool_unresolved", "vault_missing"]);
});

test("a vault blocker carries every missing name, not just the first", () => {
  const plan = planFor({
    pkgDir: writePackage({ agent: { system_prompt: "{{$A_KEY}} {{$B_KEY}}" } }),
  });
  expect(plan.blockers.find((b) => b.kind === "vault_missing")?.items).toHaveLength(2);
});

test("a clean package against a provisioned org has no blockers", () => {
  expect(planFor().blockers).toEqual([]);
});

// ---------------------------------------------------------------------------
// T028 — reference building (FR-022, FR-026)
// ---------------------------------------------------------------------------

test("the tool name is replaced by ids and every other field survives", () => {
  const plan = planFor({
    pkgDir: writePackage({
      agent: {
        tool_refs: [
          {
            tool: "end_call",
            description: "End the call.",
            invocation: "model",
            argument_overrides: { a: 1 },
            execution_policy: { pre_action_message: { enabled: true } },
          },
        ],
      },
    }),
  });
  const ref = plan.refs[0]!;
  expect(ref.toolId).toBe("tool-org");
  expect(ref.version).toBe(3);
  expect(ref.carried).toEqual({
    description: "End the call.",
    invocation: "model",
    argument_overrides: { a: 1 },
    execution_policy: { pre_action_message: { enabled: true } },
  });
  expect(ref.carried).not.toHaveProperty("tool");
});

test("a shipped body whose name is already in the catalogue updates it, never creates a second", () => {
  const plan = planFor({
    pkgDir: writePackage({
      agent: { tool_refs: [{ tool: "lookup" }] },
      tools: [{ name: "lookup", tool_type: "code" }],
      samples: { lookup: {} },
    }),
    runSamples: true,
    catalogue: [toolRow({ id: "org-id", name: "lookup", tool_type: "code", latest_version: 3 })],
  });
  expect(plan.tools[0]?.action).toBe("update");
  expect(plan.tools[0]?.existingId).toBe("org-id");
  expect(plan.refs[0]?.toolId).toBe("org-id");
});

test("a shipped body with no catalogue row is a create", () => {
  const plan = planFor({
    pkgDir: writePackage({
      agent: { tool_refs: [{ tool: "lookup" }] },
      tools: [{ name: "lookup", tool_type: "code" }],
      samples: { lookup: {} },
    }),
    runSamples: true,
    catalogue: [],
  });
  expect(plan.tools[0]?.action).toBe("create");
  expect(plan.tools[0]?.existingId).toBeUndefined();
});

// ---------------------------------------------------------------------------
// T029 — attachment identity (FR-023, FR-024, FR-025)
// ---------------------------------------------------------------------------

test("an attachment already on the live agent is reused", () => {
  const plan = planFor({
    liveAgent: { id: "a1", name: "slng", tool_refs: [{ attachment_id: "att-existing", tool_id: "tool-org" }] },
  });
  expect(plan.refs[0]?.attachmentId).toBe("att-existing");
  expect(plan.refs[0]?.reused).toBe(true);
});

test("a tool not yet attached mints a fresh attachment id", () => {
  const plan = planFor({
    liveAgent: { id: "a1", name: "slng", tool_refs: [{ attachment_id: "att-other", tool_id: "some-other-tool" }] },
  });
  expect(plan.refs[0]?.attachmentId).toBe("minted-1");
  expect(plan.refs[0]?.reused).toBe(false);
});

test("creating an agent mints rather than reusing", () => {
  const plan = planFor();
  expect(plan.refs[0]?.reused).toBe(false);
  expect(plan.refs[0]?.attachmentId).toBe("minted-1");
});

// ---------------------------------------------------------------------------
// T030 — removals diff (FR-030)
// ---------------------------------------------------------------------------

test("a live reference the package no longer declares appears in removals", () => {
  const plan = planFor({
    liveAgent: {
      id: "a1",
      name: "slng",
      tool_refs: [
        { attachment_id: "att-keep", tool_id: "tool-org" },
        { attachment_id: "att-drop", tool_id: "tool-gone" },
      ],
    },
  });
  expect(plan.removals).toEqual([{ attachment_id: "att-drop", tool_id: "tool-gone" }]);
});

test("nothing is removed when the package declares everything the agent has", () => {
  const plan = planFor({
    liveAgent: { id: "a1", name: "slng", tool_refs: [{ attachment_id: "att-keep", tool_id: "tool-org" }] },
  });
  expect(plan.removals).toEqual([]);
});

// ---------------------------------------------------------------------------
// T031 — label derivation (FR-033)
// ---------------------------------------------------------------------------

test("the default label names the package and the push time", () => {
  const label = defaultLabel("/x/slng-support/build/slng/agent.json", "2026-08-27T10:14:02Z");
  expect(label).toBe("slng-support @ 2026-08-27T10:14:02Z");
});

test("the default label falls back to the compiled directory name", () => {
  expect(defaultLabel("/x/mydir/agent.json", "T")).toBe("mydir @ T");
});

test("the label is capped at the platform's limit", () => {
  const label = defaultLabel(`/${"n".repeat(300)}/agent.json`, "T");
  expect(label.length).toBeLessThanOrEqual(MAX_LABEL);
});

// ---------------------------------------------------------------------------
// T043/T044/T045 — green run, samples, immutable type (research D3, D4, D6, D7)
// ---------------------------------------------------------------------------

test("code and api_request need a green run; context-bound types do not", () => {
  expect(needsGreenRun({ name: "a", tool_type: "code" })).toBe(true);
  expect(needsGreenRun({ name: "a", tool_type: "api_request" })).toBe(true);
  expect(needsGreenRun({ name: "a", tool_type: "end_call" })).toBe(false);
  expect(needsGreenRun({ name: "a", tool_type: "send_sms" })).toBe(false);
});

test("a green-run tool shipping no sample is blocked before anything is created", () => {
  const plan = planFor({
    pkgDir: writePackage({ tools: [{ name: "check_order", tool_type: "code" }] }),
  });
  const b = plan.blockers.find((x) => x.kind === "sample_missing");
  expect(b?.items[0]).toContain("check_order");
  expect(b?.detail).toContain("samples/<tool>.json");
});

test("a sample without --run-samples is blocked, naming the flag", () => {
  const plan = planFor({
    pkgDir: writePackage({
      tools: [{ name: "check_order", tool_type: "code" }],
      samples: { check_order: { order_id: "A" } },
    }),
  });
  const b = plan.blockers.find((x) => x.kind === "samples_not_enabled");
  expect(b?.detail).toContain("--run-samples");
});

test("a sample with --run-samples plans a run and blocks nothing", () => {
  const plan = planFor({
    pkgDir: writePackage({
      tools: [{ name: "check_order", tool_type: "code" }],
      samples: { check_order: { order_id: "A" } },
    }),
    runSamples: true,
  });
  expect(plan.blockers).toEqual([]);
  expect(plan.tools[0]?.willRun).toBe(true);
});

test("a context-bound tool needs no sample and never runs", () => {
  const plan = planFor({
    pkgDir: writePackage({ tools: [{ name: "end_call", tool_type: "end_call" }] }),
  });
  expect(plan.blockers).toEqual([]);
  expect(plan.tools[0]?.willRun).toBe(false);
});

test("changing a tool's type is refused with both types named", () => {
  const plan = planFor({
    pkgDir: writePackage({ tools: [{ name: "end_call", tool_type: "code" }] }),
    catalogue: [toolRow({ name: "end_call", tool_type: "end_call" })],
  });
  const b = plan.blockers.find((x) => x.kind === "tool_type_immutable");
  expect(b?.items[0]).toContain("code");
  expect(b?.items[0]).toContain("end_call");
});

// ---------------------------------------------------------------------------
// Ambiguity (FR-031)
// ---------------------------------------------------------------------------

test("two agents of the same name refuse to guess and name --agent-id", () => {
  const plan = planFor({
    agents: [
      { id: "a1", name: "slng" },
      { id: "a2", name: "slng" },
    ],
  });
  const b = plan.blockers.find((x) => x.kind === "agent_ambiguous");
  expect(b?.items).toHaveLength(2);
  expect(b?.detail).toContain("--agent-id");
});

test("--agent-id resolves the ambiguity", () => {
  const plan = planFor({
    agents: [
      { id: "a1", name: "slng" },
      { id: "a2", name: "slng" },
    ],
    agentIdOverride: "a2",
  });
  expect(plan.blockers.find((x) => x.kind === "agent_ambiguous")).toBeUndefined();
  expect(plan.agent).toMatchObject({ action: "update", existingId: "a2" });
});

test("one matching agent plans an update, none plans a create", () => {
  expect(planFor({ agents: [{ id: "a1", name: "slng" }] }).agent.action).toBe("update");
  expect(planFor({ agents: [{ id: "a1", name: "other" }] }).agent.action).toBe("create");
});

// ---------------------------------------------------------------------------
// Gate rendering (research D3)
// ---------------------------------------------------------------------------

test("failed gates are named, nested ones included", () => {
  const text = describeGates({
    green_run: { passed: false, detail: "proven_hash does not match" },
    content_current: { passed: true },
    static: { secrets_exist: { passed: false, detail: "missing org secrets: A" } },
  });
  expect(text).toContain("green_run: proven_hash does not match");
  expect(text).toContain("static.secrets_exist: missing org secrets: A");
  expect(text).not.toContain("content_current");
});

// ---------------------------------------------------------------------------
// Action-level tests. These spawn the real CLI against a local stub server, so
// they cover exit codes, the stdout/stderr split, and the "changed nothing"
// guarantee that unit tests cannot see.
//
// BOTH hosts are pointed at the stub. `push` is the first command to touch two:
// the agents host for everything it does, and VOICEAI_BASE_URL for the identity
// probe in lib/verify.ts. Stubbing only the first — as tool/secret/trunks do,
// because they never call the second — would send every test to the live API.
// ---------------------------------------------------------------------------

const CLI_DIR = `${import.meta.dir}/../..`;

interface Call {
  method: string;
  path: string;
  body?: unknown;
}

interface StubOpts {
  agents?: Record<string, unknown>[];
  liveAgent?: Record<string, unknown>;
  tools?: ToolListItem[];
  secrets?: VaultEntry[];
  versionsBefore?: number | null;
  versionsAfter?: number | null;
  runStatus?: "succeeded" | "failed" | "timed_out";
  publish?: { published: boolean; version_number: number | null; checks?: unknown };
  agentWriteStatus?: number;
  agentWriteBody?: unknown;
}

async function runCli(
  args: string[],
  stub: StubOpts,
  opts: { stdin?: "ignore" | "inherit" } = {},
): Promise<{ stdout: string; stderr: string; code: number; calls: Call[]; unstubbed: string[] }> {
  const calls: Call[] = [];
  const unstubbed: string[] = [];
  let agentWritten = false;

  const server = Bun.serve({
    port: 0,
    async fetch(req) {
      const path = new URL(req.url).pathname;
      const method = req.method;
      let body: unknown;
      if (method !== "GET") {
        try {
          body = await req.json();
        } catch {
          body = undefined;
        }
      }
      calls.push({ method, path, body });
      const ok = (v: unknown, status = 200) =>
        new Response(JSON.stringify(v), { status, headers: { "content-type": "application/json" } });

      // main host — identity probe
      if (path === "/v1/me") return ok({ org_id: "org-1", org_name: "Acme" });

      if (path === "/v1/agents" && method === "GET") return ok(stub.agents ?? []);
      if (path === "/v1/agents" && method === "POST") {
        if (stub.agentWriteStatus) return ok(stub.agentWriteBody, stub.agentWriteStatus);
        agentWritten = true;
        return ok({ id: "agent-new", name: "slng", organisation_id: "org-1" });
      }
      if (path === "/v1/agents/tools" && method === "GET") return ok(stub.tools ?? []);
      if (path === "/v1/agents/tools" && method === "POST") return ok({ id: "tool-created" }, 201);
      if (path === "/v1/agents/secrets") return ok(stub.secrets ?? []);

      const version = path.match(/^\/v1\/agents\/([^/]+)\/versions$/);
      if (version) {
        // Before the agent is written this is the "was there a version already"
        // read; after it, the "did this push write one" read.
        const n = agentWritten ? stub.versionsAfter : stub.versionsBefore;
        return ok({ items: n === null || n === undefined ? [] : [{ version_number: n }], meta: {} });
      }
      if (/^\/v1\/agents\/[^/]+\/versions\/\d+$/.test(path)) return ok({ version_number: 2, label: "x" });

      const toolSub = path.match(/^\/v1\/agents\/tools\/([^/]+)\/(introspect|run|publish)$/);
      if (toolSub) {
        if (toolSub[2] === "run") return ok({ status: stub.runStatus ?? "succeeded", latency_ms: 1, validation: "valid" });
        if (toolSub[2] === "publish") {
          const p = stub.publish ?? { published: true, version_number: 1 };
          return ok(p, p.published ? 200 : 409);
        }
        return ok({ id: toolSub[1] });
      }
      if (/^\/v1\/agents\/tools\/[^/]+$/.test(path)) return ok({ id: path.split("/").pop() });

      if (/^\/v1\/agents\/[^/]+$/.test(path)) {
        if (method === "PUT") {
          agentWritten = true;
          return ok({ id: path.split("/").pop(), name: "slng", organisation_id: "org-1" });
        }
        return ok(stub.liveAgent ?? { id: path.split("/").pop(), name: "slng", organisation_id: "org-1", tool_refs: [] });
      }

      // Anything the stub was not primed for fails loudly rather than escaping
      // silently to the network on some future host.
      unstubbed.push(`${method} ${path}`);
      return ok({ detail: "unstubbed" }, 500);
    },
  });

  try {
    const proc = Bun.spawn(["bun", "run", "src/index.ts", ...args], {
      cwd: CLI_DIR,
      env: {
        ...process.env,
        VOICEAI_AGENTS_BASE_URL: `http://localhost:${server.port}`,
        VOICEAI_BASE_URL: `http://localhost:${server.port}`,
        VOICEAI_API_KEY: "slng_test_key",
      },
      stdin: opts.stdin ?? "ignore",
      stdout: "pipe",
      stderr: "pipe",
    });
    const [stdout, stderr] = await Promise.all([
      new Response(proc.stdout).text(),
      new Response(proc.stderr).text(),
    ]);
    return { stdout, stderr, code: await proc.exited, calls, unstubbed };
  } finally {
    server.stop(true);
  }
}

const mutating = (calls: Call[]) => calls.filter((c) => c.method !== "GET");
const orgTool = toolRow({ id: "tool-org", name: "end_call", latest_version: 3 });

// --- T013: blockers exit 1 and change nothing (FR-009, SC-002) -------------

test("a missing vault entry exits 1 and issues no mutating request", async () => {
  const dir = writePackage({ agent: { system_prompt: "{{$CRM_TOKEN}}" } });
  const r = await runCli(["agents", "push", dir], { tools: [orgTool] });
  expect(r.code).toBe(1);
  expect(mutating(r.calls)).toEqual([]);
  expect(r.stderr).toContain("CRM_TOKEN");
  expect(r.stderr).toContain("https://app.slng.ai/vault/secrets");
  expect(r.stderr).toContain("nothing was created or changed.");
  expect(r.unstubbed).toEqual([]);
});

test("an unresolved tool name exits 1, names the tool and links the dashboard", async () => {
  const dir = writePackage({ agent: { tool_refs: [{ tool: "lookup_order" }] } });
  const r = await runCli(["agents", "push", dir], { tools: [] });
  expect(r.code).toBe(1);
  expect(mutating(r.calls)).toEqual([]);
  expect(r.stderr).toContain("lookup_order");
  expect(r.stderr).toContain("https://app.slng.ai/tools");
});

test("a package that is not a package names both searched paths", async () => {
  const empty = mkdtempSync(join(tmpdir(), "push-none-"));
  temps.push(empty);
  const r = await runCli(["agents", "push", empty], {});
  expect(r.code).toBe(1);
  expect(r.stderr).toContain(join(empty, "build", "slng", "agent.json"));
  expect(r.stderr).toContain(join(empty, "agent.json"));
  expect(mutating(r.calls)).toEqual([]);
});

test("mcp references are refused before anything is created", async () => {
  const dir = writePackage({ agent: { mcp_refs: [{ server: "docs", tool_name: "search" }] } });
  const r = await runCli(["agents", "push", dir], { tools: [orgTool] });
  expect(r.code).toBe(1);
  expect(mutating(r.calls)).toEqual([]);
  expect(r.stderr).toContain("observed_schema_hash");
});

// --- T014: --json parseable on failure (FR-037) ----------------------------

test("--json stays parseable on a blocker exit and reports changed:false", async () => {
  const dir = writePackage({ agent: { system_prompt: "{{$CRM_TOKEN}}" } });
  const r = await runCli(["agents", "push", dir, "--json"], { tools: [orgTool] });
  expect(r.code).toBe(1);
  const doc = JSON.parse(r.stdout);
  expect(doc.ok).toBe(false);
  expect(doc.changed).toBe(false);
  expect(doc.blockers[0].kind).toBe("vault_missing");
  expect(doc.blockers[0].url).toBe("https://app.slng.ai/vault/secrets");
});

// --- T015: dry-run mutates nothing ----------------------------------------

test("--dry-run issues no mutating request and reports what it would do", async () => {
  const dir = writePackage();
  const r = await runCli(["agents", "push", dir, "--dry-run"], { tools: [orgTool] });
  expect(r.code).toBe(0);
  expect(mutating(r.calls)).toEqual([]);
  expect(r.stdout).toContain("would create agent");
  expect(r.stdout).toContain("no changes made.");
});

test("--dry-run --json emits the plan as one document", async () => {
  const dir = writePackage();
  const r = await runCli(["agents", "push", dir, "--dry-run", "--json"], { tools: [orgTool] });
  const doc = JSON.parse(r.stdout);
  expect(doc.ok).toBe(true);
  expect(doc.dry_run).toBe(true);
  expect(doc.refs[0].tool_id ?? doc.refs[0].toolId).toBe("tool-org");
  expect(doc.blockers).toEqual([]);
});

// --- T016: never prompts (FR-036, Constitution III) ------------------------

test("the command never prompts: it exits with stdin closed", async () => {
  const dir = writePackage();
  const clean = await runCli(["agents", "push", dir, "--dry-run"], { tools: [orgTool] }, { stdin: "ignore" });
  expect(clean.code).toBe(0);

  const blocked = writePackage({ agent: { system_prompt: "{{$CRM_TOKEN}}" } });
  const r = await runCli(["agents", "push", blocked], { tools: [orgTool] }, { stdin: "ignore" });
  expect(r.code).toBe(1);
});

// --- T032/T033: create, update, and the no-op version ----------------------

test("with no agent of that name the push creates one and labels the new version", async () => {
  const dir = writePackage();
  const r = await runCli(["agents", "push", dir, "--json"], {
    tools: [orgTool],
    versionsBefore: null,
    versionsAfter: 1,
  });
  expect(r.code).toBe(0);
  const doc = JSON.parse(r.stdout);
  expect(doc.ok).toBe(true);
  expect(doc.agent).toEqual({ id: "agent-new", action: "create" });
  expect(doc.version.number).toBe(1);
  expect(mutating(r.calls).some((c) => c.method === "POST" && c.path === "/v1/agents")).toBe(true);
});

test("an existing agent of that name is replaced with PUT, never POSTed again", async () => {
  const dir = writePackage();
  const r = await runCli(["agents", "push", dir, "--json"], {
    agents: [{ id: "agent-1", name: "slng", organisation_id: "org-1" }],
    tools: [orgTool],
    versionsBefore: 3,
    versionsAfter: 4,
  });
  expect(r.code).toBe(0);
  const doc = JSON.parse(r.stdout);
  expect(doc.agent).toEqual({ id: "agent-1", action: "update" });
  expect(mutating(r.calls).some((c) => c.method === "PUT" && c.path === "/v1/agents/agent-1")).toBe(true);
  expect(mutating(r.calls).some((c) => c.method === "POST" && c.path === "/v1/agents")).toBe(false);
});

test("a push that changes nothing writes no label", async () => {
  const dir = writePackage();
  const r = await runCli(["agents", "push", dir, "--json"], {
    agents: [{ id: "agent-1", name: "slng", organisation_id: "org-1" }],
    tools: [orgTool],
    versionsBefore: 4,
    versionsAfter: 4,
  });
  expect(r.code).toBe(0);
  expect(JSON.parse(r.stdout).version).toBe("unchanged");
  expect(r.calls.some((c) => c.method === "PATCH" && /versions\/\d+$/.test(c.path))).toBe(false);
});

test("--label overrides the derived version label", async () => {
  const dir = writePackage();
  const r = await runCli(["agents", "push", dir, "--json", "--label", "release-7"], {
    tools: [orgTool],
    versionsBefore: null,
    versionsAfter: 1,
  });
  expect(JSON.parse(r.stdout).version.label).toBe("release-7");
});

test("the pushed body carries resolved ids and no bare tool name", async () => {
  const dir = writePackage();
  const r = await runCli(["agents", "push", dir], { tools: [orgTool], versionsAfter: 1 });
  expect(r.code).toBe(0);
  const post = mutating(r.calls).find((c) => c.path === "/v1/agents");
  const refs = (post?.body as { tool_refs: Record<string, unknown>[] }).tool_refs;
  expect(refs[0]).toMatchObject({ tool_id: "tool-org", version: 3, invocation: "model" });
  expect(refs[0]).not.toHaveProperty("tool");
  expect(typeof refs[0]!.attachment_id).toBe("string");
});

// --- T034: the platform's own error survives (FR-035) ----------------------

test("a rejected body surfaces the platform's message and the field it names", async () => {
  const dir = writePackage();
  const r = await runCli(["agents", "push", dir], {
    tools: [orgTool],
    agentWriteStatus: 422,
    agentWriteBody: {
      detail: "AGENT_MODEL_UNAVAILABLE",
      error: { code: "AGENT_MODEL_UNAVAILABLE", message: "models.stt is not allowed for region 'eu-central'" },
    },
  });
  expect(r.code).toBe(1);
  expect(r.stderr).toContain("models.stt");
  expect(r.stderr).toContain("eu-central");
});

// --- T046/T047: consent and abort (research D6, FR-018) --------------------

test("no /run request is issued without --run-samples", async () => {
  const dir = writePackage({
    tools: [{ name: "check_order", tool_type: "code" }],
    samples: { check_order: { order_id: "A" } },
  });
  const r = await runCli(["agents", "push", dir], { tools: [orgTool] });
  expect(r.code).toBe(1); // blocked: sample present but not consented to
  expect(r.calls.some((c) => c.path.endsWith("/run"))).toBe(false);
  expect(r.stderr).toContain("--run-samples");
});

test("--run-samples sends confirm_side_effects and publishes", async () => {
  const dir = writePackage({
    agent: { tool_refs: [{ tool: "check_order", invocation: "model" }] },
    tools: [{ name: "check_order", tool_type: "code" }],
    samples: { check_order: { order_id: "A" } },
  });
  const r = await runCli(["agents", "push", dir, "--run-samples", "--json"], {
    tools: [],
    versionsAfter: 1,
    publish: { published: true, version_number: 7 },
  });
  expect(r.code).toBe(0);
  const run = r.calls.find((c) => c.path.endsWith("/run"));
  expect(run?.body).toEqual({ sample_input: { order_id: "A" }, confirm_side_effects: true });
  const post = mutating(r.calls).find((c) => c.path === "/v1/agents");
  const refs = (post?.body as { tool_refs: Record<string, unknown>[] }).tool_refs;
  expect(refs[0]).toMatchObject({ tool_id: "tool-created", version: 7 });
});

test("a failed sample aborts before the agent is written", async () => {
  const dir = writePackage({
    agent: { tool_refs: [{ tool: "check_order", invocation: "model" }] },
    tools: [{ name: "check_order", tool_type: "code" }],
    samples: { check_order: { order_id: "A" } },
  });
  const r = await runCli(["agents", "push", dir, "--run-samples"], { tools: [], runStatus: "failed" });
  expect(r.code).toBe(1);
  expect(r.calls.some((c) => c.method === "POST" && c.path === "/v1/agents")).toBe(false);
  expect(r.stderr).toContain("check_order");
  expect(r.stderr).toContain("the agent was not created or updated");
});

// --- T048/T049: 409 publish and partial state (research D3, FR-021) --------

test("a 409 publish is rendered as named gate failures, not a generic error", async () => {
  const dir = writePackage({
    agent: { tool_refs: [{ tool: "check_order", invocation: "model" }] },
    tools: [{ name: "check_order", tool_type: "end_call" }],
  });
  const r = await runCli(["agents", "push", dir], {
    tools: [],
    publish: {
      published: false,
      version_number: null,
      checks: { green_run: { passed: false, detail: "proven_hash does not match the current draft" } },
    },
  });
  expect(r.code).toBe(1);
  expect(r.stderr).toContain("green_run");
  expect(r.stderr).toContain("proven_hash does not match the current draft");
  expect(r.calls.some((c) => c.method === "POST" && c.path === "/v1/agents")).toBe(false);
});

test("a partial push reports what was left behind", async () => {
  const dir = writePackage({
    agent: { tool_refs: [{ tool: "check_order", invocation: "model" }] },
    tools: [{ name: "check_order", tool_type: "end_call" }],
  });
  const r = await runCli(["agents", "push", dir], {
    tools: [],
    publish: { published: false, version_number: null, checks: {} },
  });
  expect(r.stderr).toContain("NOT DONE");
  // The tool was created and the publish was REJECTED, so nothing is permanent
  // here — telling the operator it "cannot be unpublished" would be false.
  expect(r.stderr).toContain("created but not published");
  expect(r.stderr).not.toContain("cannot be unpublished");
  // It still exists, so it must be accounted for rather than shown as nothing.
  expect(r.stderr).not.toContain("(nothing)");
});

// ---------------------------------------------------------------------------
// Managed singletons. Regression: shipping a body for end_call/send_sms/
// transfer_call when the org already has one made POST /v1/agents/tools return
// the EXISTING tool under a different name, which push then published — a new
// version of a shared production tool nobody asked to touch. Publish is
// content-addressed, so identical content hides it; one different character
// does not. Caught live on 2026-08-27.
// ---------------------------------------------------------------------------

test("shipping a body for a type the org already holds is refused", () => {
  const plan = planFor({
    pkgDir: writePackage({
      agent: { tool_refs: [{ tool: "push_test_tool" }] },
      tools: [{ name: "push_test_tool", tool_type: "end_call" }],
    }),
    catalogue: [],
    orgTools: [toolRow({ id: "existing", name: "end_call", tool_type: "end_call" })],
  });
  const b = plan.blockers.find((x) => x.kind === "singleton_exists");
  expect(b?.items[0]).toContain("push_test_tool");
  expect(b?.items[0]).toContain('named "end_call"');
  expect(b?.detail).toContain("adopt and republish");
});

test("a singleton type is allowed when the org holds none", () => {
  const plan = planFor({
    pkgDir: writePackage({
      agent: { tool_refs: [{ tool: "push_test_tool" }] },
      tools: [{ name: "push_test_tool", tool_type: "end_call" }],
    }),
    catalogue: [],
    orgTools: [],
  });
  expect(plan.blockers.find((x) => x.kind === "singleton_exists")).toBeUndefined();
});

test("a non-singleton type is never blocked by an existing tool of that type", () => {
  const plan = planFor({
    pkgDir: writePackage({
      agent: { tool_refs: [{ tool: "lookup" }] },
      tools: [{ name: "lookup", tool_type: "code" }],
      samples: { lookup: {} },
    }),
    runSamples: true,
    catalogue: [],
    orgTools: [toolRow({ id: "x", name: "other_code", tool_type: "code" })],
  });
  expect(plan.blockers.find((x) => x.kind === "singleton_exists")).toBeUndefined();
});

test("a failed agent write is not rendered as a nameless tool row", async () => {
  const dir = writePackage();
  const r = await runCli(["agents", "push", dir], {
    tools: [orgTool],
    agentWriteStatus: 422,
    agentWriteBody: { detail: "nope", error: { code: "X", message: "Select an outbound SIP trunk" } },
  });
  expect(r.code).toBe(1);
  expect(r.stderr).toContain("the agent was not created or updated");
  // The old bug printed a blank-name row under NOT DONE and repeated the error.
  expect(r.stderr).not.toMatch(/NOT DONE\n\s+HTTP/);
  expect(r.stderr.match(/Select an outbound SIP trunk/g)?.length).toBe(1);
});

test("a detached tool is named, not just its uuid", () => {
  const plan = planFor({
    liveAgent: {
      id: "a1",
      name: "slng",
      tool_refs: [
        { attachment_id: "att-keep", tool_id: "tool-org" },
        { attachment_id: "att-drop", tool_id: "tool-gone" },
      ],
    },
    orgTools: [toolRow({ id: "tool-gone", name: "meteo-forecat", tool_type: "code" })],
  });
  expect(plan.removals[0]).toMatchObject({ tool_id: "tool-gone", name: "meteo-forecat" });
});

test("a detached tool missing from the catalogue still reports its id", () => {
  const plan = planFor({
    liveAgent: { id: "a1", name: "slng", tool_refs: [{ attachment_id: "att-drop", tool_id: "unknown-id" }] },
    orgTools: [],
  });
  expect(plan.removals[0]).toMatchObject({ tool_id: "unknown-id", name: undefined });
});

// ---------------------------------------------------------------------------
// T069 — "before the write" is a claim no other test in this file can check.
// Every other action-level test reads stderr after the process exits, which
// cannot distinguish "reported before mutating" from "reported after". This one
// holds the first mutating request open and snapshots stderr at that instant.
// ---------------------------------------------------------------------------

/** Run the CLI, freezing the first non-GET request so stderr can be sampled mid-flight. */
async function runCliCapturingStderrAtFirstWrite(
  args: string[],
  stub: StubOpts,
): Promise<{ stderrBeforeWrite: string; code: number }> {
  let releaseGate: () => void = () => {};
  const gate = new Promise<void>((r) => (releaseGate = r));
  let signalWrite: () => void = () => {};
  const firstWrite = new Promise<void>((r) => (signalWrite = r));
  let frozen = false;

  const server = Bun.serve({
    port: 0,
    async fetch(req) {
      const path = new URL(req.url).pathname;
      const ok = (v: unknown, status = 200) =>
        new Response(JSON.stringify(v), { status, headers: { "content-type": "application/json" } });
      if (req.method !== "GET" && !frozen) {
        frozen = true;
        signalWrite();
        await gate; // hold the write open while the test samples stderr
      }
      if (path === "/v1/me") return ok({ org_id: "org-1", org_name: "Acme" });
      if (path === "/v1/agents" && req.method === "GET") return ok(stub.agents ?? []);
      if (path === "/v1/agents" && req.method === "POST")
        return ok({ id: "agent-new", name: "slng", organisation_id: "org-1" });
      if (path === "/v1/agents/tools") return ok(stub.tools ?? []);
      if (path === "/v1/agents/secrets") return ok(stub.secrets ?? []);
      if (/\/versions$/.test(path)) return ok({ items: [{ version_number: 1 }], meta: {} });
      if (/\/versions\/\d+$/.test(path)) return ok({ version_number: 1, label: "x" });
      if (/^\/v1\/agents\/[^/]+$/.test(path)) return ok({ id: "agent-new", name: "slng", tool_refs: [] });
      return ok({}, 200);
    },
  });

  try {
    const proc = Bun.spawn(["bun", "run", "src/index.ts", ...args], {
      cwd: CLI_DIR,
      env: {
        ...process.env,
        VOICEAI_AGENTS_BASE_URL: `http://localhost:${server.port}`,
        VOICEAI_BASE_URL: `http://localhost:${server.port}`,
        VOICEAI_API_KEY: "slng_test_key",
      },
      stdin: "ignore",
      stdout: "pipe",
      stderr: "pipe",
    });

    let buffered = "";
    const reader = proc.stderr.getReader();
    const decoder = new TextDecoder();
    const pump = (async () => {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffered += decoder.decode(value, { stream: true });
      }
    })();

    await firstWrite;
    const stderrBeforeWrite = buffered;
    releaseGate();
    await pump;
    return { stderrBeforeWrite, code: await proc.exited };
  } finally {
    releaseGate();
    server.stop(true);
  }
}

test("the organisation is named on stderr before the first mutating request", async () => {
  const dir = writePackage();
  const r = await runCliCapturingStderrAtFirstWrite(["agents", "push", dir], { tools: [orgTool] });
  expect(r.stderrBeforeWrite).toContain("Acme");
  expect(r.stderrBeforeWrite).toContain("org-1");
});

test("create-vs-update is stated on stderr before the first mutating request, without a TTY", async () => {
  const dir = writePackage();
  const r = await runCliCapturingStderrAtFirstWrite(["agents", "push", dir], { tools: [orgTool] });
  expect(r.stderrBeforeWrite).toMatch(/creating/i);
  expect(r.stderrBeforeWrite).toContain("slng");
});

// --- T068: what a replace would overwrite (FR-030, SC-006) -----------------

test("scalar fields that differ from the live agent are listed as overwrites", () => {
  const plan = planFor({
    liveAgent: {
      id: "a1",
      name: "slng",
      system_prompt: "something an operator edited in the dashboard",
      greeting: "Hi",
      tool_refs: [],
    },
  });
  expect(plan.overwrites).toContain("system_prompt");
  expect(plan.overwrites).not.toContain("greeting");
});

test("creating an agent overwrites nothing", () => {
  expect(planFor().overwrites).toEqual([]);
});

test("fields that do not round trip are never reported as overwrites", () => {
  // schema_version reads back null and template_variable_options comes back
  // under a different name; a generic diff would flag both on every push.
  const plan = planFor({
    liveAgent: { id: "a1", name: "slng", schema_version: null, tool_refs: [] },
  });
  expect(plan.overwrites).not.toContain("schema_version");
  expect(plan.overwrites).not.toContain("template_variable_options");
});

test("the dry run prints an overwrite block naming each field", () => {
  const plan = planFor({
    liveAgent: { id: "a1", name: "slng", system_prompt: "edited elsewhere", tool_refs: [] },
  });
  const out = renderPlan(plan);
  expect(out).toContain("WILL BE OVERWRITTEN");
  expect(out).toContain("system_prompt");
});

// --- T067: a tool nothing ran is stated, not left blank (FR-019) ----------

test("a published tool that never ran is reported as not exercised", () => {
  const out = renderOutcome(planFor(), {
    tools: [{ name: "end_call_copy", created: true, published: 1 }],
    agent: { id: "a1", action: "create" },
    version: "unchanged",
  });
  expect(out).toContain("not exercised");
  expect(out).toContain("published v1");
});

test("a tool that ran reports its status instead", () => {
  const out = renderOutcome(planFor(), {
    tools: [{ name: "check_order", created: true, ran: "succeeded", published: 2 }],
    agent: { id: "a1", action: "create" },
    version: "unchanged",
  });
  expect(out).toContain("ran (succeeded)");
  expect(out).not.toContain("not exercised");
});

// Regression: the platform enriches what it stores, so a whole-value compare
// reported `models` as overwritten on every single push. Caught live, not by
// the suite — the stub returned exactly what was sent.

test("server-added defaults inside a declared object are not an overwrite", () => {
  const declared = { stt: "nova", llm: "gpt", stt_kwargs: {} };
  const live = {
    stt: "nova",
    llm: "gpt",
    stt_kwargs: { punctuate: true },
    fallbacks: { stt: [], llm: [], tts: [] },
    failure_audio_enabled: true,
  };
  expect(declaredDiffers(declared, live)).toBe(false);
});

test("a value the package actually changed is still an overwrite", () => {
  expect(declaredDiffers({ stt: "nova" }, { stt: "whisper", extra: 1 })).toBe(true);
  expect(declaredDiffers("a prompt", "a different prompt")).toBe(true);
  expect(declaredDiffers("same", "same")).toBe(false);
});

test("models enriched by the platform does not appear in overwrites", () => {
  const plan = planFor({
    liveAgent: {
      id: "a1",
      name: "slng",
      models: { stt: "nova", stt_kwargs: { punctuate: true }, fallbacks: { stt: [] } },
      tool_refs: [],
    },
    pkgDir: writePackage({ agent: { models: { stt: "nova", stt_kwargs: {} } } }),
  });
  expect(plan.overwrites).not.toContain("models");
});


// --- the --json document is a published contract -------------------------
//
// These exist because the shape drifted unnoticed: the dry-run emitted
// `{...plan}`, so the internal camelCase field names became the public
// document and `jq '.refs[].tool_id'` returned null against a live org. Every
// key a script is told to read is pinned here by name.

test("planJson publishes snake_case keys, not the internal plan shape", () => {
  const doc = planJson(planFor());
  expect(Object.keys(doc)).toEqual([
    "organisation",
    "package",
    "agent",
    "tools",
    "refs",
    "removals",
    "overwrites",
    "blockers",
  ]);
  // The internal names must not survive the boundary.
  expect(JSON.stringify(doc)).not.toContain("toolId");
  expect(JSON.stringify(doc)).not.toContain("attachmentId");
  expect(JSON.stringify(doc)).not.toContain("packagePath");
  expect(JSON.stringify(doc)).not.toContain("existingId");
});

test("planJson refs carry every key the contract names", () => {
  const ref = planJson(planFor()).refs as Record<string, unknown>[];
  expect(ref[0]).toMatchObject({
    name: "end_call",
    tool_id: "tool-org",
    version: 3,
    reused: false,
  });
  expect(typeof ref[0]?.attachment_id).toBe("string");
  // Carried fields are preserved byte-for-byte alongside, not nested (FR-026).
  expect(ref[0]).toHaveProperty("invocation");
});

test("the success report does not repeat the organisation the header just named", () => {
  const plan = planFor();
  const header = renderHeader(plan);
  const outcome = renderOutcome(plan, {
    tools: [],
    agent: { id: "a-1", action: "create" },
    version: { number: 1, label: "l" },
  });
  expect(header).toContain("organisation");
  expect(outcome).not.toContain("organisation");
});

test("a name at or over the column width keeps a separating space", () => {
  const plan = planFor();
  plan.tools = [
    {
      name: "push_test_webhook",
      action: "create",
      toolType: "api_request",
      willRun: true,
      needsGreenRun: true,
      hasSample: true,
    },
  ];
  const line = renderPlan(plan)
    .split("\n")
    .find((l) => l.includes("push_test_webhook"));
  expect(line).toContain("push_test_webhook create");
});


test("code-only fields are stripped from a non-code tool write body", () => {
  // The platform rejects these outright on an api_request tool; a compiled
  // package can still carry them as empty arrays.
  const stripped = toolWriteBody({
    name: "w",
    tool_type: "api_request",
    config: { type: "api_request" },
    declared_secrets: [],
    dependencies: [],
  } as never) as Record<string, unknown>;
  expect(stripped).not.toHaveProperty("declared_secrets");
  expect(stripped).not.toHaveProperty("dependencies");

  const code = toolWriteBody({
    name: "c",
    tool_type: "code",
    config: { type: "code" },
    declared_secrets: ["A"],
    dependencies: [],
  } as never) as Record<string, unknown>;
  expect(code.declared_secrets).toEqual(["A"]);
});

test("a tool created before the failure is reported as left behind, not as nothing", () => {
  const report = renderPartial(
    {
      tools: [
        { name: "push_test_fail", created: true, ran: "failed", error: "sample run failed: boom" },
      ],
      failedAt: "tool push_test_fail",
    },
    "sample run failed: boom",
  );
  expect(report).not.toContain("(nothing)");
  expect(report).toMatch(/push_test_fail\s+created, ran \(failed\)/);
  // It was never published, so it is deletable — say so rather than implying permanence.
  expect(report).toContain("created but not published");
  expect(report).not.toContain("cannot be unpublished");
});

test("a published tool says the damage is permanent", () => {
  const report = renderPartial(
    {
      tools: [
        { name: "a", created: true, published: 1 },
        { name: "b", created: true, error: "publish rejected" },
      ],
      failedAt: "tool b",
    },
    "publish rejected",
  );
  expect(report).toContain("cannot be unpublished");
});

test("the platform error is printed once, and a traceback stays inside its item", () => {
  const trace = "sample run failed: Traceback\n  File \"tool.py\", line 13\nRuntimeError: boom";
  const report = renderPartial(
    { tools: [{ name: "t", created: true, error: trace }], failedAt: "tool t" },
    trace,
  );
  // Exactly once: the NOT DONE item already carries it, so the trailing
  // summary is suppressed rather than repeating a whole traceback.
  expect(report.split("RuntimeError: boom").length - 1).toBe(1);
  // Continuation lines are pushed right so the list structure survives.
  expect(report).toMatch(/\n {4,}File "tool\.py", line 13/);
});
