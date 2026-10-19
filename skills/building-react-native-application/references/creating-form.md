# Creating Form

## Overview

Forms with TanStack Form and Zod: the app form hook in `src/ui/Form/`, field binding, client and server errors mapped to fields, and multi-step flows.

## Prerequisites

- [managing-data.md](./managing-data.md) — mutations, `ApiError`

## Guidelines

### Form hook

```text
src/ui/Form/
  contexts.ts       — createFormHookContexts
  index.tsx         — createFormHook; exports useAppForm, withForm
  FieldShell.tsx    — label, control, and error slot
  InputField.tsx    — one pre-bound field per file
  SubmitButton.tsx  — pre-bound submit
  FormError.tsx     — form-level server error
```

- Screens import `@/ui/Form`.
- `fieldComponents` keys become `field.<Key>` inside `form.AppField`; `formComponents` keys become `form.<Key>` inside `form.AppForm`.
- `SubmitButton` subscribes to `isSubmitting` and `canSubmit`.

### Binding

| Control | Bind |
| --- | --- |
| Used in more than one form | Pre-bound `<Control>Field` in `fieldComponents`; call sites pass `name` through `form.AppField` and domain props only |
| One-off | Inline `form.Field` in the feature, wrapped in `FieldShell` |

`FieldShell` wires label, control, and error for every field; its layout and error presentation come from the design.

### Validation and errors

| Error | Source | Shown by |
| --- | --- | --- |
| Client | Zod schema from the feature's `schemas.ts`, passed to `validators.<timing>` | The field's `FieldShell` |
| Server, one field | `ApiError` whose `code` concerns a field: `formApi.setErrorMap({ onSubmit: { fields: { <name>: error } } })` | That field's `FieldShell` |
| Server, whole form | Any other `ApiError`: `formApi.setErrorMap({ onServer: error as never })` | `FormError` |

`as never`: `setErrorMap` typing rejects `ApiError` on `onServer`; at runtime it holds the `ApiError`.

### Multi-step flows

- Define the steps once per flow as a const array; each step has an `id` and the Zod `schema` for its own fields.
- One hook per flow, `use<Flow>Steps` in the feature's `hooks/`, holds the current step and the direction (`forward` / `back`) and exposes `next`, `back`, `goTo`, `isFirst`, and `isLast`.
- One form instance spans every step so values persist; it validates with the active step's schema, and `onSubmit` advances until the last step submits.
- Render steps any way the design needs: conditionally, in a pager that keeps neighbours mounted, or one route per step with the form held above the step routes. Step components receive the form through `withForm`.
- Progress that must survive leaving the flow is shared client state per [managing-data.md](./managing-data.md).

## Setup

```bash
node ../scripts/install-packages.cjs @tanstack/react-form zod
```

## Examples

### `index.tsx`

```tsx
import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "./contexts";
import { FormError } from "./FormError";
import { InputField } from "./InputField";
import { SubmitButton } from "./SubmitButton";

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { InputField },
  formComponents: { FormError, SubmitButton },
});
```

### Pre-bound field

```tsx
import { TextInput } from "@/ui/TextInput";
import { useFieldContext } from "./contexts";
import { FieldShell } from "./FieldShell";

export function InputField({ label }: { label: string }) {
  const field = useFieldContext<string>();

  return (
    <FieldShell label={label} error={field.state.meta.errors[0]}>
      <TextInput
        value={field.state.value}
        onChangeText={field.handleChange}
        onBlur={field.handleBlur}
      />
    </FieldShell>
  );
}
```

### Form with server errors

```tsx
const updateHandle = useUpdateHandle();

const form = useAppForm({
  defaultValues: { handle: "" },
  validators: { onChange: HandleSchema },
  onSubmit: async ({ value, formApi }) => {
    try {
      await updateHandle.mutateAsync(value.handle);
    } catch (error) {
      if (error instanceof ApiError && error.code === ProfileErrorCode.HandleTaken) {
        formApi.setErrorMap({ onSubmit: { fields: { handle: error } } });
      } else {
        formApi.setErrorMap({ onServer: error as never });
      }
    }
  },
});

return (
  <form.AppForm>
    <form.AppField name="handle" children={(field) => <field.InputField label="Handle" />} />
    <form.FormError />
    <form.SubmitButton label="Save" />
  </form.AppForm>
);
```

### Step hook

```ts
import { useState } from "react";
import { AddressSchema, PersonalSchema, ReviewSchema } from "../schemas";

const STEPS = [
  { id: "personal", schema: PersonalSchema },
  { id: "address", schema: AddressSchema },
  { id: "review", schema: ReviewSchema },
] as const;

type CheckoutStepId = (typeof STEPS)[number]["id"];

export function useCheckoutSteps() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  const move = (to: number) => {
    setDirection(to > index ? "forward" : "back");
    setIndex(to);
  };

  return {
    step: STEPS[index],
    direction,
    isFirst: index === 0,
    isLast: index === STEPS.length - 1,
    next: () => move(Math.min(index + 1, STEPS.length - 1)),
    back: () => move(Math.max(index - 1, 0)),
    goTo: (id: CheckoutStepId) => move(STEPS.findIndex((step) => step.id === id)),
  };
}
```

### Step form

```tsx
const steps = useCheckoutSteps();

const form = useAppForm({
  defaultValues: { name: "", email: "", street: "", city: "" },
  validators: { onSubmit: steps.step.schema as unknown as typeof CheckoutSchema },
  onSubmit: async ({ value }) => {
    if (!steps.isLast) return steps.next();
    await checkout.mutateAsync(value);
  },
});
```

`CheckoutSchema` is the whole flow's schema; the cast lets a step schema validate a subset of the form values.

## References

- [TanStack Form — Form composition](https://tanstack.com/form/latest/docs/framework/react/guides/form-composition.md)
- [TanStack Form — Validation](https://tanstack.com/form/latest/docs/framework/react/guides/validation.md)
- [TanStack Form — Submission handling](https://tanstack.com/form/latest/docs/framework/react/guides/submission-handling.md)
