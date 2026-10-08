# Planning Rollout

## Overview

**Planning only.** Phase 3, Roll-out: picks the channels, the schedule, the asset list, the material videos need, and the links, and checks measurement is ready. Stops at state `rollout`.

## Prerequisites

Per [marketing-contract.md](./marketing-contract.md) → **campaign.md**, **States**, **Sending caps**, **Links and UTMs**, **Free media**. Types: [marketing-types.md](./marketing-types.md).

## Guidelines

### 1. Plan the schedule

Per type: channels, batch sizes within **Sending caps**, posting cadence, and touch spacing (outbound: day 0, 3, 7). Set `end` or `end_condition`.

### 2. List the assets

Pick the asset last, by audience and channel: video is one format among personal email or DM, text post, and free audit or demo. One row per asset under **Roll-out** → **Assets**:

| Column | Content |
| --- | --- |
| Asset | Outbox set (`touch 1 emails ×60`) or one video (`launch video for TikTok`) |
| Kind | `text`, or a video kind below |
| Channel and format | Platform; for a video, size and length below. One video per aspect ratio |
| Link | Destination: landing page, sign-up page, or store listing |

| Video kind | HyperFrames workflow | Use |
| --- | --- | --- |
| Product demo or launch (default) | `product-launch-video` | Pain as kinetic type → real screens with camera moves → proof → CTA card |
| Short kinetic hook, 5–10 s | `motion-graphics` | The pain statement or one big number; Reels and TikTok openers, story ads |
| Beat-cut promo | `music-to-video` | The user's track drives the cuts; screenshots cut onto the beat |
| Founder on camera | `talking-head-recut`, `embedded-captions` | The user films themselves; often the best organic reach |

| Channel | Size | Length | Notes |
| --- | --- | --- | --- |
| TikTok, Instagram Reels, YouTube Shorts | 1080×1920 | 15–30 s | Keep text out of the top 250 px, bottom 450 px, and right 160 px |
| Instagram, Facebook feed | 1080×1350 | ≤ 30 s | |
| LinkedIn feed | 1080×1350 or 1080×1080 | 15–45 s | |
| X | 1080×1080 or 1920×1080 | ≤ 45 s | |
| YouTube, landing page | 1920×1080 | 30–90 s | |

### 3. Gather the material

Only when a video is planned. Under **Roll-out** → **Material**, list what every video request in this campaign will name, per **Free media**:

- The live URL to capture.
- Repo paths to the logo, brand file (`design.md` or `DESIGN.md`), fonts, and screenshots.
- Design folders or HTML the user names. Static HTML works as a screenshot or as live markup; React screens work as a screenshot or recording, or as live markup after exporting the rendered DOM to static `.html`. A feature not shipped yet may be shown from its design and is rechecked against the shipped feature before posting.
- Key screens capture can't reach (behind login, mobile app only). Ask once, in one message, for a screen recording of each flow; every video in the campaign reuses them.

### 4. Check measurement

Under **Roll-out** → **Measurement**: Worker deployed (`<marketing-root>/measurement/` exists and answers), and the app records `conversion('<event>')` for this campaign's event. Missing → list [configuring-measurement.md](./configuring-measurement.md) as a step before Execution.

### 5. Confirm to the user

Write **Roll-out**: schedule, assets, material, measurement. `state: rollout`; update the `index.md` row. Reply with the schedule as dated lines, the asset list, the recordings asked for, any measurement work, and next: _"continue campaign NN"_ creates the assets.
