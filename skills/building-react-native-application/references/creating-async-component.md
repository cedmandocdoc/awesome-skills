# Creating Async Component

## Overview

Create and use **AsyncView**, **AsyncScrollView**, and **AsyncFlatList** — server-backed UI wrappers sharing one state machine that differ only in scroll refresh and list pagination. Keep all wrappers under `src/ui/Async/` and export from `src/ui/Async/index.tsx` so screens import `@/ui/Async`.

## Prerequisites

- [creating-component.md](./creating-component.md)
- [managing-state.md](./managing-state.md) — TanStack Query hooks
- [managing-api-error.md](./managing-api-error.md) — error copy

## Guidelines

### Folder placement

```text
src/ui/Async/
  ErrorMessage.tsx    — internal error copy helper
  AsyncView.tsx
  AsyncScrollView.tsx
  AsyncFlatList.tsx
  index.tsx           — re-exports AsyncView, AsyncScrollView, AsyncFlatList
```

- One wrapper per file. Keep small helpers (e.g. `ErrorMessage`) alongside wrappers.
- Export only from the barrel — features import `@/ui/Async`, not individual files.

### UI states

| State | Condition | Presentation |
| --- | --- | --- |
| **Loading** | First request in flight, no cached data | Full-area loader (or custom `loader`); no main content |
| **Error** | First request failed | Full-area message + **Try again** → `reload` |
| **Data** | Successful load (may be stale during refetch) | Render `children` or list items |
| **Reloading** | Pull-to-refresh in flight | `RefreshControl`; keep existing data visible |
| **Loading more** | Next page fetching (AsyncFlatList only) | Footer spinner; keep existing items visible |

Do **not** replace the data UI with the full error state on a failed refresh — show the refresh indicator only.

### Shared behavior

1. While `isLoading`, show only the loader.
2. On `error`, show error UI with **Try again** wired to `reload`.
3. When data is available, render `children` or list content.
4. Forward remaining props to the underlying `View`, `ScrollView`, or `FlatList`.

### Props

| Prop | Role |
| --- | --- |
| `isLoading` | True during initial load (no data yet) |
| `error` | Truthy when initial load failed; pass `query.error` (`ApiError` — use `error.message`) |
| `reload` | Retry after error; also `RefreshControl.onRefresh` on scroll/list variants |
| `isReloading` | Pull-to-refresh in flight (AsyncScrollView / AsyncFlatList) |
| `loader` | Optional custom node for initial loading |
| `isLoadingMore` | (AsyncFlatList only) Next page in flight |
| `loadMore` | (AsyncFlatList only) Called from `onEndReached`; guard in the hook with `hasNextPage` + in-flight flags |

### TanStack Query mapping

| Prop | Source |
| --- | --- |
| `isLoading` | `query.isLoading` |
| `isReloading` | `query.isRefetching` |
| `isLoadingMore` | `query.isFetchingNextPage` (infinite query only) |

### Wrapper selection

| Wrapper | Use when |
| --- | --- |
| **AsyncView** | Non-scroll content (forms, dashboards). No pull-to-refresh; recovery via Try again only. |
| **AsyncScrollView** | Scrollable content with pull-to-refresh (`RefreshControl` + `isReloading` / `reload`). |
| **AsyncFlatList** | Long lists with virtualization; optional infinite scroll via `loadMore` + `isLoadingMore` footer. |

### AsyncFlatList contract

- Default `onEndReachedThreshold` to `0.2`.
- On `onEndReached`, run the caller’s `onEndReached` (if provided) **before** `loadMore`.
- Own `ListFooterComponent`: when `isLoadingMore`, show a footer spinner; when the caller also passes `ListFooterComponent`, render both (caller footer + loading footer).

### Naming

- Wrapper exports: `AsyncView`, `AsyncScrollView`, `AsyncFlatList`.
- Internal helper: `ErrorMessage` (not exported from public barrel unless needed).
- Do **not** fork the state machine per screen — compose wrappers, share the machine.

## Examples

### Feature screen usage

```tsx
import { AsyncView } from "@/ui/Async";

const workshops = useWorkshops();

return (
  <AsyncView
    isLoading={workshops.isLoading}
    error={workshops.isError ? workshops.error : undefined}
    reload={() => void workshops.refetch()}
  >
    <WorkshopList data={workshops.data} />
  </AsyncView>
);
```

### Infinite list usage

```tsx
import { AsyncFlatList } from "@/ui/Async";

<AsyncFlatList
  isLoading={query.isLoading}
  isReloading={query.isRefetching}
  isLoadingMore={query.isFetchingNextPage}
  loadMore={() => void query.fetchNextPage()}
  reload={() => void query.refetch()}
  error={query.isError ? query.error : undefined}
  data={items}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
/>
```

### Prop signatures (stubs)

```tsx
// AsyncView
interface AsyncViewProps extends ComponentProps<typeof View> {
  isLoading: boolean;
  error: unknown;
  reload: () => void;
  loader?: ReactNode;
  children: ReactNode;
}

// AsyncScrollView — adds isReloading
interface AsyncScrollViewProps extends ComponentProps<typeof ScrollView> {
  isLoading: boolean;
  isReloading: boolean;
  reload: () => void;
  error: unknown;
  loader?: ReactNode;
  children: ReactNode;
}

// AsyncFlatList<T> — adds loadMore + isLoadingMore
interface AsyncFlatListProps<T> extends Omit<ComponentProps<typeof FlatList<T>>, "ListFooterComponent" | "onEndReached" | "onEndReachedThreshold"> {
  isLoading: boolean;
  isReloading: boolean;
  isLoadingMore: boolean;
  loadMore: () => void;
  reload: () => void;
  error: unknown;
  loader?: ReactNode;
}
```

## Related

- [creating-component.md](./creating-component.md)
- [managing-state.md](./managing-state.md)
- [managing-api-error.md](./managing-api-error.md)
