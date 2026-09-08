import React, { useEffect, useState } from "react";
import { Box, Text, useInput } from "ink";
import SelectInput from "ink-select-input";
import TextInput from "ink-text-input";
import { formatAgentsError } from "../lib/agents";
import {
  KINDS,
  createSecret,
  getSecret,
  listSecrets,
  redact,
  secretNameError,
  updateSecret,
  valueCell,
  type Kind,
  type VaultEntry,
} from "../commands/secret";
import { DetailPanel, ErrorView, KeyHints, Loading, ResultView, dateWithAge, pad } from "./resourceKit";

interface Props {
  onExit: () => void;
}

const COLS = { name: 32, value: 8 };
const CREATE_VALUE = "__create__";

function rowLabel(s: VaultEntry): string {
  return (
    pad(s.name ?? "(unnamed)", COLS.name) +
    pad(valueCell(Boolean(s.has_value)), COLS.value) +
    (s.description ?? "-")
  );
}


type Mode =
  | { kind: "loading" }
  | { kind: "list" }
  | { kind: "detail-loading"; name: string }
  | { kind: "detail"; entry: Record<string, unknown> }
  | { kind: "change-value"; entry: Record<string, unknown> }
  | { kind: "create-name" }
  | { kind: "create-kind" }
  | { kind: "create-value"; entryKind: Kind }
  | { kind: "create-confirm-overwrite"; entryKind: Kind; value: string }
  | { kind: "busy"; label: string }
  | { kind: "result"; title: string; lines: string[]; back: Mode }
  | { kind: "error"; message: string; back: Mode };

