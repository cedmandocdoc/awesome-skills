# Managing Stepper Form

## Overview

Use this guide to build **multi-step forms** with **Stepperize + `useAppForm` + Zod**. Define per-step schemas on the step objects, read the current step schema from `stepper.state.current.data`, and wire it into form validators so each step validates only its own fields. Compose step UI with **`form.AppField`** and pre-bound **`field.*`** components from `@/ui/Form`.

## Prerequisites

- [Stepperize — My first stepper](https://stepperize.vercel.app/docs/react/my-first-stepper)
- [Stepperize — Scoped](https://stepperize.vercel.app/docs/react/api-references/scoped)
- [Stepperize — Hook](https://stepperize.vercel.app/docs/react/api-references/hook)
- [Stepperize — Schema Validation](https://stepperize.vercel.app/docs/react/api-references/schema-validation)

## Guidelines

### Schema strategy

- Define a Zod schema for each form step.
- Attach each schema directly on the corresponding step object (for example `schema: PersonalSchema`).
- Read the active schema from `stepper.state.current.data.schema`.
- Fallback to `z.object({})` when a step has no schema (for example confirmation/done steps).

### Hook and provider convention

- Keep step definitions in a dedicated hook file (`use<Feature>Stepper.ts`).
- Export both:
  - `use<Feature>Stepper`
  - `<Feature>StepperScoped`
- Use `<Feature>StepperScoped>` when splitting content and navigation into separate descendants.

### Form flow

- Build one form instance with **`useAppForm`** from `@/ui/Form` (see [managing-form-components.md](./managing-form-components.md)) and persist values across steps.
- Use `validators.onChange` (or the chosen validator timing) with the **current step schema**.
- In `onSubmit`, call `stepper.navigation.next()` when not on the last step.
- Render per-step fields with `stepper.flow.switch(...)` and compose inputs via **`form.AppField`** + pre-bound **`field.*`** components.
- Use `stepper.flow.is("done")` (or final step ID) for completion state.

## Setup

Install dependencies in the app project:

```bash
npm install @stepperize/react @tanstack/react-form zod
```

## Example

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

## Related

- [managing-form-components.md](./managing-form-components.md) — pre-bound TanStack Form composition in `src/ui/Form/`
- [managing-stepper-hook.md](./managing-stepper-hook.md) — base hook/provider pattern for Stepperize
- [managing-state.md](./managing-state.md) — decide local/store/server responsibilities around forms
