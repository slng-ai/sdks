import { Command, Option } from "commander";
import ora from "ora";
import { agentsRequest, formatAgentsError, type AgentsResult } from "../lib/agents";
import { printJson } from "../lib/output";

// --- types -----------------------------------------------------------------
// Mirrors the McpServerListItem / McpServerDetail schemas of the public
// shared-resource routes. Those routes are mounted include_in_schema=False, so
// they never reach the OpenAPI document or the generated SDK — hence the
// hand-written shapes, the same way `tool` and `secret` do it.

export interface McpServerListItem {
  id: string;
  name: string;
  url_template: string;
  transport: string;
  revision: number | null;
  /** Health of the last capability probe: `healthy`, or an error state. */
  capability_status: string | null;
  capability_observed_at: string | null;
  /** How many tools the last probe found on the server. */
  capability_tool_count: number | null;
}

// The detail record is the list row plus fields nothing here type-checks —
// printServer walks it generically.
export type McpServerDetail = McpServerListItem & Record<string, unknown>;

/** One tool the last capability probe found on the server. */
export interface McpTool {
  name: string;
  description?: string | null;
  input_schema?: Record<string, unknown> | null;
  output_schema?: Record<string, unknown> | null;
  schema_hash?: string | null;
}

/**
 * The probe result, or nothing when a server has never been probed. `truncated`
 * means the probe itself stopped short — the tools listed are not all of them.
 */
export interface McpCapabilities {
  tools?: McpTool[] | null;
  truncated?: boolean | null;
  pages_fetched?: number | null;
}

/** What `POST /v1/agents/mcp-servers/{id}/connect` answers with. */
export interface McpConnectResult {
  /** `connected`, or an error state. */
  status: string;
  latency_ms?: number | null;
  server_info?: { name?: string; version?: string } | null;
  protocol_version?: string | null;
  capabilities?: McpCapabilities | null;
}

// --- helpers ---------------------------------------------------------------

export const PAGE_SIZE = 200; // server max
export const MAX_OFFSET = 10_000; // server max

function row(cells: string[]): string {
  return cells.join("\t");
}

/** `-`, never `0`, for a field the server left unset. */
export function cell(v: unknown): string {
  return v === null || v === undefined || v === "" ? "-" : String(v);
}

/**
 * Every MCP server the caller can see, paging until a short page arrives. The
 * server caps offset at MAX_OFFSET, so a longer list is reported rather than
 * silently truncated.
 */
export async function listAllServers(names?: string[]): Promise<McpServerListItem[]> {
  const out: McpServerListItem[] = [];
  for (let offset = 0; offset <= MAX_OFFSET; offset += PAGE_SIZE) {
    const query: Record<string, string | number | string[] | undefined> = {
      limit: PAGE_SIZE,
      offset,
    };
    if (names?.length) query.name = names;
    const res = await agentsRequest<McpServerListItem[]>("GET", "/v1/agents/mcp-servers", { query });
    if (!res.ok) throw new Error(formatAgentsError(res));
    const page = Array.isArray(res.data) ? res.data : [];
    out.push(...page);
    if (page.length < PAGE_SIZE) return out;
  }
  process.stderr.write(
    `warning: stopped at the API's ${MAX_OFFSET}-row pagination ceiling; more servers may exist.\n`,
  );
  return out;
}

/**
 * Resolve exact server names to their detail records. Two round trips per name,
 * because the routes are id-addressed: the list filters by name, the detail
 * carries the capability probe — and `capabilities[].schema_hash` is the whole
 * reason push can attach an MCP tool without speaking MCP itself.
 *
 * Returns what it found. A caller that must have every name decides what a
 * short result means; `resolveServer` exits, `push` turns it into a blocker.
 */
export async function loadServers(names: string[]): Promise<McpServerDetail[]> {
  if (!names.length) return [];
  const rows = await listAllServers(names);
  const out: McpServerDetail[] = [];
  for (const row of rows) {
    const res = await agentsRequest<McpServerDetail>(
      "GET",
      `/v1/agents/mcp-servers/${encodeURIComponent(row.id)}`,
    );
    if (!res.ok || !res.data) throw new Error(formatAgentsError(res));
    out.push(res.data);
  }
  return out;
}

