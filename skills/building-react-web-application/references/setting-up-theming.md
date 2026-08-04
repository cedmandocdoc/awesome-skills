# Setting Up Theming

## Overview

**Execution mode.** Shared design tokens and light/dark variables as the single source for Tailwind, registry UI, and the app. Two files: project-root **`global.css`** (Tailwind entry + upstream imports) and **`src/theme.css`** (token wiring). Pull **only** the [shadcn manual **Configure styles**](https://ui.shadcn.com/docs/installation/manual.md) *content* into `theme.css`—keep `@import "tailwindcss"` in `global.css` only.

## Prerequisites

- [Tailwind CSS — Using Vite](https://tailwindcss.com/docs/installation/using-vite)

## Guidelines

### 1. Install Tailwind with Vite

Follow [Installing Tailwind CSS as a Vite plugin](https://tailwindcss.com/docs/installation/using-vite): install `tailwindcss` and `@tailwindcss/vite`, register the plugin in `vite.config.ts`.

```bash
node ../scripts/install-packages.cjs tailwindcss @tailwindcss/vite
```

### 2. Install registry-related dependencies

From [Manual installation — Add dependencies](https://ui.shadcn.com/docs/installation/manual.md), install the packages the doc lists (for example `class-variance-authority`, `lucide-react`, `tw-animate-css`).

```bash
node ../scripts/install-packages.cjs class-variance-authority lucide-react tw-animate-css
```

Merge `className` strings with **`import { cx } from "class-variance-authority"`**. Omit **`tailwind-merge`** and a standalone **`cn`** utility file. Shared primitives live under **`src/ui/`**; add registry output with [`add-registry-component.cjs`](../scripts/add-registry-component.cjs) (rewrites paths and **`cn` → `cx`**).

### 3. Create `global.css` (project root)

Keep **`global.css` at the project root** as the only CSS entry imported from `main.tsx`:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@import "./src/theme.css";
```

Import once from the app entry:

```ts
import "../global.css";
```

(Adjust the relative path if the entry is not `src/main.tsx`.)

### 4. Create `src/theme.css`

Keep **design tokens and theme wiring in `src/theme.css` only**.

Open [Manual installation — Configure styles](https://ui.shadcn.com/docs/installation/manual.md) and copy the **Configure styles** block into **`src/theme.css`**. Omit lines that **`global.css` already imports**:

- `@import "tailwindcss";`
- `@import "tw-animate-css";`
- `@import "shadcn/tailwind.css";`

Keep everything else from that section in order—for example:

- `@custom-variant dark (&:is(.dark *));`
- `@theme inline { ... }`
- `:root { ... }`
- `.dark { ... }`
- `@layer base { ... }`

### Dark mode

Use the **class-based** pattern from the manual (e.g. `.dark` on `<html>`). Toggle from the root layout or a small provider when adding a theme switcher.

## Related

- [setting-up-tailwind-theme.md](./setting-up-tailwind-theme.md) — semantic token usage in components
- [managing-styling.md](./managing-styling.md) — day-to-day utility rules
- [creating-ui-component.md](./creating-ui-component.md) — vendoring registry files into `src/ui/`

## References

- [shadcn — Manual installation](https://ui.shadcn.com/docs/installation/manual.md)
- [Tailwind CSS — Using Vite](https://tailwindcss.com/docs/installation/using-vite)
