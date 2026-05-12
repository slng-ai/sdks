import React, { useState } from "react";
import { Box, Text, useApp, useInput } from "ink";
import TextInput from "ink-text-input";
import Link from "ink-link";
import { save } from "../lib/config";

interface Props {
  onDone: () => void;
}

const KEYS_URL = "https://app.slng.ai/api-keys";

/** First-run / no-key state. Paste a Slng API key, masked, and persist it
 *  to ~/.config/slng/config.json before continuing into the app. */
export function ApiKeySetup({ onDone }: Props): React.ReactElement {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string>("");
  const { exit } = useApp();

  useInput((_input, key) => {
    if (key.escape) exit();
  });

  const submit = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) {
      setError("API key is required.");
      return;
    }
    if (!trimmed.startsWith("zpka_") || trimmed.length < 20) {
      setError("That doesn't look like a Slng API key (expected zpka_…).");
      return;
    }
    save({ apiKey: trimmed });
    onDone();
  };

  return (
    <Box flexDirection="column" marginTop={1} paddingX={1}>
      <Text bold>Hey 👋  You'll need an API key to start playing.</Text>

      <Box marginTop={1}>
        <Text>Don't have one yet? Create your API key at </Text>
        <Link url={KEYS_URL} fallback={false}>
          <Text color="cyan" underline>app.slng.ai/api-keys</Text>
        </Link>
      </Box>

      <Box marginTop={1}>
        <Text color="yellow">API key </Text>
        <Text dimColor>(zpka_…) </Text>
        <TextInput value={value} onChange={setValue} onSubmit={submit} mask="*" />
      </Box>

      {error && (
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
