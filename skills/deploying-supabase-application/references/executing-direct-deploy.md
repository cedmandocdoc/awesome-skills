# Executing Direct Deploy

## Overview

**Execution mode.** Runs or re-runs the deploy without a new push, always through the deploy workflow on the production branch.

## Guidelines

### 1. Run

| Action | Command |
| --- | --- |
| Run the workflow | `gh workflow run deploy-supabase.yml --ref <production-branch>` |
| Re-run a run | `gh run rerun <run-id>`, after setting a missing secret or fixing a token |

### 2. Confirm to the user

The run started and its URL; after it finishes, `supabase functions list --project-ref <ref>` and `supabase migration list --linked`.
