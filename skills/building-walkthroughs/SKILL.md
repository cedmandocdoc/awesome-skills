---
name: building-walkthroughs
id: 62987084-2733-4959-9c53-0e9ae812a34e
description: Builds and maintains hands-on walkthroughs of a whole app — one Markdown guide per task with exact on-screen steps and expected results, grouped by the app's own areas and chained into goal-driven journeys, with every route or screen covered or listed as a gap — plus a viewer, a full-screen map of areas where selecting a journey numbers its walkthroughs and draws its path, with a navigator, lenses, and a walkthrough sidebar floating over it. Works from the code alone; docs, stories, tests, and designs sharpen it. Use only when the user names this skill (`/building-walkthroughs`, `$building-walkthroughs`, or "building-walkthroughs"), or references a file under a marked walkthroughs root (`@walkthroughs/send-invoice.md`).
version: 2.0.0
---

# Building Walkthroughs

## Overview

Turns any app into walkthroughs that show how all of it works. From the code, the skill derives areas (the app's navigation), actors, tasks, variations, and journeys, then writes one walkthrough per task until every route and screen is covered or recorded as a gap with a reason. A copied Vite viewer draws the areas as a full-screen map, spotlights a journey's ordered path when one is selected, and opens each walkthrough beside the map, with steps as one card per actor. Re-checking the app automatically belongs to E2E tests.

## Dependencies

| Item | Required | When | How |
| --- | --- | --- | --- |
| Node.js 20.19+ with npm | required | Viewer, `npm run check`, `npm run index` | https://nodejs.org |

## Setup

| Item | Required | When | How |
| --- | --- | --- | --- |
| Standing rule | required | Create | Add `- When a change alters the app's screens, routes, or user tasks, run the building-walkthroughs Update recipe in the same work.` to root `AGENTS.md` (create when missing) and to root `CLAUDE.md` when it exists without importing `AGENTS.md`; skip a file that has it |

## Agent workflow

Follow this skill when the user names it, or references a file under a walkthroughs root marked by an `index.md` with this skill's author signature. Works wherever the agent can read the app's code and write repository files. Resolve every **required** **Dependencies** and **Setup** row, read [walkthrough-contract.md](references/walkthrough-contract.md) first, then match one **Recipes** row and open exactly that reference.

### Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Create | "Create walkthroughs for this app", "Build walkthroughs", "Add walkthroughs for billing" | [creating-walkthroughs.md](references/creating-walkthroughs.md) |
| Guide | "Walk me through sending an invoice", "Guide me through the getting-paid journey" | [guiding-walkthrough.md](references/guiding-walkthrough.md) |
| Update | "Update the walkthroughs for this change", "Split this walkthrough", "Move this to the Invoices area" | [updating-walkthroughs.md](references/updating-walkthroughs.md) |

## Reference index

### Contract

[walkthrough-contract.md](references/walkthrough-contract.md) — root, layout, model, inputs, coverage, lenses, index and walkthrough frontmatter, setup tree, cutting, writing and step format, sync, viewer, checklist.

| Doc | When to use |
| --- | --- |
| [walkthrough-contract.md](references/walkthrough-contract.md) | Every recipe |
| [creating-walkthroughs.md](references/creating-walkthroughs.md) | No walkthroughs yet, or new tasks to add |
| [guiding-walkthrough.md](references/guiding-walkthrough.md) | Walk the user through a walkthrough or journey live in chat |
| [updating-walkthroughs.md](references/updating-walkthroughs.md) | The app changed, or the user asks to restructure walkthroughs |

## Templates

- [`assets/index.md`](assets/index.md) — root marker and app guide
- [`assets/walkthrough.md`](assets/walkthrough.md) — one walkthrough
- [`assets/app/`](assets/app/) — viewer, `npm run check`, and `npm run index`, copied whole on init
