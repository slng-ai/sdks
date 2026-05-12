#!/usr/bin/env node
// npm postinstall: fetch the bun-compiled `voiceai` binary for the current
// platform from this package's matching GitHub Release and drop it next to
// the bin shim. Skips on unsupported platforms (the shim will print a clear
// error if invoked); the package install itself doesn't fail so CI / Docker
// builds with `npm ci --ignore-scripts` keep working.

const fs = require("node:fs");
const path = require("node:path");
const https = require("node:https");
const pkg = require(path.join(__dirname, "..", "package.json"));

const REPO = "slng-ai/sdks";
const TAG = `cli-v${pkg.version}`;

function targetName() {
  const platform = process.platform;
  const arch = process.arch;
  if (platform === "darwin" && arch === "arm64") return "voiceai-darwin-arm64";
  if (platform === "darwin" && arch === "x64") return "voiceai-darwin-x64";
  if (platform === "linux" && arch === "arm64") return "voiceai-linux-arm64";
  if (platform === "linux" && arch === "x64") return "voiceai-linux-x64";
  return null;
}

function download(url, dest, redirectsLeft = 5) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          if (redirectsLeft === 0) return reject(new Error("too many redirects"));
          return resolve(download(res.headers.location, dest, redirectsLeft - 1));
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`${url}: HTTP ${res.statusCode}`));
        }
        const file = fs.createWriteStream(dest, { mode: 0o755 });
        res.pipe(file);
        file.on("finish", () => file.close(() => resolve()));
        file.on("error", reject);
      })
      .on("error", reject);
  });
}

async function main() {
  const name = targetName();
  if (!name) {
    console.warn(
      `voiceai: no prebuilt binary for ${process.platform}/${process.arch}. ` +
        `The 'voiceai' command will not work on this platform.`,
    );
    return;
  }
  const url = `https://github.com/${REPO}/releases/download/${TAG}/${name}`;
  const dest = path.join(__dirname, "..", "bin", "voiceai");
  console.log(`voiceai: downloading ${name} from ${TAG}…`);
  try {
    await download(url, dest);
    fs.chmodSync(dest, 0o755);
    console.log(`voiceai: installed → ${dest}`);
  } catch (e) {
    console.error(`voiceai: download failed: ${e.message}`);
    console.error(`         You can fetch it manually from`);
    console.error(`         https://github.com/${REPO}/releases/tag/${TAG}`);
    // Don't fail npm install — let the shim surface a clear error on first run.
  }
}

main();
