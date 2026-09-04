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
  updateSecret,
  valueCell,
  type Kind,
  type VaultEntry,
} from "../commands/secret";
import { ErrorView, FieldList, Loading, ResultView, pad } from "./resourceKit";

interface Props {
  onExit: () => void;
}

const COLS = { name: 28, kind: 10, value: 7 };
const CREATE_VALUE = "__create__";

function rowLabel(s: VaultEntry): string {
  return (
    pad(s.name, COLS.name) +
    pad(s.kind, COLS.kind) +
    pad(valueCell(s.has_value), COLS.value) +
    (s.description ?? "-")
  );
}

/** Field dump for an already-redacted entry (booleans shown as yes/no). */
function secretFields(entry: Record<string, unknown>): [string, string][] {
  const first = ["name", "kind", "has_value", "description", "revision", "is_managed"];
  const keys = [...first, ...Object.keys(entry).filter((k) => !first.includes(k))];
  return keys.map((k) => {
    const v = entry[k];
    const shown =
      typeof v === "boolean"
        ? valueCell(v)
        : v === null || v === undefined || v === ""
          ? "-"
          : String(v);
    return [k, shown] as [string, string];
  });
}

type Mode =
  | { kind: "loading" }
  | { kind: "list" }
  | { kind: "detail-loading"; name: string }
  | { kind: "detail"; entry: Record<string, unknown> }
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
  };

  useInput((_input, key) => {
    if (!key.escape) return;
    switch (mode.kind) {
      case "list":
        onExit();
        break;
      case "detail":
        setMode({ kind: "list" });
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
      ...secrets.map((s) => ({ label: rowLabel(s), value: s.name })),
    ];
    const header = "  " + pad("NAME", COLS.name) + pad("KIND", COLS.kind) + pad("VALUE", COLS.value) + "DESCRIPTION";
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text bold>Secrets ({secrets.length})</Text>
        <Text dimColor>values are never shown</Text>
        <Box marginTop={1} flexDirection="column">
          <Text dimColor>{header}</Text>
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
        <Box marginTop={1}>
          <Text dimColor>↑↓ choose · enter open · esc back</Text>
        </Box>
      </Box>
    );
  }

  if (mode.kind === "detail") {
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <FieldList entries={secretFields(mode.entry)} />
        <Box marginTop={1}>
          <Text dimColor>esc to go back · the value is never displayed</Text>
        </Box>
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
            onChange={setDraftName}
            placeholder="STRIPE_KEY"
            onSubmit={(raw) => {
              if (raw.trim()) setMode({ kind: "create-kind" });
            }}
          />
        </Box>
        <Box marginTop={1}>
          <Text dimColor>enter to continue · esc to cancel</Text>
        </Box>
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
        <Box marginTop={1}>
          <Text dimColor>secret = sensitive · variable = non-sensitive config · esc back</Text>
        </Box>
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
        <Box marginTop={1}>
          <Text dimColor>input is masked · enter to save · esc back</Text>
        </Box>
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
        <Box marginTop={1}>
          <Text dimColor>esc to go back</Text>
        </Box>
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
