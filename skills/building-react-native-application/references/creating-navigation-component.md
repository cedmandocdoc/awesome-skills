# Creating Navigation Component

## Overview

Create **reusable navigation components** in `src/features/navigation/` — stack headers, bottom tab bars, drawer content, and related hooks. These components are wired from `src/routes/` by default; feature screens and other features may import them when route-level wiring is impractical.

This module is **navigation infrastructure**, not a user-facing product feature. Import via `@/features/navigation`.

Start from [creating-component.md](./creating-component.md). For wiring navigation components in navigator options, see [creating-route-component.md](./creating-route-component.md).

## Prerequisites

- [creating-ui-component.md](./creating-ui-component.md) — when the navigation component is a reusable primitive
- [creating-route-component.md](./creating-route-component.md) — default wiring in `src/routes/`
- [creating-screen-component.md](./creating-screen-component.md) — route-facing screens (navigation components stay out of screen trees by default)

## Guidelines

### Prefer whole navigation components

**Default:** replace the entire navigator navigation slot with a custom component. Keep icons, labels, and layout inside that component so navigation UI changes stay in one place.

Whether to use a custom navigation component at all depends on the prompt; when unspecified, **use custom navigation components**.

| Navigator | Slot | Wire via |
| --- | --- | --- |
| Stack | `[Module]StackHeader` | `screenOptions.header` |
| Bottom tabs | `[Module]BottomTabBar` | `tabBar` |
| Drawer | `[Module]DrawerContent` | `drawerContent` |

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

### Default path — wire from routes

- Build navigation components once in `src/features/navigation/`.
- Plug them into navigator options in `src/routes/` — see [creating-route-component.md](./creating-route-component.md).
- Keep screen components focused on feature UI.

### Exception — compose in a feature screen

When route-level wiring is too complex (dynamic navigation UI driven by screen-local state, navigation components tightly coupled to screen data), import navigation components directly in the feature screen. Prefer this only when `src/routes/` wiring would be harder to follow than localized composition.

### Stack header

- Accept stack header props (`options`, `navigation`, `route`) when wrapping the native header slot.
- Register `[Module]StackHeader` via `screenOptions.header` on the stack navigator.

### Bottom tab bar

- Accept bottom-tab bar props from React Navigation when implementing `[Module]BottomTabBar`.
- Register `[Module]BottomTabBar` via the navigator `tabBar` option.
- Keep tab items, icons, labels, and spacing inside the custom tab bar component.

### Drawer content

- Accept drawer content props when implementing `[Module]DrawerContent`.
- Register `[Module]DrawerContent` via `drawerContent` on the drawer navigator.
- Keep drawer labels, icons, and layout inside the custom drawer component.

Navigation components are usually **presentation-only**; navigation actions come from React Navigation props (`navigation`, `route`, `state`, `descriptors`).

### What to avoid

- Copying the same header, tab bar, or drawer JSX into every screen file.
- Putting domain business logic in navigation components — navigation components are presentation and layout.

### Naming

Derive the component name from the **navigator module name** in `src/routes/` (see [creating-route-component.md](./creating-route-component.md#naming)). Drop the `Navigator` suffix and append the navigation slot type:

| Navigator | Navigation component |
| --- | --- |
| `MainBottomNavigator` | `MainBottomTabBar` |
| `ProfileStackNavigator` | `ProfileStackHeader` |
| `MainDrawerNavigator` | `MainDrawerContent` |

- **Stack:** `[Module]StackHeader` — e.g. `ProfileStackNavigator` → `ProfileStackHeader`.
- **Bottom tabs:** `[Module]BottomTabBar` — e.g. `MainBottomNavigator` → `MainBottomTabBar`.
- **Drawer:** `[Module]DrawerContent` — e.g. `MainDrawerNavigator` → `MainDrawerContent`.
- Hooks: `useProfileStackHeader`, `useMainBottomTabBar` — live in `src/features/navigation/hooks/`.
- Use one navigator-scoped component per slot instead of screen-local duplicates.

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

`src/features/navigation/index.ts`:

```ts
export { ProfileStackHeader } from "./components/ProfileStackHeader";
```

Wire in `src/routes/ProfileStackNavigator.tsx`:

```tsx
import { ProfileStackHeader } from "@/features/navigation";

screenOptions: {
  header: (props) => <ProfileStackHeader {...props} />,
},
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

Wire in `src/routes/MainBottomNavigator.tsx`:

```tsx
import { MainBottomTabBar } from "@/features/navigation";

tabBar: (props) => <MainBottomTabBar {...props} />,
```

### Feature screen imports navigation components directly (exception)

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
- [reusing-navigation-background.md](./reusing-navigation-background.md) — shared background patterns
