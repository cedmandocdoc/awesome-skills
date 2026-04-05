# Managing Environment

## Overview

Use this guide when a *feature*, *API backend folder*, or other module reads configuration from the environment. Each such module keeps a dedicated `env.ts` that validates every variable that module needs with Zod, exports `parseSchema`, and exports the parsed values (for example `env`). That file is the only place that defines and validates env for the module; the parsed export is what the rest of the module uses at runtime.

## Prerequisites

- [structuring-project.md](./structuring-project.md)

## Guidelines

### Structure

- Add `env.ts` at the boundary of the unit that owns the configuration:
  - `src/features/<feature-name>/env.ts` when only that feature reads those variables.
  - `src/api/<backend-name>/env.ts` when the API client layer for that backend reads them.
  - Another folder may use the same pattern when a cohesive module has its own env surface.
- List every key that module reads from **`import.meta.env`** in that single `env.ts`. Do not scatter raw `import.meta.env` reads across files inside the same module.

### Validation rules

- Define one Zod object schema that describes all required (and optional) variables for the module.
- Parse once when the module loads. Export:
  - `parseSchema`: the Zod object schema for this module (tests, composition, or reuse).
  - The parsed, typed result (convention: `env` or a module-specific name such as `appApiEnv`). **The parsed export is the source of truth** for runtime values—import it instead of reading `import.meta.env` again elsewhere in the module.
- Prefer `.safeParse` at the app root if the app should show a controlled startup error; inside leaf modules, failing fast with `.parse` is acceptable when misconfiguration should crash during development or CI.

### Vite and public variables

- Client-visible values must be defined in `.env` with the **`VITE_`** prefix so Vite exposes them on `import.meta.env` (see [Vite — Env variables](https://vitejs.dev/guide/env-and-mode.html)).
- **Never** put secrets in `VITE_*` variables; they ship in the client bundle. Use server-side config, auth, or proxy patterns for sensitive values.

### TypeScript

- Reference types for `import.meta.env` via Vite’s client types (e.g. `/// <reference types="vite/client" />` in `src/vite-env.d.ts` or equivalent).

## Setup

### Install Zod

```bash
npm install zod
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
  // use env.VITE_ANALYTICS_KEY — do not read import.meta.env here
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
