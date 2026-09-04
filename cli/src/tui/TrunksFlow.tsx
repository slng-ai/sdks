import React, { useEffect, useState } from "react";
import { Box, Text, useInput } from "ink";
import SelectInput from "ink-select-input";
import {
  COMPLETENESS_NOTE,
  DIRECTIONS,
  NO_AGENTS_ERROR,
  agentViews,
  cell,
  collectTrunks,
  mergeReports,
  usableCell,
  type Direction,
  type Report,
  type Trunk,
} from "../commands/trunks";
import { ErrorView, FieldList, Loading, pad } from "./resourceKit";

interface Props {
  onExit: () => void;
}

const COLS = { direction: 10, name: 24, numbers: 18, status: 12, usable: 24 };

function rowLabel(t: Trunk): string {
  return (
    pad(t.direction, COLS.direction) +
    pad(t.name, COLS.name) +
    pad(cell(t.numbers.join(",")), COLS.numbers) +
    pad(cell(t.status), COLS.status) +
    pad(usableCell(t), COLS.usable) +
    cell(t.in_use_by)
  );
}

function trunkFields(trunk: Trunk): [string, string][] {
  return [
    ["name", trunk.name],
    ["direction", trunk.direction],
    ["numbers", cell(trunk.numbers.join(", "))],
    ["status", cell(trunk.status)],
    ["usable", usableCell(trunk)],
    ["in use by", cell(trunk.in_use_by)],
    ["id", trunk.id],
    ["livekit_trunk_id", cell(trunk.livekit_trunk_id)],
  ];
}

type Mode =
  | { kind: "loading" }
  | { kind: "no-agents" }
  | { kind: "list" }
  | { kind: "detail"; trunk: Trunk }
  | { kind: "error"; message: string; back: Mode };

export function TrunksFlow({ onExit }: Props): React.ReactElement {
  const [reports, setReports] = useState<Report[]>([]);
  const [mode, setMode] = useState<Mode>({ kind: "loading" });
  // undefined = both directions; cycles inbound → outbound → both with `d`.
  const [filter, setFilter] = useState<Direction | undefined>(undefined);

  const loadList = async (): Promise<void> => {
    setMode({ kind: "loading" });
    try {
      setReports(await collectTrunks());
      setMode({ kind: "list" });
    } catch (e) {
      const message = (e as Error).message;
      // No agents is actionable, not a generic failure — name it.
      if (message === NO_AGENTS_ERROR) setMode({ kind: "no-agents" });
      else setMode({ kind: "error", message, back: { kind: "list" } });
    }
  };

  useEffect(() => {
    void loadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useInput((input, key) => {
    if (key.escape) {
      switch (mode.kind) {
        case "list":
        case "no-agents":
          onExit();
          break;
        case "detail":
          setMode({ kind: "list" });
          break;
        case "error":
          setMode(mode.back);
          break;
        // loading: ignore
      }
      return;
    }
    // `d` cycles the direction filter while on the list.
    if (mode.kind === "list" && (input === "d" || input === "D")) {
      setFilter((f) => (f === undefined ? "inbound" : f === "inbound" ? "outbound" : undefined));
    }
  });

  if (mode.kind === "loading") return <Loading label="Loading trunks…" />;
  if (mode.kind === "error") return <ErrorView message={mode.message} />;

  if (mode.kind === "no-agents") {
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text bold>Trunks</Text>
        <Text dimColor>{NO_AGENTS_ERROR}</Text>
        <Box marginTop={1}>
          <Text dimColor>esc to go back</Text>
        </Box>
      </Box>
    );
  }

  if (mode.kind === "list") {
    const all = mergeReports(reports);
    const trunks = filter ? all.filter((t) => t.direction === filter) : all;
    const header =
      "  " +
      pad("DIRECTION", COLS.direction) +
      pad("NAME", COLS.name) +
      pad("NUMBERS", COLS.numbers) +
      pad("STATUS", COLS.status) +
      pad("USABLE", COLS.usable) +
      "IN USE BY";
    if (!trunks.length) {
      return (
        <Box flexDirection="column" marginTop={1} paddingX={1}>
          <Text bold>Trunks</Text>
          <Text dimColor>No trunks found{filter ? ` on the ${filter} side` : ""}.</Text>
          <Box marginTop={1}>
            <Text dimColor>{filter ? "d cycle direction · " : ""}esc to go back</Text>
          </Box>
        </Box>
      );
    }
    // Trunk identity is (direction, id): the same name can exist on both sides.
    const items = trunks.map((t) => ({ label: rowLabel(t), value: `${t.direction}:${t.id}` }));
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text bold>
          Trunks ({trunks.length}){filter ? ` · ${filter}` : ""}
        </Text>
        <Box marginTop={1} flexDirection="column">
          <Text dimColor>{header}</Text>
          <SelectInput
            items={items}
            limit={10}
            onSelect={(item) => {
              const trunk = trunks.find((t) => `${t.direction}:${t.id}` === item.value);
              if (trunk) setMode({ kind: "detail", trunk });
            }}
          />
        </Box>
        <Box marginTop={1}>
          <Text dimColor>↑↓ choose · enter open · d cycle direction · esc back</Text>
        </Box>
        <Text dimColor>{COMPLETENESS_NOTE}</Text>
      </Box>
    );
  }

  // detail
  if (mode.kind === "detail") {
    const views = agentViews(reports, mode.trunk.direction, mode.trunk.id);
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <FieldList entries={trunkFields(mode.trunk)} />
        <Box marginTop={1} flexDirection="column">
          <Text dimColor>{"  " + pad("AGENT", 24) + pad("SELECTABLE", 12) + pad("CURRENT", 10) + "REASON"}</Text>
          {views.map((v, i) => (
            <Text key={v.agent + i}>
              {"  " +
                pad(v.agent, 24) +
                pad(v.selectable ? "yes" : "no", 12) +
                pad(v.is_current ? "yes" : "no", 10) +
                cell(v.unavailable_reason)}
            </Text>
          ))}
        </Box>
        <Box marginTop={1}>
          <Text dimColor>esc to go back</Text>
        </Box>
      </Box>
    );
  }

  return <Text />;
}
