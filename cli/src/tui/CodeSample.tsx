import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import SyntaxHighlight from "ink-syntax-highlight";

export type Lang = "typescript" | "python" | "curl";

// cli-highlight uses highlight.js language names; "bash" works well for curl.
const HL_LANGUAGE: Record<Lang, string> = {
  typescript: "typescript",
  python: "python",
  curl: "bash",
};

interface Props {
  modelVariant: string;
  voice: string;
  text: string;
  region?: string;
  worldPart?: string;
}

/** Self-contained component that renders an executable snippet for the
 *  current TTS selection in TS, Python, or curl. Press `tab` to cycle. */
export function CodeSample({ modelVariant, voice, text, region, worldPart }: Props): React.ReactElement {
  const [lang, setLang] = useState<Lang>("typescript");

  useInput((input, key) => {
    if (key.tab) {
      setLang((l) => (l === "typescript" ? "python" : l === "python" ? "curl" : "typescript"));
    }
  });

  const sample = render(lang, { modelVariant, voice, text, region, worldPart });

  return (
    <Box flexDirection="column" marginTop={1} borderStyle="round" borderColor="gray" paddingX={1}>
      <Box>
        <Text bold>Code sample </Text>
        <Text color={lang === "typescript" ? "cyan" : "gray"}> typescript </Text>
        <Text dimColor>/</Text>
        <Text color={lang === "python" ? "cyan" : "gray"}> python </Text>
        <Text dimColor>/</Text>
        <Text color={lang === "curl" ? "cyan" : "gray"}> curl </Text>
        <Text dimColor>  (tab to cycle)</Text>
      </Box>
      <Box marginTop={1}>
        <SyntaxHighlight code={sample} language={HL_LANGUAGE[lang]} />
      </Box>
    </Box>
  );
}

function escapeQuotes(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function render(lang: Lang, p: Props): string {
  const { modelVariant, voice, text, region, worldPart } = p;
  const body: string[] = [`voice: "${escapeQuotes(voice)}"`, `text: "${escapeQuotes(text)}"`];
  if (region) body.push(`region: "${region}"`);
  if (worldPart) body.push(`"world-part": "${worldPart}"`);

  if (lang === "typescript") {
    return `import Slng from "voiceai-sdk";

const client = new Slng({ apiKey: process.env.VOICEAI_API_KEY! });
const response = await client.textToSpeech.create(
  "${modelVariant}",
  {
    ${body.join(",\n    ")},
  },
);
const audio = new Uint8Array(await (await response.blob()).arrayBuffer());`;
  }

  if (lang === "python") {
    const pyBody: string[] = [`voice="${escapeQuotes(voice)}"`, `text="${escapeQuotes(text)}"`];
    if (region) pyBody.push(`region="${region}"`);
    if (worldPart) pyBody.push(`world_part="${worldPart}"`);
    return `import os
from voiceai_sdk import Slng

client = Slng(api_key=os.environ["VOICEAI_API_KEY"])
response = client.text_to_speech.create(
    model_variant="${modelVariant}",
    ${pyBody.join(",\n    ")},
)
response.write_to_file("out.mp3")`;
  }

  // curl
  const headers = [
    `-H "Authorization: Bearer $VOICEAI_API_KEY"`,
    `-H "Content-Type: application/json"`,
  ].join(" \\\n  ");
  const query: string[] = [];
  if (region) query.push(`region=${region}`);
  if (worldPart) query.push(`world-part=${worldPart}`);
  const qs = query.length ? `?${query.join("&")}` : "";
  const jsonBody = JSON.stringify({ voice, text }, null, 2);
  return `curl -X POST "https://api.slng.ai/v1/bridges/unmute/tts/${modelVariant}${qs}" \\
  ${headers} \\
  -d '${jsonBody}' \\
  --output out.mp3`;
}
