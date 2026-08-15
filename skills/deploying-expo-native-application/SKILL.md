---
name: deploying-expo-native-application
id: ba26301f-928c-4984-9b30-7009e3dc5db5
description: Prepare an Expo native app (iOS/Android) for EAS Build and store release — discover the app package, validate app.json and eas.json profiles, configure EAS environments and secrets, and verify release readiness. Use when setting up mobile deployment, configuring eas.json build/submit profiles, linking an Expo project, or preparing the first EAS build.
version: 1.0.0
---

# Deploying an Expo native application

## Overview

Prepare an Expo app for native (iOS/Android) release: project linkage, `eas.json` profiles, EAS environment variables, and a release-readiness checklist. Stops at deployable configuration. Hand off build and submit to the external **`expo-deployment`** skill (`npx skills add expo/skills --skill expo-deployment`).

## Agent workflow

Run these steps in order before recommending a first `preview` or `production` build. Works wherever the agent can read and write repository files.

### Steps

1. **Discovery** — Resolve the app package, monorepo working directory, bundle IDs, EAS project link, build profiles, runtime env vars, and store-account readiness. Ask the user when multiple Expo apps exist. Follow [discovering-application.md](references/discovering-application.md).

2. **Validate configuration** — From the app package:

   ```bash
   npx expo config --type public
   eas project:info
   ```

   Confirm `eas.json` build and submit profiles. Fix errors before the first cloud build. See [configuring-eas.md](references/configuring-eas.md).

3. **Configure EAS environments and secrets** — Map each `build.<profile>.environment` in `eas.json` to Expo dashboard variables. Store submit credentials in EAS (`eas credentials`). Document the variable matrix. Details: [configuring-eas.md](references/configuring-eas.md).

4. **Add or update repository files** — Verify or create:

   | File | Purpose |
   | --- | --- |
   | `app.json` / `app.config.*` | Bundle ID, version, icons, plugins, `extra.eas.projectId` |
   | `eas.json` | Build and submit profiles |
   | `package.json` scripts | Optional `eas:build:*` / `eas:submit:*` wrappers |

5. **Release readiness** — Walk [reviewing-release-readiness.md](references/reviewing-release-readiness.md). Resolve in-scope blockers. When green, hand off to **`expo-deployment`**.

### Decision tree

```
Prepare Expo native app for release?
├─ Locate app package (app.json + eas.json)
├─ extra.eas.projectId present?
│  └─ No → eas init from app package
├─ eas.json profiles: development / preview / production?
├─ EAS environment variables set per profile?
├─ expo config matches intended bundle ID / version?
└─ Checklist passed → expo-deployment for build and submit
```

## Reference index

| Doc | When to use |
| --- | --- |
| [discovering-application.md](references/discovering-application.md) | Find the Expo app package, validate `app.json`, confirm EAS project linkage |
| [configuring-eas.md](references/configuring-eas.md) | `eas.json` profiles, EAS environments, secrets, version management |
| [reviewing-release-readiness.md](references/reviewing-release-readiness.md) | Pre-build checklist before first `preview` or `production` build |
