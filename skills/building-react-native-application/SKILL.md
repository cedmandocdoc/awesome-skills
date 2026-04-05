---
name: building-react-native-application
description: Guides building Expo/React Native apps with TypeScript using a consistent architecture and library stack (NativeWind, React Navigation, TanStack Query, Zustand, Axios). Use when creating a new React Native project or updating architecture/UI/state/API/routing/styling to follow these conventions.
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

- New Expo-based React Native projects (TypeScript + NativeWind + React Navigation + TanStack Query)
- React Native tasks in an existing project that already follows [references/structuring-project.md](references/structuring-project.md)
- Architecture, library, or folder-structure decisions for Expo React Native apps
- UI, state, API, routing/navigation stacks (screens + route params), or styling work that should follow this skill's conventions

## References

| Task / Scenario           | Doc                                                                                                                                                                                                                   | When to use                                              |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| **Project structure**     | [structuring-project.md](./references/structuring-project.md)                                                                                                                                                         | Organizing folders, module boundaries, imports           |
| **Styling**               | [styling.md](./references/styling.md), [NativeWind — Installation](https://www.nativewind.dev/docs/getting-started/installation)                                                                                      | NativeWind install, Metro/Babel; utilities & tokens      |
| **Theming**               | [setting-up-theming.md](./references/setting-up-theming.md), [setting-up-tailwind-theme.md](./references/setting-up-tailwind-theme.md), [setting-up-navigation-theme.md](./references/setting-up-navigation-theme.md) | Tokens, Tailwind extend, nav theme                       |
| **Component placement**   | [placing-component.md](./references/placing-component.md)                                                                                                                                                             | Deciding `src/ui/` vs `src/features/`                    |
| **Component creation**    | [creating-component.md](./references/creating-component.md)                                                                                                                                                           | Writing components: props, compound parts                |
| **Component abstraction** | [abstracting-component.md](./references/abstracting-component.md), [setting-up-registry-components.md](./references/setting-up-registry-components.md)                                                                | Extraction workflow, registry-first; shell for `src/ui/` |
| **Component naming**      | [naming-component.md](./references/naming-component.md)                                                                                                                                                               | Consistent naming across `src/ui/` and `src/features/`   |
| **Feature modules**       | [creating-feature.md](./references/creating-feature.md)                                                                                                                                                               | Feature layout, barrels, isolated vs grouped             |
| **Feature promotion**     | [promoting-feature.md](./references/promoting-feature.md)                                                                                                                                                             | Promotion to `src/ui/`, extraction to new feature        |
| **State management**      | [managing-state.md](./references/managing-state.md)                                                                                                                                                                   | Query vs Zustand vs local state                          |
| **API clients**           | [creating-api.md](./references/creating-api.md), [setting-up-axios.md](./references/setting-up-axios.md)                                                                                                              | Axios clients, feature hooks, `src/api/`                 |
| **Routing & navigation**  | [configuring-routing.md](./references/configuring-routing.md), [React Navigation — Hello React Navigation (static)](https://reactnavigation.org/docs/hello-react-navigation.md?config=static)                         | Native stack, `createStaticNavigation`, screen options   |
| **Keyboard handling**     | [react-native-keyboard-controller — Components overview](https://kirillzyusko.github.io/react-native-keyboard-controller/docs/guides/components-overview)                                                             | Avoidance, sticky views, scroll sync, toolbars           |
| **Splash screen**         | [Expo SplashScreen](https://docs.expo.dev/versions/latest/sdk/splash-screen/)                                                                                                                                         | Config plugin, assets, `preventAutoHideAsync`, testing   |
| **Linting & formatting**  | [linting.md](./references/linting.md)                                                                                                                                                                                 | ESLint, Prettier, lint errors                            |
