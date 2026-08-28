import { Command } from "commander";
import { randomUUID } from "node:crypto";
import { basename, dirname } from "node:path";
import ora from "ora";
import { agentsRequest, formatAgentsError, type AgentsResult } from "../lib/agents";
import {
  isManagedSingleton,
  loadPackage,
  needsGreenRun,
  PackageError,
  requiredSecretNames,
  type LoadedPackage,
  type PackageToolBody,
  type PackageToolRef,
} from "../lib/package";
import { verifyApiKey } from "../lib/verify";
import { listSecrets, redact, type VaultEntry } from "./secret";
import { listAllTools, type ToolListItem } from "./tool";

// --- dashboard ------------------------------------------------------------
// Every blocker points at the page that fixes it. Nothing here is created by
// the CLI: the operator is sent to the dashboard, deliberately.

const VAULT_URL = "https://app.slng.ai/vault/secrets";
const TOOLS_URL = "https://app.slng.ai/tools";

// --- types ----------------------------------------------------------------

export type BlockerKind =
  | "vault_missing"
  | "tool_unresolved"
  | "tool_type_immutable"
  | "sample_missing"
  | "samples_not_enabled"
  | "singleton_exists"
  | "mcp_unsupported"
  | "agent_ambiguous";

export interface Blocker {
  kind: BlockerKind;
  /** One line per offending thing. Every blocker names what is wrong, never just that something is. */
  items: string[];
  detail?: string;
  url?: string;
}

export interface PlannedTool {
  name: string;
  action: "create" | "update";
  toolType: string;
  existingId?: string;
  needsGreenRun: boolean;
  hasSample: boolean;
  willRun: boolean;
}

export interface PlannedRef {
  name: string;
  toolId: string;
  /** null until the tool this push publishes returns its version number. */
  version: number | null;
  attachmentId: string;
  reused: boolean;
  /** Everything unmute wrote alongside the name, preserved verbatim. */
  carried: Record<string, unknown>;
}

export interface PushPlan {
  organisation: { id: string; name?: string };
  packagePath: string;
  agent: { name: string; action: "create" | "update"; existingId?: string };
  tools: PlannedTool[];
  refs: PlannedRef[];
  removals: { attachment_id: string; tool_id: string; name?: string }[];
  /** Scalar fields a replace would overwrite on an existing agent. */
  overwrites: string[];
  blockers: Blocker[];
}

export interface ToolOutcome {
  name: string;
  created?: boolean;
  updated?: boolean;
  introspected?: boolean;
  ran?: "succeeded" | "failed" | "timed_out";
  published?: number | false;
  error?: string;
}

export interface ApplyOutcome {
  tools: ToolOutcome[];
  agent?: { id: string; action: "create" | "update" };
  version?: { number: number; label: string } | "unchanged";
  failedAt?: string;
}

interface AgentRow {
  id: string;
  name: string;
  organisation_id?: string;
  tool_refs?: { attachment_id: string; tool_id: string }[];
  [k: string]: unknown;
}

interface GateCheck {
  passed?: boolean;
  detail?: string | null;
}

interface PublishResult {
  published: boolean;
  version_number: number | null;
  checks?: Record<string, unknown>;
}

interface RunResult {
  status: "succeeded" | "failed" | "timed_out";
  error?: string | null;
  validation?: string;
}

// --- small helpers --------------------------------------------------------

function fail(json: boolean | undefined, message: string, extra?: Record<string, unknown>): never {
  if (json) console.log(JSON.stringify({ ok: false, ...extra, error: message }, null, 2));
  else process.stderr.write(`${message}\n`);
  process.exit(1);
}

function spin(label: string) {
  return process.stderr.isTTY
    ? ora({ stream: process.stderr, text: label, color: "yellow", spinner: "line" }).start()
    : null;
}

function note(message: string): void {
  process.stderr.write(`${message}\n`);
}

/** Throw the API's own error text; callers turn it into an exit. */
async function must<T>(req: Promise<AgentsResult<T>>): Promise<T> {
  const res = await req;
  if (!res.ok) throw new Error(formatAgentsError(res));
  return res.data as T;
}

export const MAX_LABEL = 120;

/** Package directory name plus the push time — derived, never invented by the operator. */
export function defaultLabel(packagePath: string, now: string): string {
  // .../<pkg>/build/slng/agent.json -> <pkg>; .../<dir>/agent.json -> <dir>
  const compiled = dirname(packagePath);
  const name = compiled.endsWith(`build/slng`)
    ? basename(dirname(dirname(compiled)))
    : basename(compiled);
  return `${name} @ ${now}`.slice(0, MAX_LABEL);
}

