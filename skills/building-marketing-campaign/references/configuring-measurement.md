# Configuring Measurement

## Overview

**Execution mode.** One-time per product: deploys the measurement Worker and D1 database on the user's Cloudflare account, whatever hosts the app, adds the snippet to the app, and adds a `conversion()` call per named event.

## Prerequisites

Per [marketing-contract.md](./marketing-contract.md) → **Resolve marketing root**, **Measurement**. A Cloudflare account; `npx wrangler login` done.

## Guidelines

### 1. Copy the Worker project

Copy [`../assets/measurement/`](../assets/measurement/) to `<marketing-root>/measurement/`. In `wrangler.toml`, set `ALLOWED_ORIGINS` to the app's origins. When the domain's DNS is on Cloudflare, uncomment `routes` with a neutral subdomain (`m.<domain>`), which ad blockers rarely list; else the snippet uses the `workers.dev` URL.

### 2. Create the database and deploy

```bash
cd <marketing-root>/measurement
npx wrangler d1 create marketing        # paste database_id into wrangler.toml
npx wrangler d1 execute marketing --remote --file schema.sql
npx wrangler deploy
```

### 3. Add the snippet to the app

Once per product; the user reviews the diff.

1. Copy [`../assets/measurement/snippet.js`](../assets/measurement/snippet.js) into the app's client code; set `MK_ENDPOINT` to the Worker URL and, when the landing site and the app are on different subdomains, `MK_DOMAIN`.
2. Call `mkCapture()` on every page load, before routing strips the query string.
3. Consent: when the app has a consent banner, call `mkCapture()` and `conversion()` only after the visitor accepts its analytics or marketing category. No banner and EU or UK visitors → tell the user a banner is needed; the call is theirs.

### 4. Fire the conversion

Per named event, call `conversion('<event>')` after the app gets the success response (signup or payment confirmed), never on the button click. Adding an event adds one call.

### 5. Verify

Open the app with `?utm_campaign=00-test&utm_medium=test&utm_source=test&utm_content=t1`, trigger the event, then:

```bash
npx wrangler d1 execute marketing --remote --command "SELECT event, COUNT(*) FROM events WHERE campaign = '00-test' GROUP BY event"
npx wrangler d1 execute marketing --remote --command "DELETE FROM events WHERE campaign = '00-test'"
```

### 6. Confirm to the user

Reply with the Worker URL, the database id, the app files changed, the verify counts, where `conversion()` fires for each event, any consent banner needed, and the fake-rows risk per [marketing-contract.md](./marketing-contract.md) → **Measurement**.

## References

- Wrangler D1 commands: https://developers.cloudflare.com/d1/wrangler-commands/
- Workers custom domains: https://developers.cloudflare.com/workers/configuration/routing/custom-domains/
