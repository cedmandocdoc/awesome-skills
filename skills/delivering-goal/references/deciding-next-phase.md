# Deciding Next Phase

## Overview

**Execution mode.** Review + categorize/bind + phase brief + create in one pass. After each executed phase (or on first phase), resurveys current state, **reads the pinned governing method** on `goal.md` (repins only per contract), revises the living backlog when needed, writes `phases/NN-slug.md`, creates tasks via `managing-tasks` create multiple, finalizes task ids on the phase file. Returns a **one-line** handoff (path + task ids) — not phase body content.

Used by `phase-decider` and by the delivering-goal loop. Not a standalone main recipe — open from [delivering-goal.md](./delivering-goal.md) or when the user asks only for the next phase.

The brief is portable: meta questions below only ask; the pinned governing method (and its skill) answers when present. Emit task specs only after every meta question has a written answer in the phase file. If a question cannot be answered from the goal, sources, survey, and any pinned method → fail early per [goal-contract.md](./goal-contract.md) → **Require clear goal**.

## Prerequisites

Per [goal-contract.md](./goal-contract.md) → **Require managing-tasks**, **Resolve goals root**, **Resolve goal.md**, **Living goal.md**, **Categorize goal**, **Pin governing method**, **Bind governing skills**, **Resolve delivery method**, **Require clear goal**, **Phase files**, **Invoke companion recipes**, **`index.md` status mirror**.

For create-multiple: companion `managing-tasks` must find `task-planner`. If missing → `Failed phase: Create the subagent first by running managing-tasks creating-task-agents.`

## Guidelines

### 1. Resolve goal.md

Resolve `goal.md` under the goals root. If none → `Failed phase: no goal.md — run planning-goal`.

Read the phase **index** (paths/status only). `<goal-dir>` is the parent of `goal.md`. Ensure `<goal-dir>/phases/` exists. Treat pending rows as **candidates**, not a fixed schedule. Read **Governing method** (the pin) before surveying.

### 2. Review prior phase

If any phase file has `status: ready` or `implementing`, or the latest phase is `done` and not yet closed on `goal.md`:

1. Survey areas that phase’s tasks touched (and archives if Done)
2. Check goal alignment lightly against that phase’s Outcome / Done criteria
3. Note anything that affects what comes next (stale pending rows, new dependencies, method hints)
4. If that phase’s tasks are still open and not Done → do **not** start a new phase; if execution left them mid-flight, set phase `implementing` and return `Blocked delivery: phase <path> still has unfinished tasks — run managing-tasks execute multiple`
5. If prior phase is `blocked` → return `Blocked delivery: <path> — <reason>`
6. When prior phase work is Done and verified enough per its Done criteria → set that phase file `status: done`, update `goal.md` row and root `index.md`, bump map revision

If **no** prior phase files → skip to §3 (first phase). Survey current state for the brief.

### 3. Refresh category and pinned method

1. Confirm or revise `domain` / `tags` from goal + survey.
2. **Read the pinned Governing method** on `goal.md`. When present, open that method for this pass.
3. Repin only per [goal-contract.md](./goal-contract.md) → **Pin governing method** (pin is `none` and a method now matches; domain/tags/Skills to prefer changed; or user asked). Otherwise keep the pin.
4. Update **Governing skills** on `goal.md` when the list changed.

### 4. Candidate outcome

1. From the index, note the first `pending` row whose depends-on rows are `done` (or none) — this is the **candidate**, not yet committed
2. If no pending rows remain and the goal is met → update root `index.md` to `done`; return `Goal complete: <path-to-goal.md>`
3. If no pending rows remain but the goal is unmet → derive the next candidate from goal + survey (+ pinned method), or return `Blocked delivery: map exhausted but goal unmet — replan or clarify goal`
4. If the candidate cannot proceed without inventing → return `Blocked delivery: unclear goal — <gaps>`

When the pinned method requires unblock work before the candidate, revise `goal.md`: insert that phase ahead of the candidate, bump `map_revision`, changelog the reason. The original candidate stays pending behind it. Choose **one** phase for this pass.

### 5. Phase brief + write phase file

