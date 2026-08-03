# Creating Task

## Overview

**Planning only.** Writes `plan.md` and `status.md` for a new implementation task folder. Stop without implementing unless the user also asks to implement in the same message.

Copy [`../assets/plan.md`](../assets/plan.md) and [`../assets/status.md`](../assets/status.md). Infra: [task-contract.md](./task-contract.md) → **Resolve tasks root**, **Initialize tasks root**, **`index.md` status mirror**, **Discovering project skills**.

## Prerequisites

Per [task-contract.md](./task-contract.md) → **Resolve tasks root**.

## Guidelines

### 1. Resolve tasks root

Per [task-contract.md](./task-contract.md) → **Resolve tasks root**. Initialize when no `index.md` marker exists.

### 2. Assign task id and slug

Within the resolved tasks root:

1. List folders matching `[0-9][0-9][0-9]-*/`.
2. Next id = highest three-digit prefix + 1 (or `001` if none).
3. Slug from title: lowercase, hyphens only, max ~40 chars; drop filler words when helpful (`implement`, `the`, `a`). Example: `Add user profile settings page` → `user-profile-settings`.
4. Folder name: `{id}-{slug}` (e.g. `007-user-profile-settings`).

If the folder already exists, stop and ask whether to overwrite or pick a new slug.

### 3. Gather project context

Extract from the user prompt first, then enrich from the repo.

| Source | What to extract |
| --- | --- |
| User input | Goal, **Sources** (URLs, Figma/design links, tickets, PRD paths, screenshots), scope names, constraints, acceptance language, `@`-mentioned paths |
| `README.md`, `AGENTS.md` | Conventions, skill references, architecture notes |
| Project structure | Monorepo layout, app/package boundaries, key directories |
| Mentioned files | Read them — patterns, dependencies, related code |
| Project skills | Per [task-contract.md](./task-contract.md) → **Discovering project skills** |
| Existing tasks | Sibling folders for **Depends on** (hard prereqs) or **Related tasks** (informational) |

**Prompt fidelity** — every URL, file path, and acceptance phrase from the user message lands in `plan.md` → **Requirements**. Prefer verbatim Sources over paraphrase.

If the prompt includes a URL (or `@` path to a design/spec) and Sources would otherwise be empty, ask once for the missing link or path before writing the plan.

Ask **at most one** clarifying question if scope or target area is ambiguous (in addition to the Sources check).

### 4. Write `plan.md`

Copy [`../assets/plan.md`](../assets/plan.md). Set `task_type: implementation`. Fill:

| Section | Content |
| --- | --- |
| YAML frontmatter | `name`, `overview`, `generated_by: managing-tasks`, `task_type: implementation`, `plan_revision: 1`, `todos` (id + content + status: pending) |
| Goal | One paragraph outcome |
| Requirements | **Sources**, **Scope**, **Constraints**, **Acceptance** from the user prompt |
| Non-goals | Explicit out-of-scope items |
| Context | Area, files, **Depends on**, **Related tasks**, **Skills to load**, **References** (skill basenames only) |
| Approach | Omit when the path is obvious; otherwise state the chosen strategy |
| Phases | Ordered implementation steps with concrete file paths; cite Requirements Sources when a step depends on them |
| Verification checklist | How to confirm done — mirror Requirements Acceptance |
| Risks | Non-obvious decisions or blockers |

Keep phases implementation-ready: file paths, patterns to follow, acceptance criteria per phase.

External URLs and design/spec paths go in Requirements → **Sources**. Skill recipe basenames go in Context → **References** (resolve later via [task-contract.md](./task-contract.md) → **Resolving domain references**). ~6 skill references max unless scope requires more.

Both **Depends on** and **Related tasks** default to `none`:

| Field | Use when | Value format |
| --- | --- | --- |
| **Depends on** | This task must wait until those tasks are `Done` | Folder names (e.g. `001-auth-schema`); comma-separate multiple |
| **Related tasks** | Informational sibling links only — never blocks readiness | Same folder-name format, or `none` |

Put a sibling in **Depends on** only when the user or plan order requires it finished first. Encode ordering in **Depends on**, not phase prose — triage reads **Depends on** only.

### 5. Write `status.md`

Copy [`../assets/status.md`](../assets/status.md). Initialize:

- `overall_status`: `Not Started`
- `next_step_id`: first step id from the plan's todo/step queue
- All steps unchecked
- `handoff_note`: one sentence for what the executor should do first
- Full `task_folder` path in the execution pointer

### 6. Confirm to the user

Sync `<tasks-root>/index.md` per [task-contract.md](./task-contract.md) → **`index.md` status mirror**: append `task-<NNN-slug>` with title and `Status` = `Not Started`.

Reply with:

- Tasks root path (via `index.md`), task folder path, and whether `index.md` was newly created
- One-line summary
- Whether Requirements Sources captured any URLs or design links
- `next_step_id` for the executor
- Suggested follow-up: _"Continue `tasks/001-dark-mode-toggle`"_ or _"Read `tasks/001-dark-mode-toggle/status.md` and run the next step"_

## Related

- [creating-multiple-tasks.md](./creating-multiple-tasks.md) — orchestrate several new tasks via `task-planner`

## Examples

**Create (new repo):** No `index.md` → ask for empty folder → write `index.md` then `001-…/plan.md` + `status.md` → suggest continue.

**Create (Figma parity):** Component + Figma URL → Requirements Sources includes the full URL; phases cite it; Context References lists skill basenames separately.
