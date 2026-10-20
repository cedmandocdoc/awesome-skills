# Configuring GitHub Actions

## Overview

The deploy workflow and the values it reads.

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
    paths: ["<watch-path>/**", "<lockfile>", ".github/workflows/deploy-<worker>.yml", "!<wrangler-root>/DEPLOYMENT.md"]
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

No GitHub variables: public values are committed, so they travel with the PR and show in its diff.

### CI API token

The workflow's `CLOUDFLARE_API_TOKEN`. Local Wrangler uses the `wrangler login` session.

Permissions: [`../assets/ci-token-permissions.tsv`](../assets/ci-token-permissions.tsv), one row per permission. A row applies when its `when` is `always`; `routes` and the wrangler config has `routes`, with Zone Resources including those zones; or `d1`, `kv`, `r2` and the config has that resource.

1. The user creates a custom token at https://dash.cloudflare.com/profile/api-tokens → **Create Custom Token**, with an expiry they track. Account Resources must include the `account_id` account; how many accounts and zones it reaches is the user's choice, so one token can serve several repos. Show the applying rows as a Permission | Level table headed by their count.
2. The user sets it as the `CLOUDFLARE_API_TOKEN` repository secret per [configuring-secrets.md](./configuring-secrets.md).
3. Run **Probe**.

### Probe

From the repository root: `bash <skill-dir>/scripts/probe-ci-token.sh <account-id> [d1] [kv] [r2] [routes=<zone> …]`, naming each resource the config has and each zone its `routes` use. [`../scripts/probe-ci-token.sh`](../scripts/probe-ci-token.sh) pushes a throwaway branch with one workflow that sends each applying row's request with the secret and prints status codes only, then deletes the run and the branch. Each request deletes a random name that does not exist, so nothing changes; 401 or 403 means missing, any other 2xx or 4xx granted.

| Exit | Do |
| --- | --- |
| 0 | The token is ready |
| 1 | Show only the missing rows and their count, or that the secret is unset; the user fixes the token and sets the secret again, then probe again |
| 2 | Report the error; the probe did not run |

## Related

- [discovering-application.md](./discovering-application.md)
- [configuring-wrangler.md](./configuring-wrangler.md)
- [configuring-secrets.md](./configuring-secrets.md)
- [troubleshooting-deployment.md](./troubleshooting-deployment.md)

## References

- [GitHub Actions for Workers](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/)
- [wrangler-action](https://github.com/cloudflare/wrangler-action)
