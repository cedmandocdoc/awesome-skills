# Marketing Contract

## Overview

Shared rules for every `building-marketing-campaign` recipe: the marketing root and its files, campaign ids and states, how requests route, outbox items and the approval gate, sending caps, the UTM and link standard, measurement, videos and the HyperFrames handoff, free media, and discovery of HyperFrames.

## Guidelines

### Author signature

Static UUID identifying files created by this skill:

```text
1d31be96-13a6-46cf-b133-cdacf54973cc
```

Every `<marketing-root>/index.md`, `positioning.md`, segment file, `campaign.md`, and outbox item carries this value in frontmatter `author`.

### Output layout

```text
<marketing-root>/                  # default: marketing/
  index.md                         # root marker + one row per campaign
  positioning.md                   # once per product; reviewed quarterly
  segments/<slug>.md               # one per segment, reused across campaigns
  measurement/                     # Worker + D1 project from ../assets/measurement/
  campaigns/NN-slug/
    campaign.md                    # living file: state + one section per phase
    prospects.csv                  # named audience (direct types)
    links.md                       # one full UTM URL per link
    outbox/NNN-<channel>-<who>.md  # one message or post
    results.md                     # written at Conclusion
videos/<project>/                  # HyperFrames projects, at the repo root; never edited by this skill
```

Templates: [`../assets/index.md`](../assets/index.md), [`../assets/positioning.md`](../assets/positioning.md), [`../assets/segment.md`](../assets/segment.md), [`../assets/campaign.md`](../assets/campaign.md), [`../assets/video-request.md`](../assets/video-request.md), [`../assets/outbox-item.md`](../assets/outbox-item.md), [`../assets/results.md`](../assets/results.md).

Campaign id `NN-slug`: `NN` = highest existing + 1, two digits; slug names segment and market (`03-clinics-mm`).

### Resolve marketing root

Search the repository for `index.md` with frontmatter `doc_type: marketing-index`, `generated_by: building-marketing-campaign`, and `author` = **Author signature**.

| Matches | Action |
| --- | --- |
| One | Use it |
| Several | Ask which (list each `index.md` path) |
| None, on start campaign or set up measurement | **Initialize marketing root** |
| None, other intents | Stop and report that no marketing root exists |

Resolve a campaign by `@`-path, id (`03-clinics-mm`), number (`campaign 3`), or name words against `index.md` rows; several matches → ask.

### Initialize marketing root

1. Target = user-named folder, else `marketing/`.
2. Target missing or empty → use it. Otherwise ask for another path.
3. Write `index.md` from [`../assets/index.md`](../assets/index.md).

### campaign.md

| Field | Value |
| --- | --- |
| `doc_type` / `generated_by` / `author` | `marketing-campaign` / `building-marketing-campaign` / **Author signature** |
| `id`, `name` | `NN-slug`, human name |
| `state` | Per **States** |
| `segment` | Segment slug |
| `types` | Rows of [marketing-types.md](./marketing-types.md) (`outbound`, `content`, …) |
| `conversion` | The one named event this campaign counts (`signup`) |
| `goal` | The count that makes it worth repeating (`10 signups`) |
| `start`, `end` | Dates; `start` = first send |
| `end_condition` | Optional (`all 60 prospects reached 3 touches`) |
| `follows` | The campaign whose conclusion fed this idea, or `none` |
| `videos` | Video codes per **Videos** (`[v1, v2]`) |

Body sections: **Idea**, **Target**, **Roll-out**, **Assets**, **Execution**, **Conclusion**. Each phase writes only its own section. Mirror `id`, `name`, `segment`, `state`, `start`, `end` into the `index.md` row on every change.

### States

A phase sets `state` to its own name when its output is ready and stops for review. The user's next "continue" approves it; a change request routes to [updating-campaign.md](./updating-campaign.md).

