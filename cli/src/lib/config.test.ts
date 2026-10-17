import { test, expect, afterEach } from "bun:test";

// The env always wins over a saved profile, so these hold whatever profile exists.
const { load } = await import("./config");

// Other test files set VOICEAI_API_KEY at load time, so restore, don't delete.
const saved = { VOICEAI_API_KEY: process.env.VOICEAI_API_KEY, SLNG_API_KEY: process.env.SLNG_API_KEY };
afterEach(() => {
  for (const [k, v] of Object.entries(saved)) {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
});

test("SLNG_API_KEY alone is used", () => {
  delete process.env.VOICEAI_API_KEY;
  process.env.SLNG_API_KEY = "slng_only";
  expect(load().apiKey).toBe("slng_only");
});

test("VOICEAI_API_KEY wins over SLNG_API_KEY", () => {
  process.env.SLNG_API_KEY = "slng_key";
  process.env.VOICEAI_API_KEY = "voiceai_key";
  expect(load().apiKey).toBe("voiceai_key");
});

test("resolveProjectId: --project wins over SLNG_PROJECT_ID, unset gives undefined", async () => {
  const { resolveProjectId } = await import("./config");
  const before = process.env.SLNG_PROJECT_ID;
  try {
    delete process.env.SLNG_PROJECT_ID;
    expect(resolveProjectId()).toBeUndefined();
    process.env.SLNG_PROJECT_ID = "env-project";
    expect(resolveProjectId()).toBe("env-project");
    expect(resolveProjectId("flag-project")).toBe("flag-project");
  } finally {
    if (before === undefined) delete process.env.SLNG_PROJECT_ID;
    else process.env.SLNG_PROJECT_ID = before;
  }
});
