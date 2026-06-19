# Creating Route Component

## Overview

Create the **route layer** under `src/routes/`: navigator modules that register screen components from features and wire navigation components from `src/features/navigation/`.

Each route entry configures a **screen and/or navigation**:

| Configures | Source | Guide |
| --- | --- | --- |
| Screen UI | `src/features/<feature-name>/*Screen.tsx` | [creating-screen-component.md](./creating-screen-component.md) |
| Header, tab bar, drawer navigation components | `src/features/navigation/` | [creating-navigation-component.md](./creating-navigation-component.md) |

Keep navigator files focused on the tree, types, and options. Domain UI stays in features.

## Prerequisites

- [managing-project-structure.md](./managing-project-structure.md)
- [creating-screen-component.md](./creating-screen-component.md)
- [creating-navigation-component.md](./creating-navigation-component.md)
- [React Navigation — Hello React Navigation (static)](https://reactnavigation.org/docs/hello-react-navigation.md?config=static)
- [React Navigation — Type checking with TypeScript](https://reactnavigation.org/docs/typescript.md)

## Guidelines

### Structure

```text
src/routes/
├── MainStack.tsx           # stack / tabs / drawer config
├── index.tsx               # exports Navigation for App.tsx
└── RootStack.tsx           # optional root navigator split
```

- Prefer **static navigation config** for route registration:
  - Static config defines routes in a config object passed to `createNativeStackNavigator` / `createBottomTabNavigator` / etc., then wraps the root with `createStaticNavigation(...)`.
  - Dynamic config defines routes with `<Stack.Navigator>` and `<Stack.Screen>`.
- Register routes and route options in `src/routes/`. Import **feature screen exports** as each route's `component`.
- Import navigation components from `@/features/navigation` and wire through navigator `screenOptions`, `tabBarIcon`, or `drawerContent`.
- Split navigators into more files when the tree grows.

### Route responsibilities

- Map route names to feature screen exports in static `screens` config.
- Wire shared header, tab bar, and drawer navigation components at the navigator level.
- Type route params and extend `RootNavigator` for typed `useNavigation`.
- Do not embed domain UI or reusable navigation components — import from features.

### Wiring navigation components

- **Default:** wire navigation components from `@/features/navigation` through navigator options (`screenOptions.header`, `tabBarIcon`, `drawerContent`).
- **Exception:** when route-level wiring is too complex (per-screen dynamic navigation components tied to screen state), compose navigation components directly in the feature screen — see [creating-navigation-component.md](./creating-navigation-component.md).

### Prefer navigator-owned navigation UI

- Configure header, tab bar, and drawer content at the navigator level.
- Keep screen components focused on feature UI and behavior.
- Use shared navigator options to keep navigation components consistent.
- Do not copy the same custom header into every screen.

### Header

- Use `screenOptions` or per-screen `options` on stack navigators.
- Reuse `header` renderers from `@/features/navigation` across all screens in a stack.

### Drawer

- Use drawer navigator options for drawer labels, icons, and behavior.
- Pass custom drawer layout via `drawerContent` pointing to `@/features/navigation`.

### Bottom tabs

- Configure `tabBarIcon`, `tabBarLabel`, and style through tab navigator options.
- Use shared tab options for consistent spacing, colors, and behavior.
- Avoid manual tab bars in screen trees unless building a non-navigation surface.

### Choosing navigators

Compose as needed (for example, a stack inside each tab).

| Pattern | Use it when |
| --- | --- |
| **Stack** | Linear flow: list → detail, auth, onboarding, anything that pushes and pops. |
| **Bottom tabs** | A few peer sections users switch between often. |
| **Drawer** | Many destinations, secondary navigation, or a slide-out menu fits the product. |

Copy setup from each doc's **Usage** section:

- [Native stack — Usage](https://reactnavigation.org/docs/native-stack-navigator.md)
- [Native bottom tabs — Usage](https://reactnavigation.org/docs/native-bottom-tab-navigator.md)
- [Drawer — Usage](https://reactnavigation.org/docs/drawer-navigator.md)

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

### Render navigation in `App.tsx`

```tsx
import { Navigation } from "@/routes";

export default function App() {
  return <Navigation />;
}
```

### Register screens and wire navigation components

`src/routes/MainStack.tsx`:

```tsx
import type { StaticScreenProps } from "@react-navigation/native";
import { createStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppHeader } from "@/features/navigation";
import { WorkshopListScreen } from "@/features/workshop-list";
import { WorkshopDetailScreen } from "@/features/workshop-detail";

const MainStack = createNativeStackNavigator({
  screenOptions: {
    header: (props) => <AppHeader {...props} />,
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

type RootStackType = typeof MainStack;

declare module "@react-navigation/core" {
  interface RootNavigator extends RootStackType {}
}

export const Navigation = createStaticNavigation(MainStack);
```

Use static config to keep route definitions declarative. Avoid dynamic `<Stack.Navigator>` / `<Stack.Screen>` registration unless runtime composition requires it.

For static TypeScript setup:

- Type each screen's `route.params` with `StaticScreenProps<...>` when params are needed.
- Export the root navigator type with `type RootStackType = typeof MainStack`.
- Extend `@react-navigation/core` `RootNavigator` so `useNavigation`, links, and refs infer from the app's root navigator.

Prefer exporting a **route-ready screen component** from the feature (it can call `useRoute` / `useNavigation` when it needs params). When you need a thin adapter for props or params, place it **beside the navigator** in `src/routes/` so bridging stays next to the static `screens` config entry.

### Navigate from a screen component

```tsx
import { useNavigation } from "@react-navigation/native";

export function HomeScreen() {
  const navigation = useNavigation();

  const openDetail = () => {
    navigation.navigate("WorkshopDetail", { workshopId: "123" });
  };

  return null;
}
```

## Related

- [creating-screen-component.md](./creating-screen-component.md) — feature screen components
- [creating-navigation-component.md](./creating-navigation-component.md) — shared header, tab, and drawer components
- [setting-up-navigation-theme.md](./setting-up-navigation-theme.md) — theme colors for navigation components
