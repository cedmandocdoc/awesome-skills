# Goal Contract

## Overview

Shared plumbing for `delivering-goal`: signatures, goals-root layout, living `goal.md`, clear-goal gate, governing skills and method, phase sizing, task rules, commits, handoffs, and the delivery agent.

## Guidelines

### Author signature

Static UUID identifying goal artifacts created by this skill:

```text
c3f5a7b9-4d2e-6f8a-0b1c-5e7d9f2a4c6b
```

Every `<goals-root>/index.md`, `goal.md`, `phase.md`, and task file carries this value in frontmatter `author`.

### Subagent signature

Static UUID identifying delivery agents owned by this skill:

```text
d4a6b8c0-5e3f-7a9b-1c2d-6f8e0a3b5c7d
```

The delivery agent (`phase-deliverer`) carries frontmatter `author` (this UUID) and `generated_by: delivering-goal`.

### Output layout

```text
<goals-root>/                  # default when initializing: goals/
  index.md                     # root marker — created first
  01-mvp/                      # <goal-id> = <goal-dir>
    goal.md                    # living backlog: phase index, method pin
    phases/
      01-first-slice/          # <phase-id> = <phase-dir>
        phase.md               # phase brief + ordered task list
        01-schema.md           # task (ticket): plan, steps, status, findings
        02-login-ui.md
```

Templates: [`../assets/index.md`](../assets/index.md), [`../assets/goal.md`](../assets/goal.md), [`../assets/phase.md`](../assets/phase.md), [`../assets/task.md`](../assets/task.md).

Ids are `{NN}-{slug}`: next `NN` = highest two-digit prefix among siblings + 1 (or `01`); slug is lowercase, hyphens only, ~40 chars max, filler dropped (`the`, `a`, `implement`, `build`). A user-provided name becomes the goal slug.

### Resolve goals root

Search the repository for `index.md` with frontmatter `doc_type: goals-root-index`, `generated_by: delivering-goal`, and `author` = **Author signature**. The root is its parent directory.

| Matches | Action |
| --- | --- |
| One | Use it |
| Multiple | Ask which (list each `index.md` path) |
| None | On plan / deliver: ask once for a path (default `goals/`), verify it is empty or missing, write `index.md` from the template. Otherwise stop — no goals root |

Resolve a goal by user cue (`01-mvp`, `mvp`) under the root; one goal → use it; several and no cue → ask.

### Living goal.md

`goal.md` is the source of truth for **what** to deliver and the only place phase status lives.

| Rule | Detail |
| --- | --- |
| Phase status | `pending` → `ready` (phase dir + tasks written) → `done`; or `blocked` |
| Allowed edits | Insert, rewrite, reorder, split, or drop `pending` rows |
| Protected rows | `ready` / `done` / `blocked` rows change only when the user asks to replan |
| Changelog | Every row edit bumps `map_revision` and adds a changelog line |

Task status lives only in each task file’s frontmatter: `pending` → `in-progress` → `done`; or `blocked` with `blocked_reason`.

### Require clear goal

Hard gate before writing any goal file — both answerable from the goal statement or its sources without inventing:

| Question | Meaning |
| --- | --- |
| **Outcome** | What is true when the goal is done |
| **Scope** | What is in and out |

Missing approach detail does not fail the gate. Inline: list gaps and ask once. Subagent: return `Blocked delivery: unclear goal — <gaps>`.

### Governing skills and method

Bound once at plan time; phase planning reads the pin and repins only when the user asks.

1. **Discover skills** — explicit pointers first (`AGENTS.md`, the request, `@`-mentions, **Skills to prefer**), then `<root>/<skill-name>/SKILL.md` under project roots `.agents/skills/`, `.claude/skills/`, `.cursor/skills/`, `.codex/skills/`, `.windsurf/skills/`, `.gemini/skills/`, `.github/skills/`, `.agent/skills/`, `.cline/skills/`, `.continue/skills/`, `.roo/skills/`, then the same folders under `~/`, then custom roots named in `AGENTS.md`. One copy per `name`; prefer a project copy.
2. **Bind** — record on `goal.md` → **Governing skills** every skill whose description governs the goal’s work. None → `none`.
3. **Pin method** — in each governing skill’s `SKILL.md`, find one recipe whose intent is delivering a phase or slice. Pin `skill` + reference basename; several → prefer **Skills to prefer**, else the most specific; none → `none`. A `none` pin never stops delivery.

