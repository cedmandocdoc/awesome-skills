# Managing Stepper Form

## Overview

**Execution mode.** Builds **multi-step forms** with **Stepperize + `useAppForm` + Zod**. Per-step schemas on step objects drive validation; the form persists values across steps. Field values stay in TanStack Form — do not mirror form fields in Zustand.

## Prerequisites

- [managing-stepper-hook.md](./managing-stepper-hook.md) — hook/provider pattern, `defineStepper`, exports
- [creating-form-component.md](./creating-form-component.md) — pre-bound `*Field` components, `useAppForm`
- [Stepperize — Schema Validation](https://stepperize.vercel.app/docs/react/api-references/schema-validation)

## Guidelines

### Schema strategy

- Define a Zod schema for each form step.
- Attach each schema on the corresponding step object (e.g. `schema: PersonalSchema`).
- Read the active schema from `stepper.state.current.data.schema`.
- Fall back to `z.object({})` for steps without a schema (e.g. confirmation).

### Form flow

- Build one form instance with `useAppForm` from `@/ui/Form` and persist values across steps.
- Use `validators.onChange` (or chosen timing) with the current step schema.
- In `onSubmit`, call `stepper.navigation.next()` when not on the last step.
- Render per-step fields with `stepper.flow.switch(...)` and compose via `form.AppField` + pre-bound `field.*` components.
- Use `stepper.flow.is("done")` for completion state.

## Examples

### Multi-step form

```tsx
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

const MultiStepSchema = defineStepper(
  { id: "personal", title: "Personal information", schema: PersonalSchema },
  { id: "address", title: "Address", schema: AddressSchema },
  { id: "done", title: "Done" },
);

export const useCheckoutStepper = MultiStepSchema.useStepper;
export const CheckoutStepperScoped = MultiStepSchema.Scoped;

type FormValues = {
  name: string;
  email: string;
  street: string;
  city: string;
};

export function CheckoutStepForm() {
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

  if (stepper.flow.is("done")) return <p>All done!</p>;

  return (
    <form.AppForm>
      {stepper.flow.switch({
        personal: () => (
          <div>
            <form.AppField
              name="name"
              children={(field) => <field.InputField label="Name" />}
            />
            <form.AppField
              name="email"
              children={(field) => <field.InputField label="Email" />}
            />
          </div>
        ),
        address: () => (
          <div>
            <form.AppField
              name="street"
              children={(field) => <field.InputField label="Street" />}
            />
            <form.AppField
              name="city"
              children={(field) => <field.InputField label="City" />}
            />
          </div>
        ),
        done: () => null,
      })}

      <div>
        <button type="button" onClick={() => stepper.navigation.prev()} disabled={stepper.state.isFirst}>
          Back
        </button>
        <button
          type="button"
          onClick={() => {
            void form.handleSubmit();
          }}
        >
          {stepper.state.isLast ? "Submit" : "Next"}
        </button>
      </div>
    </form.AppForm>
  );
}
```

## Setup

```bash
node ../scripts/install-packages.cjs @stepperize/react @tanstack/react-form zod
```

## Related

- [creating-form-component.md](./creating-form-component.md) — pre-bound TanStack Form composition
- [managing-stepper-hook.md](./managing-stepper-hook.md) — base hook/provider pattern
- [managing-state.md](./managing-state.md) — state tool responsibilities around forms
