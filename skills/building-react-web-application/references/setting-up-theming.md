# Setting Up Theming

## Overview

Shared design tokens and light/dark variables as the single source for Tailwind, registry UI, and the rest of the app. Use the **same two-file pattern as the React Native skill**: project-root **`global.css`** (Tailwind entry + upstream imports) and **`src/theme.css`** (token wiring). Pull **only** the [shadcn manual **Configure styles**](https://ui.shadcn.com/docs/installation/manual.md) *content* into `theme.css`—split so Tailwind’s `@import "tailwindcss"` lives in `global.css` only.

**Class merging and primitives:** use **`cva`** and **`cx`** from **`class-variance-authority`**, with shared components under **`src/ui/`** (see [structuring-project.md](./structuring-project.md)). **Add registry output** with [`add-registry-component.js`](../scripts/add-registry-component.js); it wraps `npx shadcn@latest view` and aligns paths and **`cn` → `cx`** for this layout.

## Prerequisites

- [Tailwind CSS — Using Vite](https://tailwindcss.com/docs/installation/using-vite)

## Steps

### 1. Install Tailwind with Vite

Follow [Installing Tailwind CSS as a Vite plugin](https://tailwindcss.com/docs/installation/using-vite): install `tailwindcss` and `@tailwindcss/vite`, register the plugin in `vite.config.ts`.

### 2. Install registry-related dependencies

From [Manual installation — Add dependencies](https://ui.shadcn.com/docs/installation/manual.md), install the packages the doc lists for styling and components (for example `class-variance-authority`, `lucide-react`, `tw-animate-css`, and any `shadcn` package your tooling expects). Merge `className` strings with **`import { cx } from "class-variance-authority"`** (CVA re-exports `clsx` as **`cx`**); omit **`tailwind-merge`** and the manual’s standalone **`cn`** utility file for this stack.

### 3. Create `global.css` (project root)

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

### 4. Create `src/theme.css`

Keep **design tokens and theme wiring in `src/theme.css` only**, like [setting-up-theming.md](../../building-react-native-application/references/setting-up-theming.md) does for the Native app.

Open [Manual installation — Configure styles](https://ui.shadcn.com/docs/installation/manual.md) and copy the **Configure styles** block into **`src/theme.css`**. **Leave out** the lines that **`global.css` already imports** (duplicate imports break the split):

- `@import "tailwindcss";`
- `@import "tw-animate-css";`
- `@import "shadcn/tailwind.css";`

Keep everything else from that section in order—for example:

- `@custom-variant dark (&:is(.dark *));`
- `@theme inline { ... }`
- `:root { ... }`
- `.dark { ... }`
- `@layer base { ... }`

**`global.css`** stays the Tailwind + shadcn import entry; **`src/theme.css`** holds semantic variables and `@theme` mapping (two files replace pasting the manual’s styles into a single `globals.css`).

**Optional (cross-platform parity):** If you want CSS variables to match the React Native skill’s HSL-style tokens exactly, you can instead define variables in `@layer base` in `src/theme.css` the same way as the Native [setting-up-theming.md](../../building-react-native-application/references/setting-up-theming.md) snippet, then map them to Tailwind utilities via `@theme inline` as needed. Prefer one approach per app and stay consistent.

### Dark mode

Use the **class-based** pattern from the manual (e.g. `.dark` on `<html>`). Toggle it from the root layout or a small provider when you add a theme switcher.

## Next

- For how semantic token names map to usage in components, see [setting-up-tailwind-theme.md](./setting-up-tailwind-theme.md).
- For day-to-day utility rules, see [styling.md](./styling.md).
- For vendoring registry files into `src/ui/` with `cx` and path fixes, see [abstracting-component.md](./abstracting-component.md).
