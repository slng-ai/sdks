import { test, expect, afterEach } from "bun:test";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// An empty HOME, so no saved profile's baseUrl leaks into the probe.
process.env.HOME = mkdtempSync(join(tmpdir(), "voiceai-verify-"));
delete process.env.VOICEAI_BASE_URL;
const { GATEWAYS, resolveBaseUrl, verifyApiKey } = await import("./verify");

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
  delete process.env.VOICEAI_BASE_URL;
});

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

test("no reachable gateway names VOICEAI_BASE_URL", async () => {
  globalThis.fetch = (async () => {
    throw new Error("getaddrinfo ENOTFOUND");
  }) as unknown as typeof fetch;
  await expect(resolveBaseUrl("key_three")).rejects.toThrow("could not reach any SLNG gateway");
  await expect(resolveBaseUrl("key_three")).rejects.toThrow("VOICEAI_BASE_URL");
});

test("VOICEAI_BASE_URL skips the probe", async () => {
  process.env.VOICEAI_BASE_URL = "http://localhost:9";
  const { hosts } = stub(() => 200);
  expect(await resolveBaseUrl("key_four")).toBe("http://localhost:9");
  expect(hosts).toEqual([]);
  await verifyApiKey("key_four");
  expect(hosts).toEqual(["http://localhost:9"]);
});
