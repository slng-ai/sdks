import { describe, expect, it } from "bun:test";
import type { IncomingHttpHeaders } from "node:http";
import { WebSocketServer } from "ws";
import { StreamingClient } from "./client";

/** Open one session against a local server and return the handshake headers it saw. */
async function handshakeHeaders(projectId?: string): Promise<IncomingHttpHeaders> {
  const wss = new WebSocketServer({ port: 0 });
  await new Promise((r) => wss.once("listening", r));
  const seen = new Promise<IncomingHttpHeaders>((r) => wss.once("connection", (_ws, req) => r(req.headers)));
  const { port } = wss.address() as { port: number };
  const c = new StreamingClient({ apiKey: "test", baseUrl: `ws://127.0.0.1:${port}`, projectId });
  const session = await c.connectTts("slng/deepgram/aura:2-en");
  const headers = await seen;
  session.close();
  await new Promise((r) => wss.close(r));
  return headers;
}

describe("StreamingClient", () => {
  it("is importable and instantiable", () => {
    const c = new StreamingClient({ apiKey: "test" });
    expect(c).toBeInstanceOf(StreamingClient);
  });

  it("rejects connect when aborted", async () => {
    const c = new StreamingClient({ apiKey: "test", baseUrl: "wss://localhost:1" });
    const ac = new AbortController();
    queueMicrotask(() => ac.abort());
    await expect(c.connectStt("deepgram/nova:3", { signal: ac.signal })).rejects.toThrow(
      "aborted",
    );
  });

  it("rejects connect when the handshake fails, with no unhandled error", async () => {
    const c = new StreamingClient({ apiKey: "test", baseUrl: "wss://127.0.0.1:1" });
    await expect(c.connectStt("deepgram/nova:3")).rejects.toThrow();
    // a failed handshake emits `error` a second time on close; give it a tick
    // to arrive, since an unlistened one crashes the process.
    await new Promise((r) => setTimeout(r, 50));
  });

  it("sends X-SLNG-Project-Id when projectId is set", async () => {
    const headers = await handshakeHeaders("0b7e6c2a-1f3d-4a5b-9c8d-7e6f5a4b3c2d");
    expect(headers["x-slng-project-id"]).toBe("0b7e6c2a-1f3d-4a5b-9c8d-7e6f5a4b3c2d");
    expect(headers.authorization).toBe("Bearer test");
  });

  it("sends no project header when projectId is unset", async () => {
    const headers = await handshakeHeaders();
    expect(headers["x-slng-project-id"]).toBeUndefined();
  });
});
