# CLAUDE.md — Mithaq monorepo

**Mithaq (مِيثَاق)** — Muslim matrimonial platform. Three sub-projects with separate stacks; each owns its own `CLAUDE.md` with the deep details.

## Sub-projects

| Dir | Stack | Package manager | Detailed rules |
|-----|-------|----------------|----------------|
| `api/` | NestJS 11, TypeORM, PostgreSQL, Socket.io | **pnpm** | `api/CLAUDE.md` |
| `web/` | Vite 5, React 18, Tailwind, shadcn/ui, vanilla Three.js | **npm** | `web/CLAUDE.md` |

Sub-project CLAUDE.md files auto-load when work touches that sub-project's files. Detailed conventions, gotchas, and module/screen/component listings live there — keep this root file slim.

## Monorepo-level rules

- **No cross-imports between sub-projects.** They are independent deployables.
- **Don't switch package managers** — pnpm for api/web, npm for admin. Lockfiles must stay consistent.
- **No shared types package today** — API DTOs are duplicated in `app/src/types/` and admin TanStack hooks. Sync manually when contracts change (use `sync-api-contract` skill).
- **Always run commands from the right cwd**: `cd api && pnpm ...` etc. Slash commands `/api-dev`, `/app-dev`, `/admin-dev` handle this.
- **Secrets**: each sub-project has its own `.env`. Never commit. Hook denies reading any `.env*` file.

## Sub-project commands at a glance

```bash
# api/
cd api && pnpm install && pnpm start:dev    # http://localhost:5000/api

# app/
cd web && npm install && npm run dev

# admin/
cd web && npm install && npm run dev      # http://localhost:8080
```

Or use slash commands: `/api-dev`, `/admin-dev`, `/api-lint`, `/full-check`.

## Top-level environmental traps

These have all broken something. Re-verify when touching infrastructure:

- **Node 20.x** required for `web/`. Node 24 breaks Expo SDK 54 ESM resolution. (Hook warns on SessionStart inside `web/`.)
- **pgvector** Postgres extension required for `api/` schema, even though current matching is in-memory cosine.
- `app/.npmrc` `node-linker=hoisted`, `expo-blur` excluded from plugins, `AppEntry.js` as `main` — see `app/CLAUDE.md` for the full list.

## Subagents

Defined in `.claude/agents/`:
- `backend-agent` — owns api/
- `admin-agent` — owns web/
- `contract-sync-agent` — mirrors API/socket changes across sub-projects
- `pr-reviewer` — read-only diff review against project rules

## Skills

Per-sub-project skills under `.claude/skills/{backend,mobile,admin,shared}/`. Each one has a `paths:` glob that auto-scopes its trigger to the right sub-project. Run `/` to see the full list.

## Hooks

- `PreToolUse` Bash → blocks `rm -rf /`, `rm -rf ~`, fork bombs (`.claude/hooks/block-dangerous-rm.sh`)
- `PostToolUse` Edit/Write → best-effort lint/format per sub-project (`.claude/hooks/post-edit-format.sh`)
- `SessionStart` → warns if cwd is inside `web/` and Node ≠ 20.x (`.claude/hooks/check-node-version.sh`)

## Date context

CLAUDE.md and this monorepo conventionally use absolute dates. Convert relative dates ("Thursday", "next week") to `YYYY-MM-DD` when persisting facts.
