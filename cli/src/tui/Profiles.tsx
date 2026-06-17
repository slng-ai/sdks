import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import SelectInput from "ink-select-input";
import TextInput from "ink-text-input";
import {
  addProfile,
  currentProfile,
  listProfiles,
  removeProfile,
  useProfile,
} from "../lib/config";
import { verifyApiKey } from "../lib/verify";
import { BrandSpinner } from "./BrandSpinner";

type Mode =
  | { kind: "list" }
  | { kind: "add-name" }
  | { kind: "add-key"; name: string }
  | { kind: "confirm-delete"; name: string };

interface Props {
  onExit: () => void;
}

const ADD_VALUE = "__add__";
const REMOVE_VALUE = "__remove__";

export function Profiles({ onExit }: Props): React.ReactElement {
  const [mode, setMode] = useState<Mode>({ kind: "list" });
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string>("");
  const [checking, setChecking] = useState(false);
  // Bump to force the list view to re-read currentProfile/listProfiles after
  // a mutation. The lib reads from disk on every call, so bumping a key is
  // enough to trigger a render with fresh values.
  const [tick, setTick] = useState(0);
  const refresh = () => setTick((n) => n + 1);

  useInput((_input, key) => {
    if (!key.escape) return;
    if (mode.kind === "list") {
      onExit();
    } else {
      setMode({ kind: "list" });
      setDraft("");
      setError("");
      setChecking(false);
    }
  });

  if (mode.kind === "add-name") {
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text bold>New profile</Text>
        <Box marginTop={1}>
          <Text color="yellow">Name </Text>
          <TextInput
            value={draft}
            onChange={(v) => {
              setDraft(v);
              if (error) setError("");
            }}
            onSubmit={(raw) => {
              const name = raw.trim();
              if (!name) {
                setError("Profile name is required.");
                return;
              }
              if (!/^[A-Za-z0-9._-]+$/.test(name)) {
                setError("Use letters, numbers, dot, dash, or underscore.");
                return;
              }
              if (listProfiles().includes(name)) {
                setError(`Profile "${name}" already exists.`);
                return;
              }
              setError("");
              setDraft("");
              setMode({ kind: "add-key", name });
            }}
          />
        </Box>
        {error && (
          <Box marginTop={1}>
            <Text color="red">✗ {error}</Text>
          </Box>
        )}
        <Text dimColor>enter to continue · esc to cancel</Text>
      </Box>
    );
  }

  if (mode.kind === "add-key") {
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text bold>New profile: {mode.name}</Text>
        <Box marginTop={1}>
          <Text color="yellow">API key </Text>
          <Text dimColor>(slng_cu_…) </Text>
          <TextInput
            value={draft}
            onChange={(v) => {
              setDraft(v);
              if (error) setError("");
            }}
            onSubmit={async (raw) => {
              if (checking) return;
              const apiKey = raw.trim();
              if (!apiKey) {
                setError("API key is required.");
                return;
              }
              if (!apiKey.startsWith("slng_")) {
                setError("That doesn't look like a Slng API key (expected slng_cu_…).");
                return;
              }

              // Verify against /v1/me before persisting the profile.
              setError("");
              setChecking(true);
              const result = await verifyApiKey(apiKey);
              setChecking(false);
              if (!result.ok) {
                if (result.status === 401 || result.status === 403) {
                  setError("That key didn't work. Check it and try again.");
                } else if (result.error) {
                  setError("Couldn't reach SLNG to check your key. Check your connection and try again.");
                } else {
                  setError(`Couldn't check your key right now (status ${result.status}). Try again.`);
                }
                return;
              }

              try {
                addProfile(mode.name, { apiKey });
                useProfile(mode.name);
              } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
                return;
              }
              onExit();
            }}
            mask="*"
          />
        </Box>
        {checking && (
          <Box marginTop={1}>
            <Text>
              <BrandSpinner /> Checking your key…
            </Text>
          </Box>
        )}
        {error && !checking && (
          <Box marginTop={1}>
            <Text color="red">✗ {error}</Text>
          </Box>
        )}
        <Text dimColor>enter to save · esc to cancel</Text>
      </Box>
    );
  }

  if (mode.kind === "confirm-delete") {
    return (
      <Box flexDirection="column" marginTop={1} paddingX={1}>
        <Text bold>Delete profile "{mode.name}"?</Text>
        <Text dimColor>This removes its stored API key and settings.</Text>
        <Box marginTop={1}>
          <SelectInput
            items={[
              { label: "No, keep it", value: false },
              { label: "Yes, delete", value: true },
            ]}
            onSelect={(item) => {
              if (!item.value) {
                setMode({ kind: "list" });
                return;
              }
              try {
                removeProfile(mode.name);
              } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
                setMode({ kind: "list" });
                return;
              }
              onExit();
            }}
          />
        </Box>
        <Text dimColor>enter to confirm · esc to cancel</Text>
      </Box>
    );
  }

  // mode.kind === "list"
  const _ = tick; // read tick so the closure re-runs after mutations
  void _;
  const profiles = listProfiles();
  const active = currentProfile();
  const onlyOne = profiles.length <= 1;

  const items = [
    ...profiles.map((name) => ({
      label: `${name === active ? "★ " : "  "}${name}`,
      value: name,
    })),
    { label: "  + Add new profile…", value: ADD_VALUE },
    {
      label: onlyOne
        ? `  − Remove current (only one profile — disabled)`
        : `  − Remove current (${active})…`,
      value: REMOVE_VALUE,
    },
  ];

  return (
    <Box flexDirection="column" marginTop={1} paddingX={1}>
      <Text bold>Profiles</Text>
      <Text dimColor>★ marks the current profile · esc to go back</Text>
      <Box marginTop={1}>
        <SelectInput
          items={items}
          onSelect={(item) => {
            if (item.value === ADD_VALUE) {
              setDraft("");
              setError("");
              setMode({ kind: "add-name" });
              return;
            }
            if (item.value === REMOVE_VALUE) {
              if (onlyOne) {
                setError("Cannot remove the only profile.");
                refresh();
                return;
              }
              setError("");
              setMode({ kind: "confirm-delete", name: active });
              return;
            }
            // Switching to an existing profile.
            if (item.value === active) {
              // No-op switch — just exit.
              onExit();
              return;
            }
            try {
              useProfile(item.value);
            } catch (err) {
              setError(err instanceof Error ? err.message : String(err));
              refresh();
              return;
            }
            onExit();
          }}
        />
      </Box>
      {error && (
        <Box marginTop={1}>
          <Text color="red">✗ {error}</Text>
        </Box>
      )}
    </Box>
  );
}
