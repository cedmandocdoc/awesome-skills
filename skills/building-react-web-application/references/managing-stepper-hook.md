# Managing Stepper Hook

## Overview

**Execution mode.** Creates one dedicated hook module per stepper flow (e.g. `useBookingStepper.ts`) that exports the typed `useStepper` hook and `Scoped` provider from a single `defineStepper` declaration.

## Prerequisites

- [Stepperize — My first stepper](https://stepperize.vercel.app/docs/react/my-first-stepper)
- [Stepperize — Scoped](https://stepperize.vercel.app/docs/react/api-references/scoped)
- [Stepperize — Hook](https://stepperize.vercel.app/docs/react/api-references/hook)

## Guidelines

### Placement and exports

- One hook file per workflow in `src/features/<feature>/hooks/`, named `use<Feature>Stepper.ts`.
- Define steps once with `defineStepper(...)`.
- Export at minimum:
  - `use<Feature>Stepper` (alias of `useStepper`)
  - `<Feature>StepperScoped` (alias of `Scoped`)

### Step shape

- Each step has a unique `id`.
- Add display fields (`title`, `description`) for rendering labels and headings.
- Keep business-specific metadata on the step object so rendering and validation read from `stepper.state.current.data`.

### State sharing

- `use<Feature>Stepper()` directly → local stepper state (no provider).
- `<Feature>StepperScoped>` → multiple descendants share the same instance.

### Navigation API

- `stepper.flow.switch(...)` for multi-step rendering branches.
- `stepper.flow.is(id)` for simple conditionals.
- `stepper.navigation.next()`, `prev()`, `goTo(id)`, `reset()` for transitions.

## Examples

### Feature hook

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

### Shared state with `Scoped`

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
    <button type="button" onClick={() => stepper.navigation.reset()}>Reset</button>
  ) : (
    <>
      <button type="button" onClick={() => stepper.navigation.prev()} disabled={stepper.state.isFirst}>Back</button>
      <button type="button" onClick={() => stepper.navigation.next()}>Next</button>
    </>
  );
}
```

### Local state without provider

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

```bash
node ../scripts/install-packages.cjs @stepperize/react
```

## Related

- [managing-state.md](./managing-state.md) — where wizard state lives
- [creating-feature.md](./creating-feature.md) — feature hook/file organization
