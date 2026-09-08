// Every --json command's stdout write goes through here, and only here.
//
// console.log()/process.stdout.write() queue their underlying write
// asynchronously whenever stdout is not a TTY on POSIX — Node's own docs say
// so directly (pipes and sockets are synchronous only on Windows; files are
// synchronous everywhere). A compiled Bun binary — what `bun run build`
// produces and what every released `voiceai` actually is — has repeated,
// confirmed bugs in exactly that gap: stdout truncated at a power-of-two
// boundary (64KB/128KB/256KB) when a large write races the write end closing,
// either because the binary is read through another runtime's process/exec
// API (oven-sh/bun#28145 — reproduced with Node's execFileSync/spawnSync/
// spawn, closed "not planned" upstream) or because process.exit() runs
// before the async write drains (oven-sh/bun#25432, oven-sh/bun#20562). A
// *file* redirect is unaffected, because file writes are synchronous
// regardless of runtime — which is exactly the split a caller sees: complete
// over a redirect, cut off mid-string over a pipe.
//
// fs.writeSync() makes the write(2) syscall directly, so it never depends on
// the event loop or on Bun's own Writable-stream machinery — the two places
// every issue above traces back to. But it does NOT loop: one call is one
// write(2), and a *short write* is exactly what a pipe gives you. Reading
// process.stdout.isTTY (src/index.ts does, on every invocation) makes Bun set
// fd 1 O_NONBLOCK, and a non-blocking write(2) to a pipe accepts one
// pipe-buffer-full — 65,536 bytes on macOS — and returns that count. So the
// loop is ours: keep calling write(2) from the byte we got to, and retry the
// EAGAIN that a full pipe raises, until every byte is gone. A regular file
// never short-writes, which is the other half of the redirect-vs-pipe split.

import { writeSync } from "node:fs";

// A synchronous pause with no dependency and no event loop, for the case where
// the pipe is full and the reader has not caught up yet.
const PAUSE = new Int32Array(new SharedArrayBuffer(4));

/**
 * Write every byte of `buf` to `fd`, however many write(2) calls that takes.
 * Offsets are byte offsets into a Buffer, never UTF-16 code-unit offsets into
 * a string — writeSync's third argument is a *file position* for the string
 * overload, which is not what we want here.
 */
function writeAll(fd: number, buf: Buffer): void {
  let written = 0;
  let stalled = 0;
  while (written < buf.length) {
    let n = 0;
    try {
      n = writeSync(fd, buf, written, buf.length - written);
    } catch (e) {
      const code = (e as NodeJS.ErrnoException).code;
      // EAGAIN/EWOULDBLOCK: the pipe is full on a non-blocking fd. EINTR: a
      // signal arrived mid-syscall. Both mean "retry", not "give up".
      if (code !== "EAGAIN" && code !== "EWOULDBLOCK" && code !== "EINTR") throw e;
    }
    written += n;
    if (n > 0) {
      stalled = 0;
      continue;
    }
    // Ceiling: ~10s of a reader that never drains (10_000 pauses of ~1ms).
    // Past that, fail loudly rather than spin forever or truncate in silence.
    if (++stalled > 10_000) {
      throw new Error(`stdout stalled after ${written} of ${buf.length} bytes`);
    }
    Atomics.wait(PAUSE, 0, 0, 1);
  }
}

/**
 * Print one JSON document to stdout, fully written before this call returns.
 * `pretty` (default) matches every existing --json call site's 2-space
 * indent; pass `false` for the handful that print a single compact line.
 */
export function printJson(data: unknown, pretty = true): void {
  const text = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
  writeAll(1, Buffer.from(`${text}\n`, "utf8"));
}
