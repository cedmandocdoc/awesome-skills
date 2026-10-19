# Deployment Contract

## Overview

Shared rules for every recipe: the files the skill owns, how `eas` commands run, where each value lives, and `DEPLOYMENT.md`, the per-app record of what releases automatically and which store steps the user still owns.

## Guidelines

### Files

| File | Holds |
| --- | --- |
| `<app-package>/eas.json` | Build and submit profiles, with each profile's public runtime values — [configuring-eas.md](./configuring-eas.md) |
| `<app-package>/store.config.json` | App Store listing — [configuring-eas.md](./configuring-eas.md) → **App Store metadata** |
| `<app-package>/DEPLOYMENT.md` | **Deployment doc** |
| `.github/workflows/deploy-<app>.yml` | Deploy workflow — [configuring-github-actions.md](./configuring-github-actions.md) |

All committed. `<app>` is the app package's directory name (`mobile` for `apps/mobile`).

### Running EAS commands

From the app package: `eas <command> --non-interactive`, as the `eas login` session; an exported `EXPO_TOKEN` replaces it, so the shell never exports one.

Signing credentials and store keys live on EAS, per app, set up once by the user per [configuring-stores.md](./configuring-stores.md) → **Store credentials**. A non-interactive build reuses them and renews provisioning profiles with the stored App Store Connect key, but never creates or attaches a distribution certificate; Android signing needs nothing, since the first build generates the keystore.

### Values

| Value | Lives in |
| --- | --- |
| `EXPO_TOKEN` | GitHub repository secret, the only one the workflow reads |
| App runtime values (`EXPO_PUBLIC_*`) | `env` of each build profile in `eas.json`; the job's environment does not reach the cloud build |
| Store IDs (`ascAppId`, `appleTeamId`) | The submit profiles in `eas.json` |
| Signing credentials, App Store Connect key, Google service account key | EAS |

| Rule | Detail |
| --- | --- |
| No GitHub variables | Public values are committed, so they travel with the PR and show in its diff |
| Names | A value from another platform starts with its platform: `EXPO_PUBLIC_SUPABASE_URL`; an app-only value keeps the name the app reads |
| Owner | The platform's skill names a cross-platform value and where it comes from; other skills only read it |

### Deployment doc

`<app-package>/DEPLOYMENT.md`, written from [../assets/deployment.md](../assets/deployment.md) with the discovery values filled in and the rows of a platform the app lacks removed.

| Column | Values |
| --- | --- |
| Scope | `team` — once per Apple team or Play account, reused by every app; `app` — once per app; `release` — per version |
| Owner | `agent` — a recipe runs it; `user` — no CLI or API exists, or it needs the user's sign-in |
| Status | `todo`; `done <YYYY-MM-DD>`; `n/a` |

A row turns `done` when its Done when check passes, when the agent ran the step, or when the user says it is done. **Provision** and **Release** re-check every row that has a command check and update the column before reporting; the report lists the rows still `todo`, grouped by owner, with the Done when of each `user` row.

## Related

- [../assets/deployment.md](../assets/deployment.md)
- [configuring-eas.md](./configuring-eas.md)
- [configuring-github-actions.md](./configuring-github-actions.md)
