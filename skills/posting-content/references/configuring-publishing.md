# Configuring Publishing

## Overview

**Execution mode.** Once per repository: the Buffer key and channel map, and the R2 bucket that hosts media for Buffer. Runs the Buffer and bucket rows of `SKILL.md` → **Setup**.

## Guidelines

### 1. Sender script

[`../scripts/send.js`](../scripts/send.js) runs in place with Node alone; `<skill>` is this skill's folder. Every command runs from the repository root, with `$env` per [posting-contract.md](./posting-contract.md) → **Secrets**:

```bash
node --env-file="$env" <skill>/scripts/send.js <command>
```

| Command | Does |
| --- | --- |
| `verify` | Checks the Buffer key |
| `channels` | Lists Buffer channels: id, service, name |
| `upload --root <posts-root> <file>` | Puts the file in `media_bucket` at its path from the repository root; prints its public URL |
| `push --root <posts-root> --channel <name> --text - [--media <url>…] [--at "YYYY-MM-DD HH:MM"]` | Creates a Buffer post on the mapped channel with the caption read from stdin: queued without `--at`, scheduled at a future `--at` (local time), now at a past one; prints the Buffer post id |

`--media` takes one video URL, or one or more image URLs.

### 2. Buffer key

The user creates a key at https://publish.buffer.com/settings/api, stores it in the main worktree's `.env` as `BUFFER_API_KEY`, and connects each channel in Buffer. The free plan has 3 channels and 10 scheduled posts per channel.

### 3. Channel map

Run `channels`, then write `buffer_channels` in `index.md` frontmatter as one indented `<name>: <id>` line per channel the posts use (`facebook`, `instagram`, `tiktok`). A channel missing from Buffer → ask the user to connect it, or post there manually.

### 4. Media bucket

Every `wrangler` command passes the sender's own config, with `B` = `media_bucket` from `index.md`:

```bash
C=<skill>/scripts/wrangler.toml
npx wrangler r2 bucket create $B -c $C                  # skip when the bucket exists
npx wrangler r2 bucket dev-url enable $B -y -c $C
npx wrangler r2 bucket dev-url get $B -c $C             # record as media_url in index.md
```

### 5. Confirm to the user

Reply with the `verify` result, the channels mapped, the bucket and its media URL, and the channels left manual.

## References

- Buffer API: https://developers.buffer.com/reference.html
- Buffer media hosting: https://developers.buffer.com/guides/hosting-media.html
- Wrangler R2 commands: https://developers.cloudflare.com/workers/wrangler/commands/r2/
