# Native App Contract

## Overview

The stack, ownership, and design-porting rules every `building-react-native-application` recipe builds on.

## Guidelines

### Tech stack

| Layer | Choice |
| --- | --- |
| Runtime | Expo |
| Language | TypeScript, `strict` |
| Routing | React Navigation, static config in `src/routes/` |
| Styling | NativeWind 4 on Tailwind CSS 3.4; `cva` for variants by default |
| Server state | TanStack Query |
| Forms | TanStack Form |
| Validation | Zod |
| Keyboard | `react-native-keyboard-controller` |

### Ownership

| Decides | Owner |
| --- | --- |
| Look, copy, components, motion | The supplied design (any source: files, Figma, tokens), else the agent |
| Libraries beyond **Tech stack** | The project's TRD, else the agent |
| Structure, data flow, UI states, forms, auth guard, platform fixes | This skill |

When a rule here conflicts with the TRD, the design, or existing code, raise it with the user before writing code.

### Porting a design

- Port the design's markup and effective styles as is, then express them in classes per [managing-styling.md](./managing-styling.md); keep its nesting, values, states, and copy.
- Change only component boundaries, framework idioms, data binding, and routing.
- Native has no cascade: resolve each element's effective style, set inherited text styles on every `Text`, map grid to flex, and map hover to pressed states.
