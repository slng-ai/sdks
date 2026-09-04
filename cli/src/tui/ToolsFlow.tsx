import React, { useEffect, useState } from "react";
import { spawn } from "node:child_process";
import { Box, Text, useInput } from "ink";
import SelectInput from "ink-select-input";
import { agentsRequest, formatAgentsError } from "../lib/agents";
import { listAllTools, versionCell, type ToolListItem, type ToolDetail } from "../commands/tool";
import { ErrorView, FieldList, Loading, pad, type Field } from "./resourceKit";

interface Props {
  onExit: () => void;
}

const DASHBOARD_URL = "https://app.slng.ai";

/** Custom tools are org-editable in the dashboard; built-ins are not. */
function editUrl(tool: ToolDetail): string | null {
  return ownershipLabel(tool) === "custom" ? `${DASHBOARD_URL}/tools/${tool.id}` : null;
}

/** Open a URL in the default browser; no-op if the opener isn't available. */
function openExternal(url: string): void {
  const cmd = process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
  try {
    spawn(cmd, [url], { stdio: "ignore", detached: true }).unref();
  } catch {
    // best-effort; the URL is also shown on screen as a fallback
  }
}

// The fixed platform tool set. Built-in tools have name === tool_type, and the
// list row no longer carries `source`, so we recognise them by this known set.
// (An org's own end_call/send_sms/transfer_call would read as built-in — the
// accepted name-collision caveat.) The detail record still carries the
// authoritative `source`, which `ownershipLabel` prefers when present.
const BUILTIN_TOOLS = new Set([
  "end_call",
  "send_sms",
  "transfer_call",
  "current_datetime",
  "voicemail_detection",
  "user_phone_number",
]);

// Types that must have one successful run before publishing (they execute).
const GREEN_RUN_TYPES = new Set(["code", "api_request"]);

function isBuiltInTool(t: { name: string; tool_type: string }): boolean {
  return BUILTIN_TOOLS.has(t.tool_type) || BUILTIN_TOOLS.has(t.name);
}

// --- list formatting -------------------------------------------------------

// SelectInput prefixes a 2-col indicator, so the header is padded by 2 to line up.
const COLS = { name: 30, type: 16, owner: 10 };

function rowLabel(t: ToolListItem): string {
  return (
    pad(t.name, COLS.name) +
    pad(t.tool_type, COLS.type) +
    pad(isBuiltInTool(t) ? "built-in" : "custom", COLS.owner) +
    versionCell(t.latest_version)
  );
}

// --- detail formatting -----------------------------------------------------

function ownershipLabel(tool: ToolDetail): string {
  const source = tool.source;
  if (source === "curated") return "built-in";
  if (source === "org") return "custom";
  return isBuiltInTool(tool) ? "built-in" : "custom";
}

function versionState(tool: ToolDetail): string {
  const v = versionCell(tool.latest_version);
  if (tool.latest_version === null || tool.latest_version === undefined) return `${v} · not yet published`;
  if (tool.is_current_version === true) return `${v} · published`;
  return `${v} · unpublished changes`;
}

/** "arg1 (required), arg2, …" from the JSON Schema, or "none". */
function argLine(argSchema: unknown): string {
  if (!argSchema || typeof argSchema !== "object") return "none";
  const schema = argSchema as { properties?: unknown; required?: unknown };
  const props =
    schema.properties && typeof schema.properties === "object"
      ? Object.keys(schema.properties as Record<string, unknown>)
      : [];
  if (!props.length) return "none";
  const required = new Set(Array.isArray(schema.required) ? schema.required.map(String) : []);
  return props.map((p) => (required.has(p) ? `${p} (required)` : p)).join(", ");
}

/**
 * Compact health signal: red when the config is invalid (a hard problem), yellow
 * for softer warnings, green when published & clean. `null` = nothing to say.
 */
function toolStatus(tool: ToolDetail): { text: string; color: string } | null {
  const warnings: string[] = [];
  if (tool.config_valid === false) warnings.push("config invalid");
  if (tool.schema_stale === true) warnings.push("schema out of date");
  if (GREEN_RUN_TYPES.has(tool.tool_type) && tool.is_current_hash_green === false) {
    warnings.push("no successful run");
  }
  if (warnings.length) {
    const color = tool.config_valid === false ? "red" : "yellow";
    return { text: `⚠ ${warnings.join(" · ")}`, color };
  }
  return tool.is_current_version === true ? { text: "✓ healthy", color: "green" } : null;
}

