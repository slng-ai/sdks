import { describe, expect, it } from "bun:test";
import { StreamingClient } from "./client";

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
});
