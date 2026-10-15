import { Command } from "commander";
import { readFileSync } from "node:fs";
import ora from "ora";
import { agentsRequest, agentsBaseUrl, formatAgentsError, type AgentsResult } from "../lib/agents";
import { checkAgentBody } from "../lib/model-catalog";
import { createInterface } from "node:readline/promises";
import { printJson } from "../lib/output";
import { pushCommand, writeAgentWhenPrepared } from "./push";

// --- helpers ---------------------------------------------------------------

/** Read a JSON body from a file path, or stdin when the arg is "-". */
function readJsonInput(file: string): unknown {
  let raw: string;
  try {
    raw = file === "-" ? readFileSync(0, "utf8") : readFileSync(file, "utf8");
  } catch (e) {
    process.stderr.write(`could not read ${file === "-" ? "stdin" : file}: ${(e as Error).message}\n`);
    process.exit(1);
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    process.stderr.write(`invalid JSON in ${file === "-" ? "stdin" : file}: ${(e as Error).message}\n`);
    process.exit(1);
  }
}

/**
 * Refuse a full agent body whose region, language, models or voices the live
 * catalog does not offer, before it is sent. PATCH bodies are partial, so
 * update skips this and the platform checks the merged result.
 */
async function refuseUnavailableModels(body: unknown): Promise<void> {
  const b = (body ?? {}) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" && v ? v : undefined);
  const check = await checkAgentBody({
    region: str(b.region),
    language: str(b.language),
    models: b.models as Record<string, unknown> | undefined,
  });
  if (check.unreadable) {
    process.stderr.write(`note: could not check models against the catalog (${check.unreadable}). the platform will check them on write.\n`);
  }
  if (!check.problems.length) return;
  process.stderr.write(`model or voice not available:\n${check.problems.map((p) => `  - ${p}`).join("\n")}\n${check.hint}\n`);
  process.exit(1);
}

/**
 * Run an agents request with a spinner, exit non-zero on failure, and return
 * the parsed body. When `--json`, prints the raw body; otherwise the caller
 * renders a human summary from the returned data.
 */
async function send<T = unknown>(
  json: boolean | undefined,
  label: string,
  req: Promise<AgentsResult<T>>,
): Promise<T | undefined> {
  const spinner = process.stderr.isTTY
    ? ora({ stream: process.stderr, text: label, color: "yellow", spinner: "line" }).start()
    : null;
  const result = await req;
  if (!result.ok) {
    const msg = formatAgentsError(result);
    if (json) {
      spinner?.stop();
      // Emit the API's JSON error body (or a synthesized one) so --json stays parseable.
      printJson(result.data ?? { ok: false, status: result.status, error: msg });
    } else if (spinner) {
      spinner.fail(msg);
    } else {
      process.stderr.write(`${msg}\n`);
    }
    process.exit(1);
  }
  spinner?.stop();
  if (json) printJson(result.data ?? null);
  return result.data;
}

function row(cells: (string | number | undefined | null)[]): string {
  return cells.map((c) => (c === undefined || c === null ? "" : String(c))).join("\t");
}

/** Resolve an id from either the positional arg or its named flag (positional wins). */
function resolveId(what: string, flag: string, positional?: string, viaFlag?: string): string {
  const v = positional ?? viaFlag;
  if (!v) {
    process.stderr.write(`missing ${what}: pass it positionally or with ${flag}.\n`);
    process.exit(1);
  }
  return v;
}

// --- command tree ----------------------------------------------------------

