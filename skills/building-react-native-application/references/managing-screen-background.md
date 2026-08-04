# Managing Screen Background

## Overview

React Navigation’s theme already paints the screen area via `colors.background` (same token as NativeWind `bg-background`). Prefer that single fill on screen roots under the themed navigator.

## Prerequisites

- [setting-up-navigation-theme.md](./setting-up-navigation-theme.md)

## Guidelines

| Case | Rule |
| --- | --- |
| Default screen root | Omit `bg-background` (or equivalent) on the outermost screen container |
| Feature / layout wrappers | Omit `bg-background` when it only duplicates the nav fill |
| Own surface | Apply background classes on cards, sheets, insets, panels, modals, or floating regions |
| Outside navigator | Apply `bg-background` on roots that render outside the themed navigator tree |
| Tokens | Keep `bg-background` aligned with `NAV_THEME` / `THEME.*.background` in `src/theme.ts` |

## Related

- [creating-route-component.md](./creating-route-component.md)
- [setting-up-navigation-theme.md](./setting-up-navigation-theme.md)
