import { describe, expect, test } from "bun:test";
import { bridgeUrl, renderSample } from "./CodeSample";

const p = {
  modelVariant: "slng/fish/tts:s2.1-pro",
  voice: "v1",
  text: `it's "quoted"`,
  baseUrl: "https://eu.example.ai/",
};

describe("CodeSample", () => {
  test("bridgeUrl turns the https gateway into wss and adds region params", () => {
    expect(bridgeUrl(p.baseUrl, p.modelVariant)).toBe("wss://eu.example.ai/v1/bridges/unmute/tts/slng/fish/tts:s2.1-pro");
    expect(bridgeUrl("http://localhost:8080", "m", "eu-west", "eu")).toBe(
      "ws://localhost:8080/v1/bridges/unmute/tts/m?region=eu-west&world-part=eu",
    );
  });

  test("code samples use the WebSocket, never an HTTP POST", () => {
    for (const lang of ["typescript", "python"] as const) {
      const s = renderSample(lang, p);
      expect(s).toContain('"wss://eu.example.ai/v1/bridges/unmute/tts/slng/fish/tts:s2.1-pro"');
      expect(s).toContain(JSON.stringify(p.text));
      expect(s).not.toContain("POST");
    }
  });

  test("shell sample calls voiceai tts with single-quoted args", () => {
    expect(renderSample("shell", { ...p, region: "eu-west" })).toBe(
      `voiceai tts 'it'\\''s "quoted"' -m 'slng/fish/tts:s2.1-pro' -v 'v1' --region 'eu-west' --out out.wav`,
    );
  });
});
