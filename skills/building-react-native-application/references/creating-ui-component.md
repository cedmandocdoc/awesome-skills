# Creating UI Component

## Overview

Create **shared presentational primitives** in `src/ui/`. Start from the [creating-component.md](./creating-component.md) decision tree.

**Registry-first:** check `src/ui/` for an existing primitive. If missing, validate with React Native Reusables via `shadcn view` before vendoring. Build manually only when validation fails or no registry item fits.

## Prerequisites

- [creating-component.md](./creating-component.md) — placement and shared rules
- [setting-up-registry-components.md](./setting-up-registry-components.md) — one-time shell (Lucide, `inlineRem`, `PortalHost`) when the app has not been set up yet
- [managing-wrapper-components.md](./managing-wrapper-components.md) — `className` merging on shared components

## Guidelines

- Use React Native primitives or `@/ui/*` when composing.
- Keep components presentation-only — props in, UI out.
- Normalize **`cn` → `cx`**: import **`cx`** from **`class-variance-authority`** when editing registry output by hand.

### Folder layout

`src/ui/` stays **flat and presentation-only** — no business logic, features, API, or stores. The layout below is the default; group files when a subsystem owns multiple related pieces.

```text
src/ui/
├── Button.tsx                # single primitive — one export per file
├── ButtonText.tsx            # compound part (sibling file)
├── hooks/                    # reusable UI-only hooks (e.g. useMediaQuery)
├── Form/                     # composition root — see creating-form-component.md
│   ├── index.tsx             # public barrel for the group
│   └── InputField.tsx
├── Async/                    # composition root — see creating-async-component.md
└── BottomSheet/              # composition root — see creating-bottom-sheet-component.md
```

### Layout rules

- Prefer `src/ui/<Component>.tsx` for standalone primitives; import with `@/ui/<Component>`.
- Group related files under `src/ui/<GroupName>/` when the subsystem has multiple files; export the public API from `index.tsx` or `index.ts`.
- Put reusable UI-only hooks in `src/ui/hooks/` — not feature or data hooks.
- Named composition roots (`Form/`, `Async/`, `BottomSheet/`) follow the same group + barrel pattern.

### Naming

- Generic, unprefixed names: `Button`, `TextInput`, `Modal`, `Card`.
- Compound parts share the root prefix: `Button`, `ButtonText`, `ButtonIcon` — **one export per file**.
- Do not encode variant state in the name (`PrimaryButton` → `Button` with `tone` prop).

### Validate with `shadcn view`

Before running the add script, confirm the registry entry resolves:

1. Run (replace `url` with the React Native Reusables registry URL):

   ```bash
   npx shadcn@latest view "${url}"
   ```

2. Confirm exit code **0**.

3. Parse stdout as JSON (strip markdown code fences if present).

4. Expect a **JSON array** with at least one object containing:

   `"$schema": "https://ui.shadcn.com/schema/registry-item.json"`

If validation fails, **do not** run the add script. Build manually per [Manual primitive](#add-a-custom-srcui-primitive-no-registry-item) below.

### Run the add script

From the app **project root**:

```bash
npx shadcn@latest view "https://reactnativereusables.com/r/nativewind/button.json"
node path/to/building-react-native-application/scripts/add-registry-component.cjs "https://reactnativereusables.com/r/nativewind/button.json"
```

Use `--root <project-dir>` when the cwd is not the app root.

The script vendors files into `src/ui/` (for example `Button.tsx`), rewrites `cn` → `cx`, and fixes import paths. Import with `@/ui/Button`.

When the script cannot resolve a dependency, add the component by hand and keep it presentation-only.

## Examples

### Use a vendored primitive in a feature

```ts
import { Button } from "@/ui/Button";

export function WorkshopCta() {
  return <Button>Join workshop</Button>;
}
```

### Add a custom `src/ui/` primitive (no registry item)

```ts
import type { ReactNode } from "react";
import { Pressable, Text } from "react-native";
import { buttonStyles } from "./button.styles";

interface ButtonProps {
  label: string;
  tone?: "primary" | "secondary";
  className?: string;
  children?: ReactNode;
}

export function Button({ tone, className, label }: ButtonProps) {
  return (
    <Pressable className={buttonStyles({ tone, className })}>
      <Text>{label}</Text>
    </Pressable>
  );
}
```

### Split complex controls into parts

Put each part in its own file under `src/ui/`:

`src/ui/Button.tsx`:

```ts
import type { ReactNode } from "react";
import { Pressable } from "react-native";
import { buttonStyles } from "./button.styles";

export function Button({ children, className }: { children: ReactNode; className?: string }) {
  return <Pressable className={buttonStyles({ className })}>{children}</Pressable>;
}
```

`src/ui/ButtonText.tsx` / `src/ui/ButtonIcon.tsx` — same pattern; compose in features:

```tsx
<Button>
  <ButtonIcon>{/* icon */}</ButtonIcon>
  <ButtonText>Save</ButtonText>
</Button>
```

## Related

- [add-registry-component.cjs](../scripts/add-registry-component.cjs) — vendoring script
- [managing-styling.md](./managing-styling.md) — NativeWind utilities and CVA patterns
- [overriding-classname.md](./overriding-classname.md) — targeted `!` overrides on shared components