| State | Set by | Next on "continue" |
| --- | --- | --- |
| `ideation` | [analyzing-product.md](./analyzing-product.md) | [targeting-audience.md](./targeting-audience.md) |
| `targeting` | [targeting-audience.md](./targeting-audience.md) | [planning-rollout.md](./planning-rollout.md) |
| `rollout` | [planning-rollout.md](./planning-rollout.md) | [creating-assets.md](./creating-assets.md) |
| `assets` | [creating-assets.md](./creating-assets.md) | A video not done or a stale section → [creating-assets.md](./creating-assets.md); else [executing-campaign.md](./executing-campaign.md) |
| `live` | First item the user reports sent | [executing-campaign.md](./executing-campaign.md) (next batch) |
| `ended` | End date, end condition, or "end campaign" | Offer a check-in or conclude |
| `concluded` | [concluding-campaign.md](./concluding-campaign.md) | — |
| `dropped` | "Drop campaign", only before `live` | — |

`concluded` and `dropped` campaigns are never edited; a new campaign names them in `follows`. Measurement is a check-in, not a state. Stale marks per [updating-campaign.md](./updating-campaign.md): on "continue", the next phase redoes only its stale parts.

### Outbox items

One file per message or post: `outbox/NNN-<channel>-<who>.md` from [`../assets/outbox-item.md`](../assets/outbox-item.md). Item code `oNNN`. The skill sends and posts nothing; the user sends each `approved` item by hand and reports it.

| Status | Meaning |
| --- | --- |
| `draft` | Written, waiting for approval |
| `stale` | A change reached it; redrafted before approval |
| `approved` | The user approved its batch |
| `sent` | The user sent or posted it; `sent_at` set |
| `replied` | The person replied; no further touches |
| `skipped` | Removed by the user |

Only `approved` items go out.

### Sending caps

- Cold email goes from a warmed subdomain (`mail.<domain>`), never the main domain.
- ≤ 30 cold emails a day per sending domain.
- Every cold email ends with an opt-out line; an opt-out → `replied` with note `opted out`.
- ≤ 3 touches per prospect; touches stop at the first reply.
- Messages to strangers (LinkedIn, Messenger, Instagram DMs) and group posts are never automated; platform automation gets accounts restricted.

### Links and UTMs

Every link to the product is a plain URL with four UTMs; no redirect or short link.

| UTM | Value |
| --- | --- |
| `utm_campaign` | Campaign id (`03-clinics-mm`) |
| `utm_medium` | Marketing type (`outbound`, `community`) |
| `utm_source` | Platform (`email`, `facebook`, `tiktok`) |
| `utm_content` | Video code (`v2`) for a video post; outbox item code (`o014`) for every other item |

Medium and source are separate: one platform carries several types (a Facebook page post is `content`, a group post `community`, a DM `outbound`), and one type uses several platforms. `links.md` holds one row per link: `utm_content`, medium, source, destination, full URL; a video posted on several platforms has one row per platform. App installs link to a web page that runs the snippet; a store listing can't be counted.

### Measurement

The Worker writes one D1 table, `events`, with two kinds of row:

| Event | Recorded when | Role |
| --- | --- | --- |
| `landing` | A page load whose UTMs differ from the visitor's `mk` cookie | Diagnosis: did the link bring people |
| The campaign's `conversion` (`signup`) | The app confirms the event; once per visitor per event | Verdict: conversions ≥ `goal` |

