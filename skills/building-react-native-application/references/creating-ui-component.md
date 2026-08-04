# Creating UI Component

## Overview

Create shared presentational primitives in `src/ui/`. Registry-first: check `src/ui/` for an existing primitive, then validate with React Native Reusables via `shadcn view`. Build manually only when no registry item fits.

## Prerequisites

- [creating-component.md](./creating-component.md) — placement, shared rules, naming baseline
- [setting-up-registry-components.md](./setting-up-registry-components.md) — one-time shell (Lucide, `inlineRem`, `PortalHost`)
- [managing-wrapper-components.md](./managing-wrapper-components.md) — `className` merging
- [discovering-registry-components.md](./discovering-registry-components.md) — intent-to-component lookup

## Guidelines

### Folder layout

`src/ui/` stays flat and presentation-only. Group files only when a subsystem owns multiple related pieces.

```text
src/ui/
├── Button.tsx
├── ButtonText.tsx
├── hooks/              # reusable UI-only hooks (e.g. useMediaQuery)
├── Form/               # composition root — see creating-form-component.md
│   ├── index.tsx
│   └── InputField.tsx
├── Async/              # composition root — see creating-async-component.md
└── BottomSheet/        # composition root — see creating-bottom-sheet-component.md
```

### Layout rules

| Pattern | Rule |
| --- | --- |
| Standalone primitive | `src/ui/<Component>.tsx`; import `@/ui/<Component>` |
| Multi-file subsystem | `src/ui/<GroupName>/` with `index.tsx` barrel |
| UI-only hooks | `src/ui/hooks/` — no feature or data hooks |
| Composition roots | `Form/`, `Async/`, `BottomSheet/` — same group + barrel pattern |

### Naming

- Generic, unprefixed: `Button`, `TextInput`, `Modal`, `Card`.
- Compound parts share root prefix: `Button`, `ButtonText`, `ButtonIcon` — one export per file.
- Encode state in props/variants, not the name.

### Normalize `cn` → `cx`

Import `cx` from `class-variance-authority` when editing registry output by hand.

### Lookup registry candidates

Before `shadcn view`, map intent to candidates with [discovering-registry-components.md](./discovering-registry-components.md):

1. Normalize intent (`picker`, `confirm delete`, `settings toggle`, `menu`).
2. Match by `labels`, then exact `slug`.
3. Prefer exact semantic match before composition.
4. For composite requests, choose primary + supporting primitives (e.g. `alert-dialog` + `button`).

### Validate with `shadcn view`

```bash
node ../scripts/run-package.cjs -- shadcn@latest view "${url}"
```

1. Confirm exit code **0**.
2. Parse stdout as JSON (strip markdown code fences if present).
3. Expect a JSON array with `"$schema": "https://ui.shadcn.com/schema/registry-item.json"`.

If validation fails, build manually (see Examples below).

### Run the add script

```bash
node ../scripts/run-package.cjs -- shadcn@latest view "https://reactnativereusables.com/r/nativewind/button.json"
node ../scripts/add-registry-component.cjs "https://reactnativereusables.com/r/nativewind/button.json"
```

Use `--root <project-dir>` when cwd is not app root. The script vendors into `src/ui/`, rewrites `cn` → `cx`, and fixes imports.

## Examples

### Use a vendored primitive

```ts
import { Button } from "@/ui/Button";

export function WorkshopCta() {
  return <Button>Join workshop</Button>;
}
```

### Custom `src/ui/` primitive (no registry item)

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

### Compound parts (separate files)

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