/** Connect to one server now. Refreshes the platform's capability snapshot as it goes. */
export function connectServer(id: string) {
  return agentsRequest<McpConnectResult>(
    "POST",
    `/v1/agents/mcp-servers/${encodeURIComponent(id)}/connect`,
  );
}

// --- create ----------------------------------------------------------------

export const TRANSPORTS = ["streamable_http", "sse"] as const;
export type Transport = (typeof TRANSPORTS)[number];

/** Register a new MCP server. `POST /v1/agents/mcp-servers`. */
export function createServer(body: Record<string, unknown>) {
  return agentsRequest<McpServerDetail>("POST", "/v1/agents/mcp-servers", { body });
}

/**
 * Build the create body from the common-case flags. Full-fidelity bodies
 * (header auth, literal/vault headers, inline credentials) come through
 * `--file` instead — this covers name + URL + transport + optional bearer auth.
 */
export function buildServerBody(opts: {
  name: string;
  url: string;
  transport?: Transport;
  description?: string;
  bearerSecret?: string;
}): Record<string, unknown> {
  const body: Record<string, unknown> = {
    name: opts.name,
    url_template: opts.url,
    transport: opts.transport ?? "streamable_http",
    auth: opts.bearerSecret ? { type: "bearer", secret_name: opts.bearerSecret } : { type: "none" },
  };
  if (opts.description) body.description = opts.description;
  return body;
}

/**
 * One server's detail record, addressed directly by id. No name lookup — a
 * rename or a name reuse cannot redirect this to a different server. The
 * existing `get`/`run` handlers use it for `--id`; push's guarded mode (T014)
 * uses it too, to check a staged `observed_schema_hash` without probing.
 */
export async function getServerById(id: string): Promise<AgentsResult<McpServerDetail>> {
  return agentsRequest<McpServerDetail>("GET", `/v1/agents/mcp-servers/${encodeURIComponent(id)}`);
}

/**
 * Is the platform's capability snapshot too old to attach against?
 *
 * ponytail: `next_refresh_at` is when the platform intends to look again, which
 * is a proxy for — not a definition of — when a snapshot stops being accepted.
 * It is read from the server rather than hard-coded so a changed window cannot
 * silently break the CLI, and it only ever raises a warning: the authoritative
 * answer is the platform's response to the write, which push retries.
 */
export function isSnapshotStale(server: McpServerDetail, now: Date = new Date()): boolean {
  if (server.capability_status !== "healthy") return true;
  if (!server.capability_observed_at) return true;
  const next = server.next_refresh_at;
  if (typeof next !== "string") return false;
  const due = Date.parse(next);
  return Number.isFinite(due) && due < now.getTime();
}

/**
 * Why the platform would refuse to attach against this snapshot, or null when
 * it would accept it. The strict counterpart to `isSnapshotStale`, for the
 * guarded push: it mirrors `validate_selected_tools` in the backend, which
 * refuses a record that is not healthy, was probed at an older server
 * revision, or has aged out — even though `_mark_failure` leaves the previous
 * capability document (and so the checked hash) in place. Unlike
 * `isSnapshotStale`, missing or unreadable metadata is a refusal here, not a
 * pass: a matching hash on a record the platform will reject proves nothing,
 * and this mode has no refresh-and-retry to fall back on.
 */
export function snapshotRefusal(server: McpServerDetail, now: Date = new Date()): string | null {
  if (server.capability_status !== "healthy") {
    return `capability_status is ${server.capability_status ?? "unknown"}, not healthy`;
  }
  if (server.capability_revision !== server.revision) {
    return `snapshot is for revision ${server.capability_revision ?? "?"}, the server is at revision ${server.revision ?? "?"}`;
  }
  const observed = Date.parse(server.capability_observed_at ?? "");
  if (!Number.isFinite(observed)) return "capability_observed_at is missing or unreadable";
  const due = typeof server.next_refresh_at === "string" ? Date.parse(server.next_refresh_at) : NaN;
  if (!Number.isFinite(due)) return "next_refresh_at is missing or unreadable";
  if (due <= now.getTime()) {
    return `snapshot expired: observed ${server.capability_observed_at}, refresh was due ${server.next_refresh_at}`;
  }
  return null;
}

/**
 * What changed between the stored snapshot and what the server just answered.
 *
 * A server nobody has probed has no previous set at all — reporting its whole
 * catalogue as "added" would read as tools appearing, so that case is named.
 */
