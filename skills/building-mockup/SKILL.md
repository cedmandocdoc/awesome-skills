---
name: building-mockup
id: a6e1b77b-1781-4935-b156-5b80670063ff
description: >-
  Builds a thin mockup of one app or website under mockup/, one per root, in the
  form its users do the hero flow on: a phone app (390×844 screens), a desktop
  web app (1440×900 screens in a browser frame), or a website (responsive pages
  for 1440 and 390 wide that scroll). One hero flow as static HTML screens with
  realistic sample data and a "Sample" label, a flow.md that orders the screens
  with the tap, fill, scroll, and hold of each step, and a compact design.md in
  DESIGN.md format — no state, routing, data, or build step. Use only when the
  user names this skill (`/building-mockup`, `$building-mockup`, or
  "building-mockup"), or references a file under a marked mockup root
  (`@mockup/flow.md`).
version: 3.0.0
---

# Building Mockup

## Setup

| Item | Kind | Required | When | Done when | How |
| --- | --- | --- | --- | --- | --- |
| Root path and intention | ask | required | All | [mockup-contract.md](references/mockup-contract.md) → **Resolve mockup root** finds a root for the request's app | Ask for the folder (default `mockup/`), the app or website it mocks up (one short phrase), and its form per [mockup-contract.md](references/mockup-contract.md) → **Forms** (default: the device its users do the hero flow on); missing or empty → use it, else ask for another path; recorded as the root's location and its `app`, `form` and `intention` |
| Root marker | static | required | All | `<mockup-root>/index.md` carries [mockup-contract.md](references/mockup-contract.md) → **Author signature** | Write `index.md` from [`assets/index.md`](assets/index.md) with `app`, `form` and `intention` |
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
| Create or amend | "/building-mockup a dentist clinic booking app", "a desktop payroll system for a restaurant", "a website for an auto detailing shop", "mockup this proposal: …", "make the calendar screen busier", a reference to `@mockup/flow.md` | [creating-mockup.md](references/creating-mockup.md) |
