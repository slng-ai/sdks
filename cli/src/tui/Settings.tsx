import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import SelectInput from "ink-select-input";
import TextInput from "ink-text-input";
import { load, save, type Region, type WorldPart } from "../lib/config";

type Field = "apiKey" | "region" | "worldPart" | "defaultTtsModel" | "defaultSttModel";

interface Props {
  onExit: () => void;
}

const REGIONS: Region[] = ["us-east-1", "eu-north-1", "ap-southeast-2"];
const WORLD_PARTS: WorldPart[] = ["na", "eu", "ap"];

export function Settings({ onExit }: Props): React.ReactElement {
  const [cfg, setCfg] = useState(load());
  const [editing, setEditing] = useState<Field | null>(null);
  const [draft, setDraft] = useState("");

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

  if (editing === "apiKey") {
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text bold>API key</Text>
        <TextInput value={draft} onChange={setDraft} onSubmit={(v) => commit("apiKey", v)} mask="*" />
        <Text dimColor>enter to save · esc to cancel</Text>
      </Box>
    );
  }

  if (editing === "region") {
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text bold>Region</Text>
        <SelectInput
          items={[{ label: "(unset)", value: "" }, ...REGIONS.map((r) => ({ label: r, value: r }))]}
          onSelect={(item) => commit("region", item.value)}
        />
      </Box>
    );
  }

  if (editing === "worldPart") {
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text bold>World part</Text>
        <SelectInput
          items={[{ label: "(unset)", value: "" }, ...WORLD_PARTS.map((w) => ({ label: w, value: w }))]}
          onSelect={(item) => commit("worldPart", item.value)}
        />
      </Box>
    );
  }

  if (editing === "defaultTtsModel" || editing === "defaultSttModel") {
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text bold>Default {editing === "defaultTtsModel" ? "TTS" : "STT"} model</Text>
        <TextInput value={draft} onChange={setDraft} onSubmit={(v) => commit(editing, v)} />
        <Text dimColor>enter to save · esc to cancel</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" marginTop={1} paddingX={1}>
      <Text bold>Settings</Text>
      <Text dimColor>esc to go back</Text>
      <Box flexDirection="column" marginTop={1}>
        <SelectInput
          items={[
            { label: `API key:           ${mask(cfg.apiKey)}`, value: "apiKey" as Field },
            { label: `Region:            ${cfg.region ?? "(auto)"}`, value: "region" as Field },
            { label: `World part:        ${cfg.worldPart ?? "(auto)"}`, value: "worldPart" as Field },
            { label: `Default TTS model: ${cfg.defaultTtsModel ?? "(none)"}`, value: "defaultTtsModel" as Field },
            { label: `Default STT model: ${cfg.defaultSttModel ?? "(none)"}`, value: "defaultSttModel" as Field },
          ]}
          onSelect={(item) => {
            setEditing(item.value);
            setDraft("");
          }}
        />
      </Box>
    </Box>
  );
}

function mask(k?: string): string {
  if (!k) return "(unset)";
  if (k.length < 12) return "********";
  return `${k.slice(0, 8)}...${k.slice(-4)}`;
}
