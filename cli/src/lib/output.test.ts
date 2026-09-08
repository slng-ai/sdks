import { test, expect, afterAll } from "bun:test";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// ---------------------------------------------------------------------------
// stdout must not be truncated at the pipe buffer.
//
// This has to run the COMPILED binary under a FOREIGN parent, because neither
// half is optional:
//
//   * `bun run src/index.ts` under Bun.spawn was already covered elsewhere and
//     passed for the whole life of the bug. Bun's own spawn hands the child a
//     socket rather than a 64KB pipe, so the short write never happens there.
//   * src/index.ts reads process.stdout.isTTY on every invocation, which makes
//     Bun set fd 1 O_NONBLOCK. A non-blocking write(2) to a *pipe* accepts one
//     pipe-buffer-full (65,536 bytes on macOS) and returns that count, so a
//     helper that ignores the return value drops everything after it — over a
//     pipe only. A `> file` redirect never short-writes, which is why the same
//     command looked complete when redirected.
//
// The invariant asserted is therefore: what a pipe delivers is byte-for-byte
// what a file redirect delivers, over a document comfortably larger than
// 65,536 bytes.
//
// Every spawn here is async, because the stub server shares this thread: a
// spawnSync would block the loop and the child's HTTP request would never be
// answered.
//
// Cost: one `bun build --compile` (a ~70MB binary in a temp dir) plus two runs
// of it. Measured at 0.8-1.0s in total on an M-series laptop.
// ---------------------------------------------------------------------------

const CLI_DIR = join(import.meta.dir, "..", "..");
const PIPE_BUF = 65_536;
const workDir = mkdtempSync(join(tmpdir(), "voiceai-output-test-"));

afterAll(() => rmSync(workDir, { recursive: true, force: true }));

/** A document whose pretty-printed form is several pipe buffers long. */
function bigServerDetail() {
  const tools = Array.from({ length: 900 }, (_, i) => ({
    name: `tool_${String(i).padStart(4, "0")}`,
    description: "Fetch one page and return its content. ".repeat(4),
    input_schema: { type: "object", required: ["url"], properties: { url: { type: "string" } } },
  }));
  return {
    id: "srv-1",
    organisation_id: "org-1",
    name: "big-mcp",
    transport: "http",
    capabilities: { tools, truncated: false },
    capability_status: "ok",
    capability_tool_count: tools.length,
  };
}

async function run(cmd: string[], env: Record<string, string>): Promise<void> {
  const proc = Bun.spawn(cmd, { env, stdout: "ignore", stderr: "pipe" });
  const [stderr, code] = await Promise.all([new Response(proc.stderr).text(), proc.exited]);
  expect(code, `${cmd[0]} failed: ${stderr}`).toBe(0);
}

test("a --json document larger than the pipe buffer survives a foreign parent's pipe", async () => {
  const bin = join(workDir, "voiceai");
  // cwd is the temp dir, not the repo: `bun build --compile` drops a
  // `.<hash>.bun-build` scratch file in whatever directory it runs from, and
  // cli/ does not gitignore those. The entry path is absolute, so module
  // resolution still walks up from src/ to cli/node_modules.
  const build = Bun.spawnSync(
    ["bun", "build", join(CLI_DIR, "src", "index.ts"), "--compile", "--outfile", bin],
    { cwd: workDir },
  );
  expect(build.exitCode, new TextDecoder().decode(build.stderr)).toBe(0);

  const detail = bigServerDetail();
  const server = Bun.serve({
    port: 0,
    fetch: () =>
      new Response(JSON.stringify(detail), { headers: { "content-type": "application/json" } }),
  });
  const env = {
    ...process.env,
    VOICEAI_AGENTS_BASE_URL: `http://127.0.0.1:${server.port}`,
    VOICEAI_API_KEY: "slng_test_key",
  } as Record<string, string>;
  const args = ["mcp", "get", "srv-1", "--id", "--json"];

  try {
    // Control: a regular-file fd, which is never short-written. A shell
    // redirect, so fd 1 really is the file and not something Bun owns.
    const controlPath = join(workDir, "control.json");
    await run(["sh", "-c", `'${bin}' ${args.join(" ")} > '${controlPath}'`], env);
    const expected = readFileSync(controlPath);
    expect(expected.byteLength).toBeGreaterThan(3 * PIPE_BUF);

    // The real test: the same command with fd 1 on a pipe owned by a parent
    // that is not Bun.
    const pipedPath = join(workDir, "piped.json");
    const node = Bun.which("node");
    if (node) {
      // node's execFileSync is the shape oven-sh/bun#28145 was filed against.
      const script = `
        const { execFileSync } = require("node:child_process");
        const { writeFileSync } = require("node:fs");
        const out = execFileSync(process.env.VOICEAI_BIN, ${JSON.stringify(args)}, {
          maxBuffer: 256 * 1024 * 1024,
          stdio: ["ignore", "pipe", "ignore"],
        });
        writeFileSync(process.env.VOICEAI_DEST, out);
      `;
      await run([node, "-e", script], { ...env, VOICEAI_BIN: bin, VOICEAI_DEST: pipedPath });
    } else {
      // Weaker, but still a genuine 64KB pipe: the shell builds it, and `cat`
      // (not the binary under test) is what writes the file. Bun's own
      // child_process/spawn cannot stand in here — it hands the child a
      // socket, so it does not reproduce the short write at all.
      await run(["sh", "-c", `'${bin}' ${args.join(" ")} | cat > '${pipedPath}'`], env);
    }

    const piped = readFileSync(pipedPath);
    expect(piped.byteLength).toBe(expected.byteLength);
    expect(Buffer.compare(piped, expected)).toBe(0);
    // Parses, i.e. it is not cut off mid-token.
    const parsed = JSON.parse(piped.toString("utf8"));
    expect(parsed.capabilities.tools.length).toBe(detail.capabilities.tools.length);
  } finally {
    server.stop(true);
  }
}, 60_000);
