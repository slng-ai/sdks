import { Command } from "commander";
import ora from "ora";
import { agentsRequest, formatAgentsError, type AgentsResult } from "../lib/agents";
import { printJson } from "../lib/output";

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

/**
 * The immutable version envelope from `GET /v1/agents/tools/{id}/versions/{n}`.
 * Distinct from ToolDetail's mutable `arg_schema`: a version's published
 * parameters live at `snapshot_json.argument_schema` — a different field on a
 * different, content-addressed record, never conflated with the draft.
 */
export interface ToolVersion {
  tool_id: string;
  version_number: number;
  snapshot_json: Record<string, unknown>;
  content_hash: string;
  published_at: string;
}

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

/** A tool id is a UUID; anything else is treated as an exact, case-sensitive name. */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Resolve a name-or-id argument to a tool id. A UUID is used directly — no name
 * lookup — so a caller who already has the id (e.g. from `tool list`/the TUI)
 * can address it exactly; any other value is resolved as a name.
 */
async function resolveToolId(nameOrId: string, json: boolean | undefined): Promise<string> {
  if (UUID_RE.test(nameOrId)) return nameOrId;
  return (await resolveTool(nameOrId, json)).id;
}

/**
 * Identity/detail record for one tool, addressed directly by id. No name
 * lookup: a rename or a name reuse cannot redirect this to a different tool.
 * `get <name>` and `get --id` both end up here, once each has its id.
 */
export async function fetchToolDetail(id: string): Promise<AgentsResult<ToolDetail>> {
  return agentsRequest<ToolDetail>("GET", `/v1/agents/tools/${encodeURIComponent(id)}`);
}

/**
 * The immutable published snapshot for one exact (id, version) pair. Never
 * falls back to the draft, `latest_version`, or a name lookup — a missing
 * version is the caller's problem to report, not a gap to paper over.
 */
export async function fetchToolVersion(id: string, version: number): Promise<AgentsResult<ToolVersion>> {
  return agentsRequest<ToolVersion>("GET", `/v1/agents/tools/${encodeURIComponent(id)}/versions/${version}`);
}

/**
 * `--version`'s argument. Commander hands every option value through as a
 * string; nothing in this repo coerces a numeric flag, so this is the one
 * parse. A positive integer only — no sign, no fraction, no leading garbage.
 */
export function parsePositiveInt(raw: string): number | null {
  if (!/^[0-9]+$/.test(raw)) return null;
  const n = Number(raw);
  return n > 0 ? n : null;
}

