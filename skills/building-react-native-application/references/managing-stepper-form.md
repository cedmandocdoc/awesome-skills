# Managing Stepper Form

## Overview

Use this guide to build **multi-step forms** in React Native with **Stepperize + TanStack Form + Zod**. Attach per-step schemas to step definitions, read the active schema from `stepper.state.current.data`, and apply it to TanStack Form validators so each step validates only its own inputs.

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

- Build one TanStack Form instance for the full flow and keep values across steps.
- Use `validators.onChange` (or another chosen timing) with the active step schema.
- In `onSubmit`, advance with `stepper.navigation.next()` until the last step.
- Render step fields using `stepper.flow.switch(...)`.
- Render completion state with `stepper.flow.is("done")` (or your final step id).

## Setup

Install dependencies in the app project:

```bash
npm install @stepperize/react @tanstack/react-form zod
```

## Example

```tsx
import { Pressable, Text, TextInput, View } from "react-native";
import { useForm } from "@tanstack/react-form";
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

  const form = useForm<FormValues>({
    defaultValues: { name: "", email: "", street: "", city: "" },
    validators: { onChange: schema },
    onSubmit: () => {
      if (!stepper.state.isLast) stepper.navigation.next();
    },
  });

  if (stepper.flow.is("done")) return <Text>All done!</Text>;

  return (
    <View>
      {stepper.flow.switch({
        personal: () => (
          <View>
            <form.Field
              name="name"
              children={(field) => (
                <View>
                  <Text>Name</Text>
                  <TextInput
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChangeText={field.handleChange}
                  />
                </View>
              )}
            />
            <form.Field
              name="email"
              children={(field) => (
                <View>
                  <Text>Email</Text>
                  <TextInput
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChangeText={field.handleChange}
                  />
                </View>
              )}
            />
          </View>
        ),
        address: () => (
          <View>
            <form.Field
              name="street"
              children={(field) => (
                <View>
                  <Text>Street</Text>
                  <TextInput
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChangeText={field.handleChange}
                  />
                </View>
              )}
            />
            <form.Field
              name="city"
              children={(field) => (
                <View>
                  <Text>City</Text>
                  <TextInput
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChangeText={field.handleChange}
                  />
                </View>
              )}
            />
          </View>
        ),
        done: () => null,
      })}

      <View style={{ flexDirection: "row", gap: 8 }}>
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
    </View>
  );
}
```

## Related

- [managing-stepper-hook.md](./managing-stepper-hook.md) — base Stepperize hook/provider pattern
- [managing-form-components.md](./managing-form-components.md) — pre-bound TanStack Form composition in `src/ui/Form.tsx`
- [managing-state.md](./managing-state.md) — state ownership around multi-step flows
