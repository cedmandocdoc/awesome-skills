# Configuring Routing

## Overview

Use this guide to set up **TanStack Router** with the **Vite plugin** and **file-based routing** under `src/routes/`. Keep route files focused on URL structure, layouts, and data-loading hooks; put domain UI in features.

## Prerequisites

- [structuring-project.md](./structuring-project.md)
- [TanStack Router — Installation with Vite](https://tanstack.com/router/latest/docs/installation/with-vite.md)

## Guidelines

### Structure

Default plugin layout (adjust only if you change plugin options):

```text
src/routes/
├── __root.tsx          # root layout
├── index.tsx           # example: /
└── ...                 # nested routes follow file naming conventions
src/routeTree.gen.ts    # generated from src/routes/
```

- Add route modules under `src/routes/` using the file-based routing conventions from the TanStack Router docs.
- Compose feature components inside route components; keep route files thin when possible.
- Use **path params** and **search params** with typed validation when the app needs shareable URLs and safer access patterns (see Router docs).

### Plugin setup

1. Install `@tanstack/router-plugin` (and router packages per the official guide).
2. Register `tanstackRouter` **before** `@vitejs/plugin-react` in `vite.config.ts`, with `target: 'react'` and options such as `autoCodeSplitting: true` as needed.

See the full snippet in [Installation with Vite](https://tanstack.com/router/latest/docs/installation/with-vite.md).

### Generated route tree

- `routeTree.gen.ts` is **generated** from `src/routes/`; change route modules, not this file.
- **Lint / format ignore:** exclude it from ESLint and Prettier (or Biome) so generated code stays untouched. The TanStack doc links patterns for [Prettier ignore](https://prettier.io/docs/en/ignore.html#ignoring-files) and [ESLint ignore](https://eslint.org/docs/latest/use/configure/ignore#ignoring-files).
- **VS Code:** optionally mark the file readonly and exclude from search/watch, as recommended in the same installation doc, for quieter diffs after renames.

### Choosing layout patterns

| Pattern        | Use it when                                                                 |
| -------------- | --------------------------------------------------------------------------- |
| **Root layout**| Shared chrome: html/body class, devtools, providers that wrap all routes   |
| **Nested layout** | Section chrome: sidebars, sub-nav, persistent UI around child paths    |
| **Index + siblings** | Peer URLs at the same segment; use folder `route.tsx` layouts as needed |

Refer to [Routing concepts](https://tanstack.com/router/latest/docs/routing/routing-concepts.md) for path syntax, splats, and layout routes.

## Setup

### Install packages

Follow the router’s installation guide for `@tanstack/react-router` and the Vite plugin versions compatible with your app.

### Render the router at the root

After `QueryClientProvider` (if used), render `RouterProvider` with the generated route tree. Exact import names follow your generated file; typical pattern:

```tsx
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function AppRouter() {
  return <RouterProvider router={router} />;
}
```

Adjust to match the current TanStack Router API for your version (see upstream quickstart / file-based example).

## Examples

### Navigate from a component

Use `Link`, `useNavigate`, and related APIs from `@tanstack/react-router` for navigation. Prefer typed route APIs when the project enables them.

```tsx
import { Link } from "@tanstack/react-router";

export function WorkshopCta({ id }: { id: string }) {
  return <Link to="/workshops/$workshopId" params={{ workshopId: id }}>Open</Link>;
}
```

Exact `to` / `params` shapes depend on your route tree; generate types or follow the project’s route definitions.
