# Managing Stepper Form

## Overview

Use this guide to build **multi-step forms** with **Stepperize + TanStack Form + Zod**. Define per-step schemas on the step objects, read the current step schema from `stepper.state.current.data`, and wire it into TanStack Form validators so each step validates only its own fields.

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

- Build one TanStack Form instance for the whole flow and persist values across steps.
- Use `validators.onChange` (or the chosen validator timing) with the **current step schema**.
- In `onSubmit`, call `stepper.navigation.next()` when not on the last step.
- Render per-step fields with `stepper.flow.switch(...)`.
- Use `stepper.flow.is("done")` (or final step ID) for completion state.

## Setup

Install dependencies in the app project:

```bash
npm install @stepperize/react @tanstack/react-form zod
```

## Example

```tsx
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

  const form = useForm<FormValues>({
    defaultValues: { name: "", email: "", street: "", city: "" },
    validators: { onChange: schema },
    onSubmit: () => {
      if (!stepper.state.isLast) stepper.navigation.next();
    },
  });

  if (stepper.flow.is("done")) return <p>All done!</p>;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      {stepper.flow.switch({
        personal: () => (
          <div>
            <form.Field
              name="name"
              children={(field) => (
                <div>
                  <label htmlFor={field.name}>Name</label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            />
            <form.Field
              name="email"
              children={(field) => (
                <div>
                  <label htmlFor={field.name}>Email</label>
                  <input
                    id={field.name}
                    name={field.name}
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            />
          </div>
        ),
        address: () => (
          <div>
            <form.Field
              name="street"
              children={(field) => (
                <div>
                  <label htmlFor={field.name}>Street</label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            />
            <form.Field
              name="city"
              children={(field) => (
                <div>
                  <label htmlFor={field.name}>City</label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            />
          </div>
        ),
        done: () => null,
      })}

      <div>
        <button type="button" onClick={() => stepper.navigation.prev()} disabled={stepper.state.isFirst}>
          Back
        </button>
        <button type="submit">{stepper.state.isLast ? "Submit" : "Next"}</button>
      </div>
    </form>
  );
}
```

## Related

- [managing-stepper-hook.md](./managing-stepper-hook.md) — base hook/provider pattern for Stepperize
- [managing-state.md](./managing-state.md) — decide local/store/server responsibilities around forms
