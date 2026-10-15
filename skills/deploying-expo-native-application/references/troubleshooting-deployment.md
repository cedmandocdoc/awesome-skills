# Troubleshooting Deployment

## Overview

**Read-only.** Diagnose prompts, build, submission, and metadata failures for an Expo app deployed through GitHub Actions and EAS.

## Guidelines

### A command prompts or stops in non-interactive mode

| Prompt or message | Missing | Action |
| --- | --- | --- |
| Apple ID sign-in, `authentication with an ASC API key is required` | `EXPO_ASC_*` and `EXPO_APPLE_*` not loaded | **Setup** → App Store Connect API key; run per [deployment-contract.md](./deployment-contract.md) → **Running EAS commands** |
| `Apple Team ID:` | `appleTeamId` in the submit profile or `EXPO_APPLE_TEAM_ID` | Set both |
| `Set ascAppId in the submit profile` | The App Store Connect record or its ID | `DEPLOYMENT.md` → App record; **Provision** step 4 |
| `What would you like to submit?` | `--latest` or `--id` | Add the flag |
| `ascApiKeyPath, ascApiKeyIssuerId and ascApiKeyId must all be defined` | One of the three fields | Complete `submit.base.ios` |
| `An Expo user account is required` | `EXPO_TOKEN` not loaded or expired | **Setup** → Expo access token |
| `Invalid UUID appId` | `extra.eas.projectId` | **Provision** step 1 |

### Build fails

| Symptom | Likely cause | Action |
| --- | --- | --- |
| Install fails on EAS | Lockfile, or `node` and `pnpm` pins in `build.base`, differ from the repo | Align with `.nvmrc` and `packageManager` |
| Provisioning profile or certificate error | The API key lacks Admin access, or the bundle ID belongs to another team | Regenerate the key with Admin; check https://developer.apple.com/account/resources/identifiers |
| Build succeeds but the app cannot reach the API | EAS variable missing in that profile's environment | `eas env:list --environment <environment>`; **Provision** step 3 |
| Wrong bundle ID or package in the binary | `app.json` changed after the store record was created | Match `app.json` to the record |

### Submission fails

| Symptom | Likely cause | Action |
| --- | --- | --- |
| iOS: app not found for the bundle ID | No App Store Connect record, or `ascAppId` belongs to another app | `DEPLOYMENT.md` → App record |
| Android `PERMISSION_DENIED` or `403` | Service account not invited, missing permissions, or the Android Publisher API disabled | [configuring-stores.md](./configuring-stores.md) → **Google service account** |
| Android: package not found | App not created in Play Console | `DEPLOYMENT.md` → App in Google Play Console |
| Android: first production release rejected | Store listing, content rating, or data safety incomplete | `DEPLOYMENT.md` → Play store listing |
| Submitted an `.apk` | A `preview` build was submitted | Submit a `production` build (`.aab`) |

### Metadata push fails

| Symptom | Likely cause | Action |
| --- | --- | --- |
| No app or version found | Record missing, or no processed build yet | Wait for TestFlight processing; `DEPLOYMENT.md` → App record |
| Validation errors | `store.config.json` fields | Fix the reported fields; `eas metadata:pull --non-interactive` after dashboard edits so a push does not overwrite them |

### Workflow did not run

| Symptom | Likely cause | Action |
| --- | --- | --- |
| No run on push | Push outside `paths` or the branch | Check `on.push`; `gh workflow run deploy-<app>.yml` |
| Run green but no build | `--no-wait` reports only that the build queued | `eas build:list --limit 2 --json --non-interactive`; the build page has the logs |

### Debugging

- `gh run list --workflow deploy-<app>.yml`, then `gh run view <run-id> --log-failed`
- `eas build:view <build-id>` and the build page logs
- Local check: `eas config --platform <platform> --profile production --non-interactive`

## Related

- [configuring-eas.md](./configuring-eas.md)
- [configuring-stores.md](./configuring-stores.md)
