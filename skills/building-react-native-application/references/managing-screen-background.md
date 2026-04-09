# Managing Screen Background

## Overview

React Navigation already applies the app background through the navigation theme (`colors.background`), which maps to the same token as NativeWind `bg-background`. Because of this, screen roots inside the navigator usually do not need an extra `bg-background`.

## Verdict

React Navigation theme already provides the default background. Do not set `bg-background` again on every screen component by default.

## Guidelines

- **Default case (most screens)**: Do not add `bg-background` to the root screen container when the screen is rendered inside the themed navigator.
- **Add only when different**: Add a background class only when the screen or section needs a background that is intentionally different from the default navigation background.
- **Surface-level UI**: Apply background classes to components that establish their own surface (for example cards, sheets, insets, or panels), not to duplicate the page fill.
- **Keep tokens aligned**: Keep Tailwind `bg-background` aligned with the navigation theme background token so both systems stay consistent.

## Related

- [configuring-routing.md](./configuring-routing.md)
- [setting-up-navigation-theme.md](./setting-up-navigation-theme.md)
- [reusing-navigation-background.md](./reusing-navigation-background.md)