/**
 * Fields compared when warning what a replace would overwrite.
 *
 * A named list rather than a generic diff, because several fields do not round
 * trip: `schema_version` reads back null, and the package's
 * `template_variable_options` is returned as `template_variables`. A generic
 * diff would flag those on every push and train the operator to ignore the
 * warning — which is the one thing this warning cannot afford.
 */
const COMPARED_FIELDS = [
  "system_prompt",
  "greeting",
  "language",
  "region",
  "models",
  "enable_interruptions",
] as const;

/**
 * Does the value the package declares differ from what the agent currently has?
 *
 * For objects this compares only the keys the package actually declares. The
 * platform enriches what it stores — `models` comes back with `stt_kwargs`
 * defaults, `fallbacks` and four timeout fields the package never wrote — so a
 * whole-value comparison reports `models` as changed on EVERY push. A warning
 * that always fires is a warning nobody reads, which would cost more than the
 * one it is there to give.
 */
export function declaredDiffers(declared: unknown, live: unknown): boolean {
  if (declared === null || typeof declared !== "object" || Array.isArray(declared)) {
    return JSON.stringify(declared ?? null) !== JSON.stringify(live ?? null);
  }
  if (live === null || typeof live !== "object" || Array.isArray(live)) return true;
  const l = live as Record<string, unknown>;
  return Object.entries(declared as Record<string, unknown>).some(([k, v]) =>
    declaredDiffers(v, l[k]),
  );
}

// --- plan (pure, read-only) -----------------------------------------------

export interface PlanInputs {
  pkg: LoadedPackage;
  agents: AgentRow[];
  secrets: VaultEntry[];
  /** Tool catalogue rows for every referenced/shipped name. */
  catalogue: ToolListItem[];
  /**
   * The whole visible catalogue. Needed for two questions a name-filtered
   * catalogue cannot answer: whether the org already holds a managed singleton
   * (matched on tool_type), and what a tool being detached is actually called.
   */
  orgTools?: ToolListItem[];
  /** The live agent, when updating — source of attachment reuse and removals. */
  liveAgent?: AgentRow;
  runSamples: boolean;
  organisation: { id: string; name?: string };
  agentIdOverride?: string;
  mintId?: () => string;
}

/**
 * Build the whole intended push from already-read state. Pure: it performs no
 * I/O, so every blocker is decided before anything can be changed. A check that
 * runs during apply instead of here would break FR-009's guarantee.
 */
