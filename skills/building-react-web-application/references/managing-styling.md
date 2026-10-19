# Managing Styling

## Overview

Design tokens in the Tailwind CSS v4 theme, classes that keep the design's values, `cva` variants, fonts, and `className` overrides.

## Guidelines

### Tokens

- The supplied design's tokens are the only theme source; keep their names and values. With no design, the agent defines the tokens the app needs.
- Token values are CSS variables in `src/theme.css`: `:root` for light, `.dark` for dark only when the tokens define dark values; `@theme inline` maps each one to its Tailwind namespace (`--color-*`, `--font-*`, `--radius-*`).
- With dark values, `@custom-variant dark (&:is(.dark *));` enables `dark:`, and the root toggles `.dark` on `<html>`.
- Project-root `global.css` is the only CSS entry: `@import "tailwindcss";`, then `@import "./src/theme.css";`; `src/main.tsx` imports it once.

### Values

- A design value used more than once becomes a token; a one-off uses an arbitrary-value class (`p-[15px]`).
- Values are never rounded to the Tailwind scale.

### Classes

- Style with `className`; inline `style` only for values computed at runtime (animation, measured layout).
- `cva` for components with variants; `cx` from `class-variance-authority` merges base classes, variant output, and the consumer's `className`, consumer last.

### Fonts

Load each font with `@font-face` in `src/theme.css` (or the font provider's stylesheet link in `index.html`) and register it as a `--font-*` token.

### Overriding `className`

`cx` concatenates without deduplicating, so a consumer utility that conflicts with a component's own class takes Tailwind's `!`:

- Suffix `!` on every consumer utility in the same category as a base or variant class (`text-sm` → `text-lg!`); leave the others unsuffixed.
- `!` goes at the very end of the token, after any variants: `sm:p-0!`, `md:hover:bg-primary!`.
- Component authors keep default classes minimal when `className` is public, and expose common choices as variants.

## Examples

### `global.css`

```css
@import "tailwindcss";
@import "./src/theme.css";
```

### `src/theme.css`

```css
@custom-variant dark (&:is(.dark *));

@font-face {
  font-family: "Inter";
  src: url("/fonts/Inter.woff2") format("woff2");
  font-weight: 100 900;
  font-display: swap;
}

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.15 0 0);
  --primary: oklch(0.55 0.22 263);
}

.dark {
  --background: oklch(0.15 0 0);
  --foreground: oklch(0.98 0 0);
  --primary: oklch(0.62 0.19 260);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --font-body: "Inter", sans-serif;
}
```

### Override

```tsx
<Label className="text-lg! text-foreground">Name</Label>
```

`text-lg` conflicts with the `Label`'s own text size; `text-foreground` does not.

## References

- [Tailwind CSS — Theme variables](https://tailwindcss.com/docs/theme)
- [Tailwind CSS — Dark mode](https://tailwindcss.com/docs/dark-mode)
- [MDN — @font-face](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face)
