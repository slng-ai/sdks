import { test, expect, afterEach } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// An empty HOME, so no saved profile's baseUrl leaks into the probe.
process.env.HOME = mkdtempSync(join(tmpdir(), "voiceai-verify-"));
delete process.env.VOICEAI_BASE_URL;
delete process.env.VOICEAI_REGION;
const { GATEWAYS, resolveBaseUrl, verifyApiKey } = await import("./verify");
const { apiBaseUrl, REGIONS, gatewayUrl, regionOf } = await import("./config");

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
  delete process.env.VOICEAI_BASE_URL;
  delete process.env.VOICEAI_REGION;
  rmSync(join(process.env.HOME!, ".config"), { recursive: true, force: true });
});

/** Write a one-profile config file into the test HOME. */
function profile(fields: Record<string, string>): void {
  const dir = join(process.env.HOME!, ".config", "voiceai");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "config.json"), JSON.stringify({ currentProfile: "default", profiles: { default: fields } }));
}

/** Stub fetch: `answer` gives each host's status, or throws for a network error. */
function stub(answer: (host: string) => number): { hosts: string[] } {
  const hosts: string[] = [];
  globalThis.fetch = (async (url: URL | string) => {
    const host = new URL(String(url)).origin;
    hosts.push(host);
    const status = answer(host);
    return new Response(status === 200 ? JSON.stringify({ org_name: "Acme" }) : "{}", { status });
  }) as typeof fetch;
  return { hosts };
}

test("the gateway that answers 200 is chosen, and reused for the rest of the run", async () => {
  const winner = GATEWAYS[1]!;
  const { hosts } = stub((h) => (h === winner ? 200 : 401));

  const r = await verifyApiKey("key_one");
  expect(r.ok).toBe(true);
  expect(r.baseUrl).toBe(winner);
  expect(r.account?.org_name).toBe("Acme");
  expect(hosts.length).toBe(GATEWAYS.length);

  expect(await resolveBaseUrl("key_one")).toBe(winner);
  expect(hosts.length).toBe(GATEWAYS.length + 1);
});

test("a key every gateway refuses reports the status, not a network error", async () => {
  stub(() => 401);
  const r = await verifyApiKey("key_two");
  expect(r.ok).toBe(false);
  expect(r.status).toBe(401);
  await expect(resolveBaseUrl("key_two")).rejects.toThrow("no SLNG gateway accepts this key (status 401)");
});

test("no reachable gateway names VOICEAI_REGION", async () => {
  globalThis.fetch = (async () => {
    throw new Error("getaddrinfo ENOTFOUND");
  }) as unknown as typeof fetch;
  await expect(resolveBaseUrl("key_three")).rejects.toThrow("could not reach any SLNG gateway");
  await expect(resolveBaseUrl("key_three")).rejects.toThrow("VOICEAI_REGION");
});

test("VOICEAI_BASE_URL skips the probe", async () => {
  process.env.VOICEAI_BASE_URL = "http://localhost:9";
  const { hosts } = stub(() => 200);
  expect(await resolveBaseUrl("key_four")).toBe("http://localhost:9");
  expect(hosts).toEqual([]);
  await verifyApiKey("key_four");
  expect(hosts).toEqual(["http://localhost:9"]);
});

// --- choosing the region by name -------------------------------------------

test("VOICEAI_REGION picks that gateway with no probe", async () => {
  process.env.VOICEAI_REGION = "eu-west";
  const { hosts } = stub(() => 200);
  expect(await resolveBaseUrl("key_five")).toBe("https://eu-west.api.slng.ai");
  expect(hosts).toEqual([]);
});

test("the order is VOICEAI_BASE_URL, --region, VOICEAI_REGION, profile baseUrl, profile region", () => {
  profile({ region: "jp", baseUrl: "http://profile-base" });
  expect(apiBaseUrl()).toBe("http://profile-base");
  process.env.VOICEAI_REGION = "gb";
  expect(apiBaseUrl()).toBe("https://gb.api.slng.ai");
  expect(apiBaseUrl("au")).toBe("https://au.api.slng.ai");
  process.env.VOICEAI_BASE_URL = "http://localhost:9";
  expect(apiBaseUrl("au")).toBe("http://localhost:9");
  delete process.env.VOICEAI_BASE_URL;
  delete process.env.VOICEAI_REGION;
  profile({ region: "jp" });
  expect(apiBaseUrl()).toBe("https://jp.api.slng.ai");
});

test("an unknown region throws and names the valid ones", () => {
  process.env.VOICEAI_REGION = "mars";
  expect(() => apiBaseUrl()).toThrow('unknown region "mars". use one of: eu-north, eu-west');
});

test("an old profile region is ignored, so the key is found by probing", async () => {
  profile({ region: "us-east-1" });
  expect(apiBaseUrl()).toBeUndefined();
  const winner = GATEWAYS[3]!;
  stub((h) => (h === winner ? 200 : 401));
  expect(await resolveBaseUrl("key_six")).toBe(winner);
});

test("regionOf maps every gateway back to its code", () => {
  for (const r of REGIONS) expect(regionOf(gatewayUrl(r))).toBe(r);
  expect(regionOf("http://localhost:9")).toBeUndefined();
  expect(regionOf(undefined)).toBeUndefined();
});
