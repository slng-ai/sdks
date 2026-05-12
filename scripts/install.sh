#!/bin/sh
# voiceai install: fetch the latest cli release binary for the current OS/arch
# and drop it into PREFIX (default: /usr/local/bin). Reads the latest tag from
# the GitHub API so users don't have to know the version.
#
# Usage:
#   curl -fsSL https://slng.ai/install.sh | sh
#   curl -fsSL https://slng.ai/install.sh | PREFIX=$HOME/.local/bin sh
#
# Requires: curl, install (BSD or GNU). No bash-isms — runs under POSIX sh.

set -eu

REPO="slng-ai/sdks"
PREFIX="${PREFIX:-/usr/local/bin}"

os="$(uname -s | tr '[:upper:]' '[:lower:]')"
arch="$(uname -m)"
case "$arch" in
  x86_64|amd64) arch="x64" ;;
  aarch64|arm64) arch="arm64" ;;
  *) echo "voiceai: unsupported architecture: $arch" >&2; exit 1 ;;
esac
case "$os" in
  darwin|linux) ;;
  *) echo "voiceai: unsupported OS: $os" >&2; exit 1 ;;
esac

asset="voiceai-${os}-${arch}"

# Resolve the latest cli-v* tag. We don't use /releases/latest because that
# returns the most recent overall release on the repo (which might be an SDK
# release). Instead, list releases and grep for the first cli-v* tag.
echo "voiceai: looking up latest release…"
tag="$(
  curl -fsSL "https://api.github.com/repos/${REPO}/releases?per_page=30" \
    | grep '"tag_name"' \
    | grep -o '"cli-v[^"]*"' \
    | head -n1 \
    | tr -d '"'
)"
if [ -z "$tag" ]; then
  echo "voiceai: could not find a cli-v* release on ${REPO}" >&2
  exit 1
fi

url="https://github.com/${REPO}/releases/download/${tag}/${asset}"
echo "voiceai: installing ${tag} for ${os}/${arch}…"

tmp="$(mktemp -t voiceai.XXXXXX)"
trap 'rm -f "$tmp"' EXIT
curl -fsSL "$url" -o "$tmp"

# Need write permission on PREFIX; fall back to sudo if not.
if [ -w "$PREFIX" ]; then
  install -m 0755 "$tmp" "$PREFIX/voiceai"
else
  echo "voiceai: $PREFIX is not writable, retrying with sudo…"
  sudo install -m 0755 "$tmp" "$PREFIX/voiceai"
fi

echo "voiceai: installed → $PREFIX/voiceai"

# macOS Gatekeeper note: the binary is unsigned for v0.x. First run from the
# command line will fail with "cannot be opened because the developer cannot
# be verified". The user has to right-click → Open in Finder once, or run
# `xattr -d com.apple.quarantine "$PREFIX/voiceai"` to clear the flag.
if [ "$os" = "darwin" ]; then
  echo ""
  echo "macOS note: this build is unsigned. If the first run shows a"
  echo "  'cannot be opened' error, run:"
  echo "    xattr -d com.apple.quarantine $PREFIX/voiceai"
  echo "  Or right-click voiceai in Finder and choose Open."
fi

echo ""
echo "Done. Run 'voiceai --help' to get started."
