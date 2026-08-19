#!/usr/bin/env bash
# PostToolUse hook for Edit|Write. Best-effort format/lint pass on the touched file.
# Non-blocking: any failure is swallowed, returns 0.

set +e

input=$(cat)
file=$(printf '%s' "$input" | jq -r '.tool_input.file_path // ""')

if [[ -z "$file" ]]; then
  exit 0
fi

case "$file" in
  */marrige/api/src/*.ts|*/marrige/api/src/**/*.ts)
    (cd /home/user-0060/Dev/vibe/marrige/api && pnpm exec eslint --fix "$file" 2>/dev/null) || true
    ;;
  */marrige/app/src/*.ts|*/marrige/app/src/*.tsx|*/marrige/app/src/**/*.ts|*/marrige/app/src/**/*.tsx)
    (cd /home/user-0060/Dev/vibe/marrige/app && pnpm exec eslint --fix "$file" 2>/dev/null) || true
    ;;
  */marrige/admin/src/*.ts|*/marrige/admin/src/*.tsx|*/marrige/admin/src/**/*.ts|*/marrige/admin/src/**/*.tsx)
    (cd /home/user-0060/Dev/vibe/marrige/admin && npx --no-install prettier --write "$file" 2>/dev/null) || true
    ;;
esac

exit 0