export function diffToolNames(
  previous: McpTool[] | null | undefined,
  current: McpTool[],
): { added: string[]; removed: string[]; firstProbe: boolean } {
  if (!previous) return { added: [], removed: [], firstProbe: true };
  const before = new Set(previous.map((t) => t.name));
  const after = new Set(current.map((t) => t.name));
  return {
    added: [...after].filter((n) => !before.has(n)),
    removed: [...before].filter((n) => !after.has(n)),
    firstProbe: false,
  };
}

/** Exit non-zero, keeping stdout valid JSON under --json. */
function fail(json: boolean | undefined, message: string): never {
  if (json) printJson({ ok: false, error: message });
  else process.stderr.write(`${message}\n`);
  process.exit(1);
}

function spin(label: string) {
  return process.stderr.isTTY
    ? ora({ stream: process.stderr, text: label, color: "yellow", spinner: "line" }).start()
    : null;
}

/** One field per line. Objects and long values point at --json rather than flooding the terminal. */
function summarise(key: string, v: unknown): string {
  if (v === null || v === undefined || v === "") return "-";
  // The probe result carries every tool's full description — the one field that
  // would bury the rest of the record.
  if (key === "capabilities" && typeof v === "object") {
    const tools = (v as { tools?: unknown[] }).tools;
    const n = Array.isArray(tools) ? tools.length : 0;
    return `${n} tool${n === 1 ? "" : "s"} (use --json for the schemas)`;
  }
  if (Array.isArray(v)) return v.length ? v.map(String).join(", ") : "-";
  if (typeof v === "object") {
    const keys = Object.keys(v as object);
    return keys.length ? `{${keys.join(", ")}} (use --json)` : "-";
  }
  return String(v);
}

/**
 * First non-empty line of a tool description, clipped. MCP descriptions are
 * multi-paragraph prose that begins with a newline; the whole thing belongs in
 * --json, not in a table cell.
 */
export function firstLine(text: string | null | undefined, max = 100): string {
  const line = (text ?? "")
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l !== "");
  if (!line) return "-";
  return line.length > max ? `${line.slice(0, max - 1)}…` : line;
}

export function printServer(server: McpServerDetail): void {
  const first = [
    "name",
    "transport",
    "url_template",
    "capability_status",
    "capability_tool_count",
    "description",
    "id",
  ];
  const keys = [...first, ...Object.keys(server).filter((k) => !first.includes(k))];
  for (const k of keys) {
    console.log(`${k.padEnd(26)}${summarise(k, server[k])}`);
  }
}

/** `loadServers` for one name, exiting rather than returning short. */
async function resolveServer(
  name: string,
  json: boolean | undefined,
  label: string,
): Promise<McpServerDetail> {
  const spinner = spin(label);
  let found: McpServerDetail[];
  try {
    found = await loadServers([name]);
  } catch (e) {
    spinner?.stop();
    fail(json, (e as Error).message);
  }
  spinner?.stop();
  const chosen = found[0];
  if (!chosen) {
    fail(json, `mcp server "${name}" not found. names are matched exactly and are case-sensitive.`);
  }
  return chosen;
}

/** `getServerById` for the CLI: exits, rather than returning, on a miss. */
async function resolveServerById(
  id: string,
  json: boolean | undefined,
  label: string,
): Promise<McpServerDetail> {
  const spinner = spin(label);
  const res = await getServerById(id);
  spinner?.stop();
  if (!res.ok || !res.data) fail(json, formatAgentsError(res));
  return res.data;
}

// --- command tree ----------------------------------------------------------

