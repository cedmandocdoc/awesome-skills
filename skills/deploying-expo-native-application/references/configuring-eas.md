# Configuring EAS

## Overview

Configure `eas.json` and EAS environments for cloud builds. Build and submit commands: external **`eas-app-stores`** skill.

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
| `build.<profile>.environment` | Maps profile to an EAS environment's variables |
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

1. **Names.** Each variable the app reads, per environment (`development`, `preview`, `production`). `EXPO_PUBLIC_*` for values embedded in the client bundle.
2. **Values.** A value another platform owns comes from its GitHub variable: `gh variable get SUPABASE_URL` for `EXPO_PUBLIC_SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` for the Supabase key. Missing → that platform's skill sets it (deploying-supabase-application → **Provision**), or the user gives the value. Other values come from the user.
3. **Plan.** `eas env:list --environment <environment>` per environment; show one matrix of new / changed / unchanged and apply after the user confirms:

   | Variable | development | preview | production | Source |
   | --- | --- | --- | --- | --- |
   | `EXPO_PUBLIC_*` | … | … | … | GitHub variable or user |

4. **Apply.**

   ```bash
   eas env:create --environment production --name EXPO_PUBLIC_SUPABASE_URL \
     --value "$(gh variable get SUPABASE_URL)" --visibility plaintext --non-interactive   # --force when changed
   ```

- Never commit API keys, anon keys, or service account JSON.
- `preview` and `production` often share the same backend URL in single-environment setups — confirm with the user.
- Feature flags (e.g. `EXPO_PUBLIC_FEATURE_*`) belong in the same environments as the builds that need them.

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

Command details: **`eas-app-stores`**.

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
| Submit fails with missing credentials | Store credentials not in EAS | `eas credentials` — see `eas-app-stores` |
| Android submit `PERMISSION_DENIED` | Play Android Developer API disabled | Enable `androidpublisher` API — see `eas-app-stores` |

## Related

- [discovering-application.md](./discovering-application.md)
- [reviewing-release-readiness.md](./reviewing-release-readiness.md)

## References

- [EAS Build](https://docs.expo.dev/build/introduction/)
- [Configure EAS Build with eas.json](https://docs.expo.dev/build/eas-json/)
- [Environment variables in EAS](https://docs.expo.dev/eas/environment-variables/)
- [App version management](https://docs.expo.dev/build-reference/app-versions/)