export function buildPlan(input: PlanInputs): PushPlan {
  const { pkg, secrets, catalogue, liveAgent, runSamples } = input;
  const blockers: Blocker[] = [];
  const mint = input.mintId ?? randomUUID;

  // --- agent identity ---
  const named = input.pkg.agent.name;
  const matches = input.agents.filter((a) => a.name === named);
  let existingId = input.agentIdOverride;
  if (!existingId) {
    if (matches.length > 1) {
      blockers.push({
        kind: "agent_ambiguous",
        items: matches.map((a) => `${a.name}  ${a.id}`),
        detail:
          `${matches.length} agents are named "${named}". ` +
          "name the one to update with --agent-id <id>.",
      });
    } else {
      existingId = matches[0]?.id;
    }
  }
  const action: "create" | "update" = existingId ? "update" : "create";

  // --- mcp ---
  if ((pkg.agent.mcp_refs?.length ?? 0) > 0) {
    blockers.push({
      kind: "mcp_unsupported",
      items: [`${pkg.agent.mcp_refs?.length} MCP reference(s)`],
      detail:
        "MCP references need an observed_schema_hash computed from the server's own " +
        "tools/list response, which means connecting to it. push cannot do that yet — " +
        "attach MCP servers in the dashboard instead.",
    });
  }

  // --- vault ---
  const bySecretName = new Map(secrets.map((s) => [s.name, s]));
  const missingSecrets: string[] = [];
  for (const name of requiredSecretNames(pkg)) {
    const entry = bySecretName.get(name);
    // A `variable` of the right name does NOT satisfy a secret requirement: the
    // platform's secrets_exist gate counts kind === "secret" only.
    if (!entry) missingSecrets.push(name);
    else if (entry.kind !== "secret") missingSecrets.push(`${name} (exists as a variable, not a secret)`);
  }
  if (missingSecrets.length) {
    blockers.push({
      kind: "vault_missing",
      items: missingSecrets,
      detail: "create them, then push again. a name that exists as a variable does not count — the platform's publish gate counts secrets only.",
      url: VAULT_URL,
    });
  }

  // --- tools shipped by the package ---
  const shipped = new Map(pkg.tools.map((t) => [t.name, t]));
  const tools: PlannedTool[] = [];
  const typeConflicts: string[] = [];
  const missingSamples: string[] = [];
  const unconsentedSamples: string[] = [];
  const singletons: string[] = [];

  for (const body of pkg.tools) {
    const orgRow = catalogue.find((r) => r.name === body.name);
    if (orgRow && orgRow.tool_type !== body.tool_type) {
      typeConflicts.push(
        `${body.name}: package says ${body.tool_type}, the existing tool is ${orgRow.tool_type}`,
      );
    }
    // The platform allows one of these per organisation, and creating a second
    // silently returns the first — under a different name — which publish would
    // then version. Refuse instead of touching a shared tool.
    if (isManagedSingleton(body)) {
      const held = (input.orgTools ?? []).find(
        (r) => r.tool_type === body.tool_type,
      );
      if (held) {
        singletons.push(
          `${body.name} (${body.tool_type}) — this organisation already has one, named "${held.name}"`,
        );
      }
    }
    const green = needsGreenRun(body);
    const hasSample = pkg.samples.has(body.name);
    if (green && !hasSample) missingSamples.push(`${body.name} (${body.tool_type})`);
    else if (green && !runSamples) unconsentedSamples.push(`${body.name} (${body.tool_type})`);
    tools.push({
      name: body.name,
      action: orgRow ? "update" : "create",
      toolType: body.tool_type,
      existingId: orgRow?.id,
      needsGreenRun: green,
      hasSample,
      willRun: green && hasSample && runSamples,
    });
  }

  if (singletons.length) {
    blockers.push({
      kind: "singleton_exists",
      items: singletons,
      detail:
        "the platform allows one tool of this type per organisation. shipping a body would " +
        "adopt and republish the existing one instead of creating a new tool. drop the body " +
        "from the package and reference the existing tool by its name.",
      url: TOOLS_URL,
    });
  }
  if (typeConflicts.length) {
    blockers.push({
      kind: "tool_type_immutable",
      items: typeConflicts,
      detail:
        "a tool's type cannot be changed after it is created. rename the tool in the package, " +
        "or delete the existing one in the dashboard.",
      url: TOOLS_URL,
    });
  }
  if (missingSamples.length) {
    blockers.push({
      kind: "sample_missing",
      items: missingSamples,
      detail:
        "a code or api_request tool cannot publish until one successful run proves it. " +
        "write samples/<tool>.json next to the tool bodies, then push with --run-samples.",
    });
  }
  if (unconsentedSamples.length) {
    blockers.push({
      kind: "samples_not_enabled",
      items: unconsentedSamples,
      detail:
        "a sample was found but running it executes the tool against your real dependencies. " +
        "re-run with --run-samples to consent to that.",
    });
  }

  // --- references ---
  const reuse = new Map((liveAgent?.tool_refs ?? []).map((r) => [r.tool_id, r.attachment_id]));
  const refs: PlannedRef[] = [];
  const unresolved: string[] = [];

  for (const ref of pkg.agent.tool_refs ?? []) {
    const { tool: name, ...carried } = ref as PackageToolRef;
    const rows = catalogue.filter((r) => r.name === name);
    const chosen = rows[0];
    const shipsBody = shipped.has(name);

    if (!chosen && !shipsBody) {
      unresolved.push(name);
      continue;
    }
    // A tool this push creates has no id yet; it is filled in during apply.
    const toolId = chosen?.id ?? "";
    const existingAttachment = toolId ? reuse.get(toolId) : undefined;
    refs.push({
      name,
      toolId,
      // A shipped body republishes, so its version is only known after publish.
      version: shipsBody ? null : (chosen?.latest_version ?? null),
      attachmentId: existingAttachment ?? mint(),
      reused: Boolean(existingAttachment),
      carried,
    });
  }

  if (unresolved.length) {
    blockers.push({
      kind: "tool_unresolved",
      items: unresolved.map((n) => `${n} — no tool of that name is visible to this organisation`),
      detail: "rename the reference, or create the tool.",
      url: TOOLS_URL,
    });
  }

  // --- removals (replace semantics are lossy; this is the only warning) ---
  const keptAttachments = new Set(refs.map((r) => r.attachmentId));
  const nameById = new Map((input.orgTools ?? []).map((t) => [t.id, t.name]));
  const removals = (liveAgent?.tool_refs ?? [])
    .filter((r) => !keptAttachments.has(r.attachment_id))
    // Name it. This is the operator's only warning before a lossy replace, and
    // a bare UUID does not tell them what they are about to lose.
    .map((r) => ({ ...r, name: nameById.get(r.tool_id) }));

  // --- what a replace would overwrite (FR-030, SC-006) ---
  const overwrites: string[] = [];
  if (liveAgent) {
    for (const field of COMPARED_FIELDS) {
      if (!(field in pkg.agent)) continue;
      if (declaredDiffers(pkg.agent[field], liveAgent[field])) overwrites.push(field);
    }
  }

  return {
    organisation: input.organisation,
    packagePath: pkg.location.agentBody,
    agent: { name: named, action, existingId },
    tools,
    refs,
    removals,
    overwrites,
    blockers,
  };
}

