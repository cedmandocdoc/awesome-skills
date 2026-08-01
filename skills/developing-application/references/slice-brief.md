# Slice Brief

## Overview

The **eight questions** a developer answers before creating tasks for a wave. Portable across stacks: this file only asks; domain skills and HOW docs answer.

Answers are written into `waves/NN-slug.md`, not returned in parent chat. Emit task specs only after every applicable question has a written answer. If a question cannot be answered from Sources + current code + installed skills → fail early per [delivery-contract.md](./delivery-contract.md) → **Require HOW documents**.

## Guidelines

### The eight questions

| # | Question | Answer from | Notes |
| --- | --- | --- | --- |
| 1 | **Outcome** — What can a user (or operator) do when this wave is done? | Goal, FRD, user story | One paragraph max |
| 2 | **Surfaces** — Which pages, screens, views, CLI commands, or jobs — and which states? | UI specs, design, FRD | Empty for pure infra waves; list route shells for bootstrap |
| 3 | **Contracts** — What data crosses a boundary (schema, endpoints, queries, events, file formats)? | TRD / HOW docs | Name existing contracts; do not invent |
| 4 | **Building blocks** — What components, modules, or utilities are needed? For each: `exists` / `missing` / `extend` / `promote` | Survey + UI specs | `promote` = move to shared location this wave or next |
| 5 | **Existing-code delta** — What to reuse, move, or refactor before or while shipping the outcome? | Survey + prior wave review | Default `none` only after a real survey |
| 6 | **Conventions** — Which installed skills govern, and which reference basenames apply? | Skill discovery | Empty list only if no domain skill exists |
| 7 | **Order** — In what sequence should the work land inside this wave? | Items 3–5 | Typical: contracts → shared blocks → surfaces → wiring → verify |
| 8 | **Done** — How do we know the wave succeeded? | FRD acceptance, UI states | Align with [delivery-contract.md](./delivery-contract.md) → **Verification stance** |

### Building-block verdicts (question 4)

| Verdict | Meaning |
| --- | --- |
| `exists` | Reuse as-is; cite path in task Sources/Context |
| `missing` | Create in this wave (or a dedicated task in the wave) |
| `extend` | Change in place; task must name the file and the delta |
| `promote` | Move/extract to shared location; prefer same wave if consumers need it now |

### From brief to task specs

Turn the brief into an ordered list of **task specs** (short goal strings) for `managing-tasks` create multiple:

1. Follow question 7 order.
2. Each spec must be actionable alone and cite shared Sources (goal docs, HOW paths, design links).
3. Attach survey verdicts and reuse rules so `task-planner` fills **Current vs target** and **Constraints**.
4. Dynamic count: as many as needed for the smallest shippable vertical, **at most 7**.
5. If more than 7: keep the remainder as later waves on `delivery-map.md`; do not emit them yet.

### Spec quality bar

A good emitted spec includes enough that `task-planner` can write phases without inventing HOW:

- Goal sentence (outcome-sized, not “do everything”)
- Verbatim Sources paths/URLs from the map and brief
- Explicit Constraints: reuse/extend/promote paths; “change existing code when it is the right call”
- Skill names from question 6

Bad specs invent endpoints, invent UX, or say “set up the frontend” with no Sources.

## Related

- [deciding-next-wave.md](./deciding-next-wave.md)
- [delivery-contract.md](./delivery-contract.md)
