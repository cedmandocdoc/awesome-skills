# Managing Styling

## Overview

Tokens in the Tailwind theme, classes that keep the requirements' values, layout across screen sizes, `cva` variants, `className` overrides, and the color scheme preference with NativeWind.

## Prerequisites

- [setting-up-nativewind.md](./setting-up-nativewind.md)

## Guidelines

### Tokens

- The requirements' tokens are the only theme source; keep their names and values. With none, the agent defines the tokens the app needs.
- Token values are CSS variables in `src/theme.css`: `:root` for light, `.dark:root` for dark only when the tokens define dark values.
- `global.css` imports `src/theme.css` before the Tailwind layers; `App.tsx` imports only `global.css`.
- `tailwind.config.js` maps each token to its variable under `theme.extend`, in the token's color format; merge into an existing config.
- Fonts are tokens per [managing-platform-fixes.md](./managing-platform-fixes.md); the navigation theme repeats the color values in `src/theme.ts`, so change both together.

### Values

- A value used more than once becomes a token; a one-off uses an arbitrary-value class (`p-[15px]`).
- Values are never rounded to the Tailwind scale.

### Layout

- Mobile-first: unprefixed classes are the smallest layout; breakpoint prefixes (`md:`) add larger ones.
- Breakpoints come from the requirements' tokens, else Tailwind's defaults.
- Native has no cascade: set inherited text styles (font, color, size) on every `Text`, map grid to flex, and map hover to pressed states.

### Classes

- Style with `className`; inline `style` only for values computed at runtime (animation, measured layout).
- `cva` for components with variants; `cx` from `class-variance-authority` merges base classes, variant output, and the consumer's `className`, consumer last.
- Platform-specific values use `ios:` / `android:` variants, or `@media ios {}` / `@media android {}` in `global.css`.
- `prettier-plugin-tailwindcss` orders classes per [managing-linting.md](./managing-linting.md).

### Overriding `className`

`cx` concatenates without deduplicating, so a consumer utility that conflicts with a component's own class takes Tailwind's `!`:

- Prefix `!` on every consumer utility in the same category as a base or variant class (`text-sm` → `!text-lg`); leave the others unprefixed.
- `!` goes after variants and before the utility: `sm:!p-0`, `md:active:!bg-primary`.
- Component authors keep default classes minimal when `className` is public, and expose common choices as variants.

### Color scheme

When the tokens define dark values:

- The preference is `system | light | dark`, persisted on the device and owned by one `useTheme` hook in `src/common/theme/`.
- `useTheme` applies it with NativeWind's `useColorScheme().setColorScheme` and restores it before the splash hides.
- `Navigation` receives the theme for the active scheme per [managing-platform-fixes.md](./managing-platform-fixes.md).

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

## References

- [NativeWind — Dark mode](https://www.nativewind.dev/docs/core-concepts/dark-mode)
