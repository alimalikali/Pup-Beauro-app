#!/usr/bin/env bash
# PreToolUse hook for Bash. Blocks catastrophic rm patterns. Exit 2 = block.

set -euo pipefail

input=$(cat)
cmd=$(printf '%s' "$input" | jq -r '.tool_input.command // ""')

# Patterns to block (anchored at word boundaries to avoid false positives on `rm -rf ./node_modules`)
deny_patterns=(
  'rm[[:space:]]+-rf?[[:space:]]+/(\s|$)'
  'rm[[:space:]]+-rf?[[:space:]]+/\*'
  'rm[[:space:]]+-rf?[[:space:]]+~(\s|$|/)'
  'rm[[:space:]]+-rf?[[:space:]]+\$HOME'
  'rm[[:space:]]+-rf?[[:space:]]+\$\{HOME\}'
  ':\(\)\{[[:space:]]*:\|:&[[:space:]]*\};:'
)

for pat in "${deny_patterns[@]}"; do
  if [[ "$cmd" =~ $pat ]]; then
    echo "BLOCKED: dangerous command pattern detected -> $cmd" >&2
    exit 2
  fi
done

exit 0
