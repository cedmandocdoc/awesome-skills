# Creating Delivery

## Overview

**Execution mode.** Records deliveries the user approved (a post, or a batch of messages) in D1 as `approved`, `scheduled` or `sent`, freezing each promotion at its first delivery. It records nothing the user hasn't approved, and sends nothing.

## Prerequisites

Per [tracking-contract.md](./tracking-contract.md) → **Resolve promotions roots**, **Deliveries**, **Statuses**, **Freeze**, **Commands**.

## Guidelines

### 1. Resolve each promotion

Its id per **Resolve promotions roots** (`track.mjs promotions` lists them). A promotion that's `changed` or `missing` stops here: report it and the fix per **Freeze**.

### 2. Write the records

One object per delivery, with the fields in **Deliveries**: `promotion`, `kind`, `channel`, `assets` and `text` always; `target` for a message. `status` is `approved` (the default), `scheduled` (already queued, with its `link`), or `sent` (already out). `text` is the caption or body exactly as it goes out.

### 3. Record

`node <skill>/scripts/track.mjs record --file <records.json>`. Any invalid item → nothing is written: report its errors, fix the records, and run it again.

### 4. Confirm to the user

Each recorded delivery (id, promotion, kind, channel, target name, status), and the promotions frozen by it.

## Examples

```json
[
  { "promotion": "crew-payroll/01-pas-cutoff-na-naman", "kind": "post", "channel": "facebook", "format": "reel",
    "assets": ["renders/01-pas-cutoff-na-naman-9x16.mp4"], "target": "the Facebook page", "text": "<the caption>",
    "planned_for": "2026-11-27T11:00:00.000Z", "status": "scheduled", "link": "<the scheduler's post id or link>" },
  { "promotion": "coating-bookings/02-outreach-booking-app", "kind": "message", "channel": "email", "label": "intro",
    "assets": ["renders/01-4x5.jpg"], "fill": { "Your Company": "Shine Auto Detailing" },
    "target": "hello@example.com", "target_name": "Shine Auto Detailing", "ref": "<the caller's id>",
    "subject": "<subject>", "text": "<the body as sent>", "batch": "intro-coating-2026-11-19" }
]
```
