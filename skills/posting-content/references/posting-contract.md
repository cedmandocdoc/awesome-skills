# Posting Contract

## Overview

Shared rules for every `posting-content` recipe: the posts root and its config, captions, AI-content labels, and secrets.

## Guidelines

### Author signature

Static UUID identifying files created by this skill:

```text
8ce1995f-158f-44e5-9b83-65cbd5cc6573
```

Every `<posts-root>/index.md` carries this value in frontmatter `author`.

### Output layout

```text
<posts-root>/        # default: posts/
  index.md           # root marker and config: buffer_channels, media_bucket, media_url
```

The root holds config only. The skill keeps no record of posts and writes nothing into the content it posts. Template: [`../assets/index.md`](../assets/index.md).

### Resolve posts root

Search the repository for `index.md` with frontmatter `doc_type: posts-index`, `generated_by: posting-content`, and `author` = **Author signature**.

| Matches | Action |
| --- | --- |
| One | Use it |
| Several | Ask which (list each `index.md` path) |
| None, on Set up or Post | `SKILL.md` → **Setup** creates one |

### index.md fields

| Field | Holds | Written by |
| --- | --- | --- |
| `buffer_channels` | One indented `<name>: <id>` line per Buffer channel (`facebook`, `instagram`, `tiktok`) | [configuring-publishing.md](./configuring-publishing.md) → step 3 |
| `media_bucket` | The R2 bucket that hosts media for Buffer | `SKILL.md` → **Setup** |
| `media_url` | The bucket's public URL, or `none` | [configuring-publishing.md](./configuring-publishing.md) → step 4 |

### Captions

- A caption opens with the content's hook. Its CTA names the destination the content itself asks for.
- One caption per channel, within the channel's own length and hashtag norms.
- Captions live only in the chat; they are never saved to a file.

### AI-content labels

When the content's voice, music, images or effects are AI-generated, tell the user to set each platform's AI-content label where the platform asks for one.

### Secrets

Secrets live in the main worktree's `.env`, so every worktree reads one file:

```bash
env="$(dirname "$(git rev-parse --path-format=absolute --git-common-dir)")/.env"
```

- Never open or print it, and never take a key pasted in chat.
- Load it with `node --env-file="$env"` on every [`../scripts/send.js`](../scripts/send.js) call.
