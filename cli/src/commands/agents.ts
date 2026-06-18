import { Command } from "commander";
import { readFileSync } from "node:fs";
import ora from "ora";
import { agentsRequest, agentsBaseUrl, formatAgentsError, type AgentsResult } from "../lib/agents";

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
      console.log(JSON.stringify(result.data ?? { ok: false, status: result.status, error: msg }, null, 2));
    } else if (spinner) {
      spinner.fail(msg);
    } else {
      process.stderr.write(`${msg}\n`);
    }
    process.exit(1);
  }
  spinner?.stop();
  if (json) console.log(JSON.stringify(result.data ?? null, null, 2));
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
  calls tool-exec <id> <call_id> -f <f>  submit a tool-execution result
  web-sessions create <id>               create a browser session (LiveKit details)

EXAMPLES
  $ voiceai agents list
  $ voiceai agents create --file agent.json
  $ cat agent.json | voiceai agents update <id> --file -
  $ voiceai agents calls dispatch <id> --phone +15551234567
  $ voiceai agents calls list <id> --json | jq '.items[].status'

NOTES
  • IDs can be positional or named flags: \`agents calls get a1 c2\` == \`--agent-id a1 --call-id c2\`.
  • create/update/replace/tool-exec take a JSON body via --file <path> (or "-" for stdin).
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

  cmd.addCommand(callsCommand());
  cmd.addCommand(webSessionsCommand());
  return cmd;
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

  // calls tool-exec <agent_id> <call_id> --file
  calls
    .command("tool-exec [agent_id] [call_id]")
    .description("Submit a tool execution result for a call")
    .requiredOption("-f, --file <path>", 'JSON body file ("-" for stdin)')
    .option("--agent-id <id>", "Agent id (alternative to the positional)")
    .option("--call-id <id>", "Call id (alternative to the positional)")
    .option("--json", "Output JSON")
    .action(async (agentIdArg: string | undefined, callIdArg: string | undefined, opts) => {
      const agentId = resolveId("agent id", "--agent-id", agentIdArg, opts.agentId);
      const callId = resolveId("call id", "--call-id", callIdArg, opts.callId);
      const body = readJsonInput(opts.file);
      const data = await send<Record<string, unknown>>(
        opts.json,
        `submitting tool execution for call ${callId}`,
        agentsRequest("POST", `/v1/agents/${agentId}/calls/${callId}/tool-executions`, { body }),
      );
      if (!opts.json) console.log(`submitted tool execution${data && data.id ? ` ${data.id}` : ""}`);
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
      const body = opts.file ? readJsonInput(opts.file) : undefined;
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
