// Thin REST client for the Voice Agents API (https://api.agents.slng.ai).
// Raw fetch, no SDK dependency — same approach as verify.ts for /v1/me, so the
// CLI ships independently of the generated SDK's publish cycle.

import { load, requireApiKey } from "./config";

export const DEFAULT_AGENTS_BASE_URL = "https://api.agents.slng.ai";

export interface AgentsRequestOptions {
  // An array value is repeated (?k=a&k=b); the tools list filters that way.
  query?: Record<string, string | number | string[] | undefined>;
  body?: unknown;
}

export interface AgentsResult<T = unknown> {
  ok: boolean; // true for 2xx
  status?: number; // HTTP status; undefined on network error
  data?: T; // parsed JSON body (if any)
  error?: string; // network error message
  retryAfter?: string; // Retry-After header, present on a real 429
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
    if (Array.isArray(v)) {
      for (const one of v) if (one !== "") url.searchParams.append(k, String(one));
    } else if (v !== undefined && v !== "") {
      url.searchParams.set(k, String(v));
    }
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

  return {
    ok: res.status >= 200 && res.status < 300,
    status: res.status,
    data,
    retryAfter: res.headers.get("retry-after") ?? undefined,
  };
}

/**
 * Human-readable one-liner for a failed AgentsResult. Handles both error
 * shapes the platform emits: the flat { error, slng_request_id } of the agents
 * routes, and the nested { detail, error: { code, message, request_id } } of
 * the shared-resource routes.
 */
export function formatAgentsError(result: AgentsResult): string {
  if (result.error) return result.error;
  const bits: string[] = [];
  if (result.status) bits.push(`HTTP ${result.status}`);
  const d = result.data as Record<string, unknown> | string | undefined;
  if (typeof d === "string" && d) {
    bits.push(d);
  } else if (d && typeof d === "object") {
    // Nested envelope wins when present — it carries the machine-readable code.
    const nested = (typeof d.error === "object" && d.error !== null ? d.error : undefined) as
      | Record<string, unknown>
      | undefined;
    const msg = nested?.message ?? d.error ?? d.message ?? d.detail;
    if (msg) bits.push(typeof msg === "string" ? msg : JSON.stringify(msg));
    // "Fix the highlighted fields" is useless without the fields. The platform
    // names them; drop them and a 422 becomes an unactionable one-liner.
    const fields = Array.isArray(nested?.fields) ? (nested.fields as unknown[]) : undefined;
    if (fields?.length) {
      const named = fields
        .map((f) => {
          const row = f as Record<string, unknown>;
          return row.path ? `${String(row.path)}: ${String(row.message ?? "invalid")}` : null;
        })
        .filter(Boolean);
      if (named.length) bits.push(named.join("; "));
    }
    const code = nested?.code;
    if (code) bits.push(String(code));
    const reqId = d.slng_request_id ?? d.request_id ?? nested?.request_id;
    if (reqId) bits.push(`slng_request_id=${String(reqId)}`);
  }
  if (result.status === 429) {
    bits.push(result.retryAfter ? `rate limited; retry after ${result.retryAfter}s` : "rate limited");
  }
  return bits.length ? bits.join(" · ") : "request failed";
}
