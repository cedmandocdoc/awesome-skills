# Creating Route Component

## Overview

Create the **route layer** under `src/routes/`: navigator modules that register screen components from features and wire navigation components from `src/features/navigation/`.

| Configures | Source | Guide |
| --- | --- | --- |
| Screen UI | `src/features/<feature-name>/components/*Screen.tsx` | [creating-screen-component.md](./creating-screen-component.md) |
| Header, tab bar, drawer navigation components | `src/features/navigation/` | [creating-navigation-component.md](./creating-navigation-component.md) |

Keep navigator files focused on the tree, types, and options. Domain UI stays in features.

## Prerequisites

- [managing-project-structure.md](./managing-project-structure.md)
- [creating-screen-component.md](./creating-screen-component.md)
- [creating-navigation-component.md](./creating-navigation-component.md)

## Guidelines

### Naming

Name navigator modules **`[Name][NavigatorType]`** — prefix with a module or feature name, then the navigator kind:

| File | Navigator type |
| --- | --- |
| `MainBottomNavigator.tsx` | Bottom tabs |
| `ProfileStackNavigator.tsx` | Stack |
| `MainDrawerNavigator.tsx` | Drawer |

Use **PascalCase** for file and export names. Match navigation component names to the navigator — see [creating-navigation-component.md](./creating-navigation-component.md#naming). Keep one navigator per file when possible; split into more files when the tree grows.

### Structure and config

```text
src/routes/
├── MainBottomNavigator.tsx   # bottom tabs
├── ProfileStackNavigator.tsx # stack
├── MainDrawerNavigator.tsx   # drawer
├── index.tsx                 # exports Navigation for App.tsx
└── RootStackNavigator.tsx    # optional root navigator split
```

Prefer **static navigation config** for route registration:

- Define routes in a config object passed to `createNativeStackNavigator` / `createBottomTabNavigator` / etc., then wrap the root with `createStaticNavigation(...)`.
- Register routes and route options in `src/routes/`. Import **feature screen exports** as each route's `component`.
- Use dynamic `<Stack.Navigator>` / `<Stack.Screen>` only when runtime composition requires it.

### Route responsibilities

- Map route names to feature screen exports in static `screens` config.
- Wire shared header, tab bar, and drawer navigation components at the navigator level.
- Type route params and extend `RootNavigator` for typed `useNavigation`.
- Import domain UI and navigation components from features — keep navigator files focused on tree, types, and options.
- Export **route-ready screen components** from features (they call `useRoute` / `useNavigation` for params). Place thin param adapters **beside the navigator** in `src/routes/`.

### Wiring navigation components

Plug whole navigation components from `@/features/navigation` into navigator slots. Configure header, tab bar, and drawer content at the navigator level. Keep screen components focused on feature UI.

| Navigator | Option | Component |
| --- | --- | --- |
| Stack | `screenOptions.header` | `[Module]StackHeader` |
| Bottom tabs | `tabBar` | `[Module]BottomTabBar` |
| Drawer | `drawerContent` | `[Module]DrawerContent` |

**Exception:** when route-level wiring is too complex (per-screen dynamic navigation UI tied to screen state), compose navigation components directly in the feature screen — see [creating-navigation-component.md](./creating-navigation-component.md).

### Choosing navigators

Compose as needed (for example, a stack inside each tab).

| Pattern | Use it when |
| --- | --- |
| **Stack** | Linear flow: list → detail, auth, onboarding, anything that pushes and pops. |
| **Bottom tabs** | A few peer sections users switch between often. |
| **Drawer** | Many destinations, secondary navigation, or a slide-out menu fits the product. |

## Setup

### Install packages

Install `@react-navigation/native` and shared dependencies from [React Navigation — Getting started](https://reactnavigation.org/docs/getting-started.md). For each navigator in use, follow that navigator's **Installation** section.

### TypeScript configuration (static API)

```json
{
  "compilerOptions": {
    "strict": true,
    "moduleResolution": "bundler"
  }
}
```

- `strict` (or at minimum `strictNullChecks`) is required for route param inference.
- `moduleResolution: "bundler"` keeps TypeScript resolution aligned with Metro and React Navigation types.

## Examples

### Stack navigator with wired header

`src/routes/ProfileStackNavigator.tsx`:

```tsx
import type { StaticScreenProps } from "@react-navigation/native";
import { createStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProfileStackHeader } from "@/features/navigation";
import { WorkshopListScreen } from "@/features/workshop-list";
import { WorkshopDetailScreen } from "@/features/workshop-detail";

const ProfileStackNavigator = createNativeStackNavigator({
  screenOptions: {
    header: (props) => <ProfileStackHeader {...props} />,
  },
  screens: {
    Workshops: {
      screen: WorkshopListScreen,
      options: { title: "Workshops" },
    },
    WorkshopDetail: {
      screen: WorkshopDetailScreen,
      options: { title: "Workshop" },
    },
  },
});

type RootStackType = typeof ProfileStackNavigator;

declare module "@react-navigation/core" {
  interface RootNavigator extends RootStackType {}
}

export const Navigation = createStaticNavigation(ProfileStackNavigator);
```

### Bottom tab navigator with wired tab bar

`src/routes/MainBottomNavigator.tsx`:

```tsx
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MainBottomTabBar } from "@/features/navigation";
import { HomeScreen } from "@/features/home";
import { SettingsScreen } from "@/features/settings";

export const MainBottomNavigator = createBottomTabNavigator({
  tabBar: (props) => <MainBottomTabBar {...props} />,
  screens: {
    Home: { screen: HomeScreen, options: { title: "Home" } },
    Settings: { screen: SettingsScreen, options: { title: "Settings" } },
  },
});
```

Type each screen's `route.params` with `StaticScreenProps<...>` when params are needed. Extend `@react-navigation/core` `RootNavigator` (shown above) so `useNavigation`, links, and refs infer from the app's root navigator.

## Related

- [creating-screen-component.md](./creating-screen-component.md) — feature screen components
- [creating-navigation-component.md](./creating-navigation-component.md) — shared header, tab bar, and drawer components
- [setting-up-navigation-theme.md](./setting-up-navigation-theme.md) — theme colors for navigation components

## References

- [React Navigation — Hello React Navigation (static)](https://reactnavigation.org/docs/hello-react-navigation.md?config=static)
- [React Navigation — Type checking with TypeScript](https://reactnavigation.org/docs/typescript.md)
- [Native stack — Usage](https://reactnavigation.org/docs/native-stack-navigator.md)
- [Native bottom tabs — Usage](https://reactnavigation.org/docs/native-bottom-tab-navigator.md)
- [Drawer — Usage](https://reactnavigation.org/docs/drawer-navigator.md)
