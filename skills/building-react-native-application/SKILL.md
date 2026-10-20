---
name: building-react-native-application
id: ddfed93c-f419-4c5f-8832-85acc8f85f00
description: Guides building Expo/React Native apps with TypeScript on a fixed stack (NativeWind, React Navigation static config, @rn-primitives, TanStack Query, TanStack Form, Zod) on structural foundations — structure, navigation and deep links, styling, UI primitives and accessibility, data, async states, errors, forms, authentication, guards — plus platform fixes, turning whatever requirements exist into that implementation. Use when creating an Expo app, or changing code in an app whose `package.json` has `expo`, `@react-navigation/native`, and `nativewind`, to follow these conventions.
version: 3.0.0
---

# React Native application

## Setup

| Item | Kind | Required | When | Done when | How |
| --- | --- | --- | --- | --- | --- |
| Node.js 22.12+ | user | required | All | `node --version` reports 22.12 or later | https://nodejs.org |
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
| Scaffold | "Create an Expo app in apps/mobile", "Scaffold here", "Add linting and env handling to the app" | [scaffolding-application.md](references/scaffolding-application.md), [managing-package-installs.md](references/managing-package-installs.md), [setting-up-nativewind.md](references/setting-up-nativewind.md), [managing-environment.md](references/managing-environment.md), [managing-linting.md](references/managing-linting.md) |
| Structure | "Where does this module belong?", "Two features need this hook", "Move this component to the right layer" | [managing-project-structure.md](references/managing-project-structure.md), [managing-linting.md](references/managing-linting.md) |
| Screen / feature | "Add a settings screen", "New orders feature", "Custom tab bar", "Open this screen from a link" | [managing-project-structure.md](references/managing-project-structure.md), [creating-screen.md](references/creating-screen.md) |
| UI primitive | "Add a Dialog to src/ui", "Build the select from the spec" | [managing-project-structure.md](references/managing-project-structure.md), [creating-ui-component.md](references/creating-ui-component.md), [managing-styling.md](references/managing-styling.md) |
| Data | "Fetch orders from the API", "Add a mutation for checkout", "Format the order date" | [managing-data.md](references/managing-data.md), [managing-environment.md](references/managing-environment.md) |
| Async UI states | "Show the orders list with loading and error states", "Add pull-to-refresh" | [creating-async-component.md](references/creating-async-component.md), [managing-data.md](references/managing-data.md) |
| Errors / feedback | "Show a toast when saving fails", "Report crashes", "Handle unknown links" | [managing-errors.md](references/managing-errors.md), [managing-data.md](references/managing-data.md) |
| Form / multi-step | "Add a profile form", "Make checkout a three-step form" | [creating-form.md](references/creating-form.md), [managing-data.md](references/managing-data.md) |
| Styling / theme | "Apply the design tokens", "Change the brand colors", "Add dark mode", "Override a className" | [managing-styling.md](references/managing-styling.md) |
| Authentication | "Add the sign-in flow", "Attach the token to API calls", "Sign out on 401" | [setting-up-authentication.md](references/setting-up-authentication.md), [managing-data.md](references/managing-data.md) |
| Auth guard | "Protect the account screens", "Require profile setup after sign-in", "Add an invite link", "Restrict the team screens to members" | [setting-up-auth-guard.md](references/setting-up-auth-guard.md), [setting-up-authentication.md](references/setting-up-authentication.md), [creating-screen.md](references/creating-screen.md) |
| Platform fixes | "The keyboard covers the input", "White flash behind the header", "Keep the splash until fonts load", "Use Inter as the body font" | [managing-platform-fixes.md](references/managing-platform-fixes.md) |
