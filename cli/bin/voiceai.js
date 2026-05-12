#!/usr/bin/env node
// npm bin entry: the actual `voiceai` binary is a bun-compiled native
// executable downloaded by scripts/download.js on `npm install`. This shim
// just execs it with the user's args + stdio passed through.

const { spawnSync } = require("node:child_process");
const path = require("node:path");
const fs = require("node:fs");

const ext = process.platform === "win32" ? ".exe" : "";
const bin = path.join(__dirname, `voiceai${ext}`);

if (!fs.existsSync(bin)) {
  console.error(
    `voiceai: binary missing at ${bin}.\n` +
      `Reinstall with \`npm install -g voiceai\`, or, if you used --ignore-scripts, ` +
      `run \`node ${path.join(__dirname, "..", "scripts", "download.js")}\` to fetch it.`,
  );
  process.exit(1);
}

const result = spawnSync(bin, process.argv.slice(2), { stdio: "inherit" });
process.exit(result.status ?? 1);