export function agentsCommand(): Command {
  const cmd = new Command("agents")
    .description("Manage voice agents, their calls, and web sessions")
    .addHelpText(
      "afterAll",
      `
COMMANDS
  list                                   list your agents
  get <id>                               show one agent
  create --file <f>                      create an agent from a JSON body
  update <id> --file <f>                 patch an agent (PATCH)
  replace <id> --file <f>                replace an agent (PUT)
  duplicate <id>                         copy an agent
  delete <id>                            delete an agent
  calls dispatch <id> --phone <e164>     start an outbound call
  calls list <id>                        list an agent's calls
  calls get <id> <call_id>               show one call
  calls export <id>                      all calls as CSV, on stdout
  calls live-view <id> <call_id>         listen-only LiveKit join for a live call
  web-sessions create <id>               create a browser session (LiveKit details)
  push <dir>                             push an unmute-compiled agent package
  config <id> [--version <n>]            download an agent's full config (JSON)
  import --file <f> [--trunk <id>]       create an agent from a downloaded config
  versions list <id>                     list an agent's config versions
  versions get <id> <n>                  show one version and its config
  versions restore <id> <n>              preview, confirm, then restore a version

EXAMPLES
  $ voiceai agents list
  $ voiceai agents create --file agent.json
  $ cat agent.json | voiceai agents update <id> --file -
  $ voiceai agents calls dispatch <id> --phone +15551234567
  $ voiceai agents calls list <id> --json | jq '.items[].status'
  $ voiceai agents push examples/slng-support --dry-run
  $ voiceai agents config <id> > agent.json && voiceai agents import --file agent.json

NOTES
  • IDs can be positional or named flags: \`agents calls get a1 c2\` == \`--agent-id a1 --call-id c2\`.
  • create/update/replace take a JSON body via --file <path> (or "-" for stdin).
  • Every command supports --json.
  • The interactive TUI (run \`voiceai\` with no args → Agents) browses agents and runs
    quick actions (dispatch a call, view calls, web session, duplicate, delete). Creating
    or editing agents is CLI-only, via --file.
  • Agents host defaults to ${agentsBaseUrl()} (override with VOICEAI_AGENTS_BASE_URL or
    \`voiceai config set agentsBaseUrl <url>\`).
`,
    );

  // agents list
  cmd
    .command("list")
    .description("List all agents")
    .option("--json", "Output JSON")
    .action(async (opts) => {
      const data = await send<Array<Record<string, unknown>>>(
        opts.json,
        "loading agents",
        agentsRequest("GET", "/v1/agents"),
      );
      if (opts.json) return;
      const agents = Array.isArray(data) ? data : [];
      if (!agents.length) {
        console.log("no agents yet. create one with `voiceai agents create --file agent.json`.");
        return;
      }
      console.log(row(["ID", "NAME", "LANG", "REGION", "CREATED"]));
      for (const a of agents) {
        console.log(row([a.id as string, a.name as string, a.language as string, a.region as string, a.created_at as string]));
      }
    });

  // agents get <agent_id>
  cmd
    .command("get [agent_id]")
    .description("Show a single agent")
    .option("--agent-id <id>", "Agent id (alternative to the positional)")
    .option("--json", "Output JSON")
    .action(async (agentIdArg: string | undefined, opts) => {
      const agentId = resolveId("agent id", "--agent-id", agentIdArg, opts.agentId);
      const data = await send<Record<string, unknown>>(
        opts.json,
        `loading agent ${agentId}`,
        agentsRequest("GET", `/v1/agents/${agentId}`),
      );
      if (!opts.json && data) printAgent(data);
    });

  // agents create --file <path|->
  cmd
    .command("create")
    .description("Create an agent from a JSON body")
    .requiredOption("-f, --file <path>", 'JSON body file ("-" for stdin)')
    .option("--json", "Output JSON")
    .action(async (opts) => {
      const body = readJsonInput(opts.file);
      await refuseUnavailableModels(body);
      const data = await send<Record<string, unknown>>(
        opts.json,
        "creating agent",
        agentsRequest("POST", "/v1/agents", { body }),
      );
      if (!opts.json && data) {
        console.log(`created agent ${data.id ?? ""}`);
        printAgent(data);
      }
    });

  // agents update <agent_id> --file (PATCH)
  cmd
    .command("update [agent_id]")
    .description("Update an agent (partial, PATCH)")
    .requiredOption("-f, --file <path>", 'JSON body file ("-" for stdin)')
    .option("--agent-id <id>", "Agent id (alternative to the positional)")
    .option("--json", "Output JSON")
    .action(async (agentIdArg: string | undefined, opts) => {
      const agentId = resolveId("agent id", "--agent-id", agentIdArg, opts.agentId);
      const body = readJsonInput(opts.file);
      const data = await send<Record<string, unknown>>(
        opts.json,
        `updating agent ${agentId}`,
        agentsRequest("PATCH", `/v1/agents/${agentId}`, { body }),
      );
      if (!opts.json && data) {
        console.log(`updated agent ${agentId}`);
        printAgent(data);
      }
    });

  // agents replace <agent_id> --file (PUT)
  cmd
    .command("replace [agent_id]")
    .description("Replace an agent (full, PUT)")
    .requiredOption("-f, --file <path>", 'JSON body file ("-" for stdin)')
    .option("--agent-id <id>", "Agent id (alternative to the positional)")
    .option("--json", "Output JSON")
    .action(async (agentIdArg: string | undefined, opts) => {
      const agentId = resolveId("agent id", "--agent-id", agentIdArg, opts.agentId);
      const body = readJsonInput(opts.file);
      await refuseUnavailableModels(body);
      const data = await send<Record<string, unknown>>(
        opts.json,
        `replacing agent ${agentId}`,
        agentsRequest("PUT", `/v1/agents/${agentId}`, { body }),
      );
      if (!opts.json && data) {
        console.log(`replaced agent ${agentId}`);
        printAgent(data);
      }
    });

  // agents delete <agent_id>
  cmd
    .command("delete [agent_id]")
    .description("Delete an agent")
    .option("--agent-id <id>", "Agent id (alternative to the positional)")
    .option("--json", "Output JSON")
    .action(async (agentIdArg: string | undefined, opts) => {
      const agentId = resolveId("agent id", "--agent-id", agentIdArg, opts.agentId);
      await send(opts.json, `deleting agent ${agentId}`, agentsRequest("DELETE", `/v1/agents/${agentId}`));
      if (!opts.json) console.log(`deleted agent ${agentId}`);
    });

  // agents duplicate <agent_id> [--file]
  cmd
    .command("duplicate [agent_id]")
    .description("Duplicate an agent")
    .option("-f, --file <path>", 'optional JSON overrides ("-" for stdin)')
    .option("--agent-id <id>", "Agent id (alternative to the positional)")
    .option("--json", "Output JSON")
    .action(async (agentIdArg: string | undefined, opts) => {
      const agentId = resolveId("agent id", "--agent-id", agentIdArg, opts.agentId);
      const body = opts.file ? readJsonInput(opts.file) : undefined;
      const data = await send<Record<string, unknown>>(
        opts.json,
        `duplicating agent ${agentId}`,
        agentsRequest("POST", `/v1/agents/${agentId}/duplicate`, { body }),
      );
      if (!opts.json && data) {
        console.log(`duplicated into agent ${data.id ?? ""}`);
        printAgent(data);
      }
    });

  // config <agent_id> [--version n]
  cmd
    .command("config [agent_id]")
    .description("Download an agent's full config as JSON (the file `import` takes)")
    .option("--version <n>", "A past version instead of the current one")
    .option("--agent-id <id>", "Agent id (alternative to the positional)")
    .action(async (agentIdArg: string | undefined, opts) => {
      const agentId = resolveId("agent id", "--agent-id", agentIdArg, opts.agentId);
      const path = opts.version
        ? `/v1/agents/${agentId}/versions/${positiveInt("--version", opts.version)}/config`
        : `/v1/agents/${agentId}/config`;
      // Always JSON: the body is the config document itself. Errors go to stderr, never into a redirect.
      printJson(await send(false, `downloading config of agent ${agentId}`, agentsRequest("GET", path)));
    });

  // import --file [--trunk]
  cmd
    .command("import")
    .description("Create an agent from a config downloaded with `agents config`")
    .requiredOption("-f, --file <path>", 'Config JSON file ("-" for stdin)')
    .option("--trunk <id>", "Outbound SIP trunk to attach to the new agent")
    .option("--json", "Output JSON")
    .action(async (opts) => {
      const body = readJsonInput(opts.file);
      await refuseUnavailableModels(body);
      const query = opts.trunk ? { sip_outbound_trunk_id: String(opts.trunk) } : undefined;
      let agent: Record<string, unknown>;
      try {
        agent = (await writeAgentWhenPrepared(() =>
          agentsRequest("POST", "/v1/agents/import", { body, query }),
        )) as unknown as Record<string, unknown>;
      } catch (e) {
        process.stderr.write(`import failed: ${(e as Error).message}\n`);
        process.exit(1);
      }
      if (opts.json) return printJson(agent);
      console.log(`imported agent ${agent.id ?? ""}`);
      printAgent(agent);
    });

  cmd.addCommand(callsCommand());
  cmd.addCommand(webSessionsCommand());
  cmd.addCommand(pushCommand());
  cmd.addCommand(versionsCommand());
  return cmd;
}

