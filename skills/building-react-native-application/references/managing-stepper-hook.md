# Managing Stepper Hook

## Overview

Standardize Stepperize base usage in React Native features. Create one dedicated hook module per flow (e.g. `useBookingStepper.ts`) that exports the typed `useStepper` hook and `Scoped` provider from one `defineStepper` declaration.

## Guidelines

### File placement and naming

- One hook file per workflow in `src/features/<feature-name>/hooks/`, named `use<Feature>Stepper.ts`.
- Define steps once with `defineStepper(...)` in that file.
- Export at minimum:
  - `use<Feature>Stepper` (alias of `useStepper`)
  - `<Feature>StepperScoped` (alias of `Scoped`)

### Step shape

- Every step has a unique `id`.
- Add display fields (`title`, `description`) for UI labels.
- Keep step-specific metadata on step objects so screens read `stepper.state.current.data`.

### State sharing

| Pattern | When |
| --- | --- |
| `use<Feature>Stepper()` directly | One screen owns stepper state (no provider) |
| `<Feature>StepperScoped` wrapper | Multiple descendants share the same instance |

Keep one `defineStepper` source per flow.

### Navigation and rendering

- Prefer `stepper.flow.switch(...)` for step-by-step rendering.
- Use `stepper.flow.is(id)` for small conditional blocks.
- Use `stepper.navigation.next()`, `prev()`, `goTo(id)`, `reset()` for transitions.

## Setup

```bash
node ../scripts/install-packages.cjs @stepperize/react
```

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

### Shared-state usage with `Scoped`

```tsx
import { Pressable, Text, View } from "react-native";
import { BookingStepperScoped, useBookingStepper } from "@/features/booking/hooks/useBookingStepper";

export function BookingFlowScreen() {
  return (
    <BookingStepperScoped>
      <BookingStepContent />
      <BookingStepActions />
    </BookingStepperScoped>
  );
}

function BookingStepContent() {
  const stepper = useBookingStepper();

  return (
    <View>
      {stepper.flow.switch({
        details: () => <Text>Choose date and time.</Text>,
        contact: () => <Text>Enter contact details.</Text>,
        review: () => <Text>Review booking.</Text>,
        done: () => <Text>Booking complete.</Text>,
      })}
    </View>
  );
}

function BookingStepActions() {
  const stepper = useBookingStepper();

  return (
    <View className="flex-row gap-2">
      <Pressable onPress={() => stepper.navigation.prev()} disabled={stepper.state.isFirst}>
        <Text>Back</Text>
      </Pressable>
      <Pressable
        onPress={() =>
          stepper.state.isLast ? stepper.navigation.reset() : stepper.navigation.next()
        }
      >
        <Text>{stepper.state.isLast ? "Reset" : "Next"}</Text>
      </Pressable>
    </View>
  );
}
```

## Related

- [managing-state.md](./managing-state.md) — decide where stepper state lives
- [creating-feature.md](./creating-feature.md) — feature hook/file organization

## References

- [Stepperize — My first stepper](https://stepperize.vercel.app/docs/react/my-first-stepper)
- [Stepperize — Scoped](https://stepperize.vercel.app/docs/react/api-references/scoped)
- [Stepperize — Hook](https://stepperize.vercel.app/docs/react/api-references/hook)
