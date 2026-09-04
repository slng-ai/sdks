import React, { useEffect, useState } from "react";
import { Box, Text, useApp, useInput } from "ink";
import { Banner } from "./Banner";
import { MainMenu } from "./MainMenu";
import { TtsFlow } from "./TtsFlow";
import { SttFlow } from "./SttFlow";
import { Settings } from "./Settings";
import { AgentsFlow } from "./AgentsFlow";
import { ResourcesMenu } from "./ResourcesMenu";
import { ApiKeySetup } from "./ApiKeySetup";
import { BrandSpinner } from "./BrandSpinner";
import { load } from "../lib/config";
import { verifyApiKey } from "../lib/verify";
import pkg from "../../package.json" with { type: "json" };

export type Screen =
  | "checking"
  | "menu"
  | "tts"
  | "stt"
  | "agents"
  | "resources"
  | "settings"
  | "api-key-setup";

export function App(): React.ReactElement {
  const hasKey = Boolean(load().apiKey);
  const [screen, setScreen] = useState<Screen>(hasKey ? "checking" : "api-key-setup");
  // The saved key failed auth — ApiKeySetup should explain and re-prompt.
  const [reauth, setReauth] = useState(false);
  // Non-blocking warning shown on the menu (e.g. couldn't reach SLNG to verify).
  const [warning, setWarning] = useState("");
  const { exit } = useApp();

  useInput((input, key) => {
    if (key.ctrl && input === "c") exit();
  });

  // Verify the saved key once at launch so a stale/revoked key is caught before
  // the menu, not on the first authenticated call. A definitive auth failure
  // sends the user to the guided login; a network blip warns but lets them in.
  useEffect(() => {
    if (screen !== "checking") return;
    let cancelled = false;
    void (async () => {
      const key = load().apiKey;
      if (!key) {
        if (!cancelled) setScreen("api-key-setup");
        return;
      }
      const r = await verifyApiKey(key);
      if (cancelled) return;
      if (r.ok) {
        setScreen("menu");
      } else if (r.status === 401 || r.status === 403) {
        setReauth(true);
        setScreen("api-key-setup");
      } else {
        setWarning("Couldn't reach SLNG to verify your API key — you may hit auth errors.");
        setScreen("menu");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [screen]);

  return (
    <Box flexDirection="column">
      <Box flexDirection="column" paddingX={1} paddingY={0}>
        <Banner />
        <Text dimColor>  Voice AI for builders — text-to-speech, speech-to-text, real-time.</Text>
        <Text dimColor>  v{pkg.version}</Text>
      </Box>

      {screen === "checking" && (
        <Box marginTop={1} paddingX={1}>
          <Text>
            <BrandSpinner /> Checking your API key…
          </Text>
        </Box>
      )}
      {screen === "api-key-setup" && (
        <ApiKeySetup
          reauth={reauth}
          onDone={() => {
            setReauth(false);
            setWarning("");
            setScreen("menu");
          }}
        />
      )}
      {screen === "menu" && (
        <Box flexDirection="column">
          {warning && (
            <Box marginTop={1} paddingX={1}>
              <Text color="yellow">⚠ {warning}</Text>
            </Box>
          )}
          <MainMenu onPick={setScreen} onQuit={exit} />
        </Box>
      )}
      {screen === "tts" && <TtsFlow onExit={() => setScreen("menu")} />}
      {screen === "stt" && <SttFlow onExit={() => setScreen("menu")} />}
      {screen === "agents" && <AgentsFlow onExit={() => setScreen("menu")} />}
      {screen === "resources" && <ResourcesMenu onExit={() => setScreen("menu")} />}
      {screen === "settings" && <Settings onExit={() => setScreen("menu")} />}

      <Box marginTop={1}>
        <Text dimColor>ctrl+c quit</Text>
      </Box>
    </Box>
  );
}
