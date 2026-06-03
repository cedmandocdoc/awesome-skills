# Managing Stepper Hook

## Overview

Use this guide to standardize **Stepperize** base usage in React Native features. Create one dedicated hook module per flow (for example `useBookingStepper.ts`) that exports the typed `useStepper` hook and `Scoped` provider from one `defineStepper` declaration.

This centralizes step definitions, keeps step IDs type-safe, and supports both local (hook-owned) and shared (provider-backed) stepper state patterns.

## Prerequisites

- [Stepperize — My first stepper](https://stepperize.vercel.app/docs/react/my-first-stepper)
- [Stepperize — Scoped](https://stepperize.vercel.app/docs/react/api-references/scoped)
- [Stepperize — Hook](https://stepperize.vercel.app/docs/react/api-references/hook)

## Guidelines

### File placement and naming

- Create one hook file per workflow in `src/features/<feature-name>/hooks/`, named `use<Feature>Stepper.ts` (for example `useBookingStepper.ts`).
- Define steps once with `defineStepper(...)` in that file.
- Export at minimum:
  - `use<Feature>Stepper` (alias of Stepperize `useStepper`)
  - `<Feature>StepperScoped` (alias of Stepperize `Scoped`)

### Step shape

- Every step must have a unique `id`.
- Add display fields such as `title` and `description` for UI labels.
- Keep step-specific metadata on step objects so screens can read `stepper.state.current.data`.

### State sharing rules

- Use `use<Feature>Stepper()` directly in one screen component for local stepper state (no provider required).
- Use `<Feature>StepperScoped>` when multiple descendants need the same stepper instance.
- Keep one `defineStepper` source per flow; do not duplicate it across files.

### Navigation and rendering

- Prefer `stepper.flow.switch(...)` for step-by-step rendering.
- Use `stepper.flow.is(id)` for small conditional blocks.
- Use `stepper.navigation.next()`, `prev()`, `goTo(id)`, and `reset()` for transitions.

## Setup

Install Stepperize in the app project:

```bash
npm install @stepperize/react
```

## Example

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

- [managing-state.md](./managing-state.md) — decide where stepper state should live
- [creating-feature.md](./creating-feature.md) — feature hook/file organization
