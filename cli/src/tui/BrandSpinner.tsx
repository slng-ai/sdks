import React from "react";
import { Text } from "ink";
import Spinner from "ink-spinner";

// Brand loading mark: a slash rotating in SLNG yellow, echoing the SLNG// logo.
export function BrandSpinner(): React.ReactElement {
  return (
    <Text color="yellow">
      <Spinner type="line" />
    </Text>
  );
}
