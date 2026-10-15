// Lightweight API-key probe against GET /v1/me. Used by `whoami`, `login`, and
// the TUI key-entry screens so the validation logic stays in one place.
//
// It also finds the main-API host. There is no global host any more: a key
// works only at its own region's gateway, and the others answer 401. So with
// no base URL or region chosen (see apiBaseUrl), the probe asks every
// region's gateway and keeps the one that answers 200.

import { apiBaseUrl, gatewayUrl, REGIONS } from "./config";

export const GATEWAYS = REGIONS.map(gatewayUrl);

const PROBE_TIMEOUT_MS = 10_000;

// Shape of GET /v1/me — see specs/account/account.oas.json.
export interface Account {
  name?: string;
  email?: string;
  org_id?: string;
  org_name?: string;
  api_key_label?: string;
  tier?: string;
}

export interface VerifyResult {
  ok: boolean; // true iff HTTP 200
  status?: number; // HTTP status; undefined on network error
  account?: Account; // present iff ok
  error?: string; // network error message
  body?: string; // response text snippet for unexpected non-200s
  baseUrl?: string; // the host that answered
}

/** The gateway found for a key in this process, so one run probes once. */
let found: { apiKey: string; baseUrl: string } | undefined;

/**
 * Probe `GET {base}/v1/me` with the given key. No TTS/STT credits used.
 * `baseUrl` falls back to the chosen base URL or region (apiBaseUrl). With
 * neither, every gateway is probed and the first 200 wins. Otherwise the result is the most
 * telling failure: an HTTP status before a network error.
 * The gateway returns 401 for a malformed key; /v1/me itself returns 403.
 */
export async function verifyApiKey(apiKey: string, baseUrl?: string): Promise<VerifyResult> {
  const base = baseUrl ?? apiBaseUrl() ?? (found?.apiKey === apiKey ? found.baseUrl : undefined);
  if (base) return probe(apiKey, base);

  const probes = GATEWAYS.map((g) => probe(apiKey, g));
  const ok = await Promise.any(probes.map((p) => p.then((r) => (r.ok ? r : Promise.reject(r))))).catch(
    () => undefined,
  );
  if (ok) {
    found = { apiKey, baseUrl: ok.baseUrl! };
    return ok;
  }
  const results = await Promise.all(probes);
  return results.find((r) => r.status !== undefined) ?? results[0]!;
}

/**
 * The main-API host for this key: the chosen one (`region` is a --region
 * flag), or the gateway that accepts it. Throws a message the user can act
 * on when none does.
 */
export async function resolveBaseUrl(apiKey: string, region?: string): Promise<string> {
  const configured = apiBaseUrl(region);
  if (configured) return configured;
  const r = await verifyApiKey(apiKey);
  if (r.ok && r.baseUrl) return r.baseUrl;
  if (r.status === undefined) {
    throw new Error(
      `could not reach any SLNG gateway (${r.error}). check your connection, or set VOICEAI_REGION (e.g. eu-west).`,
    );
  }
  throw new Error(
    `no SLNG gateway accepts this key (status ${r.status}). check the key, or set VOICEAI_REGION (e.g. eu-west).`,
  );
}

async function probe(apiKey: string, base: string): Promise<VerifyResult> {
  let res: Response;
  try {
    res = await fetch(`${base}/v1/me`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
    });
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err), baseUrl: base };
  }

  if (res.status === 200) {
    let account: Account = {};
    try {
      const body = (await res.json()) as unknown;
      if (body && typeof body === "object") account = body as Account;
    } catch {
      // body not JSON or unexpected shape — auth still succeeded
    }
    return { ok: true, status: 200, account, baseUrl: base };
  }

  let body: string | undefined;
  try {
    body = (await res.text()).slice(0, 200);
  } catch {
    // ignore
  }
  return { ok: false, status: res.status, body, baseUrl: base };
}
