# Configuring EAS

## Overview

`eas.json` build and submit profiles, EAS environment variables, and the App Store metadata file, so that every build, submission, and metadata push runs non-interactively.

## Prerequisites

App package, platforms, store IDs, and runtime variables per [discovering-application.md](./discovering-application.md). Key files per [deployment-contract.md](./deployment-contract.md) → **Files**.

## Guidelines

### Profiles

| Build profile | `distribution` | Purpose |
| --- | --- | --- |
| `development` | `internal` | Dev client; iOS simulator, Android APK |
| `preview` | `internal` | QA through the EAS install link; Ad Hoc iOS, APK Android |
| `production` | `store` | Store-signed binary for TestFlight and Play |

```json
{
  "cli": { "version": ">= 24.0.0", "appVersionSource": "remote" },
  "build": {
    "base": { "node": "22.x.x", "pnpm": "10.x.x" },
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
    "base": {
      "ios": {
        "ascAppId": "<apple-id-number>",
        "appleTeamId": "<team-id>",
        "ascApiKeyPath": "./credentials/asc-api-key.p8",
        "ascApiKeyId": "$EXPO_ASC_KEY_ID",
        "ascApiKeyIssuerId": "$EXPO_ASC_ISSUER_ID"
      },
      "android": { "serviceAccountKeyPath": "./credentials/google-service-account.json" }
    },
    "internal": { "extends": "base", "android": { "track": "internal" } },
    "production": { "extends": "base", "android": { "track": "production" } }
  }
}
```

`node` and `pnpm` follow `.nvmrc` and `packageManager`. Drop the platform the app lacks.

| Setting | Effect |
| --- | --- |
| `appVersionSource: "remote"` with `autoIncrement` | EAS stores and bumps the build number per production build |
| `build.<profile>.environment` | The EAS environment whose variables the build receives |
| `submit.*.ios.ascAppId` | Skips the App Store Connect lookup; required non-interactively. Unknown until the record exists → leave it out; **Provision** writes it |
| `submit.*.ios.appleTeamId` | Removes the Team ID prompt from `eas metadata:push` |
| `ascApiKey*`, `serviceAccountKeyPath` | Submit with the key files; `$NAME` reads the shell environment |
| `android.track` | Play testing track. iOS has no track: TestFlight and App Store release are chosen in App Store Connect |

### EAS environments

Each build profile's `environment` selects the variables EAS injects at build time.

1. **Names.** Each `EXPO_PUBLIC_*` the app reads, per environment (`development`, `preview`, `production`).
2. **Values.** A value another platform owns comes from its GitHub variable: `gh variable get SUPABASE_URL` for `EXPO_PUBLIC_SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` for the key. Missing → that platform's skill sets it (deploying-supabase-application → **Provision**), or the user gives the value. App-only values come from the user.
3. **Plan.** `eas env:list --environment <environment>` per environment; one matrix of new / changed / unchanged, applied after the user confirms:

   | Variable | development | preview | production | Source |
   | --- | --- | --- | --- | --- |
   | `EXPO_PUBLIC_*` | … | … | … | GitHub variable or user |

4. **Apply.** Per environment:

   ```bash
   eas env:set --environment production --name EXPO_PUBLIC_SUPABASE_URL \
     --value "$(gh variable get SUPABASE_URL)" --visibility plaintext --non-interactive
   ```

`preview` and `production` often share one backend in single-environment setups; confirm with the user.

### App Store metadata

`store.config.json` at the app package root (`metadataPath` in the submit profile moves it). First time: `eas metadata:pull --non-interactive` seeds it from the App Store Connect record; then edit it. `eas metadata:push --non-interactive` syncs it once a build is processed in App Store Connect. Apple only: Google Play has no metadata support, and screenshots are not uploaded on either store — `store/apple/` and `store/android/` hold them for the user.

## References

- [Configure EAS Build with eas.json](https://docs.expo.dev/eas/json/)
- [Environment variables in EAS](https://docs.expo.dev/eas/environment-variables/)
- [EAS Metadata](https://docs.expo.dev/eas/metadata/)
