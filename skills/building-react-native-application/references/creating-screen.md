# Creating Screen

## Overview

Screens, feature components, the route layer that registers them, deep links, and the navigation components wired into navigator slots.

## Prerequisites

- [managing-project-structure.md](./managing-project-structure.md) — layers, naming, barrels

## Guidelines

### Route layer

- Register routes with static config: pass a config object to `createNativeStackNavigator` / `createBottomTabNavigator` / `createDrawerNavigator`; use dynamic `<Stack.Navigator>` only when runtime composition requires it.
- One navigator per file in `src/routes/`, named `[Name][NavigatorType]`: `RootStackNavigator`, `MainBottomNavigator`, `ProfileStackNavigator`.
- `RootStackNavigator` holds the root groups (`Public`, `SignedOut`, one per gate, `SignedIn`) per [setting-up-auth-guard.md](./setting-up-auth-guard.md).
- `src/routes/index.tsx` wraps the root with `createStaticNavigation`, exports `Navigation` for `App.tsx`, and augments `@react-navigation/native` once with `interface RootNavigator extends RootStackType {}` so `useNavigation` and `Link` type-check.
- Navigator files hold the tree, options, and `linking` only: they map each route to a feature screen export and never fetch data.
- For each navigator in use, follow its **Installation** section (**References**).

| Navigator | Use when |
| --- | --- |
| Stack | Linear flow that pushes and pops: list → detail, onboarding |
| Bottom tabs | A few peer sections users switch between often |
| Drawer | Many destinations or secondary navigation |

### Linking

- `Navigation` receives `linking` with the app's prefixes from `Linking.createURL("/")` (`expo-linking`), so the app's `scheme` applies.
- Each screen opened from outside the app declares its `linking` path in its screen config (`linking: "workshops/:workshopId"`).
- A screen parses link params with a Zod schema from its feature's `schemas.ts` before use.
- One fallback screen with `linking: "*"` is the not-found hook point per [managing-errors.md](./managing-errors.md).

### Screens

- `src/features/<feature>/components/<Feature>Screen.tsx`, exported from the feature barrel.
- Route-ready: the screen types and reads its own params with `StaticScreenProps<…>`, so registration is a one-line import.
- Fetches with query hooks; composes feature components and `@/ui/*` primitives.
- Server-backed content renders through [creating-async-component.md](./creating-async-component.md).
- The title lives in the screen's `options.title`; its text comes from the requirements.

### Feature components

- Live in `src/features/<feature>/components/`; may hold feature logic, hooks, and event handlers.
- Split a recurring rendering block into a named feature component when it clarifies the tree.

### Navigation components

- Live in `src/common/navigation/` (`components/`, `hooks/`).
- Built once and wired at the navigator; screens never copy header, tab bar, or drawer markup.
- Navigation actions come from React Navigation props (`navigation`, `route`, `state`, `descriptors`).
- React Navigation owns route tabs; in-screen tabs use the `src/ui` Tabs primitive.

Name each component after its navigator, dropping `Navigator` and appending the slot:

| Navigator | Component | Slot | Props |
| --- | --- | --- | --- |
| `ProfileStackNavigator` | `ProfileStackHeader` | `screenOptions.header` | `NativeStackHeaderProps` |
| `MainBottomNavigator` | `MainBottomTabBar` | `tabBar` | `BottomTabBarProps` |
| `MainDrawerNavigator` | `MainDrawerContent` | `drawerContent` | `DrawerContentComponentProps` |

## Setup

```bash
node ../scripts/run-package.cjs -- expo install expo-linking
```

## Examples

### Stack navigator with a wired header

`src/routes/ProfileStackNavigator.tsx`:

```tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProfileStackHeader } from "@/common/navigation";
import { WorkshopDetailScreen } from "@/features/workshop-detail";
import { WorkshopListScreen } from "@/features/workshop-list";

export const ProfileStackNavigator = createNativeStackNavigator({
  screenOptions: {
    header: (props) => <ProfileStackHeader {...props} />,
  },
  screens: {
    Workshops: { screen: WorkshopListScreen, options: { title: "Workshops" } },
    WorkshopDetail: {
      screen: WorkshopDetailScreen,
      options: { title: "Workshop" },
      linking: "workshops/:workshopId",
    },
  },
});
```

### `src/routes/index.tsx`

```tsx
import { createStaticNavigation } from "@react-navigation/native";
import { RootStackNavigator } from "./RootStackNavigator";

type RootStackType = typeof RootStackNavigator;

declare module "@react-navigation/native" {
  interface RootNavigator extends RootStackType {}
}

export const Navigation = createStaticNavigation(RootStackNavigator);
```

`App.tsx` renders `<Navigation linking={{ prefixes: [Linking.createURL("/")] }} />`.

### Route-ready screen

```tsx
import type { StaticScreenProps } from "@react-navigation/native";
import { AsyncScrollView } from "@/ui/Async";
import { useWorkshop } from "../hooks/useWorkshop";
import { WorkshopParamsSchema } from "../schemas";
import { WorkshopSummary } from "./WorkshopSummary";

type Props = StaticScreenProps<{ workshopId: string }>;

export function WorkshopDetailScreen({ route }: Props) {
  const { workshopId } = WorkshopParamsSchema.parse(route.params);
  const workshop = useWorkshop(workshopId);

  return (
    <AsyncScrollView queries={[workshop]}>
      {workshop.data ? <WorkshopSummary workshop={workshop.data} /> : null}
    </AsyncScrollView>
  );
}
```

### Tab bar

```tsx
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Pressable, Text, View } from "react-native";

export function MainBottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View className="flex-row">
      {state.routes.map((route, index) => (
        <Pressable
          key={route.key}
          accessibilityRole="tab"
          accessibilityState={{ selected: state.index === index }}
          onPress={() => navigation.navigate(route.name)}
        >
          <Text>{descriptors[route.key].options.title ?? route.name}</Text>
        </Pressable>
      ))}
    </View>
  );
}
```

## References

- [React Navigation — Static configuration](https://reactnavigation.org/docs/hello-react-navigation.md?config=static)
- [React Navigation — Type checking with TypeScript](https://reactnavigation.org/docs/typescript.md)
- [React Navigation — Configuring links](https://reactnavigation.org/docs/configuring-links.md?config=static)
- [Native stack — Usage](https://reactnavigation.org/docs/native-stack-navigator.md)
- [Bottom tabs — Usage](https://reactnavigation.org/docs/bottom-tab-navigator.md)
- [Drawer — Usage](https://reactnavigation.org/docs/drawer-navigator.md)
