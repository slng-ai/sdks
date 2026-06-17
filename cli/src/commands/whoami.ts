import { Command } from "commander";
import ora from "ora";
import { currentProfile, load, requireApiKey } from "../lib/config";
import { type Account, verifyApiKey } from "../lib/verify";

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
      const { baseUrl } = load();
      const profile = currentProfile();
      const masked = maskKey(apiKey);

      const spinner =
        !opts.json && process.stdout.isTTY
          ? ora({ text: "Checking your key", color: "yellow", spinner: "line" }).start()
          : null;

      const result = await verifyApiKey(apiKey, baseUrl);

      if (result.error) {
        if (opts.json) {
          console.log(JSON.stringify({ ok: false, error: result.error, masked_key: masked, profile }));
        } else {
          const msg = "Couldn't reach SLNG to check your key. Check your connection and try again.";
          spinner ? spinner.fail(msg) : console.error(msg);
        }
        process.exit(1);
      }

      if (result.ok) {
        const account = result.account ?? {};
        if (opts.json) {
          console.log(JSON.stringify({ ok: true, status: 200, profile, masked_key: masked, account }));
        } else {
          const line = formatAccount(account, profile, masked);
          spinner ? spinner.succeed(line) : console.log(line);
        }
        return;
      }

      // The gateway may return 401; /v1/me itself returns 403 for a bad key.
      if (result.status === 401 || result.status === 403) {
        if (opts.json) {
          console.log(JSON.stringify({ ok: false, status: result.status, masked_key: masked, profile }));
        } else {
          const msg = `That key didn't work for profile "${profile}". It may be invalid or revoked.`;
          spinner ? spinner.fail(msg) : console.error(msg);
        }
        process.exit(1);
      }

      if (opts.json) {
        console.log(JSON.stringify({ ok: false, status: result.status, masked_key: masked, profile, body: result.body ?? "" }));
      } else {
        const msg = `Couldn't check your key right now (status ${result.status}). Try again.`;
        spinner ? spinner.warn(msg) : console.error(msg);
      }
      process.exit(1);
    });
}

function formatAccount(account: Account, profile: string, masked: string): string {
  const who = account.email
    ? `${account.name ?? "?"} <${account.email}>`
    : account.name ?? masked;
  const parts = [`Signed in as ${who}`];
  if (account.org_name) {
    parts.push(account.tier ? `${account.org_name} (${account.tier})` : account.org_name);
  }
  if (account.api_key_label) parts.push(`key "${account.api_key_label}"`);
  parts.push(`profile: ${profile}`);
  return parts.join(" · ");
}

function maskKey(k: string): string {
  if (k.length < 12) return "********";
  return `${k.slice(0, 8)}...${k.slice(-4)}`;
}
