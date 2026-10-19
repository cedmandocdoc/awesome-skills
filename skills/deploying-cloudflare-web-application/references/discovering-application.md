# Discovering Application

## Overview

**Read-only.** Resolves what the wrangler config and the deploy workflow need, then confirms it with the user before any file is written.

## Guidelines

### 1. Resolve

| Item | Usually from |
| --- | --- |
| App | The package with the web build |
| Build command | The app's `package.json` scripts |
| Output directory | The framework's config or its default |
| SPA | A client-side router → SPA mode |
| Build-time public values | Env names the framework bakes into the bundle (`VITE_*`, `NEXT_PUBLIC_*`, …); values from the repo |
| Runtime secrets and bindings | `env.<NAME>` in Worker code and absent from `vars` → `secrets.required`; D1, KV, R2 bindings |
| Hosts | `routes` in the wrangler config; none → `*.workers.dev` |
| Wrangler root | Where the wrangler config lives or will live |
| Watch paths | The app, the workspace packages it imports, the lockfile |

Anything the repo does not make explicit → ask.

### 2. Confirm

Show the resolved values in one table; the user corrects any before files are written.

## Related

- [configuring-wrangler.md](./configuring-wrangler.md)
- [configuring-github-actions.md](./configuring-github-actions.md)
