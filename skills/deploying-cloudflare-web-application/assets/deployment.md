---
doc_type: deployment
generated_by: deploying-cloudflare-web-application
---

# {{APP_NAME}} deployment

## Target

| Field | Value |
| --- | --- |
| Worker | `{{WORKER}}` on account `{{ACCOUNT_ID}}` |
| URL | {{URL}} |
| Production branch | `{{PRODUCTION_BRANCH}}` |
| Workflow | `.github/workflows/deploy-{{WORKER}}.yml` |

## Automatic

A push to `{{PRODUCTION_BRANCH}}` that touches the app checks the GitHub secrets, builds, creates a missing D1 database and applies its migrations, syncs the Worker secrets, and deploys `{{WORKER}}`.

## Manual setup

| Step | How | Done when | Status |
| --- | --- | --- | --- |
| `CLOUDFLARE_API_TOKEN` repository secret | Create a custom token at https://dash.cloudflare.com/profile/api-tokens with an expiry you track, reaching account `{{ACCOUNT_ID}}`, with {{TOKEN_PERMISSIONS}}. Set it at GitHub → Settings → Secrets and variables → Actions → **New repository secret**, or with `gh secret set CLOUDFLARE_API_TOKEN` in your own terminal | The CI token probe reports every permission granted | todo |
| `{{SECRET_NAME}}` repository secret | Value from {{SECRET_SOURCE}}; set it the same way | `gh secret list` shows `{{SECRET_NAME}}` | todo |
| Zone for `{{HOST}}` | Add `{{ZONE}}` to account `{{ACCOUNT_ID}}` at https://dash.cloudflare.com → **Add a domain**; delete any `A`, `AAAA`, or `CNAME` record on `{{HOST}}` | `https://{{HOST}}` serves the app after a deploy | todo |