/** Curated, empty-skipping field list — the noise stays in `tool get --json`. */
function toolFields(tool: ToolDetail): Field[] {
  const entries: Field[] = [];
  entries.push(["type", `${tool.tool_type} · ${ownershipLabel(tool)}`]);
  if (typeof tool.description === "string" && tool.description.trim()) {
    entries.push(["description", tool.description.trim()]);
  }
  entries.push(["version", versionState(tool)]);

  if (tool.tool_type === "api_request") {
    const config = (tool.config ?? {}) as Record<string, unknown>;
    const method = typeof config.http_method === "string" ? config.http_method : "POST";
    const url = typeof config.url === "string" ? config.url : "";
    if (url) entries.push(["request", `${method} ${url}`]);
  } else if (tool.tool_type === "code") {
    const src = tool.code_src;
    if (typeof src === "string" && src) entries.push(["code", `${src.split("\n").length} lines`]);
    const deps = tool.dependencies;
    if (Array.isArray(deps) && deps.length) entries.push(["dependencies", deps.map(String).join(", ")]);
    const secrets = tool.declared_secrets;
    if (Array.isArray(secrets) && secrets.length) entries.push(["secrets", secrets.map(String).join(", ")]);
  }

  entries.push(["arguments", argLine(tool.arg_schema)]);

  const status = toolStatus(tool);
  if (status) entries.push(["status", status.text, status.color]);

  // For a custom tool the id links to the dashboard editor; built-ins are plain.
  const url = editUrl(tool);
  entries.push(url ? ["id", String(tool.id), undefined, url] : ["id", String(tool.id)]);
  return entries;
}

type Mode =
  | { kind: "loading" }
  | { kind: "list" }
  | { kind: "detail-loading"; item: ToolListItem }
  | { kind: "detail"; tool: ToolDetail }
  | { kind: "error"; message: string; back: Mode };

export function ToolsFlow({ onExit }: Props): React.ReactElement {
  const [tools, setTools] = useState<ToolListItem[]>([]);
  const [mode, setMode] = useState<Mode>({ kind: "loading" });

  const loadTools = async (): Promise<void> => {
    setMode({ kind: "loading" });
    try {
      setTools(await listAllTools());
      setMode({ kind: "list" });
    } catch (e) {
      setMode({ kind: "error", message: (e as Error).message, back: { kind: "list" } });
    }
  };

  useEffect(() => {
    void loadTools();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useInput((input, key) => {
    // `e` opens the dashboard editor for a custom tool on its detail screen.
    if (mode.kind === "detail" && (input === "e" || input === "E")) {
      const url = editUrl(mode.tool);
      if (url) openExternal(url);
      return;
    }
    if (!key.escape) return;
    switch (mode.kind) {
      case "list":
        onExit();
        break;
      case "detail":
        setMode({ kind: "list" });
        break;
      case "error":
        setMode(mode.back);
        break;
      // loading / detail-loading: ignore esc
    }
  });

  if (mode.kind === "loading") return <Loading label="Loading tools…" />;
  if (mode.kind === "detail-loading") return <Loading label={`Loading ${mode.item.name}…`} />;
  if (mode.kind === "error") return <ErrorView message={mode.message} />;

  if (mode.kind === "list") {
    if (!tools.length) {
      return (
        <Box flexDirection="column" marginTop={1} paddingX={1}>
          <Text bold>Tools</Text>
          <Text dimColor>No tools found for your organisation.</Text>
          <Box marginTop={1}>
            <Text dimColor>esc to go back</Text>
          </Box>
        </Box>
      );
    }
    const items = tools.map((t) => ({ label: rowLabel(t), value: t.id }));
    const header =
      "  " + pad("NAME", COLS.name) + pad("TYPE", COLS.type) + pad("OWNER", COLS.owner) + "VERSION";
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text bold>Tools ({tools.length})</Text>
        <Box marginTop={1} flexDirection="column">
          <Text dimColor>{header}</Text>
          <SelectInput
            items={items}
            limit={10}
            onSelect={(item) => {
              const tool = tools.find((t) => t.id === item.value);
              if (tool) void openTool(tool);
            }}
          />
        </Box>
        <Box marginTop={1}>
          <Text dimColor>↑↓ choose · enter open · esc back</Text>
        </Box>
      </Box>
    );
  }

  // detail
  if (mode.kind === "detail") {
    const tool = mode.tool;
    const url = editUrl(tool);
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text bold>{String(tool.name)}</Text>
        <Box marginTop={1}>
          <FieldList entries={toolFields(tool)} />
        </Box>
        <Box marginTop={1} flexDirection="column">
          <Text dimColor>
            esc back{url ? " · e edit in browser" : ""} · `voiceai tool get {String(tool.name)} --json` for full detail
          </Text>
          <Text dimColor>run with `voiceai tool run {String(tool.name)} --confirm-side-effects`</Text>
        </Box>
      </Box>
    );
  }

  return <Text />;

  async function openTool(item: ToolListItem): Promise<void> {
    setMode({ kind: "detail-loading", item });
    // The list row omits config, code_src, secrets and gate status; fetch the full record.
    const res = await agentsRequest<ToolDetail>(
      "GET",
      `/v1/agents/tools/${encodeURIComponent(item.id)}`,
    );
    if (!res.ok || !res.data) {
      setMode({ kind: "error", message: formatAgentsError(res), back: { kind: "list" } });
      return;
    }
    setMode({ kind: "detail", tool: res.data });
  }
}
