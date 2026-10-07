# Executing Campaign

## Overview

**Execution mode.** Phase 5, Execution: shows the next batch, sends or schedules what the user approves, records sends and replies, drafts due follow-ups, and ends or drops the campaign.

## Prerequisites

Per [marketing-contract.md](./marketing-contract.md) → **States**, **Outbox items**, **Sending caps**. The **Setup** row in `SKILL.md` (measurement) is done before the first send.

## Guidelines

### 1. Route the request

| Request | Step |
| --- | --- |
| "continue", "next batch" | 2 |
| "approve batch", "approve o001–o030", "send" | 3 |
| "sent o014", "o014 replied", "o022 opted out", "skip o009" | 4 |
| "end campaign" | 5 |
| "drop campaign" | 6 |

### 2. Show the next batch

First draft due follow-ups: a touch whose `send_if: no reply` holds and whose spacing has passed. Then list the batch: the next `draft` items, within the day's cap for email, and posts due in the coming week. Show each item's code, recipient or platform, first line, and link.

### 3. Send the approved batch

Set the named items to `approved`, then per channel:

| Channel | Action |
| --- | --- |
| Email | Resend: `curl -s -X POST https://api.resend.com/emails -H "Authorization: Bearer $RESEND_API_KEY" -H "Content-Type: application/json" -d '{"from":"<name> <<you>@mail.<domain>>","to":["<contact>"],"subject":"<subject>","text":"<body>"}'`; follow-ups reuse the first subject as `Re: <subject>` |
| Own social accounts | Buffer MCP: schedule each post at its `scheduled` time with its media from the asset's `out/` |
| DM, group post, ads | Hand the text to the user to send; status stays `approved` until they say "sent" |

On success: `status: sent`, `sent_at`, and the provider's message or post id. The first sent item sets `state: live` and `start`.

### 4. Record outcomes

| Said | Edit |
| --- | --- |
| Sent | `status: sent`, `sent_at` |
| Replied | `status: replied`, reply summary in the item; drop its pending touches to `skipped` |
| Opted out | As replied, note `opted out`; never contact again |
| Skip | `status: skipped` |

### 5. End

At `end`, at `end_condition`, or on request: `state: ended`, `end` = today; unschedule Buffer posts not yet published; remaining drafts → `skipped`. Links and D1 keep recording.

### 6. Drop

Only before `live`: `state: dropped` and a one-line reason under **Execution**.

### 7. Confirm to the user

Write **Execution**: counts per status, the next due date. Update the `index.md` row. Reply with what was sent or scheduled (codes and counts), failures with the provider's error, replies so far, and the next batch date.
