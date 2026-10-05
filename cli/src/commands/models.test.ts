import { expect, test } from "bun:test";

// Action-level: the real CLI against a stub agents host, so the flags, the
// query sent upstream and the --json shape are all covered end to end.

const CLI_DIR = `${import.meta.dir}/../..`;

const catalog = {
  regions: [
    {
      region: "eu-central",
      languages: [
        {
          language: "en",
          tts_options: [
            {
              model_code: "slng/deepgram/aura:2-en",
              label: "Aura 2",
              service_type: "tts",
              region: "eu-central",
              language: "en",
              hosting_world_part_code: "eu-north",
              is_slng_hosted: true,
              provider_name: "Deepgram",
              voices: [{ voice_id: "aura-2-thalia-en", label: "Thalia" }],
            },
          ],
        },
      ],
    },
    {
      region: "us-east",
      languages: [
        {
          language: "en",
          tts_options: [
            {
              model_code: "cartesia/sonic:3",
              label: "Sonic 3",
              service_type: "tts",
              region: "us-east",
              language: "en",
              hosting_world_part_code: "us-east",
              voices: [{ voice_id: "v-1", label: "Brooke" }],
            },
          ],
        },
      ],
    },
  ],
};

async function runModels(args: string[], status = 200) {
  const queries: URLSearchParams[] = [];
  const server = Bun.serve({
    port: 0,
    fetch(req) {
      const url = new URL(req.url);
      if (url.pathname !== "/v1/agents/model-catalog") return new Response("unstubbed", { status: 500 });
      queries.push(url.searchParams);
      return Response.json(status === 200 ? catalog : { detail: "nope" }, { status });
    },
  });
  try {
    const proc = Bun.spawn(["bun", "run", "src/index.ts", "models", ...args], {
      cwd: CLI_DIR,
      env: { ...process.env, VOICEAI_AGENTS_BASE_URL: `http://localhost:${server.port}`, VOICEAI_API_KEY: "slng_test_key" },
      stdout: "pipe",
      stderr: "pipe",
    });
    const [stdout, stderr] = await Promise.all([new Response(proc.stdout).text(), new Response(proc.stderr).text()]);
    return { stdout, stderr, code: await proc.exited, queries };
  } finally {
    server.stop(true);
  }
}

test("list --type tts --region eu-north --json filters by hosting world part", async () => {
  const r = await runModels(["list", "--type", "tts", "--region", "eu-north", "--json"]);
  expect(r.code).toBe(0);
  const { data } = JSON.parse(r.stdout);
  expect(data).toEqual([
    {
      id: "slng/deepgram/aura:2-en",
      name: "Aura 2",
      type: "tts",
      provider: "Deepgram",
      slng_hosted: true,
      regions: [{ id: "eu-central", hosted_in: "eu-north", cross_region: false }],
      languages: ["en"],
      voices: [{ id: "aura-2-thalia-en", name: "Thalia", languages: ["en"] }],
    },
  ]);
  expect(r.queries[0]!.get("service_type")).toBe("tts");
  expect(r.queries[0]!.get("require_all_services")).toBe("false");
});

test("bare `models --tts` still works and lists by agent region", async () => {
  const r = await runModels(["--tts", "--region", "us-east"]);
  expect(r.code).toBe(0);
  expect(r.stdout).toContain("cartesia/sonic:3");
  expect(r.stdout).not.toContain("aura:2-en");
  expect(r.queries[0]!.get("service_type")).toBe("tts");
});

test("a failed catalog read exits 1 with the platform's error", async () => {
  const r = await runModels(["list", "--json"], 403);
  expect(r.code).toBe(1);
  expect(JSON.parse(r.stdout)).toMatchObject({ ok: false });
  expect(r.stdout).toContain("HTTP 403");
});

test("an unknown --type is rejected by the parser", async () => {
  const r = await runModels(["list", "--type", "video"]);
  expect(r.code).not.toBe(0);
  expect(r.stderr).toContain("video");
  expect(r.queries).toHaveLength(0);
});
