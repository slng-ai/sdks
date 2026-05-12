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
    await expect(c.connectStt("deepgram/nova:3", ac.signal)).rejects.toThrow();
  });
});
