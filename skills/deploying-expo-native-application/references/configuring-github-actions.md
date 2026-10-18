# Configuring GitHub Actions

## Overview

The deploy workflow and the GitHub secrets it reads. On each push to the production branch that touches the app, the workflow installs, writes the store key files from secrets, and starts a `production` EAS build that auto-submits to TestFlight and the Play `internal` track. EAS builds and submits in its own cloud; the job ends once the build is queued.

## Prerequisites

App package, platforms, production branch, and watch paths from [discovering-application.md](./discovering-application.md). Submit profiles from [configuring-eas.md](./configuring-eas.md). Secret names, and where runtime variables live instead, from [deployment-contract.md](./deployment-contract.md) → **GitHub values**.

## Guidelines

### Workflow file

`.github/workflows/deploy-<app>.yml`, one per app package. Adapt the setup steps to the package manager (drop `pnpm/action-setup` for npm; `npm ci` instead of `pnpm install`). Drop the key file and `env` lines of a platform the app lacks; set `--platform` to the platforms it has.

```yaml
name: Deploy <app>

on:
  push:
    branches: [<production-branch>]
    paths: ["<app-package>/**", "<lockfile>", ".github/workflows/deploy-<app>.yml"]
  workflow_dispatch:

concurrency: deploy-<app>

jobs:
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: <app-package>
    env:
      EXPO_ASC_API_KEY_PATH: credentials/asc-api-key.p8
      EXPO_ASC_KEY_ID: ${{ secrets.EXPO_ASC_KEY_ID }}
      EXPO_ASC_ISSUER_ID: ${{ secrets.EXPO_ASC_ISSUER_ID }}
      EXPO_APPLE_TEAM_ID: ${{ secrets.EXPO_APPLE_TEAM_ID }}
      EXPO_APPLE_TEAM_TYPE: ${{ secrets.EXPO_APPLE_TEAM_TYPE }}
    steps:
      - uses: actions/checkout@v7
      - uses: pnpm/action-setup@v6
      - uses: actions/setup-node@v7
        with:
          node-version-file: .nvmrc
      - uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - run: pnpm install --frozen-lockfile
        working-directory: .
      - run: |
          mkdir -p credentials
          printf '%s' "$ASC_API_KEY" > credentials/asc-api-key.p8
          printf '%s' "$GOOGLE_SERVICE_ACCOUNT_KEY" > credentials/google-service-account.json
        env:
          ASC_API_KEY: ${{ secrets.EXPO_ASC_API_KEY }}
          GOOGLE_SERVICE_ACCOUNT_KEY: ${{ secrets.EXPO_GOOGLE_SERVICE_ACCOUNT_KEY }}
      - run: eas build --platform all --profile production --auto-submit-with-profile internal --non-interactive --no-wait
```

| Need | Change |
| --- | --- |
| Build only; submit later through **Release** | Drop `--auto-submit-with-profile internal` |
| Fail the run when the build fails | Drop `--no-wait`; the job then waits for EAS and spends runner minutes |

### CI credentials

The workflow's secrets are credentials made for CI only, with less access than the local ones in [deployment-contract.md](./deployment-contract.md) → **Files**. The user creates each one and sets it with `gh secret set <NAME>`, pasting the value at the prompt, or `gh secret set <NAME> < <downloaded file>`, then deletes the download.

| Secret | Credential | Access |
| --- | --- | --- |
| `EXPO_TOKEN` | Robot user token: https://expo.dev → the account that owns the project → Settings → Robot users | **Developer** role. Fallback when the account has no robot users: a personal access token, which acts on every account the user can access |
| `EXPO_ASC_API_KEY`, `EXPO_ASC_KEY_ID` | A second Team Key at https://appstoreconnect.apple.com/access/integrations/api | **App Manager**: uploads and submits builds; signing credentials come from **Provision** with the local Admin key |
| `EXPO_ASC_ISSUER_ID`, `EXPO_APPLE_TEAM_ID`, `EXPO_APPLE_TEAM_TYPE` | The values in `deploy.secrets.env` | — |
| `EXPO_GOOGLE_SERVICE_ACCOUNT_KEY` | A second service account per [configuring-stores.md](./configuring-stores.md) → **Google service account** | **App permissions** on this app only: View app information, Release apps to testing tracks |

### Ongoing releases

Push or merge to the production branch → the workflow queues the build. `gh run list --workflow deploy-<app>.yml` shows the run; `eas build:list --limit 2 --json --non-interactive` shows the builds and their submissions.

## References

- [Trigger builds from CI](https://docs.expo.dev/build/building-on-ci/)
- [expo/expo-github-action](https://github.com/expo/expo-github-action)
