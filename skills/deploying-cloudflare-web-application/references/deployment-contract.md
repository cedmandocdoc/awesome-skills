# Deployment Contract

## Overview

`DEPLOYMENT.md`, the user's guide to the deploy steps that cannot be automated.

## Guidelines

### Deployment doc

`<wrangler-root>/DEPLOYMENT.md`, written when missing from [../assets/deployment.md](../assets/deployment.md) with the discovery values filled in and the rows that do not apply removed.

- A `DEPLOYMENT.md` there with another `generated_by` → stop and ask where to write it.
- **Manual setup** holds one secret row per needed name and one zone row per `custom_domain` host.
- Status is `todo`, `done <YYYY-MM-DD>`, or `n/a`. Each update re-checks every Done when that is a command and sets Status, running the CI token probe per [configuring-github-actions.md](./configuring-github-actions.md) → **Probe** only while its row is `todo`; a row also turns `done` when the user says so.
- The report lists the rows still `todo`, each with its How.
