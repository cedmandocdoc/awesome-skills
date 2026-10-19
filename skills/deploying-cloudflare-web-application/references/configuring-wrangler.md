# Configuring Wrangler

## Overview

`wrangler.toml` (or `wrangler.jsonc`, same fields) at the Wrangler root defines the Worker and every resource it uses; the deploy workflow applies it on each run.

## Prerequisites

Values from [discovering-application.md](./discovering-application.md).

## Guidelines

### Config

```toml
name = "my-app"
compatibility_date = "2026-10-01"
account_id = "<account id>"
main = "src/index.ts"

[assets]
directory = "./dist"
not_found_handling = "single-page-application"
run_worker_first = ["/api/*"]

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

| Field | Rule |
| --- | --- |
| `name` | The Worker's identity and the workflow's name; renaming creates a new Worker |
| `account_id` | Recorded at Setup; pins deploys to one account |
| `main`, `run_worker_first` | Only with Worker code; `run_worker_first` lists the paths the Worker serves before static assets |
| `assets.directory` | The build output, relative to the Wrangler root |
| `assets.not_found_handling` | SPAs only |
| `vars` | Public runtime values; each deploy overwrites edits made elsewhere |
| `secrets.required` | Every runtime secret name; deploy fails while one is unset. Values never in the config; set per [configuring-secrets.md](./configuring-secrets.md) |
| D1 `database_name` | Created by the workflow's `preCommands` before migrations |
| KV binding, R2 `bucket_name` | `wrangler deploy` creates a missing one (a KV namespace is named `<worker>-<binding>`); later deploys reuse it |
| Unused section | Drop it |

Pin `wrangler` in the Wrangler root's `devDependencies`; `wrangler-action` uses that version.

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

`*.workers.dev` works for the first smoke test.

## Related

- [discovering-application.md](./discovering-application.md)
- [configuring-github-actions.md](./configuring-github-actions.md)

## References

- [Wrangler configuration](https://developers.cloudflare.com/workers/wrangler/configuration/)
- [Static assets](https://developers.cloudflare.com/workers/static-assets/)
