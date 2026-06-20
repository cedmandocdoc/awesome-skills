# Creating Navigation Component

## Overview

Create **reusable navigation components** in `src/features/navigation/` — stack headers, bottom tab bars, drawer content, app shells, sidebars, and related hooks. These components are consumed from `src/routes/` by default; other features may import them when route-level wiring is impractical.

This module is **navigation infrastructure**, not a user-facing product feature. Import via `@/features/navigation`.

Start from [creating-component.md](./creating-component.md). For wiring navigation components in route modules, see [creating-route-component.md](./creating-route-component.md).

## Prerequisites

- [creating-ui-component.md](./creating-ui-component.md) — when the navigation component is a reusable primitive
- [creating-route-component.md](./creating-route-component.md) — default wiring in `src/routes/`
- [creating-screen-component.md](./creating-screen-component.md) — route-facing screens (navigation components stay out of screen trees by default)

## Naming

Derive the component name from the **route navigator module name** in `src/routes/` (see [creating-route-component.md](./creating-route-component.md#naming)). Drop the `Navigator` suffix and append the navigation slot type:

| Route navigator | Navigation component |
| --- | --- |
| `MainBottomNavigator` | `MainBottomTabBar` |
| `ProfileStackNavigator` | `ProfileStackHeader` |
| `MainDrawerNavigator` | `MainDrawerContent` |

- **Stack-style layout:** `[Module]StackHeader` — e.g. `ProfileStackNavigator` → `ProfileStackHeader`.
- **Bottom-tab-style layout:** `[Module]BottomTabBar` — e.g. `MainBottomNavigator` → `MainBottomTabBar`.
- **Drawer-style layout:** `[Module]DrawerContent` — e.g. `MainDrawerNavigator` → `MainDrawerContent`.
- **App-wide shell:** `AppShell` when a single root wrapper wraps all authenticated routes.
- Hooks: `useProfileStackHeader`, `useMainBottomTabBar` — live in `src/features/navigation/hooks/`.
- Use one navigator-scoped component per layout slot instead of per-page duplicates.

## Guidelines

### Prefer whole navigation components

**Default:** replace the entire layout navigation surface with a custom component. Keep nav items, icons, labels, and spacing inside that component so navigation UI changes stay in one place.

Whether to use a custom navigation component at all depends on the prompt; when unspecified, **use custom navigation components**.

| Layout pattern | Component | Wire in |
| --- | --- | --- |
| Stack-style section header | `[Module]StackHeader` | Layout route that owns the section |
| Bottom-tab-style sub-nav | `[Module]BottomTabBar` | Layout route around child `<Outlet />` |
| Drawer-style sidebar | `[Module]DrawerContent` | Layout route around child `<Outlet />` |
| App shell | `AppShell` or `[Module]Shell` | Root or authenticated layout route |

### Placement

```text
src/features/navigation/
├── components/
│   ├── AppShell.tsx
│   ├── MainBottomTabBar.tsx
│   ├── ProfileStackHeader.tsx
│   └── MainDrawerContent.tsx
├── hooks/
│   └── useMainBottomTabBar.ts
└── index.ts
```

| Piece | Location |
| --- | --- |
| Shared layout / navigation components | `src/features/navigation/components/` |
| Navigation-related hooks | `src/features/navigation/hooks/` |
| Generic presentation-only primitives | `src/ui/` when not navigation-specific |
| Screen / page body | `src/features/<feature-name>/*Page.tsx` |

Promote a component to `src/ui/` only when it is reused outside navigation and carries no route-specific wiring.

### Default path — wire from routes

- Build navigation components once in `src/features/navigation/`.
- Import and wire the whole component from layout routes in `src/routes/` — see [creating-route-component.md](./creating-route-component.md).
- Keep screen/page components focused on feature UI.

### Exception — compose in a feature screen

When route-level wiring is too complex (dynamic navigation components driven by screen-local state, tight coupling between navigation components and page data), import navigation components directly in the feature screen/page. Prefer this only when `src/routes/` wiring would be harder to follow than localized composition.

### Layout navigation components (web)

- **App shell / drawer / tab bar:** structural wrappers rendered in layout routes around `<Outlet />`.
- Accept children for the main content area; keep URL and outlet wiring in `src/routes/`.
- Put all nav items, icons, labels, and spacing inside the custom navigation component.
- Reuse across route sections via nested layout routes.

### What to avoid

- Copying the same header, sidebar, tab bar, or shell JSX into every feature page.
- Putting domain business logic in navigation components — navigation components are presentation and layout.

## Examples

### Drawer-style layout wired in a route navigator

`src/features/navigation/components/MainDrawerContent.tsx`:

```tsx
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

export function MainDrawerContent({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r border-border bg-background p-4">
        <nav className="flex flex-col gap-2">
          <Link to="/workshops">Workshops</Link>
          <Link to="/settings">Settings</Link>
        </nav>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
```

`src/features/navigation/index.ts`:

```ts
export { MainDrawerContent } from "./components/MainDrawerContent";
```

Wire in `src/routes/MainDrawerNavigator.tsx` — see [creating-route-component.md](./creating-route-component.md).

### Stack-style header in a section layout

`src/features/navigation/components/ProfileStackHeader.tsx`:

```tsx
import type { ReactNode } from "react";

export function ProfileStackHeader({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <header className="border-b border-border px-4 py-3">
        <h1 className="text-lg font-semibold">{title}</h1>
      </header>
      {children}
    </div>
  );
}
```

Wire in `src/routes/ProfileStackNavigator.tsx` around `<Outlet />`.

### Feature page imports navigation components directly (exception)

```tsx
import { WorkshopToolbar } from "@/features/navigation";
import { WorkshopListItem } from "./components/WorkshopListItem";

export function WorkshopListPage() {
  return (
    <div>
      <WorkshopToolbar />
      {/* page content */}
    </div>
  );
}
```

Use when toolbar state is owned by the page and route-level wiring would obscure the flow.

## Related

- [creating-route-component.md](./creating-route-component.md) — register pages and wire navigation components in `src/routes/`
- [creating-screen-component.md](./creating-screen-component.md) — feature page components
- [setting-up-theming.md](./setting-up-theming.md) — design tokens for navigation component styling
