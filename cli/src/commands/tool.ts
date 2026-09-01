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
  /** JSON Schema for the tool's arguments; derived from the pydantic model for a code tool. */
  arg_schema: Record<string, unknown> | null;
}

// The detail record is the list row plus fields nothing here type-checks —
// printTool walks it generically. See data-model.md for the full field list.
export type ToolDetail = ToolListItem & Record<string, unknown>;

/** What `POST /v1/agents/tools/{id}/run` answers with. Shared with push. */
export interface RunResult {
  status: "succeeded" | "failed" | "timed_out";
  error?: string | null;
  validation?: string;
}

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

/**
 * The tool's input: `--input <file>`, `--input -`, or stdin when it is not a
 * TTY. Principle III — a validation command that cannot sit in a pipeline is
 * half a command.
 */
export async function readRunInput(
  input: string | undefined,
): Promise<{ value: Record<string, unknown>; source: string } | { error: string }> {
  let raw: string;
  let source: string;
  if (input && input !== "-") {
    source = input;
    try {
      raw = await Bun.file(input).text();
    } catch (e) {
      return { error: `could not read ${input}: ${(e as Error).message}` };
    }
  } else if (input === "-" || !process.stdin.isTTY) {
    source = "stdin";
    raw = await Bun.stdin.text();
  } else {
    return { value: {}, source: "none" };
  }
  if (!raw.trim()) return { value: {}, source };
  try {
    return { value: JSON.parse(raw) as Record<string, unknown>, source };
  } catch (e) {
    return { error: `invalid JSON in ${source}: ${(e as Error).message}` };
  }
}

/** Keep a multi-line platform error inside its field. */
function indent(text: string): string {
  return text.split("\n").join("\n                      ");
}

/** One catalogue row by exact name, exiting when there is none. */
async function resolveTool(name: string, json: boolean | undefined): Promise<ToolListItem> {
  let rows: ToolListItem[];
  try {
    rows = await listAllTools([name]);
  } catch (e) {
    fail(json, (e as Error).message);
  }
  const chosen = rows[0];
  if (!chosen) {
    fail(json, `tool "${name}" not found. names are matched exactly and are case-sensitive.`);
  }
  return chosen;
}

export function printTool(tool: ToolDetail): void {
  const first = ["name", "latest_version", "tool_type", "description", "id"];
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
  run <tool-name>          execute one tool and report what happened

EXAMPLES
  $ voiceai tool list                          every tool your agents can call
  $ voiceai tool list --json | jq '.[].name'   scriptable
  $ voiceai tool get api_request               one tool, all properties
  $ voiceai tool get check_order --json | jq .arg_schema   the input schema
  $ echo '{"id":7}' | voiceai tool run check_order --confirm-side-effects
  $ voiceai tool run check_order --input sample.json --confirm-side-effects

NOTES
  Tool names are matched exactly and are case-sensitive.

  \`--json\` carries \`arg_schema\` — the JSON Schema of a tool's input, derived from
  the pydantic model for a code tool.

  \`run\` executes the tool against your REAL dependencies — it can charge a card or
  send an email. Nothing runs without --confirm-side-effects. The input comes from
  --input <file>, from stdin, or is {} when neither is given, and is never printed
  back. Exit is 0 only when the run succeeded.
`,
    );

  cmd
    .command("list")
    .description("List every tool available to your organisation")
    .option("--json", "Output JSON")
    .action(async (opts) => {
      const spinner = spin("loading tools");
      let rows: ToolListItem[];
      try {
        rows = await listAllTools();
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
        console.log("no tools found.");
        return;
      }
      console.log(row(["NAME", "TYPE", "VERSION"]));
      for (const t of rows) {
        console.log(row([t.name, t.tool_type, versionCell(t.latest_version)]));
      }
    });

  cmd
    .command("get <tool-name>")
    .description("Show one tool by its exact name")
    .option("--json", "Output JSON")
    .action(async (name: string, opts) => {
      const spinner = spin(`loading ${name}`);
      let chosen: ToolListItem;
      try {
        chosen = await resolveTool(name, opts.json);
      } finally {
        spinner?.stop();
      }
      // The list row omits config, code_src, secrets and gate status.
      const res = await agentsRequest<ToolDetail>(
        "GET",
        `/v1/agents/tools/${encodeURIComponent(chosen.id)}`,
      );
      if (!res.ok || !res.data) fail(opts.json, formatAgentsError(res));
      if (opts.json) {
        console.log(JSON.stringify(res.data, null, 2));
        return;
      }
      printTool(res.data);
    });

  cmd
    .command("run <tool-name>")
    .description("Execute one tool against your real dependencies")
    .option("--input <file>", "JSON input document, or - for stdin")
    .option("--confirm-side-effects", "Consent to executing the tool for real")
    .option("--json", "Output JSON")
    .action(async (name: string, opts) => {
      const input = await readRunInput(opts.input);
      // Read the input before the consent check: a typo in the file is worth
      // hearing about without having to consent to a run first.
      if ("error" in input) fail(opts.json, input.error);
      if (!opts.confirmSideEffects) {
        fail(
          opts.json,
          `running ${name} executes the tool against your real dependencies. ` +
            "re-run with --confirm-side-effects to consent to that.",
        );
      }

      const spinner = spin(`running ${name}`);
      let chosen: ToolListItem;
      try {
        chosen = await resolveTool(name, opts.json);
      } finally {
        spinner?.stop();
      }
      const res = await agentsRequest<RunResult>(
        "POST",
        `/v1/agents/tools/${encodeURIComponent(chosen.id)}/run`,
        // Required literal. Supplied only because --confirm-side-effects was
        // passed: it is the operator's consent to execute their dependencies.
        { body: { sample_input: input.value, confirm_side_effects: true } },
      );
      if (!res.ok || !res.data) fail(opts.json, formatAgentsError(res));
      const result = res.data;

      if (opts.json) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        // The input is never echoed: it may carry a secret and nothing here
        // needs to show it back.
        console.log(`status                ${result.status}`);
        if (result.error) console.log(`error                 ${indent(result.error)}`);
        if (result.validation) console.log(`validation            ${indent(result.validation)}`);
      }
      if (result.status !== "succeeded") process.exit(1);
    });

  return cmd;
}
