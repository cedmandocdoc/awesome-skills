# Creating Walkthroughs

## Overview

**Authoring mode.** Structures an app into areas, actors, tasks, variations, and journeys from its code, writes a walkthrough for every task so every screen is covered or listed as a gap, and sets up the index and viewer. Run on a project with no walkthroughs root, or to add walkthroughs to an existing one.

## Prerequisites

[walkthrough-contract.md](./walkthrough-contract.md).

## Guidelines

### 1. Resolve root

Per contract → **Resolve walkthroughs root**. A root that already existed → read `index.md` and every walkthrough's frontmatter.

### 2. Fill inputs

Per contract → **Inputs**. Confirm the app runs and each baseline is reachable by reading its commands' source.

### 3. Inventory surfaces

List every user-facing route or screen and every meaningful action on it, from the router, screen files, forms, and mutations. Note which actors reach each one from guards and permissions. Sharpen with docs, stories, and tests when present.

### 4. Build the model

Per contract → **Model**:

1. **Areas** from the app's navigation, in its order; place every surface in one.
2. **Actors** from roles and guards.
3. **Tasks** — what a person gets done on those surfaces, per contract → **Cutting tasks**; **variations** where the steps differ.
4. **Journeys** — chain tasks across areas by data and status dependencies; with no docs, ask what each actor comes to get done. Order journeys so the first is where a newcomer starts.
5. **Lenses** per contract → **Lenses**.
6. Each walkthrough's `starts_from` per contract → **Setup tree**.
7. **Gaps** — surfaces no walkthrough can cover, each with a valid reason per contract → **Coverage**.

### 5. Propose

Send the user one message: areas in order with their tasks and variations, actors, journeys with their ordered tasks and goals, lenses (or "none"), baselines, every non-baseline `starts_from` with the fact it needs, and the surface inventory with coverage N/M and each gap's reason. Write after the user confirms or adjusts.

### 6. Write the index

Fill `index.md` from [`../assets/index.md`](../assets/index.md) per contract → **Index frontmatter** and **Index body**.

### 7. Write walkthroughs

In this order, until every task and variation in the confirmed model is written: journey tasks in journey order, then the remaining tasks area by area, then variations. Each from [`../assets/walkthrough.md`](../assets/walkthrough.md) per contract → **Walkthrough frontmatter**, **Writing a walkthrough**, **Step format**, and **Expected values**. Trace each step through the code that handles it to get labels, results, `surfaces`, and `covers`.

### 8. Dry run (optional)

When a browser tool or the running app is reachable, follow each walkthrough from its start and correct labels and **You should see** lines that differ. Record nothing else.

### 9. Sync

Run `npm run index`, then `npm run check`, then contract → **Checklist**.

### 10. Confirm to the user

Reply with the root path, how to view (`npm run dev` in the root), the first journey, journeys and areas with walkthrough counts, coverage N/M with each gap and its reason, lenses, the instruction files changed, and whether the dry run ran.
