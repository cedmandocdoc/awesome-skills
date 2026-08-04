# Creating Form Component

## Overview

**Execution mode.** Creates pre-bound form fields and shells under `src/ui/Form/` with TanStack Form. Features compose `*Field` components via `useAppForm` / `AppField` without redefining hook contexts.

## Prerequisites

- [creating-component.md](./creating-component.md)

## Guidelines

### Folder placement

Keep all pre-bound form pieces under **`src/ui/Form/`**: contexts, `createFormHook`, shared shells, and every component passed into `fieldComponents` / `formComponents`. Export the app hook from `src/ui/Form/index.tsx` so features import `@/ui/Form`.

```text
src/ui/Form/
  contexts.ts         — createFormHookContexts
  index.tsx           — createFormHook, registrations, exports
  FieldShell.tsx      — label + children + error slot
  InputField.tsx      — pre-bound field for Input
  SubscribeButton.tsx — pre-bound submit
```

One pre-bound field per file when it grows beyond a few lines. Small shared pieces sit alongside `index.tsx`.

### Pre-bound strategy

- Each field file uses `useFieldContext` and registers in `fieldComponents`. Call sites pass **name** via `form.AppField` and domain props only.
- Reuse a shared field shell (`FieldShell` or an existing registry `Field`) for label, layout, and the error slot. Pass the control inside the pre-bound field.
- Pre-bind submit in `formComponents` via `useFormContext` and `form.Subscribe` for `isSubmitting` → `form.<Key>` (e.g. `form.SubscribeButton`).
- Features compose fields and the form hook; they do not redefine `createFormHook` or field contexts.
- Keep API submission beside other server logic per [creating-api.md](./creating-api.md).

### Naming

- Pre-bound fields: **`NameOfControl + Field`** (`Input` → `InputField`, registered key → `field.InputField`).
- Form-level components: clear names (`SubscribeButton`, `TransientServerError`).

### Composition shape

Build contexts in `contexts.ts`, define field and form components in sibling files, pass them into `createFormHook` from `index.tsx`.

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

Registered fields appear on `field` inside `form.AppField`; form components appear on `form`.

### Shared field shell

Wire the error slot to field meta and server mapping ([managing-form-error.md](./managing-form-error.md)). Prefer a registry `Field` primitive when one already has label and error slots.

```tsx
// src/ui/Form/FieldShell.tsx
import type { ReactNode } from "react";
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
    <div className="flex flex-col gap-2">
      {label ? (
        <Label className="text-foreground text-label font-body-semibold">
          {label}
        </Label>
      ) : null}
      {children}
      <FormError error={error ?? ""} />
    </div>
  );
}
```

### Pre-bound field file

One file per control. Use `useFieldContext`, connect to field state, wrap with `FieldShell`. Register in `fieldComponents`. Add Zod validators on the form; error display is in [managing-form-error.md](./managing-form-error.md).

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
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
      />
    </FieldShell>
  );
}
```

## Setup

```bash
node ../scripts/install-packages.cjs @tanstack/react-form
```

## Examples

```tsx
import { useAppForm } from "@/ui/Form";

export function SignInForm() {
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

- [managing-form-error.md](./managing-form-error.md)
- [managing-state.md](./managing-state.md)
- [creating-api.md](./creating-api.md)

## References

- [TanStack Form — Basic concepts](https://tanstack.com/form/latest/docs/framework/react/guides/basic-concepts.md)
- [TanStack Form — Form composition](https://tanstack.com/form/latest/docs/framework/react/guides/form-composition.md)
- [Form and field validation](https://tanstack.com/form/latest/docs/framework/react/guides/validation.md)
- [Submission handling](https://tanstack.com/form/latest/docs/framework/react/guides/submission-handling.md)
- [Reactivity](https://tanstack.com/form/latest/docs/framework/react/guides/reactivity.md)
