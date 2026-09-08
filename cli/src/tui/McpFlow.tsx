import React, { useEffect, useState } from "react";
import { Box, Text, useInput } from "ink";
import SelectInput from "ink-select-input";
import TextInput from "ink-text-input";
import { formatAgentsError } from "../lib/agents";
import {
  TRANSPORTS,
  buildServerBody,
  cell,
  connectServer,
  createServer,
  diffToolNames,
  firstLine,
  listAllServers,
  loadServers,
  type McpCapabilities,
  type McpServerDetail,
  type McpServerListItem,
  type Transport,
} from "../commands/mcp";
import {
  DetailPanel,
  ErrorView,
  KeyHints,
  Loading,
  ResultView,
  dateWithAge,
  pad,
  remainingFields,
  type Badge,
  type Field,
} from "./resourceKit";

interface Props {
  onExit: () => void;
}

const COLS = { name: 28, transport: 12, status: 14 };
const CREATE_VALUE = "__create__";

function rowLabel(s: McpServerListItem): string {
  return (
    pad(s.name, COLS.name) +
    pad(cell(s.transport), COLS.transport) +
    pad(cell(s.capability_status), COLS.status) +
    cell(s.capability_tool_count)
  );
}

// Shown in the primary sections; everything else falls into the dim reference block.
const SHOWN_KEYS = [
  "name",
  "transport",
  "url_template",
  "capability_status",
  "capability_tool_count",
  "description",
  "capability_observed_at",
  "next_refresh_at",
  "capabilities",
  "id",
];

function serverBadges(server: McpServerDetail): Badge[] {
  const status = server.capability_status;
  return [
    { text: cell(server.transport) },
    {
      text: status ? String(status) : "unprobed",
      color: status === "healthy" ? "green" : status ? "yellow" : undefined,
    },
  ];
}

type Mode =
  | { kind: "loading" }
  | { kind: "list" }
  | { kind: "detail-loading"; item: McpServerListItem }
  | { kind: "detail"; server: McpServerDetail }
  | { kind: "tools"; server: McpServerDetail }
  | { kind: "create-name" }
  | { kind: "create-url" }
  | { kind: "create-transport" }
  | { kind: "create-auth" }
  | { kind: "create-bearer" }
  | { kind: "busy"; label: string }
  | { kind: "result"; title: string; lines: string[]; back: Mode }
  | { kind: "error"; message: string; back: Mode };

