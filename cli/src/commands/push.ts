import { Command } from "commander";
import { randomUUID } from "node:crypto";
import { basename, dirname } from "node:path";
import ora from "ora";
import { agentsRequest, formatAgentsError, type AgentsResult } from "../lib/agents";
import { requireApiKey } from "../lib/config";
import { printJson } from "../lib/output";
import {
  isManagedSingleton,
  loadPackage,
  mcpRefServer,
  needsGreenRun,
  PackageError,
  requiredSecretNames,
  type LoadedPackage,
  type PackageMcpRef,
  type PackageToolBody,
  type PackageToolRef,
} from "../lib/package";
import { verifyApiKey } from "../lib/verify";
import {
  connectServer,
  getServerById,
  isSnapshotStale,
  loadServers,
  snapshotRefusal,
  type McpCapabilities,
  type McpServerDetail,
} from "./mcp";
import { listSecrets, redact, type VaultEntry } from "./secret";
import { fetchToolDetail, fetchToolVersion, listAllTools, type RunResult, type ToolDetail, type ToolListItem, type ToolVersion } from "./tool";

// --- dashboard ------------------------------------------------------------
// Every blocker points at the page that fixes it. Nothing here is created by
// the CLI: the operator is sent to the dashboard, deliberately.

const VAULT_URL = "https://app.slng.ai/vault/secrets";
const TOOLS_URL = "https://app.slng.ai/tools";
const MCP_URL = "https://app.slng.ai/tools/mcp";

// --- types ----------------------------------------------------------------

export type BlockerKind =
  | "vault_missing"
  | "tool_unresolved"
  | "tool_type_immutable"
  | "sample_missing"
  | "samples_not_enabled"
  | "singleton_exists"
  | "mcp_unresolved"
  | "mcp_stale"
  | "agent_ambiguous"
  // --require-resolved only, below this line.
  | "organisation_mismatch"
  | "authored_tool_body"
  | "tool_version_unavailable"
  | "mcp_hash_changed";

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

export interface PlannedMcpRef {
  /** Server name, for display and for every message that names the reference. */
  server: string;
  serverId: string;
  toolName: string;
  /** Copied from the platform's own snapshot; refreshed in place by the retry. */
  schemaHash: string;
  attachmentId: string;
  reused: boolean;
  /** Everything unmute wrote alongside the names, preserved verbatim. */
  carried: Record<string, unknown>;
}

