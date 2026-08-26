import { Command, Option } from "commander";
import ora from "ora";
import { agentsRequest, formatAgentsError } from "../lib/agents";

// --- types -----------------------------------------------------------------
// Mirrors the ToolListItem / ToolDetail schemas of the public shared-resource
// routes. Those routes are mounted include_in_schema=False, so they never reach
// the OpenAPI document or the generated SDK — hence the hand-written shapes.

export const SOURCES = ["curated", "org"] as const;
export type ToolSource = (typeof SOURCES)[number];

export interface ToolListItem {
  id: string;
  name: string;
  tool_type: string;
  description: string;
  last_run_status: string | null;
  source: ToolSource;
  latest_version: number | null;
  config_valid: boolean | null;
  arg_schema: Record<string, unknown> | null;
}

// The detail record is the list row plus fields nothing here type-checks —
// printTool walks it generically. See data-model.md for the full field list.
export type ToolDetail = ToolListItem & Record<string, unknown>;

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

/**
 * A name can belong to both a curated tool and an org tool. Without --source the
 * org tool wins — authoring a tool under a curated name is a deliberate override
 * — and the curated one is reported as shadowed rather than hidden.
 */
export function pickTool(
  rows: ToolListItem[],
  source?: ToolSource,
): { chosen?: ToolListItem; shadowed?: ToolListItem } {
  if (source) return { chosen: rows.find((r) => r.source === source) };
  const org = rows.find((r) => r.source === "org");
  if (org) return { chosen: org, shadowed: rows.find((r) => r.source === "curated") };
  return { chosen: rows[0] };
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

export function printTool(tool: ToolDetail): void {
  const first = ["name", "latest_version", "source", "tool_type", "description", "id"];
  const keys = [...first, ...Object.keys(tool).filter((k) => !first.includes(k))];
  for (const k of keys) {
    console.log(`${k.padEnd(22)}${summarise(k, tool[k])}`);
  }
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
  $ voiceai tool list                          curated + your own tools
  $ voiceai tool list --source org             only tools your org authored
  $ voiceai tool list --json | jq '.[].name'   scriptable
  $ voiceai tool get api_request               one tool, all properties
  $ voiceai tool get end_call --source curated disambiguate a name collision

NOTES
  Tool names are matched exactly and are case-sensitive.

  A name can belong to both a curated tool and one your organisation authored.
  \`get\` shows your organisation's and notes the shadowed curated one on stderr;
  \`--source\` picks a side explicitly.
`,
    );

  cmd
    .command("list")
    .description("List every tool available to your organisation")
    .addOption(new Option("--source <source>", "Restrict to one source").choices(SOURCES))
    .option("--json", "Output JSON")
    .action(async (opts) => {
      const source: ToolSource | undefined = opts.source;
      const spinner = spin("loading tools");
      let tools: ToolListItem[];
      try {
        tools = await listAllTools();
      } catch (e) {
        spinner?.stop();
        fail(opts.json, (e as Error).message);
      }
      spinner?.stop();
      const rows = source ? tools.filter((t) => t.source === source) : tools;
      if (opts.json) {
        console.log(JSON.stringify(rows, null, 2));
        return;
      }
      if (!rows.length) {
        console.log("no tools found.");
        return;
      }
      console.log(row(["NAME", "TYPE", "SOURCE", "VERSION"]));
      for (const t of rows) {
        console.log(row([t.name, t.tool_type, t.source, versionCell(t.latest_version)]));
      }
    });

  cmd
    .command("get <tool-name>")
    .description("Show one tool by its exact name")
    .addOption(new Option("--source <source>", "Disambiguate a name collision").choices(SOURCES))
    .option("--json", "Output JSON")
    .action(async (name: string, opts) => {
      const source: ToolSource | undefined = opts.source;
      const spinner = spin(`loading ${name}`);
      let rows: ToolListItem[];
      try {
        rows = await listAllTools([name]);
      } catch (e) {
        spinner?.stop();
        fail(opts.json, (e as Error).message);
      }
      const { chosen, shadowed } = pickTool(rows, source);
      if (!chosen) {
        spinner?.stop();
        fail(
          opts.json,
          `tool "${name}" not found${source ? ` with source '${source}'` : ""}. ` +
            "names are matched exactly and are case-sensitive.",
        );
      }
      // The list row omits config, code_src, secrets and gate status.
      const res = await agentsRequest<ToolDetail>(
        "GET",
        `/v1/agents/tools/${encodeURIComponent(chosen.id)}`,
      );
      spinner?.stop();
      if (!res.ok || !res.data) fail(opts.json, formatAgentsError(res));
      if (shadowed) {
        process.stderr.write(
          `note: a curated tool named ${name} is shadowed by your organisation's tool; ` +
            "show it with --source curated\n",
        );
      }
      if (opts.json) {
        console.log(JSON.stringify(res.data, null, 2));
        return;
      }
      printTool(res.data);
    });

  return cmd;
}
