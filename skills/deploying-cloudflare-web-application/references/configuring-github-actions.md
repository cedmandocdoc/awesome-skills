# Configuring GitHub Actions

## Overview

The deploy workflow and the values it reads. On each push to the production branch that touches the app, the workflow checks the secrets, builds with the committed public values, creates a missing D1 database, applies D1 migrations, syncs Worker secrets, and runs `wrangler deploy` through `cloudflare/wrangler-action`.

## Prerequisites

Build command, Wrangler root, build-time variables, runtime secret names, and watch paths from [discovering-application.md](./discovering-application.md). Wrangler config from [configuring-wrangler.md](./configuring-wrangler.md).

## Guidelines

### Workflow file

`.github/workflows/deploy-<worker>.yml`, one per Worker. Adapt the setup steps to the package manager (drop `pnpm/action-setup` for npm; `npm ci` instead of `pnpm install`). No dependency cache: the job holds the Cloudflare token. Pin third-party actions to a commit SHA.

```yaml
name: Deploy <worker>

on:
  push:
    branches: [<production-branch>]
    paths: ["<watch-path>/**", "<lockfile>", ".github/workflows/deploy-<worker>.yml"]
  workflow_dispatch:

concurrency: deploy-<worker>

permissions:
  contents: read

jobs:
  deploy:
    if: github.ref == 'refs/heads/<production-branch>'
    runs-on: ubuntu-latest
    steps:
      - name: Check secrets
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY }}
        run: |
          missing=0
          for name in CLOUDFLARE_API_TOKEN STRIPE_SECRET_KEY; do
            if [ -z "${!name}" ]; then
              echo "::error::Set $name in Settings → Secrets and variables → Actions"
              missing=1
            fi
          done
          exit $missing
      - uses: actions/checkout@v7
      - uses: pnpm/action-setup@v6
      - uses: actions/setup-node@v7
        with:
          node-version-file: .nvmrc
      - run: pnpm install --frozen-lockfile
      - run: <build-command>
      - uses: cloudflare/wrangler-action@v4
        env:
          STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY }}
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          workingDirectory: <wrangler-root>
          preCommands: |
            npx wrangler d1 info <database> || npx wrangler d1 create <database>
            npx wrangler d1 migrations apply <database> --remote
          secrets: |
            STRIPE_SECRET_KEY
          command: deploy
```

| Part | Rule |
| --- | --- |
| Check secrets | `CLOUDFLARE_API_TOKEN` plus every `secrets.required` name |
| `secrets:` and the action's `env` | Every `secrets.required` name; the action pipes the values to `wrangler secret bulk` on stdin before `deploy` |
| `preCommands` | One pair per D1 `database_name`; drop when the config has no D1 |
| No runtime secrets | Drop `secrets:` and the action's `env` |
| No build step (Worker only) | Drop the build step |

### Values

| Value | Lives in | Read by |
| --- | --- | --- |
| Public build value (`VITE_*`, `NEXT_PUBLIC_*`) | The app's committed production env file (`.env.production`); `git check-ignore` must not match it | The build |
| Public runtime value | `vars` in the wrangler config | Worker `env.*` at request time |
| Runtime secret | Name in `secrets.required`; value in a GitHub repository secret of the same name, per [configuring-secrets.md](./configuring-secrets.md) | Worker `env.*` at request time |
| Account | `account_id` in the wrangler config | Wrangler |

| Rule | Detail |
| --- | --- |
| No GitHub variables | Public values are committed, so they travel with the PR and show in its diff |

### CI API token

The workflow's `CLOUDFLARE_API_TOKEN`. Local Wrangler uses the `wrangler login` session.

1. The user creates a custom token at https://dash.cloudflare.com/profile/api-tokens → **Create Custom Token**, with an expiry they track. Account Resources must include the `account_id` account; how many accounts and zones it reaches is the user's choice, so one token can serve several repos. Permissions:

   | Permission | Level | When |
   | --- | --- | --- |
   | Account › Workers Scripts | Edit | Always |
   | Zone › Workers Routes | Edit | The wrangler config has `routes`; Zone Resources include those zones |
   | Account › D1 | Edit | The config has D1 |
   | Account › Workers KV Storage | Edit | The config has KV |
   | Account › Workers R2 Storage | Edit | The config has R2 |

2. The user sets it as the `CLOUDFLARE_API_TOKEN` repository secret per [configuring-secrets.md](./configuring-secrets.md).

### Custom domain

`routes` in the wrangler config ([configuring-wrangler.md](./configuring-wrangler.md) → **Custom domains and routes**); `*.workers.dev` works for the first smoke test.

### Ongoing releases

Push or merge to the production branch → the workflow deploys. `gh run list --workflow deploy-<worker>.yml` shows each run.

## Related

- [discovering-application.md](./discovering-application.md)
- [configuring-wrangler.md](./configuring-wrangler.md)
- [configuring-secrets.md](./configuring-secrets.md)
- [troubleshooting-deployment.md](./troubleshooting-deployment.md)

## References

- [GitHub Actions for Workers](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/)
- [wrangler-action](https://github.com/cloudflare/wrangler-action)
- [Static assets](https://developers.cloudflare.com/workers/static-assets/)