export interface PushPlan {
  organisation: { id: string; name?: string };
  packagePath: string;
  agent: { name: string; action: "create" | "update"; existingId?: string };
  tools: PlannedTool[];
  refs: PlannedRef[];
  mcpRefs: PlannedMcpRef[];
  removals: { attachment_id: string; tool_id: string; name?: string }[];
  /**
   * MCP attachments this push would detach. Separate from `removals`, which is
   * typed around `tool_id`: widening that would change a `--json` shape scripts
   * already pin.
   */
  mcpRemovals: { attachment_id: string; server_id: string; tool_name: string }[];
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
  mcp_refs?: { attachment_id: string; server_id: string; tool_name: string }[];
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

// --- small helpers --------------------------------------------------------

function fail(json: boolean | undefined, message: string, extra?: Record<string, unknown>): never {
  if (json) printJson({ ok: false, ...extra, error: message });
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

// --- agent identity (shared by ordinary and --require-resolved planning) --

interface AgentIdentity {
  action: "create" | "update";
  existingId?: string;
  /** Set only for "more than one agent has this name and no --agent-id". */
  blocker?: Blocker;
}

/**
 * Which agent a push writes to, and whether that is even decidable. Shared by
 * `buildPlan` and the `--require-resolved` builder — FR/contract requirement
 * "reuse existing agent selection" means this logic lives in exactly one place.
 */
function resolveAgentIdentity(
  name: string,
  agents: AgentRow[],
  agentIdOverride: string | undefined,
): AgentIdentity {
  const matches = agents.filter((a) => a.name === name);
  let existingId = agentIdOverride;
  let blocker: Blocker | undefined;
  if (!existingId) {
    if (matches.length > 1) {
      blocker = {
        kind: "agent_ambiguous",
        items: matches.map((a) => `${a.name}  ${a.id}`),
        detail:
          `${matches.length} agents are named "${name}". ` +
          "name the one to update with --agent-id <id>.",
      };
    } else {
      existingId = matches[0]?.id;
    }
  }
  return { action: existingId ? "update" : "create", existingId, blocker };
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
  /** Detail records for every MCP server the package references. */
  mcpServers?: McpServerDetail[];
  /** The live agent, when updating — source of attachment reuse and removals. */
  liveAgent?: AgentRow;
  runSamples: boolean;
  organisation: { id: string; name?: string };
  agentIdOverride?: string;
  mintId?: () => string;
  /** Injected so the staleness test is deterministic under test. */
  now?: Date;
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
  const now = input.now ?? new Date();

  // --- agent identity ---
  const named = input.pkg.agent.name;
  const identity = resolveAgentIdentity(named, input.agents, input.agentIdOverride);
  if (identity.blocker) blockers.push(identity.blocker);
  const existingId = identity.existingId;
  const action = identity.action;

  // --- mcp ---
  // No MCP session is opened, here or anywhere: `observed_schema_hash` is the
  // platform's own cached `schema_hash` for that tool, which the server detail
  // already carries. Spec 003 D8 assumed it had to be computed; it has to be
  // copied.
  const mcpRefs: PlannedMcpRef[] = [];
  const mcpUnresolved: string[] = [];
  const mcpStale: string[] = [];
  const mcpReuse = new Map(
    (liveAgent?.mcp_refs ?? []).map((r) => [`${r.server_id} ${r.tool_name}`, r.attachment_id]),
  );
  const staleReported = new Set<string>();

  for (const ref of pkg.agent.mcp_refs ?? []) {
    const { server: _s, server_name: _sn, tool_name: toolName, ...carried } = ref;
    const named = mcpRefServer(ref);
    if (!named) {
      mcpUnresolved.push(
        `a reference names no server — expected "server", found {${Object.keys(ref).join(", ")}}`,
      );
      continue;
    }
    const matches = (input.mcpServers ?? []).filter((s) => s.name === named);
    if (!matches.length) {
      mcpUnresolved.push(`${named} — no MCP server of that name is visible to this organisation`);
      continue;
    }
    if (matches.length > 1) {
      mcpUnresolved.push(`${named} — ${matches.length} MCP servers share this name`);
      continue;
    }
    const server = matches[0]!;
    const caps = (server.capabilities ?? {}) as McpCapabilities;
    const tool = (caps.tools ?? []).find((t) => t.name === toolName);
    if (!tool?.schema_hash) {
      // A short list because the probe gave up is not the same as a short
      // server. Saying "this server has no such tool" would be a lie.
      const known = (caps.tools ?? []).map((t) => t.name);
      mcpUnresolved.push(
        caps.truncated
          ? `${named}/${toolName} — not in the last capability snapshot, which was truncated; ` +
            "the server may still expose it"
          : `${named}/${toolName} — the server exposes ${known.length ? known.join(", ") : "no tools"}`,
      );
      continue;
    }
    if (isSnapshotStale(server, now) && !staleReported.has(named)) {
      staleReported.add(named);
      mcpStale.push(
        `${named} — ${server.capability_status ?? "never probed"}, last observed ` +
          `${server.capability_observed_at ?? "never"}`,
      );
    }
    const key = `${server.id} ${toolName}`;
    const existing = mcpReuse.get(key);
    mcpRefs.push({
      server: named,
      serverId: server.id,
      toolName,
      schemaHash: tool.schema_hash,
      attachmentId: existing ?? mint(),
      reused: Boolean(existing),
      carried,
    });
  }

  if (mcpUnresolved.length) {
    blockers.push({
      kind: "mcp_unresolved",
      items: mcpUnresolved,
      detail: "rename the reference, or create the MCP server.",
      url: MCP_URL,
    });
  }
  if (mcpStale.length) {
    blockers.push({
      kind: "mcp_stale",
      items: mcpStale,
      detail:
        "the platform's record of what this server exposes is out of date, and it will refuse " +
        "the attachment. refresh it with `voiceai mcp run <server>`, then push again.",
    });
  }

  // MCP attachments this push would detach. Named, for the same reason tool
  // detachments are: a replace is lossy and this is the only warning.
  const keptMcp = new Set(mcpRefs.map((r) => r.attachmentId));
  const mcpRemovals = (liveAgent?.mcp_refs ?? []).filter((r) => !keptMcp.has(r.attachment_id));

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
    // Names are unique in the catalogue, so a shipped body updates the row of
    // the same name and creates one only when there is none.
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
      const held = (input.orgTools ?? []).find((r) => r.tool_type === body.tool_type);
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
    const chosen = catalogue.find((r) => r.name === name);
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
    mcpRefs,
    removals,
    mcpRemovals,
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

  // Only when the package actually references one. The overwhelmingly common
  // package has no mcp_refs and must cost exactly what it costs today.
  const mcpNames = new Set<string>();
  for (const r of pkg.agent.mcp_refs ?? []) {
    const name = mcpRefServer(r);
    if (name) mcpNames.add(name);
  }
  const mcpServers = mcpNames.size ? await loadServers([...mcpNames]) : [];

  const organisation = await resolveOrganisation(agents, secrets, liveAgent);

  const plan = buildPlan({
    pkg,
    agents,
    secrets,
    catalogue,
    orgTools,
    mcpServers,
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

interface OrgConfirmation {
  ok: boolean;
  /** The confirmed id, when one could be read — even on a mismatch. */
  id: string;
  name?: string;
  /** Why confirmation failed. Present iff !ok. */
  reason?: string;
}

/**
 * `--require-resolved`'s gate, called before anything else: confirm
 * `--expect-org` against the credential's REAL account, not a matching
 * profile name (data-model.md, "Deployment context"). Unlike
 * `resolveOrganisation`, this never falls back to an id inferred from agents,
 * secrets, or a live agent — an org that cannot be confirmed this way is a
 * refusal in this mode, never a pass.
 */
async function confirmOrganisation(expectOrg: string): Promise<OrgConfirmation> {
  let apiKey: string;
  try {
    apiKey = requireApiKey();
  } catch (e) {
    return { ok: false, id: "", reason: (e as Error).message };
  }
  const probe = await verifyApiKey(apiKey);
  if (!probe.ok || !probe.account?.org_id) {
    return {
      ok: false,
      id: "",
      reason: probe.error
        ? `could not confirm an organisation for this credential: ${probe.error}`
        : `could not confirm an organisation for this credential (status ${probe.status ?? "unknown"}).`,
    };
  }
  const id = probe.account.org_id;
  if (id !== expectOrg) {
    return {
      ok: false,
      id,
      name: probe.account.org_name,
      reason: `--expect-org ${expectOrg} does not match the confirmed organisation ${id}.`,
    };
  }
  return { ok: true, id, name: probe.account.org_name };
}

// --- guarded resolved plan (--require-resolved) ----------------------------
//
// Ordinary buildPlan resolves references by NAME against an already-fetched
// catalogue — pure and synchronous. This mode resolves by CHECKED IDENTITY
// instead: each reference already carries the exact tool_id/version or
// server_id/observed_schema_hash Unmute staged, and every one of them is
// verified against the platform directly (never by name, never the first
// same-name record). That verification is inherently a network call per
// reference, so — unlike buildPlan — this is async. The fetchers are
// injected so the resolution logic itself stays unit-testable without a stub
// server; planResolvedPush below wires in the real ones.

export interface ResolvedPlanInputs {
  pkg: LoadedPackage;
  agents: AgentRow[];
  secrets: VaultEntry[];
  liveAgent?: AgentRow;
  organisation: { id: string; name?: string };
  agentIdOverride?: string;
  mintId?: () => string;
  getTool: (id: string) => Promise<AgentsResult<ToolDetail>>;
  getToolVersion: (id: string, version: number) => Promise<AgentsResult<ToolVersion>>;
  getMcpServer: (id: string) => Promise<AgentsResult<McpServerDetail>>;
  now?: Date;
}

/** A staged tool_refs/mcp_refs entry, carrying the explicit fields this mode requires. */
type StagedToolRef = PackageToolRef & { tool_id?: unknown; version?: unknown };
type StagedMcpRef = PackageMcpRef & { server_id?: unknown; observed_schema_hash?: unknown };

export async function buildResolvedPlan(input: ResolvedPlanInputs): Promise<PushPlan> {
  const { pkg, secrets, liveAgent } = input;
  const blockers: Blocker[] = [];
  const mint = input.mintId ?? randomUUID;
  const now = input.now ?? new Date();
  const orgId = input.organisation.id;

  const identity = resolveAgentIdentity(pkg.agent.name, input.agents, input.agentIdOverride);
  if (identity.blocker) blockers.push(identity.blocker);

  // Authored tool bodies are refused outright: this mode attaches only checked
  // published versions, never a body this push would create or update itself.
  if (pkg.tools.length) {
    blockers.push({
      kind: "authored_tool_body",
      items: pkg.tools.map((t) => `${t.name} (${t.tool_type})`),
      detail:
        "--require-resolved attaches checked published versions only. remove the tool body " +
        "from the package and reference it by tool_id and version instead.",
      url: TOOLS_URL,
    });
  }

  // --- vault (same requirement, same source of truth as ordinary mode) ---
  const bySecretName = new Map(secrets.map((s) => [s.name, s]));
  const missingSecrets: string[] = [];
  for (const name of requiredSecretNames(pkg)) {
    const entry = bySecretName.get(name);
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

  // --- tool references: checked id + exact version, never a name lookup ---
  const reuseTool = new Map((liveAgent?.tool_refs ?? []).map((r) => [r.tool_id, r.attachment_id]));
  const refs: PlannedRef[] = [];
  const toolInvalid: string[] = [];
  const toolVersionUnavailable: string[] = [];

  for (const raw of (pkg.agent.tool_refs ?? []) as StagedToolRef[]) {
    const { tool: displayName, tool_id: rawId, version: rawVersion, ...carried } = raw;
    const label = typeof displayName === "string" && displayName ? displayName : "(unnamed reference)";

    if (typeof rawId !== "string" || !rawId) {
      toolInvalid.push(`${label} — no explicit tool_id`);
      continue;
    }
    if (typeof rawVersion !== "number" || !Number.isInteger(rawVersion) || rawVersion <= 0) {
      toolInvalid.push(`${label} (${rawId}) — no explicit positive integer version`);
      continue;
    }
    const detail = await input.getTool(rawId);
    if (!detail.ok || !detail.data) {
      toolInvalid.push(`${label} (${rawId}) — tool id not found: ${formatAgentsError(detail)}`);
      continue;
    }
    const scoped = !detail.data.organisation_id || detail.data.organisation_id === orgId;
    if (!scoped) {
      toolInvalid.push(`${label} (${rawId}) — belongs to a different organisation`);
      continue;
    }
    if (typeof displayName === "string" && displayName && detail.data.name !== displayName) {
      toolInvalid.push(`${label} (${rawId}) — resolves to "${detail.data.name}", not "${displayName}"`);
      continue;
    }
    const version = await input.getToolVersion(rawId, rawVersion);
    if (!version.ok || !version.data) {
      toolVersionUnavailable.push(`${detail.data.name} (${rawId}) v${rawVersion}`);
      continue;
    }
    const existingAttachment = reuseTool.get(rawId);
    refs.push({
      name: detail.data.name,
      toolId: rawId,
      version: rawVersion,
      attachmentId: existingAttachment ?? mint(),
      reused: Boolean(existingAttachment),
      carried,
    });
  }
  if (toolInvalid.length) {
    blockers.push({
      kind: "tool_unresolved",
      items: toolInvalid,
      detail:
        "each reference must carry a checked tool_id whose name and organisation scope match. " +
        "rerun resolution rather than guessing the first same-name record.",
      url: TOOLS_URL,
    });
  }
  if (toolVersionUnavailable.length) {
    blockers.push({
      kind: "tool_version_unavailable",
      items: toolVersionUnavailable,
      detail: "the checked version is no longer available. rerun resolution against the latest published version.",
      url: TOOLS_URL,
    });
  }

  // --- mcp references: checked server id + exact observed hash ---
  const reuseMcp = new Map(
    (liveAgent?.mcp_refs ?? []).map((r) => [`${r.server_id} ${r.tool_name}`, r.attachment_id]),
  );
  const mcpRefs: PlannedMcpRef[] = [];
  const mcpInvalid: string[] = [];
  const mcpStale: string[] = [];
  const mcpHashChanged: string[] = [];

  for (const raw of (pkg.agent.mcp_refs ?? []) as StagedMcpRef[]) {
    const {
      server: _s,
      server_name: _sn,
      tool_name: toolName,
      server_id: rawServerId,
      observed_schema_hash: rawHash,
      ...carried
    } = raw;
    const namedHint = mcpRefServer(raw);
    const label = namedHint ?? "(unnamed reference)";
    const toolLabel = typeof toolName === "string" && toolName ? toolName : "?";

    if (typeof rawServerId !== "string" || !rawServerId) {
      mcpInvalid.push(`${label}/${toolLabel} — no explicit server_id`);
      continue;
    }
    if (typeof rawHash !== "string" || !rawHash) {
      mcpInvalid.push(`${label}/${toolLabel} (${rawServerId}) — no explicit observed_schema_hash`);
      continue;
    }
    const detail = await input.getMcpServer(rawServerId);
    if (!detail.ok || !detail.data) {
      mcpInvalid.push(`${label}/${toolLabel} (${rawServerId}) — server id not found: ${formatAgentsError(detail)}`);
      continue;
    }
    const scoped = !detail.data.organisation_id || detail.data.organisation_id === orgId;
    if (!scoped) {
      mcpInvalid.push(`${label}/${toolLabel} (${rawServerId}) — belongs to a different organisation`);
      continue;
    }
    if (namedHint && detail.data.name !== namedHint) {
      mcpInvalid.push(`${label}/${toolLabel} (${rawServerId}) — resolves to "${detail.data.name}", not "${namedHint}"`);
      continue;
    }
    // Before looking at the hash: the platform keeps the last capability
    // document when a refresh fails, so a retained hash can still match on a
    // record it will refuse to attach against. Same test the write will apply.
    const refusal = snapshotRefusal(detail.data, now);
    if (refusal) {
      mcpStale.push(`${detail.data.name}/${toolLabel} (${rawServerId}) — ${refusal}`);
      continue;
    }
    const caps = (detail.data.capabilities ?? {}) as McpCapabilities;
    const tool = (caps.tools ?? []).find((t) => t.name === toolName);
    if (!tool?.schema_hash) {
      mcpHashChanged.push(`${detail.data.name}/${toolLabel} — no longer exposed by the server`);
      continue;
    }
    if (tool.schema_hash !== rawHash) {
      mcpHashChanged.push(`${detail.data.name}/${toolLabel} — schema hash changed since resolution`);
      continue;
    }
    const key = `${rawServerId} ${toolName}`;
    const existing = reuseMcp.get(key);
    mcpRefs.push({
      server: detail.data.name,
      serverId: rawServerId,
      toolName: String(toolName),
      schemaHash: rawHash,
      attachmentId: existing ?? mint(),
      reused: Boolean(existing),
      carried,
    });
  }
  if (mcpInvalid.length) {
    blockers.push({
      kind: "mcp_unresolved",
      items: mcpInvalid,
      detail:
        "each reference must carry a checked server_id whose name and organisation scope match. " +
        "rerun resolution rather than guessing the first same-name record.",
      url: MCP_URL,
    });
  }
  if (mcpStale.length) {
    blockers.push({
      kind: "mcp_stale",
      items: mcpStale,
      detail:
        "the platform's capability snapshot for this server is unavailable or expired, and it will " +
        "refuse the attachment even though the checked hash still matches. this mode never refreshes " +
        "it: refresh with `voiceai mcp run <server-id> --id`, then rerun resolution.",
      url: MCP_URL,
    });
  }
  if (mcpHashChanged.length) {
    blockers.push({
      kind: "mcp_hash_changed",
      items: mcpHashChanged,
      detail:
        "the checked schema hash is no longer current. rerun resolution — this mode never " +
        "refreshes a stale snapshot and attaches it unchecked.",
      url: MCP_URL,
    });
  }

  // --- removals / overwrites: same comparisons as ordinary mode ---
  const keptAttachments = new Set(refs.map((r) => r.attachmentId));
  const removals = (liveAgent?.tool_refs ?? [])
    .filter((r) => !keptAttachments.has(r.attachment_id))
    .map((r) => ({ attachment_id: r.attachment_id, tool_id: r.tool_id }));
  const keptMcp = new Set(mcpRefs.map((r) => r.attachmentId));
  const mcpRemovals = (liveAgent?.mcp_refs ?? []).filter((r) => !keptMcp.has(r.attachment_id));
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
    agent: { name: pkg.agent.name, action: identity.action, existingId: identity.existingId },
    tools: [], // this mode ships no tool bodies — see authored_tool_body above
    refs,
    mcpRefs,
    removals,
    mcpRemovals,
    overwrites,
    blockers,
  };
}

/**
 * The `--require-resolved` counterpart to `planPush`: confirms the account
 * before anything else, and only then reads what's needed to check every
 * staged reference. Read-only — the same guarantee planPush makes.
 */
export async function planResolvedPush(
  dir: string,
  opts: { agentId?: string; expectOrg: string },
): Promise<{ plan: PushPlan; pkg: LoadedPackage; orgConfirmed: boolean }> {
  const pkg = loadPackage(dir);

  const orgCheck = await confirmOrganisation(opts.expectOrg);
  if (!orgCheck.ok) {
    return {
      pkg,
      orgConfirmed: false,
      plan: {
        organisation: { id: orgCheck.id || opts.expectOrg, name: orgCheck.name },
        packagePath: pkg.location.agentBody,
        agent: { name: pkg.agent.name, action: "create" },
        tools: [],
        refs: [],
        mcpRefs: [],
        removals: [],
        mcpRemovals: [],
        overwrites: [],
        blockers: [
          {
            kind: "organisation_mismatch",
            items: [orgCheck.reason ?? "organisation could not be confirmed."],
            detail: "confirm the credential and --expect-org, then push again. nothing was read or changed.",
          },
        ],
      },
    };
  }

  const agents = await must<AgentRow[]>(agentsRequest("GET", "/v1/agents"));
  const secrets = (await listSecrets()).map(redact) as VaultEntry[];

  // Same two-step identity read planPush uses: a minimal local resolution to
  // decide whether a live agent needs reading, then the full (re-)resolution
  // inside buildResolvedPlan itself.
  const existing = opts.agentId ?? agents.filter((a) => a.name === pkg.agent.name)[0]?.id;
  let liveAgent: AgentRow | undefined;
  if (existing) {
    liveAgent = await must<AgentRow>(agentsRequest("GET", `/v1/agents/${encodeURIComponent(existing)}`));
  }

  const plan = await buildResolvedPlan({
    pkg,
    agents,
    secrets,
    liveAgent,
    organisation: { id: orgCheck.id, name: orgCheck.name },
    agentIdOverride: opts.agentId,
    getTool: fetchToolDetail,
    getToolVersion: fetchToolVersion,
    getMcpServer: getServerById,
  });
  return { plan, pkg, orgConfirmed: true };
}

// --- apply ----------------------------------------------------------------

/** Tools first, then the agent, then the label. The platform's dependencies fix this order. */
export async function applyPush(
  plan: PushPlan,
  pkg: LoadedPackage,
  opts: { label?: string; now: string; allowMcpRefresh?: boolean },
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
  const before = plan.agent.existingId ? await newestVersion(plan.agent.existingId) : null;
  const writeAgent = () => {
    const body = buildAgentBody(pkg, plan);
    return plan.agent.existingId
      ? must<AgentRow>(
          agentsRequest("PUT", `/v1/agents/${encodeURIComponent(plan.agent.existingId)}`, { body }),
        )
      : must<AgentRow>(agentsRequest("POST", "/v1/agents", { body }));
  };
  let agentId: string;
  try {
    let written: AgentRow;
    try {
      written = await writeAgent();
    } catch (e) {
      // The platform flags this one retryable, and it self-heals: a connect
      // refreshes the snapshot the write was rejected against. Once, not a
      // loop — if one refresh does not fix it, the problem is not staleness.
      // --require-resolved disables this: that mode attaches an exact checked
      // hash and refuses a changed one rather than silently refreshing and
      // attaching an unchecked snapshot (Unmute owns that one refresh).
      const allowRefresh = opts.allowMcpRefresh ?? true;
      if (!allowRefresh || !plan.mcpRefs.length || !isCapabilityUnavailable((e as Error).message)) {
        throw e;
      }
      note("mcp capabilities were stale; refreshing and retrying");
      await refreshMcpCapabilities(plan);
      written = await writeAgent();
    }
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
 * Did the platform reject the write because it has no current record of what an
 * MCP server exposes?
 *
 * ponytail: matches the message because `must()` throws `formatAgentsError`'s
 * string, which already appends the machine-readable code — so this reads the
 * code without restructuring the call path. The second alternative is the
 * safety net for a renamed code. Thread the raw AgentsResult through if a
 * second capability error code ever appears.
 */
export function isCapabilityUnavailable(message: string): boolean {
  return /MCP_CAPABILITY_UNAVAILABLE/i.test(message) || /capabilit\w*\s+unavailable/i.test(message);
}

/**
 * Connect to every server the plan references and take the schema hash the
 * server answers with now. Connecting is what makes the platform's snapshot
 * current again; re-reading the hash is what makes the retry describe reality.
 */
async function refreshMcpCapabilities(plan: PushPlan): Promise<void> {
  for (const serverId of new Set(plan.mcpRefs.map((r) => r.serverId))) {
    const res = await connectServer(serverId);
    if (!res.ok || !res.data) continue; // the retry will fail with the platform's own reason
    const tools = (res.data.capabilities?.tools ?? []) as { name: string; schema_hash?: string | null }[];
    for (const ref of plan.mcpRefs) {
      if (ref.serverId !== serverId) continue;
      const hash = tools.find((t) => t.name === ref.toolName)?.schema_hash;
      if (hash) ref.schemaHash = hash;
    }
  }
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
    // This used to be a hardcoded `[]`, harmless only because the blocker made
    // the path unreachable. The write is a PUT — replace, not merge — so with
    // the blocker gone that literal would have silently deleted every MCP
    // attachment made in the dashboard, on the first update push.
    mcp_refs: plan.mcpRefs.map((r) => ({
      ...r.carried,
      attachment_id: r.attachmentId,
      server_id: r.serverId,
      tool_name: r.toolName,
      observed_schema_hash: r.schemaHash,
    })),
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
  mcp_unresolved: "unresolved MCP reference",
  mcp_stale: "MCP capability snapshot is stale",
  agent_ambiguous: "more than one agent has this name",
  organisation_mismatch: "--expect-org does not match the confirmed organisation",
  authored_tool_body: "authored tool bodies are not allowed under --require-resolved",
  tool_version_unavailable: "checked tool version is no longer available",
  mcp_hash_changed: "checked MCP schema hash is no longer current",
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
    mcp_refs: plan.mcpRefs.map((r) => ({
      ...r.carried,
      server: r.server,
      server_id: r.serverId,
      tool_name: r.toolName,
      observed_schema_hash: r.schemaHash,
      attachment_id: r.attachmentId,
      reused: r.reused,
    })),
    removals: plan.removals,
    mcp_removals: plan.mcpRemovals,
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
  if (plan.mcpRefs.length) {
    out.push("", "MCP REFERENCES");
    for (const r of plan.mcpRefs) {
      out.push(
        `  ${col(`${r.server}/${r.toolName}`, 34)}attachment ${r.attachmentId.slice(0, 8)}  ` +
          `${r.reused ? "reused" : "new"}`,
      );
    }
  }
  if (plan.removals.length || plan.mcpRemovals.length) {
    out.push("", "WILL BE DETACHED");
    for (const r of plan.removals) {
      out.push(
        `  ${col(r.name ?? r.tool_id)}attachment ${r.attachment_id.slice(0, 8)} — not declared by this package`,
      );
    }
    for (const r of plan.mcpRemovals) {
      out.push(
        `  ${col(`${r.server_id.slice(0, 8)}/${r.tool_name}`, 34)}attachment ` +
          `${r.attachment_id.slice(0, 8)} — not declared by this package`,
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

// --- --require-resolved command -------------------------------------------

interface ResolvedOpts {
  dryRun?: boolean;
  agentId?: string;
  label?: string;
  json?: boolean;
  expectOrg?: string;
}

/**
 * The resolved (checked-id) refs/mcpRefs from a plan, in the same snake_case
 * shape planJson uses — reused so a dry-run, a blocked report, a success and a
 * partial-failure document all name resolved tool ids/versions and MCP
 * ids/hashes the same way (contract requirement 7).
 */
function resolvedRefsJson(plan: PushPlan): { refs: unknown; mcp_refs: unknown } {
  const doc = planJson(plan);
  return { refs: doc.refs, mcp_refs: doc.mcp_refs };
}

async function runResolvedPush(dir: string, opts: ResolvedOpts): Promise<void> {
  if (!opts.expectOrg) {
    fail(opts.json, "--require-resolved needs --expect-org <organisation-id>.", { resolution_contract: 1 });
  }

  const spinner = spin("checking package");
  let plan: PushPlan;
  let pkg: LoadedPackage;
  try {
    ({ plan, pkg } = await planResolvedPush(dir, { agentId: opts.agentId, expectOrg: opts.expectOrg }));
  } catch (e) {
    spinner?.stop();
    const message = e instanceof PackageError ? e.message : (e as Error).message;
    fail(opts.json, message, { changed: false, resolution_contract: 1 });
  }
  spinner?.stop();

  const blocked = plan.blockers.length > 0;

  if (opts.dryRun) {
    // No live write and no discovery in this branch, whatever else was asked
    // for (--run-samples is meaningless here: this mode ships no tool bodies).
    // Still names the selected agent id/action, even when blocked.
    const doc = { ok: !blocked, dry_run: true, changed: false, resolution_contract: 1, ...planJson(plan) };
    if (opts.json) {
      printJson(doc);
    } else {
      console.log(renderPlan(plan));
      if (blocked) process.stderr.write(`${renderBlockers(plan.blockers)}\n`);
    }
    if (blocked) process.exit(1);
    return;
  }

  if (blocked) {
    const doc = { ok: false, changed: false, resolution_contract: 1, ...planJson(plan) };
    if (opts.json) printJson(doc);
    else process.stderr.write(`${renderBlockers(plan.blockers)}\n`);
    process.exit(1);
  }

  note(renderHeader(plan));
  const applying = spin(`${plan.agent.action === "create" ? "creating" : "replacing"} ${plan.agent.name}`);
  let outcome: ApplyOutcome;
  try {
    outcome = await applyPush(plan, pkg, {
      label: opts.label,
      now: new Date().toISOString(),
      allowMcpRefresh: false,
    });
  } catch (e) {
    applying?.stop();
    const partial = (e as { outcome?: ApplyOutcome }).outcome ?? { tools: [] };
    const message = (e as Error).message;
    if (opts.json) {
      printJson({
        ok: false,
        changed: true,
        resolution_contract: 1,
        error: message,
        organisation: plan.organisation,
        ...resolvedRefsJson(plan),
        ...partial,
      });
    } else {
      process.stderr.write(`${renderPartial(partial, message)}\n`);
    }
    process.exit(1);
  }
  applying?.stop();

  if (outcome.failedAt) {
    const message = outcome.tools.find((t) => t.error)?.error ?? "push failed";
    if (opts.json) {
      printJson({
        ok: false,
        changed: true,
        resolution_contract: 1,
        error: message,
        organisation: plan.organisation,
        ...resolvedRefsJson(plan),
        ...outcome,
      });
    } else {
      process.stderr.write(`${renderPartial(outcome, message)}\n`);
    }
    process.exit(1);
  }

  // A returned success agrees with the supplied resolution by construction:
  // refs/mcp_refs below are the SAME checked ids/versions/hashes buildResolvedPlan
  // verified and buildAgentBody sent — nothing here re-derives them.
  if (opts.json) {
    printJson({
      ok: true,
      resolution_contract: 1,
      organisation: plan.organisation,
      ...resolvedRefsJson(plan),
      ...outcome,
    });
  } else {
    console.log(renderOutcome(plan, outcome));
  }
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
    .option(
      "--require-resolved",
      "Guarded mode: attach only the exact tool_id/version and MCP server_id/hash the staged package carries",
    )
    .option("--expect-org <id>", "Confirm this organisation before any write (required with --require-resolved)")
    .option("--json", "Output JSON")
    .addHelpText(
      "afterAll",
      `
EXAMPLES
  $ voiceai agents push examples/slng-support              push a package
  $ voiceai agents push build/slng --dry-run               check without changing anything
  $ voiceai agents push . --run-samples                    also execute each tool's sample
  $ voiceai agents push . --json | jq -r '.agent.id'       scriptable
  $ voiceai agents push staged/ --require-resolved --expect-org org_abc --dry-run --json
  $ voiceai agents push staged/ --require-resolved --expect-org org_abc --json

NOTES
  The directory may be the package root or the compiled build/slng directory.

  Nothing is created until every check passes. Missing vault entries and unresolved
  tool names are reported together, with the dashboard page that fixes each.

  Updating REPLACES the agent with what the package declares: a tool or MCP reference
  the package no longer names is detached. Use --dry-run to see what would be removed.

  --run-samples executes each tool's sample against your real dependencies. A code or
  api_request tool cannot be published without one successful run.

  MCP references resolve by server name; each tool's observed_schema_hash is copied
  from the platform's own capability snapshot, so nothing connects to the server. If
  that snapshot has gone stale, refresh it with \`voiceai mcp run <server>\`.

  --require-resolved is a different mode, for a caller (such as unmute) that has
  already resolved every reference to an exact tool_id/version or MCP server_id/hash
  and wants those honoured EXACTLY — never re-resolved by name, never the first
  same-name record, never refreshed. It refuses authored tool bodies, confirms
  --expect-org against the real credential before any write, discovery or tool
  operation, and never runs a sample. The JSON document carries the explicit marker
  \`resolution_contract: 1\` so a caller can tell a supporting release apart from an
  older CLI that would otherwise ignore the flag or reject it outright.
`,
    )
    .action(async (dir: string, opts) => {
      if (opts.requireResolved) {
        await runResolvedPush(dir, opts);
        return;
      }
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
          printJson({ ok: false, changed: false, organisation: plan.organisation, blockers: plan.blockers });
        } else {
          process.stderr.write(`${renderBlockers(plan.blockers)}\n`);
        }
        process.exit(1);
      }

      if (opts.dryRun) {
        if (opts.json) printJson({ ok: true, dry_run: true, ...planJson(plan) });
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
          printJson({ ok: false, changed: true, error: message, ...partial });
        } else {
          process.stderr.write(`${renderPartial(partial ?? { tools: [] }, message)}\n`);
        }
        process.exit(1);
      }
      applying?.stop();

      if (outcome.failedAt) {
        const message = outcome.tools.find((t) => t.error)?.error ?? "push failed";
        if (opts.json) {
          printJson({ ok: false, changed: true, error: message, ...outcome });
        } else {
          process.stderr.write(`${renderPartial(outcome, message)}\n`);
        }
        process.exit(1);
      }

      if (opts.json) {
        printJson({ ok: true, organisation: plan.organisation, ...outcome });
      }
      else console.log(renderOutcome(plan, outcome));
    });
}
