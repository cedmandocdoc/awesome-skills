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
- React Native tasks in an existing project that already follows [references/architecture.md](references/architecture.md)
- Architecture, library, or folder-structure decisions for Expo React Native apps
- UI, state, API, routing/navigation stacks (screens + route params), or styling work that should follow this skill's conventions

## References

| Task/Scenario            | Doc                                               | When to Use                                                             |
| ------------------------ | ------------------------------------------------- | ----------------------------------------------------------------------- |
| **Project structure**    | [architecture.md](./references/architecture.md)   | Organizing folders, defining module boundaries, refactoring imports     |
| **Components & UI**      | [components.md](./references/components.md)       | Adding or updating UI components, theme tokens, registry components     |
| **Styling**              | [styling.md](./references/styling.md)             | Applying NativeWind utilities, CVA variants, design tokens              |
| **State management**     | [state.md](./references/state.md)                 | Choosing between Query, Zustand, or local state; data fetching patterns |
| **API clients**          | [api.md](./references/api.md)                     | Creating or updating Axios clients and feature hooks under `src/api/`   |
| **Routing & navigation** | [routing.md](./references/routing.md)             | Adding screens, configuring stacks, typing route params                 |
| **Keyboard handling**    | [keyboard.md](./references/keyboard.md)           | Avoidance, scroll sync, input toolbars; install and Expo notes in doc   |
| **Splash screen**        | [splash-screen.md](./references/splash-screen.md) | Native splash, config plugin, delayed hide; verify on release (SDK 52+) |
| **Linting & formatting** | [linting.md](./references/linting.md)             | Configuring ESLint, Prettier, or fixing lint errors                     |
