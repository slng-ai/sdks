import { expect, test } from "bun:test";
import { checkAgentModels, flattenCatalog, type CatalogOption, type ModelCatalog } from "./model-catalog";
import { filterModels } from "../commands/models";

function opt(type: "stt" | "tts" | "llm", code: string, region: string, extra: Partial<CatalogOption> = {}): CatalogOption {
  return { model_code: code, label: code, service_type: type, region, language: "en", ...extra };
}

const thalia = { voice_id: "aura-2-thalia-en", label: "Thalia" };
const orion = { voice_id: "aura-2-orion-en", label: "Orion" };

const CATALOG: ModelCatalog = {
  default_region: "eu-central",
  regions: [
    {
      region: "eu-central",
      languages: [
        {
          language: "en",
          stt_options: [opt("stt", "slng/deepgram/nova:3-en", "eu-central", { hosting_world_part_code: "eu-north", is_slng_hosted: true })],
          tts_options: [opt("tts", "slng/deepgram/aura:2-en", "eu-central", { voices: [thalia, orion], hosting_world_part_code: "eu-north" })],
          llm_options: [opt("llm", "groq/openai/gpt-oss-120b", "eu-central")],
        },
      ],
    },
    {
      region: "us-east",
      languages: [
        {
          language: "en",
          stt_options: [opt("stt", "deepgram/nova:3", "us-east", { hosting_world_part_code: "us-east" })],
          tts_options: [opt("tts", "slng/deepgram/aura:2-en", "us-east", { voices: [thalia] })],
          llm_options: [opt("llm", "groq/openai/gpt-oss-120b", "us-east")],
        },
      ],
    },
  ],
};

const GOOD = {
  stt: "slng/deepgram/nova:3-en",
  llm: "groq/openai/gpt-oss-120b",
  tts: "slng/deepgram/aura:2-en",
  tts_voice: "aura-2-orion-en",
};

test("a valid agent has no problems", () => {
  expect(checkAgentModels({ region: "eu-central", language: "en", models: GOOD }, CATALOG)).toEqual([]);
});

test("no models declared means nothing to check", () => {
  expect(checkAgentModels({ region: "eu-central", language: "en" }, CATALOG)).toEqual([]);
});

test("a model offered only in another region is named, with what this region offers", () => {
  const p = checkAgentModels({ region: "eu-central", language: "en", models: { ...GOOD, stt: "deepgram/nova:3" } }, CATALOG);
  expect(p).toHaveLength(1);
  expect(p[0]!.path).toBe("models.stt");
  expect(p[0]!.message).toContain("eu-central/en");
  expect(p[0]!.message).toContain("slng/deepgram/nova:3-en");
});

test("a voice the model does not have in that region is named", () => {
  const p = checkAgentModels({ region: "us-east", language: "en", models: { ...GOOD, stt: "deepgram/nova:3" } }, CATALOG);
  expect(p.map((x) => x.path)).toEqual(["models.tts_voice"]);
  expect(p[0]!.message).toContain("aura-2-thalia-en");
});

test("region any matches a model offered in any region", () => {
  const models = { ...GOOD, stt: "deepgram/nova:3" };
  expect(checkAgentModels({ region: "any", language: "en", models }, CATALOG)).toEqual([]);
  expect(checkAgentModels({ language: "en", models }, CATALOG)).toEqual([]);
});

test("fallbacks are checked with the platform's paths", () => {
  const models = {
    ...GOOD,
    fallbacks: { stt: ["nope/stt"], llm: ["nope/llm"], tts: [{ model: "slng/deepgram/aura:2-en", voice: "nope" }] },
  };
  const p = checkAgentModels({ region: "eu-central", language: "en", models }, CATALOG);
  expect(p.map((x) => x.path)).toEqual(["models.fallbacks.stt[0]", "models.fallbacks.llm[0]", "models.fallbacks.tts[0].voice"]);
});

test("an LLM that is one of the org's BYOK models is accepted", () => {
  const models = { ...GOOD, llm: "my-own-llm" };
  expect(checkAgentModels({ region: "eu-central", language: "en", models }, CATALOG)).toHaveLength(1);
  expect(checkAgentModels({ region: "eu-central", language: "en", models }, CATALOG, new Set(["my-own-llm"]))).toEqual([]);
});

test("an unknown region or language is one problem, not one per model", () => {
  const r = checkAgentModels({ region: "mars", language: "en", models: GOOD }, CATALOG);
  expect(r.map((x) => x.path)).toEqual(["region"]);
  expect(r[0]!.message).toContain("eu-central");
  const l = checkAgentModels({ region: "eu-central", language: "xx", models: GOOD }, CATALOG);
  expect(l.map((x) => x.path)).toEqual(["language"]);
});

test("flatten merges a model's regions and voices into one entry", () => {
  const flat = flattenCatalog(CATALOG);
  expect(flat.map((m) => `${m.type} ${m.id}`)).toEqual([
    "stt deepgram/nova:3",
    "stt slng/deepgram/nova:3-en",
    "tts slng/deepgram/aura:2-en",
    "llm groq/openai/gpt-oss-120b",
  ]);
  const aura = flat.find((m) => m.type === "tts")!;
  expect(aura.regions.map((r) => r.id)).toEqual(["eu-central", "us-east"]);
  expect(aura.voices!.map((v) => v.id)).toEqual(["aura-2-thalia-en", "aura-2-orion-en"]);
  expect(flat.find((m) => m.type === "stt")!.voices).toBeUndefined();
});

test("--region matches an agent region or a hosting world part", () => {
  const flat = flattenCatalog(CATALOG);
  expect(filterModels(flat, { region: "eu-north" }).map((m) => m.id)).toEqual([
    "slng/deepgram/nova:3-en",
    "slng/deepgram/aura:2-en",
  ]);
  expect(filterModels(flat, { region: "us-east", type: "stt" }).map((m) => m.id)).toEqual(["deepgram/nova:3"]);
});
