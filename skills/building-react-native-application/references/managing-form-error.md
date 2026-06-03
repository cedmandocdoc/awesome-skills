# Managing Form Error

## Overview

Use this guide to handle form failures in TanStack Form with a clear split:

- **Server submit errors** are stored in `errorMap.onServer` as `ApiError` and shown via a pre-bound form-level component.
- **Local validation errors** come from validators (for example Zod) and render via pre-bound `*Field` components and **`FieldShell`** (see [managing-form-components.md](./managing-form-components.md)).

## Prerequisites

- [managing-api-error.md](./managing-api-error.md)
- [managing-form-components.md](./managing-form-components.md) — `src/ui/Form/` layout, `FieldShell`, and pre-bound `*Field` components

## Workflow

### 1) Define error UI first (expects `ApiError`)

Build shared error UI that accepts `ApiError` (or `unknown` narrowed to `ApiError`) and renders user-facing copy from `error.message`.

- Keep error presentation reusable (inline message, toast, banner).
- Keep message ownership in API layer per [managing-api-error.md](./managing-api-error.md).

### 2) Handle submit server error (`onServer`)

In form submit handlers, catch API or mutation failures and write them to `onServer`:

```tsx
try {
  await mutation.mutateAsync(value);
} catch (error: unknown) {
  formApi.setErrorMap({ onServer: error as never });
}
```

At runtime `onServer` holds `ApiError` from typed mutations (`useMutation<…, ApiError, …>`) and the API layer in [managing-api-error.md](./managing-api-error.md). Use `as never` because TanStack Form’s `setErrorMap` typing does not accept `ApiError` on `onServer` directly.

Create a pre-bound form component that subscribes to `errorMap.onServer`, then use it as `form.TransientServerError`. Place the implementation in `src/ui/Form/` (for example `TransientServerError.tsx`) and register it in `formComponents` from `index.tsx`:

```tsx
import { useCallback } from "react";
import type { ReactElement } from "react";

/**
 * Pre-bound form component that subscribes to server-time form errors
 * and shows a transient bottom toast when the error is an Error instance.
 */
export function TransientServerError(): ReactElement {
  const form = useFormContext();

  const retrySubmit = useCallback(async (): Promise<void> => {
    form.setErrorMap({ onServer: undefined });
    await form.handleSubmit();
  }, [form]);

  return (
    <form.Subscribe selector={(state) => state.errorMap.onServer}>
      {(serverError) => (
        <TransientErrorToast error={serverError} refetch={retrySubmit} />
      )}
    </form.Subscribe>
  );
}
```

Render it in form composition:

```tsx
<form.AppForm>
  {/* fields */}
  <form.TransientServerError />
  <form.SubscribeButton label="Submit" />
</form.AppForm>
```

### 3) Handle local validation errors (Zod)

- Add Zod validators on the form so front-end validation runs automatically.
- Pass the first field meta error (or the mapped submit error) into **`FieldShell`**’s `error` prop from each pre-bound `*Field` in `src/ui/Form/` — see [managing-form-components.md](./managing-form-components.md).
- Reuse **`FormError`** inside **`FieldShell`** so `ApiError` and Zod errors render consistently.

### 4) Set field-level API errors on submit

For server-returned field errors, set `onSubmit` errors with `fields` mapping:

```tsx
formApi.setErrorMap({
  onSubmit: {
    fields: {
      myField: apiError,
    },
  },
});
```

Map the corresponding error into each pre-bound field’s **`FieldShell`** `error` prop (same slot as Zod validation). This keeps API-backed field errors inline with local validation.

## Conventions

- Keep server-level failures in `onServer`.
- Keep per-field submit failures in `onSubmit.fields`.
- Reuse one error UI path (`FormError` via `FieldShell`) so `ApiError` and Zod errors render consistently.
- Do not redefine `FieldShell` or `*Field` here — extend `src/ui/Form/` per [managing-form-components.md](./managing-form-components.md).
