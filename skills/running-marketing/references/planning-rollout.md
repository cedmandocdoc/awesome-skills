# Planning Rollout

## Overview

**Planning only.** Phase 3, Roll-out: picks the channels, the schedule, the asset list, and the links, and checks measurement is ready. Stops at state `rollout`.

## Prerequisites

Per [marketing-contract.md](./marketing-contract.md) → **campaign.md**, **States**, **Sending caps**, **Links and UTMs**. Types: [marketing-types.md](./marketing-types.md).

## Guidelines

### 1. Plan the schedule

Per type: channels, batch sizes within **Sending caps**, posting cadence, and touch spacing (outbound: day 0, 3, 7). Set `end` or `end_condition`.

### 2. List the assets

One row per asset under **Roll-out** → **Assets**:

| Column | Content |
| --- | --- |
| Asset | Outbox set (`touch 1 emails ×60`) or visual asset (`video for TikTok`) |
| Kind | `text` or `video`, `carousel`, `image`, `screenshots` |
| Channel and format | Platform; size per the assets skill's channel specs |
| Link | Destination: landing page, sign-up page, or store listing |

Pick the asset last: by audience and channel. Video is one format among personal email or DM, carousel or image, text post, and free audit or demo.

### 3. Check measurement

Under **Roll-out** → **Measurement**: Worker deployed (`<marketing-root>/measurement/` exists and answers), and the app records `conversion('<event>')` for this campaign's event. Missing → list [configuring-measurement.md](./configuring-measurement.md) as a step before Execution.

### 4. Confirm to the user

Write **Roll-out**: schedule, assets, measurement. `state: rollout`; update the `index.md` row. Reply with the schedule as dated lines, the asset list, any measurement work, and next: _"continue campaign NN"_ creates the assets.
