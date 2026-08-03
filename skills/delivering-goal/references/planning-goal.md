# Planning Goal

## Overview

**Planning only.** Orients once per goal: survey, categorize, bind skills best-effort, pin governing method, resolve or initialize the goals root, create `<goals-root>/<NN>-<slug>/`, and write `goal.md` as a seeded living backlog (ordered candidate phases — titles, deps, sources; not full briefs). Returns a **one-line** handoff when run as `goal-planner`.

## Prerequisites

Per [goal-contract.md](./goal-contract.md) → **Require clear goal**, **Resolve goals root**, **Assign goal id and slug**, **Categorize goal**, **Resolve goal.md**, **Living goal.md**, **Bind governing skills**, **Pin governing method**, **`index.md` status mirror**, **Handoff style**.

## Guidelines

### 1. Fail-early checks

1. Run the **Require clear goal** gate (Outcome + Scope). Inline: stop and ask the user to close the gaps. Subagent: `Failed goal plan: unclear goal — <gaps>`.
2. Resolve `<goals-root>` (initialize when needed — default suggestion `goals/`). Subagent without a root and without `Goals root:` in the prompt → `Failed goal plan: missing goals root`.

### 2. Survey current state

Short pass: empty vs existing workspace; prior goals; obvious conventions and structure. Record **Current state** on `goal.md`. Greenfield is valid.

### 3. Categorize, bind skills, pin method

1. Set `domain` and optional `tags` per **Categorize goal**.
2. Discover and bind governing skills best-effort (**Bind governing skills**). List on `goal.md`. Continue when none match.
3. Resolve a delivery method once and **pin** it on `goal.md` (**Pin governing method**). Honor **Skills to prefer** from the parent prompt.

### 4. Derive phase index (seed)

From goal + survey + pinned method (when present), produce an **ordered** list of candidate phase rows — high-level deliverables toward the goal, not low-level technical steps. For each row:

| Field | Content |
| --- | --- |
| Id | e.g. `01-first-slice` (matches future filename without `.md`) |
| Title | Short name |
| Status | `pending` |
| Depends on | Prior phase ids or `none` |
| Outcome | One-line outcome (decide meta Q1 at phase grain) |
| Primary Sources | Paths only |
| Phase file | `none` until decide |
| Task ids | `none` |

If a phase cannot be named without inventing missing goal detail → fail early via the clear-goal gate. Mark pending rows as **candidates** on `goal.md` (decide may revise them later per **Living goal.md**).

### 5. Write goal folder + `goal.md`

1. **Assign goal id and slug** per contract (next `NN` + slug from user name or goal).
2. Create `<goal-dir>` and `<goal-dir>/phases/` if new. If the folder already exists and the user did not ask to continue/replan → `Skipped goal plan: goal <goal-id> already exists`.
3. Copy [`../assets/goal.md`](./../assets/goal.md); set frontmatter `goal_id`, `goal`, `domain`, `tags`; fill sources, skills, **Governing method** pin, current state, **Phases** index, verification, changelog.
4. Append or update the row in `<goals-root>/index.md` (`Status` = `planned` on create).
5. Continuing the same goal → update pending rows carefully, bump `map_revision`, changelog line. Protected rows per **Living goal.md**.

### 6. Confirm to the user

| Outcome | Reply |
| --- | --- |
| Success | `Planned goal: <path-to-goal-dir>/goal.md` |
| Failure | `Failed goal plan: <reason>` |
| Skip | `Skipped goal plan: <reason>` |

When run **inline** (plan-only, not via subagent), the same one-liner plus a one-sentence “next: deliver goal / decide next phase” is enough.

## Related

- [delivering-goal.md](./delivering-goal.md)
- [deciding-next-phase.md](./deciding-next-phase.md)
- [goal-contract.md](./goal-contract.md)
