# Creating Navigation Component

## Overview

**Execution mode.** Create reusable navigation components in `src/features/navigation/` — app shells, sidebars, section headers, tab bars, and related hooks. Wire from layout route files in `src/routes/` by default.

Import via `@/features/navigation`. Start from [creating-component.md → Decision tree](./creating-component.md#decision-tree).

## Prerequisites

- [creating-route-component.md](./creating-route-component.md) — default wiring in `src/routes/`

## Guidelines

### Prefer whole navigation components

Replace the entire layout navigation surface with a custom component. Keep nav items, icons, labels, and spacing inside so navigation UI changes stay in one place.

| Layout route | Component | Wire in |
| --- | --- | --- |
| Pathless app shell (`_app.tsx`) | `AppShell` / `AppSidebar` | `_app.tsx` around `<Outlet />` |
| Pathful section (`main.tsx`) | `MainShell` / `MainSidebar` | `main.tsx` around `<Outlet />` |
| Section header layout | `[Section]Header` | Section layout route around `<Outlet />` |
| Tab-style sub-nav | `[Section]TabBar` | Layout route around child `<Outlet />` |

### Placement

```text
src/features/navigation/
├── components/
│   ├── AppShell.tsx
│   ├── AppSidebar.tsx
│   ├── MainShell.tsx
│   └── SettingsHeader.tsx
├── hooks/
│   └── useAppShell.ts
└── index.ts
```

Promote to `src/ui/` only when reused outside navigation and carrying no route-specific wiring.

### Default path — wire from route files

- Build navigation components once in `src/features/navigation/`.
- Import and wire the whole component in the layout route file (`_app.tsx`, `main.tsx`, etc.) — see [creating-route-component.md](./creating-route-component.md).

### Exception — compose in a feature page

Import navigation components directly in a feature page only when layout wiring would be harder to follow (dynamic chrome driven by page-local state, tight coupling between nav and page data).

### Naming

Derive from the layout route segment (drop leading `_`) plus the layout role:

| Layout route file | Navigation component |
| --- | --- |
| `_app.tsx` | `AppShell`, `AppSidebar` |
| `main.tsx` | `MainShell`, `MainSidebar` |
| `settings.tsx` | `SettingsHeader` |
| `profile.tsx` | `ProfileHeader` |

- Tab-style sub-nav: `[Section]TabBar`.
- Hooks: `useAppShell`, `useMainSidebar` — live in `src/features/navigation/hooks/`.
- Avoid naming after React Navigation navigator types (`MainDrawerNavigator`, `ProfileStackNavigator`).

## Examples

### App shell wired in a pathless layout route

`src/features/navigation/components/AppShell.tsx`:

```tsx
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r border-border bg-background p-4">
        <nav className="flex flex-col gap-2">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/workshops">Workshops</Link>
          <Link to="/settings">Settings</Link>
        </nav>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
```

Wire in `src/routes/_app.tsx` — see [creating-route-component.md](./creating-route-component.md#pathless-layout--authenticated-app-shell).

## Related

- [creating-route-component.md](./creating-route-component.md) — file-based routes and layout wiring
- [creating-screen-component.md](./creating-screen-component.md) — feature page components