export function McpFlow({ onExit }: Props): React.ReactElement {
  const [servers, setServers] = useState<McpServerListItem[]>([]);
  const [mode, setMode] = useState<Mode>({ kind: "loading" });
  const [draftName, setDraftName] = useState("");
  const [draftUrl, setDraftUrl] = useState("");
  const [draftBearer, setDraftBearer] = useState("");
  const [draftTransport, setDraftTransport] = useState<Transport>("streamable_http");

  const startCreate = (): void => {
    setDraftName("");
    setDraftUrl("");
    setDraftBearer("");
    setDraftTransport("streamable_http");
    setMode({ kind: "create-name" });
  };

  const loadList = async (): Promise<void> => {
    setMode({ kind: "loading" });
    try {
      setServers(await listAllServers());
      setMode({ kind: "list" });
    } catch (e) {
      setMode({ kind: "error", message: (e as Error).message, back: { kind: "list" } });
    }
  };

  useEffect(() => {
    void loadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useInput((_input, key) => {
    if (!key.escape) return;
    switch (mode.kind) {
      case "list":
        onExit();
        break;
      case "detail":
        setMode({ kind: "list" });
        break;
      case "tools":
        setMode({ kind: "detail", server: mode.server });
        break;
      case "create-name":
        setMode({ kind: "list" });
        break;
      case "create-url":
        setMode({ kind: "create-name" });
        break;
      case "create-transport":
        setMode({ kind: "create-url" });
        break;
      case "create-auth":
        setMode({ kind: "create-transport" });
        break;
      case "create-bearer":
        setMode({ kind: "create-auth" });
        break;
      case "result":
      case "error":
        setMode(mode.back);
        break;
      // loading / detail-loading / busy: ignore esc
    }
  });

  if (mode.kind === "loading") return <Loading label="Loading MCP servers…" />;
  if (mode.kind === "detail-loading") return <Loading label={`Loading ${mode.item.name}…`} />;
  if (mode.kind === "busy") return <Loading label={mode.label} />;
  if (mode.kind === "error") return <ErrorView message={mode.message} />;
  if (mode.kind === "result") return <ResultView title={mode.title} lines={mode.lines} />;

  if (mode.kind === "list") {
    const items = [
      { label: "＋  Create server", value: CREATE_VALUE },
      ...servers.map((s) => ({ label: rowLabel(s), value: s.id })),
    ];
    const header =
      "  " +
      pad("NAME", COLS.name) +
      pad("TRANSPORT", COLS.transport) +
      pad("STATUS", COLS.status) +
      "TOOLS";
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text bold>MCP servers ({servers.length})</Text>
        {servers.length === 0 ? <Text dimColor>No MCP servers yet.</Text> : null}
        <Box marginTop={1} flexDirection="column">
          {servers.length > 0 ? <Text dimColor>{header}</Text> : null}
          <SelectInput
            items={items}
            limit={10}
            onSelect={(item) => {
              if (item.value === CREATE_VALUE) {
                startCreate();
                return;
              }
              const server = servers.find((s) => s.id === item.value);
              if (server) void openServer(server);
            }}
          />
        </Box>
        <KeyHints
          hints={[
            { key: "↑↓", label: "move", nav: true },
            { key: "enter", label: "open", nav: true },
            { key: "esc", label: "back", nav: true },
          ]}
        />
      </Box>
    );
  }

  if (mode.kind === "create-name") {
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text bold>New MCP server</Text>
        <Box marginTop={1}>
          <Text color="yellow">Name </Text>
          <TextInput
            value={draftName}
            onChange={setDraftName}
            placeholder="firecrawl-mcp"
            onSubmit={(raw) => {
              if (raw.trim()) setMode({ kind: "create-url" });
            }}
          />
        </Box>
        <KeyHints
          hints={[
            { key: "enter", label: "continue", nav: true },
            { key: "esc", label: "cancel", nav: true },
          ]}
        />
      </Box>
    );
  }

  if (mode.kind === "create-url") {
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text bold>URL · {draftName.trim()}</Text>
        <Box marginTop={1}>
          <Text color="yellow">URL </Text>
          <TextInput
            value={draftUrl}
            onChange={setDraftUrl}
            placeholder="https://mcp.example.com/mcp"
            onSubmit={(raw) => {
              if (raw.trim()) setMode({ kind: "create-transport" });
            }}
          />
        </Box>
        <KeyHints
          hints={[
            { key: "enter", label: "continue", nav: true },
            { key: "esc", label: "back", nav: true },
          ]}
          note="embed a vault secret as {{$NAME}}"
        />
      </Box>
    );
  }

  if (mode.kind === "create-transport") {
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text bold>Transport · {draftName.trim()}</Text>
        <Box marginTop={1}>
          <SelectInput
            items={TRANSPORTS.map((t) => ({ label: t, value: t }))}
            onSelect={(item) => {
              setDraftTransport(item.value as Transport);
              setMode({ kind: "create-auth" });
            }}
          />
        </Box>
        <KeyHints hints={[{ key: "esc", label: "back", nav: true }]} />
      </Box>
    );
  }

  if (mode.kind === "create-auth") {
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text bold>Auth · {draftName.trim()}</Text>
        <Box marginTop={1}>
          <SelectInput
            items={[
              { label: "None", value: "none" },
              { label: "Bearer (from a vault secret)", value: "bearer" },
            ]}
            onSelect={(item) => {
              if (item.value === "bearer") setMode({ kind: "create-bearer" });
              else void doCreate();
            }}
          />
        </Box>
        <KeyHints hints={[{ key: "esc", label: "back", nav: true }]} note="header auth & custom headers: use `voiceai mcp create --file`" />
      </Box>
    );
  }

  if (mode.kind === "create-bearer") {
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text bold>Bearer secret · {draftName.trim()}</Text>
        <Box marginTop={1}>
          <Text color="yellow">Vault secret name </Text>
          <TextInput
            value={draftBearer}
            onChange={setDraftBearer}
            placeholder="FIRECRAWL_API_KEY"
            onSubmit={(raw) => {
              if (raw.trim()) void doCreate();
            }}
          />
        </Box>
        <KeyHints
          hints={[
            { key: "enter", label: "create", nav: true },
            { key: "esc", label: "back", nav: true },
          ]}
          note="the secret must already exist in the vault"
        />
      </Box>
    );
  }

  if (mode.kind === "detail") {
    const server = mode.server;
    const actions = [
      { label: "🔧  View tools", value: "tools" },
      { label: "🔌  Connect & refresh", value: "connect" },
      { label: "←   Back to list", value: "back" },
    ];
    const overview: Field[] = [
      ["URL template", cell(server.url_template)],
      ["Tools", cell(server.capability_tool_count)],
    ];
    if (typeof server.description === "string" && server.description.trim()) {
      overview.push(["Description", server.description.trim()]);
    }
    const health: Field[] = [
      ["Last probed", server.capability_observed_at ? dateWithAge(server.capability_observed_at) : "never"],
    ];
    if (server.next_refresh_at) health.push(["Next refresh", dateWithAge(server.next_refresh_at)]);
    const reference: Field[] = [["ID", String(server.id)], ...remainingFields(server, SHOWN_KEYS)];
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <DetailPanel
          icon="🧩"
          title={server.name}
          badges={serverBadges(server)}
          sections={[
            { fields: overview },
            { title: "Health", fields: health },
            { title: "Reference", dim: true, fields: reference },
          ]}
        />
        <Box marginTop={1}>
          <SelectInput
            items={actions}
            onSelect={(item) => {
              switch (item.value) {
                case "tools":
                  setMode({ kind: "tools", server });
                  break;
                case "connect":
                  void connect(server);
                  break;
                case "back":
                  setMode({ kind: "list" });
                  break;
              }
            }}
          />
        </Box>
        <KeyHints
          hints={[{ key: "esc", label: "back", nav: true }]}
          note="connect refreshes the platform's capability snapshot"
        />
      </Box>
    );
  }

  if (mode.kind === "tools") {
    const caps = (mode.server.capabilities ?? {}) as McpCapabilities;
    const tools = caps.tools ?? [];
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text bold>Tools · {mode.server.name}</Text>
        <Text dimColor>from the last capability probe, not a live call</Text>
        {caps.truncated ? (
          <Text color="yellow">⚠ the last probe was truncated; the server may expose more.</Text>
        ) : null}
        {tools.length ? (
          <Box marginTop={1} flexDirection="column">
            <Text dimColor>{"  " + pad("NAME", 30) + "DESCRIPTION"}</Text>
            {tools.map((t, i) => (
              <Text key={t.name ?? i}>
                {"  " + pad(t.name, 30)}
                <Text dimColor>{firstLine(t.description)}</Text>
              </Text>
            ))}
          </Box>
        ) : (
          <Box marginTop={1}>
            <Text dimColor>
              {mode.server.capability_observed_at
                ? "the last probe reported no tools."
                : "this server has not been probed yet."}
            </Text>
          </Box>
        )}
        <KeyHints hints={[{ key: "esc", label: "back", nav: true }]} />
      </Box>
    );
  }

  return <Text />;

  async function doCreate(): Promise<void> {
    const name = draftName.trim();
    setMode({ kind: "busy", label: `Creating ${name}…` });
    const bearer = draftBearer.trim();
    const res = await createServer(
      buildServerBody({
        name,
        url: draftUrl.trim(),
        transport: draftTransport,
        bearerSecret: bearer || undefined,
      }),
    );
    if (!res.ok || !res.data) {
      setMode({ kind: "error", message: formatAgentsError(res), back: { kind: "list" } });
      return;
    }
    // Refresh the list in the background, then land on the new server's detail —
    // Connect & refresh is right there to probe it.
    try {
      setServers(await listAllServers());
    } catch {
      // best-effort refresh; the server was created
    }
    setMode({ kind: "detail", server: res.data });
  }

  async function openServer(item: McpServerListItem): Promise<void> {
    setMode({ kind: "detail-loading", item });
    try {
      const found = await loadServers([item.name]);
      const server = found[0];
      if (!server) {
        setMode({ kind: "error", message: `mcp server "${item.name}" not found.`, back: { kind: "list" } });
        return;
      }
      setMode({ kind: "detail", server });
    } catch (e) {
      setMode({ kind: "error", message: (e as Error).message, back: { kind: "list" } });
    }
  }

  async function connect(server: McpServerDetail): Promise<void> {
    setMode({ kind: "busy", label: `Connecting to ${server.name}…` });
    const previous = ((server.capabilities ?? {}) as McpCapabilities).tools ?? null;
    const res = await connectServer(server.id);
    if (!res.ok || !res.data) {
      setMode({ kind: "error", message: formatAgentsError(res), back: { kind: "detail", server } });
      return;
    }
    const result = res.data;
    const tools = result.capabilities?.tools ?? [];
    const diff = diffToolNames(server.capability_observed_at ? previous : null, tools);
    const changes = diff.firstProbe
      ? `first probe — ${tools.length} tool${tools.length === 1 ? "" : "s"} discovered`
      : [...diff.added.map((n) => `+${n}`), ...diff.removed.map((n) => `-${n}`)].join(", ") || "none";
    const info = [result.server_info?.name, result.server_info?.version].filter(Boolean).join(" ");
    const lines = [
      `server    ${server.name}`,
      `status    ${result.status === "connected" ? `connected in ${result.latency_ms} ms` : result.status}`,
      `serving   ${info || "-"}`,
      `protocol  ${cell(result.protocol_version)}`,
      `tools     ${tools.length}`,
      `changes   ${changes}`,
    ];
    // A 200 that says anything but `connected` is still a server that did not work.
    if (result.status !== "connected") {
      setMode({
        kind: "error",
        message: `${server.name}: ${result.status}`,
        back: { kind: "detail", server },
      });
      return;
    }
    // Fold the fresh probe back into the detail, so "View tools" and the badges
    // reflect what connect just returned instead of the stale create-time snapshot.
    let refreshed: McpServerDetail = {
      ...server,
      capabilities: result.capabilities ?? server.capabilities,
      capability_status: "healthy",
      capability_tool_count: tools.length,
      capability_observed_at: new Date().toISOString(),
    };
    // Re-read the stored detail (what the dashboard shows) so the tool list is
    // authoritative; fall back to the merged snapshot if the re-read fails.
    try {
      const found = await loadServers([server.name]);
      if (found[0]) refreshed = found[0];
    } catch {
      // keep the merged snapshot
    }
    // Keep the list in sync too, so its STATUS/TOOLS columns update.
    setServers((prev) =>
      prev.map((s) =>
        s.id === server.id
          ? { ...s, capability_status: "healthy", capability_tool_count: tools.length }
          : s,
      ),
    );
    setMode({
      kind: "result",
      title: `Connected to ${server.name}`,
      lines,
      back: { kind: "detail", server: refreshed },
    });
  }
}