/** Parse a flag or positional that must be a whole number of 1 or more. */
function positiveInt(what: string, v: string): number {
  const n = Number(v);
  if (!Number.isInteger(n) || n < 1) {
    process.stderr.write(`${what} must be a whole number of 1 or more, got "${v}".\n`);
    process.exit(1);
  }
  return n;
}

// --- agents versions -------------------------------------------------------

interface RestorePreview {
  state: "ready" | "preparing" | "failed";
  target_version: number;
  current_version: number | null;
  candidate_config_hash?: string | null;
  acceptance_hash?: string | null;
  changed_fields?: string[];
  issues?: { code?: string; message?: string; remediation?: string | null }[];
  preparation?: { resource_hash?: string; dependency_hash?: string | null; retry_after_seconds?: number | null } | null;
}

function versionsCommand(): Command {
  const versions = new Command("versions").description("List, inspect and restore an agent's config versions");

  versions
    .command("list [agent_id]")
    .description("List config versions, newest first")
    .option("--agent-id <id>", "Agent id (alternative to the positional)")
    .option("--page <n>", "Page number", "1")
    .option("--page-size <n>", "Items per page")
    .option("--json", "Output JSON")
    .action(async (agentIdArg: string | undefined, opts) => {
      const agentId = resolveId("agent id", "--agent-id", agentIdArg, opts.agentId);
      const query: Record<string, number> = { page: positiveInt("--page", opts.page) };
      if (opts.pageSize) query.page_size = positiveInt("--page-size", opts.pageSize);
      const data = await send<{ items?: Record<string, unknown>[] }>(
        opts.json,
        `listing versions of agent ${agentId}`,
        agentsRequest("GET", `/v1/agents/${agentId}/versions`, { query }),
      );
      if (opts.json) return; // send() printed it
      console.log(row(["VERSION", "SOURCE", "CHANGED", "LABEL", "CREATED"]));
      for (const v of data?.items ?? []) {
        const changed = Array.isArray(v.changed_fields) ? v.changed_fields.join(",") : "";
        const source = v.restored_from_version ? `${v.source} (from ${v.restored_from_version})` : v.source;
        console.log(row([v.version_number as number, source as string, changed, v.label as string, v.created_at as string]));
      }
    });

  versions
    .command("get [agent_id] [version]")
    .description("Show one version, including its full config")
    .option("--agent-id <id>", "Agent id (alternative to the positional)")
    .action(async (agentIdArg: string | undefined, versionArg: string | undefined, opts) => {
      const agentId = resolveId("agent id", "--agent-id", agentIdArg, opts.agentId);
      const n = positiveInt("version", resolveId("version", "the second positional", versionArg));
      printJson(await send(false, `reading version ${n}`, agentsRequest("GET", `/v1/agents/${agentId}/versions/${n}`)));
    });

  versions
    .command("restore [agent_id] [version]")
    .description("Make a past version current again: preview, confirm, accept")
    .option("--agent-id <id>", "Agent id (alternative to the positional)")
    .option("--restore-name", "Also restore the agent name the version had")
    .option("-y, --yes", "Skip the confirmation prompt (required when stdin is not a terminal)")
    .option("--json", "Output JSON")
    .action(async (agentIdArg: string | undefined, versionArg: string | undefined, opts) => {
      const agentId = resolveId("agent id", "--agent-id", agentIdArg, opts.agentId);
      const n = positiveInt("version", resolveId("version", "the second positional", versionArg));
      if (!opts.yes && !process.stdin.isTTY) {
        process.stderr.write("refusing to restore without a prompt: pass --yes to confirm non-interactively.\n");
        process.exit(1);
      }
      const options = { restore_historical_name: Boolean(opts.restoreName) };
      const base = `/v1/agents/${agentId}/versions/${n}/restore`;
      const preview = await send<RestorePreview>(
        false,
        `previewing restore of version ${n}`,
        agentsRequest("POST", `${base}/preview`, { body: options }),
      );
      if (!preview) process.exit(1);
      const issues = (preview.issues ?? []).map((i) => `  - ${[i.message, i.remediation, i.code].filter(Boolean).join(" · ")}`);
      if (preview.state === "preparing") {
        const wait = preview.preparation?.retry_after_seconds ?? 5;
        process.stderr.write(`version ${n}'s code dependencies are still being prepared. try again in about ${wait}s.\n`);
        process.exit(1);
      }
      if (preview.state === "failed" || !preview.acceptance_hash || !preview.candidate_config_hash || !preview.preparation?.resource_hash) {
        process.stderr.write(`version ${n} cannot be restored:\n${issues.join("\n") || "  - the platform gave no reason"}\n`);
        process.exit(1);
      }
      const changed = preview.changed_fields ?? [];
      process.stderr.write(
        `restore version ${n} over version ${preview.current_version ?? "-"}. changes: ${changed.length ? changed.join(", ") : "none"}\n`,
      );
      if (issues.length) process.stderr.write(`warnings:\n${issues.join("\n")}\n`);
      if (!opts.yes) {
        const rl = createInterface({ input: process.stdin, output: process.stderr });
        const answer = (await rl.question("restore? [y/N] ")).trim().toLowerCase();
        rl.close();
        if (answer !== "y" && answer !== "yes") {
          process.stderr.write("not restored.\n");
          process.exit(1);
        }
      }
      const agent = await send<Record<string, unknown>>(
        opts.json,
        `restoring version ${n}`,
        agentsRequest("POST", `${base}/accept`, {
          body: {
            ...options,
            acceptance_hash: preview.acceptance_hash,
            candidate_hash: preview.candidate_config_hash,
            resource_hash: preview.preparation.resource_hash,
            dependency_hash: preview.preparation.dependency_hash ?? null,
          },
        }),
      );
      if (opts.json) return; // send() printed it
      console.log(`restored version ${n} of agent ${agentId}`);
      if (agent) printAgent(agent);
    });

  return versions;
}

