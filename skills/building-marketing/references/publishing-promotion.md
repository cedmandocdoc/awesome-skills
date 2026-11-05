# Publishing Promotion

## Overview

**Execution mode.** Posts a finished promotion where and when the user says: organic posts queued in Buffer, a Meta ad spec the user enters in Ads Manager, and manual posts the user makes. Writes a **Reach** row for each one that goes out. Judging how a post did is the user's call.

## Prerequisites

Per [marketing-contract.md](./marketing-contract.md) → **plan.md**, **Where a promotion stands**, **Platform rules**, **Honesty rules**. Sender commands: [configuring-publishing.md](./configuring-publishing.md) → step 1.

## Guidelines

### 1. Resolve the promotion

The promotion the user names, else the latest one with a final render or stills and no **Reach** row. None final yet → [creating-promotion.md](./creating-promotion.md).

### 2. Plan the posts

Per channel the user names (else suggest the channels in its audience's **Where they gather**), write the copy into `<promotion>/` per [marketing-contract.md](./marketing-contract.md) → **Output layout**:

| Channel | How | Copy |
| --- | --- | --- |
| A page or business/creator account Buffer reaches | `buffer` | `captions/<channel>.txt`: caption per [marketing-contract.md](./marketing-contract.md) → **Platform rules**, the ratio's render, a time |
| Meta ads | `ad spec` | `ad-spec.md`: objective, conversion location, audience, placements, budget from the **Brief**, duration, creative, primary text, headline, CTA |
| Groups, DMs, personal profiles | `manual` | `captions/<channel>.txt`; the user posts it |

### 3. Approve

1. `send.js upload <file>` per media file a `buffer` post uses.
2. Show every caption, time, media URL, and the ad spec; the user opens each URL to check it.
3. Wait for approval. An approved time already past → confirm a new time first.

### 4. Post

| How | Do |
| --- | --- |
| `buffer` | `send.js push --channel <name> --text captions/<channel>.txt --media <url> --at "<time>"`; a failure → report its error and write no row |
| `ad spec` | Hand the user `ad-spec.md` and the render to enter in Ads Manager |
| `manual` | Hand the user the caption and the render |

Write one **Reach** row per post that went out or was handed over: promotion, channel, how, when, copy file, media URL, Buffer id.

### 5. Confirm to the user

Update the `index.md` row. Reply with the posts queued (channel, time), the ad spec to enter, and the manual posts to make.
