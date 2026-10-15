# Planning Goal

## Overview

**Planning only.** Runs inline in the main session once per goal: gate, survey, identify the workflow, write `goal.md` with an ordered index of candidate phases (titles, outcomes, dependencies, gates — not briefs), and confirm it with the user.

## Prerequisites

Per [goal-contract.md](./goal-contract.md) → **Require clear goal**, **Resolve goals root**, **Output layout**, **Living goal.md**, **Workflow**, **Review gate**, **Phase sizing**.

## Guidelines

### 1. Gate and root

1. Run **Require clear goal**; ask once on gaps and wait for the answer.
2. Resolve `<goals-root>` per **Resolve goals root**.
3. Assign `<goal-id>`. If that goal folder exists and the user did not ask to replan → stop and offer to continue it.

### 2. Survey

Short pass: greenfield vs existing workspace, conventions, prior goals, which workflow outputs already exist. Record **Current state** on `goal.md`.

### 3. Identify the workflow

Per **Workflow**.

### 4. Seed the phase index

Order high-level deliverables toward the goal per **Workflow** and **Phase sizing** — not technical steps. Each row: Id, Title, Gate per **Review gate** → **Suggest** (`review` or `none`), Status `pending`, Depends on, one-line Outcome, Phase dir `none`. A phase that cannot be named without inventing goal detail fails the clear-goal gate.

### 5. Write

1. Copy [`../assets/goal.md`](../assets/goal.md) → `<goal-dir>/goal.md`; fill frontmatter (`goal_id`, `goal`), Goal, Sources (verbatim), Workflow, Current state, Phases, Verification, Changelog.
2. Add the goal row to `<goals-root>/index.md`.
3. Replan of an existing goal → edit pending rows only, bump `map_revision`, changelog line.

### 6. Confirm with the user

1. Show the **Workflow**, the phase rows with their gates, and any work no listed skill governs. Ask: proceed, or change the workflow, phases, or gates?
2. Apply each change to `goal.md`; repeat until the user proceeds.
3. Commit **Goal planned** per [goal-contract.md](./goal-contract.md) → **Commits**.
4. Reply: `goal.md` path and next step (“deliver goal”). Run from the deliver recipe → continue its loop instead.
