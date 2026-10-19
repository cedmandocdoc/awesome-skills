# Creating Screen

## Overview

Screens, feature components, the route layer that registers them, and the navigation components wired into navigator slots.

## Prerequisites

- [managing-project-structure.md](./managing-project-structure.md) — layers, naming, barrels

## Guidelines

### Route layer

- Register routes with static config: pass a config object to `createNativeStackNavigator` / `createBottomTabNavigator` / `createDrawerNavigator`, and wrap the root with `createStaticNavigation`; `src/routes/index.tsx` exports `Navigation` for `App.tsx`.
- Use dynamic `<Stack.Navigator>` / `<Stack.Screen>` only when runtime composition requires it.
- Name navigator modules `[Name][NavigatorType]`: `MainBottomNavigator`, `ProfileStackNavigator`, `MainDrawerNavigator`; one navigator per file.
- Map each route to a feature screen export; navigator files hold the tree, param types, and options only.
- Extend `RootNavigator` in `@react-navigation/core` so `useNavigation` and links infer from the root navigator.
- Place thin param adapters beside the navigator in `src/routes/`.
- For each navigator in use, follow its **Installation** section (**References**).

| Navigator | Use when |
| --- | --- |
| Stack | Linear flow that pushes and pops: list → detail, onboarding |
| Bottom tabs | A few peer sections users switch between often |
| Drawer | Many destinations or secondary navigation |

### Screens

- `src/features/<feature>/components/<Feature>Screen.tsx`, exported from the feature barrel.
- Route-ready: the screen types and reads its own params with `StaticScreenProps<…>`, so registration is a one-line import.
- Composes feature components and `@/ui/*` primitives; wires query hooks and mutations for its flow.
- Server-backed content renders through [creating-async-component.md](./creating-async-component.md).

### Feature components

- Live in `src/features/<feature>/components/`; may hold feature logic, hooks, and event handlers.
- Split a recurring rendering block into a named feature component when it clarifies the tree.

### Navigation components

- Live in `src/features/navigation/` (`components/`, `hooks/`).
- Built once and wired at the navigator; screens never copy header, tab bar, or drawer markup.
- Presentation-only: navigation actions come from React Navigation props (`navigation`, `route`, `state`, `descriptors`).
- Exception: a screen imports a navigation component directly when it depends on screen-local state that route-level wiring would obscure.

Name each component after its navigator, dropping `Navigator` and appending the slot:

| Navigator | Component | Slot | Props |
| --- | --- | --- | --- |
| `ProfileStackNavigator` | `ProfileStackHeader` | `screenOptions.header` | `NativeStackHeaderProps` |
| `MainBottomNavigator` | `MainBottomTabBar` | `tabBar` | `BottomTabBarProps` |
| `MainDrawerNavigator` | `MainDrawerContent` | `drawerContent` | `DrawerContentComponentProps` |

## Examples

### Stack navigator with a wired header

`src/routes/ProfileStackNavigator.tsx`:

```tsx
import { createStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProfileStackHeader } from "@/features/navigation";
import { WorkshopDetailScreen } from "@/features/workshop-detail";
import { WorkshopListScreen } from "@/features/workshop-list";

const ProfileStackNavigator = createNativeStackNavigator({
  screenOptions: {
    header: (props) => <ProfileStackHeader {...props} />,
  },
  screens: {
    Workshops: { screen: WorkshopListScreen, options: { title: "Workshops" } },
    WorkshopDetail: { screen: WorkshopDetailScreen, options: { title: "Workshop" } },
  },
});

type RootStackType = typeof ProfileStackNavigator;

declare module "@react-navigation/core" {
  interface RootNavigator extends RootStackType {}
}

export const Navigation = createStaticNavigation(ProfileStackNavigator);
```

### Route-ready screen

```tsx
import type { StaticScreenProps } from "@react-navigation/native";
import { AsyncScrollView } from "@/ui/Async";
import { useWorkshop } from "../hooks/useWorkshop";
import { WorkshopSummary } from "./WorkshopSummary";

type Props = StaticScreenProps<{ workshopId: string }>;

export function WorkshopDetailScreen({ route }: Props) {
  const workshop = useWorkshop(route.params.workshopId);

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
- [Native stack — Usage](https://reactnavigation.org/docs/native-stack-navigator.md)
- [Bottom tabs — Usage](https://reactnavigation.org/docs/bottom-tab-navigator.md)
- [Drawer — Usage](https://reactnavigation.org/docs/drawer-navigator.md)
