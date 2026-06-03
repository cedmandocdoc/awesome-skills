---
name: building-react-web-application
description: Guides building Vite + React SPA apps with TypeScript using a consistent architecture and library stack (Tailwind CSS v4, class-variance-authority, TanStack Router file-based routes, TanStack Query, Zustand, Axios, shadcn-style tokens, primitives in src/ui). Use when creating a new React web project or updating architecture/UI/state/API/routing/styling to follow these conventions.
version: 1.0.0
---

# React web application

Opinionated ecosystem for building Vite-based React SPAs with a consistent architecture, library stack, and UI system (`src/ui`).

## Tech stack

| Layer               | Choice                                                              |
| ------------------- | ------------------------------------------------------------------- |
| Bundler             | Vite                                                                |
| Language            | TypeScript                                                          |
| Styling             | Tailwind CSS v4, class-variance-authority (`cva` + `cx` from the same package) |
| Routing             | TanStack Router (file-based, `src/routes`)                          |
| Server state        | TanStack Query                                                      |
| Client global state | Zustand                                                             |
| HTTP                | Axios                                                               |
| Presentational UI   | shadcn/ui-style primitives in `src/ui/`                             |

## When to use

- New or existing Vite + React SPAs that use TanStack Router, Tailwind v4, and shared UI in `src/ui/`
- Architecture, library, or folder-structure decisions aligned with [structuring-project.md](./references/structuring-project.md)
- UI, state, API, routing (layouts, path params, search params), or styling work that should follow this skill’s conventions

## References

| Doc | When to use |
| --- | --- |
| [structuring-project.md](./references/structuring-project.md) | Plan folders, providers, `global.css` + `src/theme.css`, `src/ui`, and import boundaries. |
| [managing-environment.md](./references/managing-environment.md) | Define and validate env vars with per-module `env.ts`, Zod, and Vite `VITE_*` / `import.meta.env`. |
| [styling.md](./references/styling.md) | Apply Tailwind utilities, CVA variants, and `cx` patterns in components. |
| [styling-preference.md](./references/styling-preference.md) | Follow this project's preferred styling conventions and decision rules. |
| [Tailwind CSS — Using Vite](https://tailwindcss.com/docs/installation/using-vite) | Install or verify Tailwind CSS v4 setup for Vite projects. |
| [setting-up-theming.md](./references/setting-up-theming.md) | Wire app theming via `global.css` and `src/theme.css` token structure. |
| [setting-up-tailwind-theme.md](./references/setting-up-tailwind-theme.md) | Map semantic design tokens to Tailwind theme values. |
| [configuring-routing.md](./references/configuring-routing.md) | Configure file-based routes, layouts, params, and generated route tree usage. |
| [TanStack Router — Installation with Vite](https://tanstack.com/router/latest/docs/installation/with-vite.md) | Install or bootstrap TanStack Router in a Vite app. |
| [File-based routing](https://tanstack.com/router/latest/docs/routing/file-based-routing.md) | Implement and troubleshoot file-based route conventions. |
| [MDN — @font-face](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face) | Self-host web fonts and define `@font-face` declarations correctly. |
| [Google Fonts](https://fonts.google.com/) | Choose and import hosted web fonts quickly for UI typography. |
| [placing-component.md](./references/placing-component.md) | Decide whether a component belongs in `src/ui/` or `src/features/`. |
| [creating-component.md](./references/creating-component.md) | Build presentational components with clear props and composition. |
| [managing-wrapper-components.md](./references/managing-wrapper-components.md) | Keep wrapper components shallow and merge `className` with `cx`. |
| [abstracting-component.md](./references/abstracting-component.md) | Extract reusable UI primitives and follow registry-first abstraction rules. |
| [naming-component.md](./references/naming-component.md) | Apply consistent component naming across shared UI and features. |
| [creating-feature.md](./references/creating-feature.md) | Create new feature modules, barrels, and internal structure. |
| [promoting-feature.md](./references/promoting-feature.md) | Promote feature-local components into `src/ui/` when reuse grows. |
| [managing-state.md](./references/managing-state.md) | Choose between Query, Zustand, local state, or route state. |
| [managing-form-components.md](./references/managing-form-components.md) | Set up `src/ui/Form/`, `createFormHook`, `FieldShell`, and pre-bound `*Field` components. |
| [managing-form-error.md](./references/managing-form-error.md) | Handle `onServer` and field errors with `ApiError`; wire into existing form UI. |
| [managing-stepper-hook.md](./references/managing-stepper-hook.md) | Create feature stepper hooks (`useXStepper`) with Stepperize `defineStepper`, `useStepper`, and `Scoped`. |
| [managing-stepper-form.md](./references/managing-stepper-form.md) | Build multi-step forms using Stepperize + TanStack Form + Zod step schemas. |
| [creating-api.md](./references/creating-api.md) | Structure API clients and feature-facing data hooks. |
| [managing-api-error.md](./references/managing-api-error.md) | Map API failures to `ApiError`; consume `error.message` in TanStack Query and UI. |
| [setting-up-axios.md](./references/setting-up-axios.md) | Configure Axios instance defaults, interceptors, and API boundaries. |
| [adding-registry-components.md](./references/adding-registry-components.md) | Add components from registry into `src/ui/` with project conventions. |
| [add-registry-component.js](./scripts/add-registry-component.js) | Run the helper script to vendor registry components and apply path/class fixes. |
| [linting.md](./references/linting.md) | Apply linting/formatting rules, including `routeTree.gen.ts` handling. |
| [overriding-classname.md](./references/overriding-classname.md) | Resolve Tailwind `className` conflicts on shared components using targeted `!` overrides. |
