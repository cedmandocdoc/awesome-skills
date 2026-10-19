# Creating Async Component

## Overview

Build the async-state components once in `src/ui/Async/`; every server-backed surface renders through them. This guide owns the states and their behavior; the design owns how each state looks.

## Prerequisites

- [managing-data.md](./managing-data.md) — query hooks, `ApiError`

## Guidelines

### States

A surface passes all of its queries; the states combine them.

| State | When | Shows |
| --- | --- | --- |
| Loading | A query has no data yet and none failed | Loading presentation in place of content |
| Error | A query failed with no data | Error presentation; retry refetches the failed queries |
| Empty | Every query has data and the surface marks it empty | Empty presentation; a surface may pass its own |
| Success | Every query has data | Content |
| Refreshing | A query refetches while it has data | Content stays, with a refresh indicator; a failed refresh keeps the content |

With no design for a state, the agent builds its presentation once in `src/ui/Async/`.

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
| No data yet | `query.isPending` |
| Failed | `query.isError` with `query.data === undefined` |
| Refreshing | `query.isRefetching` |
| Retry and pull-to-refresh | `query.refetch()` |
| Loading more | `query.isFetchingNextPage` |

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
  refetch: () => unknown;
}

export type AsyncState = "loading" | "error" | "empty" | "success";

export function asyncState(queries: QueryState[], isEmpty = false): AsyncState {
  if (queries.some((query) => query.isError && query.data === undefined)) return "error";
  if (queries.some((query) => query.isPending)) return "loading";
  return isEmpty ? "empty" : "success";
}
```

### `AsyncView.tsx`

```tsx
import type { ReactNode } from "react";
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
  switch (asyncState(queries, isEmpty)) {
    case "loading":
      return <AsyncLoading />;
    case "error":
      return <AsyncError queries={queries} />;
    case "empty":
      return empty ?? <AsyncEmpty />;
    case "success":
      return children;
  }
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
