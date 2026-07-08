---
name: building-react-native-application
description: Guides building Expo/React Native apps with TypeScript using a consistent architecture and library stack (NativeWind, React Navigation static config, TanStack Query, Zustand, Axios, React Native Reusables-style primitives in src/ui). Use when creating a new React Native app or updating architecture, UI, state, API, navigation, or styling to follow these conventions.
version: 1.0.0
---

# React Native application

## Overview

Opinionated ecosystem for building Expo/React Native apps with a consistent architecture, library stack, and UI system (`src/ui`).

### Tech stack

| Layer               | Choice                                               |
| ------------------- | ---------------------------------------------------- |
| Runtime             | Expo                                                 |
| Language            | TypeScript                                           |
| Styling             | NativeWind, Tailwind CSS, class-variance-authority   |
| Routing             | React Navigation (static config, `src/routes`)       |
| Server state        | TanStack Query                                       |
| Client global state | Zustand                                              |
| HTTP                | Axios                                                |
| Dates               | date-fns (`src/libs/date-utils/`)                    |
| Presentational UI   | React Native Reusables-style primitives in `src/ui/` |

## Agent workflow

Follow this skill for Expo/React Native work. Match **Entry points** and **Task types**; open every linked reference before coding.

1. **Pick an entry** — use **Entry points** below.
2. **Classify the task** — match every applicable row in **Task types** (many tasks span multiple rows).
3. **Component work** — when the task involves any component, open [creating-component](./references/creating-component.md) and follow its decision tree.
4. **Read before coding** — open every linked doc from matched task rows and from the decision tree.

### Entry points

Four ways into this skill. Use the first row that matches; combine rows when the task spans types (e.g. new screen + form).

| Entry | When | Go to |
| --- | --- | --- |
| Component | Building, moving, or recategorizing any component | [creating-component](./references/creating-component.md) |
| Structure | Folder roles, dependency flow, or where a module belongs | [managing-project-structure](./references/managing-project-structure.md) |
| Task bundle | API, forms, styling, bootstrap, navigation hooks, keyboard, fonts, splash | **Task types** table |
| Lookup | You know the doc name or need a single reference | **Reference index** |

### Task types

Match every row that applies. Open every link in the **Docs** column from each matching row before coding.

