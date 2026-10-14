# Configuring Sending

## Overview

**Execution mode.** Once per product, for the send methods the user opts into: Buffer for posts, SMTP for email. Runs the sending rows of `SKILL.md` → **Setup**. Without an opt-in every item stays `manual` and nothing here runs.

## Prerequisites

Per [marketing-contract.md](./marketing-contract.md) → **Outbox items**, **Sending caps**, **Measurement** (the Wrangler config rule).

## Guidelines

### 1. Send methods

Ask once, in one message, and record the answers in `<marketing-root>/index.md` frontmatter:

| Field | Question | Default |
| --- | --- | --- |
| `send_posts` | Which post channels should Buffer publish (`[facebook, tiktok]`)? Bios, DMs, and group posts stay manual | `[]` |
| `send_email` | Should the skill send campaign email from a mailbox you connect (`smtp`), or will you send it (`manual`)? | `manual` |

A channel not in `send_posts` stays `manual`. Buffer reaches pages and business or creator accounts; a personal Facebook profile stays `manual`.

### 2. Secrets

Every secret lives in the repository's `.env`; add `.env` to `.gitignore` when it is missing.

| Send method | `.env` values |
| --- | --- |
| Buffer | `BUFFER_API_KEY` |
| SMTP | `SMTP_HOST`, `SMTP_PORT` (465 or 587), `SMTP_USER`, `SMTP_PASS`, `IMAP_HOST`, `IMAP_PORT` (993), `MAIL_FROM` (`Name <address>`) |

IMAP signs in with the SMTP user and password.

### 3. Sender script

Copy [`../assets/sender/`](../assets/sender/) to `<marketing-root>/sender/` and run `npm install` there. Every command runs from the repository root:

```bash
node --env-file=.env <marketing-root>/sender/send.js <command>
```

| Command | Does |
| --- | --- |
| `verify` | Checks Buffer, SMTP, and IMAP for the opted-in methods |
| `channels` | Lists Buffer channels: id, service, name |
| `push <item.md>…` | Sends each `approved` item whose `send` is `buffer` or `smtp`; enforces the email cap, touch limit, and prior replies; writes `status`, `external_id`, `sent_at`, `media_url`, or `error` into the item |
| `sync` | Moves `queued` posts Buffer sent to `sent` with Buffer's time, and errored ones back to `approved` with `error`; prints replies to sent emails as JSON |
| `unqueue <item.md>…` | Deletes `queued` posts from Buffer; the items go back to `approved` |

### 4. Buffer

1. The user creates a key at https://publish.buffer.com/settings/api and connects each channel in Buffer. The free plan has 3 channels and 10 scheduled posts per channel.
2. `channels`, then write `buffer_channels` in `index.md` frontmatter: each `send_posts` channel → its Buffer channel id. A channel missing from Buffer → ask the user to connect it or drop it from `send_posts`.
3. Media bucket, once; Buffer fetches each video from a public URL when it publishes:

```bash
C=<marketing-root>/measurement/wrangler.toml
npx wrangler r2 bucket create marketing-media -c $C
npx wrangler r2 bucket dev-url enable marketing-media -y -c $C
npx wrangler r2 bucket dev-url get marketing-media -c $C   # record as media_url in index.md
```

Each channel's first pushed post is its test: after its `scheduled` time, `sync` shows `sent`, or its `error` names what Buffer needs (account type, permissions); a channel that keeps failing goes back to `manual`.

### 5. Mailbox

1. The user connects a mailbox that supports SMTP and IMAP and fills the SMTP values in `.env`. Gmail and Google Workspace: 2-Step Verification on, then an app password at https://myaccount.google.com/apppasswords as `SMTP_PASS`; `smtp.gmail.com:465`, `imap.gmail.com:993`.
2. `verify` passes for SMTP and IMAP.
3. Before recording `email_risks_accepted: <date>` in `index.md` frontmatter, tell the user, and ask them to confirm:
   - Spam reports and bounces land on the account that sends. A personal mailbox risks that account; a dedicated one isolates it. `mail.<domain>` is best: the main domain and its transactional mail (sign-in codes, receipts) stay clear.
   - A new mailbox warms up for 2–4 weeks first: 5–10 emails a day to people who reply, rising to 30.
   - The domain needs SPF, DKIM, and DMARC records from the mail provider.
   - Transactional services (ZeptoMail, Postmark, and similar) forbid campaign email and block accounts that send it.

### 6. Confirm to the user

Reply with the send method per channel and for email, the Buffer channels mapped, the media URL, the `verify` result, the date the risks were accepted, and the channels left `manual`.

## References

- Buffer API: https://developers.buffer.com/reference.html
- Buffer media hosting: https://developers.buffer.com/guides/hosting-media.html
- Wrangler R2 commands: https://developers.cloudflare.com/workers/wrangler/commands/r2/
