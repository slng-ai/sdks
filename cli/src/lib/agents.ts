// Thin REST client for the Voice Agents API (https://api.agents.slng.ai).
// Raw fetch, no SDK dependency — same approach as verify.ts for /v1/me, so the
// CLI ships independently of the generated SDK's publish cycle.

import { load, requireApiKey } from "./config";

export const DEFAULT_AGENTS_BASE_URL = "https://api.agents.slng.ai";

export interface AgentsRequestOptions {
  query?: Record<string, string | number | undefined>;
  body?: unknown;
}

export interface AgentsResult<T = unknown> {
  ok: boolean; // true for 2xx
  status?: number; // HTTP status; undefined on network error
  data?: T; // parsed JSON body (if any)
  error?: string; // network error message
}

/** Resolve the agents host: profile/env override, else production. */
export function agentsBaseUrl(): string {
  return load().agentsBaseUrl ?? DEFAULT_AGENTS_BASE_URL;
}

/**
 * Call the agents API with the active profile's key. Returns a structured
 * result; callers decide how to render success vs failure.
 */
export async function agentsRequest<T = unknown>(
  method: string,
  path: string,
  opts: AgentsRequestOptions = {},
): Promise<AgentsResult<T>> {
  const apiKey = requireApiKey();
  const url = new URL(`${agentsBaseUrl()}${path}`);
  for (const [k, v] of Object.entries(opts.query ?? {})) {
    if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
  }

  const headers: Record<string, string> = { Authorization: `Bearer ${apiKey}` };
  let payload: string | undefined;
  if (opts.body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(opts.body);
  }

  let res: Response;
  try {
    res = await fetch(url, { method, headers, body: payload });
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }

  let data: T | undefined;
  const text = await res.text().catch(() => "");
  if (text) {
    try {
      data = JSON.parse(text) as T;
    } catch {
      data = text as unknown as T; // non-JSON body (rare)
    }
  }

  return { ok: res.status >= 200 && res.status < 300, status: res.status, data };
}

/**
 * Human-readable one-liner for a failed AgentsResult. Pulls the API's error
 * message and request id when present (shape: { error, slng_request_id }).
 */
export function formatAgentsError(result: AgentsResult): string {
  if (result.error) return result.error;
  const bits: string[] = [];
  if (result.status) bits.push(`HTTP ${result.status}`);
  const d = result.data as Record<string, unknown> | string | undefined;
  if (typeof d === "string" && d) {
    bits.push(d);
  } else if (d && typeof d === "object") {
    const msg = d.error ?? d.message ?? d.detail;
    if (msg) bits.push(typeof msg === "string" ? msg : JSON.stringify(msg));
    const reqId = d.slng_request_id ?? d.request_id;
    if (reqId) bits.push(`slng_request_id=${String(reqId)}`);
  }
  return bits.length ? bits.join(" · ") : "request failed";
}
