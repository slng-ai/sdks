import React, { useEffect, useState } from "react";
import { spawn } from "node:child_process";
import { Box, Text, useInput } from "ink";
import SelectInput from "ink-select-input";
import TextInput from "ink-text-input";
import { agentsRequest, formatAgentsError } from "../lib/agents";
import {
  listAllTools,
  versionCell,
  type RunResult,
  type ToolListItem,
  type ToolDetail,
} from "../commands/tool";
import { DetailPanel, ErrorView, KeyHints, Loading, pad, type Badge, type Field } from "./resourceKit";

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

/** Does the tool take any arguments? (whether to prompt for input before a run.) */
function hasArgs(argSchema: unknown): boolean {
  if (!argSchema || typeof argSchema !== "object") return false;
  const props = (argSchema as { properties?: unknown }).properties;
  return Boolean(props && typeof props === "object" && Object.keys(props).length > 0);
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

/** The curated overview rows — the noise stays in `tool get --json`. */
function toolOverview(tool: ToolDetail): Field[] {
  const entries: Field[] = [];
  if (typeof tool.description === "string" && tool.description.trim()) {
    entries.push(["Description", tool.description.trim()]);
  }
  entries.push(["Version", versionState(tool)]);

  if (tool.tool_type === "api_request") {
    const config = (tool.config ?? {}) as Record<string, unknown>;
    const method = typeof config.http_method === "string" ? config.http_method : "POST";
    const url = typeof config.url === "string" ? config.url : "";
    if (url) entries.push(["Request", `${method} ${url}`]);
  } else if (tool.tool_type === "code") {
    const src = tool.code_src;
    if (typeof src === "string" && src) entries.push(["Code", `${src.split("\n").length} lines`]);
    const deps = tool.dependencies;
    if (Array.isArray(deps) && deps.length) entries.push(["Dependencies", deps.map(String).join(", ")]);
    const secrets = tool.declared_secrets;
    if (Array.isArray(secrets) && secrets.length) entries.push(["Secrets", secrets.map(String).join(", ")]);
  }

  entries.push(["Arguments", argLine(tool.arg_schema)]);
  return entries;
}

function toolBadges(tool: ToolDetail): Badge[] {
  const ownership = ownershipLabel(tool);
  const badges: Badge[] = [
    { text: String(tool.tool_type) },
    { text: ownership, color: ownership === "custom" ? "cyan" : undefined },
  ];
  const status = toolStatus(tool);
  if (status) badges.push({ text: status.text, color: status.color });
  return badges;
}

type Mode =
  | { kind: "loading" }
  | { kind: "list" }
  | { kind: "detail-loading"; item: ToolListItem }
  | { kind: "detail"; tool: ToolDetail }
  | { kind: "build-busy"; tool: ToolDetail }
  | { kind: "build-result"; tool: ToolDetail }
  | { kind: "run-input"; tool: ToolDetail; error?: string }
  | { kind: "run-confirm"; tool: ToolDetail; input: Record<string, unknown> }
  | { kind: "run-busy"; tool: ToolDetail }
  | { kind: "run-result"; tool: ToolDetail; status: string; lines: string[] }
  | { kind: "error"; message: string; back: Mode };

/** Only code tools have a build (introspect) step. */
function canBuild(tool: ToolDetail): boolean {
  return tool.tool_type === "code";
}

export function ToolsFlow({ onExit }: Props): React.ReactElement {
  const [tools, setTools] = useState<ToolListItem[]>([]);
  const [mode, setMode] = useState<Mode>({ kind: "loading" });
  const [runInput, setRunInput] = useState("{}");

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
    if (mode.kind === "detail") {
      // `e` opens the dashboard editor for a custom tool.
      if (input === "e" || input === "E") {
        const url = editUrl(mode.tool);
        if (url) openExternal(url);
        return;
      }
      // `b` builds (introspects) a code tool so it can run.
      if ((input === "b" || input === "B") && canBuild(mode.tool)) {
        void doBuild(mode.tool);
        return;
      }
      // `r` starts a run: prompt for input if the tool takes arguments, else confirm.
      if (input === "r" || input === "R") {
        if (hasArgs(mode.tool.arg_schema)) {
          setRunInput("{}");
          setMode({ kind: "run-input", tool: mode.tool });
        } else {
          setMode({ kind: "run-confirm", tool: mode.tool, input: {} });
        }
        return;
      }
    }
    if (!key.escape) return;
    switch (mode.kind) {
      case "list":
        onExit();
        break;
      case "detail":
        setMode({ kind: "list" });
        break;
      case "build-result":
      case "run-input":
      case "run-confirm":
      case "run-result":
        setMode({ kind: "detail", tool: mode.tool });
        break;
      case "error":
        setMode(mode.back);
        break;
      // loading / detail-loading / build-busy / run-busy: ignore esc
    }
  });

  if (mode.kind === "loading") return <Loading label="Loading tools…" />;
  if (mode.kind === "detail-loading") return <Loading label={`Loading ${mode.item.name}…`} />;
  if (mode.kind === "build-busy") return <Loading label={`Building ${String(mode.tool.name)}…`} />;
  if (mode.kind === "run-busy") return <Loading label={`Running ${String(mode.tool.name)}…`} />;
  if (mode.kind === "error") return <ErrorView message={mode.message} />;

  if (mode.kind === "list") {
    if (!tools.length) {
      return (
        <Box flexDirection="column" marginTop={1} paddingX={1}>
          <Text bold>Tools</Text>
          <Text dimColor>No tools found for your organisation.</Text>
          <KeyHints hints={[{ key: "esc", label: "back", nav: true }]} />
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
        <KeyHints hints={[{ key: "esc", label: "back", nav: true }]} />
      </Box>
    );
  }

  // detail
  if (mode.kind === "detail") {
    const tool = mode.tool;
    const url = editUrl(tool);
    const idField: Field = url ? ["ID", String(tool.id), undefined, url] : ["ID", String(tool.id)];
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <DetailPanel
          icon="🔧"
          title={String(tool.name)}
          badges={toolBadges(tool)}
          sections={[
            { fields: toolOverview(tool) },
            { title: "Reference", dim: true, fields: [idField] },
          ]}
        />
        <KeyHints
          hints={[
            ...(canBuild(tool) ? [{ key: "b", label: "build" }] : []),
            { key: "r", label: "run" },
            ...(url ? [{ key: "e", label: "edit in browser" }] : []),
            { key: "esc", label: "back", nav: true },
          ]}
          note={`voiceai tool get ${String(tool.id)} --id --json  ·  full detail`}
        />
      </Box>
    );
  }

  // build result
  if (mode.kind === "build-result") {
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text color="green">✓ built {String(mode.tool.name)} — it can now run</Text>
        <KeyHints hints={[{ key: "esc", label: "back", nav: true }]} />
      </Box>
    );
  }

  // run: collect JSON input for a tool that takes arguments
  if (mode.kind === "run-input") {
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text bold>Run {String(mode.tool.name)}</Text>
        <Text dimColor>arguments: {argLine(mode.tool.arg_schema)}</Text>
        <Box marginTop={1}>
          <Text color="yellow">input </Text>
          <TextInput
            value={runInput}
            onChange={setRunInput}
            onSubmit={(raw) => {
              let parsed: Record<string, unknown>;
              try {
                parsed = raw.trim() ? (JSON.parse(raw) as Record<string, unknown>) : {};
              } catch (e) {
                setMode({ kind: "run-input", tool: mode.tool, error: `invalid JSON: ${(e as Error).message}` });
                return;
              }
              setMode({ kind: "run-confirm", tool: mode.tool, input: parsed });
            }}
          />
        </Box>
        {mode.error ? (
          <Box marginTop={1}>
            <Text color="red">✗ {mode.error}</Text>
          </Box>
        ) : null}
        <KeyHints
          hints={[
            { key: "enter", label: "continue", nav: true },
            { key: "esc", label: "cancel", nav: true },
          ]}
          note="a JSON object matching the tool's arg schema"
        />
      </Box>
    );
  }

  // run: consent — a run executes the tool against real dependencies
  if (mode.kind === "run-confirm") {
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text color="yellow">
          ⚠ Running {String(mode.tool.name)} executes it against your real dependencies — it can
          charge a card or send an email.
        </Text>
        <Box marginTop={1}>
          <SelectInput
            items={[
              { label: "No, cancel", value: "no" },
              { label: "Yes, run it", value: "yes" },
            ]}
            onSelect={(item) => {
              if (item.value === "yes") void doRun(mode.tool, mode.input);
              else setMode({ kind: "detail", tool: mode.tool });
            }}
          />
        </Box>
        <KeyHints hints={[{ key: "esc", label: "cancel", nav: true }]} />
      </Box>
    );
  }

  // run: result
  if (mode.kind === "run-result") {
    const ok = mode.status === "succeeded";
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text color={ok ? "green" : "red"}>
          {ok ? "✓" : "✗"} run {mode.status}
        </Text>
        {mode.lines.map((l, i) => (
          <Text key={i}>{l}</Text>
        ))}
        <KeyHints hints={[{ key: "esc", label: "back", nav: true }]} />
      </Box>
    );
  }

  return <Text />;

  async function doBuild(tool: ToolDetail): Promise<void> {
    setMode({ kind: "build-busy", tool });
    // Introspect is the build step for a code tool — it re-parses the code and
    // prepares the environment/schema so a run no longer 409s BUILD_REQUIRED.
    const res = await agentsRequest<ToolDetail>(
      "POST",
      `/v1/agents/tools/${encodeURIComponent(tool.id)}/introspect`,
    );
    if (!res.ok || !res.data) {
      setMode({ kind: "error", message: formatAgentsError(res), back: { kind: "detail", tool } });
      return;
    }
    // Carry the refreshed record forward so the detail reflects the new state.
    setMode({ kind: "build-result", tool: res.data });
  }

  async function doRun(tool: ToolDetail, input: Record<string, unknown>): Promise<void> {
    setMode({ kind: "run-busy", tool });
    // Same contract as `voiceai tool run`: the literal consent flag is only sent
    // because the operator confirmed the side-effect warning.
    const res = await agentsRequest<RunResult>(
      "POST",
      `/v1/agents/tools/${encodeURIComponent(tool.id)}/run`,
      { body: { sample_input: input, confirm_side_effects: true } },
    );
    if (!res.ok || !res.data) {
      setMode({ kind: "error", message: formatAgentsError(res), back: { kind: "detail", tool } });
      return;
    }
    const result = res.data;
    const lines: string[] = [];
    if (result.error) lines.push(`error: ${result.error}`);
    if (result.validation) lines.push(`validation: ${result.validation}`);
    // The input is never echoed back — it may carry a secret.
    setMode({ kind: "run-result", tool, status: result.status, lines });
  }

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
