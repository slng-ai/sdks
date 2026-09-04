import React from "react";
import { Box, Text } from "ink";
import Link from "ink-link";
import { BrandSpinner } from "./BrandSpinner";

// Shared presentational primitives for the Platform-resources browsers
// (Tools / MCP / Secrets / Trunks). Lifted from AgentsFlow so the four flows
// don't each re-copy the loading/error/result scaffolding. Intentionally NOT a
// generic ResourceBrowser<T>: the flows diverge enough (mcp sub-screens,
// secrets' masked create, trunks' fan-out) that a parameterised browser would
// be heavier than four focused files.

export function Loading({ label }: { label: string }): React.ReactElement {
  return (
    <Box marginTop={1} paddingX={1}>
      <Text>
        <BrandSpinner /> {label}
      </Text>
    </Box>
  );
}

// A key can pass /v1/me and still be wrong-org on the agents host, so resource
// screens re-check the error text and guide the user when it looks like auth.
const AUTH_ERROR = /HTTP 40[13]\b|PERMISSION_DENIED|UNAUTHENTICATED|Organisation not found|unauthori[sz]ed/i;

export function ErrorView({ message }: { message: string }): React.ReactElement {
  return (
    <Box flexDirection="column" marginTop={1} paddingX={1}>
      <Text color="red">✗ {message}</Text>
      {AUTH_ERROR.test(message) && (
        <Text dimColor>
          Your API key may be invalid or for another organisation — run `voiceai login` or set
          VOICEAI_API_KEY.
        </Text>
      )}
      <Text dimColor>esc to go back</Text>
    </Box>
  );
}

export function ResultView({
  title,
  lines,
}: {
  title: string;
  lines: string[];
}): React.ReactElement {
  return (
    <Box flexDirection="column" marginTop={1} paddingX={1}>
      <Text color="green">✓ {title}</Text>
      {lines.map((l, i) => (
        <Text key={i}>{l}</Text>
      ))}
      <Box marginTop={1}>
        <Text dimColor>esc to go back</Text>
      </Box>
    </Box>
  );
}

// [label, value], with an optional ink color for the value, and an optional url
// that turns the value into a clickable link (rendered cyan + underlined).
export type Field =
  | readonly [string, string]
  | readonly [string, string, string | undefined]
  | readonly [string, string, string | undefined, string];

/** A key/value record, one field per line, keys dim and padded to align. */
export function FieldList({ entries }: { entries: readonly Field[] }): React.ReactElement {
  const width = entries.reduce((w, [k]) => Math.max(w, k.length), 0) + 2;
  return (
    <Box flexDirection="column">
      {entries.map(([k, v, color, url], i) => (
        <Text key={i}>
          <Text dimColor>{k.padEnd(width)}</Text>
          {url ? (
            <Link url={url}>
              <Text color={color ?? "cyan"} underline>
                {v}
              </Text>
            </Link>
          ) : (
            <Text color={color}>{v}</Text>
          )}
        </Text>
      ))}
    </Box>
  );
}

/** Reserve a 2-col gutter so adjacent columns never touch (from AgentsFlow). */
export function pad(s: string, w: number): string {
  const max = w - 2;
  return (s.length > max ? `${s.slice(0, max - 1)}…` : s).padEnd(w);
}

/**
 * One-line summary of an arbitrary field value: objects and long arrays point
 * at `--json` rather than flooding the row. Mirrors the `summarise` helpers the
 * command modules keep private.
 */
export function genericSummary(v: unknown): string {
  if (v === null || v === undefined || v === "") return "-";
  if (Array.isArray(v)) return v.length ? v.map(String).join(", ") : "-";
  if (typeof v === "object") {
    const keys = Object.keys(v as object);
    return keys.length ? `{${keys.join(", ")}} (use --json)` : "-";
  }
  return String(v);
}
