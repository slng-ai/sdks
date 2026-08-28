import { Command } from "commander";
import ora from "ora";
import { agentsRequest, formatAgentsError } from "../lib/agents";

// --- types -----------------------------------------------------------------
// Mirrors the ToolListItem / ToolDetail schemas of the public shared-resource
// routes. Those routes are mounted include_in_schema=False, so they never reach
// the OpenAPI document or the generated SDK — hence the hand-written shapes.

export interface ToolListItem {
  id: string;
  name: string;
  tool_type: string;
  description: string;
  last_run_status: string | null;
  latest_version: number | null;
  config_valid: boolean | null;
  arg_schema: Record<string, unknown> | null;
}

// The detail record is the list row plus fields nothing here type-checks —
// printTool walks it generically. See data-model.md for the full field list.
export type ToolDetail = ToolListItem & { source?: "curated" | "org" } & Record<string, unknown>;

export interface McpServerListItem {
  id: string;
  name: string;
  url_template: string;
  transport: string;
  revision: number;
  capability_status: string;
  capability_observed_at: string | null;
  capability_tool_count: number | null;
}

export type McpServerDetail = McpServerListItem & Record<string, unknown>;

// --- helpers ---------------------------------------------------------------

export const PAGE_SIZE = 200; // server max
export const MAX_OFFSET = 10_000; // server max

function row(cells: string[]): string {
  return cells.join("\t");
}

/** `-`, never `0`, for a tool that has never been published. */
export function versionCell(v: number | null | undefined): string {
  return v === null || v === undefined ? "-" : String(v);
}

/**
 * Every tool the caller can see, paging until a short page arrives. The server
 * caps offset at MAX_OFFSET, so a catalogue larger than that is reported rather
 * than silently truncated.
 */
export async function listAllTools(names?: string[]): Promise<ToolListItem[]> {
  const out: ToolListItem[] = [];
  for (let offset = 0; offset <= MAX_OFFSET; offset += PAGE_SIZE) {
    const query: Record<string, string | number | string[] | undefined> = {
      limit: PAGE_SIZE,
      offset,
    };
    if (names?.length) query.name = names;
    const res = await agentsRequest<ToolListItem[]>("GET", "/v1/agents/tools", { query });
    if (!res.ok) throw new Error(formatAgentsError(res));
    const page = Array.isArray(res.data) ? res.data : [];
    out.push(...page);
    if (page.length < PAGE_SIZE) return out;
  }
  process.stderr.write(
    `warning: stopped at the API's ${MAX_OFFSET}-row pagination ceiling; more tools may exist.\n`,
  );
  return out;
}

export async function findMcpServer(name: string): Promise<McpServerListItem | undefined> {
  const res = await agentsRequest<McpServerListItem[]>("GET", "/v1/agents/mcp-servers", {
    query: { name: [name], limit: 1 },
  });
  if (!res.ok) throw new Error(formatAgentsError(res));
  return Array.isArray(res.data) ? res.data[0] : undefined;
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
  if (key === "latest_version") return versionCell(v as number);
  if (key === "code_src") return `${String(v).split("\n").length} lines (use --json for the source)`;
  if (Array.isArray(v)) return v.length ? v.map(String).join(", ") : "-";
  if (typeof v === "object") {
    const keys = Object.keys(v as object);
    return keys.length ? `{${keys.join(", ")}} (use --json)` : "-";
  }
  return String(v);
}

function printDetails(details: Record<string, unknown>, first: string[]): void {
  const keys = [...first, ...Object.keys(details).filter((key) => !first.includes(key))];
  for (const k of keys) {
    console.log(`${k.padEnd(22)}${summarise(k, details[k])}`);
  }
}

export function printTool(tool: ToolDetail): void {
  printDetails(tool, ["name", "latest_version", "tool_type", "description", "id"]);
}

export function printMcpServer(server: McpServerDetail): void {
  printDetails(server, ["name", "transport", "capability_status", "description", "id"]);
}

// --- command tree ----------------------------------------------------------

export function toolCommand(): Command {
  const cmd = new Command("tool")
    .description("Inspect the tools your agents can call")
    .addHelpText(
      "afterAll",
      `
COMMANDS
  list                     list every tool available to your organisation
  get <tool-name>          show one tool in full

EXAMPLES
  $ voiceai tool list                          your organisation's tools
  $ voiceai tool list --json | jq '.[].name'   scriptable
  $ voiceai tool get lookup_customer           one tool, all properties
  $ voiceai tool get knowledge_base            MCP server and discovered tools

NOTES
  Names are matched exactly and are case-sensitive. If a tool and MCP server
  share a name, the organisation tool is returned.
`,
    );

  cmd
    .command("list")
    .description("List your organisation's tools")
    .option("--json", "Output JSON")
    .action(async (opts) => {
      const spinner = spin("loading tools");
      let tools: ToolListItem[];
      try {
        tools = await listAllTools();
      } catch (e) {
        spinner?.stop();
        fail(opts.json, (e as Error).message);
      }
      spinner?.stop();
      if (opts.json) {
        console.log(JSON.stringify(tools, null, 2));
        return;
      }
      if (!tools.length) {
        console.log("no tools found.");
        return;
      }
      console.log(row(["NAME", "TYPE", "VERSION"]));
      for (const t of tools) {
        console.log(row([t.name, t.tool_type, versionCell(t.latest_version)]));
      }
    });

  cmd
    .command("get <tool-name>")
    .description("Show one tool or MCP server by its exact name")
    .option("--json", "Output JSON")
    .action(async (name: string, opts) => {
      const spinner = spin(`loading ${name}`);
      let rows: ToolListItem[];
      try {
        rows = await listAllTools([name]);
      } catch (e) {
        spinner?.stop();
        fail(opts.json, (e as Error).message);
      }
      const chosen = rows[0];
      if (chosen) {
        const res = await agentsRequest<ToolDetail>(
          "GET",
          `/v1/agents/tools/${encodeURIComponent(chosen.id)}`,
        );
        spinner?.stop();
        if (!res.ok || !res.data) fail(opts.json, formatAgentsError(res));
        if (opts.json) console.log(JSON.stringify(res.data, null, 2));
        else printTool(res.data);
        return;
      }

      let mcp: McpServerListItem | undefined;
      try {
        mcp = await findMcpServer(name);
      } catch (e) {
        spinner?.stop();
        fail(opts.json, (e as Error).message);
      }
      if (!mcp) {
        spinner?.stop();
        fail(
          opts.json,
          `tool or MCP server "${name}" not found. names are matched exactly and are case-sensitive.`,
        );
      }
      const res = await agentsRequest<McpServerDetail>(
        "GET",
        `/v1/agents/mcp-servers/${encodeURIComponent(mcp.id)}`,
      );
      spinner?.stop();
      if (!res.ok || !res.data) fail(opts.json, formatAgentsError(res));
      if (opts.json) console.log(JSON.stringify(res.data, null, 2));
      else printMcpServer(res.data);
    });

  return cmd;
}
