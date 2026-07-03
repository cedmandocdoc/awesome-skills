# Managing Stepper Hook

## Overview

Use this guide to standardize **Stepperize** base usage in React web features. Create one dedicated hook module per flow (for example `useBookingStepper.ts`) that exports the typed `useStepper` hook and `Scoped` provider from one `defineStepper` declaration.

This keeps step definitions centralized, makes step IDs type-safe across the feature, and allows both local (hook-owned) and shared (provider-backed) stepper state patterns.

## Prerequisites

- [Stepperize — My first stepper](https://stepperize.vercel.app/docs/react/my-first-stepper)
- [Stepperize — Scoped](https://stepperize.vercel.app/docs/react/api-references/scoped)
- [Stepperize — Hook](https://stepperize.vercel.app/docs/react/api-references/hook)

## Guidelines

### File placement and naming

- Create one hook file per workflow in `src/features/<feature>/hooks/`, named `use<Feature>Stepper.ts` (for example `useBookingStepper.ts`).
- Define steps once with `defineStepper(...)` in that file.
- Export at minimum:
  - `use<Feature>Stepper` (alias of Stepperize `useStepper`)
  - `<Feature>StepperScoped` (alias of Stepperize `Scoped`)

### Step shape

- Each step must have a unique `id`.
- Add display fields such as `title` or `description` for rendering labels and headings.
- Keep business-specific step metadata on the step object so rendering and validation logic can read from `stepper.state.current.data`.

### State sharing rules

- Use `use<Feature>Stepper()` directly in a component for local stepper state (no provider required).
- Use `<Feature>StepperScoped>` when multiple descendants must share the same stepper instance.
- Do not mix different `defineStepper` instances for the same flow.

### Navigation and rendering

- Prefer `stepper.flow.switch(...)` for multi-step rendering branches.
- Use `stepper.flow.is(id)` for simple conditionals.
- Use `stepper.navigation.next()`, `prev()`, `goTo(id)`, and `reset()` for transitions.

### Example

### Feature hook: `useBookingStepper`

```ts
import { defineStepper } from "@stepperize/react";

const bookingStepper = defineStepper(
  { id: "details", title: "Booking details" },
  { id: "contact", title: "Contact information" },
  { id: "review", title: "Review booking" },
  { id: "done", title: "Done" },
);

export const useBookingStepper = bookingStepper.useStepper;
export const BookingStepperScoped = bookingStepper.Scoped;
```

### Shared-state usage with `Scoped`

```tsx
import { BookingStepperScoped, useBookingStepper } from "@/features/booking/hooks/useBookingStepper";

export function BookingFlow() {
  return (
    <BookingStepperScoped>
      <BookingStepContent />
      <BookingStepActions />
    </BookingStepperScoped>
  );
}

function BookingStepContent() {
  const stepper = useBookingStepper();

  return stepper.flow.switch({
    details: () => <p>Choose date and time.</p>,
    contact: () => <p>Enter contact details.</p>,
    review: () => <p>Review booking.</p>,
    done: () => <p>Booking complete.</p>,
  });
}

function BookingStepActions() {
  const stepper = useBookingStepper();

  return stepper.state.isLast ? (
    <button type="button" onClick={() => stepper.navigation.reset()}>
      Reset
    </button>
  ) : (
    <>
      <button type="button" onClick={() => stepper.navigation.prev()} disabled={stepper.state.isFirst}>
        Back
      </button>
      <button type="button" onClick={() => stepper.navigation.next()}>
        Next
      </button>
    </>
  );
}
```

### Local-state usage without provider

```tsx
import { useBookingStepper } from "@/features/booking/hooks/useBookingStepper";

export function BookingMiniStepper() {
  const stepper = useBookingStepper();

  return (
    <section>
      <h2>{stepper.state.current.data.title}</h2>
      <button type="button" onClick={() => stepper.navigation.next()} disabled={stepper.state.isLast}>
        Continue
      </button>
    </section>
  );
}
```

## Setup

Install Stepperize in the app project:

```bash
npm install @stepperize/react
```

## Related

- [managing-state.md](./managing-state.md) — choose where wizard state should live
- [creating-feature.md](./creating-feature.md) — feature hook/file organization
