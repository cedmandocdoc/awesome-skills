# Cloudflare dashboard — GitHub integration (Workers Builds)

Connect the repository in **Workers & Pages → Create or select Worker → Settings → Builds → Connect**.

Cloudflare runs on each push to the configured branch:

1. **Build command** (optional) — compile the app into static files
2. **Deploy command** — `npx wrangler deploy` (default)

Preview branches use `npx wrangler versions upload` by default (preview URL, not promoted to production).

## Settings reference

| Setting | Required | Typical value |
| --- | --- | --- |
| Git repository | Yes | User selects repo |
| Production branch | Yes | `main` |
| Root directory | Monorepos | Repo root or package path where `wrangler.toml` lives |
| Build command | Usually | Framework build (see discovery) |
| Deploy command | Yes | `npx wrangler deploy` |
| Non-production deploy command | Optional | `npx wrangler versions upload` |
| Build variables | If app needs them | `VITE_*`, `NEXT_PUBLIC_*`, etc. |
| API token | Yes | Auto-created on first connect |

`name` in `wrangler.toml` **must match** the Worker name in the dashboard or the build fails.

## Build command examples

Single package at repo root:

```bash
npm ci && npm run build
```

Monorepo (install at root, build in package):

```bash
pnpm install --frozen-lockfile && cd apps/web && pnpm run build
```

```bash
pnpm install --frozen-lockfile && pnpm --filter web build
```

## Build watch paths (optional)

Limit deploys to relevant file changes in monorepos, for example:

- `apps/web/**`
- `packages/shared/**`
- `pnpm-lock.yaml`
- `package.json`
- `wrangler.toml`

## Environment variables — two buckets

| Type | Where | When |
| --- | --- | --- |
| **Build variables** | Settings → Builds → Build variables | Values inlined at build time (`VITE_*`, etc.) |
| **Runtime variables** | Settings → Variables & Secrets | Worker `env.*` at request time (hybrid apps only) |

Static SPAs with build-time public env only need **build variables**.

## Custom domain (post-deploy)

1. Workers & Pages → Worker → Settings → Domains & Routes
2. Add custom domain; create DNS record in Cloudflare (or CNAME at DNS provider)

Not required for first deploy — `*.workers.dev` works for smoke testing.

## Ongoing releases

Merge to the production branch → Cloudflare builds and deploys automatically. Check deploy status in the Cloudflare dashboard or GitHub deployment checks.

## Official docs

- [Workers Builds configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)
- [Git integration](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/)
- [Static assets](https://developers.cloudflare.com/workers/static-assets/)
