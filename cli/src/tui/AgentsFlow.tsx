import React, { useEffect, useState } from "react";
import { spawn } from "node:child_process";
import { Box, Text, useInput } from "ink";
import SelectInput from "ink-select-input";
import TextInput from "ink-text-input";
import Link from "ink-link";
import { agentsRequest, formatAgentsError } from "../lib/agents";
import { BrandSpinner } from "./BrandSpinner";

const DASHBOARD_URL = "https://app.slng.ai";

/** Open a URL in the user's default browser; no-op if the opener isn't available. */
function openExternal(url: string): void {
  const cmd = process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
  try {
    spawn(cmd, [url], { stdio: "ignore", detached: true }).unref();
  } catch {
    // best-effort; the URL is also shown on screen as a fallback
  }
}

interface Props {
  onExit: () => void;
}

interface Agent {
  id: string;
  name?: string;
  language?: string;
  region?: string;
  created_at?: string;
  // Set when the agent has an outbound SIP trunk; required to dispatch calls.
  sip_outbound_trunk_id?: string | null;
}

interface CallItem {
  id?: string;
  call_direction?: string;
  status?: string;
  phone_number?: string;
  web_session_origin?: string;
  call_duration_ms?: number;
  call_started_at?: string;
  created_at?: string;
}

// --- call formatting (mirrors the dashboard Calls table) -------------------

function statusColor(status?: string): "green" | "red" | "cyan" | undefined {
  const s = (status ?? "").toLowerCase();
  if (["completed", "succeeded", "success", "done", "ended"].includes(s)) return "green";
  if (["failed", "error", "failure", "canceled", "cancelled", "no_answer", "busy"].includes(s)) return "red";
  if (["in_progress", "in progress", "active", "ringing", "running", "pending", "queued", "dispatched"].includes(s))
    return "cyan";
  return undefined;
}

