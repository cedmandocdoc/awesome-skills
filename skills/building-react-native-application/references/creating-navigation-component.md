# Creating Navigation Component

## Overview

Create **reusable navigation components** in `src/features/navigation/` — stack headers, bottom tab bars, drawer content, and related hooks. Wire from `src/routes/` by default; feature screens import them when route-level wiring is impractical.

This module is **navigation infrastructure**, not a user-facing product feature. Import via `@/features/navigation`.

Start from [creating-component.md](./creating-component.md).

## Prerequisites

- [creating-ui-component.md](./creating-ui-component.md) — when the navigation component is a reusable primitive
- [creating-route-component.md](./creating-route-component.md) — navigator→slot wiring table and default wiring path
- [creating-screen-component.md](./creating-screen-component.md) — route-facing screens

## Guidelines

### Placement

```text
src/features/navigation/
├── components/
│   ├── MainBottomTabBar.tsx
│   ├── ProfileStackHeader.tsx
│   └── MainDrawerContent.tsx
├── hooks/
│   └── useMainBottomTabBar.ts
└── index.ts
```

| Piece | Location |
| --- | --- |
| Shared header / tab bar / drawer UI | `src/features/navigation/components/` |
| Navigation-related hooks | `src/features/navigation/hooks/` |
| Generic presentation-only primitives | `src/ui/` when not navigation-specific |
| Screen body | `src/features/<feature-name>/components/*Screen.tsx` |

Promote a component to `src/ui/` only when it is reused outside navigation and carries no route-specific wiring.

### Wiring

**Default:** build navigation components once in `src/features/navigation/`, then wire slots per [creating-route-component.md](./creating-route-component.md#wiring-navigation-components). Keep screen components focused on feature UI.

**Exception:** when route-level wiring is too complex (dynamic navigation UI driven by screen-local state), import navigation components directly in the feature screen. Prefer this only when `src/routes/` wiring would be harder to follow than localized composition.

### Naming

Derive the component name from the **navigator module name** in `src/routes/` (see [creating-route-component.md](./creating-route-component.md#naming)). Drop the `Navigator` suffix and append the navigation slot type:

| Navigator | Navigation component |
| --- | --- |
| `MainBottomNavigator` | `MainBottomTabBar` |
| `ProfileStackNavigator` | `ProfileStackHeader` |
| `MainDrawerNavigator` | `MainDrawerContent` |

Hooks: `useProfileStackHeader`, `useMainBottomTabBar` — live in `src/features/navigation/hooks/`. Use one navigator-scoped component per slot instead of screen-local duplicates.

### Per-type guidance

| Type | Props to accept | Register via | Keep inside |
| --- | --- | --- | --- |
| `[Module]StackHeader` | `options`, `navigation`, `route` | `screenOptions.header` | Title, back button, actions |
| `[Module]BottomTabBar` | `BottomTabBarProps` | `tabBar` | Tab items, icons, labels, spacing |
| `[Module]DrawerContent` | Drawer content props | `drawerContent` | Drawer labels, icons, layout |

### Component design

- Navigation components are **presentation-only**; navigation actions come from React Navigation props (`navigation`, `route`, `state`, `descriptors`).
- Build shared navigation UI once and wire at the navigator level — avoid copying header, tab bar, or drawer JSX into every screen file.
- Keep domain business logic out of navigation components.
- When unspecified, **use custom navigation components**.

## Examples

### Shared stack header

`src/features/navigation/components/ProfileStackHeader.tsx`:

```tsx
import type { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { Text, View } from "react-native";

export function ProfileStackHeader({ options }: NativeStackHeaderProps) {
  return (
    <View className="border-b border-border bg-background px-4 py-3">
      <Text className="text-lg font-semibold text-foreground">
        {options.title ?? ""}
      </Text>
    </View>
  );
}
```

### Shared bottom tab bar

`src/features/navigation/components/MainBottomTabBar.tsx`:

```tsx
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Pressable, Text, View } from "react-native";

export function MainBottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View className="flex-row border-t border-border bg-background">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title ?? route.name;
        const isFocused = state.index === index;

        return (
          <Pressable
            key={route.key}
            className="flex-1 items-center py-3"
            onPress={() => navigation.navigate(route.name)}
          >
            <Text className={isFocused ? "text-primary" : "text-muted-foreground"}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
```

### Feature screen imports navigation component (exception)

```tsx
import { WorkshopToolbar } from "@/features/navigation";
import { WorkshopListItem } from "./components/WorkshopListItem";

export function WorkshopListScreen() {
  return (
    <>
      <WorkshopToolbar />
      {/* screen content */}
    </>
  );
}
```

Use when toolbar state is owned by the screen and navigator-level wiring would obscure the flow.

## Related

- [creating-route-component.md](./creating-route-component.md) — register screens and wire navigation components in `src/routes/`
- [creating-screen-component.md](./creating-screen-component.md) — feature screen components
- [setting-up-navigation-theme.md](./setting-up-navigation-theme.md) — theme colors for navigation components
- [managing-screen-background.md](./managing-screen-background.md) — shared background patterns
