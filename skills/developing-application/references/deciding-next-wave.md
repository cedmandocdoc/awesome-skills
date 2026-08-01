# Deciding Next Wave

## Overview

**Execution mode.** Review + decide + create in one pass. Inspects current implementation and any prior wave, writes the next numbered `waves/NN-slug.md`, creates that wave’s tasks via `managing-tasks` create multiple, updates the delivery map index. Returns a **one-line** handoff (path + task ids) — not wave body content.

Used by `wave-decider` and by humans asking only for the next wave.

## Prerequisites

Per [delivery-contract.md](./delivery-contract.md) → **Require managing-tasks**, **Resolve delivery map**, **Require HOW documents** (wave-scoped), **Wave files**, **Invoke companion recipes**.

Slice questions: [slice-brief.md](./slice-brief.md).

For create-multiple: companion `managing-tasks` must find `task-planner` (via that skill’s finding-task-agents). If missing → `Failed wave: Create the subagent first by running managing-tasks creating-task-agents.`

## Guidelines

### 1. Resolve map

Resolve `delivery-map.md`. If none → `Failed wave: no delivery map — run planning-delivery`.

Read the map’s wave **index** (paths/status only). `<delivery-dir>` is the map’s parent. Ensure `<delivery-dir>/waves/` exists.

### 2. Review prior implementation (merged review)

If any wave file has `status: ready` or `implementing`, or the latest wave is `done` with unread carry-forward:

1. Survey the codebase areas those tasks touched (and archives if Done)
2. Check goal alignment lightly against that wave’s Outcome / Done criteria
3. List **Carry forward**: promote / extend / refactor / skill-alignment gaps
4. If that wave’s tasks are still open and not Done → do **not** start a new wave; if execution left them mid-flight, set wave `implementing` and return `Blocked delivery: wave <path> still has unfinished tasks — run managing-tasks execute multiple`
5. If prior wave is `blocked` → return `Blocked delivery: <path> — <reason>` (do not create the next wave)
6. When prior wave work is Done and verified enough per contract stance → set that wave file `status: done`, update map row, bump map revision

If **no** prior wave files → skip to §3 (greenfield / first wave). Record survey of empty-or-existing tree for Slice Brief Q4–Q5.

### 3. Pick next outcome from the map

1. From the map index, take the first wave row with status `pending` whose depends-on rows are `done` (or none)
2. If the map has only high-level pending titles without files — that row is the candidate outcome
3. If no pending rows remain → return `Delivery complete: <path-to-delivery-map.md>`
4. If the next row cannot be briefed without inventing HOW → return `Blocked delivery: missing HOW — <paths/sections>`

### 4. Slice Brief + write wave file

1. Survey target area (current code + carry forward from §2)
2. Answer all eight questions in [slice-brief.md](./slice-brief.md)
3. Assign `NN-slug` per [delivery-contract.md](./delivery-contract.md) → **Wave files**
4. Copy [`../assets/wave.md`](../assets/wave.md) → `<delivery-dir>/waves/NN-slug.md`; set frontmatter `delivery` from the map; fill Outcome, Sources, brief answers, ordered **Task specs**, Carry forward, Verification
5. Set wave frontmatter `status: ready` only after tasks exist (§5); until then keep specs in the file and map row `in_progress`

Hard rules: no invented contracts/UX; conventions = real installed skills (+ Skills to prefer from parent); order is dependency-real.

### 5. Create tasks

1. Derive ≤7 ordered specs from the brief ([slice-brief.md](./slice-brief.md) → **From brief to task specs**)
2. If more work remains, append extra **pending** rows on the map for later waves; do not emit them now
3. Per [delivery-contract.md](./delivery-contract.md) → **Invoke companion recipes**, run `managing-tasks` **Create multiple**:
   - Spec list = this wave’s specs
   - Carry shared Sources from the wave file into every planner prompt
   - `max_created` = spec count (≤7)
4. On create failure / skip with `stop_on_failure` → return `Failed wave: <reason>`
5. Write created `task-<NNN-slug>` ids into the wave file **Task ids** section; set `status: ready`
6. Update map index: Wave file path, Task ids, Status `ready`; changelog + `map_revision` bump

### 6. Confirm to the user

| Outcome | Reply |
| --- | --- |
| Tasks created | `Wave ready: <delivery-dir>/waves/NN-slug.md; tasks: task-<NNN-slug>, ...` |
| Milestone done | `Delivery complete: <path-to-delivery-map.md>` |
| Cannot proceed | `Blocked delivery: <reason>` |
| Error | `Failed wave: <reason>` |

Do not return Slice Brief text, spec lists, or file body excerpts.

When invoked **outside** the delivery loop (user asked decide-only), the same one-liner is enough; suggest execute delivery or `managing-tasks` execute multiple next.

## Related

- [executing-delivery.md](./executing-delivery.md)
- [planning-delivery.md](./planning-delivery.md)
- [slice-brief.md](./slice-brief.md)
