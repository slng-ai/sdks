#!/usr/bin/env bash
# Vendor the voice manifest catalog from the voice-tools repo. Idempotent.
# Override VOICE_TOOLS_DIR to point at a different checkout.

set -euo pipefail

VOICE_TOOLS_DIR="${VOICE_TOOLS_DIR:-$HOME/Dev/SLNG/voice-tools}"
SRC_DIR="$VOICE_TOOLS_DIR/manifests"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEST_DIR="$REPO_ROOT/voice-manifests"

if [[ ! -d "$SRC_DIR" ]]; then
  echo "error: voice-tools manifests dir not found: $SRC_DIR" >&2
  echo "set VOICE_TOOLS_DIR to the path of your voice-tools checkout" >&2
  exit 1
fi

mkdir -p "$DEST_DIR"

changed=0
for src in "$SRC_DIR"/*.json; do
  name="$(basename "$src")"
  dst="$DEST_DIR/$name"
  if ! cmp -s "$src" "$dst" 2>/dev/null; then
    cp "$src" "$dst"
    changed=$((changed + 1))
  fi
done

# Drop manifests in the dest that no longer exist upstream.
for dst in "$DEST_DIR"/*.json; do
  [[ -f "$dst" ]] || continue
  name="$(basename "$dst")"
  if [[ ! -f "$SRC_DIR/$name" ]]; then
    rm "$dst"
    changed=$((changed + 1))
  fi
done

if [[ "$changed" -eq 0 ]]; then
  echo "voice manifests up to date"
else
  echo "synced $changed voice manifest(s)"
fi