export function mcpCommand(): Command {
  const cmd = new Command("mcp")
    .description("Inspect the MCP servers your agents can call")
    .addHelpText(
      "afterAll",
      `
COMMANDS
  list                     list every MCP server available to your organisation
  get <server-name>        show one server in full
  create <server-name>     register a new MCP server
  tools <server-name>      list the tools one server exposes
  run <server-name>        connect to one server now and report what it exposes

EXAMPLES
  $ voiceai mcp list                             every server your agents can call
  $ voiceai mcp list --json | jq '.[].name'      scriptable
  $ voiceai mcp get firecrawl-mcp                one server, all properties
  $ voiceai mcp get srv_abc123 --id --json       by id, skipping the name lookup
  $ voiceai mcp create firecrawl-mcp --url https://mcp.firecrawl.dev/{{$FIRECRAWL_KEY}}/mcp
  $ voiceai mcp create acme --url https://acme.example/mcp --bearer-secret ACME_TOKEN
  $ voiceai mcp create --file server.json         header auth / custom headers
  $ voiceai mcp tools firecrawl-mcp              the tools that server exposes
  $ voiceai mcp tools firecrawl-mcp --json       each tool's full input schema
  $ voiceai mcp run firecrawl-mcp                check the server is up right now
  $ voiceai mcp run srv_abc123 --id              by id, then verify it is still that server

NOTES
  Server names are matched exactly and are case-sensitive.

  \`--id\` addresses a server directly, skipping the name lookup entirely — a
  rename or a name reuse cannot redirect \`get\`/\`run\` to a different server.
  \`run --id\` also re-reads that same id once after connecting, to confirm it
  is still the server it started with.

  \`create\` takes the common case as flags (name + --url, optional --transport,
  --description, --bearer-secret). Embed vault secrets in the URL as {{$NAME}}.
  For header auth, literal/vault headers or inline credentials, pass a full JSON
  body with --file. Run \`mcp run <name>\` after creating to probe it.

  \`capability_status\` and \`capability_tool_count\` come from the last capability
  probe, not from a live call: a server can be listed and still be unreachable.
  \`tools\` reads that same probe — it does not call the server.

  \`run\` is the one that does call the server. A successful run also refreshes the
  platform's record of what the server exposes, which is what makes an agent
  referencing it publishable again after that record has gone stale.

  Auth is reported as the vault secret's NAME, never its value.
`,
    );

  cmd
    .command("list")
    .description("List every MCP server available to your organisation")
    .option("--json", "Output JSON")
    .action(async (opts) => {
      const spinner = spin("loading mcp servers");
      let rows: McpServerListItem[];
      try {
        rows = await listAllServers();
      } catch (e) {
        spinner?.stop();
        fail(opts.json, (e as Error).message);
      }
      spinner?.stop();
      if (opts.json) {
        printJson(rows);
        return;
      }
      if (!rows.length) {
        console.log("no mcp servers found.");
        return;
      }
      console.log(row(["NAME", "TRANSPORT", "STATUS", "TOOLS"]));
      for (const s of rows) {
        console.log(
          row([s.name, cell(s.transport), cell(s.capability_status), cell(s.capability_tool_count)]),
        );
      }
    });

  cmd
    .command("get <server-name>")
    .description("Show one MCP server by its exact name, or by id with --id")
    .option("--json", "Output JSON")
    .option("--id", "Treat the argument as a server ID, skipping the name lookup")
    .action(async (nameOrId: string, opts) => {
      const server = opts.id
        ? await resolveServerById(nameOrId, opts.json, `loading ${nameOrId}`)
        : await resolveServer(nameOrId, opts.json, `loading ${nameOrId}`);
      if (opts.json) {
        printJson(server);
        return;
      }
      printServer(server);
    });

  cmd
    .command("create [server-name]")
    .description("Register an MCP server (by flags, or a full JSON body with --file)")
    .option("--url <template>", "URL template; embed vault secrets as {{$NAME}}")
    .addOption(new Option("--transport <transport>", "Transport").choices(TRANSPORTS).default("streamable_http"))
    .option("--description <text>", "Optional description")
    .option("--bearer-secret <name>", "Send Authorization: Bearer from this vault secret")
    .option("--file <path>", "Create from a full JSON body (or - for stdin) instead of flags")
    .option("--json", "Output JSON")
    .action(async (name: string | undefined, opts) => {
      let body: Record<string, unknown>;
      if (opts.file) {
        // A full body is mutually exclusive with the convenience flags.
        if (name || opts.url) {
          fail(opts.json, "give either --file or a name plus flags, not both.");
        }
        let raw: string;
        try {
          raw = opts.file === "-" ? await Bun.stdin.text() : await Bun.file(opts.file).text();
        } catch (e) {
          fail(opts.json, `could not read ${opts.file}: ${(e as Error).message}`);
        }
        try {
          body = JSON.parse(raw) as Record<string, unknown>;
        } catch (e) {
          fail(opts.json, `invalid JSON in ${opts.file}: ${(e as Error).message}`);
        }
      } else {
        if (!name) fail(opts.json, "a server name is required (or use --file).");
        if (!opts.url) fail(opts.json, "--url is required (or use --file).");
        body = buildServerBody({
          name,
          url: opts.url,
          transport: opts.transport,
          description: opts.description,
          bearerSecret: opts.bearerSecret,
        });
      }

      const spinner = spin(`creating ${name ?? "mcp server"}`);
      const res = await createServer(body);
      spinner?.stop();
      if (!res.ok || !res.data) fail(opts.json, formatAgentsError(res));
      if (opts.json) {
        printJson(res.data);
        return;
      }
      printServer(res.data);
    });

  cmd
    .command("run <server-name>")
    .description("Connect to one MCP server now and report what it exposes")
    .option("--json", "Output JSON")
    .option("--id", "Treat the argument as a server ID, skipping the name lookup")
    .action(async (nameOrId: string, opts) => {
      const server = opts.id
        ? await resolveServerById(nameOrId, opts.json, `loading ${nameOrId}`)
        : await resolveServer(nameOrId, opts.json, `connecting to ${nameOrId}`);
      const previous = ((server.capabilities ?? {}) as McpCapabilities).tools ?? null;
      const spinner = spin(`connecting to ${nameOrId}`);
      const res = await connectServer(server.id);
      spinner?.stop();
      if (!res.ok || !res.data) fail(opts.json, formatAgentsError(res));
      const result = res.data;
      const tools = result.capabilities?.tools ?? [];
      const diff = diffToolNames(server.capability_observed_at ? previous : null, tools);

      // --id's whole point is that a rename or a name reuse cannot redirect this
      // to a different server. A successful connect can still be followed by a
      // renamed/deleted record, so re-read the same id once and check it is
      // still the server we started with before reporting success.
      if (opts.id && result.status === "connected") {
        const reread = await resolveServerById(server.id, opts.json, `verifying ${server.id}`);
        if (reread.id !== server.id) {
          fail(opts.json, `mcp server ${server.id} changed identity after connecting.`);
        }
      }

      if (opts.json) {
        printJson({ ...result, added: diff.added, removed: diff.removed });
      } else {
        const changes = diff.firstProbe
          ? `first probe — ${tools.length} tool${tools.length === 1 ? "" : "s"} discovered`
          : [...diff.added.map((n) => `+${n}`), ...diff.removed.map((n) => `-${n}`)].join(", ") ||
            "none";
        const info = [result.server_info?.name, result.server_info?.version].filter(Boolean).join(" ");
        const fields: [string, string][] = [
          ["server", `${server.name} (${server.id})`],
          [
            "status",
            result.status === "connected" ? `connected in ${result.latency_ms} ms` : result.status,
          ],
          ["serving", info || "-"],
          ["protocol", cell(result.protocol_version)],
          ["tools", String(tools.length)],
          ["changes", changes],
        ];
        for (const [k, v] of fields) console.log(`${k.padEnd(26)}${v}`);
      }
      // The status is the server's answer, not the transport's: a 200 that says
      // anything but `connected` is still a server that did not work.
      if (result.status !== "connected") process.exit(1);
    });

  cmd
    .command("tools <server-name>")
    .description("List the tools one MCP server exposes")
    .option("--json", "Output JSON")
    .action(async (name: string, opts) => {
      const server = await resolveServer(name, opts.json, `loading ${name} tools`);
      const caps = (server.capabilities ?? {}) as McpCapabilities;
      const tools = caps.tools ?? [];
      // A short list because the probe gave up is not the same as a short
      // server. Say so, or the count reads as complete.
      if (caps.truncated) {
        process.stderr.write(
          "warning: the last capability probe was truncated; the server may expose more tools.\n",
        );
      }
      if (opts.json) {
        printJson(tools);
        return;
      }
      if (!tools.length) {
        console.log(
          server.capability_observed_at
            ? "the last probe reported no tools."
            : "this server has not been probed yet.",
        );
        return;
      }
      console.log(row(["NAME", "DESCRIPTION"]));
      for (const t of tools) console.log(row([t.name, firstLine(t.description)]));
    });

  return cmd;
}
