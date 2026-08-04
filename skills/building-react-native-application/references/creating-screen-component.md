# Creating Screen Component

## Overview

Create route-facing screen components exported from a feature module and registered in `src/routes/`. Screens own feature UI composition and may read route params; route modules stay thin.

## Prerequisites

- [creating-component.md](./creating-component.md) — placement, shared rules, naming baseline
- [creating-feature.md](./creating-feature.md) — barrels and export contract
- [creating-feature-component.md](./creating-feature-component.md) — smaller blocks inside the screen
- [creating-route-component.md](./creating-route-component.md) — static `screens` registration

## Guidelines

### Responsibilities

- Compose sibling feature components and `@/ui/*` primitives for the route's UI.
- Read route params with React Navigation hooks when needed (`useRoute`, typed params).
- Wire TanStack Query hooks, mutations, and feature stores for this flow.
- Keep route registration a one-line import of the exported screen.

### Navigation components

Prefer navigation components from `src/features/navigation/` wired via `src/routes/` per [creating-navigation-component.md](./creating-navigation-component.md). Inline only when localized composition is clearer.

### Size and structure

- Extract sub-trees to sibling feature components when the file grows.
- Async list/content wrappers: [creating-async-component.md](./creating-async-component.md).

### Placement

```text
src/features/<feature>/components/<Feature>Screen.tsx
src/features/<feature>/components/<Feature>Layout.tsx   # shared layout wrappers
```

### Naming

| Suffix | Use |
| --- | --- |
| `Screen` | Route destination: `WorkshopListScreen`, `SettingsScreen` |
| `Layout` | Structural wrapper shared across route entries: `AuthLayout`, `MainLayout` |

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

- [creating-route-component.md](./creating-route-component.md) — register screens and wire navigation in `src/routes/`
- [creating-navigation-component.md](./creating-navigation-component.md) — shared header / tab icon components
- [creating-async-component.md](./creating-async-component.md) — loading, error, and list states
