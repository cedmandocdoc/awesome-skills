# Configuring Wrangler

## Overview

The deploy workflow runs `wrangler deploy`, which reads `wrangler.toml` or `wrangler.jsonc` from the Wrangler root (the action's `workingDirectory`).

## Prerequisites

Deploy target, build output path, and SPA mode from [discovering-application.md](./discovering-application.md).

## Guidelines

### Minimum — static site

```toml
name = "my-app"
compatibility_date = "2026-10-01"

[assets]
directory = "./dist"
```

| Field | Required | Notes |
| --- | --- | --- |
| `name` | Yes | Worker name; the deploy workflow is named after it |
| `compatibility_date` | Yes | Use a recent date for new projects |
| `assets.directory` | Yes | Path to built static files, relative to Wrangler root |
| `assets.not_found_handling` | SPAs only | See below |

`main` is not required for static-only hosting.

### SPA client-side routing

```toml
[assets]
directory = "./dist"
not_found_handling = "single-page-application"
```

Serves `index.html` with `200` for paths that do not match a static file. Required for React Router, Vue Router, TanStack Router, Expo web, and similar SPAs.

| Mode | Use when |
| --- | --- |
| `"404-page"` | Static site with custom `404.html` |
| `"none"` | Every URL must map to a real file |

### Optional assets settings

```toml
[assets]
directory = "./dist"
not_found_handling = "single-page-application"
html_handling = "auto-trailing-slash"
```

| Field | Purpose |
| --- | --- |
| `html_handling` | Trailing-slash behavior for HTML (`auto-trailing-slash`, `drop-trailing-slash`, etc.) |
| `binding` | Name for `env.ASSETS` in Worker code (default `ASSETS`) — only if `main` is set |
| `run_worker_first` | Route patterns that invoke Worker before static assets (hybrid apps) |

### Static + Worker API (hybrid)

```toml
name = "my-app"
main = "src/index.ts"
compatibility_date = "2026-10-01"

[assets]
directory = "./dist"
not_found_handling = "single-page-application"
binding = "ASSETS"
run_worker_first = ["/api/*"]
```

Worker fetches static assets via `env.ASSETS.fetch(request)` for non-API routes.

### JSONC variant

```jsonc
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "my-app",
  "compatibility_date": "2026-10-01",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "single-page-application"
  }
}
```

### Pin Wrangler version

In `package.json` at the Wrangler project root:

```json
{
  "devDependencies": {
    "wrangler": "^4.0.0"
  }
}
```

`wrangler-action` uses the installed version when present.

### `.assetsignore`

Optional file beside `wrangler.toml` (same syntax as `.gitignore`):

```
*.map
*.md
```

### Account, bindings, and runtime values

```toml
account_id = "<account id>"
workers_dev = true

[vars]
PUBLIC_SITE_KEY = "<public value>"

[secrets]
required = ["STRIPE_SECRET_KEY"]

[[d1_databases]]
binding = "DB"
database_name = "my-app-db"

[[kv_namespaces]]
binding = "CACHE"

[[r2_buckets]]
binding = "FILES"
bucket_name = "my-app-files"
```

| Field | Notes |
| --- | --- |
| `account_id` | Recorded at Setup; pins deploys to one account |
| `vars` | Public runtime values; each deploy overwrites edits made elsewhere |
| `secrets.required` | Every runtime secret name; deploy fails while one is unset. Values never in the config; set per [configuring-secrets.md](./configuring-secrets.md) |
| D1 `database_name`, KV binding, R2 `bucket_name` | `wrangler deploy` creates a missing resource (a KV namespace is named `<worker>-<binding>`) and later deploys reuse it; an existing resource's id may stay in the config |

### Custom domains and routes

```toml
routes = [
  { pattern = "app.example.com", custom_domain = true },
  { pattern = "example.com/docs*", zone_name = "example.com" },
]
```

| Kind | Use when | Deploy creates |
| --- | --- | --- |
| `custom_domain = true` | The Worker serves the whole host | DNS record and certificate, when the zone is in the same account |
| Route with `zone_name` | The Worker serves a path on a host another Worker or origin serves | The route only; the host needs a proxied record |

## Related

- [discovering-application.md](./discovering-application.md)
- [configuring-github-actions.md](./configuring-github-actions.md)

## References

- [Cloudflare advanced setups](https://developers.cloudflare.com/workers/ci-cd/builds/advanced-setups/)
