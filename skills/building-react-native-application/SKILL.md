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

| Task / Scenario           | Doc                                                                                                                                                                                                                   | When to use                                            |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| **Project structure**     | [structuring-project.md](./references/structuring-project.md)                                                                                                                                                         | Organizing folders, module boundaries, imports         |
| **Styling**               | [styling.md](./references/styling.md), [setting-up-nativewind.md](./references/setting-up-nativewind.md)                                                                                                              | NativeWind utilities, CVA variants, design tokens      |
| **Theming**               | [setting-up-theming.md](./references/setting-up-theming.md), [setting-up-tailwind-theme.md](./references/setting-up-tailwind-theme.md), [setting-up-navigation-theme.md](./references/setting-up-navigation-theme.md) | Theme CSS/TS tokens, tailwind.config.js extension      |
| **Component placement**   | [placing-component.md](./references/placing-component.md)                                                                                                                                                             | Deciding `src/ui/` vs `src/features/`                  |
| **Component creation**    | [creating-component.md](./references/creating-component.md)                                                                                                                                                           | Writing components, compound part patterns             |
| **Component abstraction** | [abstracting-component.md](./references/abstracting-component.md)                                                                                                                                                     | Extraction workflow, registry-first                    |
| **Component naming**      | [naming-component.md](./references/naming-component.md)                                                                                                                                                               | Consistent naming across `src/ui/` and `src/features/` |
| **Feature modules**       | [creating-feature.md](./references/creating-feature.md)                                                                                                                                                               | Feature layout, barrels, isolated vs grouped           |
| **Feature promotion**     | [promoting-feature.md](./references/promoting-feature.md)                                                                                                                                                             | Promotion to `src/ui/`, extraction to new feature      |
| **State management**      | [managing-state.md](./references/managing-state.md)                                                                                                                                                                   | Query vs Zustand vs local state                        |
| **API clients**           | [creating-api.md](./references/creating-api.md), [setting-up-axios.md](./references/setting-up-axios.md)                                                                                                              | Axios clients, feature hooks, `src/api/`               |
| **Routing & navigation**  | [configuring-routing.md](./references/configuring-routing.md), [setting-up-react-navigation.md](./references/setting-up-react-navigation.md)                                                                          | Stacks, typing route params, static API                |
| **Keyboard handling**     | [keyboard.md](./references/keyboard.md)                                                                                                                                                                               | Avoidance, scroll sync, input toolbars                 |
| **Splash screen**         | [implementing-splash-screen.md](./references/implementing-splash-screen.md), [setting-up-splash-screen.md](./references/setting-up-splash-screen.md)                                                                  | Native splash, config plugin, delayed hide             |
| **Linting & formatting**  | [linting.md](./references/linting.md)                                                                                                                                                                                 | ESLint, Prettier, lint errors                          |
