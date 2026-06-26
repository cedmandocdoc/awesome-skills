---
name: building-react-web-application
description: Guides building Vite + React SPA apps with TypeScript using a consistent architecture and library stack (Tailwind CSS v4, class-variance-authority, TanStack Router file-based routes, TanStack Query, Zustand, Axios, shadcn-style primitives in src/ui). Use when creating a new React web project or updating architecture, UI, state, API, routing, or styling to follow these conventions.
version: 1.0.0
---

# React web application

Opinionated ecosystem for building Vite-based React SPAs with a consistent architecture, library stack, and UI system (`src/ui`).

## Agent workflow

1. **Pick an entry** — use [Entry points](#entry-points) below.
2. **Classify the task** — match every applicable row in **Task types** (many tasks span multiple rows).
3. **Component work** — when the task involves any component, open [creating-component](./references/creating-component.md) and follow its decision tree.
4. **Read before coding** — open every linked doc from matched task rows and from the decision tree.

## Entry points

Four ways into this skill. Use the first row that matches; combine rows when the task spans types (e.g. new route + form).

| Entry | When | Go to |
| --- | --- | --- |
| Component | Building, moving, or recategorizing any component | [creating-component](./references/creating-component.md) |
| Structure | Folder roles, dependency flow, or where a module belongs | [managing-project-structure](./references/managing-project-structure.md) |
| Task bundle | API, forms, styling, bootstrap, testing, fonts, routing-only, navigation | **Task types** table |
| Lookup | You know the doc name or need a single reference | **Reference index** |

## Task types

Match every row that applies. Open every link in the **Docs** column from each matching row before coding.

| Task type                 | Docs                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| New route / feature       | [managing-project-structure](./references/managing-project-structure.md), [creating-feature](./references/creating-feature.md), [creating-route-component](./references/creating-route-component.md), [creating-screen-component](./references/creating-screen-component.md), [creating-component](./references/creating-component.md), [TanStack Router — File-based routing](https://tanstack.com/router/latest/docs/routing/file-based-routing.md)                                               |
| UI primitive (`src/ui/`)  | [creating-component](./references/creating-component.md), [creating-ui-component](./references/creating-ui-component.md), [managing-wrapper-components](./references/managing-wrapper-components.md), [add-registry-component.cjs](./scripts/add-registry-component.cjs)                                                                                                                                                                                                                            |
| Feature component         | [creating-component](./references/creating-component.md), [creating-feature-component](./references/creating-feature-component.md), [managing-wrapper-components](./references/managing-wrapper-components.md)                                                                                                                                                                                                                                                                                      |
| Form (single step)        | [creating-form-component](./references/creating-form-component.md), [managing-form-error](./references/managing-form-error.md), [managing-state](./references/managing-state.md), [TanStack Form — Basic concepts](https://tanstack.com/form/latest/docs/framework/react/guides/basic-concepts)                                                                                                                                                                                                     |
| Multi-step form           | [managing-stepper-hook](./references/managing-stepper-hook.md), [managing-stepper-form](./references/managing-stepper-form.md), [creating-form-component](./references/creating-form-component.md), [managing-form-error](./references/managing-form-error.md), [TanStack Form — Basic concepts](https://tanstack.com/form/latest/docs/framework/react/guides/basic-concepts), [TanStack Form — Form composition](https://tanstack.com/form/latest/docs/framework/react/guides/form-composition.md) |
| API + data hooks          | [creating-api](./references/creating-api.md), [setting-up-axios](./references/setting-up-axios.md), [managing-api-error](./references/managing-api-error.md), [managing-state](./references/managing-state.md)                                                                                                                                                                                                                                                                                      |
| Refactor / move component | [creating-component](./references/creating-component.md)                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Styling / theme           | [styling](./references/styling.md), [styling-preference](./references/styling-preference.md), [setting-up-theming](./references/setting-up-theming.md), [setting-up-tailwind-theme](./references/setting-up-tailwind-theme.md), [overriding-classname](./references/overriding-classname.md), [Tailwind CSS — Using Vite](https://tailwindcss.com/docs/installation/using-vite)                                                                                                                     |
| Fonts                     | [MDN — @font-face](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face), [Google Fonts](https://fonts.google.com/), [setting-up-theming](./references/setting-up-theming.md), [setting-up-tailwind-theme](./references/setting-up-tailwind-theme.md)                                                                                                                                                                                                                                        |
| Project bootstrap         | [managing-project-structure](./references/managing-project-structure.md), [managing-environment](./references/managing-environment.md), [linting](./references/linting.md), [Tailwind CSS — Using Vite](https://tailwindcss.com/docs/installation/using-vite), [TanStack Router — Installation with Vite](https://tanstack.com/router/latest/docs/installation/with-vite.md)                                                                                                                        |
| Routing only              | [creating-route-component](./references/creating-route-component.md), [creating-navigation-component](./references/creating-navigation-component.md), [TanStack Router — Installation with Vite](https://tanstack.com/router/latest/docs/installation/with-vite.md), [TanStack Router — File-based routing](https://tanstack.com/router/latest/docs/routing/file-based-routing.md)                                                                                                                  |
| In-app navigation         | [creating-route-component](./references/creating-route-component.md), [creating-navigation-component](./references/creating-navigation-component.md)                                                                                                                                                                                                                                                                                                                                                |
| E2E testing               | [creating-e2e-testing](./references/creating-e2e-testing.md), [managing-project-structure](./references/managing-project-structure.md)                                                                                                                                                                                                                                                                                                                                                              |

## Reference index

Catalog of every local reference. **Entry** marks hub docs. **Layer** groups docs by concern. Use **Task types** for curated bundles.

| Reference | Entry | Layer | Purpose |
| --- | --- | --- | --- |
| [creating-api](./references/creating-api.md) | | API | HTTP modules under `src/api/` |
| [creating-component](./references/creating-component.md) | Component | Component | Decision tree for any component work |
| [creating-e2e-testing](./references/creating-e2e-testing.md) | | Testing | Playwright E2E tests |
| [creating-feature](./references/creating-feature.md) | | Feature | Feature module folders and barrels |
| [creating-feature-component](./references/creating-feature-component.md) | | Component | Domain UI blocks in features |
| [creating-form-component](./references/creating-form-component.md) | | Form | Form fields and form shells |
| [creating-navigation-component](./references/creating-navigation-component.md) | | Route | Reusable layout navigation (shells, sidebars, headers) |
| [creating-route-component](./references/creating-route-component.md) | | Route | Flat files in `src/routes/` — filenames map to URLs |
| [creating-screen-component](./references/creating-screen-component.md) | | Feature | Route-facing `*Page` in `src/features/<feature>/components/` |
| [creating-ui-component](./references/creating-ui-component.md) | | Component | Shared primitives in `src/ui/` |
| [linting](./references/linting.md) | | Setup | ESLint and Prettier setup |
| [managing-api-error](./references/managing-api-error.md) | | API | API error handling patterns |
| [managing-environment](./references/managing-environment.md) | | Setup | Feature `env.ts` and env vars |
| [managing-form-error](./references/managing-form-error.md) | | Form | Form validation and error display |
| [managing-project-structure](./references/managing-project-structure.md) | Structure | Architecture | Folder layout and dependency flow |
| [managing-state](./references/managing-state.md) | | State | TanStack Query hooks and Zustand stores |
| [managing-stepper-form](./references/managing-stepper-form.md) | | Form | Multi-step form UI |
| [managing-stepper-hook](./references/managing-stepper-hook.md) | | Form | Multi-step form state hook |
| [managing-wrapper-components](./references/managing-wrapper-components.md) | | Component | Wrapper and composition patterns |
| [overriding-classname](./references/overriding-classname.md) | | Styling | `className` override rules |
| [setting-up-axios](./references/setting-up-axios.md) | | API | Axios client setup |
| [setting-up-theming](./references/setting-up-theming.md) | | Styling | Design tokens and theme CSS |
| [setting-up-tailwind-theme](./references/setting-up-tailwind-theme.md) | | Styling | Tailwind theme configuration |
| [styling](./references/styling.md) | | Styling | Styling conventions |
| [styling-preference](./references/styling-preference.md) | | Styling | Styling preferences and defaults |

## Tech stack

| Layer               | Choice                                                                         |
| ------------------- | ------------------------------------------------------------------------------ |
| Bundler             | Vite                                                                           |
| Language            | TypeScript                                                                     |
| Styling             | Tailwind CSS v4, class-variance-authority (`cva` + `cx` from the same package) |
| Routing             | TanStack Router (file-based, `src/routes`)                                     |
| Server state        | TanStack Query                                                                 |
| Client global state | Zustand                                                                        |
| HTTP                | Axios                                                                          |
| Presentational UI   | shadcn/ui-style primitives in `src/ui/`                                        |
