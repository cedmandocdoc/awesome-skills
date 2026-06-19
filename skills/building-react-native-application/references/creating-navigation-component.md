# Creating Navigation Component

## Overview

Create **reusable navigation components** in `src/features/navigation/` — shared headers, tab icons, drawer content, and related hooks. These components are wired from `src/routes/` by default; feature screens and other features may import them when route-level wiring is impractical.

This module is **navigation infrastructure**, not a user-facing product feature. Import via `@/features/navigation`.

Start from [creating-component.md](./creating-component.md). For wiring navigation components in navigator options, see [creating-route-component.md](./creating-route-component.md).

## Prerequisites

- [creating-ui-component.md](./creating-ui-component.md) — when the navigation component is a reusable primitive
- [creating-route-component.md](./creating-route-component.md) — default wiring in `src/routes/`
- [creating-screen-component.md](./creating-screen-component.md) — route-facing screens (navigation components stay out of screen trees by default)

## Naming

- Prefix shared navigation components with **`App`** or the navigator scope: `AppHeader`, `AppTabBarIcon`, `AppDrawerContent`.
- Tab icon renderers: `HomeTabIcon`, `SettingsTabIcon` — or a single `TabBarIcon` with a `route` prop.
- Hooks: `useNavigationHeader`, `useTabBarOptions` — live in `src/features/navigation/hooks/`.
- Do not name screen-local duplicates (`WorkshopHeader` in every screen) when one shared `AppHeader` suffices.

## Guidelines

### Placement

```text
src/features/navigation/
├── components/
│   ├── AppHeader.tsx
│   ├── AppTabBarIcon.tsx
│   └── AppDrawerContent.tsx
├── hooks/
│   └── useNavigationHeader.ts
└── index.ts
```

| Piece | Location |
| --- | --- |
| Shared header / tab / drawer UI | `src/features/navigation/components/` |
| Navigation-related hooks | `src/features/navigation/hooks/` |
| Generic presentation-only primitives | `src/ui/` when not navigation-specific |
| Screen body | `src/features/<feature-name>/*Screen.tsx` |

Promote a component to `src/ui/` only when it is reused outside navigation and carries no route-specific wiring.

### Default path — wire from routes

- Build navigation components once in `src/features/navigation/`.
- Reference it from navigator `screenOptions`, `tabBarIcon`, or `drawerContent` in `src/routes/` — see [creating-route-component.md](./creating-route-component.md).
- Keep screen components focused on feature UI.

### Exception — compose in a feature screen

When route-level wiring is too complex (dynamic header per screen state, navigation components tightly coupled to screen data), import navigation components directly in the feature screen. Prefer this only when `src/routes/` wiring would be harder to follow than localized composition.

### Header component

- Accept stack header props (`options`, `navigation`, `route`) when wrapping the native header slot.
- Reuse across all screens in a stack via `screenOptions.header` in `src/routes/`.
- Do not copy the same header JSX into each screen file.

### Tab and drawer pieces

- Tab icons and labels: small components registered in tab navigator options.
- Custom drawer content: one `AppDrawerContent` component passed to `drawerContent`.

Navigation components are usually **presentation-only**; navigation actions come from React Navigation props (`navigation`, `route`).

## Examples

### Shared stack header

`src/features/navigation/components/AppHeader.tsx`:

```tsx
import type { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { Text, View } from "react-native";

export function AppHeader({ options }: NativeStackHeaderProps) {
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
export { AppHeader } from "./components/AppHeader";
```

Wire in `src/routes/MainStack.tsx`:

```tsx
import { AppHeader } from "@/features/navigation";

screenOptions: {
  header: (props) => <AppHeader {...props} />,
},
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
