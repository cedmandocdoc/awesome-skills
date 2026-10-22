# Configuring EAS

## Overview

`eas.json` build and submit profiles, the app's public runtime values, and the App Store metadata file, so that every build, submission, and metadata push runs non-interactively.

## Prerequisites

App package, platforms, store IDs, and runtime variables per [discovering-application.md](./discovering-application.md).

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
      "ios": { "simulator": true },
      "android": { "buildType": "apk" }
    },
    "preview": {
      "extends": "production",
      "distribution": "internal",
      "autoIncrement": false,
      "android": { "buildType": "apk" }
    },
    "production": {
      "extends": "base",
      "distribution": "store",
      "autoIncrement": true,
      "env": {
        "EXPO_PUBLIC_API_URL": "https://api.example.com"
      }
    }
  },
  "submit": {
    "base": {
      "ios": { "ascAppId": "<apple-id-number>", "appleTeamId": "<team-id>" }
    },
    "internal": { "extends": "base", "android": { "track": "internal" } },
    "production": { "extends": "base" }
  }
}
```

`node` and `pnpm` follow `.nvmrc` and `packageManager`. Drop the platform the app lacks.

| Setting | Effect |
| --- | --- |
| `appVersionSource: "remote"` with `autoIncrement` | EAS stores and bumps the build number per production build |
| `build.<profile>.env` | Public runtime values baked into that profile's build; never a secret. The workflow job's environment does not reach the cloud build |
| `submit.*.ios.ascAppId` | Skips the App Store Connect lookup; required non-interactively. Unknown until the record exists → leave it out; **Provision** writes it |
| `submit.base.ios.appleTeamId` | The Team ID the workflow's metadata step passes as `EXPO_APPLE_TEAM_ID`. `eas metadata:push` reads the team from the EAS-stored key, which is unset when the key was uploaded as a `.p8`, and never from the submit profile |
| `android.track` | Play testing track a build is submitted to. Production is promoted from it in Play Console, as the App Store release is chosen in App Store Connect |

Submit profiles name no key file: submissions and metadata pushes use the keys stored on EAS.

### Runtime values

1. **Names.** Each `EXPO_PUBLIC_*` the app reads, per build profile.
2. **Values.** From the repo (another package's committed config), else the user.
3. **Write.** Into each profile's `env`; `preview` extends `production` and overrides only what differs.

### App Store metadata

`store.config.json` at the app package root (`metadataPath` in the submit profile moves it). First time: `eas metadata:pull --non-interactive` seeds it from the App Store Connect record; then edit it. The deploy workflow pushes it when it changes. Apple only: Google Play has no metadata support, and screenshots are not uploaded on either store — `store/apple/` and `store/android/` hold them for the user.

## References

- [Configure EAS Build with eas.json](https://docs.expo.dev/eas/json/)
- [Environment variables in EAS](https://docs.expo.dev/eas/environment-variables/)
- [EAS Metadata](https://docs.expo.dev/eas/metadata/)
