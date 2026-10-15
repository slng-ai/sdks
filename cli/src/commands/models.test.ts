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

async function runModels(args: string[], status = 200, command = "models", stdin?: string) {
  const queries: URLSearchParams[] = [];
  const writes: string[] = [];
  const server = Bun.serve({
    port: 0,
    fetch(req) {
      const url = new URL(req.url);
      if (req.method !== "GET") {
        writes.push(`${req.method} ${url.pathname}`);
        return Response.json({ id: "agent-1" }, { status: 201 });
      }
      if (url.pathname === "/v1/agents/client-models") return Response.json({ items: [{ model_name: "my-own-llm" }] });
      if (url.pathname !== "/v1/agents/model-catalog") return new Response("unstubbed", { status: 500 });
      queries.push(url.searchParams);
      return Response.json(status === 200 ? catalog : { detail: "nope" }, { status });
    },
  });
  try {
    const proc = Bun.spawn(["bun", "run", "src/index.ts", ...command.split(" "), ...args], {
      cwd: CLI_DIR,
      env: { ...process.env, VOICEAI_AGENTS_BASE_URL: `http://localhost:${server.port}`, VOICEAI_API_KEY: "slng_test_key" },
      stdin: stdin === undefined ? "ignore" : new TextEncoder().encode(stdin),
      stdout: "pipe",
      stderr: "pipe",
    });
    const [stdout, stderr] = await Promise.all([new Response(proc.stdout).text(), new Response(proc.stderr).text()]);
    return { stdout, stderr, code: await proc.exited, queries, writes };
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

// --- voices: the same live catalog ------------------------------------------

test("voices --model lists the live catalog's voices for that model", async () => {
  const r = await runModels(["--model", "cartesia/sonic:3", "--json"], 200, "voices");
  expect(r.code).toBe(0);
  expect(JSON.parse(r.stdout)).toEqual([{ id: "v-1", name: "Brooke", languages: ["en"] }]);
  expect(r.queries[0]!.get("service_type")).toBe("tts");
});

test("voices --region filters out a model not offered there", async () => {
  const r = await runModels(["--model", "cartesia/sonic:3", "--region", "eu-central"], 200, "voices");
  expect(r.code).toBe(1);
  expect(r.stderr).toContain("no voices for cartesia/sonic:3 in eu-central");
});

// --- agents create / replace: checked before anything is sent -----------------

const body = (over: Record<string, unknown>) =>
  JSON.stringify({
    name: "a",
    region: "eu-central",
    language: "en",
    models: { tts: "slng/deepgram/aura:2-en", tts_voice: "aura-2-thalia-en", ...over },
  });

test("agents create refuses a voice the catalog does not offer, and sends nothing", async () => {
  const r = await runModels(["--file", "-"], 200, "agents create", body({ tts_voice: "thalia" }));
  expect(r.code).toBe(1);
  expect(r.stderr).toContain('models.tts_voice "thalia"');
  expect(r.stderr).toContain("voiceai models list --region eu-central --language en");
  expect(r.writes).toEqual([]);
});

test("agents create refuses an unknown region, and sends nothing", async () => {
  const r = await runModels(["--file", "-"], 200, "agents create", JSON.stringify({ region: "mars-1", language: "en", models: { tts: "x" } }));
  expect(r.code).toBe(1);
  expect(r.stderr).toContain('region "mars-1"');
  expect(r.writes).toEqual([]);
});

test("agents create accepts a BYOK LLM and a valid voice", async () => {
  const r = await runModels(["--file", "-", "--json"], 200, "agents create", body({ llm: "my-own-llm" }));
  expect(r.stderr).not.toContain("not available");
  expect(r.code).toBe(0);
  expect(r.writes).toEqual(["POST /v1/agents"]);
});

test("agents replace is checked too", async () => {
  const r = await runModels(["agent-1", "--file", "-"], 200, "agents replace", body({ tts: "nope/model" }));
  expect(r.code).toBe(1);
  expect(r.writes).toEqual([]);
});

test("an unreadable catalog warns and lets the platform decide", async () => {
  const r = await runModels(["--file", "-", "--json"], 503, "agents create", body({}));
  expect(r.stderr).toContain("could not check models against the catalog");
  expect(r.writes).toEqual(["POST /v1/agents"]);
});