// --- agents calls ----------------------------------------------------------

function callsCommand(): Command {
  const calls = new Command("calls").description("Dispatch and inspect agent calls");

  // calls dispatch <agent_id> --phone <e164> [--file args.json]
  calls
    .command("dispatch [agent_id]")
    .description("Dispatch an outbound call")
    .requiredOption("--phone <e164>", "Destination phone number, E.164 (e.g. +15551234567)")
    .option("-f, --file <path>", 'optional call arguments as JSON ("-" for stdin)')
    .option("--agent-id <id>", "Agent id (alternative to the positional)")
    .option("--json", "Output JSON")
    .action(async (agentIdArg: string | undefined, opts) => {
      const agentId = resolveId("agent id", "--agent-id", agentIdArg, opts.agentId);
      const args = opts.file ? readJsonInput(opts.file) : undefined;
      const body: Record<string, unknown> = { phone_number: opts.phone };
      if (args !== undefined) body.arguments = args;
      const data = await send<Record<string, unknown>>(
        opts.json,
        `dispatching call to ${opts.phone}`,
        agentsRequest("POST", `/v1/agents/${agentId}/calls`, { body }),
      );
      if (!opts.json && data) console.log(`call ${data.call_id ?? ""}${data.message ? ` · ${data.message}` : ""}`);
    });

  // calls list <agent_id> [--page --page-size]
  calls
    .command("list [agent_id]")
    .description("List calls for an agent")
    .option("--agent-id <id>", "Agent id (alternative to the positional)")
    .option("--page <n>", "Page number")
    .option("--page-size <n>", "Page size")
    .option("--json", "Output JSON")
    .action(async (agentIdArg: string | undefined, opts) => {
      const agentId = resolveId("agent id", "--agent-id", agentIdArg, opts.agentId);
      const data = await send<{ items?: Array<Record<string, unknown>>; meta?: Record<string, unknown> }>(
        opts.json,
        `loading calls for ${agentId}`,
        agentsRequest("GET", `/v1/agents/${agentId}/calls`, { query: { page: opts.page, page_size: opts.pageSize } }),
      );
      if (opts.json) return;
      const items = data?.items ?? [];
      if (!items.length) {
        console.log("no calls yet.");
        return;
      }
      console.log(row(["ID", "DIRECTION", "STATUS", "PHONE", "DURATION_MS"]));
      for (const c of items) {
        console.log(row([c.id as string, c.call_direction as string, c.status as string, c.phone_number as string, c.call_duration_ms as number]));
      }
      const m = data?.meta;
      if (m) console.log(`\npage ${m.page}/${m.pages} · ${m.total} total`);
    });

  // calls get <agent_id> <call_id>
  calls
    .command("get [agent_id] [call_id]")
    .description("Show a single call")
    .option("--agent-id <id>", "Agent id (alternative to the positional)")
    .option("--call-id <id>", "Call id (alternative to the positional)")
    .option("--json", "Output JSON")
    .action(async (agentIdArg: string | undefined, callIdArg: string | undefined, opts) => {
      const agentId = resolveId("agent id", "--agent-id", agentIdArg, opts.agentId);
      const callId = resolveId("call id", "--call-id", callIdArg, opts.callId);
      const data = await send<Record<string, unknown>>(
        opts.json,
        `loading call ${callId}`,
        agentsRequest("GET", `/v1/agents/${agentId}/calls/${callId}`),
      );
      if (!opts.json && data) {
        console.log(row(["ID", "DIRECTION", "STATUS", "PHONE", "DURATION_MS"]));
        console.log(row([data.id as string, data.call_direction as string, data.status as string, data.phone_number as string, data.call_duration_ms as number]));
      }
    });

  // calls export <agent_id> [filters]
  calls
    .command("export [agent_id]")
    .description("Export an agent's calls as CSV to stdout")
    .option("--agent-id <id>", "Agent id (alternative to the positional)")
    .option("--status <status>", "Only calls with this status")
    .option("--channel <direction>", "Only inbound or outbound calls")
    .option("--from <time>", "Only calls started at or after this ISO time")
    .option("--to <time>", "Only calls started at or before this ISO time")
    .option("--duration <bucket>", "none | under_1_min | 1_to_5_min | over_5_min")
    .action(async (agentIdArg: string | undefined, opts) => {
      const agentId = resolveId("agent id", "--agent-id", agentIdArg, opts.agentId);
      // ponytail: the whole CSV is buffered; stream it if exports ever get too big for memory.
      const csv = await send<string>(
        false,
        `exporting calls of agent ${agentId}`,
        agentsRequest("GET", `/v1/agents/${agentId}/calls/export`, {
          query: {
            status: opts.status,
            channel: opts.channel,
            date_from: opts.from,
            date_to: opts.to,
            duration_bucket: opts.duration,
          },
        }),
      );
      process.stdout.write(typeof csv === "string" ? csv : "");
    });

  // calls live-view <agent_id> <call_id>
  calls
    .command("live-view [agent_id] [call_id]")
    .description("Get a listen-only LiveKit join to follow an in-progress call (transcript and tool events, no audio)")
    .option("--agent-id <id>", "Agent id (alternative to the positional)")
    .option("--call-id <id>", "Call id (alternative to the positional)")
    .option("--json", "Output JSON")
    .action(async (agentIdArg: string | undefined, callIdArg: string | undefined, opts) => {
      const agentId = resolveId("agent id", "--agent-id", agentIdArg, opts.agentId);
      const callId = resolveId("call id", "--call-id", callIdArg, opts.callId);
      const data = await send<Record<string, unknown>>(
        opts.json,
        `opening live view of call ${callId}`,
        agentsRequest("POST", `/v1/agents/${agentId}/calls/${callId}/live-view`),
      );
      if (opts.json || !data) return;
      console.log(`room:  ${data.room_name ?? ""}`);
      console.log(`url:   ${data.livekit_url ?? ""}`);
      console.log(`token: ${data.livekit_token ?? ""}`);
    });

  return calls;
}

