---
doc_type: deployment
generated_by: deploying-expo-native-application
---

# {{APP_NAME}} deployment

## App

| Field | Value |
| --- | --- |
| App package | `{{APP_PACKAGE}}` |
| iOS bundle ID | `{{BUNDLE_ID}}` |
| Android package | `{{ANDROID_PACKAGE}}` |
| EAS project | `{{EAS_PROJECT_ID}}` on `{{EXPO_ACCOUNT}}` |
| Apple team | `{{APPLE_TEAM_ID}}` |
| Production branch | `{{PRODUCTION_BRANCH}}` |
| Workflow | `.github/workflows/deploy-{{APP}}.yml` |

## Release flow

1. A push to `{{PRODUCTION_BRANCH}}` that touches the app builds the `production` profile and submits it to TestFlight and the Play `internal` track.
2. `eas metadata:push` updates the App Store listing from `store.config.json` once the build is processed.
3. Android goes to the Play `production` track through the Release recipe; iOS goes to review in App Store Connect.

## Steps

| Step | Platform | Scope | Owner | Done when | Status |
| --- | --- | --- | --- | --- | --- |
| Apple Developer Program membership | iOS | team | user | Membership active at https://developer.apple.com/account | todo |
| App Store Connect API key with Admin access, local | iOS | team | user | `credentials/asc-api-key.p8` exists and its IDs are in `deploy.secrets.env` | todo |
| Google Play developer account | Android | team | user | Account active at https://play.google.com/console | todo |
| Google service account with release permissions | Android | team | user | `credentials/google-service-account.json` exists and the first Android submission succeeds | todo |
| Expo project linked | both | app | agent | `extra.eas.projectId` in the app config | todo |
| CI credentials: Expo robot token, App Manager key, CI service account | both | app | user | `gh secret list` shows every name the workflow reads | todo |
| EAS environment variables set | both | app | agent | `eas env:list --environment production` matches the plan | todo |
| Signing credentials | both | app | agent | A `production` build finished: `eas build:list --status finished --limit 1 --json --non-interactive` | todo |
| App record in App Store Connect | iOS | app | user | `ascAppId` in `eas.json`. Create it at https://appstoreconnect.apple.com/apps → New App with the bundle ID; the Apple ID number is under App Information | todo |
| App in Google Play Console | Android | app | user | The first Android submission succeeds. Create it at https://play.google.com/console → Create app with the package name | todo |
| Play store listing, content rating, data safety, target audience, privacy policy URL | Android | app | user | The Play Console dashboard shows no setup task. Reuse the `store.config.json` description; screenshots from `store/android/` | todo |
| Deploy workflow | both | app | agent | `gh run list --workflow deploy-{{APP}}.yml` shows a successful run | todo |
| App Store listing | iOS | app | agent | `eas metadata:push --non-interactive` succeeds | todo |
| App Store screenshots | iOS | app | user | Uploaded under the version in App Store Connect, from `store/apple/` | todo |
| Build submitted to TestFlight and Play internal | both | release | agent | `eas build:list --limit 1 --json --non-interactive` shows the version with submissions | todo |
| Promoted to Play production | Android | release | agent | `eas submit --platform android --profile production` succeeds | todo |
| Submitted for App Store review | iOS | release | user | The build is added to the version and submitted at https://appstoreconnect.apple.com/apps | todo |
