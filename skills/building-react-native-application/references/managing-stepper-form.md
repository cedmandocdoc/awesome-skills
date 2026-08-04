# Managing Stepper Form

## Overview

Build multi-step forms with Stepperize + `useAppForm` + Zod. Attach per-step schemas to step definitions, read the active schema from `stepper.state.current.data`, and apply it to form validators so each step validates only its own inputs.

## Prerequisites

- [managing-stepper-hook.md](./managing-stepper-hook.md) — hook/provider pattern, file placement, exports
- [creating-form-component.md](./creating-form-component.md) — pre-bound TanStack Form composition in `src/ui/Form/`

## Guidelines

### Schema strategy

- Define one Zod schema per form step.
- Attach each schema on the step object (e.g. `schema: PersonalSchema`).
- Resolve the active schema from `stepper.state.current.data.schema`.
- Fallback to `z.object({})` for steps without fields.

### Form flow

- Build one form instance with `useAppForm` from `@/ui/Form` and keep values across steps.
- Use `validators.onChange` (or another timing) with the active step schema.
- In `onSubmit`, advance with `stepper.navigation.next()` until the last step.
- Render step fields using `stepper.flow.switch(...)` and compose via `form.AppField` + pre-bound `field.*` components.
- Render completion with `stepper.flow.is("done")`.

## Setup

```bash
node ../scripts/install-packages.cjs @stepperize/react @tanstack/react-form zod
```

## Examples

### Multi-step checkout form

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

## Related

- [managing-stepper-hook.md](./managing-stepper-hook.md) — base Stepperize hook/provider pattern
- [managing-state.md](./managing-state.md) — state ownership around multi-step flows

## References

- [Stepperize — Schema Validation](https://stepperize.vercel.app/docs/react/api-references/schema-validation)
- [TanStack Form — Basic concepts](https://tanstack.com/form/latest/docs/framework/react/guides/basic-concepts.md)
