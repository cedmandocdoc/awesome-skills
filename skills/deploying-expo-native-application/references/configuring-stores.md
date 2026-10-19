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
| Doc rows | `DEPLOYMENT.md` → **Manual setup** with Status `todo` |

### 2. Read state

| Item | Check |
| --- | --- |
| Expo project | `eas project:info` |
| Store credentials | `eas build:list --platform <platform> --status finished --limit 1 --json --non-interactive` lists a `production` build with a submission |

### 3. Plan and confirm

Show one table: item, now, after. Apply after the user confirms.

### 4. Apply

In this order; skip what already matches.

1. **Expo project.** `eas init --force --non-interactive`; an existing project → `eas init --id <project-id> --force --non-interactive`. Writes `extra.eas.projectId`.
2. **Runtime values.** [configuring-eas.md](./configuring-eas.md) → **Runtime values** step 3.
3. **Store IDs.** `ascAppId` and `appleTeamId` into `eas.json` → `submit.base.ios`.

### 5. Store credentials

Missing → the user runs the `DEPLOYMENT.md` credential rows in their own terminal from the app package, so the Apple ID password and 2FA code stay out of the session.

### 6. Verify

Re-run step 2 after the first merge's build: every planned item matches. The build takes 10–30 minutes; `errored` → [troubleshooting-deployment.md](./troubleshooting-deployment.md).

### 7. Update the doc

Set each `DEPLOYMENT.md` row per [deployment-contract.md](./deployment-contract.md) → **Deployment doc**.

### 8. Confirm to the user

- Applied changes, per the plan table
- `eas.json`, `app.json`, and `DEPLOYMENT.md` changes to commit (`projectId`, runtime values, store IDs)
- The `DEPLOYMENT.md` report per [deployment-contract.md](./deployment-contract.md) → **Deployment doc**

## Related

- [configuring-eas.md](./configuring-eas.md)
- [executing-release.md](./executing-release.md)
- [troubleshooting-deployment.md](./troubleshooting-deployment.md)

## References

- [Submit to Google Play: service account](https://github.com/expo/fyi/blob/main/creating-google-service-account.md)
- [Submit to the App Store](https://docs.expo.dev/submit/ios/)
- [App credentials](https://docs.expo.dev/app-signing/app-credentials/)
