# Creating Assets

## Overview

**Authoring mode.** Phase 4, Assets: writes every text draft and its links, requests each planned video from HyperFrames, and turns each rendered video into links and a post outbox item. Sets state `assets`; repeat runs advance the videos until all are done.

## Prerequisites

Per [marketing-contract.md](./marketing-contract.md) → **Outbox items**, **Sending caps**, **Links and UTMs**, **Videos**, **Free media**, **Discover dependency skill**. Writing rules: [marketing-types.md](./marketing-types.md) → **Writing rules per asset**. Links into D1: [configuring-measurement.md](./configuring-measurement.md) → **Add links**.

## Guidelines

### 1. Route the run

| Campaign | Run |
| --- | --- |
| `state: rollout` | Steps 2–4, 6, then 7 for the first video |
| `state: assets`, a section or item marked stale | Rerun the step that owns it, then 6 |
| `state: assets`, a video not done | Per video, by its state on disk per [marketing-contract.md](./marketing-contract.md) → **Videos**: requested or in progress → 7; approved → 5, then 6 |

### 2. Write text drafts

Per outbox set in **Roll-out** → **Assets**, one outbox item per person and touch from [`../assets/outbox-item.md`](../assets/outbox-item.md), status `draft`, numbered in send order. Touch 1 personalizes from the prospect's `why`; touches 2–3 carry `send_if: no reply`. Text posts get their planned date in `scheduled`.

### 3. Create text links

One link per outbox item that carries a link. Write the rows to `links.md`, insert them per [configuring-measurement.md](./configuring-measurement.md) → **Add links**, and put the short URL in the item's body and `link`.

### 4. Write the video requests

HyperFrames found per **Discover dependency skill**; missing → print the install and offer text posts in place of the videos.

Per planned video: assign the next code, add it to `videos`, add its **Assets** → **Videos** row (Project and Render empty), and save a request from [`../assets/video-request.md`](../assets/video-request.md) under **Assets** → **Video requests** → `### vN`. Fill it from **Idea**, **Roll-out** → **Assets**, and **Roll-out** → **Material**; its short link is `go.<domain>/<NN>vN`. When an earlier video of this campaign or its `follows` was saved as a HyperFrames recipe, name that recipe in the request.

### 5. Collect a rendered video

1. Link the project folder and `renders/video.mp4` in its **Assets** → **Videos** row.
2. Add its links per platform to `links.md` and D1.
3. Write its post outbox item: a caption per **Post caption**, `link`, `video`, `media` = the render path, `scheduled` from **Roll-out** → **Schedule**.
4. For the campaign's first rendered video, recommend accepting HyperFrames' offer to save it as a recipe, so later videos keep the look and still get their own pitch round.

### 6. Confirm to the user

Write **Assets**: outbox counts per set, link count, and per video its code and state on disk. `state: assets`; update the `index.md` row. Reply with:

- 2 sample outbox items in full, and the path to the rest
- Each video's code and state; the next one handed off
- Next: when every video is done (or replaced by a text post) and every text draft exists, _"continue campaign NN"_ shows the first batch to approve

### 7. Hand off a video

Invoke `/hyperframes` with the saved request, or, when its project exists, naming the project to resume. HyperFrames takes over the chat until its render; its return line reloads this skill at step 1.
