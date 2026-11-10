---
name: posting-content
id: 36a7c8c5-e6dc-4171-a2f1-8d8086dd209b
description: >-
  Posts finished content — a rendered video, images, or text — to social
  channels through Buffer, hosting its media on Cloudflare R2, or hands it over
  for a manual post: one post at a time, each caption, time and media link
  approved by the user, with nothing kept afterwards but the channel and bucket
  config. Use only when the user names this skill (`/posting-content`,
  `$posting-content`, or "posting-content").
version: 1.0.0
---

# Posting Content

## Setup

| Item | Kind | Required | When | Done when | How |
| --- | --- | --- | --- | --- | --- |
| Root path | ask | required | Set up, Post | [posting-contract.md](references/posting-contract.md) → **Resolve posts root** finds a root | Ask for the folder (default `posts/`); missing or empty → use it, else ask for another path; recorded as the root's location |
| Root marker | static | required | Set up, Post | `<posts-root>/index.md` carries [posting-contract.md](references/posting-contract.md) → **Author signature** | Write `index.md` from [`assets/index.md`](assets/index.md) |
| Node.js 22+ | user | required | Set up, Post | `node --version` reports 22 or later | https://nodejs.org |
| `.env` ignored | auto | required | Set up, Post | Root `.gitignore` lists `.env` | Add `.env` to root `.gitignore` (create when missing) |
| Cloudflare account with R2 | user | required | Set up, Post | `npx wrangler whoami` shows an account | https://dash.cloudflare.com/sign-up, enable R2, then `npx wrangler login` |
| Buffer API key | user | required | Set up, Post | `send.js verify` exits 0 | [configuring-publishing.md](references/configuring-publishing.md) → step 2 |
| Buffer channel map | auto | required | Set up, Post | `index.md` frontmatter `buffer_channels` covers every Buffer channel the post uses | [configuring-publishing.md](references/configuring-publishing.md) → step 3 |
| Media bucket name | ask | required | Set up, Post | `index.md` frontmatter `media_bucket` names a bucket, not `none` | Ask for the R2 bucket name (default `content-media`); recorded as `media_bucket` in `index.md` |
| Media bucket | auto | required | Set up, Post | `index.md` frontmatter `media_url` is a URL, not `none` | [configuring-publishing.md](references/configuring-publishing.md) → step 4 |

## Workflow

1. **Setup** — for each **Setup** row whose When covers the request, in order: Done when holds → skip; `user` → stop and print its How when required, continue without it when optional; `ask` → fill what the request answers, ask the rest together in one message, record each answer; `auto` and `static` → run.
2. **Contract** — read [posting-contract.md](references/posting-contract.md).
3. **Recipe** — match one **Recipes** row; open every doc in its Read column.

- Posts nothing before the user approves the post, and writes nothing into the content it posts.

## Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Set up | "Set up posting-content", "Connect Buffer", "Is posting-content ready?" | **Setup** — run Workflow step 1 for every row, then report each row's state |
| Post | "/posting-content post `promotions/01-one-photo/renders/01-one-photo-9x16.mp4` to the Facebook page Friday 7 pm", "post it to TikTok now" | [creating-post.md](references/creating-post.md) |
