import React, { useState } from "react";
import { Box, Text, useApp, useInput } from "ink";
import TextInput from "ink-text-input";
import Link from "ink-link";
import { save } from "../lib/config";
import { verifyApiKey } from "../lib/verify";
import { BrandSpinner } from "./BrandSpinner";

interface Props {
  onDone: () => void;
}

const KEYS_URL = "https://app.slng.ai/api-keys";

/** First-run / no-key state. Paste a Slng API key, masked, and persist it
 *  to ~/.config/slng/config.json before continuing into the app. */
export function ApiKeySetup({ onDone }: Props): React.ReactElement {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string>("");
  const [checking, setChecking] = useState(false);
  const { exit } = useApp();

  useInput((_input, key) => {
    if (key.escape) exit();
  });

  const submit = async (raw: string) => {
    if (checking) return;
    const trimmed = raw.trim();
    if (!trimmed) {
      setError("API key is required.");
      return;
    }
    if (!trimmed.startsWith("slng_")) {
      setError("That doesn't look like a Slng API key (expected slng_cu_…).");
      return;
    }

    // Format looks right — verify it against /v1/me before saving.
    setError("");
    setChecking(true);
    const result = await verifyApiKey(trimmed);
    setChecking(false);

    if (result.ok) {
      save({ apiKey: trimmed });
      onDone();
      return;
    }
    if (result.status === 401 || result.status === 403) {
      setError("That key didn't work. Check it and try again.");
    } else if (result.error) {
      setError("Couldn't reach SLNG to check your key. Check your connection and try again.");
    } else {
      setError(`Couldn't check your key right now (status ${result.status}). Try again.`);
    }
  };

  return (
    <Box flexDirection="column" marginTop={1} paddingX={1}>
      <Text bold>Hey 👋  You'll need an API key to start playing.</Text>

      <Box marginTop={1}>
        <Text>
          Don't have one yet? Create your API key at{" "}
          <Link url={KEYS_URL}>
            <Text color="cyan" underline>app.slng.ai/api-keys</Text>
          </Link>
        </Text>
      </Box>

      <Box marginTop={1}>
        <Text color="yellow">API key </Text>
        <Text dimColor>(slng_cu_…) </Text>
        <TextInput value={value} onChange={setValue} onSubmit={submit} mask="*" />
      </Box>

      {checking && (
        <Box marginTop={1}>
          <Text>
            <BrandSpinner /> Checking your key…
          </Text>
        </Box>
      )}

      {error && !checking && (
        <Box marginTop={1}>
          <Text color="red">✗ {error}</Text>
        </Box>
      )}

      <Box marginTop={1} flexDirection="column">
        <Text dimColor>Saved to ~/.config/voiceai/config.json. You can also set VOICEAI_API_KEY in your env.</Text>
        <Text dimColor>enter to save · esc to quit</Text>
      </Box>
    </Box>
  );
}
