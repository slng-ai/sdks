import { Command, Option } from "commander";
import ora from "ora";
import { agentsRequest, formatAgentsError } from "../lib/agents";

// --- types -----------------------------------------------------------------
// Mirrors SipTrunkAssignmentOptionsOut. There is no organisation-level trunk
// resource on the public API — see research.md D1 — so the only reachable view
// is GET /v1/agents/{agent_id}/sip-trunk-options, which returns the *org's*
// trunks annotated for one agent. Hence the hand-written shapes.

export const DIRECTIONS = ["inbound", "outbound"] as const;
export type Direction = (typeof DIRECTIONS)[number];

export interface TrunkOption {
  id: string;
  name: string;
  livekit_trunk_id: string | null;
  numbers: string[];
  status: string;
  selectable: boolean;
  is_current: boolean;
  // Deliberately `string | null`, not a closed union: the backend can add
  // reasons at any time and an unrecognised one must survive to the output.
  unavailable_reason: string | null;
}

export interface TrunkOptionsResponse {
  inbound: TrunkOption[];
  outbound: TrunkOption[];
}

export interface AgentRef {
  id: string;
  name: string;
}

export interface Report {
  agent: AgentRef;
  options: TrunkOptionsResponse;
}

/** One trunk, merged across every agent that reported it. */
export interface Trunk {
  direction: Direction;
  id: string;
  name: string;
  numbers: string[];
  status: string;
  livekit_trunk_id: string | null;
  usable: boolean;
  unavailable_reason: string | null;
  in_use_by: string | null;
}

// --- constants -------------------------------------------------------------

/** Agents read per round. Bounds socket use without needing a queue. */
export const BATCH_SIZE = 8;

export const NO_AGENTS_ERROR =
  "cannot list trunks: this organisation has no agents, and the platform only exposes " +
  "trunks through an agent. create an agent (`voiceai agents create --file agent.json`), " +
  "then run this again. this is not the same as having no trunks.";

export const COMPLETENESS_NOTE =
  "note: this lists the trunks the platform exposes; a trunk that is both unusable and " +
  "attached to no agent is not visible here.";

// --- helpers ---------------------------------------------------------------

function row(cells: string[]): string {
  return cells.join("\t");
}

/** `-`, never blank — a blank cell collapses two columns for cut/awk. */
export function cell(v: string | null | undefined): string {
  return v === null || v === undefined || v === "" ? "-" : v;
}

// Known reasons, in the platform's own vocabulary. An unrecognised reason is
// printed verbatim — the backend can add values and losing one would hide the
// only explanation the user gets.
const REASON_TEXT: Record<string, string> = {
  different_livekit_project: "belongs to a different telephony project",
  inactive: "not active",
  not_synced: "not yet synced with the telephony backend",
  assigned_to_another_agent: "already attached to another agent",
};

