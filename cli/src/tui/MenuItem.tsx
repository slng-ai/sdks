import React from "react";
import { Box, Text } from "ink";

interface Props {
  isSelected?: boolean;
  label: string;
}

// Width of the icon gutter, in columns. Fixed so the label always starts at the
// same offset no matter how wide the terminal renders each emoji.
const ICON_WIDTH = 4;

/**
 * A <SelectInput> item that puts the icon in a fixed-width column and the text
 * beside it, keeping labels aligned. The label encodes `icon\ttext`; emoji
 * render at inconsistent widths across terminals, so a fixed gutter is the only
 * reliable way to line the text up.
 */
export function MenuItem({ isSelected, label }: Props): React.ReactElement {
  const tab = label.indexOf("\t");
  const icon = tab >= 0 ? label.slice(0, tab) : "";
  const text = tab >= 0 ? label.slice(tab + 1) : label;
  return (
    <Box>
      <Box width={ICON_WIDTH}>
        <Text>{icon}</Text>
      </Box>
      <Text bold={isSelected} color={isSelected ? "cyan" : undefined}>
        {text}
      </Text>
    </Box>
  );
}
