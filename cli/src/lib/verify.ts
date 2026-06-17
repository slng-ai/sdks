// Lightweight API-key probe against GET /v1/me. Used by `whoami`, `login`, and
// the TUI key-entry screens so the validation logic stays in one place.

import { load } from "./config";

export const DEFAULT_BASE_URL = "https://api.slng.ai";

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
}

/**
 * Probe `GET {base}/v1/me` with the given key. No TTS/STT credits used.
 * `baseUrl` falls back to the active profile's baseUrl, then production.
 * The gateway returns 401 for a malformed key; /v1/me itself returns 403.
 */
export async function verifyApiKey(apiKey: string, baseUrl?: string): Promise<VerifyResult> {
  const base = baseUrl ?? load().baseUrl ?? DEFAULT_BASE_URL;

  let res: Response;
  try {
    res = await fetch(`${base}/v1/me`, { headers: { Authorization: `Bearer ${apiKey}` } });
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }

  if (res.status === 200) {
    let account: Account = {};
    try {
      const body = (await res.json()) as unknown;
      if (body && typeof body === "object") account = body as Account;
    } catch {
      // body not JSON or unexpected shape — auth still succeeded
    }
    return { ok: true, status: 200, account };
  }

  let body: string | undefined;
  try {
    body = (await res.text()).slice(0, 200);
  } catch {
    // ignore
  }
  return { ok: false, status: res.status, body };
}
