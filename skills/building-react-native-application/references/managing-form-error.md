# Managing Form Error

## Overview

Handle form failures in TanStack Form with a clear split:

- **Server submit errors** — stored in `errorMap.onServer` as `ApiError`, shown via a pre-bound form-level component.
- **Local validation errors** — from validators (e.g. Zod), rendered via pre-bound `*Field` components and `FieldShell`.

## Prerequisites

- [managing-api-error.md](./managing-api-error.md)
- [creating-form-component.md](./creating-form-component.md) — `src/ui/Form/` layout, `FieldShell`, pre-bound `*Field` components

## Guidelines

### 1) Define error UI (expects `ApiError`)

Build shared error UI that accepts `ApiError` and renders `error.message`. Keep message ownership in API layer per [managing-api-error.md](./managing-api-error.md).

### 2) Handle submit server error (`onServer`)

Catch API failures and write them to `onServer`:

```tsx
try {
  await mutation.mutateAsync(value);
} catch (error: unknown) {
  formApi.setErrorMap({ onServer: error as never });
}
```

Use `as never` because TanStack Form's `setErrorMap` typing does not accept `ApiError` on `onServer` directly. At runtime `onServer` holds `ApiError` from typed mutations.

Create a pre-bound form component that subscribes to `errorMap.onServer`. Place in `src/ui/Form/` (e.g. `TransientServerError.tsx`) and register in `formComponents`:

```tsx
import { useCallback } from "react";
import type { ReactElement } from "react";

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

Render in form composition:

```tsx
<form.AppForm>
  {/* fields */}
  <form.TransientServerError />
  <form.SubscribeButton label="Submit" />
</form.AppForm>
```

### 3) Handle local validation errors (Zod)

- Add Zod validators on the form for automatic front-end validation.
- Pass the first field meta error into `FieldShell`'s `error` prop from each pre-bound `*Field` — see [creating-form-component.md](./creating-form-component.md).
- Reuse `FormError` inside `FieldShell` so `ApiError` and Zod errors render consistently.

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

Map the error into each pre-bound field's `FieldShell` `error` prop (same slot as Zod validation).
