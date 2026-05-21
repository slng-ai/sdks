import React from "react";
import { Text } from "ink";

// Captured once from cfonts({ font: "block", text: "SLNG//" }) so we don't
// ship cfonts (and its font JSON files) into the compiled binary.
const BANNER = [
  " ███████╗ ██╗      ███╗   ██╗  ██████╗      ██╗     ██╗",
  " ██╔════╝ ██║      ████╗  ██║ ██╔════╝     ██╔╝    ██╔╝",
  " ███████╗ ██║      ██╔██╗ ██║ ██║  ███╗   ██╔╝    ██╔╝ ",
  " ╚════██║ ██║      ██║╚██╗██║ ██║   ██║  ██╔╝    ██╔╝  ",
  " ███████║ ███████╗ ██║ ╚████║ ╚██████╔╝ ██╔╝    ██╔╝   ",
  " ╚══════╝ ╚══════╝ ╚═╝  ╚═══╝  ╚═════╝  ╚═╝     ╚═╝    ",
];

const FILL_CHAR = "█";

type Span = { text: string; color: "yellow" | null };

function spansForLine(line: string): Span[] {
  const out: Span[] = [];
  let buf = "";
  let color: "yellow" | null = null;
  const flush = () => {
    if (buf) out.push({ text: buf, color });
    buf = "";
  };
  for (const ch of line) {
    const next: "yellow" | null = ch === FILL_CHAR ? "yellow" : null;
    if (next !== color) {
      flush();
      color = next;
    }
    buf += ch;
  }
  flush();
  return out;
}

export function Banner(): React.ReactElement {
  return (
    <Text>
      {BANNER.map((line, i) => (
        <Text key={i}>
          {spansForLine(line).map((span, j) =>
            span.color ? (
              <Text key={j} color={span.color}>
                {span.text}
              </Text>
            ) : (
              span.text
            ),
          )}
          {i < BANNER.length - 1 ? "\n" : ""}
        </Text>
      ))}
    </Text>
  );
}
