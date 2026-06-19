# Creating Route Component

## Overview

Create the **route layer** under `src/routes/`: file-based route modules that register screen/page components from features and wire navigation components from `src/features/navigation/`.

Each route entry configures a **screen and/or navigation**:

| Configures | Source | Guide |
| --- | --- | --- |
| Screen / page UI | `src/features/<feature-name>/*Page.tsx` | [creating-screen-component.md](./creating-screen-component.md) |
| Layout navigation components (sidebar, shell, sub-nav) | `src/features/navigation/` | [creating-navigation-component.md](./creating-navigation-component.md) |

Keep route files thin — URL structure, layouts, loaders, and wiring only. Domain UI stays in features.

## Prerequisites

- [managing-project-structure.md](./managing-project-structure.md)
- [creating-screen-component.md](./creating-screen-component.md)
- [creating-navigation-component.md](./creating-navigation-component.md) — when wiring shared layout navigation components
- [TanStack Router — Installation with Vite](https://tanstack.com/router/latest/docs/installation/with-vite.md)

## Guidelines

### Structure

Default plugin layout (adjust only if you change plugin options):

```text
src/routes/
├── __root.tsx              # root layout; may wire app shell from features/navigation
├── index.tsx               # example: /
├── _authenticated/         # nested layout segment
│   ├── route.tsx           # layout route — wires navigation components + <Outlet />
│   └── workshops/
│       └── index.tsx       # leaf — registers feature page
└── ...
src/routeTree.gen.ts        # generated from src/routes/
```

- Add route modules under `src/routes/` using TanStack Router file-based conventions.
- Import screen/page exports from `@/features/<feature-name>`; import navigation components from `@/features/navigation`.
- Use **path params** and **search params** with typed validation when URLs should be shareable (see Router docs).

### Route responsibilities

- Register the feature screen/page as the route `component`.
- Wire layout navigation components in layout routes (`route.tsx`) — sidebars, sub-nav, persistent shell around `<Outlet />`.
- Own loaders, pending/error boundaries, and search-param validation when the route needs them.
- Do not embed domain logic or reusable UI blocks — extract to features.

### Wiring navigation components

- **Default:** import navigation components from `@/features/navigation` in a layout route and render it around `<Outlet />`.
- **Exception:** when route-level wiring is too complex (dynamic navigation components per nested state, tight coupling to screen data), compose navigation components directly in the feature screen/page — see [creating-navigation-component.md](./creating-navigation-component.md).

### Plugin setup

1. Install `@tanstack/router-plugin` (and router packages per the official guide).
2. Register `tanstackRouter` **before** `@vitejs/plugin-react` in `vite.config.ts`, with `target: 'react'` and options such as `autoCodeSplitting: true` as needed.

See the full snippet in [Installation with Vite](https://tanstack.com/router/latest/docs/installation/with-vite.md).

### Generated route tree

- `routeTree.gen.ts` is **generated** from `src/routes/`; change route modules, not this file.
- **Lint / format ignore:** exclude it from ESLint and Prettier (or Biome). See [linting.md](./linting.md).
- **VS Code:** optionally mark the file readonly and exclude from search/watch for quieter diffs after renames.

### Choosing layout patterns

| Pattern | Use it when |
| --- | --- |
| **Root layout** | Shared shell: html/body class, devtools, providers that wrap all routes |
| **Nested layout** | Navigation components: sidebars, sub-nav, persistent UI around child paths |
| **Index + siblings** | Peer URLs at the same segment; use folder `route.tsx` layouts as needed |

Refer to [Routing concepts](https://tanstack.com/router/latest/docs/routing/routing-concepts.md) for path syntax, splats, and layout routes.

## Setup

### Install packages

Follow the router's installation guide for `@tanstack/react-router` and the Vite plugin versions compatible with your app.

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

Adjust to match the current TanStack Router API for your version.

## Examples

### Leaf route — register a feature page

`src/routes/workshops/index.tsx`:

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { WorkshopListPage } from "@/features/workshop-list";

export const Route = createFileRoute("/workshops/")({
  component: WorkshopListPage,
});
```

### Layout route — wire navigation components

`src/routes/_authenticated/route.tsx`:

```tsx
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/features/navigation";

export const Route = createFileRoute("/_authenticated")({
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
});
```

### Navigate from a component

Use `Link`, `useNavigate`, and related APIs from `@tanstack/react-router`. Prefer typed route APIs when the project enables them.

```tsx
import { Link } from "@tanstack/react-router";

export function WorkshopCta({ id }: { id: string }) {
  return <Link to="/workshops/$workshopId" params={{ workshopId: id }}>Open</Link>;
}
```

## Related

- [creating-screen-component.md](./creating-screen-component.md) — feature page components
- [creating-navigation-component.md](./creating-navigation-component.md) — shared layout navigation components
- [creating-feature.md](./creating-feature.md) — feature module barrels
