import { Command } from "commander";
import { currentProfile, requireApiKey } from "../lib/config";

const DEFAULT_AGENTS_BASE_URL = "https://api.agents.slng.ai";

export function whoamiCommand(): Command {
  return new Command("whoami")
    .description("Check that VOICEAI_API_KEY is valid (lightweight auth probe, no TTS/STT credits used)")
    .option("--json", "Output JSON")
    .addHelpText("afterAll", `
EXAMPLES
  $ voiceai whoami                      verify the configured API key
  $ voiceai whoami --json | jq .ok      scriptable check
`)
    .action(async (opts) => {
      const apiKey = requireApiKey();
      const profile = currentProfile();
      const baseUrl = process.env.VOICEAI_AGENTS_BASE_URL ?? DEFAULT_AGENTS_BASE_URL;
      const url = `${baseUrl}/v1/agents`;
      const masked = maskKey(apiKey);

      let res: Response;
      try {
        res = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        if (opts.json) {
          console.log(JSON.stringify({ ok: false, error: message, masked_key: masked, profile }));
        } else {
          console.error(`Network error: ${message}`);
        }
        process.exit(1);
      }

      if (res.status === 200) {
        let agentsCount: number | undefined;
        try {
          const body = (await res.json()) as unknown;
          if (Array.isArray(body)) agentsCount = body.length;
          else if (body && typeof body === "object" && Array.isArray((body as { agents?: unknown[] }).agents)) {
            agentsCount = (body as { agents: unknown[] }).agents.length;
          }
        } catch {
          // body not JSON or unexpected shape — still a successful auth
        }
        if (opts.json) {
          console.log(JSON.stringify({ ok: true, status: 200, masked_key: masked, profile, agents_count: agentsCount }));
        } else {
          const tail = agentsCount === undefined ? "" : ` · ${agentsCount} agent${agentsCount === 1 ? "" : "s"}`;
          console.log(`Authenticated as ${masked} (profile: ${profile})${tail}`);
        }
        return;
      }

      if (res.status === 401) {
        if (opts.json) {
          console.log(JSON.stringify({ ok: false, status: 401, masked_key: masked, profile }));
        } else {
          console.error(`Authentication failed (401) for profile "${profile}". The key may be invalid or revoked.`);
        }
        process.exit(1);
      }

      let snippet = "";
      try {
        snippet = (await res.text()).slice(0, 200);
      } catch {
        // ignore
      }
      if (opts.json) {
        console.log(JSON.stringify({ ok: false, status: res.status, masked_key: masked, profile, body: snippet }));
      } else {
        console.error(`Unexpected response: ${res.status} ${res.statusText}${snippet ? ` — ${snippet}` : ""}`);
      }
      process.exit(1);
    });
}

function maskKey(k: string): string {
  if (k.length < 12) return "********";
  return `${k.slice(0, 8)}...${k.slice(-4)}`;
}
