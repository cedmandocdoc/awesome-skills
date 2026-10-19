# Troubleshooting Deployment

## Overview

**Read-only.** Diagnose prompts, build, submission, and metadata failures for an Expo app deployed through GitHub Actions and EAS.

## Guidelines

### A command prompts or stops in non-interactive mode

| Prompt or message | Missing | Action |
| --- | --- | --- |
| Apple ID sign-in, `authentication with an ASC API key is required`, missing credentials in non-interactive mode | This app's store credentials on EAS, or an expired distribution certificate | The user runs `eas credentials -p <platform>` per [configuring-stores.md](./configuring-stores.md) → **Store credentials**; then re-run the workflow |
| `Apple Team ID:` | `appleTeamId` in the submit profile | Set it |
| `Set ascAppId in the submit profile` | The App Store Connect record or its ID | `DEPLOYMENT.md` → App record; **Provision** step 4 |
| `What would you like to submit?` | `--latest` or `--id` | Add the flag |
| `An Expo user account is required` | Locally: the `eas login` session expired. In the workflow: `EXPO_TOKEN` is revoked | `eas login`; or replace the secret per [configuring-github-actions.md](./configuring-github-actions.md) → **CI token** |
| `Invalid UUID appId` | `extra.eas.projectId` | **Provision** step 4 |

### Build fails

| Symptom | Likely cause | Action |
| --- | --- | --- |
| Check secrets fails | `EXPO_TOKEN` unset | Set it per [configuring-github-actions.md](./configuring-github-actions.md) → **CI token**; `gh run rerun <run-id>` |
| Install fails on EAS | Lockfile, or `node` and `pnpm` pins in `build.base`, differ from the repo | Align with `.nvmrc` and `packageManager` |
| Provisioning profile or certificate error | The certificate expired, or the bundle ID belongs to another team | The user runs `eas credentials -p ios`; check https://developer.apple.com/account/resources/identifiers |
| Build succeeds but the app cannot reach the API | Runtime value missing from that profile's `env` | Add it per [configuring-eas.md](./configuring-eas.md) → **Runtime values**; merge |
| Wrong bundle ID or package in the binary | `app.json` changed after the store record was created | Match `app.json` to the record |

### Submission fails

| Symptom | Likely cause | Action |
| --- | --- | --- |
| iOS: app not found for the bundle ID | No App Store Connect record, or `ascAppId` belongs to another app | `DEPLOYMENT.md` → App record |
| Android `PERMISSION_DENIED` or `403` | Key not uploaded to EAS for this app, service account not invited or missing permissions, or the Android Publisher API disabled | [configuring-stores.md](./configuring-stores.md) → **Store credentials** and **Google service account** |
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
