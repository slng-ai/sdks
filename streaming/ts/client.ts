import WebSocket from "ws";
import type { UnmuteWsMessage } from "./messages";

export type Server = "production" | "staging";

const SERVERS: Record<Server, string> = {
  production: "wss://api.slng.ai",
  staging: "wss://stageapi.slng.ai",
};

export interface StreamingClientOptions {
  apiKey: string;
  server?: Server;
  baseUrl?: string;
}

export class StreamingClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(opts: StreamingClientOptions) {
    this.apiKey = opts.apiKey;
    this.baseUrl = opts.baseUrl ?? SERVERS[opts.server ?? "production"];
  }

  connectStt(modelVariant: string, signal?: AbortSignal): Promise<StreamingSession> {
    const path = `/v1/bridges/unmute/stt/${modelVariant}`;
    return this.connect(path, signal);
  }

  connectTts(modelVariant: string, signal?: AbortSignal): Promise<StreamingSession> {
    const path = `/v1/bridges/unmute/tts/${modelVariant}`;
    return this.connect(path, signal);
  }

  private connect(path: string, signal?: AbortSignal): Promise<StreamingSession> {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(`${this.baseUrl}${path}`, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      });
      const onOpen = () => {
        cleanup();
        resolve(new StreamingSession(ws));
      };
      const onError = (err: Error) => {
        cleanup();
        reject(err);
      };
      const onAbort = () => {
        cleanup();
        ws.terminate();
        reject(new Error("aborted"));
      };
      const cleanup = () => {
        ws.off("open", onOpen);
        ws.off("error", onError);
        signal?.removeEventListener("abort", onAbort);
      };
      ws.once("open", onOpen);
      ws.once("error", onError);
      signal?.addEventListener("abort", onAbort);
    });
  }
}

/**
 * One open WebSocket. Send typed messages with `send()`, receive them by
 * iterating with `for await (const msg of session)`. Errors and close events
 * terminate the iterator.
 */
export class StreamingSession implements AsyncIterable<UnmuteWsMessage> {
  private readonly ws: WebSocket;
  private readonly queue: UnmuteWsMessage[] = [];
  private resolvers: Array<(v: IteratorResult<UnmuteWsMessage>) => void> = [];
  private closed = false;
  private closeError: Error | null = null;

  constructor(ws: WebSocket) {
    this.ws = ws;
    ws.on("message", (data) => {
      let parsed: UnmuteWsMessage;
      try {
        parsed = JSON.parse(typeof data === "string" ? data : data.toString("utf8"));
      } catch (e) {
        this.fail(new Error(`invalid JSON from server: ${(e as Error).message}`));
        return;
      }
      this.push(parsed);
    });
    ws.on("close", () => this.finish());
    ws.on("error", (err) => this.fail(err));
  }

  send(message: UnmuteWsMessage): void {
    if (this.closed) throw new Error("session is closed");
    this.ws.send(JSON.stringify(message));
  }

  /** Convenience: base64-encode raw audio bytes and send as an audio message. */
  sendAudio(bytes: Uint8Array | Buffer, kind: "audio" | "audio_chunk" = "audio"): void {
    const b64 = Buffer.from(bytes).toString("base64");
    this.send({ type: kind, data: b64 } as UnmuteWsMessage);
  }

  close(code = 1000, reason?: string): void {
    if (!this.closed) this.ws.close(code, reason);
  }

  [Symbol.asyncIterator](): AsyncIterator<UnmuteWsMessage> {
    return {
      next: () => this.next(),
      return: () => {
        this.close();
        return Promise.resolve({ value: undefined, done: true });
      },
    };
  }

  private next(): Promise<IteratorResult<UnmuteWsMessage>> {
    if (this.queue.length > 0) {
      return Promise.resolve({ value: this.queue.shift()!, done: false });
    }
    if (this.closeError) return Promise.reject(this.closeError);
    if (this.closed) return Promise.resolve({ value: undefined, done: true });
    return new Promise((r) => this.resolvers.push(r));
  }

  private push(msg: UnmuteWsMessage): void {
    const r = this.resolvers.shift();
    if (r) r({ value: msg, done: false });
    else this.queue.push(msg);
  }

  private finish(): void {
    this.closed = true;
    while (this.resolvers.length) {
      this.resolvers.shift()!({ value: undefined, done: true });
    }
  }

  private fail(err: Error): void {
    this.closeError = err;
    this.closed = true;
    while (this.resolvers.length) {
      this.resolvers.shift()!({ value: undefined, done: true });
    }
  }
}
