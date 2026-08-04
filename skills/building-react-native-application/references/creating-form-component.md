# Creating Form Component

## Overview

Create pre-bound form fields and shells under `src/ui/Form/` with TanStack Form. Screens compose `*Field` components and stay free of repeated wiring (labels, errors, field state).

## Prerequisites

- [creating-component.md](./creating-component.md) — start here for general component rules
- TanStack Form basic concepts and form composition (see [References](#references))

## Guidelines

### Placement

- Use `@tanstack/react-form` for form state. Bind field values and handlers to React Native controls in pre-bound components.
- Keep all pre-bound form pieces under `src/ui/Form/`: contexts, `createFormHook`, shared shells, and every component passed into `fieldComponents` / `formComponents`. Export the app hook from `src/ui/Form/index.tsx` so screens import `@/ui/Form`.
- One pre-bound field per file when it grows beyond a few lines (e.g. `InputField.tsx`). Keep small shared pieces (`FieldShell.tsx`, `SubscribeButton.tsx`) alongside `index.tsx`.

```text
src/ui/Form/
  contexts.ts         — createFormHookContexts
  index.tsx           — createFormHook, registrations, exports
  FieldShell.tsx      — label + children + error slot
  InputField.tsx      — pre-bound field for Input
  SubscribeButton.tsx — pre-bound submit
```

### Pre-bound strategy

- Each field file uses `useFieldContext` and is registered in `fieldComponents`. Call sites pass `name` via `form.AppField` and domain props only.
- Reuse a shared field shell (`FieldShell` or existing registry `Field`) for label, layout, and the error slot. If none exists, add `FieldShell.tsx` under `Form/`.

### Naming

| Element | Convention | Example |
| --- | --- | --- |
| Pre-bound field | `NameOfControl + Field` | `InputField` → `field.InputField` |
| Form component | Descriptive name | `SubscribeButton`, `TransientServerError` |

### Submit actions

- Pre-bind the submit control in `formComponents` (e.g. `SubscribeButton`). Implement with `@/ui/Button` or `Pressable` + `Text`, wired through `useFormContext` and `form.Subscribe` for `isSubmitting`. Register from `index.tsx`.
- Keys in `formComponents` → `form.<Key>`. Keys in `fieldComponents` → `field.<Key>` in `form.AppField` children.

### Screens

- Screens in `src/features/<feature>/` compose fields and the form hook.
- Keep API submission beside server logic per [creating-api.md](./creating-api.md).

### Composition shape

Build contexts in `contexts.ts`, define components in sibling files, pass them into `createFormHook` from `index.tsx`.

```tsx
// src/ui/Form/contexts.ts
import { createFormHookContexts } from "@tanstack/react-form";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();
```

```tsx
// src/ui/Form/index.tsx
import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "./contexts";
import { InputField } from "./InputField";
import { SubscribeButton } from "./SubscribeButton";

const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { InputField },
  formComponents: { SubscribeButton },
});

export { useAppForm, withForm };
```

Registered field components appear on `field` inside `form.AppField`. Registered form components appear on `form` inside `form.AppForm`.

### Creating field components

#### 1) Shared field shell

Create `FieldShell.tsx` for consistent label and error rendering. Wire the error slot per [managing-form-error.md](./managing-form-error.md).

```tsx
// src/ui/Form/FieldShell.tsx
import type { ReactNode } from "react";
import { View } from "react-native";
import type { ApiError } from "@/libs/ApiError";
import type { ZodError } from "zod";
import { FormError } from "@/ui/FormError";
import { Label } from "@/ui/Label";

export function FieldShell({
  children,
  error,
  label,
}: {
  children: ReactNode;
  error?: ApiError | ZodError | string;
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

When a registry `Field` primitive with label and error slots exists, use that instead.

#### 2) Pre-bound field file

One file per control (e.g. `InputField.tsx`). Use `useFieldContext`, connect the control, wrap with `FieldShell`.

```tsx
// src/ui/Form/InputField.tsx
import { useFieldContext } from "./contexts";
import { FieldShell } from "./FieldShell";
import { Input } from "@/ui/Input";

export function InputField({ label }: { label: string }) {
  const field = useFieldContext<string>();

  return (
    <FieldShell label={label} error={field.state.meta.errors[0]}>
      <Input
        value={field.state.value}
        onChangeText={field.handleChange}
        onBlur={field.handleBlur}
      />
    </FieldShell>
  );
}
```

Register in `fieldComponents` inside `index.tsx`. Error display covered in [managing-form-error.md](./managing-form-error.md).

## Setup

```bash
node ../scripts/install-packages.cjs @tanstack/react-form
```

## Examples

### Screen composes pre-bound components

```tsx
import { useAppForm } from "@/ui/Form";

export function SignInScreen() {
  const form = useAppForm({
    defaultValues: { email: "", password: "" },
    onSubmit: async ({ value }) => {
      /* call mutation / API */
    },
  });

  return (
    <form.AppForm>
      <form.AppField
        name="email"
        children={(field) => <field.InputField label="Email" />}
      />
      <form.AppField
        name="password"
        children={(field) => <field.InputField label="Password" />}
      />
      <form.SubscribeButton label="Sign in" />
    </form.AppForm>
  );
}
```

## Related

- [managing-form-error.md](./managing-form-error.md) — `onServer`, `onSubmit.fields`, and wiring errors into `FieldShell`
- [managing-state.md](./managing-state.md) — where API and client state live relative to forms
- [creating-api.md](./creating-api.md) — submitting validated payloads through feature hooks

## References

- [TanStack Form — Basic concepts](https://tanstack.com/form/latest/docs/framework/react/guides/basic-concepts.md)
- [TanStack Form — Form composition](https://tanstack.com/form/latest/docs/framework/react/guides/form-composition.md)
- [TanStack Form — Validation](https://tanstack.com/form/latest/docs/framework/react/guides/validation.md)
- [TanStack Form — Submission handling](https://tanstack.com/form/latest/docs/framework/react/guides/submission-handling.md)
- [TanStack Form — Reactivity](https://tanstack.com/form/latest/docs/framework/react/guides/reactivity.md)
