#!/usr/bin/env bash
# Sync the canonical streaming source (this repo's streaming/) into each
# Stainless SDK working copy at sdks/slng-typescript/ and sdks/slng-python/.
#
# Stainless does NOT have a "patches" config field. Custom code persists via
# 3-way git merges on the SDK's own integrated branch. This script writes
# the files; commit them inside each SDK's git history (see end of script
# for the suggested commit invocation).
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TS_SDK="$REPO_ROOT/sdks/slng-typescript"
PY_SDK="$REPO_ROOT/sdks/slng-python"

if [[ ! -d "$TS_SDK" ]] || [[ ! -d "$PY_SDK" ]]; then
  echo "error: SDK directories missing. Run \`stl preview\` first." >&2
  exit 1
fi

# --- TypeScript ---
mkdir -p "$TS_SDK/src/streaming"
cp -f \
  "$REPO_ROOT/streaming/ts/client.ts" \
  "$REPO_ROOT/streaming/ts/messages.ts" \
  "$REPO_ROOT/streaming/ts/index.ts" \
  "$TS_SDK/src/streaming/"
echo "ts: copied streaming/* to $TS_SDK/src/streaming/"

# Ensure ws is declared as a runtime dep in the TS SDK.
if ! grep -q '"ws"' "$TS_SDK/package.json"; then
  echo "ts: warning — \`ws\` is not in $TS_SDK/package.json. Add it as a dep." >&2
fi

# Re-export the streaming surface from the SDK's main entry.
TS_INDEX="$TS_SDK/src/index.ts"
if [[ -f "$TS_INDEX" ]] && ! grep -q "streaming" "$TS_INDEX"; then
  echo "" >> "$TS_INDEX"
  echo 'export * as streaming from "./streaming/index";' >> "$TS_INDEX"
  echo "ts: appended streaming re-export to $TS_INDEX"
fi

# --- Python ---
mkdir -p "$PY_SDK/src/slng/streaming"
cp -f \
  "$REPO_ROOT/streaming/python/client.py" \
  "$REPO_ROOT/streaming/python/messages.py" \
  "$REPO_ROOT/streaming/python/__init__.py" \
  "$PY_SDK/src/slng/streaming/"
echo "py: copied streaming/* to $PY_SDK/src/slng/streaming/"

# Ensure websockets is in the dependencies.
if ! grep -q '"websockets' "$PY_SDK/pyproject.toml" 2>/dev/null && ! grep -q "websockets" "$PY_SDK/pyproject.toml" 2>/dev/null; then
  echo "py: warning — \`websockets\` is not in $PY_SDK/pyproject.toml. Add it as a dep." >&2
fi

cat <<'EOF'

next:
  # Inside each SDK working copy, commit the changes:
  (cd sdks/slng-typescript && git add src/streaming src/index.ts package.json && git commit -m "feat(streaming): add WebSocket client")
  (cd sdks/slng-python     && git add src/slng/streaming pyproject.toml      && git commit -m "feat(streaming): add WebSocket client")

  # Then run \`stl preview\` again to regenerate; Stainless 3-way-merges your
  # commits into the next build.
EOF
