# Task contract

On-disk layout and field meanings shared by all `managing-tasks` workflows.

## Output layout

```text
<tasks-root>/
  <NNN>-<slug>/
    plan.md      # Stable spec: goal, phases, files, acceptance criteria
    status.md    # Mutable state: execution pointer, step queue, handoff note
  archive/       # Optional: cancelled or completed tasks moved here
    <NNN>-<slug>/
```

Templates: [`../assets/plan.md`](../assets/plan.md), [`../assets/status.md`](../assets/status.md).

## Plan frontmatter

Every `plan.md` includes YAML frontmatter:

| Field | Purpose |
| --- | --- |
| `name` | Task title |
| `overview` | One-line summary |
| `generated_by` | `managing-tasks` (legacy tasks may say `creating-tasks`) |
| `plan_revision` | Integer; start at `1`, bump on each plan amend |
| `todos` | Step queue: `id`, `content`, `status` (`pending` \| `completed` \| `skipped` \| `cancelled`) |

## Finding existing tasks

Search for `plan.md` files whose frontmatter contains `generated_by: managing-tasks` **or** `generated_by: creating-tasks` (legacy).

For each match, the tasks root is the parent of the numbered task folder (e.g. `tasks/007-foo/plan.md` → root is `tasks/`).

## Status fields

| Field | Values | Meaning |
| --- | --- | --- |
| `overall_status` | `Not Started`, `In Progress`, `Blocked`, `Review`, `Done`, `Cancelled` | Task lifecycle |
| `current_step_id` | step id or `none` | Step in progress this session |
| `next_step_id` | step id or `none` | Next step for the executor |
| `blocking_reason` | text or `None` | Why work is blocked |
| `cancel_reason` | text or `None` | Why the task was cancelled |
| `handoff_note` | one sentence | What the next session should do first |

## Step queue rules

- Check off steps when completed.
- Skipped steps stay in the queue with a skip reason in the session log; set todo `status: skipped` in plan frontmatter.
- Never uncheck a completed step unless the user explicitly replans and confirms.
- `verify` is always the last step before `Done`.

## Resolving domain references (execute / plan)

For each entry in `plan.md` → Context → **References**:

| Plan entry | Resolve to |
| --- | --- |
| `reference-basename` | For each skill in **Skills to load**, try `<skill-dir>/references/reference-basename.md`; use the first match |
| `skill-name/reference-basename` | `<skill-dir>/references/reference-basename.md` for that skill only |

`<skill-dir>` is the folder containing that skill's `SKILL.md`. If missing under `references/`, use the link in that skill's `SKILL.md` index.

## Discovering project skills

Each skill is `<skill-name>/SKILL.md` with optional `references/`, `scripts/`, and `assets/` ([Agent Skills](https://agentskills.io)).

**Find skills:**

1. **Explicit pointers** — `AGENTS.md`, the user request, `@`-mentioned or attached skills
2. **Project skill roots** — glob `<root>/<skill-name>/SKILL.md` under each existing root:

| Root | Tool / environment |
| --- | --- |
| `.agents/skills/` | Agent Skills (portable / multi-agent) |
| `.claude/skills/` | Claude Code |
| `.cursor/skills/` | Cursor |
| `.codex/skills/` | OpenAI Codex |
| `.windsurf/skills/` | Windsurf |
| `.gemini/skills/` | Gemini CLI |
| `.github/skills/` | GitHub Copilot (project skills) |
| `.agent/skills/` | Google Antigravity |
| `.cline/skills/` | Cline |
| `.continue/skills/` | Continue |
| `.roo/skills/` | Roo Code |

3. **Custom roots** — additional paths named in `AGENTS.md` or by the user

**Deduplicate** — one copy per skill `name` in frontmatter; prefer `AGENTS.md` path, else first matching root in the table order.

**Choose skills to load** — include every skill whose `description` (frontmatter) or scope clearly governs the work area. Read each chosen skill's `SKILL.md` before picking references.

**Choose references for the plan** — per skill, in order:

1. **Task recipes** — if `SKILL.md` has a `## Task recipes` table, copy the closest row's reference basenames.
2. **Reference index** — pick rows whose "When to use" matches the task; add at most 1–2 extras if needed.
3. **`references/` folder** — list `<skill-dir>/references/*.md` and select basenames that match the task.
4. **Linked root docs** — include only when `SKILL.md` points to them for this task type.

Record basenames without `.md`. Use `skill-name/reference-basename` when names collide across skills.
