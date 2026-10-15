# Deployment Contract

## Overview

Shared rules for every recipe: the files the skill owns, how `eas` commands run, the GitHub values the workflow reads, and `DEPLOYMENT.md`, the per-app record of what releases automatically and which store steps the user still owns.

## Guidelines

### Files

| File | Holds | Git |
| --- | --- | --- |
| `<app-package>/deploy.secrets.env` | `EXPO_TOKEN`, `EXPO_ASC_KEY_ID`, `EXPO_ASC_ISSUER_ID`, `EXPO_APPLE_TEAM_ID`, `EXPO_APPLE_TEAM_TYPE` | ignored |
| `<app-package>/credentials/asc-api-key.p8` | App Store Connect API key | ignored |
| `<app-package>/credentials/google-service-account.json` | Google service account key | ignored |
| `<app-package>/eas.json` | Build and submit profiles — [configuring-eas.md](./configuring-eas.md) | committed |
| `<app-package>/store.config.json` | App Store listing — [configuring-eas.md](./configuring-eas.md) → **App Store metadata** | committed |
| `<app-package>/DEPLOYMENT.md` | **Deployment doc** | committed |
| `.github/workflows/deploy-<app>.yml` | Deploy workflow — [configuring-github-actions.md](./configuring-github-actions.md) | committed |

`<app>` is the app package's directory name (`mobile` for `apps/mobile`).

### Running EAS commands

From the app package, with the deploy environment loaded:

```bash
( set -a; . deploy.secrets.env; set +a; EXPO_ASC_API_KEY_PATH=credentials/asc-api-key.p8 eas <command> --non-interactive )
```

`EXPO_TOKEN` replaces the `eas login` session. The `EXPO_ASC_*` and `EXPO_APPLE_*` values let EAS register the bundle ID, create the distribution certificate and provisioning profile, submit, and push metadata through the App Store Connect API instead of an Apple ID sign-in. Android signing needs nothing: EAS generates the keystore on the first build.

### GitHub values

| Rule | Detail |
| --- | --- |
| Needed names | Every `${{ secrets.<NAME> }}` and `${{ vars.<NAME> }}` in `.github/workflows/*.yml`, minus `gh secret list` and `gh variable list` |
| Secret value | `gh secret set -f <app-package>/deploy.secrets.env`; a key file: `gh secret set <NAME> < <file>` |
| Names | A value another platform reads starts with its platform: `SUPABASE_*`, `CLOUDFLARE_*`, `EXPO_*`; an app-only value keeps the name the app reads |
| Owner | The platform's skill sets a name; other skills only read it |

This skill sets, all as secrets:

| Name | Value |
| --- | --- |
| `EXPO_TOKEN`, `EXPO_ASC_KEY_ID`, `EXPO_ASC_ISSUER_ID`, `EXPO_APPLE_TEAM_ID`, `EXPO_APPLE_TEAM_TYPE` | `deploy.secrets.env` |
| `EXPO_ASC_API_KEY` | `credentials/asc-api-key.p8` |
| `EXPO_GOOGLE_SERVICE_ACCOUNT_KEY` | `credentials/google-service-account.json` |

App runtime values (`EXPO_PUBLIC_*`) are EAS environment variables, never GitHub values or workflow `env`: the job's environment does not reach the cloud build — [configuring-eas.md](./configuring-eas.md) → **EAS environments**.

### Deployment doc

`<app-package>/DEPLOYMENT.md`, written from [../assets/deployment.md](../assets/deployment.md) with the discovery values filled in and the rows of a platform the app lacks removed.

| Column | Values |
| --- | --- |
| Scope | `team` — once per Apple team or Play account, reused by every app; `app` — once per app; `release` — per version |
| Owner | `agent` — a recipe runs it; `user` — no CLI or API exists |
| Status | `todo`; `done <YYYY-MM-DD>`; `n/a` |

A row turns `done` when its Done when check passes, when the agent ran the step, or when the user says it is done. **Provision** and **Release** re-check every row that has a command check and update the column before reporting; the report lists the rows still `todo`, grouped by owner, with the Done when of each `user` row.

## Related

- [../assets/deployment.md](../assets/deployment.md)
- [configuring-eas.md](./configuring-eas.md)
- [configuring-github-actions.md](./configuring-github-actions.md)
