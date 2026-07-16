# Creating Spike Task

## Overview

**Planning only.** Writes `plan.md`, `status.md`, and `findings.md` for a new spike/research/investigation task folder. Stop without implementing unless the user also asks to execute in the same message.

Use this reference when the user asks to explore requirements, assess achievability, or decide feasibility before delivery work.

**Structure:** copy [`../assets/plan.md`](../assets/plan.md), [`../assets/status.md`](../assets/status.md), and [`../assets/findings.md`](../assets/findings.md). **Infra:** [task-contract.md](./task-contract.md) → **Resolve tasks root**, **Initialize tasks root**, **`index.md` status mirror**. **Findings validation:** [findings-contract.md](./findings-contract.md).

## Prerequisites

- Per [task-contract.md](./task-contract.md) → **Resolve tasks root**
- Findings validation: [findings-contract.md](./findings-contract.md)

## Guidelines

### 1. Resolve tasks root

Per [task-contract.md](./task-contract.md) → **Resolve tasks root**, **Finding tasks root**, and **Initialize tasks root** when no `index.md` marker exists.

### 2. Assign task id and slug

Within the resolved tasks root:

1. List directories matching `[0-9][0-9][0-9]-*/`.
2. Parse the highest three-digit prefix; next id = max + 1 (or `001` if none).
3. Build slug from the title:
   - lowercase, hyphens only, max ~40 chars
   - include discovery intent when useful (`spike`, `research`, `investigation`)
   - example: `Investigate offline sync feasibility` → `spike-offline-sync-feasibility`
4. Folder name: `{id}-{slug}` (e.g. `008-spike-offline-sync-feasibility`).

If the folder already exists, stop and ask whether to overwrite or pick a new slug.

### 3. Gather spike context

Capture the decision question and every source the investigation must consult:

| Source | What to extract |
| --- | --- |
| User input | Question to answer, **Sources** (URLs, Figma/design links, tickets, docs), boundaries, deadline, decision owner, acceptance for "enough research" |
| `README.md`, `AGENTS.md` | Constraints, architecture, conventions, required approvals |
| Mentioned files or systems | Known dependencies, complexity hotspots, unknowns |
| Existing tasks | Sibling folders to set as **Depends on** (hard prereqs) or **Related tasks** (informational only) |
| Project skills | Discovery and docs skills relevant to this domain |

**Prompt fidelity** — every URL, file path, and constraint from the user message must land in `plan.md` → **Requirements**. Prefer verbatim Sources over paraphrase.

If the prompt includes a URL (or `@` path to a design/spec) and Sources would otherwise be empty, stop and ask once for the missing link or path before writing the plan.

Ask at most one clarifying question if the decision question is ambiguous (in addition to the Sources check above).

### 4. Write `plan.md`

Copy [`../assets/plan.md`](../assets/plan.md). Set `task_type: spike`. Keep this plan research-focused.

| Section | Spike content |
| --- | --- |
| Goal | Investigation question and target decision |
| Requirements | Same fidelity rules as [creating-task.md](./creating-task.md) — Sources, Scope, Constraints, Acceptance |
| Non-goals | Exclude implementation and production rollout |
| Context | Same **Depends on** / **Related tasks** rules as [creating-task.md](./creating-task.md); default both to `none` |
| Approach | Research questions, unknowns, and evidence to gather |
| Phases | Evidence gathering → option evaluation → recommendation drafting into `findings.md` |
| Verification checklist | Findings quality (label, rationale, actionable deliverables) — not feature behavior |
| Last todo | Remains `verify` |

Put external URLs in **Requirements → Sources**, not in Context **References**.

### 5. Write `status.md`

Copy [`../assets/status.md`](../assets/status.md). Initialize:

- `overall_status`: `Not Started`
- `next_step_id`: first step id from the plan queue
- `handoff_note`: one sentence that points the executor to produce or complete `findings.md`
- Include full `task_folder` path in the execution pointer

### 6. Write `findings.md`

Copy [`../assets/findings.md`](../assets/findings.md). Satisfy [findings-contract.md](./findings-contract.md) (template is skeleton only):

- Complete `Overview`, `Feasibility`, and `Deliverables`
- Use only recommendation labels: `feasible`, `not feasible`, or `conditional`
- Keep deliverables actionable and handoff-ready

### 7. Confirm to the user

Before replying, sync `<tasks-root>/index.md` per [task-contract.md](./task-contract.md) → **`index.md` status mirror**:

- Append `task-<NNN-slug>` with task title and `Status` = `Not Started`.

Reply with:

- Tasks root path, new task folder path, and whether `index.md` was newly created
- One-line investigation summary
- Whether Requirements Sources captured any URLs or design links
- Current recommendation label from `findings.md` (`feasible`, `not feasible`, or `conditional`)
- `next_step_id` for the executor
- Suggested follow-up:
  - "Continue `tasks/00x-spike-...` to finalize findings"
  - or "Create implementation task(s) from deliverables"

Stop without implementing unless the user also asked to execute in the same message.

## Related

- [creating-task.md](./creating-task.md)
- [findings-contract.md](./findings-contract.md)
