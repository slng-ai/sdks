import { agentsRequest, formatAgentsError, type AgentsResult } from "./agents";
import type { PackageToolBody } from "./package";

// The four writes a tool goes through on its way to an agent: write the draft,
// build it, prove it with one run, publish it. `agents push` makes all four
// for a tool body in a package; `tool create`, `tool update`, `tool run` and
// `tool publish` make them one at a time. One copy, so the two cannot drift.

/** What `POST /v1/agents/tools/{id}/run` answers with. */
export interface RunResult {
  status: "succeeded" | "failed" | "timed_out";
  error?: string | null;
  validation?: string;
}

export interface GateCheck {
  passed?: boolean;
  detail?: string | null;
}

export interface PublishResult {
  published: boolean;
  version_number: number | null;
  checks?: Record<string, unknown>;
}

/** The parts of a tool record the writes read back. */
export interface WrittenTool {
  id: string;
  name?: string;
  arg_schema?: Record<string, unknown> | null;
  [k: string]: unknown;
}

const path = (id: string, action = "") => `/v1/agents/tools/${encodeURIComponent(id)}${action}`;

/** The data of a 2xx answer, or the API's own error text as a throw. */
async function must<T>(req: Promise<AgentsResult<T>>): Promise<T> {
  const res = await req;
  if (!res.ok) throw new Error(formatAgentsError(res));
  return res.data as T;
}

/**
 * Create the tool, or change the one with `existingId`. tool_type is never sent
 * on a change: it cannot change, and the platform refuses the field.
 */
export async function writeTool(body: Partial<PackageToolBody>, existingId?: string): Promise<WrittenTool> {
  if (existingId) {
    const { tool_type: _t, ...patch } = body;
    return must(agentsRequest<WrittenTool>("PATCH", path(existingId), { body: patch }));
  }
  return must(agentsRequest<WrittenTool>("POST", "/v1/agents/tools", { body }));
}

/**
 * Build a code tool: the platform parses the code, installs its dependencies
 * and reads the argument schema off its `Input` model. Needed after every code
 * or dependency change, before a run or a publish.
 */
export async function buildTool(id: string): Promise<WrittenTool> {
  return must(agentsRequest<WrittenTool>("POST", path(id, "/introspect")));
}

/**
 * Run the tool once, for real. confirm_side_effects is a required literal, so
 * every caller must already hold the operator's consent to send it.
 */
export async function runTool(id: string, input: Record<string, unknown>): Promise<RunResult> {
  return must(
    agentsRequest<RunResult>("POST", path(id, "/run"), {
      body: { sample_input: input, confirm_side_effects: true },
    }),
  );
}

/**
 * Publish the draft. A 409 is not an error here: it carries a PublishResult
 * naming the gates that failed, so it is returned for the caller to read.
 */
export async function publishTool(id: string): Promise<PublishResult> {
  const res = await agentsRequest<PublishResult>("POST", path(id, "/publish"));
  if (!res.ok && res.status !== 409) throw new Error(formatAgentsError(res));
  return (res.data as PublishResult | undefined) ?? { published: false, version_number: null };
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
