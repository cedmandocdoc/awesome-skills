# Executing Marketing

## Overview

**Execution mode.** Runs the reach for one item or all: records the platform numbers the user pastes, decides the next move, plans organic posts and ad specs for rendered promotions, stops for approval, then queues the posts in Buffer. The user enters ads in Meta Ads Manager from the spec.

## Prerequisites

Per [marketing-contract.md](./marketing-contract.md) → **plan.md**, **Statuses**, **Platform rules**, **Honesty rules**. Sender commands: [configuring-publishing.md](./configuring-publishing.md) → step 1.

## Guidelines

### 1. Resolve the items

The named item, else every item in `index.md` with a rendered promotion or an open **Reach** row.

### 2. Read the results

1. `send.js status <buffer-id>` per `queued` post: sent → `sent` with its time; an error → `approved` with the error in the row.
2. Ask once, in one message, for the numbers of every `sent` post and `live` ad without numbers since its last update. Pasted text or screenshots:

| Source | Numbers |
| --- | --- |
| Meta Ads Manager | Spend, results (conversations started), cost per result, reach, CTR |
| Buffer | Impressions, engagement, clicks per post |

Write them into the row's numbers with the date.

### 3. Decide the next move

| Signal | Move |
| --- | --- |
| An ad spent past the **Brief**'s kill rule with no results | Stop it (`stopped`); the user pauses it in Ads Manager |
| An ad or post beats the others on cost per result or engagement | More budget, or a new promotion on its hook |
| A rendered promotion not in **Reach** | Plan its posts and ads (step 4) |
| An audience with no promotion | Make promotion for it |
| Everything stopped or flat | Re-study: a new audience, hook, or channel |

Write **Next**: the move and the numbers behind it.

### 4. Plan the reach

Per rendered promotion not yet posted, one **Reach** row per channel in its audience's **Where they gather**, status `planned`; the copy goes to `captions/<channel>.txt` or `ad-spec.md` per [marketing-contract.md](./marketing-contract.md) → **Output layout**:

| Channel | Row |
| --- | --- |
| A page or business/creator account Buffer reaches | Organic post: caption per [marketing-contract.md](./marketing-contract.md) → **Platform rules**, media, time |
| Meta ads | Ad spec: objective, conversion location, audience, placements, daily budget, duration, creative, primary text, headline, CTA, kill rule |
| Groups, DMs, personal profiles | Manual post: the user posts it |

### 5. Approve

1. `send.js upload <file>` per media file; record its URL in the row.
2. Show every caption, time, media URL, and ad spec; the user opens each URL to check it.
3. Approval → status `approved`.

### 6. Publish

| Row | Do |
| --- | --- |
| Organic post | `send.js push --text captions/<channel>.txt`; record the Buffer id; status `queued`. An approved time already past → confirm a new time first |
| Ad | The user enters it in Ads Manager from the spec and reports it; status `live` |
| Manual post | The user posts it and reports it; status `sent` |

A failed push stays `approved` with the error in the row.

### 7. Confirm to the user

Update the `index.md` rows. Reply with:

- Numbers recorded and the **Next** move
- Posts queued (channel, time), ads to enter, manual posts to make
- Next: "run marketing" after the posts go out, with the new numbers
