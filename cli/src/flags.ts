import { Command } from "commander";
import pkg from "../package.json" with { type: "json" };
import { ttsCommand } from "./commands/tts";
import { sttCommand } from "./commands/stt";
import { configCommand } from "./commands/config";
import { modelsCommand } from "./commands/models";
import { voicesCommand } from "./commands/voices";

const ROOT_EPILOGUE = `
EXAMPLES
  $ slng                                              open the interactive TUI
  $ slng tts "hello world" -m slng/deepgram/aura:2-en -v aura-2-thalia-en
  $ slng tts "save me" --out ~/voice.mp3              save the audio to a file
  $ slng tts "stream me" --stream | ffplay -          stream TTS audio
  $ slng stt audio.wav -m slng/deepgram/nova:3-en     transcribe a file
  $ slng stt --stream                                 live mic transcription
  $ slng models --tts                                 list deployed TTS models
  $ slng voices --model slng/deepgram/aura:2-en       list catalogued voices

ENVIRONMENT
  SLNG_API_KEY        Bearer token. Required for any API call.
  SLNG_BASE_URL       Override the API base URL (e.g. staging).

  Env vars override anything in ~/.config/slng/config.json.
`;

export async function runFlagMode(argv: string[]): Promise<void> {
  const program = new Command()
    .name("slng")
    .description(
      "Slng Voice AI CLI — text-to-speech, speech-to-text, streaming.\n" +
        "Run with no arguments to open the interactive TUI.",
    )
    .version(pkg.version)
    .option("--debug", "Enable verbose SDK logging (equivalent to SLNG_LOG=debug)")
    .hook("preAction", (thisCmd) => {
      if (thisCmd.opts().debug) process.env.SLNG_LOG = "debug";
    })
    .addHelpText("afterAll", ROOT_EPILOGUE);

  program.addCommand(ttsCommand());
  program.addCommand(sttCommand());
  program.addCommand(configCommand());
  program.addCommand(modelsCommand());
  program.addCommand(voicesCommand());

  await program.parseAsync(argv, { from: "user" });
}
