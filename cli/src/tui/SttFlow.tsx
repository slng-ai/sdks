import React, { useEffect, useRef, useState } from "react";
import { Box, Text, useInput } from "ink";
import SelectInput from "ink-select-input";
import Spinner from "ink-spinner";
import { STT_MODELS, isSlngHosted } from "../lib/models";
import { SlngFirstItem } from "./SlngFirstItem";
import { makeClients } from "../lib/sdk";
import { recordPcm } from "../lib/audio";
import { load } from "../lib/config";

type Step = "pick-model" | "recording" | "error";

interface Props {
  onExit: () => void;
}

export function SttFlow({ onExit }: Props): React.ReactElement {
  const defaultModel = load().defaultSttModel;
  const [step, setStep] = useState<Step>("pick-model");
  const [model, setModel] = useState<string>("");
  const [partial, setPartial] = useState<string>("");
  const [finals, setFinals] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [paused, setPaused] = useState(false);
  const stopRef = useRef<(() => void) | null>(null);
  const sendingRef = useRef<boolean>(true);
  const startedRef = useRef<boolean>(false);

  useInput((input, key) => {
    if (key.escape) {
      stopRef.current?.();
      onExit();
    }
    if (step === "recording" && input === " ") {
      setPaused((p) => {
        sendingRef.current = !sendingRef.current;
        return !p;
      });
    }
  });

  const start = async (modelId: string) => {
    setModel(modelId);
    setStep("recording");
    try {
      const { streaming } = makeClients();
      const session = await streaming.connectStt(modelId);
      session.send({ type: "init" });

      // consume messages
      (async () => {
        for await (const msg of session) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const m = msg as any;
          if (m.type === "partial_transcript" && m.text) {
            setPartial(m.text);
          } else if (m.type === "final_transcript" && m.text) {
            setPartial("");
            setFinals((prev) => [...prev, m.text]);
          } else if (m.type === "error") {
            setError(JSON.stringify(m));
            setStep("error");
          }
        }
      })().catch((e) => {
        setError((e as Error).message);
        setStep("error");
      });

      const rec = await recordPcm({ sampleRate: 16000, channels: 1 });
      stopRef.current = () => {
        rec.stop();
        session.send({ type: "finalize" });
        session.close();
      };
      for await (const frame of rec.frames) {
        if (sendingRef.current) session.sendAudio(frame);
      }
    } catch (e) {
      setError((e as Error).message);
      setStep("error");
    }
  };

  useEffect(() => {
    // If the user has a default STT model, skip the picker and start recording.
    if (defaultModel && !startedRef.current) {
      startedRef.current = true;
      void start(defaultModel);
    }
    return () => {
      stopRef.current?.();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box flexDirection="column" marginTop={1} paddingX={1}>
      <Text bold>Speech → Text  (streaming)</Text>
      {defaultModel ? (
        <Text dimColor>
          using default: {defaultModel} · esc to stop and go back
        </Text>
      ) : (
        <Text dimColor>esc to stop and go back</Text>
      )}

      {step === "pick-model" && (
        <Box flexDirection="column" marginTop={1}>
          <Text>Model:</Text>
          <SelectInput
            items={STT_MODELS.map((m) => {
              const display = m.name ? `${m.name} (${m.id})` : m.id;
              return {
                label: isSlngHosted(m.id) ? `★ ${display}` : `  ${display}`,
                value: m.id,
              };
            })}
            itemComponent={SlngFirstItem}
            onSelect={(item) => start(item.value)}
          />
        </Box>
      )}

      {step === "recording" && (
        <Box flexDirection="column" marginTop={1}>
          <Text>
            <Text color={paused ? "yellow" : "red"}>●</Text> <Text bold>{model}</Text>
            {"  "}<Text dimColor>(space to {paused ? "resume" : "pause"})</Text>
          </Text>
          <Box flexDirection="column" marginTop={1}>
            {finals.slice(-8).map((line, i) => (
              <Text key={i}>{line}</Text>
            ))}
            {partial && (
              <Text dimColor italic>
                {partial}
              </Text>
            )}
            {finals.length === 0 && !partial && (
              <Text dimColor>
                <Spinner type="dots" /> listening…
              </Text>
            )}
          </Box>
        </Box>
      )}

      {step === "error" && (
        <Box flexDirection="column" marginTop={1}>
          <Text color="red">✗ {error}</Text>
          <Text dimColor>esc to go back</Text>
        </Box>
      )}
    </Box>
  );
}