function fmtDuration(ms?: number): string {
  if (typeof ms !== "number" || ms <= 0) return "—";
  const total = Math.round(ms / 1000);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

function fmtDate(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function caller(c: CallItem): string {
  return c.phone_number || c.web_session_origin || (c.id ? c.id.slice(0, 8) : "—");
}

// Fixed column widths so rows line up like the dashboard table.
const COLS = { caller: 22, direction: 11, status: 13, duration: 8, started: 18 };

function CallRow({ c, header }: { c?: CallItem; header?: boolean }): React.ReactElement {
  if (header) {
    return (
      <Box>
        <Box width={COLS.caller}><Text dimColor>CALLER</Text></Box>
        <Box width={COLS.direction}><Text dimColor>DIRECTION</Text></Box>
        <Box width={COLS.status}><Text dimColor>STATUS</Text></Box>
        <Box width={COLS.duration}><Text dimColor>DURATION</Text></Box>
        <Box width={COLS.started}><Text dimColor>STARTED</Text></Box>
      </Box>
    );
  }
  const call = c as CallItem;
  return (
    <Box>
      <Box width={COLS.caller}><Text>{caller(call)}</Text></Box>
      <Box width={COLS.direction}><Text>{call.call_direction ?? "—"}</Text></Box>
      <Box width={COLS.status}><Text color={statusColor(call.status)}>{call.status ?? "—"}</Text></Box>
      <Box width={COLS.duration}><Text>{fmtDuration(call.call_duration_ms)}</Text></Box>
      <Box width={COLS.started}><Text>{fmtDate(call.call_started_at ?? call.created_at)}</Text></Box>
    </Box>
  );
}

type Mode =
  | { kind: "loading" }
  | { kind: "list" }
  | { kind: "detail"; agent: Agent }
  | { kind: "dispatch"; agent: Agent }
  | { kind: "calls"; agent: Agent; loading: boolean; items: CallItem[] }
  | { kind: "confirm-delete"; agent: Agent }
  | { kind: "busy"; label: string }
  | { kind: "result"; title: string; lines: string[]; back: Mode }
  | { kind: "open-url"; title: string; url: string; back: Mode }
  | { kind: "error"; message: string; back: Mode };

export function AgentsFlow({ onExit }: Props): React.ReactElement {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [mode, setMode] = useState<Mode>({ kind: "loading" });
  const [phone, setPhone] = useState("");

  const loadAgents = async (): Promise<void> => {
    setMode({ kind: "loading" });
    const r = await agentsRequest<Agent[]>("GET", "/v1/agents");
    if (!r.ok) {
      setMode({ kind: "error", message: formatAgentsError(r), back: { kind: "list" } });
      return;
    }
    setAgents(Array.isArray(r.data) ? r.data : []);
    setMode({ kind: "list" });
  };

  useEffect(() => {
    void loadAgents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Esc navigation. SelectInput/TextInput consume their own keys; esc still fires here.
  useInput((_input, key) => {
    if (!key.escape) return;
    switch (mode.kind) {
      case "list":
        onExit();
        break;
      case "detail":
        setMode({ kind: "list" });
        break;
      case "dispatch":
      case "confirm-delete":
        setMode({ kind: "detail", agent: mode.agent });
        break;
      case "calls":
        setMode({ kind: "detail", agent: mode.agent });
        break;
      case "result":
      case "open-url":
      case "error":
        setMode(mode.back);
        break;
      // loading / busy: ignore esc
    }
  });

  // --- loading / busy / error ---------------------------------------------
  if (mode.kind === "loading" || mode.kind === "busy") {
    const label = mode.kind === "busy" ? mode.label : "Loading agents…";
    return (
      <Box marginTop={1} paddingX={1}>
        <Text>
          <BrandSpinner /> {label}
        </Text>
      </Box>
    );
  }

  if (mode.kind === "error") {
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text color="red">✗ {mode.message}</Text>
        <Text dimColor>esc to go back</Text>
      </Box>
    );
  }

  if (mode.kind === "result") {
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text color="green">✓ {mode.title}</Text>
        {mode.lines.map((l, i) => (
          <Text key={i}>{l}</Text>
        ))}
        <Box marginTop={1}>
          <Text dimColor>esc to go back</Text>
        </Box>
      </Box>
    );
  }

  if (mode.kind === "open-url") {
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text color="green">✓ {mode.title}</Text>
        <Box marginTop={1}>
          <Text>
            If it didn't open:{" "}
            <Link url={mode.url}>
              <Text color="cyan" underline>
                {mode.url}
              </Text>
            </Link>
          </Text>
        </Box>
        <Box marginTop={1}>
          <Text dimColor>esc to go back</Text>
        </Box>
      </Box>
    );
  }

  // --- list ----------------------------------------------------------------
  if (mode.kind === "list") {
    if (!agents.length) {
      return (
        <Box flexDirection="column" marginTop={1} paddingX={1}>
          <Text bold>Agents</Text>
          <Text dimColor>No agents yet. Create one with `voiceai agents create --file agent.json`.</Text>
          <Box marginTop={1}>
            <Text dimColor>esc to go back</Text>
          </Box>
        </Box>
      );
    }
    const items = agents.map((a) => ({
      label: `${a.name ?? "(unnamed)"}  ·  ${a.language ?? "?"}/${a.region ?? "?"}`,
      value: a.id,
    }));
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text bold>Agents ({agents.length})</Text>
        <Box marginTop={1}>
          <SelectInput
            items={items}
            limit={10}
            onSelect={(item) => {
              const agent = agents.find((a) => a.id === item.value);
              if (agent) setMode({ kind: "detail", agent });
            }}
          />
        </Box>
        <Box marginTop={1}>
          <Text dimColor>↑↓ choose · enter open · esc back</Text>
        </Box>
      </Box>
    );
  }

  // --- detail (+ actions) --------------------------------------------------
  if (mode.kind === "detail") {
    const a = mode.agent;
    // Outbound dispatch needs a telephony (outbound SIP) connection on the agent.
    const canDispatch = Boolean(a.sip_outbound_trunk_id);
    const actions = [
      ...(canDispatch ? [{ label: "📞  Dispatch a call", value: "dispatch" }] : []),
      { label: "📋  View calls", value: "calls" },
      { label: "🌐  Test in browser (dashboard)", value: "test" },
      { label: "📑  Duplicate", value: "duplicate" },
      { label: "🗑   Delete", value: "delete" },
      { label: "←   Back to list", value: "back" },
    ];
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text bold>{a.name ?? "(unnamed)"}</Text>
        <Text dimColor>id: {a.id}</Text>
        <Text dimColor>
          language: {a.language ?? "?"} · region: {a.region ?? "?"}
          {a.created_at ? ` · created: ${fmtDate(a.created_at)}` : ""}
        </Text>
        {!canDispatch && (
          <Text dimColor>No outbound number configured — call dispatch unavailable.</Text>
        )}
        <Box marginTop={1}>
          <SelectInput
            items={actions}
            onSelect={(item) => {
              switch (item.value) {
                case "dispatch":
                  setPhone("");
                  setMode({ kind: "dispatch", agent: a });
                  break;
                case "calls":
                  void openCalls(a);
                  break;
                case "test":
                  testInBrowser(a);
                  break;
                case "duplicate":
                  void duplicate(a);
                  break;
                case "delete":
                  setMode({ kind: "confirm-delete", agent: a });
                  break;
                case "back":
                  setMode({ kind: "list" });
                  break;
              }
            }}
          />
        </Box>
        <Box marginTop={1}>
          <Text dimColor>esc back · edit agents with `voiceai agents update --file`</Text>
        </Box>
      </Box>
    );
  }

  // --- dispatch a call -----------------------------------------------------
  if (mode.kind === "dispatch") {
    const a = mode.agent;
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text bold>Dispatch a call · {a.name ?? a.id}</Text>
        <Box marginTop={1}>
          <Text color="yellow">Phone (E.164) </Text>
          <TextInput
            value={phone}
            onChange={setPhone}
            placeholder="+15551234567"
            onSubmit={(raw) => void dispatchCall(a, raw.trim())}
          />
        </Box>
        <Box marginTop={1}>
          <Text dimColor>enter to dispatch · esc to cancel</Text>
        </Box>
      </Box>
    );
  }

  // --- calls list ----------------------------------------------------------
  if (mode.kind === "calls") {
    if (mode.loading) {
      return (
        <Box marginTop={1} paddingX={1}>
          <Text>
            <BrandSpinner /> Loading calls…
          </Text>
        </Box>
      );
    }
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text bold>Calls · {mode.agent.name ?? mode.agent.id}</Text>
        {mode.items.length === 0 ? (
          <Box marginTop={1}>
            <Text dimColor>No calls yet.</Text>
          </Box>
        ) : (
          <Box flexDirection="column" marginTop={1}>
            <CallRow header />
            {mode.items.map((c, i) => (
              <CallRow key={c.id ?? i} c={c} />
            ))}
          </Box>
        )}
        <Box marginTop={1}>
          <Text dimColor>{mode.items.length} call{mode.items.length === 1 ? "" : "s"} · dates in local time · esc to go back</Text>
        </Box>
      </Box>
    );
  }

  // --- confirm delete ------------------------------------------------------
  if (mode.kind === "confirm-delete") {
    const a = mode.agent;
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text color="red">Delete agent "{a.name ?? a.id}"? This can't be undone.</Text>
        <Box marginTop={1}>
          <SelectInput
            items={[
              { label: "No, keep it", value: "no" },
              { label: "Yes, delete", value: "yes" },
            ]}
            onSelect={(item) => {
              if (item.value === "yes") void doDelete(a);
              else setMode({ kind: "detail", agent: a });
            }}
          />
        </Box>
        <Text dimColor>esc to cancel</Text>
      </Box>
    );
  }

  return <Text />;

  // --- actions -------------------------------------------------------------

  async function dispatchCall(agent: Agent, phoneNumber: string): Promise<void> {
    if (!phoneNumber) return;
    setMode({ kind: "busy", label: `Dispatching call to ${phoneNumber}…` });
    const r = await agentsRequest<{ call_id?: string; message?: string }>("POST", `/v1/agents/${agent.id}/calls`, {
      body: { phone_number: phoneNumber },
    });
    if (!r.ok) {
      setMode({ kind: "error", message: formatAgentsError(r), back: { kind: "detail", agent } });
      return;
    }
    setMode({
      kind: "result",
      title: "Call dispatched",
      lines: [`call_id: ${r.data?.call_id ?? ""}`, ...(r.data?.message ? [r.data.message] : [])],
      back: { kind: "detail", agent },
    });
  }

  async function openCalls(agent: Agent): Promise<void> {
    setMode({ kind: "calls", agent, loading: true, items: [] });
    const r = await agentsRequest<{ items?: CallItem[] }>("GET", `/v1/agents/${agent.id}/calls`);
    if (!r.ok) {
      setMode({ kind: "error", message: formatAgentsError(r), back: { kind: "detail", agent } });
      return;
    }
    setMode({ kind: "calls", agent, loading: false, items: r.data?.items ?? [] });
  }

  function testInBrowser(agent: Agent): void {
    // A web session is browser/WebRTC (mic + speaker) — open the dashboard tester
    // rather than dumping a LiveKit token. Raw sessions stay in `voiceai agents web-sessions create`.
    const url = `${DASHBOARD_URL}/agent-infra/${agent.id}/test`;
    openExternal(url);
    setMode({ kind: "open-url", title: "Opening the browser tester in your dashboard…", url, back: { kind: "detail", agent } });
  }

  async function duplicate(agent: Agent): Promise<void> {
    setMode({ kind: "busy", label: `Duplicating ${agent.name ?? agent.id}…` });
    const r = await agentsRequest<Agent>("POST", `/v1/agents/${agent.id}/duplicate`, { body: {} });
    if (!r.ok) {
      setMode({ kind: "error", message: formatAgentsError(r), back: { kind: "detail", agent } });
      return;
    }
    await loadAgents();
  }

  async function doDelete(agent: Agent): Promise<void> {
    setMode({ kind: "busy", label: `Deleting ${agent.name ?? agent.id}…` });
    const r = await agentsRequest("DELETE", `/v1/agents/${agent.id}`);
    if (!r.ok) {
      setMode({ kind: "error", message: formatAgentsError(r), back: { kind: "detail", agent } });
      return;
    }
    await loadAgents();
  }
}
