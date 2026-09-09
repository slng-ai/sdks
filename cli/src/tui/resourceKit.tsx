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

// A pressable key + what it does. `nav` keys (esc, ↑↓, enter, ^C) render in a
// quieter accent than screen-specific actions, which get the brand yellow.
export interface Hint {
  key: string;
  label: string;
  nav?: boolean;
}

/**
 * A consistent keyboard-hint bar. Keys are the loud part — bold, coloured
 * (actions yellow, navigation cyan) — with labels in normal weight and an
 * optional dim `note` beneath for non-key captions. Replaces the ad-hoc dim
 * footers so the keys are actually visible.
 */
export function KeyHints({
  hints,
  note,
}: {
  hints: readonly Hint[];
  note?: string;
}): React.ReactElement {
  return (
    <Box flexDirection="column" marginTop={1}>
      <Text>
        {hints.map((h, i) => (
          <Text key={i}>
            {i > 0 ? <Text dimColor>{"   "}</Text> : null}
            <Text dimColor>[</Text>
            <Text bold color={h.nav ? "cyan" : "yellow"}>
              {h.key}
            </Text>
            <Text dimColor>]</Text>
            <Text>{` ${h.label}`}</Text>
          </Text>
        ))}
      </Text>
      {note ? <Text dimColor>{note}</Text> : null}
    </Box>
  );
}

const BACK: Hint = { key: "esc", label: "back", nav: true };

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
      <KeyHints hints={[BACK]} />
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
      <KeyHints hints={[BACK]} />
    </Box>
  );
}

// [label, value], with an optional ink color for the value, and an optional url
// that turns the value into a clickable link (rendered cyan + underlined).
export type Field =
  | readonly [string, string]
  | readonly [string, string, string | undefined]
  | readonly [string, string, string | undefined, string];

/** One aligned key/value line. `dim` recedes the whole row (reference blocks). */
function FieldRow({
  label,
  value,
  width,
  color,
  url,
  dim,
}: {
  label: string;
  value: string;
  width: number;
  color?: string;
  url?: string;
  dim?: boolean;
}): React.ReactElement {
  return (
    <Text>
      <Text dimColor>{label.padEnd(width)}</Text>
      {url ? (
        <Link url={url}>
          <Text color={color ?? "cyan"} underline>
            {value}
          </Text>
        </Link>
      ) : (
        <Text color={dim ? undefined : color} dimColor={dim}>
          {value}
        </Text>
      )}
    </Text>
  );
}

/** A key/value record, one field per line, keys dim and padded to align. */
export function FieldList({ entries }: { entries: readonly Field[] }): React.ReactElement {
  const width = entries.reduce((w, [k]) => Math.max(w, k.length), 0) + 2;
  return (
    <Box flexDirection="column">
      {entries.map(([k, v, color, url], i) => (
        <FieldRow key={i} label={k} value={v} width={width} color={color} url={url} />
      ))}
    </Box>
  );
}

export interface Badge {
  text: string;
  color?: string;
}

export interface DetailSection {
  title?: string;
  fields: readonly Field[];
  /** Recede the section (used for the low-signal reference block). */
  dim?: boolean;
}

/**
 * A bordered detail panel: an icon + bold title with colored badges, then
 * grouped sections of aligned fields. Field labels align across every section
 * so the columns line up down the whole panel.
 */
