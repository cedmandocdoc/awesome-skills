# Configuring Stores

## Overview

**Execution mode.** Brings the repository and the Expo project to the state `eas.json`, the deploy workflow, and `DEPLOYMENT.md` declare: the Expo project, runtime values, and store IDs, then guides the store credential setup the user runs once per app. Each run reads state, shows one plan, applies after the user confirms, and updates `DEPLOYMENT.md`.

## Prerequisites

Discovery per [discovering-application.md](./discovering-application.md). Commands per [deployment-contract.md](./deployment-contract.md) → **Running EAS commands**.

## Guidelines

### 1. Discover

| Item | Source |
| --- | --- |
| Expo project | `extra.eas.projectId`; new → the Expo account or organization from discovery |
| Runtime values | [configuring-eas.md](./configuring-eas.md) → **Runtime values** steps 1–2 |
| Store IDs | `ascAppId` from the user once the App Store Connect record exists; `appleTeamId` from https://developer.apple.com/account → Membership details |
| Doc rows | `DEPLOYMENT.md` → **Steps** with Status `todo` |

### 2. Read state

| Item | Check |
| --- | --- |
| Expo project | `eas project:info` |
| `EXPO_TOKEN` | `gh secret list` (names only) |
| Store credentials | `eas build:list --platform <platform> --status finished --limit 1 --json --non-interactive` lists a `production` build with a submission |
| Doc rows with a command check | Run each check |

### 3. Plan and confirm

Show one table: item, now, after. Apply after the user confirms.

### 4. Apply

In this order; skip what already matches.

1. **Expo project.** `eas init --force --non-interactive`; an existing project → `eas init --id <project-id> --force --non-interactive`. Writes `extra.eas.projectId`.
2. **Runtime values.** [configuring-eas.md](./configuring-eas.md) → **Runtime values** step 3.
3. **Store IDs.** `ascAppId` and `appleTeamId` into `eas.json` → `submit.base.ios`.

### 5. Store credentials

Missing → give the user these steps, run in their own terminal from the app package so the Apple ID password and 2FA code stay out of the session:

| Platform | Steps |
| --- | --- |
| iOS | `eas credentials -p ios` → the `production` build profile → set up all build credentials (Apple ID sign-in); then App Store Connect → set up an API key for EAS Submit. A later app of the same team reuses the distribution certificate and key through the same prompts; the yearly certificate renewal runs the same way |
| Android | Create the key per **Google service account**; `eas credentials -p android` → Google Service Account → upload it for submissions; delete the download. The first build generates the keystore; `eas credentials -p android` can download it for the user's password manager |

### 6. Verify

Re-run step 2 after the first merge's build: every planned item matches. The build takes 10–30 minutes; `errored` → [troubleshooting-deployment.md](./troubleshooting-deployment.md).

### 7. Update the doc

Set each `DEPLOYMENT.md` row per [deployment-contract.md](./deployment-contract.md) → **Deployment doc**.

### 8. Confirm to the user

- Applied changes, per the plan table
- `eas.json` and `app.json` changes to commit (`projectId`, runtime values, store IDs)
- `EXPO_TOKEN` per [configuring-github-actions.md](./configuring-github-actions.md) → **CI token**, when unset
- `DEPLOYMENT.md` rows still `todo`, grouped by owner, with the Done when of each `user` row

### Google service account

Once per Play account, with the gcloud CLI or at https://console.cloud.google.com in the same steps; the key goes outside the repository:

```bash
gcloud services enable androidpublisher.googleapis.com --project <gcp-project>
gcloud iam service-accounts create eas-submit --project <gcp-project>
gcloud iam service-accounts keys create ~/Downloads/eas-submit.json \
  --iam-account eas-submit@<gcp-project>.iam.gserviceaccount.com
```

Then at https://play.google.com/console → Users and permissions → Invite new users → the service account's email, with permissions: View app information, Edit and delete draft apps, Release to production, Release apps to testing tracks, Manage testing tracks and edit tester lists, Manage store presence. **Account permissions** let one key serve every app of the account; **App permissions** limit it to chosen apps — the user's choice.

## Related

- [configuring-eas.md](./configuring-eas.md)
- [executing-release.md](./executing-release.md)
- [troubleshooting-deployment.md](./troubleshooting-deployment.md)

## References

- [Submit to Google Play: service account](https://github.com/expo/fyi/blob/main/creating-google-service-account.md)
- [Submit to the App Store](https://docs.expo.dev/submit/ios/)
- [App credentials](https://docs.expo.dev/app-signing/app-credentials/)
