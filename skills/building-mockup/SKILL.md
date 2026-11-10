---
name: building-mockup
id: a6e1b77b-1781-4935-b156-5b80670063ff
description: >-
  Builds a thin app mockup under mockup/, one app per root: one hero flow as 3–6 static, phone-sized
  HTML screens with realistic sample data and a "Sample app" label, a flow.md that
  orders the screens with the tap, fill, and hold of each step, and a compact
  design.md in DESIGN.md format — no state, routing, data, or build step. Use only
  when the user names this skill (`/building-mockup`, `$building-mockup`,
  or "building-mockup"), or references a file under a marked mockup root
  (`@mockup/flow.md`).
version: 2.0.0
---

# Building Mockup

## Setup

| Item | Kind | Required | When | Done when | How |
| --- | --- | --- | --- | --- | --- |
| Root path and intention | ask | required | All | [mockup-contract.md](references/mockup-contract.md) → **Resolve mockup root** finds a root for the request's app | Ask for the folder (default `mockup/`) and the app it mocks up (one short phrase); missing or empty → use it, else ask for another path; recorded as the root's location and its `app` and `intention` |
| Root marker | static | required | All | `<mockup-root>/index.md` carries [mockup-contract.md](references/mockup-contract.md) → **Author signature** | Write `index.md` from [`assets/index.md`](assets/index.md) with `app` and `intention` |
| Node.js | user | optional | Create or amend | `node --version` succeeds | https://nodejs.org |
| Playwright Chromium | user | optional | Create or amend | `npx -y playwright screenshot about:blank <tmp>/check.png` succeeds | `npx -y playwright install chromium` |

## Workflow

1. **Setup** — for each **Setup** row whose When covers the request, in order: Done when holds → skip; `user` → stop and print its How when required, continue without it when optional; `ask` → fill what the request answers, ask the rest together in one message, record each answer; `auto` and `static` → run.
2. **Contract** — read [mockup-contract.md](references/mockup-contract.md).
3. **Recipe** — match one **Recipes** row; open every doc in its Read column.

## Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Set up | "Set up building-mockup", "Is building-mockup ready?" | **Setup** — run Workflow step 1 for every row, then report each row's state |
| Create or amend | "/building-mockup a dentist clinic booking app", "mockup this proposal: …", "make the calendar screen busier", a reference to `@mockup/flow.md` | [creating-mockup.md](references/creating-mockup.md) |