function printToolVersion(v: ToolVersion): void {
  const order: (keyof ToolVersion)[] = [
    "tool_id",
    "version_number",
    "content_hash",
    "published_at",
    "snapshot_json",
  ];
  for (const k of order) {
    console.log(`${k.padEnd(22)}${summarise(k, v[k])}`);
  }
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
  get <tool>               show one tool in full (by name or id)
  build <tool>             build a code tool (introspect its code) so it can run
  run <tool>               execute one tool and report what happened (by name or id)

EXAMPLES
  $ voiceai tool list                          every tool your agents can call
  $ voiceai tool list --json | jq '.[].name'   scriptable
  $ voiceai tool get api_request               one tool, all properties
  $ voiceai tool get check_order --json | jq .arg_schema   the input schema
  $ voiceai tool get 3f2c... --id --json       by id, skipping the name lookup
  $ voiceai tool get 3f2c... --version 7 --json   one immutable published version
  $ voiceai tool build check_order             build it before the first run
  $ echo '{"id":7}' | voiceai tool run check_order --confirm-side-effects
  $ voiceai tool run check_order --input sample.json --confirm-side-effects

NOTES
  Tool names are matched exactly and are case-sensitive. A tool id (UUID) is
  also accepted and addresses the tool directly, without a name lookup.

  A \`code\` tool must be built before its first run (and after its code changes) —
  \`build\` runs that step. Other tool types do not need it.

  \`--json\` carries \`arg_schema\` — the JSON Schema of a tool's input, derived from
  the pydantic model for a code tool.

  \`get --id\` reads a tool directly by id, skipping the name lookup. \`get --version
  <n>\` reads one immutable published version — its parameters live at
  \`snapshot_json.argument_schema\`, a different field than \`arg_schema\` on the
  mutable draft. Neither falls back to a name, the draft, or the latest version: a
  missing version is an error.

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
        printJson(rows);
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
    .command("get <tool>")
    .description("Show one tool by its exact name or id (or --id / --version)")
    .option("--json", "Output JSON")
    .option("--id", "Treat the argument as a tool ID, skipping the name lookup")
    .option("--version <n>", "Fetch one immutable published version by number (implies --id)")
    .action(async (nameOrId: string, opts) => {
      // Version mode is id-addressed and never falls back to a name lookup, the
      // draft, or latest_version: a missing version is an error, not a gap to
      // paper over. It reads a different endpoint than --id/name, so it branches
      // first regardless of whether --id was also passed.
      if (opts.version !== undefined) {
        const version = parsePositiveInt(opts.version);
        if (version === null) {
          fail(opts.json, `--version must be a positive integer, got "${opts.version}".`);
        }
        const spinner = spin(`loading ${nameOrId} v${opts.version}`);
        const res = await fetchToolVersion(nameOrId, version);
        spinner?.stop();
        if (!res.ok || !res.data) fail(opts.json, formatAgentsError(res));
        if (opts.json) {
          printJson(res.data);
          return;
        }
        printToolVersion(res.data);
        return;
      }

      if (opts.id) {
        const spinner = spin(`loading ${nameOrId}`);
        const res = await fetchToolDetail(nameOrId);
        spinner?.stop();
        if (!res.ok || !res.data) fail(opts.json, formatAgentsError(res));
        if (opts.json) {
          printJson(res.data);
          return;
        }
        printTool(res.data);
        return;
      }

      // A bare positional also accepts an id (UUID auto-detected), else a name.
      const spinner = spin(`loading ${nameOrId}`);
      let id: string;
      try {
        id = await resolveToolId(nameOrId, opts.json);
      } finally {
        spinner?.stop();
      }
      // The list row omits config, code_src, secrets and gate status.
      const res = await fetchToolDetail(id);
      if (!res.ok || !res.data) fail(opts.json, formatAgentsError(res));
      if (opts.json) {
        printJson(res.data);
        return;
      }
      printTool(res.data);
    });

  cmd
    .command("build <tool>")
    .description("Build a code tool (introspect its code) so it can run and publish")
    .option("--json", "Output JSON")
    .action(async (tool: string, opts) => {
      const spinner = spin(`building ${tool}`);
      let id: string;
      try {
        id = await resolveToolId(tool, opts.json);
      } finally {
        spinner?.stop();
      }
      // Introspect is the build step: it re-parses the code, rebuilds the code
      // environment and re-derives arg_schema. The server rejects it on a
      // non-code tool, so its error is surfaced rather than pre-empted.
      const res = await agentsRequest<ToolDetail>(
        "POST",
        `/v1/agents/tools/${encodeURIComponent(id)}/introspect`,
      );
      if (!res.ok || !res.data) fail(opts.json, formatAgentsError(res));
      if (opts.json) {
        printJson(res.data);
        return;
      }
      printTool(res.data);
    });

  cmd
    .command("run <tool>")
    .description("Execute one tool against your real dependencies")
    .option("--input <file>", "JSON input document, or - for stdin")
    .option("--confirm-side-effects", "Consent to executing the tool for real")
    .option("--json", "Output JSON")
    .action(async (tool: string, opts) => {
      const input = await readRunInput(opts.input);
      // Read the input before the consent check: a typo in the file is worth
      // hearing about without having to consent to a run first.
      if ("error" in input) fail(opts.json, input.error);
      if (!opts.confirmSideEffects) {
        fail(
          opts.json,
          `running ${tool} executes the tool against your real dependencies. ` +
            "re-run with --confirm-side-effects to consent to that.",
        );
      }

      const spinner = spin(`running ${tool}`);
      let id: string;
      try {
        id = await resolveToolId(tool, opts.json);
      } finally {
        spinner?.stop();
      }
      const res = await agentsRequest<RunResult>(
        "POST",
        `/v1/agents/tools/${encodeURIComponent(id)}/run`,
        // Required literal. Supplied only because --confirm-side-effects was
        // passed: it is the operator's consent to execute their dependencies.
        { body: { sample_input: input.value, confirm_side_effects: true } },
      );
      if (!res.ok || !res.data) fail(opts.json, formatAgentsError(res));
      const result = res.data;

      if (opts.json) {
        printJson(result);
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
