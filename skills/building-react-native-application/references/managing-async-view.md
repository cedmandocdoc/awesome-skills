# Managing Async View

## Overview

Use this guide to present **server-backed UI** consistently: initial load, errors, refresh, and pagination. Model the experience with three wrappers—**AsyncView**, **AsyncScrollView**, and **AsyncFlatList**—that share the same state machine and differ only in scroll refresh and list pagination.

For where data fetching lives (TanStack Query, hooks), see [managing-state.md](./managing-state.md). For component shape and `src/ui/` vs features, see [creating-component.md](./creating-component.md) and [placing-component.md](./placing-component.md).

## UI states (async dependency)

| State | Meaning | Typical presentation |
| ----- | ------- | -------------------- |
| **Loading** | No cached data yet; first request in flight | Full-area loader (or custom `loader`); **do not** render `children` |
| **Error** | First request failed; no data to show | Full-area error message + **Try again** (calls `reload` / `refetch`) |
| **Data** | Successful load (may be stale while background refetch runs) | Render `children` (or list `renderItem` content) |
| **Reloading** | User pulled to refresh **or** equivalent; data already on screen | Native pull indicator via `RefreshControl`; **keep showing existing data** |
| **Loading more** | Pagination / infinite scroll loading next page | **AsyncFlatList** only: a **small** `ActivityIndicator` at the bottom of the list; **keep showing existing items** |

Treat **`isReloading`** and **`isLoadingMore`** as overlays on top of the data state, not replacements for the whole screen—unless the product explicitly wants a blocking second load (unusual).

## Shared behavior (all three components)

1. **Initial loading** — While `isLoading` is true and there is no successful data yet, show only the initial loader (default centered `ActivityIndicator` or the optional `loader` prop). Do not mount meaningful `children` / list data rows for the main query.
2. **Initial error** — If the first load fails, show only the error UI with a **Try again** control wired to `reload` (or the same function the query uses for `refetch`).
3. **Data** — When data is available, render `children` (**AsyncView** / **AsyncScrollView**) or the list’s normal rendering (**AsyncFlatList**).
4. **Inherited props** — Forward remaining props to the underlying primitive: `View` (**AsyncView**), `ScrollView` (**AsyncScrollView**), `FlatList` (**AsyncFlatList**).

## Suggested props

