# Managing Form Error

## Overview

Use this guide to handle form failures in TanStack Form with a clear split:

- **Server submit errors** are stored in `errorMap.onServer` as `ApiError` and shown via a pre-bound form-level component.
- **Local validation errors** come from validators (for example Zod) and render via field shells and pre-bound `*Field` components.

## Prerequisites

- [managing-api-error.md](./managing-api-error.md)
- [managing-form-components.md](./managing-form-components.md)

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
} catch (error) {
  formApi.setErrorMap({ onServer: error });
}
```

Create a pre-bound form component that subscribes to `errorMap.onServer`, then use it as `form.TransientServerError`:

```tsx
/**
 * Pre-bound form component that subscribes to server-time form errors
 * and shows a transient bottom toast when the error is an Error instance.
 */
export function TransientServerError(): React.JSX.Element {
  const form = useFormContext();

  const retrySubmit = React.useCallback(async (): Promise<void> => {
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

Register this in `createFormHook(... formComponents ...)` and render it in form composition:

```tsx
<form.AppForm>
  {/* fields */}
  <form.TransientServerError />
  <form.SubscribeButton label="Submit" />
</form.AppForm>
```

### 3) Handle submit local error (UI validation / Zod)

Create a reusable field shell first so every field gets consistent label + error rendering:

```tsx
function FieldShell({
  children,
  error,
  label,
}: {
  children: React.ReactNode;
  error?: ApiError | ZodError;
  label?: string;
}) {
  return (
    <View className="gap-2">
      {label ? (
        <Label className="!font-body-semibold !text-label text-foreground">
          {label}
        </Label>
      ) : null}
      {children}
      <FormError error={error ?? ""} />
    </View>
  );
}
```

Then create pre-bound field components with `NameOfInput + Field` naming:

```tsx
const InputField = () => (
  <FieldShell>
    <Input />
  </FieldShell>
);
```

- Register fields through `fieldComponents` in `src/ui/Form.tsx` (see [managing-form-components.md](./managing-form-components.md)).
- Add Zod validators on the form so front-end validation runs automatically.

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

This allows each pre-bound `*Field` to render API-backed field errors in the same `FieldShell` error slot.

## Conventions

- Keep server-level failures in `onServer`.
- Keep per-field submit failures in `onSubmit.fields`.
- Reuse one error UI path (`FormError`) so `ApiError` and Zod errors render consistently.
