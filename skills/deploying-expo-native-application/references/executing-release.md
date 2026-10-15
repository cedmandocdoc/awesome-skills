# Executing Release

## Overview

**Execution mode.** Builds, submits, promotes, or pushes the store listing on request, without a push.

## Prerequisites

Submit profiles and store IDs per [configuring-eas.md](./configuring-eas.md). Commands per [deployment-contract.md](./deployment-contract.md) → **Running EAS commands**.

## Guidelines

### 1. Run

| Action | Command |
| --- | --- |
| Run the workflow | `gh workflow run deploy-<app>.yml --ref <production-branch>` |
| Build now | `eas build --platform <platform> --profile production --non-interactive --no-wait`; add `--auto-submit-with-profile internal` to submit when it finishes |
| Preview build for QA | `eas build --platform <platform> --profile preview --non-interactive --no-wait`; the install link is on the build page |
| Submit the latest build | `eas submit --platform <platform> --profile internal --latest --non-interactive` |
| Promote to Play production | `eas submit --platform android --profile production --latest --non-interactive` (`--id <build-id>` for an older build) |
| Push the App Store listing | `eas metadata:push --profile production --non-interactive`, once the build shows as processed in TestFlight |
| Status | `eas build:list --limit 5 --json --non-interactive`; a build's page lists its submissions |

A build takes 10–30 minutes and a submission a few more; check status instead of waiting in the session.

### 2. Update the doc

Set the `release` rows in `DEPLOYMENT.md` per [deployment-contract.md](./deployment-contract.md) → **Deployment doc**.

### 3. Confirm to the user

- The build or submission started, with its version and ID
- Where it lands: TestFlight, the Play track, or the App Store listing
- The `user` rows still `todo` for this release, with the Done when of each
