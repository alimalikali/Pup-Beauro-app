---
description: Start Expo dev server for the mobile app. Verifies Node 20 first (Expo SDK 54 breaks on Node 24).
allowed-tools: Bash(pnpm *), Bash(node *), Bash(cd *), Bash(nvm *)
---

## Node version check

!`node --version`

## Start Expo

If the version above is NOT v20.x, stop and tell the user to run `nvm use 20` before continuing. Otherwise launch:

!`cd /home/user-0060/Dev/vibe/marrige/app && pnpm start`
