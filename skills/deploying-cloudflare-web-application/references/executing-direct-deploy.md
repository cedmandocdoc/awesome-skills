# Executing Direct Deploy

## Overview

**Execution mode.** Runs, re-runs, or rolls back a deploy without a new push, always through the deploy workflow.

## Guidelines

### 1. Run

| Action | Command |
| --- | --- |
| Run the workflow | `gh workflow run deploy-<worker>.yml --ref <production-branch>` |
| Roll back | `gh run list --workflow deploy-<worker>.yml`, then `gh run rerun <run-id>` on the last good run: it redeploys that commit. A lasting fix is a revert merged to the production branch. D1 migrations do not roll back |
| Which version is live | `npx wrangler deployments list --name <worker>` |

### 2. Confirm to the user

The run started and its URL; after it finishes, the version now live and its URL check.
