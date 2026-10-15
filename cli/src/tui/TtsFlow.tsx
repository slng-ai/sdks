import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import SelectInput from "ink-select-input";
import TextInput from "ink-text-input";
import Spinner from "ink-spinner";
import {
  allLanguages,
  languageLabel,
  listMyModels,
  modelLabel,
  modelsForLanguage,
  voiceLabel,
  voicesFor,
  voicesForLanguage,
} from "../lib/catalog";
import { SlngFirstItem } from "./SlngFirstItem";
import { makeClients } from "../lib/sdk";
import { synthesize, TTS_SAMPLE_RATE, wav } from "../lib/bridge";
import { playBytes, sniffExt } from "../lib/audio";
import { previewVoice } from "../lib/preview";
import { CodeSample } from "./CodeSample";
import { ErrorView, KeyHints, Loading, useLoad } from "./resourceKit";
import { load } from "../lib/config";
import { writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

type Step =
  | "pick-language"
  | "pick-model"
  | "pick-voice"
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
  const [text, setText] = useState<string>("");
  const [baseUrl, setBaseUrl] = useState<string>("");
  const [bytes, setBytes] = useState<Uint8Array | null>(null);
  const [error, setError] = useState<string>("");
  const [usingDefaults] = useState<boolean>(initial.step !== "pick-language");
  const catalog = useLoad(() => listMyModels("tts"), []);
  const models = catalog.data?.models ?? [];
  const where = catalog.data?.region ? ` in ${catalog.data.region}` : "";

  useInput((_input, key) => {
    if (key.escape) {
      if (step === "pick-voice") setStep("pick-model");
      else if (step === "pick-model") setStep("pick-language");
      else if (step === "enter-text") setStep("pick-voice");
      else onExit();
    }
  });


  const synth = async (finalText: string) => {
    setStep("synth");
    try {
      const { baseUrl: base } = await makeClients();
      setBaseUrl(base);
      const pcm = await synthesize(model, voice, finalText);
      const arr = wav(pcm, TTS_SAMPLE_RATE);
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
        <Text dimColor>using defaults: {model}{voice ? ` · ${voice}` : ""}</Text>
      )}
      {step !== "done" && step !== "error" && step !== "pick-voice" && (
        <KeyHints hints={[{ key: "esc", label: "back", nav: true }]} />
      )}

      {(step === "pick-language" || step === "pick-model") && catalog.error && <ErrorView message={catalog.error} />}
      {(step === "pick-language" || step === "pick-model") && !catalog.data && !catalog.error && (
        <Loading label="Loading models…" />
      )}
      {(step === "pick-language" || step === "pick-model") && catalog.data && models.length === 0 && (
        <Text color="yellow">No TTS models are served{where}.</Text>
      )}

      {step === "pick-language" && models.length > 0 && (
        <Box flexDirection="column" marginTop={1}>
          <Text>Language:</Text>
          <SelectInput
            items={[
              { label: "Any / multilingual", value: "" },
              ...allLanguages(models).map((lang) => ({ label: languageLabel(lang), value: lang })),
            ]}
            limit={8}
            onSelect={(item) => {
              setLanguage(item.value);
              setStep("pick-model");
            }}
          />
        </Box>
      )}

      {step === "pick-model" && models.length > 0 && (
        <Box flexDirection="column" marginTop={1}>
          <Text>
            Model{where} {language && <Text dimColor>({languageLabel(language)})</Text>}:
          </Text>
          <SelectInput
            items={modelsForLanguage(models, language).map((m) => ({ label: modelLabel(m), value: m.id }))}
            limit={8}
            itemComponent={SlngFirstItem}
            onSelect={(item) => {
              setModel(item.value);
              setStep("pick-voice");
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
            setStep("enter-text");
          }}
        />
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
          baseUrl={baseUrl}
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
          <KeyHints hints={[{ key: "esc", label: "back", nav: true }]} />
        </Box>
      )}
    </Box>
  );
}

interface DonePaneProps {
  bytes: Uint8Array;
  modelVariant: string;
  voice: string;
  text: string;
  baseUrl: string;
  onRestart: () => void;
}

/** Synthesis-success pane. Keys: enter = redo · c = code sample · s = save to file · esc = back. */
function DonePane({ bytes, modelVariant, voice, text, baseUrl, onRestart }: DonePaneProps): React.ReactElement {
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
      {savingPath === null && (
        <KeyHints
          hints={[
            { key: "enter", label: "redo", nav: true },
            { key: "s", label: "save to file" },
            { key: "c", label: showCode ? "hide code" : "show code" },
            { key: "esc", label: "back", nav: true },
          ]}
        />
      )}

      {savingPath !== null && (
        <Box flexDirection="column" marginTop={1}>
          <Text>Save to: </Text>
          <TextInput value={savingPath} onChange={setSavingPath} onSubmit={commitSave} />
          {saveError && <Text color="red">✗ {saveError}</Text>}
          <KeyHints hints={[{ key: "enter", label: "save", nav: true }, { key: "esc", label: "cancel", nav: true }]} />
          <CancelSaveListener onCancel={() => setSavingPath(null)} />
        </Box>
      )}

      {saved && (
        <Box marginTop={1}>
          <Text color="green">✓ Saved to {saved}</Text>
        </Box>
      )}

      {showCode && (
        <CodeSample modelVariant={modelVariant} voice={voice} text={text} baseUrl={baseUrl} />
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
  return join(homedir(), "Downloads", `voiceai-${safeModel}-${safeVoice}-${ts}.${ext}`);
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
  const loaded = useLoad(() => voicesFor(model), [model]);
  const all = loaded.data ?? [];
  const voices = voicesForLanguage(all, language);
  const totalUnfiltered = all.length;
  const [hoveredId, setHoveredId] = useState<string>("");
  const [previewing, setPreviewing] = useState<string>("");
  const [previewError, setPreviewError] = useState<string>("");

  const hovered = voices.find((v) => v.voiceId === hoveredId) ?? voices[0];

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

  if (!loaded.data && !loaded.error) return <Loading label={`Loading voices for ${model}…`} />;

  if (voices.length === 0) {
    return (
      <Box flexDirection="column" marginTop={1}>
        {loaded.error && <Text color="red">✗ {loaded.error}</Text>}
        <Text color="yellow">
          No voices listed for <Text bold>{model}</Text>. Press enter to use the provider default.
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
      <KeyHints hints={[{ key: "p", label: "preview" }, { key: "esc", label: "back", nav: true }]} />
    </Box>
  );
}
