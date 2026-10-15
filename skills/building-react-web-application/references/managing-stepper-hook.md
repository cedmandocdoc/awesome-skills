# Managing Stepper Hook

## Overview

**Execution mode.** Creates one dedicated hook module per stepper flow (e.g. `useBookingStepper.ts`) that exports the typed hooks and `Provider` from a single `defineStepper` declaration.

## Prerequisites

- [Stepperize — First stepper](https://stepperize.com/docs/v8/getting-started/first-stepper)
- [Stepperize — Local and shared state](https://stepperize.com/docs/v8/guides/local-and-shared-state)
- [Stepperize — Stepper instance](https://stepperize.com/docs/v8/api/react/stepper-instance)

## Guidelines

### Placement and exports

- One hook file per workflow in `src/features/<feature>/hooks/`, named `use<Feature>Stepper.ts`.
- Define steps once with `defineStepper([...])`.
- Export at minimum:
  - `use<Feature>Stepper` (alias of `useStepper`)
  - `<Feature>StepperProvider` (alias of `Provider`)
  - `use<Feature>StepperContext` (alias of `useStepperContext`)

### Step shape

- Each step has a unique `id`.
- Add display fields (`title`, `description`) for rendering labels and headings.
- Keep business-specific metadata on the step object so rendering and validation read from `stepper.current`.

### State sharing

- `use<Feature>Stepper()` → a new local instance, even inside the provider.
- `<Feature>StepperProvider` + `use<Feature>StepperContext()` → multiple descendants share the same instance.

### Navigation API

- `stepper.match(...)` for multi-step rendering branches.
- `stepper.is(id)` for simple conditionals.
- `stepper.next()`, `prev()`, `goTo(id)`, `reset()` for transitions.

## Setup

```bash
node ../scripts/install-packages.cjs @stepperize/react
```

## Examples

### Feature hook

```ts
import { defineStepper } from "@stepperize/react";

const bookingStepper = defineStepper([
  { id: "details", title: "Booking details" },
  { id: "contact", title: "Contact information" },
  { id: "review", title: "Review booking" },
  { id: "done", title: "Done" },
]);

export const useBookingStepper = bookingStepper.useStepper;
export const BookingStepperProvider = bookingStepper.Provider;
export const useBookingStepperContext = bookingStepper.useStepperContext;
```

### Shared state with `Provider`

```tsx
import { BookingStepperProvider, useBookingStepperContext } from "@/features/booking/hooks/useBookingStepper";

export function BookingFlow() {
  return (
    <BookingStepperProvider>
      <BookingStepContent />
      <BookingStepActions />
    </BookingStepperProvider>
  );
}

function BookingStepContent() {
  const stepper = useBookingStepperContext();

  return stepper.match({
    details: () => <p>Choose date and time.</p>,
    contact: () => <p>Enter contact details.</p>,
    review: () => <p>Review booking.</p>,
    done: () => <p>Booking complete.</p>,
  });
}

function BookingStepActions() {
  const stepper = useBookingStepperContext();

  return stepper.isLast ? (
    <button type="button" onClick={() => stepper.reset()}>Reset</button>
  ) : (
    <>
      <button type="button" onClick={() => stepper.prev()} disabled={stepper.isFirst}>Back</button>
      <button type="button" onClick={() => stepper.next()}>Next</button>
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
      <h2>{stepper.current.title}</h2>
      <button type="button" onClick={() => stepper.next()} disabled={stepper.isLast}>
        Continue
      </button>
    </section>
  );
}
```

## Related

- [managing-state.md](./managing-state.md) — where wizard state lives
- [creating-feature.md](./creating-feature.md) — feature hook/file organization
