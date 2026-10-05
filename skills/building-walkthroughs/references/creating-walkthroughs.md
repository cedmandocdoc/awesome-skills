# Creating Walkthroughs

## Overview

**Authoring mode.** Finds an app's user journeys, writes one walkthrough per journey (core first), and sets up the index and viewer. Run on a project with no walkthroughs root, or to add journeys to an existing one.

## Prerequisites

[walkthrough-contract.md](./walkthrough-contract.md).

## Guidelines

### 1. Resolve root

Per contract → **Resolve walkthroughs root**; initialize when none exists. On an existing root, read `index.md` and every walkthrough's frontmatter.

### 2. Fill inputs

Per contract → **Inputs**. Confirm the app runs and each baseline is reachable by reading its commands' source.

### 3. Find journeys

1. List what users can do from routes, screens, and actions; sharpen with specs, design flows, and E2E tests when present.
2. Name the core journeys (what the app exists for) and the branches off them (errors, alternatives, edge paths whose steps differ).
3. Cut per contract → **Cutting journeys**; group core walkthroughs into lines and pick each one's `starts_from`.
4. Propose to the user in one message: lines with their stations in order, branches, baselines, suggested facets, and skipped journeys with what each needs. Write after the user confirms or adjusts.

### 4. Write the index

Fill `index.md` from [`../assets/index.md`](../assets/index.md): frontmatter (`app`, `baselines`, `lines`), app summary, how to start the app, baselines table, accounts.

### 5. Write walkthroughs

Core walkthroughs first, line by line in replay order, then branches. Each from [`../assets/walkthrough.md`](../assets/walkthrough.md) per contract → **Walkthrough frontmatter**, **Writing a walkthrough**, and **Expected values**. Trace each step through the code that handles it to get labels, results, and `covers`.

### 6. Dry run (optional)

When a browser tool or the running app is reachable, follow each walkthrough from its start and correct labels and **You should see** lines that differ. Record nothing else.

### 7. Sync

Run `npm run index`, then `npm run check`, then contract → **Checklist**.

### 8. Confirm to the user

Reply with the root path, how to view (`npm run dev` in the root), lines and walkthroughs written (core first), skipped journeys and what each needs, the instruction files changed, and whether the dry run ran.