/** Read everything buildPlan needs. Read-only: no mutating request is issued here. */
export async function planPush(
  dir: string,
  opts: { runSamples: boolean; agentId?: string },
): Promise<{ plan: PushPlan; pkg: LoadedPackage }> {
  const pkg = loadPackage(dir);

  const agents = await must<AgentRow[]>(agentsRequest("GET", "/v1/agents"));
  // Redact at the boundary, not at the renderer. push only ever reads `name`
  // and `kind`, but an entry of kind `variable` comes back with its plaintext
  // value attached — stripping it here is what stops a future output path from
  // printing one by accident.
  const secrets = (await listSecrets()).map(redact) as VaultEntry[];

  const names = new Set<string>();
  for (const r of pkg.agent.tool_refs ?? []) if (typeof r.tool === "string") names.add(r.tool);
  for (const t of pkg.tools) names.add(t.name);
  const catalogue = names.size ? await listAllTools([...names]) : [];

  const existing = opts.agentId ?? agents.filter((a) => a.name === pkg.agent.name)[0]?.id;
  let liveAgent: AgentRow | undefined;
  if (existing) {
    liveAgent = await must<AgentRow>(
      agentsRequest("GET", `/v1/agents/${encodeURIComponent(existing)}`),
    );
  }

  // One extra read, and only when it can change the answer: a shipped singleton
  // body needs a type match, and an update needs names for anything it detaches.
  // Must follow the liveAgent read, which is what decides the second case.
  const needsFullCatalogue =
    pkg.tools.some(isManagedSingleton) || Boolean(liveAgent?.tool_refs?.length);
  const orgTools = needsFullCatalogue ? await listAllTools() : [];

  const organisation = await resolveOrganisation(agents, secrets, liveAgent);

  const plan = buildPlan({
    pkg,
    agents,
    secrets,
    catalogue,
    orgTools,
    liveAgent,
    runSamples: opts.runSamples,
    organisation,
    agentIdOverride: opts.agentId,
  });
  return { plan, pkg };
}

/**
 * Which organisation this push writes to (FR-011).
 *
 * The id comes from reads already made against the agents host, so no extra
 * call is needed. The friendly name comes from the identity probe, which
 * targets a DIFFERENT host (VOICEAI_BASE_URL) — so it is best-effort only: a
 * misconfigured main-API URL must not fail a push the agents host would accept.
 */
async function resolveOrganisation(
  agents: AgentRow[],
  secrets: VaultEntry[],
  liveAgent?: AgentRow,
): Promise<{ id: string; name?: string }> {
  const id =
    liveAgent?.organisation_id ??
    agents.find((a) => a.organisation_id)?.organisation_id ??
    secrets[0]?.organisation_id ??
    "";
  const key = process.env.VOICEAI_API_KEY;
  if (key) {
    try {
      const probe = await verifyApiKey(key);
      if (probe.ok && probe.account) {
        return { id: id || (probe.account.org_id ?? ""), name: probe.account.org_name };
      }
    } catch {
      // Different host, best-effort only. Fall through to the id we already have.
    }
  }
  return { id };
}

// --- apply ----------------------------------------------------------------

/** Tools first, then the agent, then the label. The platform's dependencies fix this order. */
export async function applyPush(
  plan: PushPlan,
  pkg: LoadedPackage,
  opts: { label?: string; now: string },
): Promise<ApplyOutcome> {
  const outcome: ApplyOutcome = { tools: [] };
  const byName = new Map(pkg.tools.map((t) => [t.name, t]));

  // 1. tools
  for (const planned of plan.tools) {
    const body = byName.get(planned.name) as PackageToolBody;
    const rec: ToolOutcome = { name: planned.name };
    outcome.tools.push(rec);
    try {
      const tool = await syncTool(planned, body, pkg, rec);
      // The agent's reference points at the version this push just published.
      for (const ref of plan.refs) {
        if (ref.name === planned.name) {
          ref.toolId = tool.id;
          ref.version = tool.version;
        }
      }
    } catch (e) {
      rec.error = (e as Error).message;
      outcome.failedAt = `tool ${planned.name}`;
      return outcome;
    }
  }

  // 2. agent — PUT, not PATCH: replace is what the spec chose, and PATCH merges.
  const body = buildAgentBody(pkg, plan);
  const before = plan.agent.existingId ? await newestVersion(plan.agent.existingId) : null;
  let agentId: string;
  try {
    const written = plan.agent.existingId
      ? await must<AgentRow>(
          agentsRequest("PUT", `/v1/agents/${encodeURIComponent(plan.agent.existingId)}`, { body }),
        )
      : await must<AgentRow>(agentsRequest("POST", "/v1/agents", { body }));
    agentId = written.id;
    outcome.agent = { id: agentId, action: plan.agent.action };
  } catch (e) {
    outcome.failedAt = "agent";
    throw Object.assign(new Error((e as Error).message), { outcome });
  }

  // 3. label — only when a new version was actually written. A push that
  //    changes nothing writes none, and labelling blindly would rename the
  //    previous push's version.
  const after = await newestVersion(agentId);
  if (after !== null && after !== before) {
    const label = (opts.label ?? defaultLabel(plan.packagePath, opts.now)).slice(0, MAX_LABEL);
    const res = await agentsRequest(
      "PATCH",
      `/v1/agents/${encodeURIComponent(agentId)}/versions/${after}`,
      { body: { label } },
    );
    outcome.version = res.ok ? { number: after, label } : "unchanged";
  } else {
    outcome.version = "unchanged";
  }
  return outcome;
}

