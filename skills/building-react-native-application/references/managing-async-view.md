# Managing Async View

## Overview

Use this guide to present **server-backed UI** consistently with three shared wrappers—**AsyncView**, **AsyncScrollView**, and **AsyncFlatList**—that share the same state machine and differ only in scroll refresh and list pagination. Implement them under `src/ui/`; feature screens compose them around TanStack Query results.

For fetching and hooks, see [managing-state.md](./managing-state.md). For error copy, see [managing-api-error.md](./managing-api-error.md). For component placement, see [creating-component.md](./creating-component.md) and [placing-component.md](./placing-component.md).

## Prerequisites

- [managing-state.md](./managing-state.md)
- [managing-api-error.md](./managing-api-error.md)

## Guidelines

### UI states

| State | Meaning | Presentation |
| ----- | ------- | -------------- |
| **Loading** | First request in flight; no cached data | Full-area loader (or custom `loader`); do not render main content |
| **Error** | First request failed | Full-area message + **Try again** → `reload` |
| **Data** | Successful load (may be stale during refetch) | Render `children` or list items |
| **Reloading** | Pull-to-refresh in flight | `RefreshControl`; **keep existing data** |
| **Loading more** | Next page fetching (**AsyncFlatList** only) | Small footer spinner; **keep existing items** |

Treat **`isReloading`** and **`isLoadingMore`** as overlays on data, not full-screen replacements.

### Shared behavior (all three)

1. **Initial loading** — While `isLoading` is true, show only the loader. Do not mount meaningful content for the main query.
2. **Initial error** — Show error UI with **Try again** wired to `reload` / `refetch`.
3. **Data** — Render `children` or list content when data is available.
4. **Inherited props** — Forward remaining props to `View`, `ScrollView`, or `FlatList`.

### Suggested props

| Prop | Role |
| ---- | ---- |
| `isLoading` | True during **initial** load (no data yet). |
| `error` | Truthy when **initial** load failed; pass `query.error` (`ApiError` — use `error.message`). |
| `reload` | Retry after error; `RefreshControl` `onRefresh` on scroll/list variants. |
| `isReloading` | Pull-to-refresh in flight (**AsyncScrollView** / **AsyncFlatList**). |
| `loader` | Optional node for **initial** loading only. |
| `isLoadingMore` | (**AsyncFlatList** only.) Next page in flight. |
| `loadMore` | (**AsyncFlatList** only.) Called from `onEndReached`; guard in the hook (`hasNextPage`, in-flight flags). |

### TanStack Query mapping

| Prop | Source |
| ---- | ------ |
| `isLoading` | `query.isLoading` |
| `isReloading` | `query.isRefetching` |
| `isLoadingMore` | `query.isFetchingNextPage` (infinite query only) |

### Error display

Read user-facing copy from `error.message`. See [managing-api-error.md](./managing-api-error.md). If refresh fails, **do not** replace the data UI with the full error state.

### When to use which wrapper

| Wrapper | Use when |
| ------- | -------- |
| **AsyncView** | Non-scroll content (forms, dashboards). No pull-to-refresh; recovery via **Try again** only. |
| **AsyncScrollView** | Scrollable content with pull-to-refresh (`RefreshControl` + `isReloading` / `reload`). |
| **AsyncFlatList** | Long lists with virtualization; optional infinite scroll via `loadMore` + `isLoadingMore` footer. |

## Examples

### ErrorMessage

```tsx
function ErrorMessage({ error }: { error: unknown }) {
  const message =
    error instanceof Error ? error.message : "Something went wrong.";
  return <Text className="text-center text-destructive">{message}</Text>;
}
```

### AsyncView

**Use when:** one-off or non-scroll content where pull-to-refresh is not desired. No `isReloading` UI from a user gesture; only **initial error** + **Try again**.

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
        <ErrorMessage error={error} />
        <Pressable onPress={reload}>
          <Text className="font-semibold text-primary">Try again</Text>
        </Pressable>
      </View>
    );
  }
  return <View {...viewProps}>{children}</View>;
}
```

### AsyncScrollView

**Use when:** scrollable content should support **pull-to-refresh**. If refresh fails, keep showing the last successful `children`.

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
        <ErrorMessage error={error} />
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

### AsyncFlatList

**Use when:** long lists, virtualization, and optional **infinite scroll**. Caller `onEndReached` runs before `loadMore`. Merge a custom `ListFooterComponent` with the `isLoadingMore` footer when both are needed.

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
        <ErrorMessage error={error} />
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

### Screen with AsyncView

```tsx
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

### Screen with AsyncFlatList

```tsx
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
