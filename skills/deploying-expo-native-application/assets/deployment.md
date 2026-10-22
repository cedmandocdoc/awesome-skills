---
doc_type: deployment
generated_by: deploying-expo-native-application
---

# {{APP_NAME}} deployment

## Target

| Field | Value |
| --- | --- |
| App package | `{{APP_PACKAGE}}` |
| iOS bundle ID | `{{BUNDLE_ID}}` |
| Android package | `{{ANDROID_PACKAGE}}` |
| EAS project | `{{EAS_PROJECT_ID}}` on `{{EXPO_ACCOUNT}}` |
| Apple team | `{{APPLE_TEAM_ID}}` |
| Production branch | `{{PRODUCTION_BRANCH}}` |
| Workflow | `.github/workflows/deploy-{{APP}}.yml` |

## Automatic

A push to `{{PRODUCTION_BRANCH}}` that touches the app builds the `production` profile, submits it to TestFlight and the Play `internal` track, and pushes the App Store listing when `store.config.json` changed.

## Manual setup

| Step | How | Done when | Status |
| --- | --- | --- | --- |
| iOS: Apple Developer Program membership | Enroll at https://developer.apple.com/programs/enroll/ | Membership active at https://developer.apple.com/account | todo |
| Android: Google Play developer account | Sign up at https://play.google.com/console/signup | Account active at https://play.google.com/console | todo |
| Android: Google service account with release permissions | Per **Google service account** below | The service account is invited in Play Console | todo |
| `EXPO_TOKEN` repository secret | Create a robot user token (https://expo.dev → `{{EXPO_ACCOUNT}}` → Settings → Robot users) or a personal access token with the **Developer** role. Set it at GitHub → Settings → Secrets and variables → Actions → **New repository secret**, or with `gh secret set EXPO_TOKEN` in your own terminal | `gh secret list` shows `EXPO_TOKEN` | todo |
| iOS: App record in App Store Connect | https://appstoreconnect.apple.com/apps → **New App** with `{{BUNDLE_ID}}`; give the agent the Apple ID number under App Information | `ascAppId` in `eas.json` | todo |
| iOS: build credentials and App Store Connect key on EAS | In your own terminal from `{{APP_PACKAGE}}`: `eas credentials -p ios` → the `production` build profile → set up all build credentials (Apple ID sign-in); then App Store Connect → set up an API key for EAS Submit. A later app of the same team reuses them through the same prompts; the yearly certificate renewal runs the same way | A `production` iOS build finished with a submission | todo |
| Android: App in Google Play Console | https://play.google.com/console → **Create app** with `{{ANDROID_PACKAGE}}` | The first Android submission succeeds | todo |
| Android: Google service account key on EAS | In your own terminal from `{{APP_PACKAGE}}`: `eas credentials -p android` → Google Service Account → upload the key; then delete the download | The first Android submission succeeds | todo |
| Android: keystore copy in a password manager (optional) | After the first build: `eas credentials -p android` → download the keystore | The keystore is in your password manager | todo |
| Android: Play store listing, content rating, data safety, target audience, privacy policy URL | Play Console dashboard; reuse the `store.config.json` description, screenshots from `store/android/` | The Play Console dashboard shows no setup task | todo |
| iOS: App Store screenshots | Upload under the version in App Store Connect, from `store/apple/` | The version shows the screenshots | todo |

## Each release

1. iOS: add the build to the version at https://appstoreconnect.apple.com/apps and submit it for review.
2. Android: at https://play.google.com/console → Testing → Internal testing, open the release → **Promote release** → Production, then send it for review. A promotion moves the uploaded build; Play rejects a re-upload of the same version code.

## Google service account

Once per Play account, with the gcloud CLI or at https://console.cloud.google.com in the same steps; keep the key outside the repository:

```bash
gcloud services enable androidpublisher.googleapis.com --project <gcp-project>
gcloud iam service-accounts create eas-submit --project <gcp-project>
gcloud iam service-accounts keys create ~/Downloads/eas-submit.json \
  --iam-account eas-submit@<gcp-project>.iam.gserviceaccount.com
```

Then at https://play.google.com/console → Users and permissions → Invite new users → the service account's email, with permissions: View app information, Edit and delete draft apps, Release to production, Release apps to testing tracks, Manage testing tracks and edit tester lists, Manage store presence. **Account permissions** let one key serve every app of the account; **App permissions** limit it to chosen apps.
