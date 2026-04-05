# Setting Up Theming

## Overview

Establish **Tailwind CSS v4** with Vite, then add **design tokens and light/dark variables** using the same building blocks as [shadcn/ui manual installation](https://ui.shadcn.com/docs/installation/manual.md): **install the listed dependencies** and apply the **Configure styles** portion of that doc (global CSS imports, `@theme` / `:root` / `.dark`, base layer). This doc does not replace the manual—it points to it and fixes where files live in this stack.

## Prerequisites

- [Tailwind CSS — Using Vite](https://tailwindcss.com/docs/installation/using-vite)

## Steps

### 1. Install Tailwind with Vite

Follow [Installing Tailwind CSS as a Vite plugin](https://tailwindcss.com/docs/installation/using-vite): install `tailwindcss` and `@tailwindcss/vite`, register the plugin in `vite.config.ts`, and use `@import "tailwindcss";` in your CSS entry.

### 2. Install shadcn manual dependencies

From [Manual installation — Add dependencies](https://ui.shadcn.com/docs/installation/manual.md), add the packages it lists (including `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, animation-related packages such as `tw-animate-css`, and `shadcn` as appropriate for your CLI usage).

### 3. Add the `cx` utility

The manual shows a `cn` helper. This stack uses **`cx`** instead. Create `src/lib/utils.ts`:

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cx(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 4. Configure styles (from shadcn manual)

Open [Manual installation — Configure styles](https://ui.shadcn.com/docs/installation/manual.md) and copy the **Configure styles** CSS block into your global stylesheet (for example `src/styles/globals.css`), adjusting only the file path if your project uses a different name.

That section typically includes:

- `@import "tailwindcss";`
- `@import "tw-animate-css";` (or the current equivalent from the doc)
- `@import "shadcn/tailwind.css";` (per upstream)
- `@custom-variant dark (&:is(.dark *));`
- `@theme inline { ... }` mapping semantic colors and radii to CSS variables
- `:root` and `.dark` variable definitions
- `@layer base` rules for border/outline/body defaults

Keep **one** source of truth for those variables—avoid duplicating the full block in a second file.

### 5. `components.json`

Create `components.json` at the project root per the manual, with:

- `"tailwind": { "css": "src/styles/globals.css", ... }` aligned to your path
- **Aliases** pointing **`ui`** at `@/ui` if primitives live under `src/ui/` (see [structuring-project.md](./structuring-project.md))

### Dark mode

Use the **class-based** pattern from the manual (`dark` class on an ancestor, often `<html>`). Toggle it from app code when implementing a theme switcher.

## Next

- For how semantic token names map to usage in components, see [setting-up-tailwind-theme.md](./setting-up-tailwind-theme.md).
- For day-to-day utility rules, see [styling.md](./styling.md).
