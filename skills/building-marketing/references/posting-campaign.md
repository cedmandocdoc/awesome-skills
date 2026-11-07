# Posting Campaign

## Overview

**Execution mode.** Posts a finished campaign where and when the user says: through Buffer where it reaches, and as a manual post the user makes everywhere else. Writes a **Reach** row for each post that goes out. Judging how a post did is the user's call.

## Prerequisites

Per [marketing-contract.md](./marketing-contract.md) → **campaign.md**, **Where a campaign stands**, **Platform rules**, **Honesty rules**, **Secrets**. Sender commands: [configuring-publishing.md](./configuring-publishing.md) → step 1.

## Guidelines

### 1. Resolve the campaign

The campaign the user names, else the latest one with a final and no **Reach** row. None final yet → [creating-campaign.md](./creating-campaign.md).

### 2. Plan the posts

Per channel the user names (else suggest the channels in its audience's **Where they gather**), write a caption per [marketing-contract.md](./marketing-contract.md) → **Platform rules**, and pick the ratio's render and a time:

| Channel | How |
| --- | --- |
| A page or business/creator account in `buffer_channels` | `buffer` |
| Groups, DMs, personal profiles, and anything Buffer can't reach | `manual` |

Captions live only in the chat; they are never saved to a file.

### 3. Approve

1. `send.js upload` each media file a `buffer` post uses.
2. Show every caption, time and media URL; the user opens each URL to check it.
3. When the voice, music or effects are AI-generated, tell the user to set each platform's AI-content label where it asks for one.
4. Wait for approval. An approved time already past → confirm a new time first.

### 4. Post

| How | Do |
| --- | --- |
| `buffer` | Pipe the approved caption into `send.js push`, as below; a failure → report its error and write no row |
| `manual` | Hand the user the caption and the render |

```bash
node --env-file="$env" <skill>/scripts/send.js push --root <marketing-root> --channel <name> \
  --media <url> --at "<time>" --text - <<'EOF'
<the approved caption>
EOF
```

Write one **Reach** row per post that went out or was handed over: channel, how, when, media URL, Buffer id.

### 5. Confirm to the user

Reply with the posts queued (channel, time) and the manual posts to make.
