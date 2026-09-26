# Planning Goal

## Overview

**Planning only.** Runs inline in the main session once per goal: gate, survey, bind skills, pin method, and write `goal.md` with an ordered index of candidate phases (titles, outcomes, dependencies — not briefs).

## Prerequisites

Per [goal-contract.md](./goal-contract.md) → **Require clear goal**, **Resolve goals root**, **Output layout**, **Living goal.md**, **Governing skills and method**, **Phase sizing**.

## Guidelines

### 1. Gate and root

1. Run **Require clear goal**; ask once on gaps and wait for the answer.
2. Resolve or initialize `<goals-root>`.
3. Assign `<goal-id>`. If that goal folder exists and the user did not ask to replan → stop and offer to continue it.

### 2. Survey

Short pass: greenfield vs existing workspace, conventions, prior goals. Record **Current state** on `goal.md`.

### 3. Bind skills and pin method

Per **Governing skills and method**.

### 4. Seed the phase index

Order high-level deliverables toward the goal per **Phase sizing** — not technical steps. Each row: Id, Title, Status `pending`, Depends on, one-line Outcome, Phase dir `none`. A phase that cannot be named without inventing goal detail fails the clear-goal gate.

### 5. Write

1. Copy [`../assets/goal.md`](../assets/goal.md) → `<goal-dir>/goal.md`; fill frontmatter (`goal_id`, `goal`), Goal, Sources (verbatim), Governing skills, Governing method, Current state, Phases, Verification, Changelog.
2. Add the goal row to `<goals-root>/index.md`.
3. Replan of an existing goal → edit pending rows only, bump `map_revision`, changelog line.
4. Commit **Goal planned** per [goal-contract.md](./goal-contract.md) → **Commits**.

### 6. Confirm to the user

Reply: `goal.md` path, phase titles, and next step (“deliver goal”).
