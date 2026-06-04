---
name: building-react-native-application
description: Guides building Expo/React Native apps with TypeScript using a consistent architecture and library stack (NativeWind, React Navigation, TanStack Query, Zustand, Axios). Use for all React Native application work.
version: 1.0.0
---

# React Native

Opinionated ecosystem for building React Native apps with a consistent architecture, library stack, and UI system.

## Tech stack

| Layer               | Choice                                               |
| ------------------- | ---------------------------------------------------- |
| Runtime             | Expo                                                 |
| Language            | TypeScript                                           |
| Styling             | NativeWind, Tailwind CSS, class-variance-authority   |
| Routing             | React Navigation                                     |
| Server state        | TanStack Query                                       |
| Client global state | Zustand                                              |
| HTTP                | Axios                                                |
| Presentational UI   | React Native Reusables-style primitives in `src/ui/` |

## When to use

Follow this skill for every task that touches this project's React Native (Expo) app: features, screens, navigation, APIs, state, styling, forms, async and list UI, bottom sheets, config, theming, layout, and tooling choices for the app.

## Terminology

Use these terms consistently across this skill and its references:

- **Route**: navigation identity and configuration (for example route `name`, params type, options, deep-link path, and registration in `src/navigation/`).
- **Screen**: React component rendered for a route (commonly exported from `src/features/<feature-name>/` and registered in static `screens` config).
- **Navigator**: container that maps routes to screens (for example stack, tabs, drawer).
- Keep **route config** in `src/navigation/`; keep **screen behavior and UI** in `src/features/`.

## Task recipes

Use these sets when planning (`creating-tasks`) or executing work. Read **all** listed references under `references/` before coding. Copy basenames into task `plan.md` → Context (no `.md` suffix).

| Task type | References |
| --- | --- |
| New screen / feature | structuring-project, creating-feature, configuring-routing, placing-component, naming-component |
| New shared UI component | placing-component, creating-component, naming-component, managing-wrapper-components |
| Registry component | setting-up-registry-components, adding-registry-components, creating-component, abstracting-component |
| Bottom sheet | creating-bottom-sheet, creating-component, managing-wrapper-components |
| Async / list UI | managing-async-view, creating-api, managing-state |
| Form (single step) | managing-form-components, managing-form-error, managing-state |
| Multi-step form | managing-stepper-hook, managing-stepper-form, managing-form-components, managing-form-error |
| API + data hooks | creating-api, setting-up-axios, managing-api-error, managing-state |
| Refactor / promote UI | promoting-feature, placing-component, abstracting-component, naming-component |
| Styling / theme | styling, styling-preference, setting-up-theming, setting-up-tailwind-theme, setting-up-navigation-theme, overriding-classname |
| Navigation chrome & backgrounds | managing-navigation-component, setting-up-navigation-theme, reusing-navigation-background, managing-screen-background |
| Project bootstrap | structuring-project, managing-environment, linting |
| Routing only | configuring-routing, managing-navigation-component |

Add at most 1–2 extra docs from the index below when the task needs them.

## Reference index

Each doc appears once. External links are official docs for setup and APIs.

### Project & structure

