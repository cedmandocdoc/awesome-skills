# Measuring Campaign

## Overview

**Execution mode.** Phase 6, Measurement: an interactive check-in on a `live` or `ended` campaign. The agent asks what went out and what came back, reports landings and conversions against `goal`, and recommends one next step. Writes outbox statuses and one check-in line; changes no state.

## Prerequisites

Per [marketing-contract.md](./marketing-contract.md) → **Outbox items**, **Measurement**. Query: `<marketing-root>/measurement/report.sql` (from [`../assets/measurement/report.sql`](../assets/measurement/report.sql)).

## Guidelines

### 1. Catch up the outbox

List `approved` items not yet `sent` and ask in one message which went out and on what date, and which got replies or opt-outs. Record the answers per [executing-campaign.md](./executing-campaign.md) → step 4.

### 2. Ask for signals off the links

Ask once about replies, comments, calls, or mentions that never reached the app. Note each in the check-in line.

### 3. Run the report

```bash
cd <marketing-root>/measurement
sed -e 's/{{CAMPAIGN}}/<id>/g' -e 's/{{EVENT}}/<conversion>/g' -e 's/{{UNTIL}}/<now ISO>/g' report.sql > /tmp/report.sql
npx wrangler d1 execute marketing --remote --file /tmp/report.sql
```

Count the outbox per `utm_content` of direct items: sent, replied, opted out.

### 4. Report and recommend

| Show | From |
| --- | --- |
| Landings, conversions, landing → conversion rate per `utm_content`, medium, source | Report rows |
| Sent, replied, reply rate | Outbox |
| Total conversions against `goal` | Report |
| Day N of the campaign, days left | `start`, `end` |
| Where people stop | Per [marketing-contract.md](./marketing-contract.md) → **Measurement** |

Then one recommendation for the user to pick: keep going, send the next batch ([executing-campaign.md](./executing-campaign.md)), change unsent items ([updating-campaign.md](./updating-campaign.md)), end now, or conclude ([concluding-campaign.md](./concluding-campaign.md)).

### 5. Confirm to the user

Add one line under **Execution** → **Check-ins**: date, day N, conversions against `goal`, the signals from step 2, and the recommendation. Reply with the report and the recommendation.
