import { Command } from "commander";
import { mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import ora from "ora";
import { synthesize, TTS_SAMPLE_RATE, wav } from "../lib/bridge";
import { playBytes } from "../lib/audio";
import { resolveVoice } from "../lib/voice-resolve";
import { load, REGIONS } from "../lib/config";

const TTS_EPILOGUE = `
EXAMPLES
  $ voiceai tts "hello"                                  play + auto-save to a temp file
  $ voiceai tts "hi" -m slng/fish/tts:s2.1-pro -v 8634617958764b539e0cdd5eb6c7723e
  $ voiceai tts "save me" --out ~/voice.wav              save to a specific file (also plays)
  $ voiceai tts "binary" > out.wav                       pipe a WAV file when stdout isn't a TTY
  $ voiceai tts "stream" --stream | ffplay -f s16le -ar 24000 -ch_layout mono -
                                                         raw PCM, written as it arrives

NOTES
  Audio comes over the bridge WebSocket as 16-bit mono PCM at 24 kHz. Without
  --stream it is wrapped in a WAV header. By default it is played AND saved to
  $TMPDIR/voiceai-tts/. --voice accepts a friendly name (e.g. "brooke") or a
  voiceId; we look it up in the catalog and substitute the upstream-native id.
`;

export function ttsCommand(): Command {
  const cfg = load();
  const cmd = new Command("tts");
  cmd
    .description("Synthesize speech over the bridge WebSocket")
    .argument("<text>", "Text to synthesize")
    .option(
      "-m, --model <id>",
      "TTS model variant (e.g. slng/fish/tts:s2.1-pro)",
      cfg.defaultTtsModel ?? "slng/deepgram/aura:2-en",
    )
    .option(
      "-v, --voice <name>",
      "Voice id or friendly name (resolved against the catalog)",
      cfg.defaultTtsVoice ?? "aura-2-thalia-en",
    )
    .option("-o, --out <file>", "Write a WAV file instead of a temp file")
    .option("--region <code>", `API region to use (default: found from the key). One of: ${REGIONS.join(", ")}`)
    .option("--project <id>", "Project UUID to bill this call to (default: SLNG_PROJECT_ID). Needed with an org-level API key")
    .option("--stream", "Write raw PCM to stdout as it arrives (good for long text or piping)")
    .addHelpText("afterAll", TTS_EPILOGUE)
    .action(async (text: string, opts) => {
      // Resolve --voice against the catalog (accepts voiceId OR friendly name).
      const resolved = await resolveVoice(opts.model, opts.voice);
      if (!resolved.ok) {
        process.stderr.write(`${resolved.message}\n`);
        process.exit(1);
      }
      const voiceId = resolved.voiceId!;
      if (resolved.message) {
        process.stderr.write(`${resolved.message}\n`);
      }

      const raw = Boolean(opts.stream) && !opts.out;

      // Show a spinner only when stderr is interactive (don't pollute pipes/CI).
      const spinner = process.stderr.isTTY
        ? ora({ stream: process.stderr, text: `synthesizing with ${opts.model} · ${voiceId}` }).start()
        : null;

      let pcm: Uint8Array;
      try {
        pcm = await synthesize(opts.model, voiceId, text, {
          region: opts.region,
          project: opts.project,
          onChunk: raw ? (c) => process.stdout.write(c) : undefined,
        });
        spinner?.succeed(`got ${pcm.length} bytes (~${(pcm.length / 2 / TTS_SAMPLE_RATE).toFixed(1)}s)`);
      } catch (e) {
        // spinner is null when stderr isn't a TTY; write the failure unconditionally.
        if (spinner) spinner.fail((e as Error).message);
        else process.stderr.write(`${(e as Error).message}\n`);
        process.exit(1);
      }
      if (raw) return;

      const bytes = wav(pcm, TTS_SAMPLE_RATE);
      // stdout piped → emit the WAV bytes (script-friendly).
      if (!opts.out && !process.stdout.isTTY) {
        process.stdout.write(bytes);
        return;
      }

      // Default to a temp file when --out isn't given, so the user can always
      // reach the audio after the run.
      const outPath = opts.out
        ? String(opts.out)
        : (() => {
            const tmp = join(tmpdir(), "voiceai-tts");
            mkdirSync(tmp, { recursive: true });
            return join(tmp, `voiceai-tts-${Date.now()}.wav`);
          })();
      writeFileSync(outPath, bytes);
      process.stderr.write(`saved → ${outPath}\n`);

      // Play if we're in a TTY (otherwise the user piped --out somewhere
      // and probably doesn't want playback).
      if (process.stdout.isTTY) {
        const playing = process.stderr.isTTY
          ? ora({ stream: process.stderr, text: "playing…" }).start()
          : null;
        try {
          await playBytes(bytes);
          playing?.stop();
        } catch (e) {
          playing?.fail((e as Error).message);
          throw e;
        }
      }
    });
  return cmd;
}
