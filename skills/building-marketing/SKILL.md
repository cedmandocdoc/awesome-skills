---
name: building-marketing
id: 494e9c38-b6fa-426d-9e61-30e691a3cf2b
description: >-
  Markets an app from its source (a mockup or a codebase) under marketing/:
  studies it into audiences, pains, and hooks; proposes campaign concepts the
  user steers until they pick; plans each pick as one promo video whose
  message, tone, pacing, picture, and sound follow its craft rules; previews the
  picture as a free HyperFrames draft; voices it, scores it, and adds effects
  with ElevenLabs, reusing a local sound bank first; and posts it through Buffer
  or hands it over for a manual post. Use only when the
  user names this skill (`/building-marketing`, `$building-marketing`, or
  "building-marketing"), or references a file under a marked marketing root
  (`@marketing/dentist-clinic/product.md`).
version: 2.0.0
---

# Building Marketing

## Setup

| Item | Kind | Required | When | Done when | How |
| --- | --- | --- | --- | --- | --- |
| Root path | ask | required | Set up, Study | [marketing-contract.md](references/marketing-contract.md) → **Resolve marketing root** finds a root | Ask for the folder (default `marketing/`); missing or empty → use it, else ask for another path; recorded as the root's location |
| Root marker | static | required | Set up, Study | `<marketing-root>/index.md` carries [marketing-contract.md](references/marketing-contract.md) → **Author signature** | Write `index.md` from [`assets/index.md`](assets/index.md) |
| Git ignores | auto | required | Set up, Study, Make campaign | `<marketing-root>/.gitignore` holds every rule in [`assets/marketing.gitignore`](assets/marketing.gitignore) | Add the missing rules to `<marketing-root>/.gitignore` (create when missing) |
| Web search and fetch | user | required | Study | The harness offers web search and page fetch tools | Run in a harness with web access, such as Claude Code |
| Node.js 22+ | user | required | Make campaign, Post | `node --version` reports 22 or later | https://nodejs.org |
| [hyperframes](https://github.com/heygen-com/hyperframes/tree/main/skills/hyperframes) | user | required | Make campaign | Found per [marketing-contract.md](references/marketing-contract.md) → **Discover dependency skill** | `npx hyperframes skills update` |
| [media-use](https://github.com/heygen-com/hyperframes/tree/main/skills/media-use) | user | required | Make campaign | Found per [marketing-contract.md](references/marketing-contract.md) → **Discover dependency skill** | `npx hyperframes skills update` |
| [text-to-speech](https://github.com/elevenlabs/skills/tree/main/text-to-speech) | user | required | Make campaign | Found per [marketing-contract.md](references/marketing-contract.md) → **Discover dependency skill** | `npx skills add elevenlabs/skills --skill text-to-speech` |
| [setup-api-key](https://github.com/elevenlabs/skills/tree/main/setup-api-key) | user | required | Make campaign | Found per [marketing-contract.md](references/marketing-contract.md) → **Discover dependency skill** | `npx skills add elevenlabs/skills --skill setup-api-key` |
| [music](https://github.com/elevenlabs/skills/tree/main/music) | user | required | Make campaign | Found per [marketing-contract.md](references/marketing-contract.md) → **Discover dependency skill** | `npx skills add elevenlabs/skills --skill music` |
| [sound-effects](https://github.com/elevenlabs/skills/tree/main/sound-effects) | user | required | Make campaign | Found per [marketing-contract.md](references/marketing-contract.md) → **Discover dependency skill** | `npx skills add elevenlabs/skills --skill sound-effects` |
| `.env` ignored | auto | required | Make campaign, Post | Root `.gitignore` lists `.env` | Add `.env` to root `.gitignore` (create when missing) |
| ElevenLabs API key | user | required | Make campaign | `set -a; . "$env"; set +a; npx -y @elevenlabs/cli@latest onboard check` reports the key works, `$env` per [marketing-contract.md](references/marketing-contract.md) → **Secrets** | Starter plan or higher, for its commercial licence (https://elevenlabs.io/pricing); music on Free–Pro is for an individual subscriber only, so a company needs Scale or Business (https://elevenlabs.io/music-terms). Create a key at https://elevenlabs.io/app/settings/api-keys and paste it after `ELEVENLABS_API_KEY=` in the main worktree's `.env` yourself, never in chat; a rejected key → setup-api-key, keeping the key in that `.env` |
| Sound bank | auto | required | Make campaign | `~/.awesome-skills/building-marketing/media/` holds `sfx/` and `music/` | `mkdir -p ~/.awesome-skills/building-marketing/media/{sfx,music}`; layout per [marketing-contract.md](references/marketing-contract.md) → **Sound bank** |
| Cloudflare account with R2 | user | required | Post | `npx wrangler whoami` shows an account | https://dash.cloudflare.com/sign-up, enable R2, then `npx wrangler login` |
| Buffer API key | user | required | Post | `send.js verify` exits 0 | [configuring-publishing.md](references/configuring-publishing.md) → step 2 |
| Buffer channel map | auto | required | Post | `index.md` frontmatter `buffer_channels` covers every Buffer channel the post uses | [configuring-publishing.md](references/configuring-publishing.md) → step 3 |
| Media bucket | auto | required | Post | `index.md` frontmatter `media_url` is a URL, not `none` | [configuring-publishing.md](references/configuring-publishing.md) → step 4 |

## Workflow

1. **Setup** — for each **Setup** row whose When covers the request, in order: Done when holds → skip; `user` → stop and print its How when required, continue without it when optional; `ask` → fill what the request answers, ask the rest together in one message, record each answer; `auto` and `static` → run.
2. **Contract** — read [marketing-contract.md](references/marketing-contract.md).
3. **Recipe** — match one **Recipes** row; open every doc in its Read column.

- Makes no paid call before the user approves its spend estimate, and posts nothing before the user approves the post.

## Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Set up | "Set up building-marketing", "Connect Buffer", "Is building-marketing ready?" | **Setup** — run Workflow step 1 for every row, then report each row's state |
| Study | "/building-marketing study `mockups/dentist-clinic/`, promoting that Likhara can build it for you", "/building-marketing market the app in this repo", "re-study the audience" | [studying-reference.md](references/studying-reference.md) |
| Make campaign | "Make a campaign for it", "more concepts, warmer and funnier", "make all three", "hold the moments longer in the draft", "voice it", "go final", a reference to `@marketing/<product>/<NN-slug>/campaign.md` | [creating-campaign.md](references/creating-campaign.md), [directing-promo-video.md](references/directing-promo-video.md) |
| Post | "Post campaign 02", "schedule it Friday 7 pm on the page" | [posting-campaign.md](references/posting-campaign.md) |
