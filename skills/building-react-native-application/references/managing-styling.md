# Managing Styling

## Overview

Design tokens in the Tailwind theme, classes that keep the design's values, `cva` variants, and `className` overrides with NativeWind.

## Prerequisites

- [setting-up-nativewind.md](./setting-up-nativewind.md)

## Guidelines

### Tokens

- The supplied design's tokens are the only theme source; keep their names and values. With no design, the agent defines the tokens the app needs.
- Token values are CSS variables in `src/theme.css`: `:root` for light, `.dark:root` for dark only when the tokens define dark values.
- `global.css` imports `src/theme.css` before the Tailwind layers; `App.tsx` imports only `global.css`.
- `tailwind.config.js` maps each token to its variable under `theme.extend`, in the token's color format; merge into an existing config.
- The navigation theme repeats the color values in `src/theme.ts` per [managing-platform-fixes.md](./managing-platform-fixes.md); change both together.

### Values

- A design value used more than once becomes a token; a one-off uses an arbitrary-value class (`p-[15px]`).
- Values are never rounded to the Tailwind scale.

### Classes

- Style with `className`; inline `style` only for values computed at runtime (animation, measured layout).
- `cva` for components with variants; `cx` from `class-variance-authority` merges base classes, variant output, and the consumer's `className`, consumer last.
- Platform-specific values use `ios:` / `android:` variants, or `@media ios {}` / `@media android {}` in `global.css`.

### Overriding `className`

`cx` concatenates without deduplicating, so a consumer utility that conflicts with a component's own class takes Tailwind's `!`:

- Prefix `!` on every consumer utility in the same category as a base or variant class (`text-sm` → `!text-lg`); leave the others unprefixed.
- `!` goes after variants and before the utility: `sm:!p-0`, `md:hover:!bg-primary`.
- Component authors keep default classes minimal when `className` is public, and expose common choices as variants.

## Examples

### `src/theme.css`

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 4%;
    --primary: 221 83% 53%;
  }

  .dark:root {
    --background: 0 0% 4%;
    --foreground: 0 0% 98%;
    --primary: 217 91% 60%;
  }
}
```

### `global.css`

```css
@import "./src/theme.css";

@tailwind base;
@tailwind components;
@tailwind utilities;
```

### `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./App.tsx", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "hsl(var(--primary))",
      },
    },
  },
};
```

### Override

```tsx
<Label className="!text-lg text-foreground">Name</Label>
```

`text-lg` conflicts with the `Label`'s own text size; `text-foreground` does not.
