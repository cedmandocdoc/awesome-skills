# Executing Release

## Overview

**Execution mode.** Builds, promotes, or pushes the store listing on request, through a manual run of the deploy workflow.

## Prerequisites

Workflow per [configuring-github-actions.md](./configuring-github-actions.md) → **Workflow file**.

## Guidelines

### 1. Run

`gh workflow run deploy-<app>.yml --ref <production-branch> -f action=<action>`:

| Action | Does |
| --- | --- |
| `build` | Production build, auto-submitted to TestFlight and the Play `internal` track |
| `preview` | Preview build for QA; the install link is on the build page |
| `promote-android` | Submits the latest Android build to the Play `production` track |
| `metadata` | Pushes the App Store listing from `store.config.json` |

Status: `gh run list --workflow deploy-<app>.yml`, then `eas build:list --limit 5 --json --non-interactive`; a build's page lists its submissions. A build takes 10–30 minutes and a submission a few more; check status instead of waiting in the session.

### 2. Confirm to the user

- The run started, and the build or submission with its version and ID once queued
- Where it lands: TestFlight, the Play track, or the App Store listing
- The `DEPLOYMENT.md` → **Each release** steps left for that platform
