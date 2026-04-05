# Setting Up Theming

## Overview

Shared design tokens and light/dark variables as the single source for Tailwind, registry UI, and the rest of the app. Use the **same two-file pattern as the React Native skill**: project-root **`global.css`** (Tailwind entry + upstream imports) and **`src/theme.css`** (token wiring). Pull **only** the [shadcn manual **Configure styles**](https://ui.shadcn.com/docs/installation/manual.md) *content* into `theme.css`—split so Tailwind’s `@import "tailwindcss"` lives in `global.css` only.

**Do not add `components.json`.** This stack is opinionated (`src/ui`, `cx` in `src/lib/utils.ts`, `tailwind-merge`) and does not follow the default shadcn project layout. Add primitives with [`add-registry-component.js`](../scripts/add-registry-component.js) (and `npx shadcn@latest view` under the hood), not `shadcn init` / CLI add that expect `components.json`.

## Prerequisites

- [Tailwind CSS — Using Vite](https://tailwindcss.com/docs/installation/using-vite)

## Steps

### 1. Install Tailwind with Vite

Follow [Installing Tailwind CSS as a Vite plugin](https://tailwindcss.com/docs/installation/using-vite): install `tailwindcss` and `@tailwindcss/vite`, register the plugin in `vite.config.ts`.

### 2. Install registry-related dependencies

From [Manual installation — Add dependencies](https://ui.shadcn.com/docs/installation/manual.md), install the packages the doc lists for styling and components (for example `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `tw-animate-css`, and any `shadcn` package your tooling expects). You do **not** need to complete the manual’s `components.json` or default `lib/utils.ts` **cn** setup—use the next step instead.

### 3. Add the `cx` utility

Create **`src/lib/utils.ts`** (path is fixed for this stack; the manual’s `lib/utils.ts` at repo root is optional):

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cx(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 4. Create `global.css` (project root)

Keep **`global.css` at the project root** as the only CSS entry imported from `main.tsx` (mirrors keeping `global.css` at the project root in the React Native skill). It loads Tailwind and shadcn’s Tailwind layer, then pulls in tokens:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@import "./src/theme.css";
```

Import it once from the app entry, for example:

```ts
import "../global.css";
```

(Adjust the relative path if your entry file lives somewhere other than `src/main.tsx`.)

### 5. Create `src/theme.css`

Keep **design tokens and theme wiring in `src/theme.css` only**, like [setting-up-theming.md](../../building-react-native-application/references/setting-up-theming.md) does for the Native app.

Open [Manual installation — Configure styles](https://ui.shadcn.com/docs/installation/manual.md) and copy the **Configure styles** block into **`src/theme.css`**, but **omit** these lines (they already live in `global.css`):

- `@import "tailwindcss";`
- `@import "tw-animate-css";`
- `@import "shadcn/tailwind.css";`

Keep everything else from that section in order—for example:

- `@custom-variant dark (&:is(.dark *));`
- `@theme inline { ... }`
- `:root { ... }`
- `.dark { ... }`
- `@layer base { ... }`

That keeps **one** place for semantic variables and `@theme` mapping, without duplicating the manual’s full file as a single `globals.css`.

**Optional (cross-platform parity):** If you want CSS variables to match the React Native skill’s HSL-style tokens exactly, you can instead define variables in `@layer base` in `src/theme.css` the same way as the Native [setting-up-theming.md](../../building-react-native-application/references/setting-up-theming.md) snippet, then map them to Tailwind utilities via `@theme inline` as needed. Prefer one approach per app and stay consistent.

### Dark mode

Use the **class-based** pattern from the manual (e.g. `.dark` on `<html>`). Toggle it from the root layout or a small provider when you add a theme switcher.

## Next

- For how semantic token names map to usage in components, see [setting-up-tailwind-theme.md](./setting-up-tailwind-theme.md).
- For day-to-day utility rules, see [styling.md](./styling.md).
- For vendoring registry files into `src/ui/` with `cx` and path fixes, see [abstracting-component.md](./abstracting-component.md).