// --- agents web-sessions ---------------------------------------------------

function webSessionsCommand(): Command {
  const ws = new Command("web-sessions").description("Create browser web sessions for an agent");

  ws
    .command("create [agent_id]")
    .description("Create a web session (returns LiveKit connection details)")
    .option("-f, --file <path>", 'optional JSON body ("-" for stdin)')
    .option("--agent-id <id>", "Agent id (alternative to the positional)")
    .option("--json", "Output JSON")
    .action(async (agentIdArg: string | undefined, opts) => {
      const agentId = resolveId("agent id", "--agent-id", agentIdArg, opts.agentId);
      // The API requires a body, even an empty one.
      const body = opts.file ? readJsonInput(opts.file) : {};
      const data = await send<Record<string, unknown>>(
        opts.json,
        `creating web session for ${agentId}`,
        agentsRequest("POST", `/v1/agents/${agentId}/web-sessions`, { body }),
      );
      if (!opts.json && data) {
        console.log(`call_id:     ${data.call_id ?? ""}`);
        console.log(`room:        ${data.room_name ?? ""}`);
        console.log(`livekit_url: ${data.livekit_url ?? ""}`);
        console.log(`token:       ${data.livekit_token ?? ""}`);
      }
    });

  return ws;
}

// --- shared agent summary --------------------------------------------------

function printAgent(a: Record<string, unknown>): void {
  console.log(`id:       ${a.id ?? ""}`);
  console.log(`name:     ${a.name ?? ""}`);
  console.log(`language: ${a.language ?? ""}`);
  console.log(`region:   ${a.region ?? ""}`);
  if (a.created_at) console.log(`created:  ${a.created_at}`);
  console.log("(use --json for the full agent)");
}
