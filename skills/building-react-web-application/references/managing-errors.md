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
| Render or route error | The router's `defaultErrorComponent`, and `__root`'s own `errorComponent` | `src/ui/ErrorView` |
| Unknown URL | The router's `defaultNotFoundComponent` | Its page |

An unexpected error is anything other than an `ApiError` with a 4xx status.

### Error boundary

- `RouteError` in `src/common/errors/` is the router's `defaultErrorComponent` and `__root`'s `errorComponent`.
- It reports the error and renders `src/ui/ErrorView` with a retry that calls `reset()` and `router.invalidate()`.

### Not found

- `createRouter`'s `defaultNotFoundComponent` is the hook point.
- A 404 from the API is an ordinary `ApiError` handled where the query renders.

### Reporting

`src/common/errors/reportError.ts` is the one place `RouteError` and the cache handlers send unexpected errors. It logs to the console until the TRD names a service.

### Notifications

- One channel: `src/ui/Toast` on Base UI Toast, mounted once at the root through `FeedbackHost`.
- `notify({ title, description?, tone? })` in `src/common/feedback/` adds to the Base UI toast manager, so it works inside and outside React.
- Whether a failure or success notifies, and its copy, come from the requirements; the feature calls `notify()` from the mutation's `onSuccess` / `onError` or the event handler.

## Examples

### `src/common/errors/RouteError.tsx`

```tsx
import { useEffect } from "react";
import { useRouter, type ErrorComponentProps } from "@tanstack/react-router";
import { ErrorView } from "@/ui/ErrorView";
import { reportError } from "./reportError";

export function RouteError({ error, reset }: ErrorComponentProps) {
  const router = useRouter();

  useEffect(() => reportError(error), [error]);

  return (
    <ErrorView
      onRetry={() => {
        reset();
        void router.invalidate();
      }}
    />
  );
}
```

### `src/common/feedback/notify.ts`

```ts
import { createToastManager } from "@/ui/Toast";

export const toastManager = createToastManager();

export interface Notice {
  title: string;
  description?: string;
  tone?: "neutral" | "success" | "danger";
}

export function notify({ title, description, tone = "neutral" }: Notice) {
  toastManager.add({ title, description, type: tone });
}
```

`src/ui/Toast` re-exports Base UI's `Toast.createToastManager` and renders `Toast.Provider` with the viewport; `FeedbackHost` passes it `toastManager`.

## References

- [TanStack Router — Data loading: handling errors](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#handling-errors-with-routeoptionserrorcomponent)
- [TanStack Router — Not found errors](https://tanstack.com/router/latest/docs/framework/react/guide/not-found-errors)
- [Base UI — Toast](https://base-ui.com/react/components/toast)