| Task type                           | Docs                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| New screen / feature                | [managing-project-structure](./references/managing-project-structure.md), [creating-feature](./references/creating-feature.md), [creating-route-component](./references/creating-route-component.md), [creating-screen-component](./references/creating-screen-component.md), [creating-component](./references/creating-component.md), [React Navigation — Hello (static)](https://reactnavigation.org/docs/hello-react-navigation.md?config=static)                                                                                                                                                                                                           |
| UI primitive (`src/ui/`)            | [creating-component](./references/creating-component.md), [creating-ui-component](./references/creating-ui-component.md), [discovering-registry-components](./references/discovering-registry-components.md), [managing-wrapper-components](./references/managing-wrapper-components.md), [add-registry-component.cjs](./scripts/add-registry-component.cjs)                                                                                                                                                                                                                                                                                                |
| Feature component                   | [creating-component](./references/creating-component.md), [creating-feature-component](./references/creating-feature-component.md), [managing-wrapper-components](./references/managing-wrapper-components.md)                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Bottom sheet                        | [creating-component](./references/creating-component.md), [creating-bottom-sheet-component](./references/creating-bottom-sheet-component.md), [managing-wrapper-components](./references/managing-wrapper-components.md)                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Async / list UI                     | [creating-component](./references/creating-component.md), [creating-async-component](./references/creating-async-component.md), [creating-api](./references/creating-api.md), [managing-state](./references/managing-state.md)                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Form (single step)                  | [creating-form-component](./references/creating-form-component.md), [managing-form-error](./references/managing-form-error.md), [managing-state](./references/managing-state.md), [managing-date](./references/managing-date.md), [TanStack Form — Basic concepts](https://tanstack.com/form/latest/docs/framework/react/guides/basic-concepts)                                                                                                                                                                                                                                                                                                                                                                 |
| Multi-step form                     | [managing-stepper-hook](./references/managing-stepper-hook.md), [managing-stepper-form](./references/managing-stepper-form.md), [creating-form-component](./references/creating-form-component.md), [managing-form-error](./references/managing-form-error.md), [TanStack Form — Basic concepts](https://tanstack.com/form/latest/docs/framework/react/guides/basic-concepts), [TanStack Form — Form composition](https://tanstack.com/form/latest/docs/framework/react/guides/form-composition.md)                                                                                                                                                             |
| API + data hooks                    | [creating-api](./references/creating-api.md), [setting-up-axios](./references/setting-up-axios.md), [managing-api-error](./references/managing-api-error.md), [managing-state](./references/managing-state.md), [managing-date](./references/managing-date.md)                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Date / time                         | [managing-date](./references/managing-date.md)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Refactor / move component           | [creating-component](./references/creating-component.md)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Styling / theme                     | [managing-styling](./references/managing-styling.md), [managing-styling-preference](./references/managing-styling-preference.md), [setting-up-theming](./references/setting-up-theming.md), [setting-up-tailwind-theme](./references/setting-up-tailwind-theme.md), [setting-up-navigation-theme](./references/setting-up-navigation-theme.md), [overriding-classname](./references/overriding-classname.md), [NativeWind — Installation](https://www.nativewind.dev/docs/getting-started/installation)                                                                                                                                                                                             |
| Navigation components & backgrounds | [creating-navigation-component](./references/creating-navigation-component.md), [setting-up-navigation-theme](./references/setting-up-navigation-theme.md), [reusing-navigation-background](./references/reusing-navigation-background.md), [managing-screen-background](./references/managing-screen-background.md), [React Navigation — Hello (static)](https://reactnavigation.org/docs/hello-react-navigation.md?config=static), [Native stack](https://reactnavigation.org/docs/native-stack-navigator.md), [Bottom tabs](https://reactnavigation.org/docs/native-bottom-tab-navigator.md), [Drawer](https://reactnavigation.org/docs/drawer-navigator.md) |
| Navigation hooks                    | [creating-route-component](./references/creating-route-component.md), [creating-navigation-component](./references/creating-navigation-component.md), [React Navigation — TypeScript](https://reactnavigation.org/docs/typescript.md)                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Keyboard                            | [Keyboard controller — Components](https://kirillzyusko.github.io/react-native-keyboard-controller/docs/guides/components-overview.md)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Fonts                               | [Expo — Fonts](https://docs.expo.dev/develop/user-interface/fonts/index.md), [setting-up-theming](./references/setting-up-theming.md), [setting-up-tailwind-theme](./references/setting-up-tailwind-theme.md)                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Splash screen                       | [Expo — SplashScreen](https://docs.expo.dev/versions/latest/sdk/splash-screen.md)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Project bootstrap                   | [managing-project-structure](./references/managing-project-structure.md), [managing-environment](./references/managing-environment.md), [managing-linting](./references/managing-linting.md), [managing-package-installs](./references/managing-package-installs.md), [setting-up-registry-components](./references/setting-up-registry-components.md), [NativeWind — Installation](https://www.nativewind.dev/docs/getting-started/installation)                                                                                                                                                                                                                                                                                                         |
| Routing only                        | [creating-route-component](./references/creating-route-component.md), [creating-navigation-component](./references/creating-navigation-component.md), [React Navigation — Hello (static)](https://reactnavigation.org/docs/hello-react-navigation.md?config=static), [Native stack](https://reactnavigation.org/docs/native-stack-navigator.md), [Bottom tabs](https://reactnavigation.org/docs/native-bottom-tab-navigator.md), [Drawer](https://reactnavigation.org/docs/drawer-navigator.md)                                                                                                                                                                 |

## Reference index

Catalog of every local reference. **Entry** marks hub docs. **Layer** groups docs by concern. Use **Task types** for curated bundles.

| Reference | Entry | Layer | Purpose |
| --- | --- | --- | --- |
| [creating-api](./references/creating-api.md) | | API | HTTP modules under `src/api/` |
| [creating-async-component](./references/creating-async-component.md) | | Component | Loading, error, and list UI wrappers |
| [creating-bottom-sheet-component](./references/creating-bottom-sheet-component.md) | | Component | Bottom sheet UI in `src/ui/BottomSheet/` |
| [creating-component](./references/creating-component.md) | Component | Component | Decision tree for any component work |
| [creating-feature](./references/creating-feature.md) | | Feature | Feature module folders and barrels |
| [creating-feature-component](./references/creating-feature-component.md) | | Component | Domain UI blocks in features |
| [creating-form-component](./references/creating-form-component.md) | | Form | Form fields and form shells |
| [creating-navigation-component](./references/creating-navigation-component.md) | | Route | Reusable headers, tab bars, drawer content |
| [creating-route-component](./references/creating-route-component.md) | | Route | `[Name][NavigatorType]` modules in `src/routes/` — typed `useNavigation` |
| [creating-screen-component](./references/creating-screen-component.md) | | Feature | Route-facing `*Screen` in `src/features/<feature>/components/` |
| [creating-ui-component](./references/creating-ui-component.md) | | Component | Shared primitives in `src/ui/` |
| [discovering-registry-components](./references/discovering-registry-components.md) | | Component | Registry component lookup by intent and labels |
| [managing-api-error](./references/managing-api-error.md) | | API | API error handling patterns |
| [managing-date](./references/managing-date.md) | | Date | date-fns parsing, formatting, and `src/libs/date-utils/` |
| [managing-environment](./references/managing-environment.md) | | Setup | Feature `env.ts` and env vars |
| [managing-form-error](./references/managing-form-error.md) | | Form | Form validation and error display |
| [managing-linting](./references/managing-linting.md) | | Setup | ESLint and Prettier setup |
| [managing-package-installs](./references/managing-package-installs.md) | | Setup | Package manager detection, install scripts, and package runners |
| [managing-project-structure](./references/managing-project-structure.md) | Structure | Architecture | Folder layout and dependency flow |
| [managing-screen-background](./references/managing-screen-background.md) | | Route | Screen background handling |
| [managing-state](./references/managing-state.md) | | State | TanStack Query hooks and Zustand stores |
| [managing-stepper-form](./references/managing-stepper-form.md) | | Form | Multi-step form UI |
| [managing-stepper-hook](./references/managing-stepper-hook.md) | | Form | Multi-step form state hook |
| [managing-styling](./references/managing-styling.md) | | Styling | Styling conventions |
| [managing-styling-preference](./references/managing-styling-preference.md) | | Styling | Styling preferences and defaults |
| [managing-wrapper-components](./references/managing-wrapper-components.md) | | Component | Wrapper and composition patterns |
| [overriding-classname](./references/overriding-classname.md) | | Styling | `className` override rules |
| [reusing-navigation-background](./references/reusing-navigation-background.md) | | Route | Shared navigation backgrounds |
| [setting-up-axios](./references/setting-up-axios.md) | | API | Axios client setup |
| [setting-up-navigation-theme](./references/setting-up-navigation-theme.md) | | Styling | React Navigation theme objects |
| [setting-up-registry-components](./references/setting-up-registry-components.md) | | Setup | Registry / `src/ui/` bootstrap |
| [setting-up-theming](./references/setting-up-theming.md) | | Styling | Design tokens and theme CSS |
| [setting-up-tailwind-theme](./references/setting-up-tailwind-theme.md) | | Styling | Tailwind / NativeWind theme config |
