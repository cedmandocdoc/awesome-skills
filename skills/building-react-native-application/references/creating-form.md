# Creating Form

## Overview

Forms with TanStack Form and Zod: the app form hook in `src/ui/Form/`, the `src/ui/Field` wiring point, field binding, validation timing, client and server errors mapped to fields, and multi-step flows.

## Prerequisites

- [managing-data.md](./managing-data.md) — mutations, `ApiError`, model schemas

## Guidelines

### Form hook

```text
src/ui/Form/
  contexts.ts       — createFormHookContexts
  index.tsx         — createFormHook; exports useAppForm, withForm
  Form.tsx          — form root; holds the field focus registry
  InputField.tsx    — one pre-bound field per file
  SubmitButton.tsx  — pre-bound submit
  FormError.tsx     — form-level server error
```

- Features import `@/ui/Form`.
- `fieldComponents` keys become `field.<Key>` inside `form.AppField`; `formComponents` keys become `form.<Key>` inside `form.AppForm`.
- Every form renders inside `form.Form`; `SubmitButton` calls `form.handleSubmit()`, passes `isSubmitting` to the `Button`'s `loading`, and after a failed submit focuses the first invalid field.
- Pre-bound fields register their input ref by field name with `form.Form`'s registry; the first invalid field is the first registered one whose meta has errors.

### Field

`src/ui/Field` is hand-built:

| Prop | Role |
| --- | --- |
| `label` | Visible label; its `nativeID` links the control through `aria-labelledby` |
| `invalid` | Passed by TanStack Form; sets the control's invalid state |
| `error` | The first error message, passed by TanStack Form; rendered below the control with `accessibilityLiveRegion="polite"` |
| `children` | The control, which receives `aria-labelledby` and `aria-invalid` from the field context |

TanStack Form owns values, validation, and submit; `src/ui/Field` only renders and links. Its layout and error look come from the requirements.

### Binding

| Control | Bind |
| --- | --- |
| Used in more than one form | Pre-bound `<Control>Field` in `fieldComponents`; call sites pass `name` through `form.AppField` and domain props only |
| One-off | Inline `form.Field` in the feature, wrapped in `src/ui/Field` |

### Values

- Loaded data goes straight into `defaultValues`: render the form after its query succeeds and pass the data in; never sync values with an effect.
- Form schemas live in the feature's `schemas.ts` and may derive from API model schemas (`.pick`, `.extend`); a response schema is never reused as is.

### Validation and errors

Every form sets `validationLogic: revalidateLogic()` and passes its schema to `validators.onDynamic`: errors show on the first submit, then each field revalidates on change. A form deviates only when the requirements set its timing.

| Error | Source | Shown by |
| --- | --- | --- |
| Client | The form's Zod schema | The field's `Field` |
| Server, one field | `ApiError` whose `code` concerns a field: `formApi.setErrorMap({ onSubmit: { fields: { <name>: error } } })` | That field's `Field` |
| Server, whole form | Any other `ApiError`: `formApi.setErrorMap({ onServer: error as never })` | `FormError` |

`as never`: `setErrorMap` typing rejects `ApiError` on `onServer`; at runtime it holds the `ApiError`.

### Multi-step flows

- Define the steps once per flow as a const array; each step has an `id` and the Zod `schema` for its own fields.
- One hook per flow, `use<Flow>Steps` in the feature's `hooks/`, holds the current step and the direction (`forward` / `back`) and exposes `next`, `back`, `goTo`, `isFirst`, and `isLast`.
- One form instance spans every step so values persist; it validates with the active step's schema, and `onSubmit` advances until the last step submits.
- Render steps any way the requirements need: conditionally, in a pager that keeps neighbours mounted, or one route per step with the form held above the step routes. Step components receive the form through `withForm`.
- Focus moves to the new step's heading after a step change.
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
import { Form } from "./Form";
import { FormError } from "./FormError";
import { InputField } from "./InputField";
import { SubmitButton } from "./SubmitButton";

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { InputField },
  formComponents: { Form, FormError, SubmitButton },
});
```

### Pre-bound field

```tsx
import { useRef } from "react";
import type { TextInput as NativeTextInput } from "react-native";
import { Field } from "@/ui/Field";
import { TextInput } from "@/ui/TextInput";
import { useFieldContext } from "./contexts";
import { useRegisterField } from "./Form";

interface InputFieldProps {
  label: string;
}

export function InputField({ label }: InputFieldProps) {
  const field = useFieldContext<string>();
  const ref = useRef<NativeTextInput>(null);
  useRegisterField(field.name, ref);
  const error = field.state.meta.errors[0]?.message;

  return (
    <Field label={label} invalid={!!error} error={error}>
      <TextInput
        ref={ref}
        value={field.state.value}
        onChangeText={field.handleChange}
        onBlur={field.handleBlur}
      />
    </Field>
  );
}
```

### Form with loaded data and server errors

```tsx
import { revalidateLogic } from "@tanstack/react-form";
import { ProfileErrorCode, type Profile } from "@/api/app-api";
import { ApiError } from "@/libs/ApiError";
import { useAppForm } from "@/ui/Form";
import { useUpdateHandle } from "../hooks/useUpdateHandle";
import { HandleSchema } from "../schemas";

interface ProfileHandleFormProps {
  profile: Profile;
}

export function ProfileHandleForm({ profile }: ProfileHandleFormProps) {
  const updateHandle = useUpdateHandle();

  const form = useAppForm({
    defaultValues: { handle: profile.handle },
    validationLogic: revalidateLogic(),
    validators: { onDynamic: HandleSchema },
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
      <form.Form>
        <form.AppField name="handle" children={(field) => <field.InputField label="Handle" />} />
        <form.FormError />
        <form.SubmitButton label="Save" />
      </form.Form>
    </form.AppForm>
  );
}
```

`HandleSchema` in `schemas.ts` is `ProfileSchema.pick({ handle: true })`.

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
  validationLogic: revalidateLogic(),
  validators: { onDynamic: steps.step.schema as unknown as typeof CheckoutSchema },
  onSubmit: async ({ value }) => {
    if (!steps.isLast) return steps.next();
    await checkout.mutateAsync(value);
  },
});
```

`CheckoutSchema` is the whole flow's schema; the cast lets a step schema validate a subset of the form values.

## References

- [TanStack Form — Form composition](https://tanstack.com/form/latest/docs/framework/react/guides/form-composition.md)
- [TanStack Form — Dynamic validation](https://tanstack.com/form/latest/docs/framework/react/guides/dynamic-validation)
- [TanStack Form — Submission handling](https://tanstack.com/form/latest/docs/framework/react/guides/submission-handling.md)
