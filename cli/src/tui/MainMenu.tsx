import React from "react";
import { Box, Text } from "ink";
import SelectInput from "ink-select-input";
import { MenuItem } from "./MenuItem";
import type { Screen } from "./App";

interface Props {
  onPick: (s: Screen) => void;
  onQuit: () => void;
}

export function MainMenu({ onPick, onQuit }: Props): React.ReactElement {
  // `icon\tlabel` — MenuItem renders the icon in a fixed-width gutter so the
  // labels line up regardless of how wide the terminal draws each emoji.
  const items = [
    { label: "🗣\tText → Speech - Synthesize", value: "tts" as const },
    { label: "👂\tSpeech → Text - Transcribe", value: "stt" as const },
    { label: "🤖\tAgents - Browse & dispatch", value: "agents" as const },
    { label: "🧰\tPlatform resources - Tools, MCP, secrets, trunks", value: "resources" as const },
    { label: "⚙️\tSettings", value: "settings" as const },
    { label: "❌\tQuit", value: "quit" as const },
  ];

  return (
    <Box flexDirection="column" marginTop={1} paddingX={1}>
      <Text>What would you like to do?</Text>
      <Box marginTop={1}>
        <SelectInput
          items={items}
          itemComponent={MenuItem}
          onSelect={(item) => {
            if (item.value === "quit") onQuit();
            else onPick(item.value);
          }}
        />
      </Box>
    </Box>
  );
}
