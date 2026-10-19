---
name: deploying-expo-native-application
id: ba26301f-928c-4984-9b30-7009e3dc5db5
description: Deploy an Expo native app to TestFlight, the App Store, and Google Play through GitHub Actions and EAS — write eas.json profiles with the app's public values and a deploy workflow that builds, submits, and pushes the App Store listing on every merge; guide the one-time store credential setup on EAS; track the store steps the user owns in DEPLOYMENT.md. Use when deploying an Expo app, setting up EAS builds in GitHub Actions, configuring eas.json, setting up store credentials, submitting to TestFlight or Google Play, pushing App Store metadata, or asking what is left before a store release.
version: 4.1.0
---

# Deploying an Expo native application

## Setup

| Item | Kind | Required | When | Done when | How |
| --- | --- | --- | --- | --- | --- |
| Node.js 22+ with the project's package manager | user | required | All | `node --version` prints v22 or later and the lockfile's package manager (`npm`, `pnpm`, `yarn`) runs | https://nodejs.org |
| EAS CLI | user | required | All | `eas --version` prints 24.0.0 or later | `npm install -g eas-cli@latest` |
| Expo account | user | required | All | `eas whoami` shows an account with access to the project's organization | Sign up at https://expo.dev/signup, then `eas login` |
| GitHub CLI | user | required | Deploy, Provision, Release | `gh auth status` succeeds and `gh repo view` finds the repository | https://cli.github.com, then `gh auth login`; create the GitHub repository and push the project |
| Apple Developer Program | user | optional | Provision, Release, when `ios.bundleIdentifier` is set | The user confirms an active membership | https://developer.apple.com/programs/enroll/ |
| Google Play Console | user | optional | Provision, Release, when `android.package` is set | The user confirms a developer account | https://play.google.com/console/signup |
| CI token | user | required | Provision | `gh secret list` shows `EXPO_TOKEN` | Per [configuring-github-actions.md](references/configuring-github-actions.md) → **CI token** |
| Production branch | ask | required | Deploy | `.github/workflows/deploy-<app>.yml` names it under `on.push.branches` | The branch `git remote show origin` marks as HEAD; recorded in the workflow |

## Workflow

1. **Setup** — for each **Setup** row whose When covers the request, in order: Done when holds → skip; `user` → stop and print its How when required, continue without it when optional; `ask` → fill what the request answers, ask the rest together in one message, record each answer; `auto` and `static` → run.
2. **Contract** — read [deployment-contract.md](references/deployment-contract.md).
3. **Recipe** — match one **Recipes** row; open every doc in its Read column.

- Builds, submissions, and listing pushes run in the deploy workflow. Locally it only creates the Expo project, after the user confirms, and reads state.
- Runs every `eas` command per [deployment-contract.md](references/deployment-contract.md) → **Running EAS commands**. A prompt is a missing **Setup** row or `DEPLOYMENT.md` step, never a question to answer.
- Sets no secret or store credential: the user sets `EXPO_TOKEN` in GitHub and runs `eas credentials` in their own terminal.
- Store work with no API — app records, listings, screenshots, review — belongs to the user and is listed only in `<app-package>/DEPLOYMENT.md`.

## Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Set up | "Set up Expo deployment", "Is deploying-expo-native-application ready?" | **Setup** — run Workflow step 1 for every row, then report each row's state |
| Deploy | "Deploy the mobile app", "Add the EAS deploy workflow", "Set up EAS builds in GitHub Actions", "Deploy apps/mobile from the monorepo" | [deploying-application.md](references/deploying-application.md) |
| Provision | "Link the Expo project", "Set up the store credentials", "Set the app's runtime values", "What is left before the store release?" | [configuring-stores.md](references/configuring-stores.md) |
| Release | "Promote to Play production", "Push the App Store listing", "Build a preview", "Build now without pushing" | [executing-release.md](references/executing-release.md) |
| Troubleshoot | "The deploy workflow failed", "The submission failed", "eas asks for an Apple ID" | [troubleshooting-deployment.md](references/troubleshooting-deployment.md) |
