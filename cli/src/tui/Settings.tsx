import React, { useEffect, useState } from "react";
import { Box, Text, useInput } from "ink";
import SelectInput from "ink-select-input";
import TextInput from "ink-text-input";
import { currentProfile, load, save } from "../lib/config";
import { Profiles } from "./Profiles";
import { listInputs } from "../lib/audio";
import {
  allRegions,
  allWorldParts,
  isSlngHosted,
  TTS_MODELS,
  STT_MODELS,
  voicesFor,
  voiceLabel,
  type TtsModel,
  type SttModel,
} from "../lib/models";
import { SlngFirstItem } from "./SlngFirstItem";
import { KeyHints } from "./resourceKit";

type Field =
  | "profile"
  | "apiKey"
  | "region"
  | "worldPart"
  | "defaultTtsModel"
  | "defaultTtsVoice"
  | "defaultSttModel"
  | "defaultSttMode"
  | "defaultSttInput";

interface Props {
  onExit: () => void;
}

export function Settings({ onExit }: Props): React.ReactElement {
  const [cfg, setCfg] = useState(load());
  const [editing, setEditing] = useState<Field | null>(null);
  const [draft, setDraft] = useState("");
  const [inputs, setInputs] = useState<string[]>([]);

  // Probe audio inputs once on mount. The list is cheap on macOS but we
  // don't need it unless the user opens the input picker.
  useEffect(() => {
    let cancelled = false;
    if (editing === "defaultSttInput") {
      void listInputs().then((list) => {
        if (!cancelled) setInputs(list);
      });
    }
    return () => {
      cancelled = true;
    };
  }, [editing]);

  useInput((_input, key) => {
    if (key.escape) {
      if (editing) setEditing(null);
      else onExit();
    }
  });

  const commit = (field: Field, value: string) => {
    const next = save({ [field]: value });
    setCfg(next);
    setEditing(null);
    setDraft("");
  };

  if (editing === "profile") {
    return (
      <Profiles
        onExit={() => {
          setCfg(load());
          setEditing(null);
        }}
      />
    );
  }

  if (editing === "apiKey") {
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text bold>API key</Text>
        <TextInput value={draft} onChange={setDraft} onSubmit={(v) => commit("apiKey", v)} mask="*" />
        <KeyHints hints={[{ key: "enter", label: "save", nav: true }, { key: "esc", label: "cancel", nav: true }]} />
      </Box>
    );
  }

  if (editing === "region") {
    const regions = allRegions();
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text bold>Region</Text>
        <Text dimColor>{regions.length} region{regions.length === 1 ? "" : "s"} live across deployments</Text>
        <SelectInput
          items={[{ label: "(auto)", value: "" }, ...regions.map((r) => ({ label: r, value: r }))]}
          onSelect={(item) => commit("region", item.value)}
        />
        <KeyHints hints={[{ key: "esc", label: "cancel", nav: true }]} />
      </Box>
    );
  }

  if (editing === "worldPart") {
    const worldParts = allWorldParts();
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text bold>World part</Text>
        <SelectInput
          items={[{ label: "(auto)", value: "" }, ...worldParts.map((w) => ({ label: w, value: w }))]}
          onSelect={(item) => commit("worldPart", item.value)}
        />
        <KeyHints hints={[{ key: "esc", label: "cancel", nav: true }]} />
      </Box>
    );
  }

  if (editing === "defaultTtsModel" || editing === "defaultSttModel") {
    const models: ReadonlyArray<TtsModel | SttModel> =
      editing === "defaultTtsModel" ? TTS_MODELS : STT_MODELS;
    const items = [
      { label: "  (none)", value: "" },
      ...models.map((m) => {
        const display = m.name ? `${m.name} (${m.id})` : m.id;
        return {
          label: isSlngHosted(m.id) ? `★ ${display}` : `  ${display}`,
          value: m.id,
        };
      }),
    ];
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text bold>Default {editing === "defaultTtsModel" ? "TTS" : "STT"} model</Text>
        <SelectInput
          items={items}
          limit={10}
          itemComponent={SlngFirstItem}
          onSelect={(item) => {
            // If the model changes, clear the cached voice (it likely no longer applies).
            if (editing === "defaultTtsModel" && item.value !== cfg.defaultTtsModel) {
              save({ defaultTtsVoice: undefined });
            }
            commit(editing, item.value);
          }}
        />
        <KeyHints hints={[{ key: "esc", label: "cancel", nav: true }]} />
      </Box>
    );
  }

  if (editing === "defaultSttMode") {
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text bold>Default STT mode</Text>
        <SelectInput
          items={[
            { label: "(none)", value: "" },
            { label: "🎙  Microphone (realtime)", value: "mic" },
            { label: "📂 Audio file (one-shot)", value: "file" },
          ]}
          onSelect={(item) => commit("defaultSttMode", item.value)}
        />
        <KeyHints hints={[{ key: "esc", label: "cancel", nav: true }]} />
      </Box>
    );
  }

  if (editing === "defaultSttInput") {
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text bold>Default STT input device</Text>
        <SelectInput
          items={[
            { label: "(system default)", value: "" },
            ...inputs.map((name) => ({ label: name, value: name })),
          ]}
          onSelect={(item) => commit("defaultSttInput", item.value)}
        />
        <KeyHints
          hints={[{ key: "esc", label: "cancel", nav: true }]}
          note={inputs.length === 0 ? "probing inputs…" : undefined}
        />
      </Box>
    );
  }

  if (editing === "defaultTtsVoice") {
    if (!cfg.defaultTtsModel) {
      return (
        <Box flexDirection="column" marginTop={1} paddingX={1}>
          <Text color="yellow">Set a default TTS model first.</Text>
          <KeyHints hints={[{ key: "esc", label: "back", nav: true }]} />
        </Box>
      );
    }
    const voices = voicesFor(cfg.defaultTtsModel);
    if (voices.length === 0) {
      return (
        <Box flexDirection="column" marginTop={1} paddingX={1}>
          <Text color="yellow">
            No catalogued voices for <Text bold>{cfg.defaultTtsModel}</Text>.
          </Text>
          <KeyHints hints={[{ key: "esc", label: "back", nav: true }]} />
        </Box>
      );
    }
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text bold>Default voice for {cfg.defaultTtsModel}</Text>
        <SelectInput
          items={[
            { label: "(none)", value: "" },
            ...voices.map((v) => ({ label: voiceLabel(v), value: v.voiceId })),
          ]}
          limit={10}
          onSelect={(item) => commit("defaultTtsVoice", item.value)}
        />
        <KeyHints hints={[{ key: "esc", label: "cancel", nav: true }]} />
      </Box>
    );
  }

  return (
    <Box flexDirection="column" marginTop={1} paddingX={1}>
      <Text bold>Settings</Text>
      <Box flexDirection="column" marginTop={1}>
        <SelectInput
          items={[
            { label: `Profile:           ${currentProfile()} ▾`, value: "profile" as Field },
            { label: `API key:           ${mask(cfg.apiKey)}`, value: "apiKey" as Field },
            { label: `Region:            ${cfg.region ?? "(auto)"}`, value: "region" as Field },
            { label: `World part:        ${cfg.worldPart ?? "(auto)"}`, value: "worldPart" as Field },
            { label: `Default TTS model: ${cfg.defaultTtsModel ?? "(none)"}`, value: "defaultTtsModel" as Field },
            { label: `Default TTS voice: ${cfg.defaultTtsVoice ?? "(none)"}`, value: "defaultTtsVoice" as Field },
            { label: `Default STT model: ${cfg.defaultSttModel ?? "(none)"}`, value: "defaultSttModel" as Field },
            { label: `Default STT mode:  ${cfg.defaultSttMode ?? "(ask)"}`, value: "defaultSttMode" as Field },
            { label: `Default STT input: ${cfg.defaultSttInput ?? "(system default)"}`, value: "defaultSttInput" as Field },
          ]}
          onSelect={(item) => {
            setEditing(item.value);
            setDraft("");
          }}
        />
      </Box>
      <KeyHints hints={[{ key: "esc", label: "back", nav: true }]} />
    </Box>
  );
}

function mask(k?: string): string {
  if (!k) return "(unset)";
  if (k.length < 12) return "********";
  return `${k.slice(0, 8)}...${k.slice(-4)}`;
}