- **Visitor**: a random id the snippet creates on the first page load with `utm_campaign` and no `mk` cookie. It stands for one browser for 30 days (7 on Safari), never a person; another device, browser, or incognito window is a new visitor.
- **Last campaign touch**: UTMs that differ from the cookie in any field overwrite it, keep the visitor id, restart the 30 days, and record a landing; the same UTMs or none change nothing. A conversion takes the cookie's UTMs when it fires.
- **Stored**: visitor id, event, the four UTMs, time. No IP, user agent, name, or email.
- **Never tracked**: page loads without UTMs, element clicks, scrolling, time on page, sessions, funnels, retention, revenue, devices, identity, dashboards. A need for any of these goes to PostHog instead of the Worker (https://posthog.com/docs/data-warehouse/run-sql-mcp).
- **Fake rows**: `POST /e` is public, since every visitor's browser calls it. Only the user's Cloudflare account can read D1 or change the Worker, but anyone can post fake landings or conversions; the origin check stops other sites, not scripts. Ad blockers can also drop calls, which only undercounts. Conclusion checks conversions against the app's own count of the event; abuse → a Cloudflare rate-limiting rule.
- **Where people stop**: no landings → channel or message; landings without conversions → the landing or the offer; replies without conversions → proof or trigger.
- **Our report decides**: GA or other analytics on the product see the same UTMs but count differently (last non-direct click, sessions, modeled data); say so when the user compares.

### Videos

HyperFrames makes every video; this skill hands it a request and reads the result back.

| Owner | Owns |
| --- | --- |
| This skill | What to say: segment, pain in their words, message, proof, CTA and link, channel; all text; video codes and links |
| HyperFrames | How it looks: concept (its pitch round), look, storyboard, motion, music placement, render; its own approvals of plan, sketches, and render |

- **Codes** are campaign-local: `v1`, `v2`, … in request order. A change to an already posted video gets the next code; a video reused from another campaign gets this campaign's own code.
- **Request** per [`../assets/video-request.md`](../assets/video-request.md): facts only, never a concept, a look, or a scene; the message is locked from Ideation. Saved under **Assets** → **Video requests** before the handoff.
- **Handoff** runs in the main chat: invoke `/hyperframes` with the request and let it talk to the user for as many turns as it needs. Relay nothing and answer none of its creative questions for the user.
- **Return**: the request's last line, "When the render is done, continue `@<marketing-root>/campaigns/<id>/campaign.md`", reloads this skill by its file clause.
- **Project**: HyperFrames writes `videos/<project>/` (suggested name `<campaign-id>-vN`) and its `BRIEF.md` from the request. This skill never writes `BRIEF.md` or anything inside a project; a change to a video goes back to `/hyperframes` per [updating-campaign.md](./updating-campaign.md).
- **Link, never copy**: **Assets** → **Videos** and each post outbox item link the project and its `renders/video.mp4`.

Video state is read from disk, never stored in `campaign.md`. Find the project by the campaign id and video code in `videos/*/BRIEF.md`:

| On disk | Meaning | Do |
| --- | --- | --- |
| No project | Requested | Invoke `/hyperframes` with the saved request |
| `BRIEF.md` or `STORYBOARD.md`, no `renders/video.mp4` | In progress | Invoke `/hyperframes` naming the project; it resumes from its files |
| `renders/video.mp4` | Approved (HyperFrames renders only after approval) | [creating-assets.md](./creating-assets.md) step 5 |

A video is done when its render is linked, its links are in `links.md`, and its post outbox item exists.

### Free media

Every asset is free for commercial use. Media from HeyGen's services (catalog music, sound-effect and image search, TTS, avatars) is ruled out: free-plan output is for personal, non-commercial use only (https://www.heygen.com/terms).

| Ingredient | Source |
| --- | --- |
| Product visuals | `npx hyperframes capture <url>` of the live site |
| Logged-in or app-only screens | Screen recordings or screenshots the user provides; capture can't sign in or open a mobile app |
| Brand | Captured from the site, or the repo's `design.md`, logo files, and fonts |
| Music | A Pixabay track the user downloads, or the user's own; never HeyGen's catalog or the local MusicGen |
| Sound effects | HyperFrames' bundled set (Pixabay Content License) |
| Voiceover | Local Kokoro (`npx hyperframes tts`), or none |
| Registry blocks | Check a block's own third-party license before using it in an ad |

### Discover dependency skill

Locate `hyperframes` (third-party; match by `name`):

1. Explicit pointers — `AGENTS.md`, the user request, `@`-mentioned skills.
2. Project roots — glob `<root>/hyperframes/SKILL.md` (`.agents/skills/`, `.cursor/skills/`, `.claude/skills/`, `.codex/skills/`, `.github/skills/`, and the other agent skill directories).
3. User-level roots — same layout under `~/`. Prefer a project copy over a user copy.
4. Custom roots named in `AGENTS.md` or by the user.

Found → invoke it as `/hyperframes`. Missing → print `npx hyperframes skills update` (https://github.com/heygen-com/hyperframes/tree/main/skills) and offer to replace each planned video with a text post.
