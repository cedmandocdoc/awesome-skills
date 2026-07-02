# Wrangler configuration for static web apps

Workers Builds runs `npx wrangler deploy`, which reads `wrangler.toml` or `wrangler.jsonc` from the dashboard **root directory**.

## Minimum — static site

```toml
name = "my-app"
compatibility_date = "2026-07-02"

[assets]
directory = "./dist"
```

| Field | Required | Notes |
| --- | --- | --- |
| `name` | Yes | Must match the Worker name in the Cloudflare dashboard |
| `compatibility_date` | Yes | Use a recent date for new projects |
| `assets.directory` | Yes | Path to built static files, relative to Wrangler root |
| `assets.not_found_handling` | SPAs only | See below |

`main` is **not** required for static-only hosting.

## SPA client-side routing

```toml
[assets]
directory = "./dist"
not_found_handling = "single-page-application"
```

Serves `index.html` with `200` for paths that do not match a static file. Required for React Router, Vue Router, TanStack Router, Expo web, and similar SPAs.

Alternatives:

| Mode | Use when |
| --- | --- |
| `"404-page"` | Static site with custom `404.html` |
| `"none"` | Every URL must map to a real file |

## Optional assets settings

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

## Static + Worker API (hybrid)

When the app needs server logic at the edge:

```toml
name = "my-app"
main = "src/index.ts"
compatibility_date = "2026-07-02"

[assets]
directory = "./dist"
not_found_handling = "single-page-application"
binding = "ASSETS"
run_worker_first = ["/api/*"]
```

Worker fetches static assets via `env.ASSETS.fetch(request)` for non-API routes.

## JSONC variant

```jsonc
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "my-app",
  "compatibility_date": "2026-07-02",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "single-page-application"
  }
}
```

## Pin Wrangler version

Add to the `package.json` at the Wrangler project root:

```json
{
  "devDependencies": {
    "wrangler": "^4.0.0"
  }
}
```

Workers Builds uses the version from `package.json` when present.

## `.assetsignore`

Optional file beside `wrangler.toml` (same syntax as `.gitignore`) to exclude files from upload:

```
*.map
*.md
```

## Environments (staging / production)

For multiple Workers environments, use `wrangler deploy --env <name>` in the dashboard deploy command and define `[env.staging]` blocks. See [Cloudflare advanced setups](https://developers.cloudflare.com/workers/ci-cd/builds/advanced-setups/).
