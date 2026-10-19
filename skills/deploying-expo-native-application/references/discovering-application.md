# Discovering Application

## Overview

**Read-only.** Resolve the Expo app package and the values every other recipe needs before changing files or remote state.

## Guidelines

### Discovery questions

| Question | How to resolve | If unclear |
| --- | --- | --- |
| App package | `app.json` or `app.config.*` beside a `package.json` with an `expo` dependency; several → list them | Ask user |
| Platforms | `ios.bundleIdentifier` and `android.package` in `npx expo config --type public` | Ask user |
| Bundle ID and package name | Same; the store records key on them, and changing one after release means new listings and credentials | Confirm with user before the first store build |
| Expo project | `extra.eas.projectId` in the app config; missing → **Provision** links it | — |
| Build and submit profiles | `eas.json`; missing or incomplete → [configuring-eas.md](./configuring-eas.md) | — |
| Runtime variables | `EXPO_PUBLIC_*` names read in source, and which platform owns each value (`SUPABASE_*` → the Supabase project) | Ask user |
| Store IDs | `ascAppId` and `appleTeamId` in the submit profiles, else `DEPLOYMENT.md` | The user, once the App Store Connect record exists |
| App scheme | `expo.scheme`; product TRD (`trd.md` with `doc_type: trd`) → **Infrastructure** origin | Ask user; Supabase Auth redirects need it |
| Expo account or organization | Product TRD → **Environments and deployment**, else `eas whoami` | Ask user |
| Watch paths | The app package, the lockfile, workspace packages it imports | — |

### Monorepo

| File | What to read |
| --- | --- |
| `pnpm-workspace.yaml`, `package.json` `workspaces` | Package globs |
| `turbo.json` / `nx.json` | Named apps |

`eas.json` and `app.json` live in the app package: `eas` commands run there (`cd apps/mobile`) and the workflow sets it as the working directory. Install runs at the repo root; EAS Build installs the workspace from the root lockfile.

### Validate the app config

```bash
cd <app-package>
npx expo config --type public
eas config --platform ios --profile production --non-interactive
```

| Field | Why |
| --- | --- |
| `expo.version` | User-facing version; build numbers come from EAS (`appVersionSource: remote`) |
| `expo.ios.bundleIdentifier`, `expo.android.package` | Must match the store records |
| `expo.icon`, `expo.splash` | Required for store builds |
| `expo.extra.eas.projectId` | Links the package to EAS |
