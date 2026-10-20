---
doc_type: deployment
generated_by: deploying-supabase-application
---

# {{APP_NAME}} deployment

## Target

| Field | Value |
| --- | --- |
| Project | `{{PROJECT_REF}}` at https://{{PROJECT_REF}}.supabase.co |
| Production branch | `{{PRODUCTION_BRANCH}}` |
| Workflow | `.github/workflows/deploy-supabase.yml` |

## Automatic

A push to `{{PRODUCTION_BRANCH}}` that touches `{{SUPABASE_ROOT}}` checks the GitHub secrets, rehearses the migrations on an empty database, then applies migrations, Auth and project config, Edge Function secrets, functions, and buckets to the project.

## Manual setup

| Step | How | Done when | Status |
| --- | --- | --- | --- |
| `SUPABASE_ACCESS_TOKEN` repository secret | Create a personal access token at https://supabase.com/dashboard/account/tokens with an expiry you track, reaching project `{{PROJECT_REF}}`, with {{TOKEN_PERMISSIONS}}. Set it at GitHub → Settings → Secrets and variables → Actions → **New repository secret**, or with `gh secret set SUPABASE_ACCESS_TOKEN` in your own terminal | The CI token probe reports every permission granted | todo |
| `{{SECRET_NAME}}` repository secret | Value from {{SECRET_SOURCE}}; set it the same way | `gh secret list` shows `{{SECRET_NAME}}` | todo |