export function usableCell(t: Trunk): string {
  if (t.usable) return "yes";
  if (!t.unavailable_reason) return "no";
  return `no (${REASON_TEXT[t.unavailable_reason] ?? t.unavailable_reason})`;
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

// --- gather ----------------------------------------------------------------

/**
 * Every trunk report the organisation can produce: one read of the agent list,
 * then one trunk read per agent, in batches.
 *
 * The fan-out is load-bearing, not an optimisation target. An inbound trunk
 * attached to agent A is filtered out of every *other* agent's response, so a
 * single-agent read silently misses every inbound trunk already in use — the
 * normal state once telephony is wired. See research.md D3/D4.
 */
export async function collectTrunks(): Promise<Report[]> {
  // /v1/agents is a bare, unpaginated array — no limit/offset to send.
  const listed = await agentsRequest<AgentRef[]>("GET", "/v1/agents");
  if (!listed.ok) throw new Error(formatAgentsError(listed));
  const agents = Array.isArray(listed.data) ? listed.data : [];
  if (!agents.length) throw new Error(NO_AGENTS_ERROR);

  const reports: Report[] = [];
  for (let i = 0; i < agents.length; i += BATCH_SIZE) {
    const batch = await Promise.all(agents.slice(i, i + BATCH_SIZE).map(readAgent));
    reports.push(...batch.filter((r): r is Report => r !== null));
  }
  return reports;
}

async function readAgent(a: AgentRef): Promise<Report | null> {
  const res = await agentsRequest<TrunkOptionsResponse>(
    "GET",
    `/v1/agents/${encodeURIComponent(a.id)}/sip-trunk-options`,
  );
  // Deleted between the list read and this one. Benign race — skip it.
  if (res.status === 404) return null;
  // Anything else aborts: a partial set must never be printed as complete.
  if (!res.ok || !res.data) throw new Error(formatAgentsError(res));
  return { agent: { id: a.id, name: a.name }, options: res.data };
}

// --- merge -----------------------------------------------------------------

const DIRECTION_ORDER: Record<Direction, number> = { inbound: 0, outbound: 1 };

/**
 * Fold every agent's report into one trunk per (direction, id). Direction is
 * part of the key because inbound and outbound ids come from separate tables.
 * Ordering matches the server's own `ORDER BY name, id` so runs are stable.
 */
export function mergeReports(reports: Report[]): Trunk[] {
  const byKey = new Map<string, Trunk>();

  for (const { agent, options } of reports) {
    for (const direction of DIRECTIONS) {
      for (const o of options?.[direction] ?? []) {
        const key = `${direction}:${o.id}`;
        const seen = byKey.get(key);

        if (!seen) {
          byKey.set(key, {
            direction,
            id: o.id,
            name: o.name,
            numbers: o.numbers ?? [],
            status: o.status,
            livekit_trunk_id: o.livekit_trunk_id,
            usable: o.selectable,
            unavailable_reason: o.selectable ? null : o.unavailable_reason,
            in_use_by: o.is_current ? agent.name : null,
          });
          continue;
        }

        // Usable for any agent is usable for the organisation: reasons like
        // different_livekit_project are relative to the agent that was asked.
        if (o.selectable && !seen.usable) {
          seen.usable = true;
          seen.unavailable_reason = null;
        } else if (!seen.usable && !seen.unavailable_reason) {
          seen.unavailable_reason = o.unavailable_reason;
        }
        if (o.is_current && !seen.in_use_by) seen.in_use_by = agent.name;
      }
    }
  }

  return [...byKey.values()].sort(
    (a, b) =>
      DIRECTION_ORDER[a.direction] - DIRECTION_ORDER[b.direction] ||
      a.name.localeCompare(b.name) ||
      a.id.localeCompare(b.id),
  );
}

// --- command tree ----------------------------------------------------------

export function trunksCommand(): Command {
  const cmd = new Command("trunks")
    .description("Inspect your organisation's SIP trunks")
    .addHelpText(
      "afterAll",
      `
COMMANDS
  list                     list every SIP trunk available to your organisation

EXAMPLES
  $ voiceai trunks list                            every trunk, both directions
  $ voiceai trunks list --direction outbound       only outbound trunks
  $ voiceai trunks list --json | jq -r '.[].name'  scriptable
  $ voiceai trunks list --json | jq '[.[] | select(.usable | not)]'   what is broken

NOTES
  Inbound and outbound trunks are separate objects. The same name can exist on
  both sides, so DIRECTION is part of a trunk's identity.

  The listing is organisation-wide. The platform exposes trunks only through an
  agent, so this reads every agent in your organisation and merges the results —
  that is what makes an inbound trunk already attached to one agent visible here.
  An organisation with no agents cannot be enumerated at all.

  What is not shown: the platform withholds any trunk that is both unusable and
  attached to no agent. Such a trunk exists but cannot appear in this list.
`,
    );

  cmd
    .command("list")
    .description("List every SIP trunk available to your organisation")
    .addOption(new Option("--direction <direction>", "Restrict to one direction").choices(DIRECTIONS))
    .option("--json", "Output JSON")
    .action(async (opts) => {
      const spinner = spin("loading trunks");
      let reports: Report[];
      try {
        reports = await collectTrunks();
      } catch (e) {
        spinner?.stop();
        fail(opts.json, (e as Error).message);
      }
      spinner?.stop();
      const direction: Direction | undefined = opts.direction;
      const all = mergeReports(reports);
      const trunks = direction ? all.filter((t) => t.direction === direction) : all;

      if (opts.json) {
        console.log(JSON.stringify(trunks, null, 2));
        return;
      }
      if (!trunks.length) {
        console.log("no trunks found.");
      } else {
        console.log(row(["DIRECTION", "NAME", "NUMBERS", "STATUS", "USABLE", "IN USE BY"]));
        for (const t of trunks) {
          console.log(
            row([
              t.direction,
              t.name,
              cell(t.numbers.join(",")),
              cell(t.status),
              usableCell(t),
              cell(t.in_use_by),
            ]),
          );
        }
      }
      // Stderr only: the list is as complete as the platform allows, no more.
      process.stderr.write(`${COMPLETENESS_NOTE}\n`);
    });

  return cmd;
}
