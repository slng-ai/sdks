import { Command } from "commander";
import { ttsCommand } from "./commands/tts";
import { sttCommand } from "./commands/stt";
import { configCommand } from "./commands/config";
import { modelsCommand } from "./commands/models";
import { voicesCommand } from "./commands/voices";

export async function runFlagMode(argv: string[]): Promise<void> {
  const program = new Command()
    .name("slng")
    .description("Slng Voice AI CLI — text-to-speech, speech-to-text, streaming")
    .version("0.0.0")
    .option("--debug", "Enable verbose SDK logging (equivalent to SLNG_LOG=debug)")
    .hook("preAction", (thisCmd) => {
      if (thisCmd.opts().debug) process.env.SLNG_LOG = "debug";
    });

  program.addCommand(ttsCommand());
  program.addCommand(sttCommand());
  program.addCommand(configCommand());
  program.addCommand(modelsCommand());
  program.addCommand(voicesCommand());

  await program.parseAsync(argv, { from: "user" });
}
