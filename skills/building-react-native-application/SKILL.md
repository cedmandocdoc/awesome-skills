---
name: building-react-native-application
id: ddfed93c-f419-4c5f-8832-85acc8f85f00
description: Guides building Expo/React Native apps with TypeScript using a consistent architecture and library stack (NativeWind, React Navigation static config, TanStack Query, Zustand, Axios, React Native Reusables-style primitives in src/ui). Use when creating an Expo app, or changing code in an app whose `package.json` has `expo`, `@react-navigation/native`, and `nativewind`, to follow these conventions.
version: 1.4.0
---

# React Native application

## Setup

| Item | Kind | Required | When | Done when | How |
| --- | --- | --- | --- | --- | --- |
| Node.js 20.19+ | user | required | All | `node --version` reports 20.19 or later | https://nodejs.org |
| Standing rule | auto | required | Scaffold new app | Root `AGENTS.md` has the line | Add `` - `<target_path>` follows building-react-native-application; load it before changing code there. `` to root `AGENTS.md` (create when missing) and to root `CLAUDE.md` when it exists without importing `AGENTS.md`; skip a file that has it |

## Workflow

1. **Setup** — for each **Setup** row whose When covers the request, in order: Done when holds → skip; `user` → stop and print its How when required, continue without it when optional; `ask` → fill what the request answers, ask the rest together in one message, record each answer; `auto` and `static` → run.
2. **Contract** — read [native-app-contract.md](references/native-app-contract.md).
3. **Recipe** — match one **Recipes** row; open every doc in its Read column.

- A request that spans rows (a new screen with a form) matches each of them.

## Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Set up | "Set up building-react-native-application", "Is building-react-native-application ready?" | **Setup** — run Workflow step 1 for every row, then report each row's state |
| Scaffold new app | "Create an Expo app in apps/mobile", "Scaffold here" | [scaffolding-application.md](references/scaffolding-application.md) |
| Project bootstrap | "Add linting and env handling to the app", "Set up NativeWind and src/ui" | [managing-project-structure.md](references/managing-project-structure.md), [managing-environment.md](references/managing-environment.md), [managing-linting.md](references/managing-linting.md), [managing-package-installs.md](references/managing-package-installs.md), [setting-up-nativewind.md](references/setting-up-nativewind.md), [setting-up-registry-components.md](references/setting-up-registry-components.md) |
| Structure | "Where does this module belong?", "Can a feature import another feature?" | [managing-project-structure.md](references/managing-project-structure.md) |
| Component | "Build a component", "Move this component to the right layer" | [creating-component.md](references/creating-component.md) |
| New screen / feature | "Add a settings screen", "New orders feature" | [managing-project-structure.md](references/managing-project-structure.md), [creating-feature.md](references/creating-feature.md), [creating-route-component.md](references/creating-route-component.md), [creating-screen-component.md](references/creating-screen-component.md), [creating-component.md](references/creating-component.md) |
| UI primitive | "Add a Dialog to src/ui", "Pull the Reusables button" | [creating-component.md](references/creating-component.md), [creating-ui-component.md](references/creating-ui-component.md), [discovering-registry-components.md](references/discovering-registry-components.md), [managing-wrapper-components.md](references/managing-wrapper-components.md), [add-registry-component.cjs](scripts/add-registry-component.cjs) |
| Feature component | "Build the CartItemRow" | [creating-component.md](references/creating-component.md), [creating-feature-component.md](references/creating-feature-component.md), [managing-wrapper-components.md](references/managing-wrapper-components.md) |
| Bottom sheet | "Show filters in a bottom sheet" | [creating-component.md](references/creating-component.md), [creating-bottom-sheet-component.md](references/creating-bottom-sheet-component.md), [managing-wrapper-components.md](references/managing-wrapper-components.md) |
| Async / list UI | "Show the orders list with loading and error states" | [creating-component.md](references/creating-component.md), [creating-async-component.md](references/creating-async-component.md), [creating-api.md](references/creating-api.md), [managing-state.md](references/managing-state.md) |
| Form | "Add a profile form" | [creating-form-component.md](references/creating-form-component.md), [managing-form-error.md](references/managing-form-error.md), [managing-state.md](references/managing-state.md), [managing-date.md](references/managing-date.md) |
| Multi-step form | "Make checkout a three-step form" | [managing-stepper-hook.md](references/managing-stepper-hook.md), [managing-stepper-form.md](references/managing-stepper-form.md), [creating-form-component.md](references/creating-form-component.md), [managing-form-error.md](references/managing-form-error.md) |
| API + data hooks | "Fetch orders from the API", "Add a mutation for checkout" | [creating-api.md](references/creating-api.md), [setting-up-axios.md](references/setting-up-axios.md), [managing-api-error.md](references/managing-api-error.md), [managing-state.md](references/managing-state.md), [managing-date.md](references/managing-date.md) |
| Date / time | "Format the order date", "Handle time zones" | [managing-date.md](references/managing-date.md) |
| Styling / theme | "Change the brand colors", "Override a className" | [setting-up-nativewind.md](references/setting-up-nativewind.md), [managing-styling.md](references/managing-styling.md), [setting-up-theming.md](references/setting-up-theming.md), [setting-up-tailwind-theme.md](references/setting-up-tailwind-theme.md), [setting-up-navigation-theme.md](references/setting-up-navigation-theme.md), [overriding-classname.md](references/overriding-classname.md) |
| Navigation components and backgrounds | "Custom tab bar", "The screen background shows white behind the header" | [creating-navigation-component.md](references/creating-navigation-component.md), [setting-up-navigation-theme.md](references/setting-up-navigation-theme.md), [managing-screen-background.md](references/managing-screen-background.md) |
| Navigation hooks | "Navigate to settings from the card" | [creating-route-component.md](references/creating-route-component.md), [creating-navigation-component.md](references/creating-navigation-component.md) |
| Keyboard | "The keyboard covers the input" | [Keyboard controller — Components](https://kirillzyusko.github.io/react-native-keyboard-controller/docs/guides/components-overview.md) |
| Fonts | "Use Inter as the body font" | [setting-up-theming.md](references/setting-up-theming.md), [setting-up-tailwind-theme.md](references/setting-up-tailwind-theme.md), [Expo — Fonts](https://docs.expo.dev/develop/user-interface/fonts/index.md) |
| Splash screen | "Keep the splash until fonts load" | [Expo — SplashScreen](https://docs.expo.dev/versions/latest/sdk/splash-screen.md) |
| Routing only | "Add a settings stack", "Register a new tab" | [creating-route-component.md](references/creating-route-component.md), [creating-navigation-component.md](references/creating-navigation-component.md) |
