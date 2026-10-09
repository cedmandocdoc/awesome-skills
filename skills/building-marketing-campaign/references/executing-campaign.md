# Executing Campaign

## Overview

**Execution mode.** Phase 5, Execution: shows the next batch, marks what the user approves, records the sends and replies the user reports, drafts due follow-ups, and ends or drops the campaign.

## Prerequisites

Per [marketing-contract.md](./marketing-contract.md) → **States**, **Outbox items**, **Sending caps**. The **Setup** row in `SKILL.md` (measurement) is done before the first send.

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

First draft due follow-ups: a touch whose `send_if: no reply` holds and whose spacing has passed. Then list the batch: the next `draft` items, within the day's cap for email, and posts due in the coming week. Show each item's code, recipient or platform, first line, link, and for a video post its `media` path.

### 3. Approve the batch

Set the named items to `approved`. Hand each to the user ready to send: email from `mail.<domain>`; posts with their caption, `media`, and `scheduled` time; ads with creative and targeting for the ads manager.

### 4. Record outcomes

| Said | Edit |
| --- | --- |
| Sent | `status: sent`, `sent_at`; the first sent item sets `state: live` and `start` |
| Replied | `status: replied`, reply summary in the item; drop its pending touches to `skipped` |
| Opted out | As replied, note `opted out`; never contact again |
| Skip | `status: skipped` |

### 5. End

At `end`, at `end_condition`, or on request: `state: ended`, `end` = today; remaining drafts and approved items → `skipped`. D1 keeps recording.

### 6. Drop

Only before `live`: `state: dropped` and a one-line reason under **Execution**.

### 7. Confirm to the user

Write **Execution**: counts per status, the next due date. Update the `index.md` row. Reply with what was approved or recorded (codes and counts), replies so far, and the next batch date.
