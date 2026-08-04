# Managing Environment

## Overview

**Execution mode.** Validates environment variables per module with Zod. Each module that reads configuration keeps a dedicated `env.ts` that defines a Zod schema, parses `import.meta.env`, and exports the typed result.

## Prerequisites

- [managing-project-structure.md](./managing-project-structure.md)

## Guidelines

### Structure

- Place `env.ts` at the boundary of the owning unit:
  - `src/features/<feature-name>/env.ts` — feature-scoped variables.
  - `src/api/<backend-name>/env.ts` — API-client variables.
  - Other cohesive modules follow the same pattern.
- List every key the module reads from `import.meta.env` in that single `env.ts`; other files import the parsed `env` only.

### Validation rules

- Define one Zod object schema for all required (and optional) variables the module uses.
- Parse once when the module loads. Export:
  - `parseSchema` — the Zod object schema (for tests, composition, or reuse).
  - The parsed result (convention: `env` or a module-specific name such as `appApiEnv`). The parsed export is the source of truth for runtime values.
- Prefer `.safeParse` at the app root for controlled startup errors; `.parse` is acceptable in leaf modules where misconfiguration should crash during development or CI.

### Vite and public variables

- Client-visible values require the **`VITE_`** prefix in `.env` so Vite exposes them on `import.meta.env` (see [Vite — Env variables](https://vitejs.dev/guide/env-and-mode.html)).
- `VITE_*` values ship in the client bundle; store secrets in server-side config, auth, or proxy patterns instead.

### TypeScript

- Reference types for `import.meta.env` via Vite's client types (e.g. `/// <reference types="vite/client" />` in `src/vite-env.d.ts`).

## Setup

### Install Zod

```bash
node ../scripts/install-packages.cjs zod
```

## Examples

### Feature module `env.ts`

```ts
import { z } from "zod";

export const parseSchema = z.object({
  VITE_ANALYTICS_KEY: z.string().min(1),
});

export const env = parseSchema.parse({
  VITE_ANALYTICS_KEY: import.meta.env.VITE_ANALYTICS_KEY,
});
```

### Use parsed env inside the same feature

```ts
import { env } from "./env";

export function trackEvent(name: string) {
  return fetch("/analytics", {
    method: "POST",
    body: JSON.stringify({ name, key: env.VITE_ANALYTICS_KEY }),
  });
}
```

### API backend `env.ts`

```ts
import { z } from "zod";

export const parseSchema = z.object({
  VITE_API_URL: z.string().url(),
});

export const env = parseSchema.parse({
  VITE_API_URL: import.meta.env.VITE_API_URL,
});
```

### Wire API client to parsed env

```ts
import { createClient } from "./client";
import { env } from "./env";

export const client = createClient({ baseURL: env.VITE_API_URL });
```
