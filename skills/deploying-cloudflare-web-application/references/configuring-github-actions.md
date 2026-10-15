# Configuring GitHub Actions

## Overview

The deploy workflow and the GitHub secrets and variables it reads. On each push to the production branch that touches the app, the workflow installs, builds with the public build values, and runs `wrangler deploy` through `cloudflare/wrangler-action`.

## Prerequisites

Build command, Wrangler root, build-time variables, and watch paths from [discovering-application.md](./discovering-application.md). Wrangler config from [configuring-wrangler.md](./configuring-wrangler.md).

## Guidelines

### Workflow file

`.github/workflows/deploy-<worker>.yml`, one per Worker. Adapt the setup steps to the package manager (drop `pnpm/action-setup` for npm; `npm ci` instead of `pnpm install`).

```yaml
name: Deploy <worker>

on:
  push:
    branches: [<production-branch>]
    paths: ["<watch-path>/**", "<lockfile>", ".github/workflows/deploy-<worker>.yml"]
  workflow_dispatch:

concurrency: deploy-<worker>

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: <build-command>
        env:
          VITE_SUPABASE_URL: ${{ vars.SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ vars.SUPABASE_PUBLISHABLE_KEY }}
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ vars.CLOUDFLARE_ACCOUNT_ID }}
          workingDirectory: <wrangler-root>
          command: deploy
```

| Need | Change |
| --- | --- |
| D1 migrations | `command: \|` with `d1 migrations apply <database> --remote` before `deploy` |
| A Wrangler environment | `command: deploy --env <name>` |
| No build step (Worker only) | Drop the build step |

### Variables — two buckets

| Type | Where | When |
| --- | --- | --- |
| **Build variables** | The build step's `env`, from GitHub variables | Values inlined at build time (`VITE_*`, `NEXT_PUBLIC_*`) |
| **Runtime variables** | `vars` in the wrangler config; secrets via `wrangler secret` | Worker `env.*` at request time |

### GitHub values

| Rule | Detail |
| --- | --- |
| Needed names | Every `${{ vars.<NAME> }}` and `${{ secrets.<NAME> }}` in `.github/workflows/*.yml`, minus `gh variable list` and `gh secret list` |
| Public value | `gh variable set <NAME> --body "<value>"` |
| Secret value | Its name with a blank value in a `*.secrets.env` file the user fills; `gh secret set -f <file>` |
| Names | A value another platform reads starts with its platform: `SUPABASE_*`, `CLOUDFLARE_*`, `EXPO_*`; an app-only value keeps the name the app reads |
| Owner | The platform's skill sets a name; other skills only read it |

This skill sets `CLOUDFLARE_ACCOUNT_ID` (variable, the config's `account_id`), `CLOUDFLARE_API_TOKEN` (secret, from `<wrangler-root>/deploy.secrets.env`), and the app-only build variables. A build variable from another platform (`SUPABASE_URL`) is missing → that platform's skill sets it (deploying-supabase-application → **Provision**), or the user gives the value.

### Custom domain

`routes` in the wrangler config ([configuring-wrangler.md](./configuring-wrangler.md) → **Custom domains and routes**); `*.workers.dev` works for the first smoke test.

### Ongoing releases

Push or merge to the production branch → the workflow builds and deploys. `gh run list --workflow deploy-<worker>.yml` shows each run.

## Related

- [discovering-application.md](./discovering-application.md)
- [configuring-wrangler.md](./configuring-wrangler.md)
- [configuring-resources.md](./configuring-resources.md)
- [troubleshooting-deployment.md](./troubleshooting-deployment.md)

## References

- [GitHub Actions for Workers](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/)
- [wrangler-action](https://github.com/cloudflare/wrangler-action)
- [Static assets](https://developers.cloudflare.com/workers/static-assets/)
