import { Command } from "commander";
import ora from "ora";
import { agentsRequest, formatAgentsError } from "../lib/agents";

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

/** Exit non-zero, keeping stdout valid JSON under --json. */
function fail(json: boolean | undefined, message: string): never {
  if (json) console.log(JSON.stringify({ ok: false, error: message }, null, 2));
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

/**
 * Resolve an exact server name to its detail record. Two requests, because the
 * routes are id-addressed: the list filters by name, the detail carries auth,
 * headers and the capability probe that the list row omits.
 */
async function resolveServer(
  name: string,
  json: boolean | undefined,
  label: string,
): Promise<McpServerDetail> {
  const spinner = spin(label);
  let rows: McpServerListItem[];
  try {
    rows = await listAllServers([name]);
  } catch (e) {
    spinner?.stop();
    fail(json, (e as Error).message);
  }
  const chosen = rows[0];
  if (!chosen) {
    spinner?.stop();
    fail(json, `mcp server "${name}" not found. names are matched exactly and are case-sensitive.`);
  }
  const res = await agentsRequest<McpServerDetail>(
    "GET",
    `/v1/agents/mcp-servers/${encodeURIComponent(chosen.id)}`,
  );
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
  tools <server-name>      list the tools one server exposes

EXAMPLES
  $ voiceai mcp list                             every server your agents can call
  $ voiceai mcp list --json | jq '.[].name'      scriptable
  $ voiceai mcp get firecrawl-mcp                one server, all properties
  $ voiceai mcp tools firecrawl-mcp              the tools that server exposes
  $ voiceai mcp tools firecrawl-mcp --json       each tool's full input schema

NOTES
  Server names are matched exactly and are case-sensitive.

  \`capability_status\` and \`capability_tool_count\` come from the last capability
  probe, not from a live call: a server can be listed and still be unreachable.
  \`tools\` reads that same probe — it does not call the server.

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
        console.log(JSON.stringify(rows, null, 2));
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
    .description("Show one MCP server by its exact name")
    .option("--json", "Output JSON")
    .action(async (name: string, opts) => {
      const server = await resolveServer(name, opts.json, `loading ${name}`);
      if (opts.json) {
        console.log(JSON.stringify(server, null, 2));
        return;
      }
      printServer(server);
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
        console.log(JSON.stringify(tools, null, 2));
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
