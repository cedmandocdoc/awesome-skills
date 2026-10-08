# Updating Campaign

## Overview

**Authoring mode.** Applies a change to an earlier phase or a video: reruns the phase that owns it, marks the later work it reaches as stale instead of deleting it, and sends video changes back to HyperFrames.

## Prerequisites

Per [marketing-contract.md](./marketing-contract.md) → **States**, **Outbox items**, **Videos**.

## Guidelines

### 1. Route the change

| Campaign | Do |
| --- | --- |
| `concluded` or `dropped` | Stop; offer a new campaign with `follows` |
| `live` or `ended`, segment or message | Strategy change: offer to end this campaign and start a new one with `follows`, so measurement never mixes two strategies |
| `live` or `ended`, other changes | Steps 2–4 on unsent items only; `sent` and `replied` items stay as sent |
| Before `live` | Steps 2–4 |

### 2. Rerun and mark stale

| Change | Rerun | Mark stale | Each video |
| --- | --- | --- | --- |
| Wording within a phase | That phase, in place | Nothing | — |
| A note on a video | — | Nothing | Named change in the same project |
| CTA or link | Ideation (conversion) or Roll-out | Items carrying the link, `links.md` | Named change: end card |
| Proof | Ideation | Drafts using it | Named change: affected frames |
| Message | Ideation | All drafts | New version in the same project; look kept |
| Segment | Target, and Ideation when the pain changes | Prospects, all drafts | New request; the recipe keeps the look |
| Channel | Roll-out | That channel's posts | New request and project (a new aspect ratio needs one); the recipe keeps the look |
| Schedule only | Roll-out | Nothing | — |

Rerun the owning phase's recipe in place, keeping earlier work as defaults where it still fits; before `live` it sets `state` to that phase, after `live` `state` stays. Mark each later section the change reaches with a first line `> Stale since <date>: <change>`, and outbox items `status: stale`. On "continue", each phase with a stale mark redoes only the stale parts and clears its marks.

### 3. Change the videos

Update the saved request under **Video requests** first. Then invoke `/hyperframes` naming the project and the change; it revises only the frames named. A new request gets a new code and row. A change to a video already posted gets the next code, and its old row and links stay.

### 4. Confirm to the user

Reply with the phase rerun, what was marked stale (sections, item codes, video codes), the video changes handed to HyperFrames, and next: _"continue campaign NN"_ reruns the stale work.