export function DetailPanel({
  icon,
  title,
  badges = [],
  sections,
}: {
  icon?: string;
  title: string;
  badges?: readonly Badge[];
  sections: readonly DetailSection[];
}): React.ReactElement {
  const width =
    sections.reduce((w, s) => s.fields.reduce((m, [k]) => Math.max(m, k.length), w), 0) + 2;
  return (
    <Box flexDirection="column" borderStyle="round" borderColor="gray" paddingX={1}>
      <Box>
        <Text bold>
          {icon ? `${icon}  ` : ""}
          {title}
        </Text>
        {badges.map((b, i) => (
          <Text key={i} color={b.color} dimColor={!b.color}>
            {i === 0 ? "   " : " · "}
            {b.text}
          </Text>
        ))}
      </Box>
      {sections.map((section, si) => (
        <Box key={si} flexDirection="column" marginTop={1}>
          {section.title ? <Text dimColor>{section.title}</Text> : null}
          {section.fields.map(([k, v, color, url], i) => (
            <FieldRow key={i} label={k} value={v} width={width} color={color} url={url} dim={section.dim} />
          ))}
        </Box>
      ))}
    </Box>
  );
}

// Words rendered upper-case in a humanised label rather than title-cased.
const ACRONYMS = new Set(["id", "url", "api", "mcp", "sip", "uuid", "ttl", "http", "https", "wss"]);

/** A snake_case field key as a readable label: "capability_observed_at" →
 *  "Capability observed at", "url_template" → "URL template", "id" → "ID". */
export function humanizeKey(key: string): string {
  const words = key
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((w) => (ACRONYMS.has(w.toLowerCase()) ? w.toUpperCase() : w.toLowerCase()));
  if (!words.length) return key;
  const s = words.join(" ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}T/;

/** True for an ISO-8601 timestamp string (what the platform returns for *_at). */
export function isIsoDate(v: unknown): v is string {
  return typeof v === "string" && ISO_DATE.test(v) && Number.isFinite(Date.parse(v));
}

/** An ISO timestamp as local "YYYY-MM-DD HH:MM"; anything else passes through. */
export function formatDate(value: unknown): string {
  if (typeof value !== "string") return String(value);
  const ms = Date.parse(value);
  if (!Number.isFinite(ms)) return value;
  const d = new Date(ms);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

/** Reserve a 2-col gutter so adjacent columns never touch (from AgentsFlow). */
export function pad(s: string, w: number): string {
  // Tolerate a non-string at runtime: the API sometimes omits a field the type
  // says is present, and a row renderer must never crash the whole TUI.
  const str = s == null ? "" : String(s);
  const max = w - 2;
  return (str.length > max ? `${str.slice(0, max - 1)}…` : str).padEnd(w);
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

/** A compact "2h ago" / "3d ago" age for an ISO timestamp; "" if unparseable. */
export function relativeAge(iso?: unknown): string {
  if (typeof iso !== "string") return "";
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return "";
  const secs = Math.max(0, (Date.now() - t) / 1000);
  const mins = secs / 60;
  const hours = mins / 60;
  const days = hours / 24;
  if (secs < 60) return `${Math.floor(secs)}s ago`;
  if (mins < 60) return `${Math.floor(mins)}m ago`;
  if (hours < 24) return `${Math.floor(hours)}h ago`;
  if (days < 30) return `${Math.floor(days)}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

/** An ISO timestamp as "YYYY-MM-DD HH:MM  (2h ago)". */
export function dateWithAge(iso: unknown): string {
  if (!isIsoDate(iso)) return genericSummary(iso);
  const age = relativeAge(iso);
  return age ? `${formatDate(iso)}  (${age})` : formatDate(iso);
}

/** One-line display of an arbitrary value: booleans → yes/no, ISO → date, else summary. */
export function formatFieldValue(v: unknown): string {
  if (typeof v === "boolean") return v ? "yes" : "no";
  if (isIsoDate(v)) return formatDate(v);
  return genericSummary(v);
}

/**
 * The record's remaining keys (those not already shown) as humanised, formatted
 * fields — for a dim "reference" section that keeps everything discoverable
 * without cluttering the primary view.
 */
export function remainingFields(record: Record<string, unknown>, shown: readonly string[]): Field[] {
  const skip = new Set(shown);
  return Object.keys(record)
    .filter((k) => !skip.has(k))
    .map((k) => [humanizeKey(k), formatFieldValue(record[k])] as Field);
}
