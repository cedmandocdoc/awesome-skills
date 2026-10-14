---
name: deploying-expo-native-application
id: ba26301f-928c-4984-9b30-7009e3dc5db5
description: Prepare an Expo native app (iOS/Android) for EAS Build and store release — discover the app package, validate app.json and eas.json profiles, configure EAS environments and secrets, and verify release readiness. Use when setting up EAS deployment for an Expo app, configuring eas.json build/submit profiles, linking an Expo project, or preparing the first EAS build.
version: 1.1.0
---

# Deploying an Expo native application

## Setup

| Item | Kind | Required | When | Done when | How |
| --- | --- | --- | --- | --- | --- |
| Node.js | user | required | All | `node --version` succeeds | https://nodejs.org |
| EAS CLI | user | required | All | `eas --version` succeeds | `npm install -g eas-cli` |
| Expo account | user | required | All | `eas whoami` shows an account with access to the project's organization | Sign up at https://expo.dev/signup, then `eas login` |
| Apple Developer Program | user | optional | iOS store builds | The user confirms an active membership | https://developer.apple.com/programs/enroll/ |
| Google Play Console | user | optional | Android store builds | The user confirms a developer account | https://play.google.com/console/signup |

## Workflow

1. **Setup** — for each **Setup** row whose When covers the request, in order: Done when holds → skip; `user` → stop and print its How when required, continue without it when optional; `ask` → fill what the request answers, ask the rest together in one message, record each answer; `auto` and `static` → run.
2. **Recipe** — match one **Recipes** row; open every doc in its Read column.

- Stops at deployable configuration; build and submit belong to the **`expo-deployment`** skill (`npx skills add expo/skills --skill expo-deployment`).

## Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Set up | "Set up EAS deployment", "Is deploying-expo-native-application ready?" | **Setup** — run Workflow step 1 for every row, then report each row's state |
| Prepare release | "Prepare the app for the first EAS build", "Link the Expo project" | [preparing-release.md](references/preparing-release.md) |
| Configure EAS | "Configure eas.json profiles", "Set the EAS environment variables" | [discovering-application.md](references/discovering-application.md), [configuring-eas.md](references/configuring-eas.md) |
| Review readiness | "Is the app ready for a production build?" | [reviewing-release-readiness.md](references/reviewing-release-readiness.md) |
