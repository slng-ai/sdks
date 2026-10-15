import { afterEach, beforeEach, expect, test } from "bun:test";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// An empty HOME, so no saved profile's region or base URL leaks in.
process.env.HOME = mkdtempSync(join(tmpdir(), "voiceai-catalog-"));
delete process.env.VOICEAI_REGION;
const { listModels, listMyModels, resetCatalog, voicesFor } = await import("./catalog");
const { resolveVoice } = await import("./voice-resolve");

const STUB = "http://catalog.stub";
const realFetch = globalThis.fetch;

const fish = { code: "slng/fish/tts:s2.1-pro", served_regions: ["eu-west", "gb"], languages: ["en"] };
const aura = { code: "slng/deepgram/aura:2-en", served_regions: ["us-east"], languages: ["en"] };
const voices = [
  { voice_id: "8634", name: "Abel", gender: "masculine", language: "en", preview_url: "https://x/abel.wav" },
  { voice_id: "3235", name: "Emma", language: "de" },
  { voice_id: "9999", name: "Emmanuel", language: "fr" },
  { voice_id: "0000", name: "Hidden", enabled: false },
];

/** Stub fetch: `answer` maps a path+query to a JSON body, or a number for an error status. */
function stub(answer: (path: string) => unknown): string[] {
  const calls: string[] = [];
  globalThis.fetch = (async (url: URL | string) => {
    const u = new URL(String(url));
    calls.push(`${u.origin}${u.pathname}${u.search}`);
    const body = answer(`${u.pathname}${u.search}`);
    if (typeof body === "number") return new Response("{}", { status: body, statusText: "Server Error" });
    return new Response(JSON.stringify(body));
  }) as typeof fetch;
  return calls;
}

beforeEach(() => {
  process.env.VOICEAI_BASE_URL = STUB;
  resetCatalog();
});
afterEach(() => {
  globalThis.fetch = realFetch;
  delete process.env.VOICEAI_BASE_URL;
  delete process.env.VOICEAI_API_KEY;
  delete process.env.VOICEAI_REGION;
});

test("a region keeps only the models its gateway serves, and the list is read once", async () => {
  const calls = stub(() => ({ items: [aura, fish] }));
  expect((await listModels("tts", "eu-west")).map((m) => m.id)).toEqual([fish.code]);
  expect((await listModels("tts", "us-east")).map((m) => m.id)).toEqual([aura.code]);
  expect((await listModels("tts")).map((m) => m.id)).toEqual([aura.code, fish.code]);
  expect(calls).toEqual([`${STUB}/v1/catalog/models?service_type=tts&page=1&page_size=100`]);
});

test("paging continues while a page is full", async () => {
  const full = Array.from({ length: 100 }, (_, i) => ({ code: `p/m:${i}`, served_regions: [] }));
  const calls = stub((p) => ({ items: p.includes("page=1&") ? full : [fish] }));
  expect(await listModels("stt")).toHaveLength(101);
  expect(calls).toHaveLength(2);
});

test("listMyModels filters to the key's region", async () => {
  process.env.VOICEAI_API_KEY = "slng_test_key";
  delete process.env.VOICEAI_BASE_URL;
  process.env.VOICEAI_REGION = "eu-west";
  stub(() => ({ items: [aura, fish] }));
  const r = await listMyModels("tts");
  expect(r.region).toBe("eu-west");
  expect(r.models.map((m) => m.id)).toEqual([fish.code]);
});

test("voicesFor drops disabled voices and keeps the sample URL", async () => {
  const calls = stub(() => ({ ...fish, voices }));
  const v = await voicesFor(fish.code);
  expect(v.map((x) => x.voiceId)).toEqual(["8634", "3235", "9999"]);
  expect(v[0]).toEqual({ voiceId: "8634", name: "Abel", gender: "masculine", language: "en", sampleUrl: "https://x/abel.wav" });
  await voicesFor(fish.code);
  expect(calls).toEqual([`${STUB}/v1/catalog/models/slng/fish/tts:s2.1-pro`]);
});

test("a failed read is one line, and is retried on the next call", async () => {
  stub(() => 500);
  await expect(listModels("tts")).rejects.toThrow("could not read the model catalog: 500 Server Error");
  stub(() => ({ items: [fish] }));
  expect(await listModels("tts")).toHaveLength(1);
});

test("resolveVoice: id, unique name, ambiguous name, and pass-through", async () => {
  stub(() => ({ ...fish, voices }));
  expect(await resolveVoice(fish.code, "3235")).toMatchObject({ ok: true, voiceId: "3235" });
  expect(await resolveVoice(fish.code, "abel")).toMatchObject({ ok: true, voiceId: "8634" });
  const amb = await resolveVoice(fish.code, "emm");
  expect(amb.ok).toBe(false);
  expect(amb.candidates?.map((c) => c.voiceId)).toEqual(["3235", "9999"]);
  expect(await resolveVoice(fish.code, "my-clone")).toMatchObject({ ok: true, voiceId: "my-clone" });

  resetCatalog();
  stub(() => 503);
  expect(await resolveVoice(fish.code, "abel")).toEqual({ ok: true, voiceId: "abel" });
});