/**
 * `declared_secrets` and `dependencies` belong to `code` tools only. The
 * platform rejects them outright on any other type ("Extra inputs are not
 * permitted"), and a compiled package can carry them as empty arrays, so a
 * webhook that was fine in the package failed at create with a 422 that named
 * two fields the operator never wrote. Send what the type accepts.
 */
export function toolWriteBody(body: PackageToolBody): PackageToolBody {
  if (body.tool_type === "code") return body;
  const { declared_secrets: _s, dependencies: _d, ...rest } = body;
  return rest as PackageToolBody;
}

async function syncTool(
  planned: PlannedTool,
  raw: PackageToolBody,
  pkg: LoadedPackage,
  rec: ToolOutcome,
): Promise<{ id: string; version: number }> {
  const body = toolWriteBody(raw);
  let id = planned.existingId ?? "";
  if (planned.action === "update" && id) {
    // tool_type is immutable, so it is never sent on update.
    const { tool_type: _t, ...patch } = body;
    await must(agentsRequest("PATCH", `/v1/agents/tools/${encodeURIComponent(id)}`, { body: patch }));
    rec.updated = true;
  } else {
    const created = await must<{ id: string }>(agentsRequest("POST", "/v1/agents/tools", { body }));
    id = created.id;
    rec.created = true;
  }

  if (body.tool_type === "code") {
    await must(agentsRequest("POST", `/v1/agents/tools/${encodeURIComponent(id)}/introspect`));
    rec.introspected = true;
  }

  if (planned.willRun) {
    const run = await must<RunResult>(
      agentsRequest("POST", `/v1/agents/tools/${encodeURIComponent(id)}/run`, {
        // Required literal. Supplied only because --run-samples was passed:
        // it is the operator's consent to execute their real dependencies.
        body: { sample_input: pkg.samples.get(planned.name) ?? {}, confirm_side_effects: true },
      }),
    );
    rec.ran = run.status;
    if (run.status !== "succeeded") {
      throw new Error(
        `sample run ${run.status}${run.error ? `: ${run.error}` : ""} — ` +
          "a tool that does not work must not reach a live agent.",
      );
    }
  }

  // publish returns 409 WITH a PublishResult body when gates fail — a result
  // shape, not an error envelope, so it is read rather than formatted.
  const res = await agentsRequest<PublishResult>(
    "POST",
    `/v1/agents/tools/${encodeURIComponent(id)}/publish`,
  );
  const result = res.data as PublishResult | undefined;
  if (!res.ok && res.status !== 409) throw new Error(formatAgentsError(res));
  if (!result?.published || result.version_number === null) {
    rec.published = false;
    throw new Error(`publish rejected — ${describeGates(result?.checks)}`);
  }
  rec.published = result.version_number;
  return { id, version: result.version_number };
}

/** Name the gates that failed, so a 409 says what to fix. */
export function describeGates(checks: unknown, prefix = ""): string {
  if (!checks || typeof checks !== "object") return "no gate detail returned";
  const failed: string[] = [];
  for (const [key, value] of Object.entries(checks as Record<string, unknown>)) {
    if (!value || typeof value !== "object") continue;
    const check = value as GateCheck;
    if (typeof check.passed === "boolean") {
      if (!check.passed) failed.push(`${prefix}${key}${check.detail ? `: ${check.detail}` : ""}`);
    } else {
      const nested = describeGates(value, `${prefix}${key}.`);
      if (nested && !nested.startsWith("no gate")) failed.push(nested);
    }
  }
  return failed.length ? failed.join("; ") : "no gate detail returned";
}

