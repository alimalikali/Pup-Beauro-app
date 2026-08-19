---
description: Run lint + typecheck + test across all three sub-projects (api, app, admin). Stops at first failure.
allowed-tools: Bash(pnpm *), Bash(npm *), Bash(cd *)
---

Lint + test full monorepo.

## Backend
!`cd /home/user-0060/Dev/vibe/marrige/api && pnpm lint && pnpm build`

## Mobile (TS check only — no lint script wired)
!`cd /home/user-0060/Dev/vibe/marrige/app && pnpm exec tsc --noEmit`

## Admin
!`cd /home/user-0060/Dev/vibe/marrige/admin && npm run build && npm test`

Report which sub-projects passed and which failed. Do not auto-fix.
