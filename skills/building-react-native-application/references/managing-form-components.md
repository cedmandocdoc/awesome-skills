# Managing Form Components

## Overview

Use this guide to wire **TanStack Form** in Expo React Native apps with a **single composition root** in `src/ui/Form/`. Pre-bind field and submit UI there so screens only compose small, typed field components and stay free of repeated wiring (labels, errors, field state).

For field-level layout and presentational rules, align with [creating-component.md](./creating-component.md) and [placing-component.md](./placing-component.md). TanStack Form is **headless** — it does not assume DOM or native widgets. This file focuses on **where code lives** and **how to compose and reuse** fields in this stack.

## Prerequisites

- [TanStack Form — Basic concepts](https://tanstack.com/form/latest/docs/framework/react/guides/basic-concepts.md) — form instances, fields, meta, subscribers
- [TanStack Form — Form composition](https://tanstack.com/form/latest/docs/framework/react/guides/form-composition.md) — `createFormHook`, pre-bound components, contexts

## Guidelines

### Library and folder placement

- Use **`@tanstack/react-form`** for form state. Bind field values and handlers to React Native controls in pre-bound components (for example **`TextInput`**, switches, pickers).
- Keep **all pre-bound form pieces** under **`src/ui/Form/`**: contexts, `createFormHook`, shared shells, and every component passed into `fieldComponents` / `formComponents`. Export the app hook from **`src/ui/Form/index.tsx`** so screens import `@/ui/Form` — not from scattered helpers.
- Put **one pre-bound field per file** when it grows beyond a few lines (for example `InputField.tsx`). Keep small shared pieces such as **`FieldShell.tsx`** and **`SubscribeButton.tsx`** alongside `index.tsx`.

Expected layout:

```text
src/ui/Form/
  contexts.ts         — createFormHookContexts (avoids circular imports with field files)
  index.tsx           — createFormHook, registrations, exports
  FieldShell.tsx      — label + children + error slot (optional if tiny → index.tsx)
  InputField.tsx      — pre-bound field for Input
  SubscribeButton.tsx — pre-bound submit (optional if tiny → index.tsx)
```

### Pre-bound strategy

- **Abstract field state in pre-bound components** — each field file uses `useFieldContext` and is registered in `fieldComponents`. Call sites pass **name** via `form.AppField` and domain props (for example `label`) only; they do not reimplement `useField` wiring per screen.
- **Reuse a shared field shell** (`FieldShell` or an existing registry **`Field`**) for label, layout, and the error slot. Pass the control inside the pre-bound field so **style and layout stay centralized**.
- **If no shell exists**, add **`FieldShell.tsx`** under `Form/` (see [Creating field components](#creating-field-components)). Do not duplicate that wrapper in every feature.

### Naming

- Pre-bound fields use **`NameOfControl + Field`** (for example `Input` → **`InputField`**, registered key `InputField` → **`field.InputField`**).
- Form-level components use a clear name (for example **`SubscribeButton`**, **`TransientServerError`**).

### Submit actions

- Pre-bind the app’s **submit control** in `formComponents` (the TanStack docs often use **`SubscribeButton`**). Implement it with **`@/ui/Button`**, or **`Pressable`** + **`Text`**, wired through `useFormContext` and `form.Subscribe` for `isSubmitting` and related state. Keep the control in the `Form/` folder and register it from `index.tsx`.
- The key in **`formComponents`** becomes **`form.<Key>`** (for example `SubscribeButton` → **`form.SubscribeButton`**). Same for **`fieldComponents`**: **`InputField`** → **`field.InputField`** in **`form.AppField`** children.

### Screens and features

- Screens in `src/features/<feature>/` **compose** fields and the form hook; they **do not** redefine `createFormHook` or field contexts.
- Keep API submission beside other server logic (TanStack Query mutations, Axios clients) per [creating-api.md](./creating-api.md); use the form’s submit handler to call validated values into those layers.

## Official guides (behavior and APIs)

Use these for validation timing, submit lifecycle, and fine-grained reactivity. This skill does not duplicate those pages.

| Topic          | Doc                                                                                                        |
| -------------- | ---------------------------------------------------------------------------------------------------------- |
| **Validation** | [Form and field validation](https://tanstack.com/form/latest/docs/framework/react/guides/validation.md)    |
| **Submission** | [Submission handling](https://tanstack.com/form/latest/docs/framework/react/guides/submission-handling.md) |
| **Reactivity** | [Reactivity](https://tanstack.com/form/latest/docs/framework/react/guides/reactivity.md)                   |

## Setup

Install the package in the app project:

```bash
npm install @tanstack/react-form
```

## Composition shape

Build contexts in **`contexts.ts`**, define field and form components in sibling files, then pass them into **`createFormHook`** from **`index.tsx`**.

```tsx
// src/ui/Form/contexts.ts

import { createFormHookContexts } from "@tanstack/react-form";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();
```

```tsx
// src/ui/Form/index.tsx — illustrative layout

import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "./contexts";
import { InputField } from "./InputField";
import { SubscribeButton } from "./SubscribeButton";

const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    InputField,
  },
  formComponents: {
    SubscribeButton,
  },
});

export { useAppForm, withForm };
```

Registered field components appear on the **`field`** object inside **`form.AppField`** (for example `<field.InputField label="…" />`). Registered form components appear on **`form`** (for example `<form.SubscribeButton label="…" />` inside **`form.AppForm`**). See [Form composition](https://tanstack.com/form/latest/docs/framework/react/guides/form-composition.md) for `withForm`, lazy loading, and tree-shaking.

## Creating field components

### 1) Shared field shell

Create **`FieldShell.tsx`** so every field gets consistent label and error rendering. Wire the error slot to accept values from field meta and server mapping (see [managing-form-error.md](./managing-form-error.md)).

```tsx
// src/ui/Form/FieldShell.tsx

import type { ReactNode } from "react";
import { View } from "react-native";
import type { ApiError } from "@/lib/api-error";
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

When the project already has a registry **`Field`** primitive with label and error slots, use that instead of `FieldShell` and keep the same pre-bound field pattern below.

### 2) Pre-bound field file

Add one file per control, for example **`InputField.tsx`**. Use **`useFieldContext`**, connect the control to field state, and wrap with **`FieldShell`**.

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

Register **`InputField`** in `fieldComponents` inside **`index.tsx`**. Add Zod validators on the form so front-end validation runs automatically; error display in the shell is covered in [managing-form-error.md](./managing-form-error.md).

Repeat for other controls using the same **`NameOfControl + Field`** naming.

## Examples

### Feature screen composes `AppField` and pre-bound components

Screens call **`useAppForm`** from `@/ui/Form`, then use **`form.AppField`** so **`AppField`** supplies field context to pre-bound components.

```tsx
import { useAppForm } from "@/ui/Form";

export function SignInScreen() {
  const form = useAppForm({
    defaultValues: { email: "", password: "" },
    onSubmit: async ({ value }) => {
      /* call mutation / API — see submission guide */
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

Use **`form.AppForm`** where the composition guide requires the form context wrapper (for example around **`form.SubscribeButton`**). Rename keys in `formComponents` / `fieldComponents` if the app prefers different **`form.*`** / **`field.*`** names.

## Related

- [managing-form-error.md](./managing-form-error.md) — `onServer`, `onSubmit.fields`, and wiring errors into `FieldShell`
- [managing-state.md](./managing-state.md) — where API and client state live relative to forms
- [creating-api.md](./creating-api.md) — submitting validated payloads through feature hooks
