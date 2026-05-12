// Thin loader so flag-mode never imports React/Ink.
import React from "react";
import { render } from "ink";
import { App } from "./tui/App";

export async function runTui(): Promise<void> {
  const { waitUntilExit } = render(React.createElement(App));
  await waitUntilExit();
}
