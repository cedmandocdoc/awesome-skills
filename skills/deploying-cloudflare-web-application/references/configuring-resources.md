# Configuring Resources

## Overview

**Execution mode.** Brings the Cloudflare account and the GitHub repository to the state the wrangler config and the deploy workflow declare — D1/KV/R2 resources, the Worker, its runtime secrets, custom domains, and the GitHub values the workflow reads — with Wrangler and the GitHub CLI. Each run reads remote state, shows a plan, and applies after the user confirms.

## Prerequisites

Discovery per [discovering-application.md](./discovering-application.md); wrangler config per [configuring-wrangler.md](./configuring-wrangler.md); workflow per [configuring-github-actions.md](./configuring-github-actions.md). Run `npx wrangler` from the Wrangler root.

## Guidelines

### 1. Discover

| Item | Source |
| --- | --- |
| Worker name, `account_id`, bindings, `routes` | Wrangler config |
| Resources to create | A D1, KV, or R2 binding without a real id or an existing bucket |
| Runtime secret names | `env.<NAME>` read in Worker code and absent from `vars` |
| GitHub values | [configuring-github-actions.md](./configuring-github-actions.md) → **GitHub values** |

Write missing secret names with blank values into `<wrangler-root>/worker.secrets.env`, tell the user where each value comes from, and continue once `grep -c '=$' <file>` returns `0`.

### 2. Read remote state

| Item | Check |
| --- | --- |
| Worker | `npx wrangler deployments list --name <worker>` succeeds |
| D1, KV, R2 | `npx wrangler d1 list --json`, `npx wrangler kv namespace list`, `npx wrangler r2 bucket list` |
| Runtime secrets | `npx wrangler secret list --name <worker>` (names only) |
| GitHub values | `gh variable list`, `gh secret list` (names only) |

### 3. Plan and confirm

Show one table: item, remote now, after. Apply after the user confirms.

### 4. Apply

In this order; skip what already matches.

1. **Resources.** `npx wrangler d1 create <name>`, `npx wrangler kv namespace create <binding>`, `npx wrangler r2 bucket create <name>`. Write each returned id into the binding in the wrangler config.
2. **Worker.** None exists → run the project's production build from a clean output directory, then `npx wrangler deploy`. Custom domains in `routes` attach on deploy.
3. **Runtime secrets.** `npx wrangler secret bulk worker.secrets.env --name <worker>`.
4. **GitHub values.** `gh variable set` each variable per [configuring-github-actions.md](./configuring-github-actions.md) → **GitHub values**; `gh secret set -f <wrangler-root>/deploy.secrets.env`.

### 5. Verify

Re-run step 2: every planned item matches. `curl -sI` each URL answers `200`; a client-routed deep link serves the app (SPA).

### 6. Confirm to the user

- Applied changes, per the plan table
- Wrangler config changes to commit (`account_id`, resource ids)
- The GitHub values now set, by name; the deploy workflow can run on the next push
- URLs live, and each check's result

## Related

- [configuring-wrangler.md](./configuring-wrangler.md)
- [executing-direct-deploy.md](./executing-direct-deploy.md)
- [troubleshooting-deployment.md](./troubleshooting-deployment.md)

## References

- [Wrangler commands](https://developers.cloudflare.com/workers/wrangler/commands/)
