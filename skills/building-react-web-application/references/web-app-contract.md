# Web App Contract

## Overview

The stack, ownership, and design-porting rules every `building-react-web-application` recipe builds on.

## Guidelines

### Tech stack

| Layer | Choice |
| --- | --- |
| Bundler | Vite |
| Language | TypeScript, `strict` |
| Routing | TanStack Router, file-based in `src/routes/` |
| Styling | Tailwind CSS v4; `cva` for variants by default |
| Server state | TanStack Query |
| Forms | TanStack Form |
| Validation | Zod |

### Ownership

| Decides | Owner |
| --- | --- |
| Look, copy, components, motion | The supplied design (any source: files, Figma, tokens), else the agent |
| Libraries beyond **Tech stack** | The project's TRD, else the agent |
| Structure, data flow, UI states, forms, auth guard | This skill |

When a rule here conflicts with the TRD, the design, or existing code, raise it with the user before writing code.

### Porting a design

- Port the design's markup and cascade as is, then express its styles in classes per [managing-styling.md](./managing-styling.md); keep its nesting, values, states, and copy.
- Change only component boundaries, framework idioms, data binding, and routing.
