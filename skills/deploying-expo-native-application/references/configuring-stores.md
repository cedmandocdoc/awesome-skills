# Configuring Stores

## Overview

**Execution mode.** Brings EAS, App Store Connect, Google Play, and the GitHub repository to the state `eas.json`, the deploy workflow, and `DEPLOYMENT.md` declare: the Expo project, EAS environment variables, GitHub values, store IDs, and signing credentials from the first production build. Each run reads remote state, shows one plan, applies after the user confirms, and updates `DEPLOYMENT.md`.

## Prerequisites

Discovery per [discovering-application.md](./discovering-application.md). Commands per [deployment-contract.md](./deployment-contract.md) → **Running EAS commands**.

## Guidelines

### 1. Discover

| Item | Source |
| --- | --- |
| Expo project | `extra.eas.projectId`; new → the Expo account or organization from discovery |
| Runtime variables | [configuring-eas.md](./configuring-eas.md) → **EAS environments** steps 1–2 |
| GitHub values | [deployment-contract.md](./deployment-contract.md) → **GitHub values** |
| Store IDs | `ascAppId` from the user once the App Store Connect record exists; `appleTeamId` from `deploy.secrets.env` |
| Doc rows | `DEPLOYMENT.md` → **Steps** with Status `todo` |

### 2. Read remote state

| Item | Check |
| --- | --- |
| Expo project | `eas project:info` |
| EAS variables | `eas env:list --environment <environment>` per environment |
| GitHub values | `gh secret list` (names only) |
| Signing credentials | `eas build:list --platform <platform> --status finished --limit 1 --json --non-interactive` lists a `production` build |
| Doc rows with a command check | Run each check |

### 3. Plan and confirm

Show one table: item, remote now, after. Runtime variables show as new / changed / unchanged per environment. Apply after the user confirms.

### 4. Apply

In this order; skip what already matches.

1. **Expo project.** `eas init --force --non-interactive`; an existing project → `eas init --id <project-id> --force --non-interactive`. Writes `extra.eas.projectId`.
2. **GitHub values.** Per [deployment-contract.md](./deployment-contract.md) → **GitHub values**.
3. **EAS variables.** [configuring-eas.md](./configuring-eas.md) → **EAS environments** step 4.
4. **Store IDs.** `ascAppId` and `appleTeamId` into `eas.json` → `submit.base.ios`.
5. **Signing credentials.** `eas build --platform <platforms> --profile production --non-interactive --no-wait`: EAS registers the bundle ID and creates the distribution certificate and provisioning profile through the API key, and generates the Android keystore.

### 5. Verify

Re-run step 2: every planned item matches. The build takes 10–30 minutes; `eas build:list --limit <platforms> --json --non-interactive` shows `finished` per platform, `errored` → [troubleshooting-deployment.md](./troubleshooting-deployment.md).

### 6. Update the doc

Set each `DEPLOYMENT.md` row per [deployment-contract.md](./deployment-contract.md) → **Deployment doc**.

### 7. Confirm to the user

- Applied changes, per the plan table
- `eas.json` and `app.json` changes to commit (`projectId`, store IDs)
- The GitHub values now set, by name; the deploy workflow can run on the next push
- `DEPLOYMENT.md` rows still `todo`, grouped by owner, with the Done when of each `user` row

### Google service account

Once per Play account, with the gcloud CLI or at https://console.cloud.google.com in the same steps:

```bash
gcloud services enable androidpublisher.googleapis.com --project <gcp-project>
gcloud iam service-accounts create eas-submit --project <gcp-project>
gcloud iam service-accounts keys create <app-package>/credentials/google-service-account.json \
  --iam-account eas-submit@<gcp-project>.iam.gserviceaccount.com
```

Then at https://play.google.com/console → Users and permissions → Invite new users → the service account's email, **Account permissions**: View app information, Edit and delete draft apps, Release to production, Release apps to testing tracks, Manage testing tracks and edit tester lists, Manage store presence. The key serves every app of the account and stays local.

For CI, repeat with a second account (`eas-submit-ci`), write its key outside the repository, and invite it with **App permissions** on this app only: View app information, Release apps to testing tracks.

## Related

- [configuring-eas.md](./configuring-eas.md)
- [executing-release.md](./executing-release.md)
- [troubleshooting-deployment.md](./troubleshooting-deployment.md)

## References

- [Submit to Google Play: service account](https://github.com/expo/fyi/blob/main/creating-google-service-account.md)
- [Submit to the App Store](https://docs.expo.dev/submit/ios/)
