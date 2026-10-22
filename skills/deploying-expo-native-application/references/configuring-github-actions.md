# Configuring GitHub Actions

## Overview

The deploy workflow and the one secret it reads. The job ends once the build is queued; EAS builds and submits in its own cloud with the credentials stored there.

## Prerequisites

App package, platforms, production branch, and watch paths from [discovering-application.md](./discovering-application.md). Profiles from [configuring-eas.md](./configuring-eas.md).

## Guidelines

### Workflow file

`.github/workflows/deploy-<app>.yml`, one per app package. Adapt the setup steps to the package manager (drop `pnpm/action-setup` for npm; `npm ci` instead of `pnpm install`). Set `--platform` to the platforms the app has; drop the metadata steps and option for an Android-only app. Pin third-party actions to a commit SHA.

```yaml
name: Deploy <app>
run-name: Deploy <app> · ${{ inputs.action || 'build' }}

on:
  push:
    branches: [<production-branch>]
    paths: ["<app-package>/**", "<lockfile>", ".github/workflows/deploy-<app>.yml", "!<app-package>/DEPLOYMENT.md"]
  workflow_dispatch:
    inputs:
      action:
        type: choice
        options: [build, preview, metadata]
        default: build

concurrency: deploy-<app>

permissions:
  contents: read

jobs:
  deploy:
    name: ${{ inputs.action || 'build' }}
    if: github.ref == 'refs/heads/<production-branch>'
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: <app-package>
    steps:
      - name: Check secrets
        working-directory: .
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
        run: |
          if [ -z "$EXPO_TOKEN" ]; then
            echo "::error::Set EXPO_TOKEN in Settings → Secrets and variables → Actions"
            exit 1
          fi
      - uses: actions/checkout@v7
        with:
          fetch-depth: 2
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
      - name: Build and submit
        if: github.event_name == 'push' || inputs.action == 'build'
        run: eas build --platform all --profile production --auto-submit-with-profile internal --non-interactive --no-wait
      - name: Listing changed
        id: listing
        if: github.event_name == 'push'
        run: git diff --quiet HEAD^ HEAD -- store.config.json || echo "changed=true" >> "$GITHUB_OUTPUT"
      - name: Push App Store listing
        if: steps.listing.outputs.changed == 'true' || inputs.action == 'metadata'
        run: EXPO_APPLE_TEAM_ID=$(jq -r '.submit.base.ios.appleTeamId' eas.json) eas metadata:push --profile production --non-interactive
      - name: Preview build
        if: inputs.action == 'preview'
        run: eas build --platform all --profile preview --non-interactive --no-wait
```

| Need | Change |
| --- | --- |
| Fail the run when the build fails | Drop `--no-wait`; the job then waits for EAS and spends runner minutes |

### CI token

The workflow's `EXPO_TOKEN`. Local commands use the `eas login` session.

1. The user creates a token with the **Developer** role on the Expo account that owns the project: a robot user token at https://expo.dev → the account → Settings → Robot users, or a personal access token. Which accounts it reaches is the user's choice, so one token can serve several repos.
2. The user sets it as the `EXPO_TOKEN` repository secret: GitHub → Settings → Secrets and variables → Actions → **New repository secret**, or `gh secret set EXPO_TOKEN` in their own terminal.

## References

- [Trigger builds from CI](https://docs.expo.dev/build/building-on-ci/)
- [expo/expo-github-action](https://github.com/expo/expo-github-action)
