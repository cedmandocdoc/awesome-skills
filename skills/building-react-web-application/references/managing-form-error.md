# Managing Form Error

## Overview

Handles form failures in TanStack Form:

- **Server submit errors** — stored in `errorMap.onServer` as `ApiError`, shown via a pre-bound form-level component.
- **Local validation errors** — from Zod validators, rendered via pre-bound `*Field` components and `FieldShell`.

## Prerequisites

- [managing-api-error.md](./managing-api-error.md)
- [creating-form-component.md](./creating-form-component.md) — `src/ui/Form/` layout, `FieldShell`, pre-bound `*Field` components

## Guidelines

### 1. Define error UI (expects `ApiError`)

Build shared error UI that accepts `ApiError` and renders `error.message`. Keep message ownership in the API layer per [managing-api-error.md](./managing-api-error.md).

### 2. Handle submit server error (`onServer`)

Catch API failures in the submit handler and write to `onServer`:

```tsx
try {
  await mutation.mutateAsync(value);
} catch (error: unknown) {
  formApi.setErrorMap({ onServer: error as never });
}
```

Create a pre-bound form component that subscribes to `errorMap.onServer` and register it in `formComponents`. Place in `src/ui/Form/` (e.g. `TransientServerError.tsx`):

```tsx
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

### 3. Handle local validation errors (Zod)

- Add Zod validators on the form for automatic front-end validation.
- Pass the first field meta error into `FieldShell`'s `error` prop from each pre-bound `*Field`.
- Reuse `FormError` inside `FieldShell` so `ApiError` and Zod errors render consistently.

### 4. Set field-level API errors on submit

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

Map errors into each pre-bound field's `FieldShell` `error` prop (same slot as Zod validation).

### Conventions

- Server-level failures go in `onServer`.
- Per-field submit failures go in `onSubmit.fields`.
- One error UI path (`FormError` via `FieldShell`) renders both `ApiError` and Zod errors consistently.
