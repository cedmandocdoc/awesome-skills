# Configuring EAS

## Overview

Configure `eas.json` and EAS environments for cloud builds. Build and submit commands: external **`expo-deployment`** skill.

## Prerequisites

- App package resolved per [discovering-application.md](./discovering-application.md)
- `extra.eas.projectId` present (or `eas init` completed)

## Guidelines

### eas.json structure

Three build profiles and named submit profiles:

| Profile | `distribution` | Typical purpose |
| --- | --- | --- |
| `development` | `internal` | Dev client; simulator (iOS) or APK (Android) |
| `preview` | `internal` | Team QA via EAS install link (Ad Hoc iOS, APK Android) — not TestFlight/Play |
| `production` | `store` | Store-signed binary for TestFlight / Play submit |

```json
{
  "cli": {
    "version": ">= 16.0.0",
    "appVersionSource": "remote"
  },
  "build": {
    "base": {
      "node": "20.x.x",
      "pnpm": "10.x.x"
    },
    "development": {
      "extends": "base",
      "developmentClient": true,
      "distribution": "internal",
      "environment": "development",
      "ios": { "simulator": true },
      "android": { "buildType": "apk" }
    },
    "preview": {
      "extends": "base",
      "distribution": "internal",
      "environment": "preview",
      "android": { "buildType": "apk" }
    },
    "production": {
      "extends": "base",
      "distribution": "store",
      "environment": "production",
      "autoIncrement": true
    }
  },
  "submit": {
    "internal": {
      "android": { "track": "internal" }
    },
    "closed": {
      "android": { "track": "alpha" }
    },
    "production": {
      "android": { "track": "production" }
    }
  }
}
```

Adapt names, env vars, and extends to the project.

| Setting | Purpose |
| --- | --- |
| `cli.appVersionSource: "remote"` | EAS stores build numbers |
| `autoIncrement: true` on `production` | Increments iOS build number / Android version code per build |
| `build.<profile>.environment` | Maps profile to Expo dashboard environment variables |
| `developmentClient: true` | Required for dev client profile |
| `distribution: "store"` | Required for App Store / Play store submission |
| `ios.simulator: true` | Development builds for iOS Simulator only (no signing) |

Submit profile names are project-defined. Android `track` maps to Play Console testing tracks. iOS has no track in `eas.json` — `eas submit` uploads to App Store Connect; TestFlight vs App Store release is managed there.

| Submit profile | Android track | iOS destination |
| --- | --- | --- |
| `internal` | `internal` | App Store Connect (TestFlight) |
| `closed` | `alpha` (closed testing) | App Store Connect (TestFlight) |
| `production` | `production` | App Store review |

### EAS environments and secrets

Each build profile's `environment` field selects which variables EAS injects at build time.

1. Open [expo.dev](https://expo.dev) → project → **Environment variables**.
2. Create variables per environment (`development`, `preview`, `production`).
3. Use `EXPO_PUBLIC_*` prefix for values embedded in the client bundle.

Document a matrix for the user:

| Variable | development | preview | production | Notes |
| --- | --- | --- | --- | --- |
| `EXPO_PUBLIC_*` | … | … | … | List each var the app reads |

- Never commit API keys, anon keys, or service account JSON.
- `preview` and `production` often share the same backend URL in single-environment setups — confirm with the user.
- Feature flags (e.g. `EXPO_PUBLIC_FEATURE_*`) belong in the same environments as the builds that need them.

```bash
eas env:list --environment production
```

### package.json scripts (optional)

```json
{
  "scripts": {
    "eas:build:preview": "eas build --profile preview --platform all",
    "eas:build:production": "eas build --profile production --platform all",
    "eas:submit:internal": "eas submit --profile internal --platform all",
    "eas:submit:production": "eas submit --profile production --platform all"
  }
}
```

Run from the app package or via `pnpm --filter <package> <script>` in a monorepo.

### Recommended release order

```text
1. eas build --profile preview     → internal QA (EAS install link)
2. eas build --profile production  → store-signed binary
3. eas submit --profile internal   → TestFlight + Play internal
4. eas submit --profile production → App Store + Play production (when ready)
```

Command details: **`expo-deployment`**.

### Version management

With `appVersionSource: "remote"`:

```bash
eas build:version:get
eas build:version:set -p ios --build-number <n>   # rarely needed when autoIncrement is on
```

### Common misconfigurations

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `Invalid UUID appId` on build | Missing `extra.eas.projectId` | `eas init` from app package |
| Build succeeds but app can't reach API | Missing/wrong EAS env vars for profile | Set vars for matching `environment` |
| Wrong bundle ID in artifact | `app.json` not updated | `npx expo config --type public`; fix `bundleIdentifier` / `package` |
| Submit fails with missing credentials | Store credentials not in EAS | `eas credentials` — see `expo-deployment` |
| Android submit `PERMISSION_DENIED` | Play Android Developer API disabled | Enable `androidpublisher` API — see `expo-deployment` |

## Related

- [discovering-application.md](./discovering-application.md)
- [reviewing-release-readiness.md](./reviewing-release-readiness.md)

## References

- [EAS Build](https://docs.expo.dev/build/introduction/)
- [Configure EAS Build with eas.json](https://docs.expo.dev/build/eas-json/)
- [Environment variables in EAS](https://docs.expo.dev/eas/environment-variables/)
- [App version management](https://docs.expo.dev/build-reference/app-versions/)
