# Configuring Publishing

## Overview

**Execution mode.** Once per repository: the Buffer sender, the Buffer key and channel map, and the R2 bucket that hosts media for Buffer. Runs the publishing rows of `SKILL.md` → **Setup**.

## Guidelines

### 1. Sender script

Copy [`../assets/sender/`](../assets/sender/) to `<marketing-root>/sender/` and run `npm install` there. Every command runs from the repository root:

```bash
node --env-file=.env <marketing-root>/sender/send.js <command>
```

| Command | Does |
| --- | --- |
| `verify` | Checks the Buffer key |
| `channels` | Lists Buffer channels: id, service, name |
| `upload <file>` | Puts the file in the media bucket at its path under the marketing root; prints its public URL |
| `push --channel <name> --text <file> [--media <url>…] [--at "YYYY-MM-DD HH:MM"]` | Creates a Buffer post on the mapped channel: queued without `--at`, scheduled at a future `--at` (local time), now at a past one; prints the Buffer post id |

`--media` takes one video URL, or one or more image URLs for a carousel.

### 2. Buffer key

The user creates a key at https://publish.buffer.com/settings/api, stores it in `.env` as `BUFFER_API_KEY`, and connects each channel in Buffer. The free plan has 3 channels and 10 scheduled posts per channel.

### 3. Channel map

Run `channels`, then write `buffer_channels` in `index.md` frontmatter: each channel name the plans use (`facebook`, `instagram`, `tiktok`) → its Buffer channel id. A channel missing from Buffer → ask the user to connect it, or plan its rows as manual posts.

### 4. Media bucket

Every `wrangler` command passes the sender's own config:

```bash
C=<marketing-root>/sender/wrangler.toml
npx wrangler r2 bucket create marketing-media -c $C
npx wrangler r2 bucket dev-url enable marketing-media -y -c $C
npx wrangler r2 bucket dev-url get marketing-media -c $C   # record as media_url in index.md
```

### 5. Confirm to the user

Reply with the `verify` result, the channels mapped, the media URL, and the channels left manual.

## References

- Buffer API: https://developers.buffer.com/reference.html
- Buffer media hosting: https://developers.buffer.com/guides/hosting-media.html
- Wrangler R2 commands: https://developers.cloudflare.com/workers/wrangler/commands/r2/