### Task rules

Each task is one commit-sized ticket: actionable alone, without inventing the goal.

| Field | Rule |
| --- | --- |
| Requirements → Sources | Every URL, design link, ticket, and `@` path from the goal and phase that the task depends on, verbatim. Empty only when the goal and phase have none for this task |
| Requirements → Acceptance | Concrete checks; every phase **Done** check lands in some task’s Verification |
| Context → Skills to load | Governing skills plus skills that govern this task’s files |
| Context → References | Skill reference basenames (`basename` or `skill/basename`), ~6 max, picked from each skill’s recipe table or reference index |
| Steps | Ordered, with concrete file paths; last step is always `verify` |
| Order | Tasks run in file order; a later task may build on earlier ones |

### Phase sizing

A phase groups work that shares code context, so one survey serves every task. Used when seeding the index and when choosing each phase.

| Rule | Test |
| --- | --- |
| One outcome | Its **Done** reads as one sentence |
| One area | Tasks touch overlapping files or packages; tasks sharing no files belong in separate phases |
| One method | The same governing skills and method apply; a different governing skill starts a new phase |
| Leaves things working | After the phase, the project builds and its checks pass — nothing half-wired |
| Fits one context | At most **7** tasks, each about one commit; the files they touch can be read in one pass |
| Ends at unknowns | When later work depends on what this phase reveals, end the phase there and let **Findings** shape the next |

### Commits

Every commit point writes one commit on the current branch:

| Point | Who | Stages | Subject |
| --- | --- | --- | --- |
| Goal planned | Main session | `index.md`, `goal.md` | `docs: plan goal <goal-id>` |
| Phase planned | Deliverer, before any code | `phase.md`, task files, `goal.md` | `docs: plan phase <phase-id> of <goal-id>` |
| Task done | Deliverer | The task’s changes and its task file; on the last task also `goal.md` (row `done`) | Task title in the repo’s style |
| Goal complete | Deliverer | `goal.md` | `docs: complete goal <goal-id>` |

1. Check `git status --short`, `git diff --stat`, `git log -5 --oneline`.
2. Stage only paths `git add` accepts — never `git add -f`, never secrets.
3. Never push, amend, skip hooks, or change git config unless asked. Nothing to commit → skip.

Blocked work stays uncommitted.

### Handoff style

Subagent replies are one line of paths; no bodies, logs, or diffs. Parent prompts pass resolved paths (`Skill dir`, `Goal`) so the agent skips discovery; it searches the skill roots above only when a path is missing.

### Delivery agents

`phase-deliverer` is required wherever the harness supports subagents. Roots, project first:

| IDE | Root | Filename |
| --- | --- | --- |
| Cursor | `.cursor/agents/` | `<name>.md` |
| Claude Code | `.claude/agents/` | `<name>.md` |
| Codex | `.codex/agents/` | `<name>.md` |
| Cline | `.cline/agents/` | `<name>.md` |
| GitHub Copilot | `.github/agents/` | `<name>.agent.md` |
| Gemini CLI | `.gemini/agents/` | `<name>.md` |
| Antigravity | `.agent/agents/` | `<name>.md` |
| Roo Code | `.roo/agents/` or `.roomodes` | `<name>.md` or mode entry |
| Portable fallback | `.agents/agents/` | `<name>.md` |

User-level fallbacks (reuse only): `~/.cursor/agents/`, `~/.claude/agents/`, `~/.codex/agents/`, `~/.copilot/agents/`.

**Find:** accept the first file whose `name` is the agent id, `author` is the **Subagent signature**, and `generated_by` is `delivering-goal`. Missing → stop: `Create the subagent first by running delivering-goal creating-delivery-agents.`
