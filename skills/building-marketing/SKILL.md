---
name: building-marketing
id: 494e9c38-b6fa-426d-9e61-30e691a3cf2b
description: >-
  Markets any app, mockup, or digital product under marketing/: studies the
  reference it is given into audiences, pains, features to show, and hooks; makes
  promotion videos and static ads with HyperFrames and ElevenLabs voiceover from
  a script the user approves; and runs the reach — organic posts through Buffer,
  Meta ad specs the user enters, platform numbers the user pastes, and the next
  move. Use only when the user names this skill (`/building-marketing`,
  `$building-marketing`, or "building-marketing"), or references a file under a
  marked marketing root (`@marketing/dentist-clinic/plan.md`).
version: 1.0.0
---

# Building Marketing

## Setup

| Item | Kind | Required | When | Done when | How |
| --- | --- | --- | --- | --- | --- |
| Root path | ask | required | Set up, Study | [marketing-contract.md](references/marketing-contract.md) → **Resolve marketing root** finds a root | Ask for the folder (default `marketing/`); missing or empty → use it, else ask for another path; recorded as the root's location |
| Root marker | static | required | Set up, Study | `<marketing-root>/index.md` carries [marketing-contract.md](references/marketing-contract.md) → **Author signature** | Write `index.md` from [`assets/index.md`](assets/index.md) |
| Node.js 22+ | user | required | Make promotion, Run marketing | `node --version` reports 22 or later | https://nodejs.org |
| [hyperframes](https://github.com/heygen-com/hyperframes/tree/main/skills/hyperframes) | user | required | Make promotion | Found per [marketing-contract.md](references/marketing-contract.md) → **Discover dependency skill** | `npx hyperframes skills update` |
| [media-use](https://github.com/heygen-com/hyperframes/tree/main/skills/media-use) | user | required | Make promotion | Found per [marketing-contract.md](references/marketing-contract.md) → **Discover dependency skill** | `npx hyperframes skills update` |
| [text-to-speech](https://github.com/elevenlabs/skills/tree/main/text-to-speech) | user | required | Make promotion | Found per [marketing-contract.md](references/marketing-contract.md) → **Discover dependency skill** | `npx skills add elevenlabs/skills --skill text-to-speech` |
| [setup-api-key](https://github.com/elevenlabs/skills/tree/main/setup-api-key) | user | required | Make promotion | Found per [marketing-contract.md](references/marketing-contract.md) → **Discover dependency skill** | `npx skills add elevenlabs/skills --skill setup-api-key` |
| [music](https://github.com/elevenlabs/skills/tree/main/music) | user | optional | Make promotion, when a promotion names ElevenLabs music | Found per [marketing-contract.md](references/marketing-contract.md) → **Discover dependency skill** | `npx skills add elevenlabs/skills --skill music` |
| [sound-effects](https://github.com/elevenlabs/skills/tree/main/sound-effects) | user | optional | Make promotion, when a promotion names ElevenLabs sound effects | Found per [marketing-contract.md](references/marketing-contract.md) → **Discover dependency skill** | `npx skills add elevenlabs/skills --skill sound-effects` |
| `.env` ignored | auto | required | Make promotion, Run marketing | Root `.gitignore` lists `.env` | Add `.env` to root `.gitignore` (create when missing) |
| ElevenLabs API key | user | required | Make promotion | `set -a; . ./.env; set +a; npx -y @elevenlabs/cli@latest onboard check` reports the key works | Starter plan or higher, for its commercial licence (https://elevenlabs.io/pricing); create a key at https://elevenlabs.io/app/settings/api-keys and paste it after `ELEVENLABS_API_KEY=` in `.env` yourself, never in chat; a rejected key → setup-api-key |
| Cloudflare account with R2 | user | required | Run marketing | `npx wrangler whoami` shows an account | https://dash.cloudflare.com/sign-up, enable R2, then `npx wrangler login` |
| Sender script | static | required | Run marketing | `<marketing-root>/sender/node_modules/` exists | [configuring-publishing.md](references/configuring-publishing.md) → step 1 |
| Buffer API key | user | required | Run marketing | `send.js verify` exits 0 | [configuring-publishing.md](references/configuring-publishing.md) → step 2 |
| Buffer channel map | auto | required | Run marketing | `index.md` frontmatter `buffer_channels` is non-empty and covers every Buffer channel in the plans' **Reach** | [configuring-publishing.md](references/configuring-publishing.md) → step 3 |
| Media bucket | auto | required | Run marketing | `index.md` frontmatter `media_url` is a URL, not `none` | [configuring-publishing.md](references/configuring-publishing.md) → step 4 |

## Workflow

1. **Setup** — for each **Setup** row whose When covers the request, in order: Done when holds → skip; `user` → stop and print its How when required, continue without it when optional; `ask` → fill what the request answers, ask the rest together in one message, record each answer; `auto` and `static` → run.
2. **Contract** — read [marketing-contract.md](references/marketing-contract.md).
3. **Recipe** — match one **Recipes** row; open every doc in its Read column.

- Makes no paid call and posts nothing until the user approves the plan that names it.

## Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Set up | "Set up building-marketing", "Connect Buffer", "Is building-marketing ready?" | **Setup** — run Workflow step 1 for every row, then report each row's state |
| Study | "/building-marketing study `mockups/dentist-clinic/`, promoting that Likhara can build it for you", "/building-marketing for my app at https://…", "re-study the audience" | [studying-reference.md](references/studying-reference.md) |
| Make promotion | "Make a 30 s reel for it", "another video, founder overlay", "redo promotion 02 with a shorter hook", a reference to `@marketing/<slug>/plan.md` | [creating-promotion.md](references/creating-promotion.md) |
| Run marketing | "Run marketing", "post promotion 02", "here are this week's numbers" | [executing-marketing.md](references/executing-marketing.md) |
