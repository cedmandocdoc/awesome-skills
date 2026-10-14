---
name: building-walkthroughs
id: 62987084-2733-4959-9c53-0e9ae812a34e
description: Builds and maintains hands-on walkthroughs of a whole app — one Markdown guide per task with exact on-screen steps and expected results, grouped by the app's own areas and chained into goal-driven journeys, with every route or screen covered or listed as a gap — plus a viewer, a full-screen map of areas where selecting a journey numbers its walkthroughs and draws its path, with a navigator, lenses, and a walkthrough sidebar floating over it. Works from the code alone; docs, stories, tests, and designs sharpen it. Use only when the user names this skill (`/building-walkthroughs`, `$building-walkthroughs`, or "building-walkthroughs"), or references a file under a marked walkthroughs root (`@walkthroughs/send-invoice.md`).
version: 2.1.0
---

# Building Walkthroughs

## Setup

| Item | Kind | Required | When | Done when | How |
| --- | --- | --- | --- | --- | --- |
| Node.js 20.19+ with npm | user | required | Create, Update | `node --version` reports 20.19 or later | https://nodejs.org |
| Root path | ask | required | Create | [walkthrough-contract.md](references/walkthrough-contract.md) → **Resolve walkthroughs root** finds a root | Ask for the folder (default `walkthroughs/`); a target that is not empty needs another path; recorded as the root's location |
| Root marker | static | required | Create | `<walkthroughs-root>/index.md` carries [walkthrough-contract.md](references/walkthrough-contract.md) → **Author signature** | Write `index.md` from [`assets/index.md`](assets/index.md) |
| Viewer app | static | required | Create, Update | The root's viewer files match [`assets/app/`](assets/app/) | Copy everything in [`assets/app/`](assets/app/), dotfiles included (`cp -R <skill>/assets/app/. <walkthroughs-root>/`) |
| Viewer install | auto | required | Create, Update | `<walkthroughs-root>/node_modules/` exists and the viewer did not change in this run | `npm install` in the root |
| Standing rule | auto | required | Create | Root `AGENTS.md` has the line | Add `- When a change alters the app's screens, routes, or user tasks, run the building-walkthroughs Update recipe in the same work.` to root `AGENTS.md` (create when missing) and to root `CLAUDE.md` when it exists without importing `AGENTS.md`; skip a file that has it |

## Workflow

1. **Setup** — for each **Setup** row whose When covers the request, in order: Done when holds → skip; `user` → stop and print its How when required, continue without it when optional; `ask` → fill what the request answers, ask the rest together in one message, record each answer; `auto` and `static` → run.
2. **Contract** — read [walkthrough-contract.md](references/walkthrough-contract.md).
3. **Recipe** — match one **Recipes** row; open every doc in its Read column.

- Leaves re-checking the app automatically to E2E tests.

## Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Set up | "Set up building-walkthroughs", "Is building-walkthroughs ready?" | **Setup** — run Workflow step 1 for every row, then report each row's state |
| Create | "Create walkthroughs for this app", "Build walkthroughs", "Add walkthroughs for billing" | [creating-walkthroughs.md](references/creating-walkthroughs.md) |
| Guide | "Walk me through sending an invoice", "Guide me through the getting-paid journey" | [guiding-walkthrough.md](references/guiding-walkthrough.md) |
| Update | "Update the walkthroughs for this change", "Split this walkthrough", "Move this to the Invoices area", the standing rule after an app change | [updating-walkthroughs.md](references/updating-walkthroughs.md) |