/** Newest version number, or null when the agent has none. */
async function newestVersion(agentId: string): Promise<number | null> {
  const res = await agentsRequest<{ items?: { version_number: number }[] }>(
    "GET",
    `/v1/agents/${encodeURIComponent(agentId)}/versions`,
    { query: { page: 1, page_size: 1 } },
  );
  if (!res.ok) return null;
  return res.data?.items?.[0]?.version_number ?? null;
}

/** The agent create/replace body: the package, with every name resolved. */
export function buildAgentBody(pkg: LoadedPackage, plan: PushPlan): Record<string, unknown> {
  const { tool_refs: _refs, mcp_refs: _mcp, ...rest } = pkg.agent;
  return {
    ...rest,
    mcp_refs: [],
    tool_refs: plan.refs.map((r) => ({
      ...r.carried,
      attachment_id: r.attachmentId,
      tool_id: r.toolId,
      version: r.version,
    })),
  };
}

// --- rendering ------------------------------------------------------------

/**
 * Pad a name into its column, but never below one separating space: a tool
 * name at or over the column width used to run straight into the text after it
 * ("push_test_webhookcreate, api_request").
 */
function col(name: string, width = 16): string {
  return name.length >= width ? `${name} ` : name.padEnd(width);
}

const KIND_TITLE: Record<BlockerKind, string> = {
  vault_missing: "missing vault entries",
  tool_unresolved: "unresolved tool reference",
  tool_type_immutable: "tool type cannot change",
  sample_missing: "tool needs a verified run before it can publish",
  singleton_exists: "this organisation already has a tool of this type",
  samples_not_enabled: "tool sample not enabled",
  mcp_unsupported: "MCP references are not supported",
  agent_ambiguous: "more than one agent has this name",
};

/**
 * The `--json` document, per contracts/cli-commands.md.
 *
 * Deliberately NOT `{...plan}`. PushPlan is an internal TypeScript shape whose
 * fields are camelCase; the published document is snake_case, and spreading the
 * plan leaked `toolId` / `attachmentId` / `packagePath` / `existingId` into a
 * surface that scripts pin. Mapping here keeps the two free to diverge.
 */
export function planJson(plan: PushPlan): Record<string, unknown> {
  return {
    organisation: plan.organisation,
    package: plan.packagePath,
    agent: {
      name: plan.agent.name,
      action: plan.agent.action,
      ...(plan.agent.existingId ? { id: plan.agent.existingId } : {}),
    },
    tools: plan.tools,
    refs: plan.refs.map((r) => ({
      name: r.name,
      tool_id: r.toolId || null,
      version: r.version,
      attachment_id: r.attachmentId,
      reused: r.reused,
      ...r.carried,
    })),
    removals: plan.removals,
    overwrites: plan.overwrites,
    blockers: plan.blockers,
  };
}

export function renderBlockers(blockers: Blocker[]): string {
  const out: string[] = [
    `cannot push. ${blockers.length} problem${blockers.length === 1 ? "" : "s"}:`,
    "",
  ];
  for (const b of blockers) {
    out.push(`${KIND_TITLE[b.kind]} (${b.items.length})`);
    for (const item of b.items) out.push(`  ${item}`);
    if (b.detail) out.push(`  ${b.detail}`);
    if (b.url) out.push(`  ${b.url}`);
    out.push("");
  }
  out.push("nothing was created or changed.");
  return out.join("\n");
}

function orgCell(plan: PushPlan): string {
  if (plan.organisation.name) return `${plan.organisation.name} (${plan.organisation.id})`;
  return plan.organisation.id || "unknown";
}

export function renderPlan(plan: PushPlan): string {
  const out: string[] = [
    `organisation  ${orgCell(plan)}`,
    `package       ${plan.packagePath}`,
    `agent         ${plan.agent.name} — ${plan.agent.action}` +
      (plan.agent.existingId ? ` (${plan.agent.existingId})` : ""),
    "",
    "TOOLS",
  ];
  if (!plan.tools.length) out.push("  (none shipped)");
  for (const t of plan.tools) {
    const run = t.willRun ? "will run sample" : t.needsGreenRun ? "needs a run" : "no run needed";
    out.push(`  ${col(t.name)}${t.action}, ${t.toolType}, ${run}`);
  }
  out.push("", "REFERENCES");
  if (!plan.refs.length) out.push("  (none)");
  for (const r of plan.refs) {
    const version = r.version === null ? "v(after publish)" : `v${r.version}`;
    out.push(
      `  ${col(r.name)}tool ${r.toolId || "(created by this push)"} ${version}   ` +
        `attachment ${r.attachmentId.slice(0, 8)}  ${r.reused ? "reused" : "new"}`,
    );
  }
  if (plan.removals.length) {
    out.push("", "WILL BE DETACHED");
    for (const r of plan.removals) {
      out.push(
        `  ${col(r.name ?? r.tool_id)}attachment ${r.attachment_id.slice(0, 8)} — not declared by this package`,
      );
    }
  }
  if (plan.overwrites.length) {
    out.push("", "WILL BE OVERWRITTEN");
    for (const f of plan.overwrites) {
      out.push(`  ${col(f, 22)}differs from what this agent currently has`);
    }
  }
  out.push(
    "",
    `would ${plan.agent.action === "create" ? "create" : "replace"} agent ` +
      `"${plan.agent.name}". no changes made.`,
  );
  return out.join("\n");
}

