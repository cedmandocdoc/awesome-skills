# Discovering Application

## Overview

**Read-only.** Verify the repository has a deployable Expo native app before configuring EAS or running the first cloud build.

## Guidelines

### Required layout

Minimum structure at the Expo app package root:

```
<app-package>/
├── app.json              # or app.config.js / app.config.ts
├── eas.json
├── package.json
├── index.ts | App.tsx    # entry
└── assets/               # icon, splash, etc.
```

`eas.json` may be missing on a greenfield app — create it with `eas init` or by following [configuring-eas.md](./configuring-eas.md).

### 1. Discover the app package

#### Single-package repo

One `package.json` with `expo` in dependencies and an `app.json` at the same level → that package is the native app.

#### Monorepo

Check workspace manifests:

| File | What to read |
| --- | --- |
| `pnpm-workspace.yaml` | Package globs (`apps/*`, `packages/*`) |
| `package.json` `workspaces` | npm/yarn workspace paths |
| `turbo.json` / `nx.json` | Named apps |

For each candidate package:

1. `dependencies.expo` or `devDependencies.expo`
2. `app.json` or `app.config.*` beside `package.json`
3. Optional `eas.json` and `eas:*` scripts in `package.json`

**If more than one package is an Expo app**, list them and ask the user which one to prepare for release.

#### Existing EAS linkage

In app config, confirm:

```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "<uuid>"
      }
    }
  }
}
```

If `projectId` is missing, from the app package:

```bash
eas login
eas init
```

Accept creating or linking an Expo project. This writes `projectId` into app config.

### 2. Validate app.json

Before first EAS build:

| Field | Why it matters |
| --- | --- |
| `expo.name`, `expo.slug` | Display name and Expo project slug |
| `expo.version` | User-facing version (CFBundleShortVersionString / versionName) |
| `expo.ios.bundleIdentifier` | Must match App Store Connect app record |
| `expo.android.package` | Must match Play Console package name |
| `expo.icon`, `expo.splash` | Required assets for store builds |
| `expo.plugins` | Native modules (e.g. `expo-build-properties` for min OS) |
| `expo.extra.eas.projectId` | Links local project to EAS |

Validate public config:

```bash
cd <app-package>
npx expo config --type public
```

Confirm `ios.bundleIdentifier` and `android.package` match what the user intends for store records. Changing bundle ID after store apps are created requires new store listings and regenerated credentials.

### 3. Monorepo conventions

| Concern | Pattern |
| --- | --- |
| **Commands run from** | App package directory (`cd apps/mobile`) or `pnpm --filter <name> <script>` from repo root |
| **EAS CLI context** | `eas.json` and `app.json` must live in the same package EAS builds |
| **Node / pnpm versions** | Optional `build.base` in `eas.json` pins toolchain for cloud builds |
| **Lockfile** | Install at monorepo root; EAS Build respects workspace layout when configured |

### 4. Local smoke (optional)

Before cloud build:

```bash
cd <app-package>
npx expo start
```

On simulators/emulators, confirm the app boots with the intended env vars.

## Examples

### Discovery checklist

```
- [ ] App package path identified (monorepo or single-package)
- [ ] app.json / app.config present with bundle ID and package name confirmed
- [ ] extra.eas.projectId present (or eas init planned)
- [ ] eas.json present or planned with build profiles
- [ ] Required EXPO_PUBLIC_* (or project-specific) vars listed per EAS environment
- [ ] User confirmed Apple Developer and Play Console access for store builds
```

## Related

- [configuring-eas.md](./configuring-eas.md)
- [reviewing-release-readiness.md](./reviewing-release-readiness.md)
