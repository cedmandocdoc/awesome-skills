# Creating Route Component

## Overview

Create the **route layer** under `src/routes/` using TanStack Router **file-based routing**. Each route file maps a URL to a feature page component and optionally wraps child routes in a layout with navigation from `src/features/navigation/`.

| Configures | Source | Guide |
| --- | --- | --- |
| Page UI | `src/features/<feature-name>/components/*Page.tsx` | [creating-screen-component.md](./creating-screen-component.md) |
| Layout navigation (shell, sidebar, header, tab bar) | `src/features/navigation/` | [creating-navigation-component.md](./creating-navigation-component.md) |

Keep route files thin — URL mapping, layouts, loaders, and wiring only. Domain UI stays in features.

## Prerequisites

- [managing-project-structure.md](./managing-project-structure.md)
- [creating-screen-component.md](./creating-screen-component.md)
- [creating-navigation-component.md](./creating-navigation-component.md) — when wiring shared layout navigation
- [TanStack Router — File-based routing](https://tanstack.com/router/latest/docs/framework/react/routing/file-based-routing)
- [TanStack Router — File naming conventions](https://tanstack.com/router/latest/docs/framework/react/routing/file-naming-conventions)
- [TanStack Router — Installation with Vite](https://tanstack.com/router/latest/docs/framework/react/installation/with-vite)

## Guidelines

### File naming = URL structure

**Default:** use **flat route files** in `src/routes/`. The filename (without extension) defines the route path. Prefer this over deep folder trees unless a section has many sibling routes.

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

**Dot (`.`)** — nests under the segment before the dot. `main.dashboard.tsx` is a child of `main.tsx`; URL is `/main/dashboard`, not `/main.dashboard`.

**Underscore prefix (`_`)** — pathless layout. `_app.tsx` wraps children without adding a URL segment. `_app.dashboard.tsx` serves `/dashboard` inside the `_app` shell.

**Dollar (`$`)** — dynamic param. `workshops.$workshopId.tsx` → `/workshops/$workshopId`.

**Index** — `workshops.index.tsx` matches `/workshops` exactly when `workshops.tsx` is also a layout. Prefer `index.tsx` only for `/`; otherwise use a named leaf file (`dashboard.tsx`) or `feature.index.tsx` when a layout sibling is needed.

**Underscore suffix (`_`)** — breaks out of parent layout nesting (uncommon; use when a child route must not inherit a parent layout). Example: `posts_.$postId.edit.tsx` → `/posts/$postId/edit` without the `posts` layout.

See [TanStack Router — File naming conventions](https://tanstack.com/router/latest/docs/framework/react/routing/file-naming-conventions) for full token reference (`-` prefix for colocation, `(group)` folders, etc.).

### Choosing flat vs directory routes

| Approach | Use it when |
| --- | --- |
| **Flat files** (preferred) | Most routes; filename should read like the URL (`dashboard.tsx`, `settings.profile.tsx`) |
| **Directory + `route.tsx`** | A section has many siblings and flat names get long — e.g. `workshops/route.tsx` + `workshops/$workshopId.tsx` |
| **Mixed** | Combine both where each section is clearest — TanStack Router supports mixed trees |

Do **not** use React Navigation-style navigator modules (`MainDrawerNavigator.tsx`, `ProfileStackNavigator.tsx`). Layouts are ordinary route files that render `<Outlet />` and import navigation components from features.

### Structure

Default layout — flat routes with pathless app shell:

```text
src/routes/
├── __root.tsx                      # html/body, devtools, global providers outlet
├── index.tsx                       # /
├── login.tsx                       # /login (public)
├── _app.tsx                        # pathless authenticated shell
├── _app.dashboard.tsx              # /dashboard
├── _app.workshops.tsx              # /workshops (list page or workshops layout)
├── _app.workshops.$workshopId.tsx  # /workshops/$workshopId
├── main.tsx                        # /main pathful layout (optional section)
├── main.dashboard.tsx              # /main/dashboard
└── ...
src/routeTree.gen.ts                # generated — do not edit
```

Pathful section layout example:

```text
src/routes/
├── settings.tsx                    # /settings layout
├── settings.profile.tsx            # /settings/profile
└── settings.notifications.tsx      # /settings/notifications
```

- Add route modules under `src/routes/`; let the Vite plugin generate `routeTree.gen.ts`.
- Import page exports from `@/features/<feature-name>`; import layout navigation from `@/features/navigation`.
- Use typed **path params** and **search params** when URLs should be shareable.

### Route responsibilities

- Export `Route` via `createFileRoute(...)` with the generated route path string.
- Set `component` to the feature page export for leaf routes.
- For layout routes, render navigation components around `<Outlet />`.
- Own loaders, `pendingComponent`, `errorComponent`, and search-param validation when needed.
- Do not embed domain logic or reusable UI — extract to features.

### Wiring navigation components

**Default:** import whole navigation components from `@/features/navigation` in the **layout route file** and render them around `<Outlet />` — see [creating-navigation-component.md](./creating-navigation-component.md#prefer-whole-navigation-components).

| Layout route file | Typical navigation component | Wraps |
| --- | --- | --- |
| `_app.tsx` | `AppShell`, `AppSidebar` | All authenticated pages |
| `main.tsx` | `MainShell`, `MainSidebar` | `/main/*` section |
| `settings.tsx` | `SettingsHeader` | `/settings/*` section |

Name navigation components after the **layout segment** (`_app` → `AppShell`, `main` → `MainShell`), not after React Navigation navigator types.

- **Exception:** when layout wiring is too complex (dynamic chrome driven by page-local state), compose navigation in the feature page — see [creating-navigation-component.md](./creating-navigation-component.md).

### Plugin setup

1. Install `@tanstack/router-plugin` and `@tanstack/react-router` per the official guide.
2. Register `tanstackRouter` **before** `@vitejs/plugin-react` in `vite.config.ts`, with `routesDirectory: 'src/routes'` (default) and `target: 'react'`.

See [Installation with Vite](https://tanstack.com/router/latest/docs/framework/react/installation/with-vite).

### Generated route tree

- `routeTree.gen.ts` is **generated** from `src/routes/`; edit route modules, not this file.
- **Lint / format ignore:** exclude it from ESLint and Prettier (or Biome). See [linting.md](./linting.md).
- **VS Code:** optionally mark the file readonly and exclude from search/watch for quieter diffs after renames.

### Choosing layout patterns

| Pattern | Route file | Use it when |
| --- | --- | --- |
| **Root layout** | `__root.tsx` | Global shell: document class, devtools, providers that wrap all routes |
| **Pathless app shell** | `_app.tsx` + `_app.*.tsx` children | Auth gate, sidebar, or shell around many URLs without a `/_app` prefix |
| **Pathful section layout** | `main.tsx` + `main.*.tsx` | A URL prefix (`/main/...`) shares persistent chrome |
| **Leaf page** | `dashboard.tsx` or `_app.dashboard.tsx` | Single URL with no child routes |
| **Dynamic segment** | `workshops.$workshopId.tsx` | Detail pages, editable IDs in the path |

Refer to [Routing concepts](https://tanstack.com/router/latest/docs/framework/react/routing/routing-concepts) for splats, redirects, and not-found handling.

## Setup

### Install packages

Follow the router installation guide for `@tanstack/react-router` and the Vite plugin versions compatible with your app.

### Render the router at the root

After `QueryClientProvider` (if used), render `RouterProvider` with the generated route tree:

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

Adjust to match the TanStack Router API for your version.

## Examples

### Leaf route — register a feature page

`src/routes/login.tsx`:

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/features/auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});
```

### Pathless layout — authenticated app shell

`src/routes/_app.tsx`:

```tsx
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

`src/routes/_app.dashboard.tsx`:

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/features/dashboard";

export const Route = createFileRoute("/_app/dashboard")({
  component: DashboardPage,
});
```

URL: `/dashboard` (not `/_app/dashboard`). The `_app` segment is pathless.

### Pathful layout — section with shared header

`src/routes/main.tsx`:

```tsx
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { MainShell } from "@/features/navigation";

export const Route = createFileRoute("/main")({
  component: () => (
    <MainShell>
      <Outlet />
    </MainShell>
  ),
});
```

`src/routes/main.dashboard.tsx`:

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/features/dashboard";

export const Route = createFileRoute("/main/dashboard")({
  component: DashboardPage,
});
```

URL: `/main/dashboard`.

### Dynamic param route

`src/routes/_app.workshops.$workshopId.tsx`:

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { WorkshopDetailPage } from "@/features/workshop-detail";

export const Route = createFileRoute("/_app/workshops/$workshopId")({
  component: WorkshopDetailPage,
});
```

Read params in the page with `Route.useParams()` or `useParams({ from: "/_app/workshops/$workshopId" })`.

### Navigate from a component

Use `Link`, `useNavigate`, and typed route APIs from `@tanstack/react-router`.

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

- [creating-screen-component.md](./creating-screen-component.md) — feature page components
- [creating-navigation-component.md](./creating-navigation-component.md) — shared layout navigation components
- [creating-feature.md](./creating-feature.md) — feature module barrels
