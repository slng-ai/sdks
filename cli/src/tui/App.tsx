import React, { useState } from "react";
import { Box, Text, useApp, useInput } from "ink";
import { Banner } from "./Banner";
import { MainMenu } from "./MainMenu";
import { TtsFlow } from "./TtsFlow";
import { SttFlow } from "./SttFlow";
import { Settings } from "./Settings";
import { AgentsFlow } from "./AgentsFlow";
import { ApiKeySetup } from "./ApiKeySetup";
import { load } from "../lib/config";
import pkg from "../../package.json" with { type: "json" };

export type Screen = "menu" | "tts" | "stt" | "agents" | "settings" | "api-key-setup";

export function App(): React.ReactElement {
  const [screen, setScreen] = useState<Screen>(() => (load().apiKey ? "menu" : "api-key-setup"));
  const { exit } = useApp();

  useInput((input, key) => {
    if (key.ctrl && input === "c") exit();
  });

  return (
    <Box flexDirection="column">
      <Box flexDirection="column" paddingX={1} paddingY={0}>
        <Banner />
        <Text dimColor>  Voice AI for builders — text-to-speech, speech-to-text, real-time.</Text>
        <Text dimColor>  v{pkg.version}</Text>
      </Box>

      {screen === "api-key-setup" && <ApiKeySetup onDone={() => setScreen("menu")} />}
      {screen === "menu" && <MainMenu onPick={setScreen} onQuit={exit} />}
      {screen === "tts" && <TtsFlow onExit={() => setScreen("menu")} />}
      {screen === "stt" && <SttFlow onExit={() => setScreen("menu")} />}
      {screen === "agents" && <AgentsFlow onExit={() => setScreen("menu")} />}
      {screen === "settings" && <Settings onExit={() => setScreen("menu")} />}

      <Box marginTop={1}>
        <Text dimColor>ctrl+c quit</Text>
      </Box>
    </Box>
  );
}
