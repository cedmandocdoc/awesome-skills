# Managing Errors

## Overview

Where errors are caught, rendered, and reported, the not-found hook point, and the one notification channel. What a specific failure, success, or missing resource shows comes from the requirements.

## Prerequisites

- [managing-data.md](./managing-data.md) — `ApiError`, `queryClient`

## Guidelines

### Catch points

| Error | Caught by | Rendered by |
| --- | --- | --- |
| Query or mutation failure | The surface's `AsyncView` or the form — [creating-async-component.md](./creating-async-component.md), [creating-form.md](./creating-form.md) | The same |
| Unexpected query or mutation failure | `QueryCache` / `MutationCache` `onError` in `src/common/query/client.ts` | Reported only |
| Render error | `src/ui/ErrorBoundary` around `Navigation` in `App.tsx` | `src/ui/ErrorView` |
| Unknown link | The fallback screen in `linking` | Its screen |

An unexpected error is anything other than an `ApiError` with a 4xx status.

### Error boundary

- One hand-written class component in `src/ui/ErrorBoundary.tsx`; it renders `src/ui/ErrorView` with a retry that remounts its children.
- It takes `onError`; `App.tsx` passes `reportError`.

### Not found

- One fallback screen with `linking: "*"` in the root navigator's `Public` group is the hook point.
- A 404 from the API is an ordinary `ApiError` handled where the query renders.

### Reporting

`src/common/errors/reportError.ts` is the one place the error boundary and the cache handlers send unexpected errors. It logs to the console until the TRD names a service.

### Notifications

- One channel: `src/ui/Toast` on `@rn-primitives/toast`, mounted once at the root through `FeedbackHost`.
- `notify({ title, description?, tone? })` in `src/common/feedback/` holds the queue, since the primitive is declarative only; `FeedbackHost` subscribes and renders the current item.
- Whether a failure or success notifies, and its copy, come from the requirements; the feature calls `notify()` from the mutation's `onSuccess` / `onError` or the event handler.

## Examples

### `src/ui/ErrorBoundary.tsx`

```tsx
import { Component, Fragment, type ErrorInfo, type ReactNode } from "react";
import { ErrorView } from "./ErrorView";

interface ErrorBoundaryProps {
  children: ReactNode;
  onError: (error: unknown, info: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  error: unknown;
  attempt: number;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null, attempt: 0 };

  static getDerivedStateFromError(error: unknown) {
    return { error };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    this.props.onError(error, info);
  }

  retry = () => this.setState(({ attempt }) => ({ error: null, attempt: attempt + 1 }));

  render() {
    if (this.state.error) return <ErrorView onRetry={this.retry} />;
    return <Fragment key={this.state.attempt}>{this.props.children}</Fragment>;
  }
}
```

The key change remounts the tree on retry.

### `src/common/feedback/notify.ts`

```ts
export interface Notice {
  id: number;
  title: string;
  description?: string;
  tone?: "neutral" | "success" | "danger";
}

let queue: Notice[] = [];
let nextId = 0;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((listener) => listener());

export function notify(notice: Omit<Notice, "id">) {
  queue = [...queue, { ...notice, id: nextId++ }];
  emit();
}

export function dismiss(id: number) {
  queue = queue.filter((notice) => notice.id !== id);
  emit();
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const getQueue = () => queue;
```

`FeedbackHost` reads the queue with `useSyncExternalStore(subscribe, getQueue)` and renders `src/ui/Toast` for the first notice, calling `dismiss` when it closes.

## References

- [React — Catching rendering errors with an error boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [React Native Primitives — Toast](https://rnprimitives.com/toast/)
