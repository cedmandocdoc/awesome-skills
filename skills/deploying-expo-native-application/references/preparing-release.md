# Preparing Release

## Overview

**Execution mode.** Takes an Expo app to deployable configuration before the first `preview` or `production` build: project link, `eas.json` profiles, EAS environment variables, and a green release-readiness checklist.

## Guidelines

### 1. Discover

Per [discovering-application.md](./discovering-application.md): app package, monorepo working directory, bundle IDs, EAS project link, build profiles, and runtime env vars.

### 2. Validate configuration

From the app package:

```bash
npx expo config --type public
eas project:info
```

Confirm the `eas.json` build and submit profiles per [configuring-eas.md](./configuring-eas.md). Fix errors before the first cloud build.

### 3. Configure EAS environments and secrets

Per [configuring-eas.md](./configuring-eas.md) → **EAS environments and secrets**: set each `build.<profile>.environment`'s variables with the EAS CLI, store submit credentials in EAS (`eas credentials`), and document the variable matrix.

### 4. Write repository files

| File | Purpose |
| --- | --- |
| `app.json` / `app.config.*` | Bundle ID, version, icons, plugins, `extra.eas.projectId` |
| `eas.json` | Build and submit profiles |
| `package.json` scripts | Optional `eas:build:*` / `eas:submit:*` wrappers |

### 5. Release readiness

Walk [reviewing-release-readiness.md](./reviewing-release-readiness.md); resolve the in-scope blockers.

### 6. Confirm to the user

Reply with:

- Files written and the variable matrix
- Remaining blockers, including a missing Apple Developer or Google Play Console account for store builds
- When green: build and submit through **`eas-app-stores`**
