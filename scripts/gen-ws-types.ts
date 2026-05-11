#!/usr/bin/env bun
// Extract WebSocket message payloads from the AsyncAPI spec and emit typed
// definitions for TypeScript and Python via quicktype.
//
// Why this exists: Stainless emits HTTP-only clients. Streaming uses the
// AsyncAPI doc as the source of truth. quicktype turns each message payload
// into idiomatic types in both languages.

import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parse } from "yaml";

const REPO_ROOT = new URL("..", import.meta.url).pathname;
const ASYNCAPI = join(REPO_ROOT, "specs/bridges-unmute/bridges-unmute.asyncapi.yaml");
const TS_OUT = join(REPO_ROOT, "streaming/ts/messages.ts");
const PY_OUT = join(REPO_ROOT, "streaming/python/messages.py");

const file = await Bun.file(ASYNCAPI).text();
const doc = parse(file) as {
  components?: {
    messages?: Record<string, { payload?: unknown }>;
    schemas?: Record<string, unknown>;
  };
};

const messages = doc.components?.messages ?? {};
const componentSchemas = doc.components?.schemas ?? {};
const messageNames = Object.keys(messages);
if (messageNames.length === 0) {
  console.error(`error: no components.messages in ${ASYNCAPI}`);
  process.exit(1);
}

// Build a JSON Schema with one $defs entry per message payload and a top-level
// oneOf union so quicktype emits a discriminated union keyed by the `type` field.
// Preserve `components.schemas` at the same path used by $refs in the spec.
const schema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "UnmuteWsMessage",
  oneOf: messageNames.map((n) => ({ $ref: `#/$defs/${n}` })),
  $defs: Object.fromEntries(
    messageNames.map((n) => [n, { title: n, ...(messages[n]!.payload as object) }]),
  ),
  components: { schemas: componentSchemas },
};

const tmp = join(tmpdir(), `slng-ws-schema-${Date.now()}.json`);
writeFileSync(tmp, JSON.stringify(schema, null, 2));

mkdirSync(new URL("../streaming/ts/", import.meta.url).pathname, { recursive: true });
mkdirSync(new URL("../streaming/python/", import.meta.url).pathname, { recursive: true });

const header =
  "// AUTO-GENERATED from specs/bridges-unmute/bridges-unmute.asyncapi.yaml\n" +
  "// Do not edit by hand. Run `bun run gen-ws-types` to regenerate.\n";

const pyHeader =
  "# AUTO-GENERATED from specs/bridges-unmute/bridges-unmute.asyncapi.yaml\n" +
  "# Do not edit by hand. Run `bun run gen-ws-types` to regenerate.\n";

async function run(args: string[]): Promise<string> {
  const proc = Bun.spawn(["bunx", "quicktype", ...args], {
    stdout: "pipe",
    stderr: "inherit",
  });
  const out = await new Response(proc.stdout).text();
  const code = await proc.exited;
  if (code !== 0) throw new Error(`quicktype failed (exit ${code})`);
  return out;
}

console.log("generating TypeScript messages...");
const ts = await run([
  "--src-lang", "schema",
  "--lang", "typescript",
  "--just-types",
  "--top-level", "UnmuteWsMessage",
  "--prefer-unions",
  tmp,
]);
writeFileSync(TS_OUT, header + "\n" + ts);

console.log("generating Python messages...");
const py = await run([
  "--src-lang", "schema",
  "--lang", "python",
  "--python-version", "3.7",
  "--just-types",
  "--top-level", "UnmuteWsMessage",
  tmp,
]);
writeFileSync(PY_OUT, pyHeader + "\n" + py);

rmSync(tmp);
console.log(`wrote ${TS_OUT}`);
console.log(`wrote ${PY_OUT}`);
