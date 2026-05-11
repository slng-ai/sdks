#!/usr/bin/env bash
set -euo pipefail

# Vendor the unified-API specs from the gateway-specs repo into specs/.
# Idempotent: prints a diff if anything changed, no-op otherwise.
#
# Override the source by setting GATEWAY_SPECS_DIR, e.g.:
#   GATEWAY_SPECS_DIR=~/work/gateway-specs bash scripts/sync-specs.sh

GATEWAY_SPECS_DIR="${GATEWAY_SPECS_DIR:-$HOME/Dev/SLNG/gateway-specs}"
SRC_DIR="$GATEWAY_SPECS_DIR/specs/bridges-unmute"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEST_DIR="$REPO_ROOT/specs/bridges-unmute"

if [[ ! -d "$SRC_DIR" ]]; then
  echo "error: source dir not found: $SRC_DIR" >&2
  echo "set GATEWAY_SPECS_DIR to the path of your gateway-specs checkout" >&2
  exit 1
fi

mkdir -p "$DEST_DIR"

changed=0
for f in bridges-unmute.oas.yaml bridges-unmute.asyncapi.yaml meta.yaml; do
  src="$SRC_DIR/$f"
  dst="$DEST_DIR/$f"
  if [[ ! -f "$src" ]]; then
    echo "warn: missing in source: $f" >&2
    continue
  fi
  if ! cmp -s "$src" "$dst" 2>/dev/null; then
    if [[ -f "$dst" ]]; then
      echo "--- updating $f ---"
      diff -u "$dst" "$src" || true
    else
      echo "--- adding $f ---"
    fi
    cp "$src" "$dst"
    changed=1
  fi
done

if [[ "$changed" -eq 0 ]]; then
  echo "specs up to date"
fi
