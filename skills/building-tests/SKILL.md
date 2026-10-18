---
name: building-tests
id: b315ad43-eba0-4d22-9784-9b8765b42360
description: Builds and runs an app's committed tests, written from the user's expectations rather than per platform — segments (one actor's intent on one surface, from a named backend state to the next), journeys (segments chained on one database across actors and surfaces), and properties (rules swept over every route) — as Markdown definitions with one implementation per surface, run by a bundled runner that builds each state through the app's own backend, signs personas in, calls the surface's test framework, and checks the resulting state. Use only when the user names this skill (`/building-tests`, `$building-tests`, or "building-tests"), or references a file under a marked tests root (`@tests/segments/orders/customer-approves-price.md`).
version: 1.0.0
---

# Building Tests

## Setup

| Item | Kind | Required | When | Done when | How |
| --- | --- | --- | --- | --- | --- |
| Node.js 22+ | user | required | All | `node --version` reports 22 or later | https://nodejs.org |
| Root path | ask | required | Create | [test-contract.md](references/test-contract.md) → **Resolve tests root** finds a root | Ask for the folder (default `tests/`); missing or empty → use it, else ask for another path; recorded as the root's location |
| Root marker | static | required | Create | `<tests-root>/index.md` carries [test-contract.md](references/test-contract.md) → **Author signature** | Write `index.md` from [`assets/index.md`](assets/index.md) |
| Stack config | ask | required | Create | `<tests-root>/index.md` frontmatter has `backend`, `health`, and `surfaces` filled | Fill per [test-contract.md](references/test-contract.md) → **Index frontmatter** from package scripts and app config; ask for what the code leaves empty; recorded in `index.md` frontmatter |
| Framework skill per surface | user | required | Create, Update, Run | For every `surfaces` id in `index.md`, a skill teaching that surface's framework is found per [test-contract.md](references/test-contract.md) → **Discover framework skill** | Install a general-purpose skill for the framework: `npx skills add <owner>/<repo> --skill <name>`; it must teach framework mechanics only, not test structure |
| Surface runtimes | user | required | Create, Update, Run | Every surface's `requires` command in `index.md` succeeds | Per the framework's docs, e.g. `npx playwright install chromium`; Maestro CLI, Java 17, and a booted emulator with the dev client installed |
| Runner | static | required | Create, Update, Run | `<tests-root>/runner/` matches [`assets/runner/`](assets/runner/) | Copy everything in [`assets/runner/`](assets/runner/) to `<tests-root>/runner/` |
| Package | static | required | Create | `<tests-root>/package.json` exists | Copy [`assets/package.json`](assets/package.json) and [`assets/gitignore`](assets/gitignore) (as `.gitignore`) into the root; name the package per the workspace's convention |
| Install | auto | required | Create, Update, Run | `<tests-root>/node_modules/` exists and `package.json` did not change in this run | Add the root to the workspace globs when a workspace file exists, then install with the project's package manager |
| Standing rule | auto | required | Create | Root `AGENTS.md` has the line | Add `- When a change alters a user flow, a backend state, or a route, run the building-tests Update recipe in the same work.` to root `AGENTS.md` (create when missing) and to root `CLAUDE.md` when it exists without importing `AGENTS.md`; skip a file that has it |

## Workflow

1. **Setup** — for each **Setup** row whose When covers the request, in order: Done when holds → skip; `user` → stop and print its How when required, continue without it when optional; `ask` → fill what the request answers, ask the rest together in one message, record each answer; `auto` and `static` → run.
2. **Contract** — read [test-contract.md](references/test-contract.md).
3. **Recipe** — match one **Recipes** row; open every doc in its Read column.

- Drives the app by hand only to diagnose a failing run.

## Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Set up | "Set up building-tests", "Is building-tests ready?" | **Setup** — run Workflow step 1 for every row, then report each row's state |
| Create | "Create tests for booking", "Add a journey for the order lifecycle", "Add an accessibility property" | [creating-tests.md](references/creating-tests.md) |
| Update | "Update the tests for this change", "Mark the decline case ready", the standing rule after a flow, state, or route change | [updating-tests.md](references/updating-tests.md) |
| Run | "Run the booking tests", "Run the order-lifecycle journey", "Why is this test failing?" | [executing-tests.md](references/executing-tests.md) |
| Review coverage | "What isn't tested?", "Show test coverage", "Which drafts need confirming?" | [reviewing-coverage.md](references/reviewing-coverage.md) |
