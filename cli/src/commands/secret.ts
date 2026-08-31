import { Command, Option } from "commander";
import { readFileSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import { parseEnv } from "node:util";
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
function fail(
  json: boolean | undefined,
  message: string,
  extra?: Record<string, unknown>,
): never {
  if (json) console.log(JSON.stringify({ ok: false, ...extra, error: message }, null, 2));
  else process.stderr.write(`${message}\n`);
  process.exit(1);
}

function spin(label: string) {
  return process.stderr.isTTY
    ? ora({
        stream: process.stderr,
        text: label,
        color: "yellow",
        spinner: "line",
        // ora's default puts stdin in raw mode to swallow keystrokes, and only
        // when stdin is a TTY. `create` prompts after this spinner, so the
        // default leaves the prompt reading a stdin it no longer owns — no
        // keypress ever arrives. Invisible over a pipe, a hang on a terminal.
        discardStdin: false,
      }).start()
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

export const KINDS = ["secret", "variable"] as const;
export type Kind = (typeof KINDS)[number];

/** Create. The platform has no upsert: POST on a name that exists is an error. */
export function createSecret(name: string, kind: Kind, value: string) {
  return agentsRequest("POST", "/v1/agents/secrets", { body: { name, kind, value } });
}

/** Overwrite an existing entry's value. `kind` is fixed at creation. */
export function updateSecret(name: string, value: string) {
  return agentsRequest("PATCH", `/v1/agents/secrets/${encodeURIComponent(name)}`, {
    body: { value },
  });
}

// --- input -----------------------------------------------------------------

export interface Pair {
  name: string;
  value: string;
}

/**
 * KEY=VALUE pairs from a dotenv-style file. `parseEnv` is the platform's own
 * parser — it already handles comments, `export ` prefixes, quoting and
 * multi-line values, so there is no parser here to get subtly wrong.
 *
 * A blank value is kept: an operator who wrote `KEY=` in the file meant it, and
 * silently skipping it would leave the vault disagreeing with the file.
 */
export function readSecretsFile(path: string): Pair[] {
  let text: string;
  try {
    text = readFileSync(path, "utf8");
  } catch (e) {
    throw new Error(`cannot read ${path}: ${(e as Error).message}`);
  }
  return Object.entries(parseEnv(text)).map(([name, value]) => ({
    name,
    value: String(value ?? ""),
  }));
}

/**
 * Read one value from the terminal, echoing `*` per character.
 *
 * A secret passed as an argv value would be recorded in shell history and
 * visible in `ps` to every user on the machine, so there is deliberately no
 * `--value` flag. Piped input is read verbatim instead, which is the CI path.
 *
 * Asterisks rather than silence: with no echo at all there is no way to tell a
 * dead terminal from a typed password, and no way to see a stray keystroke.
 */
export function readValue(promptText: string): Promise<string> {
  if (!process.stdin.isTTY) {
    return new Response(Bun.stdin.stream()).text().then((t) => t.replace(/\n$/, ""));
  }

  process.stdout.write(promptText);
  const stdin = process.stdin;
  const wasRaw = Boolean(stdin.isRaw);
  stdin.setRawMode(true);
  stdin.resume();

  // A `for await` loop over stdin would destroy the stream on `break`, and the
  // overwrite confirmation that follows reads the same stdin — it would abort
  // before the operator could answer. Attach a listener and detach it instead.
  return new Promise<string>((resolve) => {
    let buf = "";
    const detach = () => {
      stdin.off("data", onData);
      stdin.setRawMode(wasRaw);
      stdin.pause();
      process.stdout.write("\n");
    };
    const onData = (chunk: Buffer | string) => {
      for (const ch of String(chunk)) {
        if (ch === "\r" || ch === "\n") {
          detach();
          resolve(buf);
          return;
        }
        // Ctrl-C during a secret prompt must not fall through to the write.
        if (ch === "\u0003") {
          detach();
          process.exit(130);
        }
        if (ch === "\u007f" || ch === "\b") {
          if (buf) {
            buf = buf.slice(0, -1);
            process.stdout.write("\b \b");
          }
        } else {
          buf += ch;
          process.stdout.write("*");
        }
      }
    };
    stdin.on("data", onData);
  });
}

/** y/N on the terminal. Anything but an explicit yes is no. */
async function confirm(question: string): Promise<boolean> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = (await rl.question(`${question} [y/N] `)).trim().toLowerCase();
    return answer === "y" || answer === "yes";
  } finally {
    rl.close();
  }
}

