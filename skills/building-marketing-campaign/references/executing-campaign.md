# Executing Campaign

## Overview

**Execution mode.** Phase 5, Execution: shows the next batch, marks what the user approves, pushes the opted-in items and hands the rest to the user, records sends and replies, drafts due follow-ups, and ends or drops the campaign.

## Prerequisites

Per [marketing-contract.md](./marketing-contract.md) → **States**, **Outbox items**, **Sending caps**. Sender commands: [configuring-sending.md](./configuring-sending.md) → step 3.

## Guidelines

### 1. Route the request

| Request | Step |
| --- | --- |
| "continue", "next batch" | 2 |
| "approve batch", "approve o001–o030" | 3 |
| "sent o014", "o014 replied", "o022 opted out", "skip o009" | 4 |
| "end campaign" | 5 |
| "drop campaign" | 6 |

### 2. Show the next batch

When `<marketing-root>/sender/` exists, run `send.js sync` first and record each printed reply per step 4. Then draft due follow-ups: a touch whose `send_if: no reply` holds and whose spacing has passed. Then list the batch: the next `draft` items, within the day's cap for email, posts due in the coming week, and `approved` items with an `error`. Show each item's code, `send`, recipient or platform, first line, link, for a video post its `media` path, and its `error`.

### 3. Approve the batch

1. Add the opt-out line to any named email missing it. Set the named items to `approved` and each one's `send` per [marketing-contract.md](./marketing-contract.md) → **Outbox items**.
2. `send.js push` the `buffer` and `smtp` items.
3. Hand each `manual` item over as numbered steps: the app and account to open, the caption or body in a copy block, the `media` file to attach, the `scheduled` time, then _"sent oNNN"_. Ads: the creative and targeting for the ads manager.

### 4. Record outcomes

| Said | Edit |
| --- | --- |
| Sent, or a push or `sync` sets `sent` | `status: sent`, `sent_at` (a push or `sync` writes both); the first sent item sets `state: live` and `start` |
| A push or `sync` error | The item stays `approved` with `error`; the next batch shows it |
| Replied | `status: replied`, reply summary in the item; drop its pending touches to `skipped` |
| Opted out | As replied, note `opted out`; never contact again |
| Skip | `status: skipped` |

### 5. End

At `end`, at `end_condition`, or on request: `state: ended`, `end` = today; `send.js unqueue` the `queued` items, then they, the remaining drafts, and the approved items → `skipped`. D1 keeps recording.

### 6. Drop

Only before `live`: `state: dropped` and a one-line reason under **Execution**.

### 7. Confirm to the user

Write **Execution**: counts per status, the next due date. Update the `index.md` row. Reply with what was approved or recorded (codes and counts): sent, queued in Buffer with their times, failed with each `error`, and the manual steps; replies so far; and the next batch date.
