# Managing Stepper Form

## Overview

Use this guide to build **multi-step forms** in React Native with **Stepperize + `useAppForm` + Zod**. Attach per-step schemas to step definitions, read the active schema from `stepper.state.current.data`, and apply it to form validators so each step validates only its own inputs. Compose step UI with **`form.AppField`** and pre-bound **`field.*`** components from `@/ui/Form`.

## Prerequisites

- [Stepperize — My first stepper](https://stepperize.vercel.app/docs/react/my-first-stepper)
- [Stepperize — Scoped](https://stepperize.vercel.app/docs/react/api-references/scoped)
- [Stepperize — Hook](https://stepperize.vercel.app/docs/react/api-references/hook)
- [Stepperize — Schema Validation](https://stepperize.vercel.app/docs/react/api-references/schema-validation)
- [TanStack Form — Basic concepts](https://tanstack.com/form/latest/docs/framework/react/guides/basic-concepts.md)

## Guidelines

### Schema strategy

- Define one Zod schema per form step.
- Attach each schema on the step object (for example `schema: PersonalSchema`).
- Resolve the active schema from `stepper.state.current.data.schema`.
- Fallback to `z.object({})` for steps without fields (for example confirmation/done).

### Hook and provider convention

- Keep Stepperize definitions in a dedicated hook file (`use<Feature>Stepper.ts`).
- Export both:
  - `use<Feature>Stepper`
  - `<Feature>StepperScoped`
- Use `<Feature>StepperScoped>` when form content and navigation actions are split into different descendants.

### Form flow

- Build one form instance with **`useAppForm`** from `@/ui/Form` (see [creating-form-component.md](./creating-form-component.md)) and keep values across steps.
- Use `validators.onChange` (or another chosen timing) with the active step schema.
- In `onSubmit`, advance with `stepper.navigation.next()` until the last step.
- Render step fields using `stepper.flow.switch(...)` and compose inputs via **`form.AppField`** + pre-bound **`field.*`** components.
- Render completion state with `stepper.flow.is("done")` (or your final step id).

### Example

```tsx
import { Pressable, Text, View } from "react-native";
import { useAppForm } from "@/ui/Form";
import { z } from "zod";
import { defineStepper } from "@stepperize/react";

const PersonalSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Email is invalid"),
});

const AddressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
});

const checkoutStepper = defineStepper(
  { id: "personal", title: "Personal information", schema: PersonalSchema },
  { id: "address", title: "Address", schema: AddressSchema },
  { id: "done", title: "Done" },
);

export const useCheckoutStepper = checkoutStepper.useStepper;
export const CheckoutStepperScoped = checkoutStepper.Scoped;

type FormValues = {
  name: string;
  email: string;
  street: string;
  city: string;
};

export function CheckoutStepFormScreen() {
  const stepper = useCheckoutStepper();
  const stepData = stepper.state.current.data;
  const schema =
    "schema" in stepData && stepData.schema
      ? (stepData.schema as z.ZodType<FormValues>)
      : z.object({});

  const form = useAppForm({
    defaultValues: { name: "", email: "", street: "", city: "" },
    validators: { onChange: schema },
    onSubmit: () => {
      if (!stepper.state.isLast) stepper.navigation.next();
    },
  });

  if (stepper.flow.is("done")) return <Text>All done!</Text>;

  return (
    <form.AppForm>
      {stepper.flow.switch({
        personal: () => (
          <View>
            <form.AppField
              name="name"
              children={(field) => <field.InputField label="Name" />}
            />
            <form.AppField
              name="email"
              children={(field) => <field.InputField label="Email" />}
            />
          </View>
        ),
        address: () => (
          <View>
            <form.AppField
              name="street"
              children={(field) => <field.InputField label="Street" />}
            />
            <form.AppField
              name="city"
              children={(field) => <field.InputField label="City" />}
            />
          </View>
        ),
        done: () => null,
      })}

      <View className="flex-row gap-2">
        <Pressable onPress={() => stepper.navigation.prev()} disabled={stepper.state.isFirst}>
          <Text>Back</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            void form.handleSubmit();
          }}
        >
          <Text>{stepper.state.isLast ? "Submit" : "Next"}</Text>
        </Pressable>
      </View>
    </form.AppForm>
  );
}
```

## Setup

Install dependencies in the app project:

```bash
npm install @stepperize/react @tanstack/react-form zod
```

## Related

- [managing-stepper-hook.md](./managing-stepper-hook.md) — base Stepperize hook/provider pattern
- [creating-form-component.md](./creating-form-component.md) — pre-bound TanStack Form composition in `src/ui/Form/`
- [managing-state.md](./managing-state.md) — state ownership around multi-step flows
