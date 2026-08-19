# .claude/ — Claude Code config for the Mithaq monorepo

Layout follows the canonical Claude Code spec (https://code.claude.com/docs/en/skills, https://code.claude.com/docs/en/sub-agents, https://code.claude.com/docs/en/hooks).

## Layout

```
.claude/
├── agents/                        # custom subagents (one .md per agent)
│   ├── backend-agent.md
│   ├── mobile-agent.md
│   ├── admin-agent.md
│   ├── contract-sync-agent.md
│   └── pr-reviewer.md
├── skills/                        # workflows (one folder + SKILL.md per skill)
│   ├── backend/<name>/SKILL.md   (5)
│   ├── mobile/<name>/SKILL.md    (5)
│   ├── admin/<name>/SKILL.md     (5)
│   └── shared/<name>/SKILL.md    (2)
├── commands/                      # simple slash commands (dev servers, lint)
│   ├── api-dev.md
│   ├── app-dev.md                # /app-dev — checks Node 20 first
│   ├── admin-dev.md
│   ├── api-lint.md
│   └── full-check.md
├── hooks/                         # shell scripts referenced from settings.json
│   ├── block-dangerous-rm.sh     # PreToolUse Bash guard (exit 2 to block)
│   ├── check-node-version.sh     # SessionStart: warns if Node ≠ 20 in app/
│   └── post-edit-format.sh       # PostToolUse Edit/Write: best-effort lint
├── settings.json                  # committed: permissions + hooks (team-shared)
├── settings.local.json            # gitignored: personal overrides (MCP, playwright)
├── idea/                          # unrelated planning docs (not auto-loaded)
└── README.md                      # this file
```

Per-sub-project `CLAUDE.md` files (`api/CLAUDE.md`, `app/CLAUDE.md`, `admin/CLAUDE.md`) auto-load when work touches that sub-project. Root `CLAUDE.md` stays slim with monorepo-level info only.

## Add a new subagent

1. Create `.claude/agents/<name>.md` with YAML frontmatter:
   ```markdown
   ---
   name: my-agent
   description: When Claude should delegate to it (proactive triggering).
   tools: Read, Write, Edit, Glob, Grep, Bash
   model: inherit          # or sonnet | opus | haiku
   color: cyan             # red blue green yellow purple orange pink cyan
   skills: [skill-a, skill-b]   # optional preloaded skills
   ---

   System prompt here. Describe scope, conventions, dispatch criteria.
   ```
2. Reload: subagents from `/agents` interface are live; file-created ones need a session restart.
3. Test: `/agents` → Library tab → confirm it appears.

Full field list: https://code.claude.com/docs/en/sub-agents#supported-frontmatter-fields

## Add a new skill

1. Create `.claude/skills/<domain>/<name>/SKILL.md`:
   ```markdown
   ---
   name: my-skill
   description: What it does and when to use it (Claude reads this to decide).
   argument-hint: [arg1] [arg2]
   allowed-tools: Read, Write, Edit, Bash(pnpm *)
   paths: api/**          # optional: auto-scope to sub-project
   ---

   # Steps

   1. Step one.
   2. Step two with $ARGUMENTS substitution.
   ```
2. Live change detection: edits to existing skill files take effect within the session. New top-level skill directories need a restart.
3. Test: type `/` — confirm `/my-skill` appears in the menu.

Full field list: https://code.claude.com/docs/en/skills#frontmatter-reference

## Add a slash command (alt: simple skill)

`.claude/commands/` still works for simple one-liners (the docs note custom commands have merged into skills, but the legacy folder remains supported). Prefer skills for anything with supporting files or `$ARGUMENTS` logic; use commands/ for pure bash dispatchers.

```markdown
---
description: One-line description shown in the / menu.
allowed-tools: Bash(pnpm *), Bash(cd *)
---

Run the thing.

!`cd subproject && pnpm do-thing`
```

The `` !`<cmd>` `` syntax runs the command and inlines its output before Claude sees the prompt.

## Add a hook

Edit `.claude/settings.json` `hooks` block. Event types: `PreToolUse`, `PostToolUse`, `SessionStart`, `UserPromptSubmit`, `Stop`, `SubagentStop`, `Notification`, `PreCompact`, `PostCompact`, others.

```json
"hooks": {
  "PreToolUse": [
    {
      "matcher": "Bash",                              // tool name, regex, or "*"
      "hooks": [
        {
          "type": "command",
          "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/my-hook.sh",
          "timeout": 5
        }
      ]
    }
  ]
}
```

Hook contract:
- Reads JSON on stdin (`session_id`, `cwd`, `tool_name`, `tool_input`, ...)
- Exit 0 = OK; stdout JSON parsed for `hookSpecificOutput.additionalContext` etc.
- Exit 2 = block (PreToolUse only); stderr shown to Claude as block reason
- Other exit = non-blocking error

Full spec: https://code.claude.com/docs/en/hooks

## Settings precedence

1. Managed (org-deployed)
2. CLI flags (`--model`, `--effort`, etc.)
3. `.claude/settings.local.json` (gitignored, personal)
4. `.claude/settings.json` (committed, team-shared)
5. `~/.claude/settings.json` (user-wide)

Permission rules (`allow`/`ask`/`deny`) **merge** across all scopes (rather than override). Scalars (`model`, `editorMode`, etc.) follow standard precedence.

## Verification checklist after changes

- `/agents` lists all 5 custom agents
- `/` lists all 17 skills + 5 commands
- `/api-dev` dispatches the right bash command
- Hook scripts are executable: `stat -c '%a' .claude/hooks/*.sh` → `755`
- Per-sub `CLAUDE.md` loads when you open a file in that sub-project (test: ask "what's the Three.js disposal rule?" inside `admin/` — should answer without further reads)
