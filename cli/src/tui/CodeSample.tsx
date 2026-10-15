import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import SyntaxHighlight from "ink-syntax-highlight";
import { KeyHints } from "./resourceKit";
import { TTS_SAMPLE_RATE } from "../lib/bridge";

export type Lang = "typescript" | "python" | "shell";

// cli-highlight uses highlight.js language names.
const HL_LANGUAGE: Record<Lang, string> = {
  typescript: "typescript",
  python: "python",
  shell: "bash",
};

interface Props {
  modelVariant: string;
  voice: string;
  text: string;
  region?: string;
  worldPart?: string;
  /** The gateway this key uses. The SDK's built-in default host no longer resolves. */
  baseUrl: string;
}

/** Self-contained component that renders an executable snippet for the
 *  current TTS selection in TS, Python, or shell. Press `tab` to cycle. */
export function CodeSample({ modelVariant, voice, text, region, worldPart, baseUrl }: Props): React.ReactElement {
  const [lang, setLang] = useState<Lang>("typescript");

  useInput((input, key) => {
    if (key.tab) {
      setLang((l) => (l === "typescript" ? "python" : l === "python" ? "shell" : "typescript"));
    }
  });

  const sample = renderSample(lang, { modelVariant, voice, text, region, worldPart, baseUrl });

  return (
    <Box flexDirection="column" marginTop={1} borderStyle="round" borderColor="gray" paddingX={1}>
      <Box>
        <Text bold>Code sample </Text>
        <Text color={lang === "typescript" ? "cyan" : "gray"}> typescript </Text>
        <Text dimColor>/</Text>
        <Text color={lang === "python" ? "cyan" : "gray"}> python </Text>
        <Text dimColor>/</Text>
        <Text color={lang === "shell" ? "cyan" : "gray"}> shell </Text>
      </Box>
      <Box marginTop={1}>
        <SyntaxHighlight code={sample} language={HL_LANGUAGE[lang]} />
      </Box>
      <KeyHints hints={[{ key: "tab", label: "cycle language" }]} />
    </Box>
  );
}

/** Single-quote a string for POSIX shells. */
function shellQuote(s: string): string {
  return `'${s.replace(/'/g, `'\\''`)}'`;
}

/** The bridge connect URL: https:// gateway → wss://, with region/world-part as query params. */
export function bridgeUrl(baseUrl: string, model: string, region?: string, worldPart?: string): string {
  const q = new URLSearchParams();
  if (region) q.set("region", region);
  if (worldPart) q.set("world-part", worldPart);
  const qs = q.size ? `?${q}` : "";
  return `${baseUrl.replace(/\/+$/, "").replace(/^http/, "ws")}/v1/bridges/unmute/tts/${model}${qs}`;
}

// The bridge is WebSocket only (POST answers 405). Same protocol as synthesize() in lib/bridge.ts.
// JSON.stringify gives string literals that are valid in both TypeScript and Python.
export function renderSample(lang: Lang, p: Props): string {
  const { modelVariant, voice, text, region, worldPart, baseUrl } = p;
  const url = JSON.stringify(bridgeUrl(baseUrl, modelVariant, region, worldPart));
  const v = JSON.stringify(voice);
  const t = JSON.stringify(text);

  if (lang === "typescript") {
    return `// npm install ws
import WebSocket from "ws";
import { writeFileSync } from "node:fs";

const ws = new WebSocket(${url}, {
  headers: { Authorization: \`Bearer \${process.env.VOICEAI_API_KEY}\` },
});
const chunks: Buffer[] = [];

ws.on("open", () => {
  ws.send(JSON.stringify({ type: "init", voice: ${v}, config: { encoding: "linear16", sample_rate: ${TTS_SAMPLE_RATE} } }));
  ws.send(JSON.stringify({ type: "text", text: ${t} }));
  ws.send(JSON.stringify({ type: "flush" }));
});
ws.on("message", (data, isBinary) => {
  if (isBinary) return void chunks.push(data as Buffer); // 16-bit mono PCM
  const msg = JSON.parse(data.toString());
  if (msg.type === "audio_end") ws.close();
  if (msg.type === "error") throw new Error(JSON.stringify(msg));
});
// Raw PCM. Play it with: ffplay -f s16le -ar ${TTS_SAMPLE_RATE} -ch_layout mono out.pcm
ws.on("close", () => writeFileSync("out.pcm", Buffer.concat(chunks)));`;
  }

  if (lang === "python") {
    return `# pip install "websockets>=14"
import asyncio, json, os, wave
import websockets

async def main():
    pcm = bytearray()
    async with websockets.connect(
        ${url},
        additional_headers={"Authorization": f"Bearer {os.environ['VOICEAI_API_KEY']}"},
    ) as ws:
        await ws.send(json.dumps({"type": "init", "voice": ${v}, "config": {"encoding": "linear16", "sample_rate": ${TTS_SAMPLE_RATE}}}))
        await ws.send(json.dumps({"type": "text", "text": ${t}}))
        await ws.send(json.dumps({"type": "flush"}))
        async for msg in ws:
            if isinstance(msg, bytes):
                pcm += msg  # 16-bit mono PCM
                continue
            event = json.loads(msg)
            if event["type"] == "audio_end":
                break
            if event["type"] == "error":
                raise RuntimeError(event)
    with wave.open("out.wav", "wb") as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(${TTS_SAMPLE_RATE})
        f.writeframes(pcm)

asyncio.run(main())`;
  }

  const flags = [`-m ${shellQuote(modelVariant)}`, `-v ${shellQuote(voice)}`];
  if (region) flags.push(`--region ${shellQuote(region)}`);
  if (worldPart) flags.push(`--world-part ${shellQuote(worldPart)}`);
  return `voiceai tts ${shellQuote(text)} ${flags.join(" ")} --out out.wav`;
}
