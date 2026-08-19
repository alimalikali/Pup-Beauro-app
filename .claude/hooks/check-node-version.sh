#!/usr/bin/env bash
# SessionStart hook. If cwd is inside app/, verifies Node 20.x and warns otherwise.
# Emits hookSpecificOutput.additionalContext (JSON on stdout).

set -euo pipefail

input=$(cat)
cwd=$(printf '%s' "$input" | jq -r '.cwd // ""')

# Only fire for app/ context
if [[ "$cwd" != *"/marrige/app"* && "$cwd" != *"/marrige"* ]]; then
  exit 0
fi

node_version=$(node --version 2>/dev/null || echo "missing")

if [[ "$node_version" =~ ^v20\. ]]; then
  exit 0
fi

cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "[mithaq] Node version detected: ${node_version}. The app/ sub-project requires Node 20.x — Expo SDK 54 breaks on Node 24 (ESM resolution). Run \`nvm use 20\` before any pnpm/expo commands."
  }
}
EOF
