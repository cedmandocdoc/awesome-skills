# Components

## Overview

Use this guide to place components in the right layer and keep reusable UI simple. Put domain-specific UI in features, and keep shared primitives flat in `src/ui/`.

## Guidelines

### Structure

| Kind                             | Location                                      |
| -------------------------------- | --------------------------------------------- |
| Domain or cross-cutting UI       | `src/features/<feature-name>/`                |
| Shared presentational primitives | `src/ui/`                                     |
| Tokens and shared theme values   | `global.css`, `src/theme.css`, `src/theme.ts` |
| Tailwind and NativeWind config   | `tailwind.config.js`                          |

### Placement rules

- Put product rules and domain behavior in features.
- Put reusable, presentation-only primitives in `src/ui/`.
- Keep `src/ui/` flat unless a tool requires a nested structure.
- Import primitives with `@/ui/<file>`.
- Use relative imports between files inside `src/ui/`.

### Component rules

- Use functional components and named exports.
- Prefer `interface` for props.
- Use React Native primitives or `@/ui/*`.
- Keep domain logic out of presentational components.
- Prefer compound parts over components that accept raw string or node unions.

### Styling rules

- Use the NativeWind setup from [styling.md](./styling.md).
- Keep `global.css` as the only CSS file imported by `App.tsx`.
- Put token layers in `src/theme.css` and import that file from `global.css`.
- Extend `tailwind.config.js`; do not replace an existing config.

## Setup

### Complete the styling baseline

Finish the setup in [styling.md](./styling.md) first.

### Install component helpers

```bash
npx expo install tailwindcss-animate @rn-primitives/portal
```

If you use Lucide icons:

```bash
npx expo install lucide-react-native
```

### Create `src/theme.css`

Keep design tokens in `src/theme.css` only. Put shared color, radius, and chart variables there.

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 96.1%;
    --accent-foreground: 0 0% 9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 63%;
    --radius: 0.625rem;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
  }

  .dark:root {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    --card: 0 0% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;
    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --accent: 0 0% 14.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 70.9% 59.4%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 300 0% 45%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }
}
```

### Import theme tokens

Keep `global.css` as the Metro entry file. List the Tailwind layers first, then import `src/theme.css` for design tokens.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import "./src/theme.css";
```

### Extend `tailwind.config.js`

Merge these values into the existing config from [styling.md](./styling.md). Do not replace the whole file if the project already has one.

```js
const { hairlineWidth } = require("nativewind/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./App.tsx", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [require("tailwindcss-animate")],
};
```

### Create `src/theme.ts`

Keep the React Navigation theme aligned with the same tokens.

```ts
import { DarkTheme, DefaultTheme, type Theme } from "@react-navigation/native";

export const THEME = {
  light: {
    background: "hsl(0 0% 100%)",
    foreground: "hsl(0 0% 3.9%)",
    card: "hsl(0 0% 100%)",
    cardForeground: "hsl(0 0% 3.9%)",
    popover: "hsl(0 0% 100%)",
    popoverForeground: "hsl(0 0% 3.9%)",
    primary: "hsl(0 0% 9%)",
    primaryForeground: "hsl(0 0% 98%)",
    secondary: "hsl(0 0% 96.1%)",
    secondaryForeground: "hsl(0 0% 9%)",
    muted: "hsl(0 0% 96.1%)",
    mutedForeground: "hsl(0 0% 45.1%)",
    accent: "hsl(0 0% 96.1%)",
    accentForeground: "hsl(0 0% 9%)",
    destructive: "hsl(0 84.2% 60.2%)",
    border: "hsl(0 0% 89.8%)",
    input: "hsl(0 0% 89.8%)",
    ring: "hsl(0 0% 63%)",
    radius: "0.625rem",
    chart1: "hsl(12 76% 61%)",
    chart2: "hsl(173 58% 39%)",
    chart3: "hsl(197 37% 24%)",
    chart4: "hsl(43 74% 66%)",
    chart5: "hsl(27 87% 67%)",
  },
  dark: {
    background: "hsl(0 0% 3.9%)",
    foreground: "hsl(0 0% 98%)",
    card: "hsl(0 0% 3.9%)",
    cardForeground: "hsl(0 0% 98%)",
    popover: "hsl(0 0% 3.9%)",
    popoverForeground: "hsl(0 0% 98%)",
    primary: "hsl(0 0% 98%)",
    primaryForeground: "hsl(0 0% 9%)",
    secondary: "hsl(0 0% 14.9%)",
    secondaryForeground: "hsl(0 0% 98%)",
    muted: "hsl(0 0% 14.9%)",
    mutedForeground: "hsl(0 0% 63.9%)",
    accent: "hsl(0 0% 14.9%)",
    accentForeground: "hsl(0 0% 98%)",
    destructive: "hsl(0 70.9% 59.4%)",
    border: "hsl(0 0% 14.9%)",
    input: "hsl(0 0% 14.9%)",
    ring: "hsl(300 0% 45%)",
    radius: "0.625rem",
    chart1: "hsl(220 70% 50%)",
    chart2: "hsl(160 60% 45%)",
    chart3: "hsl(30 80% 55%)",
    chart4: "hsl(280 65% 60%)",
    chart5: "hsl(340 75% 55%)",
  },
};

export const NAV_THEME: Record<"light" | "dark", Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
  },
};
```

### Add the portal host

Render `PortalHost` as the last child inside your root providers.

```tsx
import { PortalHost } from "@rn-primitives/portal";

<PortalHost />;
```

## Usage

### Reuse a registry primitive first

Before you build a shared primitive, check `src/ui/` first. If it is missing, add the registry component from the Expo project root.

```bash
node path/to/react-native/scripts/add-registry-component.js "https://reactnativereusables.com/r/nativewind/button.json"
```

### Create a shared primitive

```ts
import type { ReactNode } from "react";
import { Pressable, Text } from "react-native";
import { buttonStyles } from "./button.styles";

interface ButtonProps {
  label: string;
  tone?: "primary" | "secondary";
  className?: string;
  children?: ReactNode;
}

export function Button({ tone, className, label }: ButtonProps) {
  return (
    <Pressable className={buttonStyles({ tone, className })}>
      <Text>{label}</Text>
    </Pressable>
  );
}
```

### Use primitives inside a feature

```ts
import { Button } from "@/ui/button";

export function WorkshopCta() {
  return <Button label="Join workshop" />;
}
```

### Split complex controls into parts

Use explicit parts such as `Button`, `ButtonText`, and `ButtonIcon` instead of switching on `typeof children`.

```ts
import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { buttonStyles } from "./button.styles";

interface ButtonRootProps {
  children: ReactNode;
  className?: string;
}

interface ButtonTextProps {
  children: ReactNode;
}

interface ButtonIconProps {
  children: ReactNode;
}

export function Button({ children, className }: ButtonRootProps) {
  return <Pressable className={buttonStyles({ className })}>{children}</Pressable>;
}

export function ButtonText({ children }: ButtonTextProps) {
  return <Text>{children}</Text>;
}

export function ButtonIcon({ children }: ButtonIconProps) {
  return <View>{children}</View>;
}
```

Usage in a screen or feature:

```tsx
<Button>
  <ButtonIcon>{/* icon */}</ButtonIcon>
  <ButtonText>Save</ButtonText>
</Button>
```
