# Executing Direct Deploy

## Overview

**Execution mode.** Deploys or rolls back a Worker without a push: through the workflow on demand, or with local Wrangler. Run from a clean checkout of the production branch.

## Guidelines

### 1. Run

| Action | Command |
| --- | --- |
| Run the workflow | `gh workflow run deploy-<worker>.yml --ref <production-branch>` |
| Deploy locally | The project's production build, then `npx wrangler deploy [--env <name>]` |
| Deploy to another account | `[env.<name>]` with its own `account_id` and routes; `npx wrangler deploy --env <name>`; build variables come from the shell or a gitignored env file the build reads |
| List deployments | `npx wrangler deployments list --name <worker>` |
| Roll back | `npx wrangler rollback [<version-id>] --name <worker>`; D1 migrations do not roll back |

### 2. Confirm to the user

The version now live (`npx wrangler deployments list --name <worker>`) and its URL check.