/**
 * What is about to happen, on stderr, before the first write.
 *
 * FR-011 and FR-032 both say "before". The spinner used to carry the
 * create/update decision, but `spin()` returns null when stderr is not a TTY,
 * so a pipeline run announced nothing at all — and the organisation was named
 * only by renderOutcome, once the agent had already been written. This
 * repository's `.env` and default profile resolve to DIFFERENT organisations,
 * so "which org am I writing to" has to be answerable while it can still
 * change the operator's mind.
 */
export function renderHeader(plan: PushPlan): string {
  const verb = plan.agent.action === "create" ? "creating" : "replacing";
  return [
    `organisation  ${orgCell(plan)}`,
    `agent         ${plan.agent.name} — ${verb}${plan.agent.existingId ? ` (${plan.agent.existingId})` : ""}`,
  ].join("\n");
}

/**
 * The success report. It does NOT repeat the organisation line: renderHeader
 * printed it moments earlier, before the first write, and a report that says
 * the same thing twice three lines apart teaches operators to skim it. The
 * `--json` document still carries `organisation` — stdout is the durable
 * record there, whereas the header is stderr.
 */
export function renderOutcome(plan: PushPlan, outcome: ApplyOutcome): string {
  const out: string[] = [];
  for (const t of outcome.tools.filter((t) => t.name)) {
    const bits = [
      t.created && "created",
      t.updated && "updated",
      t.introspected && "introspected",
      // Stated, never left blank: a gap here reads as "fine", and FR-019 is
      // explicit that a tool nothing executed must not look verified.
      t.ran ? `ran (${t.ran})` : "not exercised",
      t.published ? `published v${t.published}` : t.published === false && "publish FAILED",
    ].filter(Boolean);
    out.push(`tool          ${t.name} — ${bits.join(", ")}`);
  }
  if (outcome.agent) {
    out.push(`agent         ${plan.agent.name} — ${outcome.agent.action}d ${outcome.agent.id}`);
  }
  if (outcome.version && outcome.version !== "unchanged") {
    out.push(`version       ${outcome.version.number}  labelled "${outcome.version.label}"`);
  } else if (outcome.version === "unchanged") {
    out.push("version       unchanged — nothing in this push changed the agent");
  }
  out.push("", "pushed.");
  return out.join("\n");
}

/**
 * The partial-failure report (FR-021). Its whole job is to tell the operator
 * what now exists in their organisation that did not exist before, so the
 * accounting has to be exact:
 *
 *  - a tool that was created and THEN failed is still left behind. Filing it
 *    only under NOT DONE printed "DONE (nothing)" directly above "the tools
 *    above still exist", which is a contradiction the operator has to resolve
 *    by going and looking.
 *  - the closing line distinguishes a published version (permanent) from a
 *    created-but-unpublished tool (deletable), because the remedies differ.
 *  - the platform's error is printed once. Multi-line errors — a code tool's
 *    sample failure is a Python traceback — are indented so the list survives.
 */
export function renderPartial(outcome: ApplyOutcome, error: string): string {
  const touched = outcome.tools.filter((t) => t.name);
  const failed = touched.filter((t) => t.error);
  const clean = touched.filter((t) => !t.error);
  const out: string[] = [`push failed at ${outcome.failedAt ?? "an unknown step"}.`, "", "DONE"];

  const describe = (t: ToolOutcome) =>
    [
      t.created && "created",
      t.updated && "updated",
      t.introspected && "introspected",
      t.ran && `ran (${t.ran})`,
      t.published ? `published v${t.published}` : t.published === false && "publish FAILED",
    ]
      .filter(Boolean)
      .join(", ");

  // Anything that reached the organisation belongs here, failed or not.
  const landed = touched.filter((t) => t.created || t.updated);
  if (!landed.length) out.push("  (nothing)");
  for (const t of landed) out.push(`  ${col(t.name)}${describe(t) || "created"}`);

  out.push("", "NOT DONE");
  for (const t of failed) out.push(`  ${col(t.name)}${indent(t.error ?? "failed")}`);
  for (const t of clean.filter((t) => !t.created && !t.updated)) {
    out.push(`  ${col(t.name)}not reached`);
  }
  if (!outcome.agent) out.push("  the agent was not created or updated");

  const published = landed.filter((t) => typeof t.published === "number");
  // Only restate the error if it is not already sitting in the list above —
  // otherwise a four-line traceback gets printed twice, back to back.
  if (!failed.some((t) => t.error === error)) out.push("", indent(error));
  out.push("");
  if (published.length) {
    out.push("published tool versions cannot be unpublished. the tools above still exist.");
  } else if (landed.length) {
    out.push("the tools above were created but not published; you can delete them.");
  } else {
    out.push("nothing was left behind.");
  }
  return out.join("\n");
}

