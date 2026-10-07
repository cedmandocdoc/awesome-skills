# Configuring Measurement

## Overview

**Execution mode.** One-time per product: deploys the measurement Worker and D1 database on the user's Cloudflare account, whatever hosts the app, and adds the snippet to the app. Also adds campaign links to D1.

## Prerequisites

Per [marketing-contract.md](./marketing-contract.md) → **Resolve marketing root**, **Links and UTMs**. A Cloudflare account; `npx wrangler login` done.

## Guidelines

### 1. Copy the Worker project

Copy [`../assets/measurement/`](../assets/measurement/) to `<marketing-root>/measurement/`. In `wrangler.toml`, set `ALLOWED_ORIGINS` to the app's origins; when the domain is on Cloudflare, uncomment `routes` with `go.<domain>`, else the links use the `workers.dev` URL.

### 2. Create the database and deploy

```bash
cd <marketing-root>/measurement
npx wrangler d1 create marketing        # paste database_id into wrangler.toml
npx wrangler d1 execute marketing --remote --file schema.sql
npx wrangler secret put SERVER_KEY      # a long random string; the app's backend sends it
npx wrangler deploy
```

### 3. Add the snippet to the app

Once per product; the user reviews the diff.

1. Copy [`../assets/measurement/snippet.js`](../assets/measurement/snippet.js) into the app's client code; set `MK_ENDPOINT` and, when landing site and app share a parent domain on different subdomains, `MK_DOMAIN`.
2. Call `mkCapture()` once on every page load, before routing strips the query string.
3. Call `conversion('<event>')` where the event is confirmed — after sign-up or payment succeeds, not on the button click. With a backend, call it server-side instead, since ad blockers drop browser calls: read the `mk` cookie from the request and POST its fields plus `event` to `<MK_ENDPOINT>/c` with `Authorization: Bearer <SERVER_KEY>`.
4. One call per named event; adding an event adds one call.

### 4. Verify

Add a test link per **Add links** (`campaign` = `00-test`), open it, land, trigger the event, then:

```bash
npx wrangler d1 execute marketing --remote --command "SELECT (SELECT COUNT(*) FROM clicks) c, (SELECT COUNT(*) FROM visits) v, (SELECT COUNT(*) FROM conversions) k"
```

Delete the `00-test` rows from all four tables.

### Add links

Per `links.md` row:

```bash
npx wrangler d1 execute marketing --remote --command "INSERT INTO links (id, campaign, medium, source, content, destination) VALUES ('03o014','03-clinics-mm','outbound','email','o014','https://example.com/signup')"
```

### 5. Confirm to the user

Reply with the Worker URL, the database id, the app files changed, the verify counts, and where `conversion()` fires for each event.

## References

- Wrangler D1 commands: https://developers.cloudflare.com/d1/wrangler-commands/
- Workers custom domains: https://developers.cloudflare.com/workers/configuration/routing/custom-domains/