Names are suggestions; align with your codebase. Map booleans from TanStack Query as in [TanStack Query mapping](#tanstack-query-mapping) below.

| Prop | Role |
| ---- | ---- |
| `isLoading` | True during **initial** load (no data yet). |
| `error` | Truthy when the **initial** load failed (Error object, message string, or boolean—pick one convention project-wide). |
| `reload` | Retry after error; also used as `RefreshControl` `onRefresh` on **AsyncScrollView** / **AsyncFlatList**. |
| `isReloading` | True while pull-to-refresh is in flight (scroll/list variants). Ignored by **AsyncView** for UI unless you add an optional subtle indicator. |
| `loader` | Optional custom node for **initial** loading only (replaces default spinner layout). |
| `isLoadingMore` | (**AsyncFlatList** only.) True while the next page is loading. |
| `loadMore` | (**AsyncFlatList** only.) Called from the list’s **`onEndReached`** to fetch the next page (e.g. `fetchNextPage`). Guard idempotency in the hook (no `hasNextPage`, debounce, etc.). |
| `...props` | Passed through to `View`, `ScrollView`, or `FlatList` (`style`, `className`, `contentContainerStyle`, `data`, `renderItem`, etc.). |

### TanStack Query mapping

Use these assignments when wiring an `useQuery` / `useInfiniteQuery` result into the async wrappers:

| Prop | Source |
| ---- | ------ |
| `isLoading` | `query.isLoading` |
| `isReloading` | `query.isRefetching` |
| `isLoadingMore` | `query.isFetchingNextPage` (**infinite query**; **AsyncFlatList** only — property does not exist on a plain `useQuery` result) |

## AsyncView

**Use when:** one-off or non-scroll content (forms headers, dashboards, static layouts) where pull-to-refresh is not desired.

- **No pull-to-refresh.** There is no `isReloading` UI pattern from the user gesture; only **initial error** + **Try again**.
- If a background refetch runs while data is on screen, either do nothing visually or use a minimal non-blocking hint (optional; not required by this pattern).
- Compose screen content as `children` inside the wrapper once `isLoading` is false and `error` is clear.

```tsx
import type { ComponentProps, ReactNode } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

interface AsyncViewProps extends ComponentProps<typeof View> {
  isLoading: boolean;
  error: unknown;
  reload: () => void;
  loader?: ReactNode;
  children: ReactNode;
}

export function AsyncView({
  isLoading,
  error,
  reload,
  loader,
  children,
  ...viewProps
}: AsyncViewProps) {
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center" {...viewProps}>
        {loader ?? <ActivityIndicator />}
      </View>
    );
  }
  if (error) {
    return (
      <View
        className="flex-1 items-center justify-center gap-4 p-4"
        {...viewProps}
      >
        <Text className="text-center text-destructive">Something went wrong.</Text>
        <Pressable onPress={reload}>
          <Text className="font-semibold text-primary">Try again</Text>
        </Pressable>
      </View>
    );
  }
  return <View {...viewProps}>{children}</View>;
}
```

## AsyncScrollView

**Use when:** scrollable content should support **pull-to-refresh**.

- Wrap a `ScrollView` (or project primitive that exposes the same API).
- Attach React Native **`RefreshControl`**: `refreshing={isReloading}`, `onRefresh={reload}` (or a thin wrapper that calls `reload`).
- **Reload error handling** — If refresh fails, **do not** swap the screen to the full error state; keep showing the last successful `children`. Optionally log or toast; the default per this guide is to **ignore** refresh failure for the main layout.
- Initial load and initial error behave like the shared rules above.

```tsx
import type { ComponentProps, ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

interface AsyncScrollViewProps extends ComponentProps<typeof ScrollView> {
  isLoading: boolean;
  isReloading: boolean;
  reload: () => void;
  error: unknown;
  loader?: ReactNode;
  children: ReactNode;
}

export function AsyncScrollView({
  isLoading,
  isReloading,
  reload,
  error,
  loader,
  children,
  refreshControl,
  ...scrollProps
}: AsyncScrollViewProps) {
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        {loader ?? <ActivityIndicator />}
      </View>
    );
  }
  if (error) {
    return (
      <View className="flex-1 items-center justify-center gap-4 p-4">
        <Text className="text-center text-destructive">Something went wrong.</Text>
        <Pressable onPress={reload}>
          <Text className="font-semibold text-primary">Try again</Text>
        </Pressable>
      </View>
    );
  }
  return (
    <ScrollView
      {...scrollProps}
      refreshControl={
        refreshControl ?? (
          <RefreshControl refreshing={isReloading} onRefresh={reload} />
        )
      }
    >
      {children}
    </ScrollView>
  );
}
```

## AsyncFlatList

**Use when:** long lists, virtualization, and optional **infinite scroll**.

- Same **RefreshControl** rules as **AsyncScrollView**: `isReloading` + `reload`; **ignore** refresh failure for full-screen error UI.
- **`loadMore`** — Required for pagination: the wrapper calls it from **`onEndReached`** (after any caller-supplied `onEndReached`). Implement with `fetchNextPage` (or equivalent) and guard in the hook (`hasNextPage`, in-flight flags, etc.).
- **`isLoadingMore`** — When true, show a **compact** footer: centered **`ActivityIndicator`** with `size="small"` (and minimal vertical padding). Do not clear the list.
- Pass FlatList-specific props through `...props` (`data`, `renderItem`, `keyExtractor`, etc.). You may still pass your own `onEndReached`; it runs **before** `loadMore`.

```tsx
import type { ComponentProps, ReactElement, ReactNode } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";

interface AsyncFlatListProps<T>
  extends Omit<
    ComponentProps<typeof FlatList<T>>,
    "ListFooterComponent" | "onEndReached" | "onEndReachedThreshold"
  > {
  isLoading: boolean;
  isReloading: boolean;
  isLoadingMore: boolean;
  loadMore: () => void;
  reload: () => void;
  error: unknown;
  loader?: ReactNode;
  onEndReached?: ComponentProps<typeof FlatList<T>>["onEndReached"];
  onEndReachedThreshold?: number;
  ListFooterComponent?:
    | ComponentProps<typeof FlatList<T>>["ListFooterComponent"]
    | ReactElement
    | null;
}

export function AsyncFlatList<T>({
  isLoading,
  isReloading,
  isLoadingMore,
  loadMore,
  reload,
  error,
  loader,
  ListFooterComponent,
  refreshControl,
  onEndReached,
  onEndReachedThreshold = 0.2,
  ...flatListProps
}: AsyncFlatListProps<T>) {
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        {loader ?? <ActivityIndicator />}
      </View>
    );
  }
  if (error) {
    return (
      <View className="flex-1 items-center justify-center gap-4 p-4">
        <Text className="text-center text-destructive">Something went wrong.</Text>
        <Pressable onPress={reload}>
          <Text className="font-semibold text-primary">Try again</Text>
        </Pressable>
      </View>
    );
  }
  const footer = isLoadingMore ? (
    <View className="items-center py-2">
      <ActivityIndicator size="small" />
    </View>
  ) : (
    ListFooterComponent
  );
  return (
    <FlatList
      {...flatListProps}
      onEndReachedThreshold={onEndReachedThreshold}
      onEndReached={(info) => {
        onEndReached?.(info);
        loadMore();
      }}
      refreshControl={
        refreshControl ?? (
          <RefreshControl refreshing={isReloading} onRefresh={reload} />
        )
      }
      ListFooterComponent={footer}
    />
  );
}
```

If the caller passes a custom `ListFooterComponent`, merge with `isLoadingMore` so both can appear (for example render a fragment or column with the caller footer above the small spinner).

## Checklist

- [ ] Initial load: only loader or `loader`, no main content.
- [ ] Initial error: full-area error + Try again → `reload`.
- [ ] Data: `children` or list items visible.
- [ ] **AsyncScrollView** / **AsyncFlatList**: `RefreshControl` with `isReloading` / `reload`; refresh errors do not replace the data UI.
- [ ] **AsyncFlatList**: `loadMore` from `onEndReached`; small bottom indicator when `isLoadingMore`; list stays visible.
- [ ] **AsyncView**: no pull-to-refresh; error recovery via Try again only.
