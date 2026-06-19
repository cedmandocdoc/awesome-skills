# Creating Navigation Component

## Overview

Create **reusable navigation components** in `src/features/navigation/` — shared headers, tab icons, drawer content, app shells, sidebars, and related hooks. These components are consumed from `src/routes/` by default; other features may import them when route-level wiring is impractical.

This module is **navigation infrastructure**, not a user-facing product feature. Import via `@/features/navigation`.

Start from [creating-component.md](./creating-component.md). For wiring navigation components in route modules, see [creating-route-component.md](./creating-route-component.md).

## Prerequisites

- [creating-ui-component.md](./creating-ui-component.md) — when the navigation component is a reusable primitive
- [creating-route-component.md](./creating-route-component.md) — default wiring in `src/routes/`
- [creating-screen-component.md](./creating-screen-component.md) — route-facing screens (navigation components stay out of screen trees by default)

## Naming

- Prefix shared navigation components with **`App`** or the navigator scope: `AppHeader`, `AppShell`, `AppSidebar`, `AppDrawerContent`.
- Tab icon renderers: `HomeTabIcon`, `SettingsTabIcon` — or a single `TabBarIcon` with a `route` prop.
- Hooks: `useNavigationHeader`, `useTabBarOptions` — live in `src/features/navigation/hooks/`.
- Do not duplicate screen-local headers when one shared component suffices.

## Guidelines

### Placement

```text
src/features/navigation/
├── components/
│   ├── AppShell.tsx
│   ├── AppSidebar.tsx
│   └── AppHeader.tsx
├── hooks/
│   └── useNavigationHeader.ts
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
- Import and wire it from layout routes in `src/routes/` — see [creating-route-component.md](./creating-route-component.md).
- Keep screen/page components focused on feature UI.

### Exception — compose in a feature screen

When route-level wiring is too complex (dynamic navigation components driven by screen-local state, tight coupling between navigation components and page data), import navigation components directly in the feature screen/page. Prefer this only when `src/routes/` wiring would be harder to follow than localized composition.

### Layout navigation components (web)

- **App shell / sidebar:** structural wrappers rendered in layout routes around `<Outlet />`.
- Accept children for the main content area; keep URL and outlet wiring in `src/routes/`.
- Reuse across route sections via nested layout routes, not per-page duplication.

### What to avoid

- Copying the same header, sidebar, or shell JSX into every feature page.
- Putting domain business logic in navigation components — navigation components are presentation and layout.

## Examples

### App shell wired in a layout route

`src/features/navigation/components/AppShell.tsx`:

```tsx
import type { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
```

`src/features/navigation/index.ts`:

```ts
export { AppShell } from "./components/AppShell";
export { AppSidebar } from "./components/AppSidebar";
```

Wire in `src/routes/_authenticated/route.tsx` — see [creating-route-component.md](./creating-route-component.md).

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
