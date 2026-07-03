---
name: deploying-expo-native-application
description: Prepare an Expo native app (iOS/Android) for EAS Build and store release — discover the app package, validate app.json and eas.json profiles, configure EAS environments and secrets, and verify release readiness. Use when setting up mobile deployment, configuring eas.json build/submit profiles, linking an Expo project, or preparing the first EAS build.
version: 1.0.0
---

# Deploying an Expo native application

## Overview

Prepare an Expo app for **native** (iOS/Android) release: correct project linkage, `eas.json` profiles, EAS environment variables, and a release-readiness checklist. This skill stops at **deployable configuration** — it does not run store submissions or duplicate platform how-to guides. After configuration is green, hand off build and submit operations to the external **`expo-deployment`** skill (`npx skills add expo/skills --skill expo-deployment`).

## Agent workflow

Run these steps **in order** before recommending a first `preview` or `production` build. Works wherever the agent can read and write repository files.

### Steps

1. **Discovery (required)** — Gather facts from the repository and user. Ask the user when multiple Expo apps exist.

   | Question | How to resolve | If unclear |
   | --- | --- | --- |
   | **Which package is the native app?** | `app.json` / `app.config.*`, `expo` dependency, `eas.json` | List candidates; ask user to pick one |
   | **Monorepo working directory** | Path to the package containing `app.json` and `eas.json` | Ask user |
   | **Bundle ID / package name** | `app.json` → `ios.bundleIdentifier`, `android.package` | Confirm with user before first store build |
   | **Expo project linked?** | `extra.eas.projectId` in app config | Run `eas init` from the app package if missing |
   | **Build profiles needed** | `eas.json` `build` section | Default: `development`, `preview`, `production` |
   | **Runtime env vars** | `EXPO_PUBLIC_*` usage in source; project docs | List required vars per EAS environment |
   | **Store accounts ready?** | User confirms Apple Developer + Play Console | Note as blocker for `production` profile |

   Full discovery heuristics: [discovering-application.md](references/discovering-application.md).

2. **Validate configuration locally (required)** — From the discovered app package:

   ```bash
   npx expo config --type public
   eas project:info
   ```

   Confirm `eas.json` has the expected build and submit profiles. See [configuring-eas.md](references/configuring-eas.md).

   Fix config errors before the first cloud build or credential setup.

3. **Configure EAS environments and secrets** — Set Expo environment variables in the Expo dashboard for each EAS environment used by build profiles (`development`, `preview`, `production`).

   - Map each `build.<profile>.environment` value in `eas.json` to dashboard variables.
   - Never commit secrets or service-account JSON to the repo.
   - Store submit credentials in EAS (`eas credentials`), not in git.

   Document the variable matrix for the user. Details: [configuring-eas.md](references/configuring-eas.md).

4. **Add or update repository files** — Minimum files to verify or create:

   | File | Purpose |
   | --- | --- |
   | `app.json` / `app.config.*` | Bundle ID, version, icons, native plugins, `extra.eas.projectId` |
   | `eas.json` | Build profiles (`development`, `preview`, `production`) and submit profiles |
   | `package.json` scripts | Optional `eas:build:*` / `eas:submit:*` wrappers for the team |

   Use [configuring-eas.md](references/configuring-eas.md) for profile patterns. Adapt bundle IDs, env vars, and submit track names to the project.

5. **Release readiness gate** — Before the first `preview` or `production` build, walk through [reviewing-release-readiness.md](references/reviewing-release-readiness.md). Resolve blockers (missing project link, unset secrets, wrong bundle ID) in this skill's scope.

   When configuration is green, hand off to **`expo-deployment`** for `eas build`, `eas submit`, credential flows, and store console operations.

### Decision tree

```
Prepare Expo native app for release?
├─ Locate app package (app.json + eas.json)
├─ extra.eas.projectId present?
│  └─ No → eas init from app package
├─ eas.json profiles defined?
│  ├─ development (dev client)
│  ├─ preview (internal QA, Ad Hoc / APK) → recommended before store builds
│  └─ production (store distribution)
├─ EAS environment variables set per profile?
├─ expo config --type public matches intended bundle ID / version?
└─ Release checklist passed → use expo-deployment to build and submit
```

## Reference index

| Doc | When to use |
| --- | --- |
| [discovering-application.md](references/discovering-application.md) | Find the Expo app package in a monorepo, validate `app.json`, confirm EAS project linkage |
| [configuring-eas.md](references/configuring-eas.md) | `eas.json` build/submit profiles, EAS environments, secrets, version management |
| [reviewing-release-readiness.md](references/reviewing-release-readiness.md) | Pre-build checklist before first `preview` or `production` build |
