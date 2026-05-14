import React, { useEffect, useRef, useState } from "react";
import { Box, Text, useInput } from "ink";
import SelectInput from "ink-select-input";
import TextInput from "ink-text-input";
import Spinner from "ink-spinner";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { homedir } from "node:os";
import { STT_MODELS, isSlngHosted } from "../lib/models";
import { SlngFirstItem } from "./SlngFirstItem";
import { makeClients } from "../lib/sdk";
import { recordPcm, listInputs, sniffExt } from "../lib/audio";
import { load, type SttMode } from "../lib/config";
import { copyToClipboard } from "../lib/clipboard";

type Step =
  | "pick-model"
  | "pick-mode"
  | "pick-input"
  | "enter-file"
  | "transcribing"
  | "recording"
  | "done"
  | "error";

interface Props {
  onExit: () => void;
}

export function SttFlow({ onExit }: Props): React.ReactElement {
  const cfg = load();
  const defaultModel = cfg.defaultSttModel;
  const defaultMode = cfg.defaultSttMode;

  // Initial step: skip picker(s) when defaults are configured.
  const initialStep: Step = defaultModel
    ? defaultMode === "file"
      ? "enter-file"
      : defaultMode === "mic"
        ? "recording"
        : "pick-mode"
    : "pick-model";

  const [step, setStep] = useState<Step>(initialStep);
  const [model, setModel] = useState<string>(defaultModel ?? "");
  const [filePath, setFilePath] = useState<string>(`${homedir()}/Downloads/`);
  const [fileError, setFileError] = useState<string>("");
  const [transcript, setTranscript] = useState<string>("");
  const [partial, setPartial] = useState<string>("");
  const [finals, setFinals] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [paused, setPaused] = useState(false);
  const [bytesSent, setBytesSent] = useState(0);
  const [msgsReceived, setMsgsReceived] = useState(0);
  const [lastMsgType, setLastMsgType] = useState<string>("");
  const [inputs, setInputs] = useState<string[]>([]);
  const [selectedInput, setSelectedInput] = useState<string>(cfg.defaultSttInput ?? "");
  const [lastMsgPreview, setLastMsgPreview] = useState<string>("");
  const stopRef = useRef<(() => void) | null>(null);
  const sendingRef = useRef<boolean>(true);
  const startedRef = useRef<boolean>(false);
  // Set true by SttDonePane while it owns a TextInput; the outer esc
  // handler defers to the pane's own cancel-listener in that case so
  // canceling a save path edit doesn't tear down the whole flow.
  const innerInteractiveRef = useRef<boolean>(false);

  useInput((input, key) => {
    if (key.escape) {
      if (innerInteractiveRef.current) return;
      if (step === "pick-mode") setStep("pick-model");
      else if (step === "pick-input") setStep(defaultMode ? "pick-model" : "pick-mode");
      else if (step === "enter-file") setStep(defaultMode ? "pick-model" : "pick-mode");
      else if (step === "recording") {
        // Finalize the mic session and route to the done pane so the
        // accumulated transcript can be saved/copied. A second esc from
        // the done pane returns to the menu (handled by the default branch).
        stopRef.current?.();
        const tail = partial.trim();
        const text = [...finals, ...(tail ? [tail] : [])].join(" ").trim();
        setTranscript(text);
        setStep("done");
      } else {
        stopRef.current?.();
        onExit();
      }
    }
    if (step === "recording" && input === " ") {
      setPaused((p) => {
        sendingRef.current = !sendingRef.current;
        return !p;
      });
    }
  });

  // Entry point: decide whether to show the input picker first. Skip only
  // when the user has a defaultSttInput configured. Otherwise show the
  // picker (with "(system default)" as an option) so the user can pick the
  // right mic — silently defaulting to the wrong device is the #1 reason
  // for empty transcripts.
  const beginMic = async (modelId: string) => {
    setModel(modelId);
    if (selectedInput) {
      await startMic(modelId, selectedInput);
      return;
    }
    const list = await listInputs();
    setInputs(list);
    setStep("pick-input");
  };

  const startMic = async (modelId: string, device: string) => {
    setStep("recording");
    try {
      const { streaming } = makeClients();
      const session = await streaming.connectStt(modelId);

      session.send({
        type: "init",
        config: {
          language: "en",
          sample_rate: 16000,
          encoding: "linear16",
          enable_partial_transcripts: true,
        },
      } as never);

      let sawAnyMessage = false;
      (async () => {
        for await (const msg of session) {
          sawAnyMessage = true;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const m = msg as any;
          setMsgsReceived((n) => n + 1);
          setLastMsgType(typeof m.type === "string" ? m.type : "(unknown)");
          // Truncated raw JSON for live debugging — strip pointer fields we
          // don't care about and cap at ~180 chars.
          try {
            const raw = JSON.stringify(m);
            setLastMsgPreview(raw.length > 180 ? raw.slice(0, 180) + "…" : raw);
          } catch {
            /* ignore */
          }

          if (m.type === "error" || m.variant === "SchemaError") {
            setError(JSON.stringify(m));
            setStep("error");
            continue;
          }

          // Unmute bridge tags the type (`partial_transcript` / `final_transcript`)
          // but the body keeps the provider's native shape — Deepgram puts
          // text at `channel.alternatives[0].transcript`, Soniox in `tokens[]`,
          // others on `text` or `transcript`. Match slng-stt-next's
          // protocol-agnostic extractor.
          const text =
            m.text ??
            m.transcript ??
            m.channel?.alternatives?.[0]?.transcript ??
            m.results?.[0]?.alternatives?.[0]?.transcript ??
            (Array.isArray(m.tokens) ? m.tokens.map((t: { text?: string }) => t.text ?? "").join("") : "") ??
            "";
          if (!text) continue;

          const isFinal =
            m.type === "final_transcript" ||
            m.is_final === true ||
            m.final === true ||
            m.speech_final === true;
          if (isFinal) {
            setPartial("");
            setFinals((prev) => [...prev, text]);
          } else {
            setPartial(text);
          }
        }
        // Iterator exited cleanly — server closed the WS. If we got nothing
        // back at all, surface that so we don't sit on an idle spinner.
        if (!sawAnyMessage) {
          setError("WebSocket closed by server with no messages. Likely the init was rejected — check model + try again.");
          setStep("error");
        }
      })().catch((e) => {
        setError((e as Error).message);
        setStep("error");
      });

      const rec = await recordPcm({ sampleRate: 16000, channels: 1, device });
      // Surface recorder failures (missing mic perm, no input device, etc.)
      // so we don't sit on a silent listening spinner.
      (async () => {
        const stderr = rec.proc.stderr as ReadableStream<Uint8Array> | undefined;
        const errText = stderr ? await new Response(stderr).text() : "";
        const exitCode = await rec.proc.exited;
        if (exitCode !== 0 && exitCode !== null) {
          setError(`recorder exited ${exitCode}: ${errText.trim() || "(no stderr)"}`);
          setStep("error");
        }
      })();
      stopRef.current = () => {
        rec.stop();
        session.send({ type: "finalize" } as never);
        session.send({ type: "close" } as never);
      };
      for await (const frame of rec.frames) {
        if (!sendingRef.current) continue;
        session.sendAudio(frame);
        setBytesSent((n) => n + frame.length);
      }
    } catch (e) {
      setError((e as Error).message);
      setStep("error");
    }
  };

  const transcribeFile = async (path: string) => {
    if (!existsSync(path)) {
      setFileError(`file not found: ${path}`);
      return;
    }
    setFileError("");
    setStep("transcribing");
    try {
      const { http } = makeClients();
      const bytes = readFileSync(path);
      const ext = sniffExt(new Uint8Array(bytes.subarray(0, 32)));
      const mime =
        ext === "wav" ? "audio/wav"
          : ext === "mp3" ? "audio/mpeg"
          : ext === "ogg" ? "audio/ogg"
          : ext === "m4a" ? "audio/mp4"
          : "application/octet-stream";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await (http as any).speechToText.create(model, {
        audio: new File([bytes], basename(path), { type: mime }),
      });
      // Response shape varies by provider; pull out a likely text field.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const r = response as any;
      const text =
        r?.transcript ??
        r?.text ??
        r?.results?.channels?.[0]?.alternatives?.[0]?.transcript ??
        JSON.stringify(response);
      setTranscript(typeof text === "string" ? text : JSON.stringify(text));
      setStep("done");
    } catch (e) {
      setError((e as Error).message);
      setStep("error");
    }
  };

  // Auto-start when defaults route us straight into recording.
  useEffect(() => {
    if (defaultModel && initialStep === "recording" && !startedRef.current) {
      startedRef.current = true;
      void beginMic(defaultModel);
    }
    return () => stopRef.current?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box flexDirection="column" marginTop={1} paddingX={1}>
      <Text bold>Speech → Text</Text>
      {defaultModel ? (
        <Text dimColor>
          using default model: {defaultModel}
          {defaultMode ? ` · mode: ${defaultMode}` : ""}
          {step !== "recording" ? " · esc to go back" : ""}
        </Text>
      ) : (
        step !== "recording" && <Text dimColor>esc to go back</Text>
      )}

      {step === "pick-model" && (
        <Box flexDirection="column" marginTop={1}>
          <Text>Model:</Text>
          <SelectInput
            items={STT_MODELS.map((m) => {
              const display = m.name ? `${m.name} (${m.id})` : m.id;
              return {
                label: isSlngHosted(m.id) ? `★ ${display}` : `  ${display}`,
                value: m.id,
              };
            })}
            itemComponent={SlngFirstItem}
            onSelect={(item) => {
              setModel(item.value);
              setStep("pick-mode");
            }}
          />
        </Box>
      )}

      {step === "pick-mode" && (
        <Box flexDirection="column" marginTop={1}>
          <Text>Source for <Text bold>{model}</Text>:</Text>
          <SelectInput
            items={[
              { label: "🎙  Microphone  (realtime)", value: "mic" as SttMode },
              { label: "📂 Audio file  (one-shot)", value: "file" as SttMode },
            ]}
            onSelect={(item) => {
              if (item.value === "mic") void beginMic(model);
              else setStep("enter-file");
            }}
          />
        </Box>
      )}

      {step === "pick-input" && (
        <Box flexDirection="column" marginTop={1}>
          <Text>Audio input device:</Text>
          <SelectInput
            items={[
              { label: "(system default)", value: "" },
              ...inputs.map((name) => ({ label: name, value: name })),
            ]}
            onSelect={(item) => {
              setSelectedInput(item.value);
              void startMic(model, item.value);
            }}
          />
          <Text dimColor>enter to record · esc to go back</Text>
        </Box>
      )}

      {step === "enter-file" && (
        <Box flexDirection="column" marginTop={1}>
          <Text>Audio file path:</Text>
          <TextInput
            value={filePath}
            onChange={setFilePath}
            onSubmit={(v) => transcribeFile(v.trim())}
          />
          {fileError && <Text color="red">✗ {fileError}</Text>}
          <Text dimColor>enter to transcribe · esc to go back</Text>
        </Box>
      )}

      {step === "transcribing" && (
        <Box marginTop={1}>
          <Text>
            <Spinner type="dots" /> Transcribing with <Text bold>{model}</Text>…
          </Text>
        </Box>
      )}

      {step === "recording" && (
        <Box flexDirection="column" marginTop={1}>
          <Text>
            <Text color={paused ? "yellow" : "red"}>●</Text> <Text bold>{model}</Text>
          </Text>
          <Text dimColor>
            sent {(bytesSent / 1024).toFixed(1)} kB · received {msgsReceived} msg
            {lastMsgType ? ` (last: ${lastMsgType})` : ""}
          </Text>
          {lastMsgPreview && (
            <Text dimColor>{lastMsgPreview}</Text>
          )}
          <Box flexDirection="column" marginTop={1}>
            {finals.slice(-8).map((line, i) => (
              <Text key={i}>{line}</Text>
            ))}
            {partial && (
              <Text dimColor italic>{partial}</Text>
            )}
            {finals.length === 0 && !partial && (
              <Text dimColor>
                <Spinner type="dots" /> listening…
              </Text>
            )}
          </Box>
          <Box marginTop={1}>
            <Text dimColor>space to {paused ? "resume" : "pause"} · esc to stop</Text>
          </Box>
        </Box>
      )}

      {step === "done" && (
        <SttDonePane
          model={model}
          transcript={transcript}
          interactiveRef={innerInteractiveRef}
        />
      )}

      {step === "error" && (
        <Box flexDirection="column" marginTop={1}>
          <Text color="red">✗ {error}</Text>
          <Text dimColor>esc to go back</Text>
        </Box>
      )}
    </Box>
  );
}

interface SttDonePaneProps {
  model: string;
  transcript: string;
  interactiveRef: React.MutableRefObject<boolean>;
}

/** Transcript-done pane. Keys: s = save to file · c = copy to clipboard · esc = back. */
function SttDonePane({ model, transcript, interactiveRef }: SttDonePaneProps): React.ReactElement {
  const [savingPath, setSavingPath] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  const defaultPath = defaultSttSavePath(model);

  useEffect(() => {
    interactiveRef.current = savingPath !== null;
    return () => {
      interactiveRef.current = false;
    };
  }, [savingPath, interactiveRef]);

  useInput((input) => {
    if (savingPath !== null) return; // text input takes over
    if (input === "s" || input === "S") {
      setSavingPath(defaultPath);
      setSaveError(null);
      setSaved(null);
    }
    if (input === "c" || input === "C") {
      setCopied(false);
      setCopyError(null);
      void (async () => {
        const result = await copyToClipboard(transcript);
        if (result.ok) setCopied(true);
        else setCopyError(result.error);
      })();
    }
  });

  const commitSave = (raw: string) => {
    const path = expandTilde(raw.trim() || defaultPath);
    try {
      writeFileSync(path, transcript);
      setSaved(path);
      setSavingPath(null);
    } catch (e) {
      setSaveError((e as Error).message);
    }
  };

  return (
    <Box flexDirection="column" marginTop={1}>
      <Text color="green">✓ Transcript</Text>
      <Box marginTop={1}>
        <Text>{transcript || "(empty)"}</Text>
      </Box>
      <Box marginTop={1}>
        <Text dimColor>s save to file · c copy clipboard · esc back</Text>
      </Box>

      {savingPath !== null && (
        <Box flexDirection="column" marginTop={1}>
          <Text>Save to: </Text>
          <TextInput value={savingPath} onChange={setSavingPath} onSubmit={commitSave} />
          {saveError && <Text color="red">✗ {saveError}</Text>}
          <Text dimColor>enter to save · esc to cancel</Text>
          <CancelSaveListener onCancel={() => setSavingPath(null)} />
        </Box>
      )}

      {saved && (
        <Box marginTop={1}>
          <Text color="green">✓ Saved to {saved}</Text>
        </Box>
      )}

      {copied && (
        <Box marginTop={1}>
          <Text color="green">✓ Copied to clipboard</Text>
        </Box>
      )}

      {copyError && (
        <Box marginTop={1}>
          <Text color="red">✗ {copyError}</Text>
        </Box>
      )}
    </Box>
  );
}

function CancelSaveListener({ onCancel }: { onCancel: () => void }): null {
  useInput((_input, key) => {
    if (key.escape) onCancel();
  });
  return null;
}

function defaultSttSavePath(model: string): string {
  const safeModel = model.replace(/[^A-Za-z0-9._-]+/g, "_");
  const ts = new Date().toISOString().replace(/[:T]/g, "-").slice(0, 19);
  return join(homedir(), "Downloads", `voiceai-stt-${safeModel}-${ts}.txt`);
}

function expandTilde(p: string): string {
  if (p.startsWith("~/")) return join(homedir(), p.slice(2));
  if (p === "~") return homedir();
  return resolve(p);
}
