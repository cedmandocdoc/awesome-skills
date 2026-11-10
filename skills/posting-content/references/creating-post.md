# Creating Post

## Overview

**Execution mode.** Posts finished content once: uploads each media file to the bucket, then queues the approved posts in Buffer, or hands them to the user for a manual post. It renders nothing and changes nothing in the content.

## Prerequisites

Per [posting-contract.md](./posting-contract.md) → **Resolve posts root**, **index.md fields**, **Captions**, **AI-content labels**, **Secrets**. The sender per [configuring-publishing.md](./configuring-publishing.md) → **1. Sender script**.

## Guidelines

### 1. Resolve the content

The files the user names: a rendered video, one or more images, or text only. A folder → list its renders and ask which. A file that doesn't exist → stop and report; this skill never renders.

### 2. Plan the posts

Per channel the user names, pick the file whose ratio fits the channel, a time, and a caption per [posting-contract.md](./posting-contract.md) → **Captions**:

| Channel | How |
| --- | --- |
| A page or business/creator account in `buffer_channels` | `buffer` |
| Groups, DMs, personal profiles, and anything Buffer can't reach | `manual` |

### 3. Approve

1. `send.js upload` each media file a `buffer` post uses.
2. Show every caption, time and media URL; the user opens each URL to check it.
3. Remind the user about AI-content labels per [posting-contract.md](./posting-contract.md) → **AI-content labels**.
4. Wait for approval. An approved time already past → confirm a new time first.

### 4. Post

| How | Do |
| --- | --- |
| `buffer` | Pipe the approved caption into `send.js push`, as below; a failure → report its error and stop |
| `manual` | Hand the user the caption and the file |

```bash
node --env-file="$env" <skill>/scripts/send.js push --root <posts-root> --channel <name> \
  --media <url> --at "<time>" --text - <<'EOF'
<the approved caption>
EOF
```

### 5. Confirm to the user

Reply with each queued post (channel, time, media URL, Buffer post id) and each manual post to make.