| Doc | When to use |
| --- | --- |
| [structuring-project.md](./references/structuring-project.md) | Organize folders, module boundaries, and imports for the RN app. |
| [managing-environment.md](./references/managing-environment.md) | Define and validate Expo `EXPO_PUBLIC_*` env vars with per-module `env.ts` and Zod. |
| [linting.md](./references/linting.md) | Apply ESLint/Prettier setup and React Native lint conventions. |
| [Expo SplashScreen](https://docs.expo.dev/versions/latest/sdk/splash-screen.md) | Configure splash assets/plugin and control hide timing at app startup. |

### Theming & styling

| Doc | When to use |
| --- | --- |
| [styling.md](./references/styling.md) | Apply NativeWind utilities and token-based styling patterns in components. |
| [styling-preference.md](./references/styling-preference.md) | Follow the project's styling decision rules and conventions. |
| [setting-up-theming.md](./references/setting-up-theming.md) | Set up app-wide semantic tokens and theming structure. |
| [setting-up-tailwind-theme.md](./references/setting-up-tailwind-theme.md) | Extend Tailwind theme values for RN token usage. |
| [overriding-classname.md](./references/overriding-classname.md) | Resolve NativeWind `className` conflicts on shared components using targeted `!`. |
| [NativeWind — Installation](https://www.nativewind.dev/docs/getting-started/installation) | Install or verify NativeWind setup (Babel/Metro/Tailwind). |
| [Expo — Fonts](https://docs.expo.dev/develop/user-interface/fonts/index.md) | Add local/Google fonts and choose between config plugin or `useFonts`. |

### Routing & navigation

| Doc | When to use |
| --- | --- |
| [configuring-routing.md](./references/configuring-routing.md) | Implement navigation structure, typed params, and route registration. |
| [managing-navigation-component.md](./references/managing-navigation-component.md) | Configure shared header, drawer, and tab UI through navigator options. |
| [setting-up-navigation-theme.md](./references/setting-up-navigation-theme.md) | Configure React Navigation theme colors to match app tokens. |
| [reusing-navigation-background.md](./references/reusing-navigation-background.md) | Reuse shared navigation background patterns across screens. |
| [managing-screen-background.md](./references/managing-screen-background.md) | Choose default versus explicit per-screen or per-surface backgrounds. |
| [React Navigation — Hello React Navigation (static)](https://reactnavigation.org/docs/hello-react-navigation.md?config=static) | Bootstrap React Navigation with the static API pattern. |
| [Native Stack Navigator](https://reactnavigation.org/docs/native-stack-navigator.md) | Build stack flows, screen options, and transitions. |
| [Native Bottom Tabs Navigator](https://reactnavigation.org/docs/native-bottom-tab-navigator.md) | Implement tab navigation and tab-level screen structure. |
| [React Navigation — Drawer Navigator](https://reactnavigation.org/docs/drawer-navigator.md) | Add drawer navigation with gestures, Reanimated, and custom drawer content. |
| [react-native-keyboard-controller — Components overview](https://kirillzyusko.github.io/react-native-keyboard-controller/docs/guides/components-overview.md) | Handle keyboard avoidance, sticky views, and scroll synchronization. |

### Features & modules

| Doc | When to use |
| --- | --- |
| [creating-feature.md](./references/creating-feature.md) | Create feature modules, barrels, and internal organization. |
| [promoting-feature.md](./references/promoting-feature.md) | Promote feature-local pieces into shared UI or separate features. |
| [placing-component.md](./references/placing-component.md) | Decide whether components live in `src/ui/` or `src/features/`. |
| [naming-component.md](./references/naming-component.md) | Keep component naming consistent across shared UI and features. |

### UI components

| Doc | When to use |
| --- | --- |
| [creating-component.md](./references/creating-component.md) | Create UI components with clear props and composition patterns. |
| [managing-wrapper-components.md](./references/managing-wrapper-components.md) | Flatten `View` trees and merge `className` unless layout needs split wrappers. |
| [abstracting-component.md](./references/abstracting-component.md) | Extract shared primitives and follow registry-first abstraction workflow. |
| [creating-bottom-sheet.md](./references/creating-bottom-sheet.md) | Build bottom sheets with shared `src/ui/BottomSheet` wrappers; use gorhom only when the wrapper is insufficient. |
| [managing-async-view.md](./references/managing-async-view.md) | Build async/loading, reloading, error, refresh, and pagination UI states. |

### Registry

| Doc | When to use |
| --- | --- |
| [setting-up-registry-components.md](./references/setting-up-registry-components.md) | Configure registry integration for `src/ui` component workflows. |
| [adding-registry-components.md](./references/adding-registry-components.md) | Add registry components via script or manual integration path. |
| [add-registry-component.js](./scripts/add-registry-component.js) | Run the helper script to vendor registry components and apply path/class fixes. |

### State

| Doc | When to use |
| --- | --- |
| [managing-state.md](./references/managing-state.md) | Choose Query, Zustand, or local state based on ownership and lifetime. |

### Forms

| Doc | When to use |
| --- | --- |
| [managing-form-components.md](./references/managing-form-components.md) | Set up `src/ui/Form/`, `createFormHook`, `FieldShell`, and pre-bound `*Field` components. |
| [managing-form-error.md](./references/managing-form-error.md) | Handle `onServer` and field errors with `ApiError`; wire into existing form UI. |
| [managing-stepper-hook.md](./references/managing-stepper-hook.md) | Create feature stepper hooks (`useXStepper`) with Stepperize `defineStepper`, `useStepper`, and `Scoped`. |
| [managing-stepper-form.md](./references/managing-stepper-form.md) | Build multi-step forms with Stepperize + TanStack Form + Zod step schemas in React Native. |
| [TanStack Form — Basic concepts](https://tanstack.com/form/latest/docs/framework/react/guides/basic-concepts) | Understand TanStack Form core APIs and mental model. |
| [Form composition](https://tanstack.com/form/latest/docs/framework/react/guides/form-composition.md) | Compose reusable form parts and advanced form structures. |

### API & errors

| Doc | When to use |
| --- | --- |
| [creating-api.md](./references/creating-api.md) | Structure API clients and feature-specific data hooks. |
| [setting-up-axios.md](./references/setting-up-axios.md) | Configure Axios defaults/interceptors for RN API access. |
| [managing-api-error.md](./references/managing-api-error.md) | Map API failures to `ApiError`; consume `error.message` in TanStack Query and UI. |
