import React from "react";
import { Box, Text } from "ink";
import SelectInput from "ink-select-input";
import type { Screen } from "./App";

interface Props {
  onPick: (s: Screen) => void;
  onQuit: () => void;
}

export function MainMenu({ onPick, onQuit }: Props): React.ReactElement {
  const items = [
    { label: "🗣  Text → Speech - Synthesize", value: "tts" as const },
    { label: "👂  Speech → Text - Transcribe", value: "stt" as const },
    { label: "🤖  Agents - Browse & dispatch", value: "agents" as const },
    { label: "🧰  Platform resources - Tools, MCP, secrets, trunks", value: "resources" as const },
    { label: "⚙️   Settings", value: "settings" as const },
    { label: "❌   Quit", value: "quit" as const },
  ];

  return (
    <Box flexDirection="column" marginTop={1} paddingX={1}>
      <Text>What would you like to do?</Text>
      <Box marginTop={1}>
        <SelectInput
          items={items}
          onSelect={(item) => {
            if (item.value === "quit") onQuit();
            else onPick(item.value);
          }}
        />
      </Box>
    </Box>
  );
}
