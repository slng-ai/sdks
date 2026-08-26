import { Command } from "commander";
import ora from "ora";
import { agentsRequest, formatAgentsError, type AgentsResult } from "../lib/agents";

// --- types -----------------------------------------------------------------
// Mirrors the OrgSecretOut schema of the public shared-resource vault routes.
// Those routes are mounted include_in_schema=False, so they never reach the
// OpenAPI document or the generated SDK — hence the hand-written shape.

export interface VaultEntry {
  id: string;
  organisation_id: string;
  name: string;
  // A "variable" is non-sensitive config living in the same vault as secrets.
  kind: "secret" | "variable";
  description: string | null;
  // Never surfaced. null for secrets; decrypted plaintext for variables.
  value?: string | null;
  has_value: boolean;
  is_managed: boolean;
  revision: number;
  created_by: string | null;
  last_rotated_by: string | null;
  last_rotated_at: string | null;
  created_at: string;
  updated_at: string;
}

// --- redaction -------------------------------------------------------------

/**
 * Strip `value` at the response boundary, before any renderer sees the record.
 *
 * Deliberately unconditional. `kind: "secret"` always comes back null, but
 * `kind: "variable"` comes back as decrypted plaintext — so dumping a raw
 * record under --json would print a live vault value to stdout. One rule at one
 * place is what stops a future output path from forgetting.
 */
export function redact<T extends { value?: string | null }>(entry: T): Omit<T, "value"> {
  const { value: _value, ...rest } = entry;
  return rest;
}

// --- helpers ---------------------------------------------------------------

function row(cells: string[]): string {
  return cells.join("\t");
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

/** `yes`/`no`, never a blank cell that could be mistaken for a missing name. */
export function valueCell(hasValue: boolean): string {
  return hasValue ? "yes" : "no";
}

function cell(v: unknown): string {
  return v === null || v === undefined || v === "" ? "-" : String(v);
}

// --- transport -------------------------------------------------------------

/**
 * Every vault entry the caller can see. One request: the route takes no
 * parameters and returns the organisation's whole vault, so there is no page
 * to chase and no ceiling to warn about.
 */
export async function listSecrets(): Promise<VaultEntry[]> {
  const res = await agentsRequest<VaultEntry[]>("GET", "/v1/agents/secrets");
  if (!res.ok) throw new Error(formatAgentsError(res));
  return Array.isArray(res.data) ? res.data : [];
}

/**
 * One entry by exact, case-sensitive name. The vault is name-addressed, so this
 * is a single request — no id lookup first, unlike `tool get`. Returns the raw
 * result so the caller can tell a 404 apart from every other failure.
 */
export function getSecret(name: string): Promise<AgentsResult<VaultEntry>> {
  return agentsRequest<VaultEntry>("GET", `/v1/agents/secrets/${encodeURIComponent(name)}`);
}

// --- rendering -------------------------------------------------------------

/** One field per line. Takes an already-redacted entry; it does not redact. */
export function printSecret(entry: Record<string, unknown>): void {
  const first = ["name", "kind", "has_value", "description", "revision", "is_managed"];
  const keys = [...first, ...Object.keys(entry).filter((k) => !first.includes(k))];
  for (const k of keys) {
    const v = entry[k];
    const shown = typeof v === "boolean" ? valueCell(v) : cell(v);
    console.log(`${k.padEnd(22)}${shown}`);
  }
}

// --- command tree ----------------------------------------------------------

export function secretCommand(): Command {
  const cmd = new Command("secret")
    .description("Inspect the secrets and variables in your organisation's vault")
    .addHelpText(
      "afterAll",
      `
COMMANDS
  list                     list every vault entry your organisation holds
  get <secret-name>        show one entry by its exact name

EXAMPLES
  $ voiceai secret list                            every secret and variable
  $ voiceai secret list --json | jq '.[].name'     scriptable
  $ voiceai secret get STRIPE_KEY                  one entry, all properties
  $ voiceai secret get STRIPE_KEY >/dev/null       exit 0 if present, 1 if not

NOTES
  Secret names are matched exactly and are case-sensitive.

  Values are never displayed. Entries of kind \`secret\` cannot be read back at
  all; entries of kind \`variable\` could be, but this command redacts them too.
  Use \`has_value\` to tell whether an entry is populated.
`,
    );

  cmd
    .command("list")
    .description("List every secret and variable in your organisation's vault")
    .option("--json", "Output JSON")
    .action(async (opts) => {
      const spinner = spin("loading secrets");
      let rows: VaultEntry[];
      try {
        rows = await listSecrets();
      } catch (e) {
        spinner?.stop();
        fail(opts.json, (e as Error).message);
      }
      spinner?.stop();
      if (opts.json) {
        console.log(JSON.stringify(rows.map(redact), null, 2));
        return;
      }
      if (!rows.length) {
        console.log("no secrets found.");
        return;
      }
      console.log(row(["NAME", "KIND", "VALUE", "DESCRIPTION"]));
      for (const s of rows) {
        console.log(row([s.name, s.kind, valueCell(s.has_value), cell(s.description)]));
      }
    });

  cmd
    .command("get <secret-name>")
    .description("Show one vault entry by its exact name")
    .option("--json", "Output JSON")
    .action(async (name: string, opts) => {
      const spinner = spin(`loading ${name}`);
      const res = await getSecret(name);
      spinner?.stop();
      if (res.status === 404) {
        fail(
          opts.json,
          `secret "${name}" not found. names are matched exactly and are case-sensitive.`,
        );
      }
      if (!res.ok || !res.data) fail(opts.json, formatAgentsError(res));
      const safe = redact(res.data);
      if (opts.json) {
        console.log(JSON.stringify(safe, null, 2));
        return;
      }
      printSecret(safe as unknown as Record<string, unknown>);
    });

  return cmd;
}
