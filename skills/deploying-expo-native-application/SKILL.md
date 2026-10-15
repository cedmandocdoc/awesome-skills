---
name: deploying-expo-native-application
id: ba26301f-928c-4984-9b30-7009e3dc5db5
description: Deploy an Expo native app (iOS/Android) to TestFlight, the App Store, and Google Play through GitHub Actions and EAS — discover the app package, configure eas.json build and submit profiles and EAS environments, write the deploy workflow, provision the Expo project, signing credentials, store keys, and GitHub values without an Apple or Google sign-in, record the store steps the user still owns in DEPLOYMENT.md, and submit, promote, or push store metadata. Use when deploying an Expo app, setting up EAS builds in GitHub Actions, configuring eas.json, setting EAS environment variables or store credentials, submitting to TestFlight or Google Play, pushing App Store metadata, or asking what is left before a store release.
version: 2.0.0
---

# Deploying an Expo native application

## Setup

| Item | Kind | Required | When | Done when | How |
| --- | --- | --- | --- | --- | --- |
| Node.js 22+ with the project's package manager | user | required | All | `node --version` prints v22 or later and the lockfile's package manager (`npm`, `pnpm`, `yarn`) runs | https://nodejs.org |
| EAS CLI | user | required | All | `eas --version` prints 24.0.0 or later | `npm install -g eas-cli@latest` |
| Expo account | user | required | All | `eas whoami` shows an account with access to the project's organization | Sign up at https://expo.dev/signup, then `eas login` |
| GitHub CLI | user | required | Deploy, Provision, Release | `gh auth status` succeeds and `gh repo view` finds the repository | https://cli.github.com, then `gh auth login`; create the GitHub repository and push the project |
| Secrets files ignored | auto | required | Provision, Release | `git check-ignore -q <app-package>/deploy.secrets.env <app-package>/credentials/asc-api-key.p8` succeeds and `git ls-files '*.secrets.*' '*.p8' '*credentials/*'` prints nothing | Add `*.secrets.*` and `credentials/` to root `.gitignore`, and to `<app-package>/.easignore` when it exists. A tracked file → `git rm --cached <file>`, then tell the user its values are in git history and must be rotated |
| Expo access token | user | required | Deploy, Provision, Release | `( set -a; . <app-package>/deploy.secrets.env; set +a; eas whoami )` shows the account | Write `EXPO_TOKEN=` into `<app-package>/deploy.secrets.env`; the user creates a token at https://expo.dev/settings/access-tokens and pastes it there |
| Apple Developer Program | user | optional | Provision, Release, when `ios.bundleIdentifier` is set | The user confirms an active membership | https://developer.apple.com/programs/enroll/ |
| App Store Connect API key | user | optional | Provision, Release, when `ios.bundleIdentifier` is set | `<app-package>/credentials/asc-api-key.p8` exists and `deploy.secrets.env` has a value for `EXPO_ASC_KEY_ID`, `EXPO_ASC_ISSUER_ID`, `EXPO_APPLE_TEAM_ID`, and `EXPO_APPLE_TEAM_TYPE` | Once per Apple team: https://appstoreconnect.apple.com/access/integrations/api → Team Keys → generate with **Admin** access; save the `.p8` as `<app-package>/credentials/asc-api-key.p8`; write the Key ID, the Issuer ID, the Team ID from https://developer.apple.com/account → Membership details, and `EXPO_APPLE_TEAM_TYPE=INDIVIDUAL` or `COMPANY_OR_ORGANIZATION` into `deploy.secrets.env` |
| Google Play Console | user | optional | Provision, Release, when `android.package` is set | The user confirms a developer account | https://play.google.com/console/signup |
| Google service account key | user | optional | Provision, Release, when `android.package` is set | `jq -r .client_email <app-package>/credentials/google-service-account.json` prints an address | Once per Play account, per [configuring-stores.md](references/configuring-stores.md) → **Google service account** |
| Production branch | ask | required | Deploy | `.github/workflows/deploy-<app>.yml` names it under `on.push.branches` | The product TRD's **Environments and deployment** names it → use it; else the branch `git remote show origin` marks as HEAD; recorded in the workflow |
| Deployment doc | static | required | Deploy, Provision, Release | `<app-package>/DEPLOYMENT.md` carries `generated_by: deploying-expo-native-application` | Write it from [`assets/deployment.md`](assets/deployment.md) per [deployment-contract.md](references/deployment-contract.md) → **Deployment doc** |

## Workflow

1. **Setup** — for each **Setup** row whose When covers the request, in order: Done when holds → skip; `user` → stop and print its How when required, continue without it when optional; `ask` → fill what the request answers, ask the rest together in one message, record each answer; `auto` and `static` → run.
2. **Contract** — read [deployment-contract.md](references/deployment-contract.md).
3. **Recipe** — match one **Recipes** row; open every doc in its Read column.

- Releases build through the GitHub Actions workflow on push to the production branch; `eas build` runs locally only for the first signing credentials in **Provision** or on a **Release** request.
- Changes EAS, App Store Connect, Google Play, and the GitHub repository settings only after the user confirms that run's plan.
- Runs every `eas` command per [deployment-contract.md](references/deployment-contract.md) → **Running EAS commands**: non-interactive, with the deploy environment loaded in a subshell. A prompt is a missing **Setup** row or `DEPLOYMENT.md` step, never a question to answer. Never prints a secret value.
- Store work with no API — app records, listings, screenshots, review — belongs to the user and is listed only in `<app-package>/DEPLOYMENT.md`.

## Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Set up | "Set up Expo deployment", "Is deploying-expo-native-application ready?" | **Setup** — run Workflow step 1 for every row, then report each row's state |
| Deploy | "Deploy the mobile app", "Add the EAS deploy workflow", "Set up EAS builds in GitHub Actions", "Deploy apps/mobile from the monorepo" | [deploying-application.md](references/deploying-application.md) |
| Provision | "Link the Expo project", "Set the EAS environment variables", "Create the signing credentials", "Run the first production build", "What is left before the store release?" | [configuring-stores.md](references/configuring-stores.md) |
| Release | "Submit to TestFlight", "Promote to Play production", "Push the App Store listing", "Build a preview", "Build now without pushing" | [executing-release.md](references/executing-release.md) |
| Troubleshoot | "The deploy workflow failed", "The submission failed", "eas asks for an Apple ID" | [troubleshooting-deployment.md](references/troubleshooting-deployment.md) |
