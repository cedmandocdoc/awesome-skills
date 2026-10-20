# Creating Async Component

## Overview

Build the async-state components once in `src/ui/Async/`; every server-backed surface renders through them. This guide owns the states, their behavior, and their announcements; the requirements own how each state looks.

## Prerequisites

- [managing-data.md](./managing-data.md) — query hooks, `ApiError`

## Guidelines

### States

A surface passes all of its queries; the states combine them.

| State | When | Shows |
| --- | --- | --- |
| Loading | A query is fetching with no data yet and none failed | Loading presentation in place of content |
| Error | A query failed with no data | Error presentation; retry refetches the failed queries |
| Empty | Every query has data and the surface marks it empty | Empty presentation; a surface may pass its own |
| Success | Every query has data | Content |
| Refreshing | A query refetches while it has data | Content stays, with a refresh indicator; a failed refresh keeps the content |

- A disabled query (pending with `fetchStatus === "idle"`) never holds the surface in loading.
- Loading indicators show only after 200 ms, through one `useDelayedFlag` in `src/ui/hooks/`.
- With no requirement for a state's look, the agent builds its presentation once in `src/ui/Async/`.

### Announcements

| State | Rule |
| --- | --- |
| Loading | The surface sets `accessibilityState={{ busy: true }}`; `AsyncLoading` sets `accessibilityLiveRegion="polite"` |
| Error | `AsyncError` sets `accessibilityLiveRegion="assertive"` and calls `AccessibilityInfo.announceForAccessibility` with its message (iOS has no live regions) |

### Layout

```text
src/ui/Async/
  asyncState.ts       — derives the state from queries
  AsyncLoading.tsx    — loading presentation
  AsyncError.tsx      — error presentation and retry
  AsyncEmpty.tsx      — default empty presentation
  AsyncView.tsx       — non-scrolling content
  AsyncScrollView.tsx — scrolling content with pull-to-refresh
  AsyncFlatList.tsx   — virtualized lists, infinite loading
  index.tsx           — exports the three wrappers
```

The wrappers share `asyncState` and the presentations; they differ only in refresh and pagination.

### TanStack Query mapping

| Input | Source |
| --- | --- |
| No data yet | `query.isPending` with `query.fetchStatus !== "idle"` |
| Failed | `query.isError` with `query.data === undefined` |
| Refreshing | `query.isRefetching` |
| Retry | `query.refetch()` |
| Loading more | `query.isFetchingNextPage` |

### Pull to refresh

`AsyncScrollView` and `AsyncFlatList` bind `RefreshControl` to the refreshing state: `refreshing` is true while a query refetches with data, and `onRefresh` calls every query's `refetch()`.

### `AsyncFlatList`

- `isFetchingNextPage` shows a footer indicator; items stay.
- `onEndReached` runs the caller's handler first, then `fetchNextPage()` when `hasNextPage` is true and no page is in flight.
- `onEndReachedThreshold` defaults to `0.2`.
- A caller's `ListFooterComponent` renders together with the loading footer.

## Examples

### `asyncState.ts`

```ts
export interface QueryState {
  data: unknown;
  isPending: boolean;
  isError: boolean;
  isRefetching: boolean;
  fetchStatus: "fetching" | "paused" | "idle";
  refetch: () => unknown;
}

export type AsyncState = "loading" | "error" | "empty" | "success";

export function asyncState(queries: QueryState[], isEmpty = false): AsyncState {
  if (queries.some((query) => query.isError && query.data === undefined)) return "error";
  if (queries.some((query) => query.isPending && query.fetchStatus !== "idle")) return "loading";
  return isEmpty ? "empty" : "success";
}
```

### `useDelayedFlag.ts`

```ts
import { useEffect, useState } from "react";

export function useDelayedFlag(flag: boolean, delayMs = 200) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!flag) return setShown(false);
    const timer = setTimeout(() => setShown(true), delayMs);
    return () => clearTimeout(timer);
  }, [flag, delayMs]);

  return shown;
}
```

### `AsyncView.tsx`

```tsx
import type { ReactNode } from "react";
import { View } from "react-native";
import { AsyncEmpty } from "./AsyncEmpty";
import { AsyncError } from "./AsyncError";
import { AsyncLoading } from "./AsyncLoading";
import { asyncState, type QueryState } from "./asyncState";

interface AsyncViewProps {
  queries: QueryState[];
  isEmpty?: boolean;
  empty?: ReactNode;
  children: ReactNode;
}

export function AsyncView({ queries, isEmpty, empty, children }: AsyncViewProps) {
  const state = asyncState(queries, isEmpty);

  return (
    <View className="flex-1" accessibilityState={{ busy: state === "loading" }}>
      {state === "loading" ? <AsyncLoading /> : null}
      {state === "error" ? <AsyncError queries={queries} /> : null}
      {state === "empty" ? (empty ?? <AsyncEmpty />) : null}
      {state === "success" ? children : null}
    </View>
  );
}
```

### Surface with two queries

```tsx
const orders = useOrders();
const profile = useProfile();

<AsyncView queries={[orders, profile]} isEmpty={orders.data?.length === 0}>
  {orders.data && profile.data ? (
    <OrderList orders={orders.data} profile={profile.data} />
  ) : null}
</AsyncView>
```
