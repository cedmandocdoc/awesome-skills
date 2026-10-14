---
name: building-react-web-application
id: 83101311-e63c-4973-811e-5a84cc1a9e19
description: Guides building Vite + React SPA apps with TypeScript using a consistent architecture and library stack (Tailwind CSS v4, class-variance-authority, TanStack Router file-based routes, TanStack Query, Zustand, Axios, shadcn-style primitives in src/ui). Use when creating a Vite + React SPA, or changing code in an app whose `package.json` has `vite` and `@tanstack/react-router`, to follow these conventions.
version: 1.2.0
---

# React web application

## Setup

| Item | Kind | Required | When | Done when | How |
| --- | --- | --- | --- | --- | --- |
| Node.js 20.19+ | user | required | All | `node --version` reports 20.19 or later | https://nodejs.org |
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
| Scaffold new app | "Create a Vite + React app in apps/web", "Scaffold here" | [scaffolding-application.md](references/scaffolding-application.md) |
| Project bootstrap | "Add linting and env handling to the app", "Install TanStack Router and Tailwind" | [managing-project-structure.md](references/managing-project-structure.md), [managing-environment.md](references/managing-environment.md), [managing-linting.md](references/managing-linting.md), [managing-package-installs.md](references/managing-package-installs.md), [Tailwind CSS — Using Vite](https://tailwindcss.com/docs/installation/using-vite), [TanStack Router — Installation with Vite](https://tanstack.com/router/latest/docs/installation/with-vite.md) |
| Structure | "Where does this module belong?", "Can a feature import another feature?" | [managing-project-structure.md](references/managing-project-structure.md) |
| Component | "Build a component", "Move this component to the right layer" | [creating-component.md](references/creating-component.md) |
| New route / feature | "Add a settings page", "New orders feature" | [managing-project-structure.md](references/managing-project-structure.md), [creating-feature.md](references/creating-feature.md), [creating-route-component.md](references/creating-route-component.md), [creating-screen-component.md](references/creating-screen-component.md), [creating-component.md](references/creating-component.md), [TanStack Router — File-based routing](https://tanstack.com/router/latest/docs/routing/file-based-routing.md) |
| UI primitive | "Add a Dialog to src/ui", "Pull the shadcn button" | [creating-component.md](references/creating-component.md), [creating-ui-component.md](references/creating-ui-component.md), [discovering-registry-components.md](references/discovering-registry-components.md), [managing-wrapper-components.md](references/managing-wrapper-components.md), [add-registry-component.cjs](scripts/add-registry-component.cjs) |
| Feature component | "Build the CartItemRow" | [creating-component.md](references/creating-component.md), [creating-feature-component.md](references/creating-feature-component.md), [managing-wrapper-components.md](references/managing-wrapper-components.md) |
| Form | "Add a profile form" | [creating-form-component.md](references/creating-form-component.md), [managing-form-error.md](references/managing-form-error.md), [managing-state.md](references/managing-state.md), [managing-date.md](references/managing-date.md), [TanStack Form — Basic concepts](https://tanstack.com/form/latest/docs/framework/react/guides/basic-concepts) |
| Multi-step form | "Make checkout a three-step form" | [managing-stepper-hook.md](references/managing-stepper-hook.md), [managing-stepper-form.md](references/managing-stepper-form.md), [creating-form-component.md](references/creating-form-component.md), [managing-form-error.md](references/managing-form-error.md), [TanStack Form — Basic concepts](https://tanstack.com/form/latest/docs/framework/react/guides/basic-concepts), [TanStack Form — Form composition](https://tanstack.com/form/latest/docs/framework/react/guides/form-composition.md) |
| API + data hooks | "Fetch orders from the API", "Add a mutation for checkout" | [creating-api.md](references/creating-api.md), [setting-up-axios.md](references/setting-up-axios.md), [managing-api-error.md](references/managing-api-error.md), [managing-state.md](references/managing-state.md), [managing-date.md](references/managing-date.md) |
| Date / time | "Format the order date", "Handle time zones" | [managing-date.md](references/managing-date.md) |
| Styling / theme | "Change the brand colors", "Override a className" | [managing-styling.md](references/managing-styling.md), [setting-up-theming.md](references/setting-up-theming.md), [setting-up-tailwind-theme.md](references/setting-up-tailwind-theme.md), [overriding-classname.md](references/overriding-classname.md), [Tailwind CSS — Using Vite](https://tailwindcss.com/docs/installation/using-vite) |
| Fonts | "Use Inter as the body font" | [MDN — @font-face](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face), [Google Fonts](https://fonts.google.com/), [setting-up-theming.md](references/setting-up-theming.md), [setting-up-tailwind-theme.md](references/setting-up-tailwind-theme.md) |
| Routing only | "Add a /settings route", "Set up TanStack Router" | [creating-route-component.md](references/creating-route-component.md), [creating-navigation-component.md](references/creating-navigation-component.md), [TanStack Router — Installation with Vite](https://tanstack.com/router/latest/docs/installation/with-vite.md), [TanStack Router — File-based routing](https://tanstack.com/router/latest/docs/routing/file-based-routing.md) |
| In-app navigation | "Add a sidebar", "Link the header to settings" | [creating-route-component.md](references/creating-route-component.md), [creating-navigation-component.md](references/creating-navigation-component.md) |
| E2E testing | "Add Playwright tests for login" | [creating-e2e-testing.md](references/creating-e2e-testing.md), [managing-project-structure.md](references/managing-project-structure.md) |
