import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import SelectInput from "ink-select-input";
import TextInput from "ink-text-input";
import Spinner from "ink-spinner";
import {
  TTS_MODELS,
  voicesFor,
  voicesForLanguage,
  voiceLabel,
  allLanguages,
  ttsModelsForLanguage,
  languageLabel,
  regionsFor,
  type TtsModel,
} from "../lib/models";
import { makeClients } from "../lib/sdk";
import { playBytes } from "../lib/audio";
import { previewVoice } from "../lib/preview";
import { CodeSample } from "./CodeSample";

type Step =
  | "pick-language"
  | "pick-model"
  | "pick-voice"
  | "pick-region"
  | "enter-text"
  | "synth"
  | "done"
  | "error";

interface Props {
  onExit: () => void;
}

export function TtsFlow({ onExit }: Props): React.ReactElement {
  const [step, setStep] = useState<Step>("pick-language");
  const [language, setLanguage] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [voice, setVoice] = useState<string>("");
  const [region, setRegion] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [bytes, setBytes] = useState<Uint8Array | null>(null);
  const [error, setError] = useState<string>("");

  useInput((_input, key) => {
    if (key.escape) {
      if (step === "pick-voice") setStep("pick-model");
      else if (step === "pick-model") setStep("pick-language");
      else if (step === "pick-region") setStep("pick-voice");
      else if (step === "enter-text") setStep(regionsFor(model).length > 1 ? "pick-region" : "pick-voice");
      else onExit();
    }
  });

  // After voice is picked: skip to text input when there's nothing meaningful to pick.
  const advancePastVoice = (modelId: string) => {
    const regions = regionsFor(modelId);
    if (regions.length > 1) {
      setRegion(""); // default to auto
      setStep("pick-region");
    } else {
      setRegion(regions[0] ?? "");
      setStep("enter-text");
    }
  };

  const synth = async (finalText: string) => {
    setStep("synth");
    try {
      const { http } = makeClients();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const params: any = { text: finalText, voice };
      if (region) params.region = region;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await (http as any).textToSpeech.create(model, params);
      const blob = await response.blob();
      const arr = new Uint8Array(await blob.arrayBuffer());
      setBytes(arr);
      await playBytes(arr);
      setStep("done");
    } catch (e) {
      setError((e as Error).message);
      setStep("error");
    }
  };

  return (
    <Box flexDirection="column" marginTop={1} paddingX={1}>
      <Text bold>Text → Speech</Text>
      <Text dimColor>esc to go back</Text>

      {step === "pick-language" && (
        <Box flexDirection="column" marginTop={1}>
          <Text>Language:</Text>
          <SelectInput
            items={[
              { label: "Any / multilingual", value: "" },
              ...allLanguages().map((lang) => ({ label: languageLabel(lang), value: lang })),
            ]}
            limit={8}
            onSelect={(item) => {
              setLanguage(item.value);
              setStep("pick-model");
            }}
          />
        </Box>
      )}

      {step === "pick-model" && (
        <Box flexDirection="column" marginTop={1}>
          <Text>
            Model {language && <Text dimColor>({languageLabel(language)})</Text>}:
          </Text>
          <SelectInput
            items={ttsModelsForLanguage(language).map((m: TtsModel) => ({ label: m.id, value: m.id }))}
            limit={8}
            onSelect={(item) => {
              setModel(item.value);
              const v = voicesFor(item.value);
              if (v.length > 0) {
                setVoice(v[0]!.voiceId);
                setStep("pick-voice");
              } else {
                setVoice("default");
                setStep("enter-text");
              }
            }}
          />
        </Box>
      )}

      {step === "pick-voice" && (
        <VoicePicker
          model={model}
          language={language}
          onPick={(v) => {
            setVoice(v);
            advancePastVoice(model);
          }}
        />
      )}

      {step === "pick-region" && (
        <Box flexDirection="column" marginTop={1}>
          <Text>
            Region for <Text bold>{model}</Text>:{" "}
            <Text dimColor>(this model is deployed in {regionsFor(model).length} regions)</Text>
          </Text>
          <SelectInput
            items={[
              { label: "Auto (let Slng pick)", value: "" },
              ...regionsFor(model).map((r) => ({ label: r, value: r })),
            ]}
            onSelect={(item) => {
              setRegion(item.value);
              setStep("enter-text");
            }}
          />
        </Box>
      )}

      {step === "enter-text" && (
        <Box flexDirection="column" marginTop={1}>
          <Text>
            <Text dimColor>{model} · {voice}</Text>
          </Text>
          <Text>Text (enter to synthesize):</Text>
          <TextInput value={text} onChange={setText} onSubmit={(t) => synth(t)} />
        </Box>
      )}

      {step === "synth" && (
        <Box marginTop={1}>
          <Text>
            <Spinner type="dots" /> Synthesizing with <Text bold>{model}</Text> · {voice}…
          </Text>
        </Box>
      )}

      {step === "done" && bytes && (
        <DonePane
          bytes={bytes}
          modelVariant={model}
          voice={voice}
          text={text}
          onRestart={() => {
            setText("");
            setBytes(null);
            setStep("enter-text");
          }}
        />
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

function RestartListener({ onRestart }: { onRestart: () => void }): null {
  useInput((_input, key) => {
    if (key.return) onRestart();
  });
  return null;
}

interface DonePaneProps {
  bytes: Uint8Array;
  modelVariant: string;
  voice: string;
  text: string;
  onRestart: () => void;
}

/** Synthesis-success pane with a [c] toggle to show the equivalent code sample. */
function DonePane({ bytes, modelVariant, voice, text, onRestart }: DonePaneProps): React.ReactElement {
  const [showCode, setShowCode] = useState(false);

  useInput((input, key) => {
    if (key.return) onRestart();
    if (input === "c" || input === "C") setShowCode((s) => !s);
  });

  return (
    <Box flexDirection="column" marginTop={1}>
      <Text color="green">✓ Played {bytes.length} bytes.</Text>
      <Text dimColor>
        enter to synthesize again · {showCode ? "c to hide code" : "c to show code"} · esc to go back
      </Text>
      {showCode && (
        <CodeSample modelVariant={modelVariant} voice={voice} text={text} />
      )}
    </Box>
  );
}

interface VoicePickerProps {
  model: string;
  language: string;
  onPick: (voice: string) => void;
}

function VoicePicker({ model, language, onPick }: VoicePickerProps): React.ReactElement {
  const voices = voicesForLanguage(model, language);
  const totalUnfiltered = voicesFor(model).length;
  const [hoveredId, setHoveredId] = useState<string>(voices[0]?.voiceId ?? "");
  const [previewing, setPreviewing] = useState<string>("");
  const [previewError, setPreviewError] = useState<string>("");

  const hovered = voices.find((v) => v.voiceId === hoveredId);

  const [lastSource, setLastSource] = useState<string>("");

  useInput(async (input) => {
    if ((input === "p" || input === "P") && hovered && !previewing) {
      setPreviewing(hovered.name ?? hovered.voiceId);
      setPreviewError("");
      try {
        const result = await previewVoice(model, hovered);
        setLastSource(result.source);
      } catch (e) {
        setPreviewError((e as Error).message);
      } finally {
        setPreviewing("");
      }
    }
  });

  if (voices.length === 0) {
    return (
      <Box flexDirection="column" marginTop={1}>
        <Text color="yellow">
          No voice catalog for <Text bold>{model}</Text>. Press enter to use the provider default.
        </Text>
        <SelectInput
          items={[{ label: "(use provider default)", value: "default" }]}
          onSelect={(item) => onPick(item.value)}
        />
      </Box>
    );
  }

  return (
    <Box flexDirection="column" marginTop={1}>
      <Text>
        Voice for <Text bold>{model}</Text>
        {language && voices.length < totalUnfiltered && (
          <Text dimColor>
            {" "}({voices.length} {languageLabel(language)} of {totalUnfiltered} total)
          </Text>
        )}
        :{" "}
        <Text dimColor>(p to preview · enter to pick)</Text>
      </Text>
      <SelectInput
        items={voices.map((v) => ({ label: voiceLabel(v), value: v.voiceId }))}
        limit={10}
        onHighlight={(item) => setHoveredId(item.value)}
        onSelect={(item) => onPick(item.value)}
      />
      {hovered && hovered.tone && (
        <Box marginTop={1}>
          <Text dimColor>
            {hovered.tone}
            {hovered.useCase ? ` · ${hovered.useCase}` : ""}
          </Text>
        </Box>
      )}
      {previewing && (
        <Box marginTop={1}>
          <Text>
            <Spinner type="dots" /> Previewing <Text bold>{previewing}</Text>…
          </Text>
        </Box>
      )}
      {!previewing && lastSource && (
        <Box marginTop={1}>
          <Text dimColor>last preview source: {lastSource}</Text>
        </Box>
      )}
      {previewError && (
        <Box marginTop={1}>
          <Text color="red">preview failed: {previewError}</Text>
        </Box>
      )}
    </Box>
  );
}
