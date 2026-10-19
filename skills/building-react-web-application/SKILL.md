---
name: building-react-web-application
id: 83101311-e63c-4973-811e-5a84cc1a9e19
description: Guides building Vite + React SPAs with TypeScript on a fixed stack (Tailwind CSS v4, TanStack Router file-based routes, TanStack Query, TanStack Form, Zod) with consistent strategies for structure, data and errors, async states, forms, styling from a supplied design, and auth guards. Use when creating a Vite + React SPA, or changing code in an app whose `package.json` has `vite` and `@tanstack/react-router`, to follow these conventions.
version: 2.0.0
---

# React web application

## Setup

| Item | Kind | Required | When | Done when | How |
| --- | --- | --- | --- | --- | --- |
| Node.js 22.12+ | user | required | All | `node --version` reports 22.12 or later | https://nodejs.org |
| Standing rule | auto | required | Scaffold new app | Root `AGENTS.md` has the line | Add `` - `<target_path>` follows building-react-web-application; load it before changing code there. `` to root `AGENTS.md` (create when missing) and to root `CLAUDE.md` when it exists without importing `AGENTS.md`; skip a file that has it |

## Workflow

1. **Setup** — for each **Setup** row whose When covers the request, in order: Done when holds → skip; `user` → stop and print its How when required, continue without it when optional; `ask` → fill what the request answers, ask the rest together in one message, record each answer; `auto` and `static` → run.
2. **Contract** — read [web-app-contract.md](references/web-app-contract.md).
3. **Recipe** — match one **Recipes** row; open every doc in its Read column.

- A request that spans rows (a new route with a form) matches each of them.

## Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Set up | "Set up building-react-web-application", "Is building-react-web-application ready?" | **Setup** — run Workflow step 1 for every row, then report each row's state |
| Scaffold | "Create a Vite + React app in apps/web", "Scaffold here", "Add linting and env handling to the app" | [scaffolding-application.md](references/scaffolding-application.md), [managing-package-installs.md](references/managing-package-installs.md), [managing-environment.md](references/managing-environment.md), [managing-linting.md](references/managing-linting.md) |
| Structure | "Where does this module belong?", "Can a feature import another feature?", "Move this component to the right layer" | [managing-project-structure.md](references/managing-project-structure.md) |
| Page / feature | "Add a settings page", "New orders feature", "Add a sidebar", "Add a /settings route" | [managing-project-structure.md](references/managing-project-structure.md), [creating-page.md](references/creating-page.md) |
| UI primitive | "Add a Dialog to src/ui", "Port the design's button" | [managing-project-structure.md](references/managing-project-structure.md), [creating-ui-component.md](references/creating-ui-component.md), [managing-styling.md](references/managing-styling.md) |
| Data and errors | "Fetch orders from the API", "Add a mutation for checkout", "Format the order date" | [managing-data.md](references/managing-data.md), [managing-environment.md](references/managing-environment.md) |
| Async UI states | "Show the orders list with loading and error states", "Load more orders on scroll" | [creating-async-component.md](references/creating-async-component.md), [managing-data.md](references/managing-data.md) |
| Form / multi-step | "Add a profile form", "Make checkout a three-step form" | [creating-form.md](references/creating-form.md), [managing-data.md](references/managing-data.md) |
| Styling / theme | "Apply the design tokens", "Change the brand colors", "Override a className", "Use Inter as the body font" | [managing-styling.md](references/managing-styling.md) |
| Auth guard | "Protect the dashboard", "Add the sign-in flow" | [setting-up-auth-guard.md](references/setting-up-auth-guard.md), [creating-page.md](references/creating-page.md) |
