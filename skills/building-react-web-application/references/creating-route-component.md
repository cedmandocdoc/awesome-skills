# Creating Route Component

## Overview

**Execution mode.** Creates the **route layer** under `src/routes/` using TanStack Router **file-based routing**. Each route file maps a URL to a feature page and optionally wraps children in a layout with navigation from `src/features/navigation/`. Keep route files thin — URL mapping, layouts, loaders, and wiring only.

## Prerequisites

- [managing-project-structure.md](./managing-project-structure.md)
- [creating-screen-component.md](./creating-screen-component.md) — `src/features/<feature-name>/components/*Page.tsx`
- [creating-navigation-component.md](./creating-navigation-component.md) — shells, sidebars, headers
- [TanStack Router — File naming conventions](https://tanstack.com/router/latest/docs/framework/react/routing/file-naming-conventions)

## Guidelines

### File naming = URL structure

Prefer **flat route files** in `src/routes/`. The filename (without extension) defines the route path.

| Filename | URL path | Role |
| --- | --- | --- |
| `__root.tsx` | — | Root layout (required) |
| `index.tsx` | `/` | Home / landing |
| `dashboard.tsx` | `/dashboard` | Leaf page |
| `workshops.tsx` | `/workshops` | Layout route (parent for dotted children) |
| `workshops.$workshopId.tsx` | `/workshops/$workshopId` | Dynamic segment |
| `main.dashboard.tsx` | `/main/dashboard` | Child of `main` layout |
| `_app.tsx` | — | Pathless layout (no URL segment) |
| `_app.dashboard.tsx` | `/dashboard` | Page under `_app` pathless shell |

| Token | Meaning |
| --- | --- |
| `.` (dot) | Nests under the segment before the dot |
| `_` prefix | Pathless layout — wraps children without adding a URL segment |
| `$` | Dynamic param |
| `_` suffix | Breaks out of parent layout nesting (uncommon) |

| Approach | Use when |
| --- | --- |
| **Flat files** (preferred) | Most routes; filename reads like the URL |
| **Directory + `route.tsx`** | A section has many siblings and flat names get long |
| **Mixed** | Combine both where each section is clearest |

### Structure

```text
src/routes/
├── __root.tsx
├── index.tsx
├── login.tsx
├── _app.tsx
├── _app.dashboard.tsx
├── _app.workshops.tsx
├── _app.workshops.$workshopId.tsx
├── settings.tsx
├── settings.profile.tsx
└── settings.notifications.tsx
src/routeTree.gen.ts   # generated — do not edit
```

- Import pages from `@/features/<feature-name>`; import layout navigation from `@/features/navigation`.
- Use typed **path params** and **search params** when URLs should be shareable.
- Export `Route` via `createFileRoute(...)`; set `component` to the feature page for leaf routes.
- Own loaders, `pendingComponent`, `errorComponent`, and search-param validation when needed.
- `routeTree.gen.ts` is generated — edit route modules, not this file. Exclude from ESLint/Prettier per [managing-linting.md](./managing-linting.md).

### Wiring navigation

Import whole navigation components from `@/features/navigation` in the layout route and render around `<Outlet />`. Naming, placement, and exceptions: [creating-navigation-component.md](./creating-navigation-component.md).

| Layout route | Navigation component | Wraps |
| --- | --- | --- |
| `_app.tsx` | `AppShell`, `AppSidebar` | Authenticated pages |
| `main.tsx` | `MainShell`, `MainSidebar` | `/main/*` |
| `settings.tsx` | `SettingsHeader` | `/settings/*` |

| Pattern | Route file | Use when |
| --- | --- | --- |
| **Root layout** | `__root.tsx` | Document class, devtools, providers |
| **Pathless app shell** | `_app.tsx` + `_app.*.tsx` | Auth gate or shell without a URL prefix |
| **Pathful section** | `main.tsx` + `main.*.tsx` | URL prefix shares persistent chrome |
| **Leaf page** | `dashboard.tsx` | Single URL, no child routes |
| **Dynamic segment** | `workshops.$workshopId.tsx` | IDs in the path |

### Plugin setup

Register `tanstackRouter` **before** `@vitejs/plugin-react` in `vite.config.ts` with `routesDirectory: 'src/routes'` and `target: 'react'`. See [Installation with Vite](https://tanstack.com/router/latest/docs/framework/react/installation/with-vite).

## Setup

Install `@tanstack/react-router` and `@tanstack/router-plugin` versions compatible with the app. After `QueryClientProvider` (if used), render `RouterProvider` with the generated route tree:

```tsx
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function AppRouter() {
  return <RouterProvider router={router} />;
}
```

## Examples

### Leaf route

```tsx
// src/routes/login.tsx
import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/features/auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});
```

### Pathless layout

```tsx
// src/routes/_app.tsx
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/features/navigation";

export const Route = createFileRoute("/_app")({
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
});
```

```tsx
// src/routes/_app.dashboard.tsx — URL: /dashboard
import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/features/dashboard";

export const Route = createFileRoute("/_app/dashboard")({
  component: DashboardPage,
});
```

### Pathful layout

```tsx
// src/routes/settings.tsx
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SettingsHeader } from "@/features/navigation";

export const Route = createFileRoute("/settings")({
  component: () => (
    <SettingsHeader title="Settings">
      <Outlet />
    </SettingsHeader>
  ),
});
```

### Dynamic param

```tsx
// src/routes/_app.workshops.$workshopId.tsx
import { createFileRoute } from "@tanstack/react-router";
import { WorkshopDetailPage } from "@/features/workshop-detail";

export const Route = createFileRoute("/_app/workshops/$workshopId")({
  component: WorkshopDetailPage,
});
```

Read params with `Route.useParams()` or `useParams({ from: "/_app/workshops/$workshopId" })`.

### Typed Link

```tsx
import { Link } from "@tanstack/react-router";

export function WorkshopCta({ id }: { id: string }) {
  return (
    <Link to="/workshops/$workshopId" params={{ workshopId: id }}>
      Open
    </Link>
  );
}
```

## Related

- [creating-screen-component.md](./creating-screen-component.md)
- [creating-navigation-component.md](./creating-navigation-component.md)
- [creating-feature.md](./creating-feature.md)
