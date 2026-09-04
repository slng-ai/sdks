import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import SelectInput from "ink-select-input";
import { ToolsFlow } from "./ToolsFlow";
import { McpFlow } from "./McpFlow";
import { SecretsFlow } from "./SecretsFlow";
import { TrunksFlow } from "./TrunksFlow";

interface Props {
  onExit: () => void;
}

// Nested group menu for the shared-resource browsers. Owns and renders the four
// flows itself rather than pushing them into App's flat router — the same
// "sub-states live inside the component" approach AgentsFlow uses.
type Mode = "menu" | "tools" | "mcp" | "secrets" | "trunks";

export function ResourcesMenu({ onExit }: Props): React.ReactElement {
  const [mode, setMode] = useState<Mode>("menu");

  useInput((_input, key) => {
    if (key.escape && mode === "menu") onExit();
  });

  if (mode === "tools") return <ToolsFlow onExit={() => setMode("menu")} />;
  if (mode === "mcp") return <McpFlow onExit={() => setMode("menu")} />;
  if (mode === "secrets") return <SecretsFlow onExit={() => setMode("menu")} />;
  if (mode === "trunks") return <TrunksFlow onExit={() => setMode("menu")} />;

  const items = [
    { label: "🔧  Tools - Browse shared tools", value: "tools" as const },
    { label: "🧩  MCP servers - Browse & connect", value: "mcp" as const },
    { label: "🔐  Secrets - Browse & create", value: "secrets" as const },
    { label: "☎️   Trunks - Browse SIP trunks", value: "trunks" as const },
    { label: "←   Back", value: "back" as const },
  ];

  return (
    <Box flexDirection="column" marginTop={1} paddingX={1}>
      <Text>Platform resources</Text>
      <Box marginTop={1}>
        <SelectInput
          items={items}
          onSelect={(item) => {
            if (item.value === "back") onExit();
            else setMode(item.value);
          }}
        />
      </Box>
      <Box marginTop={1}>
        <Text dimColor>↑↓ choose · enter open · esc back</Text>
      </Box>
    </Box>
  );
}
