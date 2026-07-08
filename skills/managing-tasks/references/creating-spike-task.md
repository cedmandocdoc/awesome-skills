# Creating Spike Task

## Overview

**Planning only.** Writes `plan.md`, `status.md`, and `findings.md` for a new spike/research/investigation task folder. Stop without implementing unless the user also asks to execute in the same message.

Use this reference when the user asks to explore requirements, assess achievability, or decide feasibility before delivery work.

## Prerequisites

- Per [task-contract.md](./task-contract.md) → **Resolve tasks root**
- Findings contract and required fields: [findings-contract.md](./findings-contract.md)

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

Capture only what is needed to decide feasibility and define follow-up work:

| Source | What to extract |
| --- | --- |
| User input | Question to answer, boundaries, deadline, decision owner |
| `README.md`, `AGENTS.md` | Constraints, architecture, conventions, required approvals |
| Mentioned files or systems | Known dependencies, complexity hotspots, unknowns |
| Existing tasks | Related implementations to avoid duplicate investigation |
| Project skills | Discovery and docs skills relevant to this domain |

Ask at most one clarifying question if the decision question is ambiguous.

### 4. Write `plan.md`

Use [`../assets/plan.md`](../assets/plan.md). Keep this plan research-focused.

Required adaptations for spike planning:

- Goal states the investigation question and target decision.
- Non-goals exclude implementation and production rollout.
- Phases focus on evidence gathering, option evaluation, and recommendation drafting.
- Verification checklist confirms findings quality, not feature behavior.
- Last step remains `verify`.

### 5. Write `status.md`

Use [`../assets/status.md`](../assets/status.md). Initialize:

- `overall_status`: `Not Started`
- `next_step_id`: first step id from the plan queue
- `handoff_note`: one sentence that points the executor to produce or complete `findings.md`
- Include full `task_folder` path in the execution pointer

### 6. Write `findings.md`

Use [`../assets/findings.md`](../assets/findings.md) and follow [findings-contract.md](./findings-contract.md).

Required content:

- Complete `Overview`, `Feasibility`, and `Deliverables`
- Use only recommendation labels: `feasible`, `not feasible`, or `conditional`
- Keep deliverables actionable and handoff-ready

### 7. Confirm to the user

Reply with:

- Tasks root path, new task folder path, and whether `index.md` was newly created
- One-line investigation summary
- Current recommendation label from `findings.md` (`feasible`, `not feasible`, or `conditional`)
- `next_step_id` for the executor
- Suggested follow-up:
  - "Continue `tasks/00x-spike-...` to finalize findings"
  - or "Create implementation task(s) from deliverables"

Stop without implementing unless the user also asked to execute in the same message.

## Related

- [creating-task.md](./creating-task.md)
- [findings-contract.md](./findings-contract.md)
