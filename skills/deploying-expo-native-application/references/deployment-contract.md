# Deployment Contract

## Overview

Shared rules for every recipe: the files the skill owns, how `eas` commands run, and `DEPLOYMENT.md`, the user's guide to the deploy steps that cannot be automated.

## Guidelines

### Files

| File | Holds |
| --- | --- |
| `<app-package>/eas.json` | Build and submit profiles, with each profile's public runtime values — [configuring-eas.md](./configuring-eas.md) |
| `<app-package>/store.config.json` | App Store listing — [configuring-eas.md](./configuring-eas.md) → **App Store metadata** |
| `<app-package>/DEPLOYMENT.md` | **Deployment doc** |
| `.github/workflows/deploy-<app>.yml` | Deploy workflow — [configuring-github-actions.md](./configuring-github-actions.md) |

All committed; public values live in them, never in GitHub variables. `EXPO_TOKEN` is the only GitHub secret; store keys live on EAS. `<app>` is the app package's directory name (`mobile` for `apps/mobile`).

### Running EAS commands

From the app package: `eas <command> --non-interactive`, as the `eas login` session; an exported `EXPO_TOKEN` replaces it, so the shell never exports one.

Signing credentials and store keys live on EAS, per app, set up once by the user per [configuring-stores.md](./configuring-stores.md) → **Store credentials**. A non-interactive build reuses them and renews provisioning profiles with the stored App Store Connect key, but never creates or attaches a distribution certificate; Android signing needs nothing, since the first build generates the keystore.

### Deployment doc

`<app-package>/DEPLOYMENT.md`, written when missing from [../assets/deployment.md](../assets/deployment.md) with the discovery values filled in and the rows, steps, and sections of a platform the app lacks removed.

- A `DEPLOYMENT.md` there with another `generated_by` → stop and ask where to write it.
- Status is `todo`, `done <YYYY-MM-DD>`, or `n/a`. Each update re-checks every Done when that is a command and sets Status; a row also turns `done` when the user says so.
- The report lists the **Manual setup** rows still `todo`, each with its How.

## Related

- [../assets/deployment.md](../assets/deployment.md)
- [configuring-eas.md](./configuring-eas.md)
- [configuring-github-actions.md](./configuring-github-actions.md)
