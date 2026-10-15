# Managing Stepper Hook

## Overview

Standardize Stepperize base usage in React Native features. Create one dedicated hook module per flow (e.g. `useBookingStepper.ts`) that exports the typed hooks and `Provider` from one `defineStepper` declaration.

## Guidelines

### File placement and naming

- One hook file per workflow in `src/features/<feature-name>/hooks/`, named `use<Feature>Stepper.ts`.
- Define steps once with `defineStepper([...])` in that file.
- Export at minimum:
  - `use<Feature>Stepper` (alias of `useStepper`)
  - `<Feature>StepperProvider` (alias of `Provider`)
  - `use<Feature>StepperContext` (alias of `useStepperContext`)

### Step shape

- Every step has a unique `id`.
- Add display fields (`title`, `description`) for UI labels.
- Keep step-specific metadata on step objects so screens read `stepper.current`.

### State sharing

| Pattern | When |
| --- | --- |
| `use<Feature>Stepper()` | One screen owns stepper state; always a new local instance, even inside the provider |
| `<Feature>StepperProvider` + `use<Feature>StepperContext()` | Multiple descendants share the same instance |

Keep one `defineStepper` source per flow.

### Navigation and rendering

- Prefer `stepper.match(...)` for step-by-step rendering.
- Use `stepper.is(id)` for small conditional blocks.
- Use `stepper.next()`, `prev()`, `goTo(id)`, `reset()` for transitions.

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

### Shared-state usage with `Provider`

```tsx
import { Pressable, Text, View } from "react-native";
import { BookingStepperProvider, useBookingStepperContext } from "@/features/booking/hooks/useBookingStepper";

export function BookingFlowScreen() {
  return (
    <BookingStepperProvider>
      <BookingStepContent />
      <BookingStepActions />
    </BookingStepperProvider>
  );
}

function BookingStepContent() {
  const stepper = useBookingStepperContext();

  return (
    <View>
      {stepper.match({
        details: () => <Text>Choose date and time.</Text>,
        contact: () => <Text>Enter contact details.</Text>,
        review: () => <Text>Review booking.</Text>,
        done: () => <Text>Booking complete.</Text>,
      })}
    </View>
  );
}

function BookingStepActions() {
  const stepper = useBookingStepperContext();

  return (
    <View className="flex-row gap-2">
      <Pressable onPress={() => stepper.prev()} disabled={stepper.isFirst}>
        <Text>Back</Text>
      </Pressable>
      <Pressable
        onPress={() => (stepper.isLast ? stepper.reset() : stepper.next())}
      >
        <Text>{stepper.isLast ? "Reset" : "Next"}</Text>
      </Pressable>
    </View>
  );
}
```

## Related

- [managing-state.md](./managing-state.md) — decide where stepper state lives
- [creating-feature.md](./creating-feature.md) — feature hook/file organization

## References

- [Stepperize — First stepper](https://stepperize.com/docs/v8/getting-started/first-stepper)
- [Stepperize — Local and shared state](https://stepperize.com/docs/v8/guides/local-and-shared-state)
- [Stepperize — Stepper instance](https://stepperize.com/docs/v8/api/react/stepper-instance)