/** Keep a multi-line platform error inside its list item. */
function indent(text: string): string {
  return text.split("\n").join("\n    ");
}

// --- command --------------------------------------------------------------

export function pushCommand(): Command {
  return new Command("push")
    .argument("<dir>", "Package directory, or its build/slng directory")
    .description("Push an unmute-compiled agent package")
    .option("--dry-run", "Check everything and report, changing nothing")
    .option("--run-samples", "Execute each tool's sample against your real dependencies")
    .option("--agent-id <id>", "Update this agent, when a name matches more than one")
    .option("--label <text>", "Version label (default: package name and timestamp)")
    .option("--json", "Output JSON")
    .addHelpText(
      "afterAll",
      `
EXAMPLES
  $ voiceai agents push examples/slng-support              push a package
  $ voiceai agents push build/slng --dry-run               check without changing anything
  $ voiceai agents push . --run-samples                    also execute each tool's sample
  $ voiceai agents push . --json | jq -r '.agent.id'       scriptable

NOTES
  The directory may be the package root or the compiled build/slng directory.

  Nothing is created until every check passes. Missing vault entries and unresolved
  tool names are reported together, with the dashboard page that fixes each.

  Updating REPLACES the agent with what the package declares: a reference the package
  no longer names is detached. Use --dry-run to see what would be removed first.

  --run-samples executes each tool's sample against your real dependencies. A code or
  api_request tool cannot be published without one successful run.
`,
    )
    .action(async (dir: string, opts) => {
      const spinner = spin("checking package");
      let plan: PushPlan;
      let pkg: LoadedPackage;
      try {
        ({ plan, pkg } = await planPush(dir, {
          runSamples: Boolean(opts.runSamples),
          agentId: opts.agentId,
        }));
      } catch (e) {
        spinner?.stop();
        if (e instanceof PackageError) fail(opts.json, e.message, { changed: false });
        fail(opts.json, (e as Error).message, { changed: false });
      }
      spinner?.stop();

      if (plan.blockers.length) {
        if (opts.json) {
          console.log(
            JSON.stringify(
              { ok: false, changed: false, organisation: plan.organisation, blockers: plan.blockers },
              null,
              2,
            ),
          );
        } else {
          process.stderr.write(`${renderBlockers(plan.blockers)}\n`);
        }
        process.exit(1);
      }

      if (opts.dryRun) {
        if (opts.json) console.log(JSON.stringify({ ok: true, dry_run: true, ...planJson(plan) }, null, 2));
        else console.log(renderPlan(plan));
        return;
      }

      // Announced on stderr, unconditionally — not via the spinner, which is
      // absent when stderr is not a TTY (FR-011, FR-032).
      note(renderHeader(plan));
      const applying = spin(`${plan.agent.action === "create" ? "creating" : "replacing"} ${plan.agent.name}`);
      let outcome: ApplyOutcome;
      try {
        outcome = await applyPush(plan, pkg, { label: opts.label, now: new Date().toISOString() });
      } catch (e) {
        applying?.stop();
        const partial = (e as { outcome?: ApplyOutcome }).outcome;
        const message = (e as Error).message;
        if (opts.json) {
          console.log(JSON.stringify({ ok: false, changed: true, error: message, ...partial }, null, 2));
        } else {
          process.stderr.write(`${renderPartial(partial ?? { tools: [] }, message)}\n`);
        }
        process.exit(1);
      }
      applying?.stop();

      if (outcome.failedAt) {
        const message = outcome.tools.find((t) => t.error)?.error ?? "push failed";
        if (opts.json) {
          console.log(JSON.stringify({ ok: false, changed: true, error: message, ...outcome }, null, 2));
        } else {
          process.stderr.write(`${renderPartial(outcome, message)}\n`);
        }
        process.exit(1);
      }

      if (opts.json) {
        console.log(JSON.stringify({ ok: true, organisation: plan.organisation, ...outcome }, null, 2));
      }
      else console.log(renderOutcome(plan, outcome));
    });
}
