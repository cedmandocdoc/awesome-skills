---
name: building-promotion
id: 6c4545f9-8199-4a1b-bd79-56dc1ec4d9b0
description: >-
  Makes promotion videos for an app from its source (a mockup or a codebase)
  under promotions/: studies it into audiences, pains in their own words, and a
  message; suggests 3 concepts built on different script structures from a
  catalog, sized to a length the user can fix, each dressed by a style preset
  and a voice mode; plans the pick script-first as a message plan and a beat
  sheet the user approves; cuts it to a Pixabay track the user picks; builds it in
  HyperFrames on the music's beat grid after a short style test; voices it with
  ElevenLabs; mixes and renders it; and changes any part of a promotion on
  request. Use only when the user names this skill (`/building-promotion`,
  `$building-promotion`, or "building-promotion"), or references a
  file under a marked promotions root (`@promotions/product.md`).
version: 3.0.0
---

# Building Promotion Video

## Setup

| Item | Kind | Required | When | Done when | How |
| --- | --- | --- | --- | --- | --- |
| Root path and intention | ask | required | Set up, Study | [promotion-contract.md](references/promotion-contract.md) → **Resolve promotions root** finds a root for the request's app | Ask for the folder (default `promotions/`) and the app it promotes (one short phrase); missing or empty → use it, else ask for another path; recorded as the root's location and its `intention` |
| Root marker | static | required | Set up, Study | `<promotions-root>/index.md` carries [promotion-contract.md](references/promotion-contract.md) → **Author signature** | Write `index.md` from [`assets/index.md`](assets/index.md) with `intention` |
| Git ignores | auto | required | Set up, Study, Make or change a promotion | `<promotions-root>/.gitignore` holds every rule in [`assets/promotions.gitignore`](assets/promotions.gitignore) | Add the missing rules to `<promotions-root>/.gitignore` (create when missing) |
| Web search and fetch | user | required | Study | The harness offers web search and page fetch tools | Run in a harness with web access, such as Claude Code |
| Subagents | user | optional | Make or change a promotion | The harness offers a subagent tool | Run in a harness with subagents, such as Claude Code; without one, the main agent runs G1 from the beat sheet's lines and captions alone |
| Node.js 22+ | user | required | Make or change a promotion | `node --version` reports 22 or later | https://nodejs.org |
| ffmpeg | user | required | Make or change a promotion | `ffmpeg -version` succeeds | https://ffmpeg.org/download.html |
| [hyperframes](https://github.com/heygen-com/hyperframes/tree/main/skills/hyperframes), [hyperframes-registry](https://github.com/heygen-com/hyperframes/tree/main/skills/hyperframes-registry), [media-use](https://github.com/heygen-com/hyperframes/tree/main/skills/media-use) | user | required | Make or change a promotion | Each found per [promotion-contract.md](references/promotion-contract.md) → **Discover dependency skill** | `npx hyperframes skills update` |
| [text-to-speech](https://github.com/elevenlabs/skills/tree/main/text-to-speech), [setup-api-key](https://github.com/elevenlabs/skills/tree/main/setup-api-key) | user | optional | Make or change a promotion | Each found per [promotion-contract.md](references/promotion-contract.md) → **Discover dependency skill** | `npx skills add elevenlabs/skills --skill text-to-speech --skill setup-api-key`; needed for a voiced promotion |
| [sound-effects](https://github.com/elevenlabs/skills/tree/main/sound-effects) | user | optional | Make or change a promotion | Found per [promotion-contract.md](references/promotion-contract.md) → **Discover dependency skill** | `npx skills add elevenlabs/skills --skill sound-effects` |
| `.env` ignored | auto | required | Make or change a promotion | Root `.gitignore` lists `.env` | Add `.env` to root `.gitignore` (create when missing) |
| ElevenLabs API key | user | optional | Make or change a promotion | `set -a; . "$env"; set +a; npx -y @elevenlabs/cli@latest onboard check` reports the key works, `$env` per [promotion-contract.md](references/promotion-contract.md) → **Secrets** | Starter plan or higher, for its commercial licence (https://elevenlabs.io/pricing). Create a key at https://elevenlabs.io/app/settings/api-keys and paste it after `ELEVENLABS_API_KEY=` in the main worktree's `.env` yourself, never in chat; a rejected key → setup-api-key, keeping the key in that `.env`; needed for a voiced promotion |
| Sound bank | auto | required | Make or change a promotion | `~/.awesome-skills/building-promotion/media/` holds `sfx/` and `music/` | `mkdir -p ~/.awesome-skills/building-promotion/media/{sfx,music}`; layout per [promotion-contract.md](references/promotion-contract.md) → **Sound bank** |

## Workflow

1. **Setup** — for each **Setup** row whose When covers the request, in order: Done when holds → skip; `user` → stop and print its How when required, continue without it when optional; `ask` → fill what the request answers, ask the rest together in one message, record each answer; `auto` and `static` → run.
2. **Contract** — read [promotion-contract.md](references/promotion-contract.md).
3. **Recipe** — match one **Recipes** row; open every doc in its Read column.

- Makes no paid call before the user approves its cost table, and never retries one without asking.

## Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Set up | "Set up building-promotion", "Is building-promotion ready?" | **Setup** — run Workflow step 1 for every row, then report each row's state |
| Study | "/building-promotion study `mockups/clinic-booking/`, promoting that we can build it for you", "/building-promotion study the app in this repo", "re-study the audience" | [studying-product.md](references/studying-product.md) |
| Make or change a promotion | "Make a promotion for it", "more concepts, warmer", "make it 20 s", "try a PAS", "use this track", "change the hook line", "re-voice line 3", "render the 4:5 cut", a reference to `@promotions/01-one-photo/promotion.md` | [creating-promotion.md](references/creating-promotion.md), [choosing-structure.md](references/choosing-structure.md), [writing-script.md](references/writing-script.md), [choosing-style.md](references/choosing-style.md), [directing-picture.md](references/directing-picture.md), [directing-sound.md](references/directing-sound.md), [directing-voice.md](references/directing-voice.md), [checking-promotion.md](references/checking-promotion.md) |
