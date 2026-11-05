---
name: building-app-mockup
id: a6e1b77b-1781-4935-b156-5b80670063ff
description: >-
  Builds a thin app mockup under mockups/: one hero flow as 3–6 static, phone-sized
  HTML screens with realistic sample data and a "Sample app" label, a flow.md that
  orders the screens with the tap, fill, and hold of each step, and a compact
  design.md in DESIGN.md format — no state, routing, data, or build step. Use only
  when the user names this skill (`/building-app-mockup`, `$building-app-mockup`,
  or "building-app-mockup"), or references a file under a marked mockups root
  (`@mockups/dentist-clinic/flow.md`).
version: 1.0.0
---

# Building App Mockup

## Setup

| Item | Kind | Required | When | Done when | How |
| --- | --- | --- | --- | --- | --- |
| Root path | ask | required | All | [mockup-contract.md](references/mockup-contract.md) → **Resolve mockups root** finds a root | Ask for the folder (default `mockups/`); missing or empty → use it, else ask for another path; recorded as the root's location |
| Root marker | static | required | All | `<mockups-root>/index.md` carries [mockup-contract.md](references/mockup-contract.md) → **Author signature** | Write `index.md` from [`assets/index.md`](assets/index.md) |
| Node.js | user | optional | Create or amend | `node --version` succeeds | https://nodejs.org |
| Playwright Chromium | user | optional | Create or amend | `npx -y playwright screenshot about:blank <tmp>/check.png` succeeds | `npx -y playwright install chromium` |

## Workflow

1. **Setup** — for each **Setup** row whose When covers the request, in order: Done when holds → skip; `user` → stop and print its How when required, continue without it when optional; `ask` → fill what the request answers, ask the rest together in one message, record each answer; `auto` and `static` → run.
2. **Contract** — read [mockup-contract.md](references/mockup-contract.md).
3. **Recipe** — match one **Recipes** row; open every doc in its Read column.

## Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Set up | "Set up building-app-mockup", "Is building-app-mockup ready?" | **Setup** — run Workflow step 1 for every row, then report each row's state |
| Create or amend | "/building-app-mockup a dentist clinic booking app", "mockup this proposal: …", "make the calendar screen busier", a reference to `@mockups/<app-slug>/flow.md` | [creating-mockup.md](references/creating-mockup.md) |
