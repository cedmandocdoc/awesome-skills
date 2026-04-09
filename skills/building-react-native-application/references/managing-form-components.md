# Managing Form Components

## Overview

Use this guide to wire **TanStack Form** in Expo React Native apps with a **single composition root** in `src/ui/Form.tsx`. Pre-bind field and submit UI there so screens only compose small, typed field components and stay free of repeated wiring (labels, errors, field state).

For field-level layout and presentational rules, align with [creating-component.md](./creating-component.md) and [placing-component.md](./placing-component.md). TanStack Form is **headless** — it does not assume DOM or native widgets. This file focuses on **where code lives** and **how to compose and reuse** fields in this stack.

## Prerequisites

- [building-react-application](../../building-react-application/SKILL.md) — TanStack Form overview and shared reference table (install `@tanstack/react-form`)
- [TanStack Form — Basic concepts](https://tanstack.com/form/latest/docs/framework/react/guides/basic-concepts) — form instances, fields, meta, subscribers
- [TanStack Form — Form composition](https://tanstack.com/form/latest/docs/framework/react/guides/form-composition) — `createFormHook`, pre-bound components, contexts

## Guidelines

### Library and file placement

- Use **`@tanstack/react-form`** for form state. Bind field values and handlers to React Native controls in pre-bound components (for example **`TextInput`**, switches, pickers).
- Keep **all pre-bound form pieces** (contexts, `createFormHook`, and components passed into `fieldComponents` / `formComponents`) in **one module**, preferably **`src/ui/Form.tsx`**. Feature screens import the app hook (for example `useAppForm`) and pre-bound field components from there — not from scattered helpers.

### Pre-bound strategy

- **Abstract field state in pre-bound components** — each exported field component is already connected to TanStack Field APIs (via `createFormHook`’s `fieldComponents`). Call sites pass **name** and domain props only; they do not reimplement `useField` wiring per screen.
- **Reuse a shared `Field` UI** when the project already has a primitive that owns label, layout, and error placement (common in registry-backed UI). Pass the control (input) as a child or render prop inside the pre-bound field so **style and layout stay centralized** in `Field`.
- **If no `Field` exists**, add a **small local wrapper** in `Form.tsx` (or next to it only if splitting for size) that renders at least **label** and **error** text from field meta, and wrap the input. Do not duplicate that wrapper in every feature.

### Submit actions

- Pre-bind the app’s **submit control** in `formComponents` (the TanStack docs often use **`SubscribeButton`**). Implement it with **`@/ui/Button`**, or **`Pressable`** + **`Text`**, or another native-appropriate control. Official snippets may use **`<button>`** for brevity; replace with your RN equivalent inside the same `Form.tsx` registration.
- The key in **`formComponents`** becomes **`form.<Key>`** (for example `Button` → **`form.Button`**). Same for **`fieldComponents`**: **`FieldComponent`** → **`field.FieldComponent`** in **`form.AppField`** children.

### Screens and features

- Screens in `src/features/<feature>/` **compose** fields and the form hook; they **do not** redefine `createFormHook` or field contexts.
- Keep API submission beside other server logic (TanStack Query mutations, Axios clients) per [creating-api.md](./creating-api.md); use the form’s submit handler to call validated values into those layers.

## Official guides (behavior and APIs)

Use these for validation timing, submit lifecycle, and fine-grained reactivity. This skill does not duplicate those pages.

| Topic          | Doc                                                                                                     |
| -------------- | ------------------------------------------------------------------------------------------------------- |
| **Validation** | [Form and field validation](https://tanstack.com/form/latest/docs/framework/react/guides/validation)    |
| **Submission** | [Submission handling](https://tanstack.com/form/latest/docs/framework/react/guides/submission-handling) |
| **Reactivity** | [Reactivity](https://tanstack.com/form/latest/docs/framework/react/guides/reactivity)                   |

## Setup

Install the package in the app project:

```bash
npm install @tanstack/react-form
```

## Composition shape

The module exports **one hook** created with `createFormHook` and **pre-bound** field/form components. Build contexts with **`createFormHookContexts`**, then pass `fieldContext` and `formContext` into **`createFormHook`**. Keep that wiring and every pre-bound component in **`Form.tsx`**.

Expected structure (names may match your app; keep the pattern):

```tsx
// src/ui/Form.tsx — illustrative layout

import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
// import { TextInput, View, Text } from "react-native";
// import { Field } from "@/ui/Field"; // when present — label + layout + error slot
// import { Button as UIButton } from "@/ui/Button"; // when present

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

/** Pre-bound field: useFieldContext + shared Field shell (label + error). */
function TextField({ label }: { label: string }) {
  const field = useFieldContext<string>();
  // Wrap TextInput with Field (or custom label + error) using field.state.meta
  return null;
}

/** Pre-bound submit: useFormContext + form.Subscribe for isSubmitting, etc. */
function SubscribeButton({ label }: { label: string }) {
  const form = useFormContext();
  return null;
}

const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
  },
  formComponents: {
    SubscribeButton,
  },
});

export { useAppForm, withForm };
```

Conceptually this matches the pre-bound map (keys define **`field.*`** and **`form.*`** names):

```tsx
// fieldComponents: { FieldComponent, … }  →  <field.FieldComponent … />
// formComponents: { Button, … }            →  <form.Button … />
const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    FieldComponent,
  },
  formComponents: {
    Button,
  },
});
```

Declare **`FieldComponent`** and **`Button`** above this call, or assign with aliases (for example `FieldComponent: TextField`) when the implementation keeps a different local name.

Registered field components appear on the **`field`** object inside **`form.AppField`** (for example `<field.TextField label="…" />`). Registered form components appear on **`form`** (for example `<form.SubscribeButton label="…" />` inside **`form.AppForm`**). See [Form composition](https://tanstack.com/form/latest/docs/framework/react/guides/form-composition) for `withForm`, lazy loading, and tree-shaking.

## Examples

### Feature screen composes `AppField` and pre-bound components

Screens call **`useAppForm`** from `@/ui/Form`, then use **`form.AppField`** so **`AppField`** supplies field context to pre-bound components. Pre-bound fields are accessed as **`field.TextField`** (matching the key in `fieldComponents`).

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
        children={(field) => <field.TextField label="Email" />}
      />
      <form.AppField
        name="password"
        children={(field) => <field.TextField label="Password" />}
      />
      <form.SubscribeButton label="Sign in" />
    </form.AppForm>
  );
}
```

Use **`form.AppForm`** where the composition guide requires the form context wrapper (for example around **`form.SubscribeButton`**). Rename **`SubscribeButton`** in `formComponents` if you prefer **`FormButton`**; the **`form.*`** name follows the registered key.

### Custom `Field` shell when no registry primitive exists

Implement a thin wrapper in `Form.tsx` that accepts `label`, optional `description`, `error` from field meta, and `children` for the input. Pre-bound fields pass `TextInput` (or other controls) as children so every screen gets consistent spacing and error placement.

## Related

- [managing-state.md](./managing-state.md) — where API and client state live relative to forms
- [creating-api.md](./creating-api.md) — submitting validated payloads through feature hooks
