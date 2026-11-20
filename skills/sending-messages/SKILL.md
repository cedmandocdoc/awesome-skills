---
name: sending-messages
id: fb948fed-7849-4e79-bd07-026f5e8b563b
description: >-
  Sends approved one-to-one email messages on a schedule: plans each message a
  send time inside a send window (days, hours, timezone), a random gap apart and
  under a daily cap, shows the plan, and on the user's go queues them in
  Cloudflare D1 with their attachments in KV, where a Cloudflare Worker cron
  sends each one through SMTP when due and deletes its files. Optionally tied to
  tracking-promotions: a message carries its delivery id, goes only while that
  delivery is still scheduled, and its result (sent with the Message-ID, or
  failed with the error) is written back. Writes no message words; cancels
  queued messages on request. Use only when the user names this skill
  (`/sending-messages`, `$sending-messages`, or "sending-messages"), or
  references a file under a marked sending root (`@sending/index.md`).
version: 1.0.0
---

# Sending Messages

## Setup

| Item | Kind | Required | When | Done when | How |
| --- | --- | --- | --- | --- | --- |
| Root path | ask | required | Set up | [sending-contract.md](references/sending-contract.md) → **Resolve sending root** finds a root | Ask for the folder (default `sending/`); missing or empty → use it, else ask for another path; recorded as the root's location |
| Root marker | static | required | Set up | `<sending-root>/index.md` carries [sending-contract.md](references/sending-contract.md) → **Author signature** | Write `index.md` from [`assets/index.md`](assets/index.md) |
| Node.js 22+ | user | required | All | `node --version` reports 22 or later | https://nodejs.org |
| Cloudflare account | user | required | All | `npx wrangler whoami` shows an account | https://dash.cloudflare.com/sign-up, then `npx wrangler login` |
| Sender and window | ask | required | Set up | `index.md` frontmatter has every field of [sending-contract.md](references/sending-contract.md) → **index.md fields** marked required, none `none` | Ask together, with the defaults shown: the account (`npx wrangler whoami`; one → use it), the From address, the SMTP host and port, the env file and the names of the two variables that hold the SMTP login, the timezone, days, hours, daily cap and gap; recorded in `index.md` |
| SMTP login | user | required | Set up | The two variables `index.md` names are set in its `env_file` | The sending address's SMTP user and an app password from the mail provider, pasted into that file yourself, never in chat |
| [tracking-promotions](https://github.com/cedmandocdoc/awesome-skills/tree/main/skills/tracking-promotions) `1f308488-2ec0-4a45-aaf5-a9fa2af7d03b` | user | optional | Set up, Schedule, Cancel | Found per [sending-contract.md](references/sending-contract.md) → **Discover dependency skill**, and `index.md` names its database as `tracking_database` | `npx skills add cedmandocdoc/awesome-skills --skill tracking-promotions`, then its **Set up**; needed only when messages carry delivery ids |
| Outbox and Worker | auto | required | Set up, Schedule, Look up, Cancel | `node <skill>/scripts/outbox.mjs check` exits 0 | `node <skill>/scripts/outbox.mjs setup`, then `node <skill>/scripts/outbox.mjs secrets` |

## Workflow

1. **Setup** — for each **Setup** row whose When covers the request, in order: Done when holds → skip; `user` → stop and print its How when required, continue without it when optional; `ask` → fill what the request answers, ask the rest together in one message, record each answer; `auto` and `static` → run.
2. **Contract** — read [sending-contract.md](references/sending-contract.md).
3. **Recipe** — match one **Recipes** row; open every doc in its Read column.

- Queues only messages the user gave the go for, exactly as shown; writes no message words.
- Reads the SMTP login only to store it as Worker secrets; never prints it.

## Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Set up | "Set up sending-messages", "Is sending-messages ready?", "change the daily cap" | **Setup** — run Workflow step 1 for every row, then report each row's state |
| Schedule | "Send these approved emails", "schedule batch X from tomorrow 9 AM", a JSON of messages | [scheduling-messages.md](references/scheduling-messages.md) |
| Look up, Cancel | "What's still queued?", "did batch X go out?", "cancel 12", "stop batch X" | [updating-messages.md](references/updating-messages.md) |
