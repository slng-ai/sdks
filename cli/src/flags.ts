import { Command } from "commander";
import pkg from "../package.json" with { type: "json" };
import { ttsCommand } from "./commands/tts";
import { sttCommand } from "./commands/stt";
import { configCommand } from "./commands/config";
import { modelsCommand } from "./commands/models";
import { voicesCommand } from "./commands/voices";
import { whoamiCommand } from "./commands/whoami";
import { loginCommand } from "./commands/login";
import { agentsCommand } from "./commands/agents";
import { toolCommand } from "./commands/tool";
import { secretCommand } from "./commands/secret";
import { trunksCommand } from "./commands/trunks";
import { setActiveProfile } from "./lib/config";

const ROOT_EPILOGUE = `
EXAMPLES
  $ voiceai                                              open the interactive TUI
  $ voiceai login                                        interactively add or update a profile
  $ voiceai tts "hello world" -m slng/deepgram/aura:2-en -v aura-2-thalia-en
  $ voiceai tts "save me" --out ~/voice.mp3              save the audio to a file
  $ voiceai tts "stream me" --stream | ffplay -          stream TTS audio
  $ voiceai stt audio.wav -m slng/deepgram/nova:3-en     transcribe a file
  $ voiceai stt --stream                                 live mic transcription
  $ voiceai models --tts                                 list deployed TTS models
  $ voiceai voices --model slng/deepgram/aura:2-en       list catalogued voices
  $ voiceai whoami                                       check that your API key is valid
  $ voiceai agents list                                  list your voice agents
  $ voiceai tool list                                    list tools your agents can call
  $ voiceai tool get lookup_customer                     show one tool or MCP server by name
  $ voiceai secret list                                  list your organisation's vault entries
  $ voiceai secret get STRIPE_KEY                        check one secret by name
  $ voiceai trunks list                                  list your organisation's SIP trunks
  $ voiceai --profile work whoami                        run any command under a named profile
  $ voiceai config profiles                              list configured profiles

ENVIRONMENT
  VOICEAI_PROFILE            Select a named profile (overridden by --profile).
  VOICEAI_API_KEY            Bearer token. Overrides the active profile's key.
  VOICEAI_BASE_URL           Override the API base URL (e.g. staging).
  VOICEAI_AGENTS_BASE_URL    Override the agents API base URL (used by \`agents\`).

  Env vars override anything in ~/.config/voiceai/config.json.
`;

export async function runFlagMode(argv: string[]): Promise<void> {
  const program = new Command()
    .name("voiceai")
    .description(
      "Voiceai CLI — text-to-speech, speech-to-text, streaming.\n" +
        "Run with no arguments to open the interactive TUI.",
    )
    .version(pkg.version)
    .option("--debug", "Enable verbose SDK logging (equivalent to VOICEAI_LOG=debug)")
    .option("--profile <name>", "Use a named credential profile (see `voiceai config profiles`)")
    .hook("preAction", (thisCmd) => {
      const opts = thisCmd.opts() as { debug?: boolean; profile?: string };
      if (opts.debug) process.env.VOICEAI_LOG = "debug";
      if (opts.profile) setActiveProfile(opts.profile);
    })
    .addHelpText("afterAll", ROOT_EPILOGUE);

  program.addCommand(ttsCommand());
  program.addCommand(sttCommand());
  program.addCommand(configCommand());
  program.addCommand(modelsCommand());
  program.addCommand(voicesCommand());
  program.addCommand(whoamiCommand());
  program.addCommand(loginCommand());
  program.addCommand(agentsCommand());
  program.addCommand(toolCommand());
  program.addCommand(secretCommand());
  program.addCommand(trunksCommand());

  await program.parseAsync(argv, { from: "user" });
}