1. Survey the target area for the **chosen** phase — existing structure, conventions, and what is already implemented (or greenfield)
2. Answer every **Meta question** below into the phase file
3. Copy the pin into the phase **Governing method** field (`skill` + method basename, or `none`)
4. When a method is pinned, answer its questions under **Method notes** and honor its rules (see **Method notes**)
5. Assign `NN-slug` per [goal-contract.md](./goal-contract.md) → **Phase files**
6. Copy [`../assets/phase.md`](../assets/phase.md) → `<goal-dir>/phases/NN-slug.md`; set `goal_id`, Outcome, Sources, Skills, Governing method (pin copy), Method notes, meta answers, ordered **Task specs**, Verification
7. Leave phase frontmatter `status` unset or non-`ready` until tasks exist (§7)
8. Update `goal.md` for the chosen phase row as far as possible (phase file path; leave Status unset or non-`ready` until §7); bump changelog / `map_revision` when the map changed

#### Meta questions

| # | Question | Answer from | Notes |
| --- | --- | --- | --- |
| 1 | **Outcome** — What is true when this phase is done? | Goal; or unblock statement when the phase only enables later work | One paragraph max |
| 2 | **Deliverable kinds** — What artifacts does this phase produce? | Pinned method when present; else goal + survey | Name kinds only — no invented specs |
| 3 | **Order** — In what sequence should the work land inside this phase? | Pinned method when present; else dependencies among deliverables | Dependency-real order |
| 4 | **Done** — How do we know the phase succeeded? | Goal acceptance; or method verification rules when present | Concrete checks, not vague “looks good” |
| 5 | **Current state** — What already exists that this phase must reuse or extend? | Workspace survey; Sources; conventions | Cite paths or state greenfield; grounds task specs |

#### Method notes

When a governing method is pinned on `goal.md` ([goal-contract.md](./goal-contract.md) → **Pin governing method**):

1. Answer that reference’s questions into the phase file **Method notes** section.
2. Follow any sequencing or reuse rules it defines for this phase (including inserting a prior pending map row when it requires unblock work first).
3. Prefer the method’s deliverable vocabulary over inventing kinds in meta Q2.

When the pin is `none`, leave **Method notes** as `none` and complete the meta questions only.

### 6. Create tasks

1. Derive ≤7 ordered specs from the brief (**From brief to task specs** below)
2. Spill extras as later **pending** rows on `goal.md`; revise as needed
3. Per [goal-contract.md](./goal-contract.md) → **Invoke companion recipes**, run `managing-tasks` **Create multiple**:
   - Spec list = this phase’s specs
   - Carry shared Sources, governing skill names, and pinned method constraints into every planner prompt
   - `max_created` = spec count (≤7)
4. On create failure / skip with `stop_on_failure` → return `Failed phase: <reason>`

#### From brief to task specs

1. Follow meta Q3 order (and method order when present).
2. Each spec must be actionable alone and cite shared Sources (goal paths, method constraints, **existing artifacts from Q5**).
3. Attach governing skill names from the pin so `task-planner` can load them.
4. Dynamic count: as many as needed for the smallest shippable unit, **at most 7**.
5. If more than 7: keep the remainder as later **pending** rows on `goal.md`; do not emit them yet.

#### Spec quality bar

A good emitted spec includes enough that `task-planner` can write plan steps without inventing the goal:

- Goal sentence (outcome-sized)
- Verbatim Sources paths/URLs from `goal.md` and brief
- What already exists (from Q5) or explicit greenfield
- Constraints from method notes when present
- Skill names from the pin when present

Bad specs invent requirements the goal and sources do not support, or say “do the next part” with no Sources and no current-state grounding.

### 7. Finalize phase ready

1. Write created `task-<NNN-slug>` ids into the phase file **Task ids** section; set `status: ready`
2. Update `goal.md` index: Phase file path, Task ids, Status `ready`; set root `index.md` to `active`; changelog + `map_revision` bump when needed

### 8. Confirm to the user

| Outcome | Reply |
| --- | --- |
| Tasks created | `Phase ready: <goal-dir>/phases/NN-slug.md; tasks: task-<NNN-slug>, ...` |
| Milestone done | `Goal complete: <path-to-goal.md>` |
| Cannot proceed | `Blocked delivery: <reason>` |
| Error | `Failed phase: <reason>` |

Do not return phase brief text, method notes, or file body excerpts.

When invoked **outside** the delivery loop (decide-only), the same one-liner is enough; suggest deliver goal or `managing-tasks` execute multiple next.

## Related

- [delivering-goal.md](./delivering-goal.md)
- [planning-goal.md](./planning-goal.md)
- [goal-contract.md](./goal-contract.md)
