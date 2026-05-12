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
  isSlngHosted,
  type TtsModel,
} from "../lib/models";
import { SlngFirstItem } from "./SlngFirstItem";
import { makeClients } from "../lib/sdk";
import { playBytes, sniffExt } from "../lib/audio";
import { previewVoice } from "../lib/preview";
import { CodeSample } from "./CodeSample";
import { load } from "../lib/config";
import { writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

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
  // If the user has configured a default model (and optionally voice), skip
  // ahead so the common case = launch → type text → enter.
  const initial = (() => {
    const cfg = load();
    const m = cfg.defaultTtsModel;
    const v = cfg.defaultTtsVoice;
    if (m && v) return { step: "enter-text" as Step, language: "", model: m, voice: v };
    if (m) return { step: "pick-voice" as Step, language: "", model: m, voice: "" };
    return { step: "pick-language" as Step, language: "", model: "", voice: "" };
  })();
  const [step, setStep] = useState<Step>(initial.step);
  const [language, setLanguage] = useState<string>(initial.language);
  const [model, setModel] = useState<string>(initial.model);
  const [voice, setVoice] = useState<string>(initial.voice);
  const [region, setRegion] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [bytes, setBytes] = useState<Uint8Array | null>(null);
  const [error, setError] = useState<string>("");
  const [usingDefaults] = useState<boolean>(initial.step !== "pick-language");

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
      {usingDefaults && (
        <Text dimColor>
          using defaults: {model}{voice ? ` · ${voice}` : ""} · esc to change
        </Text>
      )}
      {!usingDefaults && <Text dimColor>esc to go back</Text>}

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
            items={ttsModelsForLanguage(language).map((m: TtsModel) => {
              const display = m.name ? `${m.name} (${m.id})` : m.id;
              return {
                label: isSlngHosted(m.id) ? `★ ${display}` : `  ${display}`,
                value: m.id,
              };
            })}
            limit={8}
            itemComponent={SlngFirstItem}
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
          {/* Context (model · voice · region) is already shown in the header
              when usingDefaults; when the user walked the flow manually it
              still helps to surface it here. Avoid duplicating in the default
              path. */}
          {!usingDefaults && (
            <Text dimColor>
              {model} · {voice}
              {region ? ` · ${region}` : ""}
            </Text>
          )}
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

/** Synthesis-success pane. Keys: enter = redo · c = code sample · s = save to file · esc = back. */
function DonePane({ bytes, modelVariant, voice, text, onRestart }: DonePaneProps): React.ReactElement {
  const [showCode, setShowCode] = useState(false);
  const [savingPath, setSavingPath] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const ext = sniffExt(bytes);
  const defaultPath = defaultSavePath(modelVariant, voice, ext);

  useInput((input, key) => {
    if (savingPath !== null) return; // text input takes over
    if (key.return) onRestart();
    if (input === "c" || input === "C") setShowCode((s) => !s);
    if (input === "s" || input === "S") {
      setSavingPath(defaultPath);
      setSaveError(null);
      setSaved(null);
    }
  });

  const commitSave = (raw: string) => {
    const path = expandTilde(raw.trim() || defaultPath);
    try {
      writeFileSync(path, bytes);
      setSaved(path);
      setSavingPath(null);
    } catch (e) {
      setSaveError((e as Error).message);
    }
  };

  return (
    <Box flexDirection="column" marginTop={1}>
      <Text color="green">✓ Played {bytes.length} bytes.</Text>
      <Text dimColor>
        enter redo · s save to file · {showCode ? "c hide code" : "c show code"} · esc back
      </Text>

      {savingPath !== null && (
        <Box flexDirection="column" marginTop={1}>
          <Text>Save to: </Text>
          <TextInput value={savingPath} onChange={setSavingPath} onSubmit={commitSave} />
          {saveError && <Text color="red">✗ {saveError}</Text>}
          <Text dimColor>enter to save · esc to cancel</Text>
          <CancelSaveListener onCancel={() => setSavingPath(null)} />
        </Box>
      )}

      {saved && (
        <Box marginTop={1}>
          <Text color="green">✓ Saved to {saved}</Text>
        </Box>
      )}

      {showCode && (
        <CodeSample modelVariant={modelVariant} voice={voice} text={text} />
      )}
    </Box>
  );
}

function CancelSaveListener({ onCancel }: { onCancel: () => void }): null {
  useInput((_input, key) => {
    if (key.escape) onCancel();
  });
  return null;
}

function defaultSavePath(modelVariant: string, voice: string, ext: string): string {
  const safeModel = modelVariant.replace(/[^A-Za-z0-9._-]+/g, "_");
  const safeVoice = voice.replace(/[^A-Za-z0-9._-]+/g, "_");
  const ts = new Date().toISOString().replace(/[:T]/g, "-").slice(0, 19);
  return join(homedir(), "Downloads", `slng-${safeModel}-${safeVoice}-${ts}.${ext}`);
}

function expandTilde(p: string): string {
  if (p.startsWith("~/")) return join(homedir(), p.slice(2));
  if (p === "~") return homedir();
  return resolve(p);
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
