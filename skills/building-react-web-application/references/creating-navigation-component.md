# Creating Navigation Component

## Overview

Create **reusable navigation components** in `src/features/navigation/` — app shells, sidebars, section headers, tab bars, and related hooks. These components are consumed from layout route files in `src/routes/` by default; other features may import them when route-level wiring is impractical.

This module is **navigation infrastructure**, not a user-facing product feature. Import via `@/features/navigation`.

Start from [creating-component.md](./creating-component.md). For wiring in route files, see [creating-route-component.md](./creating-route-component.md).

## Prerequisites

- [creating-ui-component.md](./creating-ui-component.md) — when the navigation component is a reusable primitive
- [creating-route-component.md](./creating-route-component.md) — default wiring in `src/routes/`
- [creating-screen-component.md](./creating-screen-component.md) — route-facing pages (navigation components stay out of page trees by default)

## Naming

Derive the component name from the **layout route segment** in `src/routes/` (see [creating-route-component.md](./creating-route-component.md#file-naming--url-structure)). Use the segment label (drop leading `_`) plus the layout role:

| Layout route file | Navigation component |
| --- | --- |
| `_app.tsx` | `AppShell`, `AppSidebar` |
| `main.tsx` | `MainShell`, `MainSidebar` |
| `settings.tsx` | `SettingsHeader` |
| `profile.tsx` | `ProfileHeader` |

- **App-wide pathless shell:** `AppShell` or `AppSidebar` for `_app.tsx`.
- **Pathful section shell:** `[Section]Shell` or `[Section]Sidebar` — e.g. `main.tsx` → `MainShell`.
- **Section header:** `[Section]Header` — e.g. `settings.tsx` → `SettingsHeader`.
- **Tab-style sub-nav:** `[Section]TabBar` when a layout owns peer tabs at the same depth.
- Hooks: `useAppShell`, `useMainSidebar` — live in `src/features/navigation/hooks/`.
- Use one layout-scoped component per slot instead of per-page duplicates.

## Guidelines

### Prefer whole navigation components

**Default:** replace the entire layout navigation surface with a custom component. Keep nav items, icons, labels, and spacing inside that component so navigation UI changes stay in one place.

Whether to use a custom navigation component at all depends on the prompt; when unspecified, **use custom navigation components**.

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

| Piece | Location |
| --- | --- |
| Shared layout / navigation components | `src/features/navigation/components/` |
| Navigation-related hooks | `src/features/navigation/hooks/` |
| Generic presentation-only primitives | `src/ui/` when not navigation-specific |
| Page body | `src/features/<feature-name>/components/*Page.tsx` |

Promote a component to `src/ui/` only when it is reused outside navigation and carries no route-specific wiring.

### Default path — wire from route files

- Build navigation components once in `src/features/navigation/`.
- Import and wire the whole component in the **layout route file** (`_app.tsx`, `main.tsx`, etc.) — see [creating-route-component.md](./creating-route-component.md).
- Keep page components focused on feature UI.

### Exception — compose in a feature page

When layout wiring is too complex (dynamic chrome driven by page-local state, tight coupling between navigation and page data), import navigation components directly in the feature page. Prefer this only when `src/routes/` wiring would be harder to follow than localized composition.

### Layout navigation components (web)

- **App shell / sidebar / tab bar:** structural wrappers rendered in layout routes around `<Outlet />`.
- Accept children for the main content area; keep URL and outlet wiring in `src/routes/`.
- Put all nav items, icons, labels, and spacing inside the custom navigation component.
- Reuse across routes via pathless (`_app.*`) or pathful (`main.*`) layout segments.

### What to avoid

- Copying the same header, sidebar, tab bar, or shell JSX into every feature page.
- Putting domain business logic in navigation components — navigation components are presentation and layout.
- Naming components after React Navigation navigator types (`MainDrawerNavigator`, `ProfileStackNavigator`).

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

`src/features/navigation/index.ts`:

```ts
export { AppShell } from "./components/AppShell";
```

Wire in `src/routes/_app.tsx` — see [creating-route-component.md](./creating-route-component.md#pathless-layout--authenticated-app-shell).

### Section header in a pathful layout

`src/features/navigation/components/SettingsHeader.tsx`:

```tsx
import type { ReactNode } from "react";

export function SettingsHeader({
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

Wire in `src/routes/settings.tsx` around `<Outlet />`.

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

Use when toolbar state is owned by the page and layout wiring would obscure the flow.

## Related

- [creating-route-component.md](./creating-route-component.md) — file-based routes and layout wiring
- [creating-screen-component.md](./creating-screen-component.md) — feature page components
- [setting-up-theming.md](./setting-up-theming.md) — design tokens for navigation component styling
