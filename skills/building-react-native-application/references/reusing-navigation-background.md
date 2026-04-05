# Reusing Navigation Background

## Overview

After React Navigation’s theme maps app tokens to `colors.background` (see [setting-up-navigation-theme.md](./setting-up-navigation-theme.md)), the navigator already paints the screen area with the same color as Tailwind’s `bg-background`. Prefer that single source instead of repeating `bg-background` on every screen root or on wrappers whose only job is the page fill.

## Guidelines

- **Screens**: Omit a root `className="bg-background"` (or equivalent) on the outermost screen container when the default stack/tab background should match the app chrome. The themed navigator background is enough.
- **Feature / layout wrappers**: Do not add `bg-background` on a child wrapper “for consistency” if it does not change the visual (same token, full-bleed behind content). Reserve the class for nodes that must explicitly establish a surface (e.g. cards, sheets, inset panels) or when the subtree is not under the usual nav background.
- **Tokens**: Keep `bg-background` aligned with `NAV_THEME` / `THEME.*.background` in `src/theme.ts` so nav and NativeWind stay one system; the win is avoiding duplicate application of the same fill, not mixing different colors.

## When `bg-background` still belongs on a component

Use it when the UI needs its own backed region: modals, bottom sheets, floating panels, list rows or cards on top of a different parent fill, or any root that renders outside the themed navigator tree.
