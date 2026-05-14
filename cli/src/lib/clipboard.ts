import { spawn } from "bun";

type ClipboardResult = { ok: true } | { ok: false; error: string };

export async function copyToClipboard(text: string): Promise<ClipboardResult> {
  const candidates: string[][] =
    process.platform === "darwin"
      ? [["pbcopy"]]
      : process.platform === "win32"
        ? [["clip"]]
        : [
            ["wl-copy"],
            ["xclip", "-selection", "clipboard"],
            ["xsel", "--clipboard", "--input"],
          ];

  const attempted: string[] = [];
  for (const cmd of candidates) {
    const name = cmd[0] ?? "";
    if (!name) continue;
    attempted.push(name);
    try {
      const proc = spawn(cmd, { stdin: "pipe", stdout: "ignore", stderr: "pipe" });
      proc.stdin.write(text);
      await proc.stdin.end();
      const code = await proc.exited;
      if (code === 0) return { ok: true };
    } catch {
      /* try next candidate */
    }
  }
  return {
    ok: false,
    error: `no clipboard tool available (tried: ${attempted.join(", ")})`,
  };
}
