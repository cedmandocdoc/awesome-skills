# Creating Page

## Overview

Pages, feature components, the file-based route layer that maps URLs to them, and the navigation components layout routes wrap around their children.

## Prerequisites

- [managing-project-structure.md](./managing-project-structure.md) — layers, naming, barrels

## Guidelines

### Route files

Prefer flat route files in `src/routes/`; the filename defines the path.

| Filename | URL path | Role |
| --- | --- | --- |
| `__root.tsx` | — | Root layout (required) |
| `index.tsx` | `/` | Home |
| `dashboard.tsx` | `/dashboard` | Leaf page |
| `workshops.tsx` | `/workshops` | Layout route for dotted children |
| `workshops.$workshopId.tsx` | `/workshops/$workshopId` | Dynamic segment |
| `_app.tsx` | — | Pathless layout (no URL segment) |
| `_app.dashboard.tsx` | `/dashboard` | Page under the `_app` layout |

| Token | Meaning |
| --- | --- |
| `.` | Nests under the segment before the dot |
| `_` prefix | Pathless layout: wraps children without a URL segment |
| `$` | Dynamic param |
| `_` suffix | Breaks out of the parent layout (uncommon) |

A section whose flat names grow long becomes a directory with `route.tsx`; mix both where each section reads clearest.

- Each route file exports `Route` from `createFileRoute(...)`; a leaf route's `component` is the feature page.
- Route files hold URL mapping, layouts, loaders, `pendingComponent`, `errorComponent`, and search-param validation (`validateSearch` with Zod); domain logic stays in features.
- `src/routeTree.gen.ts` is generated from `src/routes/`.

| Pattern | Route file | Use when |
| --- | --- | --- |
| Root layout | `__root.tsx` | Document class, devtools, providers |
| Pathless layout | `_app.tsx` + `_app.*.tsx` | Shell or auth guard without a URL prefix |
| Pathful section | `settings.tsx` + `settings.*.tsx` | A URL prefix shares persistent navigation |
| Leaf page | `dashboard.tsx` | Single URL, no child routes |

### Pages

- `src/features/<feature>/components/<Feature>Page.tsx`, exported from the feature barrel.
- Route-ready: the page reads its params with `getRouteApi("<route id>")`, never by importing the route file.
- Composes feature components and `@/ui/*` primitives; wires query hooks and mutations for its flow.
- Server-backed content renders through [creating-async-component.md](./creating-async-component.md).

### Feature components

- Live in `src/features/<feature>/components/`; may hold feature logic, hooks, and event handlers.
- Split a recurring rendering block into a named feature component when it clarifies the tree.

### Navigation components

- Live in `src/features/navigation/` (`components/`, `hooks/`).
- Built once and rendered by the layout route around `<Outlet />`; pages never copy shell, sidebar, or header markup.
- Nav items, icons, labels, and typed `Link`s live inside the component.
- Exception: a page imports a navigation component directly when it depends on page-local state that layout wiring would obscure.

Name each component after its layout route segment (leading `_` dropped) plus its role:

| Layout route | Component |
| --- | --- |
| `_app.tsx` | `AppShell`, `AppSidebar` |
| `main.tsx` | `MainShell`, `MainSidebar` |
| `settings.tsx` | `SettingsHeader`, `SettingsTabBar` |

## Examples

### Pathless layout with a shell

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

### Leaf route with a param

```tsx
// src/routes/_app.workshops.$workshopId.tsx — URL: /workshops/$workshopId
import { createFileRoute } from "@tanstack/react-router";
import { WorkshopDetailPage } from "@/features/workshop-detail";

export const Route = createFileRoute("/_app/workshops/$workshopId")({
  component: WorkshopDetailPage,
});
```

### Route-ready page

```tsx
import { getRouteApi } from "@tanstack/react-router";
import { AsyncView } from "@/ui/Async";
import { useWorkshop } from "../hooks/useWorkshop";
import { WorkshopSummary } from "./WorkshopSummary";

const route = getRouteApi("/_app/workshops/$workshopId");

export function WorkshopDetailPage() {
  const { workshopId } = route.useParams();
  const workshop = useWorkshop(workshopId);

  return (
    <AsyncView queries={[workshop]}>
      {workshop.data ? <WorkshopSummary workshop={workshop.data} /> : null}
    </AsyncView>
  );
}
```

### Typed link

```tsx
<Link to="/workshops/$workshopId" params={{ workshopId: id }}>
  Open
</Link>
```

## References

- [TanStack Router — File-based routing](https://tanstack.com/router/latest/docs/routing/file-based-routing.md)
- [TanStack Router — File naming conventions](https://tanstack.com/router/latest/docs/framework/react/routing/file-naming-conventions)
