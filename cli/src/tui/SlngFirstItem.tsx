import React from "react";
import { Text } from "ink";

interface Props {
  isSelected?: boolean;
  label: string;
}

/** Custom <SelectInput> item: detects the `★ ` prefix used to mark Slng-hosted
 *  variants and renders them in yellow. Non-prefixed labels render plainly. */
export function SlngFirstItem({ isSelected, label }: Props): React.ReactElement {
  if (label.startsWith("★ ")) {
    const rest = label.slice(2);
    return (
      <Text color="yellow" bold={isSelected}>
        ★ {rest}
      </Text>
    );
  }
  return <Text bold={isSelected}>{label}</Text>;
}
