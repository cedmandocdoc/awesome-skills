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

Follow this skill for every task that touches this project's React Native (Expo) app: features, screens, navigation, APIs, state, styling, forms, async and list UI, config, theming, layout, and tooling choices for the app.

## Companion skill

For **async `useEffect`**, **TanStack Form**, **ESLint / Prettier**, **es-toolkit / date-fns**, and **overriding `className`** (NativeWind / Tailwind), use together with [building-react-application](../building-react-application/SKILL.md).

Install it:

```bash
npx skills add cedmandocdoc/awesome-skills/skills/building-react-application
```

## Terminology

Use these terms consistently across this skill and its references:

- **Route**: navigation identity and configuration (for example route `name`, params type, options, deep-link path, and registration in `src/navigation/`).
- **Screen**: React component rendered for a route (commonly exported from `src/features/<feature-name>/` and passed to `Stack.Screen component={...}`).
- **Navigator**: container that maps routes to screens (for example stack, tabs, drawer).
- Keep **route config** in `src/navigation/`; keep **screen behavior and UI** in `src/features/`.

## References

| Doc                                                                                                                                                          | When to use                                                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| [structuring-project.md](./references/structuring-project.md)                                                                                                | Organize folders, module boundaries, and imports for the RN app.                    |
| [managing-environment.md](./references/managing-environment.md)                                                                                              | Define and validate Expo `EXPO_PUBLIC_*` env vars with per-module `env.ts` and Zod. |
| [styling.md](./references/styling.md)                                                                                                                        | Apply NativeWind utilities and token-based styling patterns in components.          |
| [styling-preference.md](./references/styling-preference.md)                                                                                                  | Follow the project's styling decision rules and conventions.                        |
| [NativeWind — Installation](https://www.nativewind.dev/docs/getting-started/installation)                                                                    | Install or verify NativeWind setup (Babel/Metro/Tailwind).                          |
| [setting-up-theming.md](./references/setting-up-theming.md)                                                                                                  | Set up app-wide semantic tokens and theming structure.                              |
| [setting-up-tailwind-theme.md](./references/setting-up-tailwind-theme.md)                                                                                    | Extend Tailwind theme values for RN token usage.                                    |
| [setting-up-navigation-theme.md](./references/setting-up-navigation-theme.md)                                                                                | Configure React Navigation theme colors to match app tokens.                        |
| [reusing-navigation-background.md](./references/reusing-navigation-background.md)                                                                            | Reuse shared navigation background patterns across screens.                         |
| [managing-screen-background.md](./references/managing-screen-background.md)                                                                                  | Choose default versus explicit per-screen or per-surface backgrounds.               |
| [Expo — Fonts](https://docs.expo.dev/develop/user-interface/fonts/index.md)                                                                                  | Add local/Google fonts and choose between config plugin or `useFonts`.              |
| [placing-component.md](./references/placing-component.md)                                                                                                    | Decide whether components live in `src/ui/` or `src/features/`.                     |
| [creating-component.md](./references/creating-component.md)                                                                                                  | Create UI components with clear props and composition patterns.                     |
| [managing-wrapper-components.md](./references/managing-wrapper-components.md)                                                                                | Flatten `View` trees and merge `className` unless layout needs split wrappers.      |
| [managing-async-view.md](./references/managing-async-view.md)                                                                                                | Build async/loading, reloading, error, refresh, and pagination UI states.           |
| [managing-form-components.md](./references/managing-form-components.md)                                                                                      | Set up `src/ui/Form.tsx`, `createFormHook`, and reusable field primitives.          |
| [TanStack Form — Basic concepts](https://tanstack.com/form/latest/docs/framework/react/guides/basic-concepts)                                                | Understand TanStack Form core APIs and mental model.                                |
| [Form composition](https://tanstack.com/form/latest/docs/framework/react/guides/form-composition.md)                                                         | Compose reusable form parts and advanced form structures.                           |
| [abstracting-component.md](./references/abstracting-component.md)                                                                                            | Extract shared primitives and follow registry-first abstraction workflow.           |
| [setting-up-registry-components.md](./references/setting-up-registry-components.md)                                                                          | Configure registry integration for `src/ui` component workflows.                    |
| [adding-registry-components.md](./references/adding-registry-components.md)                                                                                  | Add registry components via script or manual integration path.                      |
| [naming-component.md](./references/naming-component.md)                                                                                                      | Keep component naming consistent across shared UI and features.                     |
| [creating-feature.md](./references/creating-feature.md)                                                                                                      | Create feature modules, barrels, and internal organization.                         |
| [promoting-feature.md](./references/promoting-feature.md)                                                                                                    | Promote feature-local pieces into shared UI or separate features.                   |
| [managing-state.md](./references/managing-state.md)                                                                                                          | Choose Query, Zustand, or local state based on ownership and lifetime.              |
| [creating-api.md](./references/creating-api.md)                                                                                                              | Structure API clients and feature-specific data hooks.                              |
| [setting-up-axios.md](./references/setting-up-axios.md)                                                                                                      | Configure Axios defaults/interceptors for RN API access.                            |
| [configuring-routing.md](./references/configuring-routing.md)                                                                                                | Implement navigation structure, typed params, and route registration.               |
| [React Navigation — Hello React Navigation (static)](https://reactnavigation.org/docs/hello-react-navigation.md?config=static)                               | Bootstrap React Navigation with the static API pattern.                             |
| [Native Stack Navigator](https://reactnavigation.org/docs/native-stack-navigator.md)                                                                         | Build stack flows, screen options, and transitions.                                 |
| [Native Bottom Tabs Navigator](https://reactnavigation.org/docs/native-bottom-tab-navigator.md)                                                              | Implement tab navigation and tab-level screen structure.                            |
| [React Navigation — Drawer Navigator](https://reactnavigation.org/docs/drawer-navigator.md)                                                                  | Add drawer navigation with gestures, Reanimated, and custom drawer content.         |
| [react-native-keyboard-controller — Components overview](https://kirillzyusko.github.io/react-native-keyboard-controller/docs/guides/components-overview.md) | Handle keyboard avoidance, sticky views, and scroll synchronization.                |
| [Expo SplashScreen](https://docs.expo.dev/versions/latest/sdk/splash-screen.md)                                                                              | Configure splash assets/plugin and control hide timing at app startup.              |
| [linting.md](../building-react-application/references/linting.md)                                                                                            | Apply ESLint/Prettier baseline and React Native lint conventions.                   |
