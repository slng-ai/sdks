import WebSocket from "ws";
import type { UnmuteWsMessage } from "./messages";

function formatQuery(q?: Record<string, string>): string {
  if (!q) return "";
  const usp = new URLSearchParams(q);
  const s = usp.toString();
  return s ? `?${s}` : "";
}

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

  connectStt(
    modelVariant: string,
    opts: { query?: Record<string, string>; signal?: AbortSignal } = {},
  ): Promise<StreamingSession> {
    const path = `/v1/bridges/unmute/stt/${modelVariant}${formatQuery(opts.query)}`;
    return this.connect(path, opts.signal);
  }

  connectTts(
    modelVariant: string,
    opts: { query?: Record<string, string>; signal?: AbortSignal } = {},
  ): Promise<StreamingSession> {
    const path = `/v1/bridges/unmute/tts/${modelVariant}${formatQuery(opts.query)}`;
    return this.connect(path, opts.signal);
  }

  private connect(path: string, signal?: AbortSignal): Promise<StreamingSession> {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(`${this.baseUrl}${path}`, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      });
      let settled = false;
      const onOpen = () => {
        cleanup();
        resolve(new StreamingSession(ws));
      };
      // ponytail: this listener stays attached for the socket's lifetime. A
      // failed handshake emits `error` twice (again on close), and an `error`
      // with no listener is thrown as an unhandled EventEmitter error.
      const onError = (err: Error) => {
        if (settled) return;
        cleanup();
        reject(err);
      };
      const onAbort = () => {
        cleanup();
        ws.terminate();
        reject(new Error("aborted"));
      };
      const cleanup = () => {
        settled = true;
        ws.off("open", onOpen);
        signal?.removeEventListener("abort", onAbort);
      };
      ws.once("open", onOpen);
      ws.on("error", onError);
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

  send(message: UnmuteWsMessage | Record<string, unknown>): void {
    if (this.closed) throw new Error("session is closed");
    this.ws.send(JSON.stringify(message));
  }

  /** Send raw PCM audio as a binary WebSocket frame. The docs at docs.slng.ai
   *  describe a `{type:"audio", data:<base64>}` JSON envelope, but the live
   *  unmute bridge currently rejects that variant — audio goes on the wire
   *  as binary frames, JSON is reserved for control messages (init / finalize
   *  / close). Matches the slng-stt-next reference implementation. */
  sendAudio(bytes: Uint8Array | Buffer): void {
    if (this.closed) throw new Error("session is closed");
    this.ws.send(bytes);
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
