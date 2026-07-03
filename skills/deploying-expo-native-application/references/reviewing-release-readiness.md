# Reviewing Release Readiness

## Overview

**Review mode.** Walk through this checklist before the first `preview` or `production` EAS build. Items in the configuration group are in scope for this skill; handoff items defer to **`expo-deployment`** or project-specific docs.

## Prerequisites

- [discovering-application.md](./discovering-application.md) — app package and `app.json` validated
- [configuring-eas.md](./configuring-eas.md) — `eas.json` profiles and EAS environments configured

## Guidelines

### Configuration (this skill)

```
- [ ] App package identified; commands documented for monorepo if applicable
- [ ] app.json: bundle ID (iOS) and package name (Android) confirmed with user
- [ ] extra.eas.projectId present (eas init completed)
- [ ] eas.json: development, preview, and production build profiles defined
- [ ] eas.json: submit profiles defined (if store release planned)
- [ ] EAS environment variables set for each build profile environment
- [ ] npx expo config --type public output reviewed
- [ ] No secrets or credential files committed to git
- [ ] package.json eas:* scripts added (optional but recommended)
```

### Credentials and accounts (handoff → expo-deployment)

```
- [ ] Expo account with access to the project organization
- [ ] EAS CLI installed; eas login completed
- [ ] Apple Developer Program membership (for iOS store builds)
- [ ] App Store Connect app record created (bundle ID matches app.json)
- [ ] Google Play Console app created (package name matches app.json)
- [ ] eas credentials configured for iOS distribution and Android keystore
- [ ] Google Play service account JSON stored in EAS (for automated submit)
```

### Store prerequisites (handoff → expo-deployment + project docs)

```
- [ ] Privacy policy URL hosted and reachable
- [ ] Store listing copy, screenshots, and review notes prepared
- [ ] Demo account for App Review documented (if login required)
- [ ] Content rating questionnaire completed in each console
```

### QA before submit (project-specific)

```
- [ ] preview build installed and smoke-tested on physical devices
- [ ] Auth and core flows work against the intended backend environment
- [ ] production build created after preview QA passes
- [ ] TestFlight / Play internal testers added before wider release
```

Use the project's manual smoke checklist and task docs when they exist. This skill does not define product acceptance criteria.

### After configuration is green

| Next step | Where to go |
| --- | --- |
| `eas build` / `eas submit` | **`expo-deployment`** skill |
| Automated builds on tag/merge | **`expo-cicd-workflows`** skill (`npx skills add expo/skills --skill expo-cicd-workflows`) |
| Dev client builds | **`expo-dev-client`** skill (`npx skills add expo/skills --skill expo-dev-client`) |

## Related

- [discovering-application.md](./discovering-application.md)
- [configuring-eas.md](./configuring-eas.md)
