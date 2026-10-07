# Measuring Campaign

## Overview

**Read-only.** Reports clicks, visits, and conversions per asset and outbox item, plus reply counts, for a `live` or `ended` campaign. Changes no files and no state.

## Prerequisites

Per [marketing-contract.md](./marketing-contract.md) → **Links and UTMs**, **Outbox items**. Query: `<marketing-root>/measurement/report.sql` (from [`../assets/measurement/report.sql`](../assets/measurement/report.sql)).

## Guidelines

### 1. Run the report

```bash
cd <marketing-root>/measurement
sed -e 's/{{CAMPAIGN}}/<id>/g' -e 's/{{EVENT}}/<conversion>/g' -e 's/{{UNTIL}}/<now ISO>/g' report.sql > /tmp/report.sql
npx wrangler d1 execute marketing --remote --file /tmp/report.sql
```

### 2. Count the outbox

Per `utm_content` of direct items: sent, replied, opted out. Reply rate = replied ÷ sent.

### 3. Report to the user

| Column | From |
| --- | --- |
| `utm_content`, medium, source | Report rows |
| Clicks, visits, conversions | Report rows |
| Visit → conversion rate | conversions ÷ visits |
| Sent, replied | Outbox |

Then: total conversions against `goal`, the strongest and weakest rows, and days left to `end`.
