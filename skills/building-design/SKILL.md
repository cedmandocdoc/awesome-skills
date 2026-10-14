---
name: building-design
id: caa2ddd5-c78f-41af-8a9d-1af7973d08ac
description: Builds and amends runnable designs — a DESIGN.md (tokens, motion, voice, implementation rules, decisions) plus React previews of every UI block and feature screen, with presets, states, flows, spec files, and final copy, reviewed in a board-and-play viewer — so an implementer ports the design instead of interpreting it. Use only when the user names this skill (`/building-design`, `$building-design`, or "building-design"), or references a file under a marked design root (`@design/design.md`, a `.design.ts` file).
version: 4.5.0
---

# Building Design

## Setup

| Item | Kind | Required | When | Done when | How |
| --- | --- | --- | --- | --- | --- |
| Node.js 20.19+ with npm | user | required | All | `node --version` reports 20.19 or later | https://nodejs.org |
| Root path and intention | ask | required | All | [design-contract.md](references/design-contract.md) → **Resolve design root** finds a root for the request's intention | Ask for the folder (default per [design-contract.md](references/design-contract.md) → **Design roots**) and the intention (one short phrase); missing or empty → use it, else ask for another path; recorded as the root's location and `index.md` → `intention` |
| Root marker | static | required | All | `<design-root>/index.md` carries [design-contract.md](references/design-contract.md) → **Author signature** | Write `index.md` from [`assets/index.md`](assets/index.md) with `intention` |
| Viewer app | static | required | All | Viewer files and `index.md` → **Viewer keys** match [`assets/`](assets/) | Copy everything in [`assets/app/`](assets/app/), dotfiles included (`cp -R <skill>/assets/app/. <design-root>/`); replace `index.md` → **Viewer keys** from [`assets/index.md`](assets/index.md) |
| Viewer install | auto | required | All | `<design-root>/node_modules/` exists | `npm install` in the design root |

## Workflow

1. **Setup** — for each **Setup** row whose When covers the request, in order: Done when holds → skip; `user` → stop and print its How when required, continue without it when optional; `ask` → fill what the request answers, ask the rest together in one message, record each answer; `auto` and `static` → run.
2. **Contract** — read [design-contract.md](references/design-contract.md) and [preview-contract.md](references/preview-contract.md).
3. **Recipe** — match one **Recipes** row; open every doc in its Read column.

## Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Set up | "Set up building-design", "Is building-design ready?" | **Setup** — run Workflow step 1 for every row, then report each row's state |
| Build or amend | "Design the checkout feature", "Make the hero headline shorter", a reference to `@design/design.md` or a `.design.ts` file | [creating-design.md](references/creating-design.md) |