export function SecretsFlow({ onExit }: Props): React.ReactElement {
  const [secrets, setSecrets] = useState<VaultEntry[]>([]);
  const [mode, setMode] = useState<Mode>({ kind: "loading" });
  const [draftName, setDraftName] = useState("");
  const [draftValue, setDraftValue] = useState("");
  const [nameError, setNameError] = useState("");

  const loadList = async (): Promise<void> => {
    setMode({ kind: "loading" });
    try {
      setSecrets(await listSecrets());
      setMode({ kind: "list" });
    } catch (e) {
      setMode({ kind: "error", message: (e as Error).message, back: { kind: "list" } });
    }
  };

  useEffect(() => {
    void loadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetDraft = (): void => {
    setDraftName("");
    setDraftValue("");
    setNameError("");
  };

  useInput((input, key) => {
    // `c` changes the value of the entry being viewed.
    if (mode.kind === "detail" && (input === "c" || input === "C")) {
      setDraftValue("");
      setMode({ kind: "change-value", entry: mode.entry });
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
      case "change-value":
        setMode({ kind: "detail", entry: mode.entry });
        break;
      case "create-name":
        resetDraft();
        setMode({ kind: "list" });
        break;
      case "create-kind":
        setMode({ kind: "create-name" });
        break;
      case "create-value":
        setMode({ kind: "create-kind" });
        break;
      case "create-confirm-overwrite":
        setMode({ kind: "create-value", entryKind: mode.entryKind });
        break;
      case "result":
      case "error":
        setMode(mode.back);
        break;
      // loading / detail-loading / busy: ignore esc
    }
  });

  if (mode.kind === "loading") return <Loading label="Loading secrets…" />;
  if (mode.kind === "detail-loading") return <Loading label={`Loading ${mode.name}…`} />;
  if (mode.kind === "busy") return <Loading label={mode.label} />;
  if (mode.kind === "error") return <ErrorView message={mode.message} />;
  if (mode.kind === "result") return <ResultView title={mode.title} lines={mode.lines} />;

  if (mode.kind === "list") {
    const items = [
      { label: "＋  Create entry", value: CREATE_VALUE },
      ...secrets.map((s) => ({ label: rowLabel(s), value: s.name ?? "" })),
    ];
    const header = "  " + pad("NAME", COLS.name) + pad("VALUE", COLS.value) + "DESCRIPTION";
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text bold>Secrets ({secrets.length})</Text>
        <Text dimColor>values are never shown</Text>
        <Box marginTop={1} flexDirection="column">
          {secrets.length > 0 ? <Text dimColor>{header}</Text> : null}
          <SelectInput
            items={items}
            limit={10}
            onSelect={(item) => {
              if (item.value === CREATE_VALUE) {
                resetDraft();
                setMode({ kind: "create-name" });
              } else {
                void openSecret(item.value);
              }
            }}
          />
        </Box>
        <KeyHints hints={[{ key: "esc", label: "back", nav: true }]} />
      </Box>
    );
  }

  if (mode.kind === "detail") {
    const e = mode.entry;
    const kind = String(e.kind ?? "secret");
    const managed = e.is_managed === true;
    const created = e.created_at;
    const updated = e.updated_at;
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <DetailPanel
          icon="🔑"
          title={String(e.name ?? "")}
          badges={[
            { text: kind, color: kind === "secret" ? "yellow" : "cyan" },
            { text: managed ? "managed" : "unmanaged", color: managed ? "yellow" : undefined },
          ]}
          sections={[
            {
              fields: [
                ["Has value", e.has_value ? "yes" : "no", e.has_value ? "green" : undefined],
                ["Revision", String(e.revision ?? "-")],
                ["Description", e.description ? String(e.description) : "—"],
              ],
            },
            {
              title: "Timestamps",
              fields: [
                ["Created", dateWithAge(created)],
                ["Updated", updated && updated !== created ? dateWithAge(updated) : "unchanged"],
                ["Rotated", e.last_rotated_at ? dateWithAge(e.last_rotated_at) : "never"],
              ],
            },
            {
              title: "Reference",
              dim: true,
              fields: [
                ["ID", String(e.id ?? "—")],
                ["Org", String(e.organisation_id ?? "—")],
                ["Created by", String(e.created_by ?? "—")],
              ],
            },
          ]}
        />
        <KeyHints
          hints={[
            { key: "c", label: "change value" },
            { key: "esc", label: "back", nav: true },
          ]}
          note="the value is never displayed"
        />
      </Box>
    );
  }

  if (mode.kind === "change-value") {
    const name = String(mode.entry.name ?? "");
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text bold>Change value · {name}</Text>
        <Box marginTop={1}>
          <Text color="yellow">New value </Text>
          <TextInput
            value={draftValue}
            onChange={setDraftValue}
            mask="*"
            onSubmit={(raw) => {
              if (!raw) {
                setMode({
                  kind: "error",
                  message: "aborted: no value provided.",
                  back: { kind: "detail", entry: mode.entry },
                });
                return;
              }
              void write(name, (mode.entry.kind as Kind) || "secret", raw, true);
            }}
          />
        </Box>
        <KeyHints
          hints={[
            { key: "enter", label: "save", nav: true },
            { key: "esc", label: "cancel", nav: true },
          ]}
          note="input is masked"
        />
      </Box>
    );
  }

  if (mode.kind === "create-name") {
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text bold>New vault entry</Text>
        <Box marginTop={1}>
          <Text color="yellow">Name </Text>
          <TextInput
            value={draftName}
            onChange={(v) => {
              setDraftName(v);
              if (nameError) setNameError("");
            }}
            placeholder="STRIPE_API_KEY"
            onSubmit={(raw) => {
              const name = raw.trim();
              if (!name) return;
              // Mirror the server's SCREAMING_SNAKE_CASE rule before advancing.
              const err = secretNameError(name);
              if (err) {
                setNameError(err);
                return;
              }
              setDraftName(name);
              setMode({ kind: "create-kind" });
            }}
          />
        </Box>
        {nameError ? (
          <Box marginTop={1}>
            <Text color="red">✗ {nameError}</Text>
          </Box>
        ) : (
          <KeyHints
            hints={[
              { key: "enter", label: "continue", nav: true },
              { key: "esc", label: "cancel", nav: true },
            ]}
            note="SCREAMING_SNAKE_CASE"
          />
        )}
      </Box>
    );
  }

  if (mode.kind === "create-kind") {
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text bold>Kind · {draftName.trim()}</Text>
        <Box marginTop={1}>
          <SelectInput
            items={KINDS.map((k) => ({ label: k, value: k }))}
            onSelect={(item) => setMode({ kind: "create-value", entryKind: item.value as Kind })}
          />
        </Box>
        <KeyHints
          hints={[{ key: "esc", label: "back", nav: true }]}
          note="secret = sensitive · variable = non-sensitive config"
        />
      </Box>
    );
  }

  if (mode.kind === "create-value") {
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text bold>Value · {draftName.trim()}</Text>
        <Box marginTop={1}>
          <Text color="yellow">Value </Text>
          <TextInput
            value={draftValue}
            onChange={setDraftValue}
            mask="*"
            onSubmit={(raw) => {
              if (!raw) {
                setMode({ kind: "error", message: "aborted: no value provided.", back: { kind: "list" } });
                return;
              }
              const name = draftName.trim();
              const exists = secrets.some((s) => s.name === name);
              if (exists) {
                setMode({ kind: "create-confirm-overwrite", entryKind: mode.entryKind, value: raw });
              } else {
                void write(name, mode.entryKind, raw, false);
              }
            }}
          />
        </Box>
        <KeyHints
          hints={[
            { key: "enter", label: "create", nav: true },
            { key: "esc", label: "back", nav: true },
          ]}
          note="input is masked"
        />
      </Box>
    );
  }

  if (mode.kind === "create-confirm-overwrite") {
    const name = draftName.trim();
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text color="yellow">"{name}" already exists. Overwrite its value?</Text>
        <Box marginTop={1}>
          <SelectInput
            items={[
              { label: "No, keep it", value: "no" },
              { label: "Yes, overwrite", value: "yes" },
            ]}
            onSelect={(item) => {
              if (item.value === "yes") void write(name, mode.entryKind, mode.value, true);
              else setMode({ kind: "create-value", entryKind: mode.entryKind });
            }}
          />
        </Box>
        <KeyHints hints={[{ key: "esc", label: "back", nav: true }]} />
      </Box>
    );
  }

  return <Text />;

  async function openSecret(name: string): Promise<void> {
    setMode({ kind: "detail-loading", name });
    const res = await getSecret(name);
    if (res.status === 404) {
      setMode({ kind: "error", message: `secret "${name}" not found.`, back: { kind: "list" } });
      return;
    }
    if (!res.ok || !res.data) {
      setMode({ kind: "error", message: formatAgentsError(res), back: { kind: "list" } });
      return;
    }
    setMode({ kind: "detail", entry: redact(res.data) as unknown as Record<string, unknown> });
  }

  async function write(name: string, entryKind: Kind, value: string, overwrite: boolean): Promise<void> {
    setMode({ kind: "busy", label: `Saving ${name}…` });
    // The platform has no upsert: create for a new name, PATCH the value otherwise.
    const res = overwrite ? await updateSecret(name, value) : await createSecret(name, entryKind, value);
    if (!res.ok) {
      setMode({ kind: "error", message: formatAgentsError(res), back: { kind: "list" } });
      return;
    }
    try {
      setSecrets(await listSecrets());
    } catch {
      // best-effort refresh; the write already succeeded
    }
    resetDraft();
    setMode({
      kind: "result",
      title: `${overwrite ? "Overwrote" : "Created"} ${name}`,
      lines: [],
      back: { kind: "list" },
    });
  }
}
