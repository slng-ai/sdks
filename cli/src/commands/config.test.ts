import { expect, test } from "bun:test";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Action-level: the real CLI with its own empty HOME per run.

const CLI_DIR = `${import.meta.dir}/../..`;

async function run(args: string[], env: Record<string, string> = {}, command = "config") {
  const home = mkdtempSync(join(tmpdir(), "voiceai-config-cmd-"));
  const proc = Bun.spawn(["bun", "run", "src/index.ts", command, ...args], {
    cwd: CLI_DIR,
    env: { ...process.env, HOME: home, XDG_CONFIG_HOME: home, VOICEAI_REGION: "", ...env },
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr] = await Promise.all([new Response(proc.stdout).text(), new Response(proc.stderr).text()]);
  return { stdout, stderr, code: await proc.exited, home };
}

test("config set region saves a valid region", async () => {
  const r = await run(["set", "region", "eu-west"]);
  expect(r.code).toBe(0);
  const file = JSON.parse(readFileSync(join(r.home, ".config", "voiceai", "config.json"), "utf8"));
  expect(file.profiles.default.region).toBe("eu-west");
});

test("config set region refuses an unknown code and lists the valid ones", async () => {
  const r = await run(["set", "region", "mars"]);
  expect(r.code).toBe(1);
  expect(r.stderr).toContain('unknown region "mars". use one of: eu-north, eu-west');
});

test("config set worldPart points to region", async () => {
  const r = await run(["set", "worldPart", "eu"]);
  expect(r.code).toBe(1);
  expect(r.stderr).toContain('world part is now "region"');
});

test("an unknown VOICEAI_REGION is one clean error line, not a stack trace", async () => {
  const r = await run([], { VOICEAI_REGION: "mars", VOICEAI_API_KEY: "slng_test_key", VOICEAI_BASE_URL: "" }, "whoami");
  expect(r.code).toBe(1);
  expect(r.stderr.trim()).toBe(
    'error: unknown region "mars". use one of: eu-north, eu-west, us-east, us-west, au, br, gb, id, il, in, jp, sg, za',
  );
});
