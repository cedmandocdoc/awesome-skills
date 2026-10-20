# Native App Contract

## Overview

The stack, ownership, and requirements rules every `building-react-native-application` recipe builds on.

## Guidelines

### Tech stack

| Layer | Choice |
| --- | --- |
| Runtime | Expo |
| Language | TypeScript, `strict` |
| Routing | React Navigation, static config in `src/routes/` |
| Styling | NativeWind 4 on Tailwind CSS 3.4; `cva` for variants by default |
| UI primitives | `@rn-primitives` |
| Keyboard | `react-native-keyboard-controller` |
| Server state | TanStack Query |
| Forms | TanStack Form |
| Validation | Zod |

### Ownership

| Decides | Owner |
| --- | --- |
| Look, copy, motion | The requirements, else the agent |
| Which primitive and which library for it | This skill — [creating-ui-component.md](./creating-ui-component.md) |
| Libraries beyond **Tech stack** | The project's TRD, else the agent |
| Structure, routing, data, async states, errors, forms, authentication, guards, platform fixes | This skill |
| Whether and how a case surfaces to the user (a failure, a success, a denial, a missing resource) | The requirements, else the agent |

### Requirements

- Requirements are whatever the user supplies: a design in any form, a spec, a sketch, or nothing.
- Turn each requirement into the foundations: its values into tokens per [managing-styling.md](./managing-styling.md), its widgets into `src/ui` primitives per [creating-ui-component.md](./creating-ui-component.md), its flows into features per [managing-project-structure.md](./managing-project-structure.md).
- A design's markup and cascade are input, never code to copy.

### Conflicts

A library that does the same job as one in **Tech stack**, or a requirement that contradicts a rule here, is a conflict: tell the user and follow their decision before writing code. Any other library or requirement is implemented on the foundations the agent's way.
