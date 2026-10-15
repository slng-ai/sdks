import React from "react";
import { Box, Text } from "ink";
import SelectInput from "ink-select-input";
import { listMyModels, modelLabel, type SpeechType } from "../lib/catalog";
import { SlngFirstItem } from "./SlngFirstItem";
import { ErrorView, Loading, useLoad } from "./resourceKit";

interface Props {
  type: SpeechType;
  title: string;
  /** Put a "(none)" item first, which selects "". */
  allowNone?: boolean;
  onSelect: (model: string) => void;
}

/** The live models of one type that the user's API region serves. */
export function ModelPicker({ type, title, allowNone, onSelect }: Props): React.ReactElement {
  const { data, error } = useLoad(() => listMyModels(type), [type]);
  if (error) return <ErrorView message={error} />;
  if (!data) return <Loading label="Loading models…" />;
  const where = data.region ? ` in ${data.region}` : "";
  if (data.models.length === 0 && !allowNone) {
    return <Text color="yellow">No {type.toUpperCase()} models are served{where}.</Text>;
  }
  return (
    <Box flexDirection="column" marginTop={1}>
      <Text>
        {title}
        {where}:
      </Text>
      <SelectInput
        items={[
          ...(allowNone ? [{ label: "  (none)", value: "" }] : []),
          ...data.models.map((m) => ({ label: modelLabel(m), value: m.id })),
        ]}
        limit={10}
        itemComponent={SlngFirstItem}
        onSelect={(item) => onSelect(item.value)}
      />
    </Box>
  );
}