/** Split what was asked for against what the vault already holds. */
export function partition(
  pairs: Pair[],
  existing: VaultEntry[],
): { creates: Pair[]; overwrites: Pair[] } {
  const held = new Set(existing.map((e) => e.name));
  return {
    creates: pairs.filter((p) => !held.has(p.name)),
    overwrites: pairs.filter((p) => held.has(p.name)),
  };
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
  create <secret-name>     create one entry, or a whole file of them

EXAMPLES
  $ voiceai secret list                            every secret and variable
  $ voiceai secret list --json | jq '.[].name'     scriptable
  $ voiceai secret get STRIPE_KEY                  one entry, all properties
  $ voiceai secret get STRIPE_KEY >/dev/null       exit 0 if present, 1 if not
  $ voiceai secret create STRIPE_KEY               prompts for the value
  $ voiceai secret create --secrets-file .env.local    one entry per KEY=VALUE
  $ voiceai secret create --secrets-file .env --overwrite   replace what exists

NOTES
  Secret names are matched exactly and are case-sensitive.

  Values are never displayed. Entries of kind \`secret\` cannot be read back at
  all; entries of kind \`variable\` could be, but this command redacts them too.
  Use \`has_value\` to tell whether an entry is populated.

  \`create\` reads the vault first and never overwrites silently. An entry that
  already exists is named and confirmed; \`--overwrite\` answers in advance, and
  a non-interactive run refuses rather than guessing.

  There is no \`--value\` flag. A value passed as an argument is recorded in
  shell history and visible in \`ps\`, so the value is prompted for without echo,
  or read from stdin when piped.
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

  cmd
    .command("create [secret-name]")
    .description("Create a vault entry, or every entry in a dotenv-style file")
    .option("--secrets-file <path>", "Create one entry per KEY=VALUE line in this file")
    .addOption(new Option("--kind <kind>", "Entry kind for anything created").choices(KINDS).default("secret"))
    .option("--overwrite", "Also replace the value of entries that already exist")
    .option("--json", "Output JSON")
    .action(async (name: string | undefined, opts) => {
      const kind: Kind = opts.kind;
      if (Boolean(name) === Boolean(opts.secretsFile)) {
        fail(opts.json, "give either a name or --secrets-file, not both and not neither.");
      }

      // --- what was asked for ---
      let pairs: Pair[];
      if (opts.secretsFile) {
        try {
          pairs = readSecretsFile(opts.secretsFile);
        } catch (e) {
          fail(opts.json, (e as Error).message);
        }
        if (!pairs.length) fail(opts.json, `${opts.secretsFile} defines no KEY=VALUE entries.`);
      } else {
        // Never from argv: it would land in shell history and in `ps`.
        pairs = [{ name: name!, value: await readValue(`Value for ${name}: `) }];
        if (!pairs[0]!.value) fail(opts.json, "aborted: no value provided.");
      }

      // --- what the vault already holds ---
      const spinner = spin("reading the vault");
      let existing: VaultEntry[];
      try {
        existing = await listSecrets();
      } catch (e) {
        spinner?.stop();
        fail(opts.json, (e as Error).message);
      }
      spinner?.stop();
      const { creates, overwrites } = partition(pairs, existing);

      // --- overwrites are never implicit ---
      if (overwrites.length && !opts.overwrite) {
        const names = overwrites.map((p) => p.name);
        const summary =
          `${names.length} entr${names.length === 1 ? "y" : "ies"} already ` +
          `${names.length === 1 ? "exists" : "exist"} and would be overwritten: ${names.join(", ")}`;
        if (opts.json || !process.stdin.isTTY) {
          fail(opts.json, `${summary}. re-run with --overwrite to replace them.`, {
            would_create: creates.map((p) => p.name),
            would_overwrite: names,
          });
        }
        process.stderr.write(`${summary}\n`);
        if (creates.length) {
          process.stderr.write(`${creates.length} would be created: ${creates.map((p) => p.name).join(", ")}\n`);
        }
        if (!(await confirm("replace the existing values?"))) {
          process.stderr.write("aborted. nothing was created or changed.\n");
          process.exit(1);
        }
      }

      // --- write ---
      const done: { name: string; action: "created" | "overwritten"; error?: string }[] = [];
      let failed = false;
      for (const p of [...creates, ...overwrites]) {
        const isNew = creates.includes(p);
        const res = isNew ? await createSecret(p.name, kind, p.value) : await updateSecret(p.name, p.value);
        if (res.ok) {
          done.push({ name: p.name, action: isNew ? "created" : "overwritten" });
        } else {
          failed = true;
          done.push({ name: p.name, action: isNew ? "created" : "overwritten", error: formatAgentsError(res) });
        }
      }

      if (opts.json) {
        console.log(JSON.stringify({ ok: !failed, secrets: done }, null, 2));
      } else {
        for (const d of done) {
          // Names only. No code path here prints a value.
          console.log(d.error ? `${d.name}\tFAILED\t${d.error}` : `${d.name}\t${d.action}`);
        }
      }
      if (failed) process.exit(1);
    });

  return cmd;
}
