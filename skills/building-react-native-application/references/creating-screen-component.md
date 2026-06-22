# Creating Screen Component

## Overview

Create **route-facing screen components** exported from a feature module and registered in `src/routes/`. Screens own feature UI composition and may read route params; route modules stay thin.

Start from [creating-component.md](./creating-component.md). For feature module structure, see [creating-feature.md](./creating-feature.md).

## Prerequisites

- [creating-feature.md](./creating-feature.md) — barrels and export contract
- [creating-feature-component.md](./creating-feature-component.md) — smaller blocks inside the screen
- [creating-route-component.md](./creating-route-component.md) — static `screens` registration and navigation component wiring

## Placement

Route-facing screen files **always** live under the feature's `components/` folder:

```text
src/features/<feature-name>/components/<Feature>Screen.tsx
```

Examples: `src/features/workshop-list/components/WorkshopListScreen.tsx`, `src/features/settings/components/SettingsScreen.tsx`.

Shared layout wrappers exported from a feature (`AuthLayout`, `MainLayout`) also live in `components/`: `src/features/<feature-name>/components/<Feature>Layout.tsx`.

## Naming

- Use the **`Screen`** suffix for components rendered as a route destination: `WorkshopListScreen`, `SettingsScreen`.
- Use **`Layout`** for structural wrappers shared across route entries when exported from a feature: `AuthLayout`, `MainLayout`.

## Guidelines

### Screen responsibilities

- Compose sibling feature components and `@/ui/*` primitives for the route's UI.
- Read route params with React Navigation hooks when needed (`useRoute`, typed params).
- Wire TanStack Query hooks, mutations, and feature stores for this flow.
- Keep route registration in `src/routes/` — one-line import of the exported screen.

### What to avoid

- Duplicating header, tab bar, or drawer navigation components inside the screen tree — wire from `src/routes/` via `@/features/navigation` per [creating-navigation-component.md](./creating-navigation-component.md), unless localized composition is clearer.
- Defining reusable presentation-only primitives inline — extract to `src/ui/` or feature components.

### Size and structure

- Keep screens focused; extract sub-trees to sibling feature components in the same `components/` folder when the file grows.
- Async list/content wrappers: [creating-async-component.md](./creating-async-component.md).

## Examples

### Screen exported from feature barrel

`src/features/workshop-list/components/WorkshopListScreen.tsx`:

```tsx
import { AsyncFlatList } from "@/ui/Async";
import { useWorkshops } from "../hooks/useWorkshops";
import { WorkshopListItem } from "./WorkshopListItem";

export function WorkshopListScreen() {
  const workshops = useWorkshops();

  return (
    <AsyncFlatList
      isLoading={workshops.isLoading}
      isReloading={workshops.isRefetching}
      isLoadingMore={workshops.isFetchingNextPage}
      loadMore={() => void workshops.fetchNextPage()}
      reload={() => void workshops.refetch()}
      error={workshops.isError ? workshops.error : undefined}
      data={workshops.data?.pages.flatMap((p) => p.items) ?? []}
      renderItem={({ item }) => <WorkshopListItem workshop={item} />}
      keyExtractor={(item) => item.id}
    />
  );
}
```

`src/features/workshop-list/index.ts`:

```ts
export { WorkshopListScreen } from "./components/WorkshopListScreen";
export { useWorkshops } from "./hooks/useWorkshops";
```

`src/routes/MainStack.tsx`:

```tsx
import { WorkshopListScreen } from "@/features/workshop-list";

screens: {
  Workshops: WorkshopListScreen,
},
```

## Related

- [creating-route-component.md](./creating-route-component.md) — register screens and wire navigation components in `src/routes/`
- [creating-navigation-component.md](./creating-navigation-component.md) — shared header / tab icon components
- [creating-async-component.md](./creating-async-component.md) — loading, error, and list states in screens
