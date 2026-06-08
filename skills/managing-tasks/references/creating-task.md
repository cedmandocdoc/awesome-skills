# Creating a task

**Planning only.** Do not write application code unless the user explicitly asks to implement in the same message.

## 1. Resolve tasks root

Per [task-contract.md](./task-contract.md) → **Resolve tasks root**, **Finding tasks root**, and **Initialize tasks root** when no `index.md` marker exists.

## 2. Assign task id and slug

Within the resolved tasks root:

1. List directories matching `[0-9][0-9][0-9]-*/`.
2. Parse the highest three-digit prefix; next id = max + 1 (or `001` if none).
3. Build slug from the title:
   - lowercase, hyphens only, max ~40 chars
   - drop filler words when helpful (`implement`, `the`, `a`)
   - example: `Add user profile settings page` → `user-profile-settings`
4. Folder name: `{id}-{slug}` (e.g. `007-user-profile-settings`).

If the folder already exists, stop and ask whether to overwrite or pick a new slug.

## 3. Gather project context

| Source | What to extract |
| --- | --- |
| User input | Goal, constraints, files/features mentioned |
| `README.md`, `AGENTS.md` | Conventions, skill references, architecture notes |
| Project structure | Monorepo layout, app/package boundaries, key directories |
| Mentioned files | **Read them** — patterns, dependencies, related code |
| Project skills | Discover applicable skills per [task-contract.md](./task-contract.md) |
| Existing tasks | Related plans under the tasks root (reference, do not duplicate) |

Ask **at most one** clarifying question if scope or target area is ambiguous.

## 4. Write `plan.md`

Use [`../assets/plan.md`](../assets/plan.md). Required sections:

| Section | Content |
| --- | --- |
| YAML frontmatter | `name`, `overview`, `generated_by: managing-tasks`, `plan_revision: 1`, `todos` (id + content + status: pending) |
| Goal | One paragraph outcome |
| Non-goals | Explicit out-of-scope items |
| Context | Files, related tasks, **Skills to load**, **References** |
| Phases | Ordered steps with concrete file paths; optional per-phase `References:` |
| Verification checklist | How to confirm done |
| Risks | Non-obvious decisions or blockers |

Keep phases implementation-ready: file paths, patterns to follow, acceptance criteria per phase.

**Skills and references** — when conventions apply, fill Context using skill discovery in [task-contract.md](./task-contract.md). Include reference basenames, not skill names alone (~6 references max unless scope requires more).

## 5. Write `status.md`

Use [`../assets/status.md`](../assets/status.md). Initialize:

- `overall_status`: `Not Started`
- `next_step_id`: first step id from the plan's todo/step queue
- All steps: unchecked
- `handoff_note`: one sentence describing what the executor should do first
- Include full `task_folder` path in the execution pointer

## 6. Confirm to the user

Reply with:

- Tasks root path (via `index.md`), task folder path, and whether `index.md` was newly created
- One-line summary
- `next_step_id` for the executor
- Suggested follow-up: _"Continue `tasks/001-dark-mode-toggle`"_ or _"Read `tasks/001-dark-mode-toggle/status.md` and run the next step"_

**Stop without implementing** unless the user also asked to implement in the same message.
