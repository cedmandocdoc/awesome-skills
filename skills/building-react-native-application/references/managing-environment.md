# Managing Environment

## Overview

Each module that reads configuration keeps a dedicated `env.ts` that validates every variable with Zod, exports `parseSchema`, and exports the parsed values. That file is the only place that defines and validates env for the module; the parsed export is what the rest of the module uses at runtime.

## Prerequisites

- [managing-project-structure.md](./managing-project-structure.md)

## Guidelines

### Structure

- Place `env.ts` at the boundary of the owning unit:
  - `src/features/<feature-name>/env.ts` — feature-scoped variables.
  - `src/api/<backend-name>/env.ts` — API client variables.
- List every key that module reads from `process.env` in that single `env.ts`. Do not scatter raw `process.env` reads across files inside the same module.

### Validation

- Define one Zod object schema describing all required/optional variables for the module.
- Parse once at module load. Export:
  - `parseSchema` — the Zod object (for tests, composition, reuse).
  - Parsed result (`env` or a module-specific name like `appApiEnv`) — the runtime source of truth.
- Prefer `.safeParse` at the app root for controlled startup errors; `.parse` is acceptable in leaf modules where misconfiguration should crash during development or CI.

### Expo and public variables

Client-visible values in Expo must use the `EXPO_PUBLIC_` prefix. Secrets must not use `EXPO_PUBLIC_`; use EAS Secrets, server endpoints, or other supported patterns for sensitive values.

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
  EXPO_PUBLIC_ANALYTICS_KEY: z.string().min(1),
});

export const env = parseSchema.parse({
  EXPO_PUBLIC_ANALYTICS_KEY: process.env.EXPO_PUBLIC_ANALYTICS_KEY,
});
```

### Use parsed env inside the same feature

```ts
import { env } from "./env";

export function trackEvent(name: string) {
  // use env.EXPO_PUBLIC_ANALYTICS_KEY — do not read process.env here
}
```

### API backend `env.ts`

```ts
import { z } from "zod";

export const parseSchema = z.object({
  EXPO_PUBLIC_API_URL: z.string().url(),
});

export const env = parseSchema.parse({
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
});
```

### Wire API client to parsed env

```ts
import { createClient } from "./client";
import { env } from "./env";

export const client = createClient({ baseURL: env.EXPO_PUBLIC_API_URL });
```
