# Marketing Contract

## Overview

Shared rules for every `running-marketing` recipe: the marketing root and its files, campaign ids and states, how requests route, outbox items and the approval gate, sending caps, the UTM and link standard, and discovery of the assets skill.

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
  brand/                           # brand kit, written by building-marketing-assets
  segments/<slug>.md               # one per segment, reused across campaigns
  assets/                          # building-marketing-assets root; campaigns list asset ids
  measurement/                     # Worker + D1 project from ../assets/measurement/
  campaigns/NN-slug/
    campaign.md                    # living file: state + one section per phase
    prospects.csv                  # named audience (direct types)
    links.md                       # link id → full UTM URL
    outbox/NNN-<channel>-<who>.md  # one message or post
    results.md                     # written at Conclusion
```

Templates: [`../assets/index.md`](../assets/index.md), [`../assets/positioning.md`](../assets/positioning.md), [`../assets/segment.md`](../assets/segment.md), [`../assets/campaign.md`](../assets/campaign.md), [`../assets/outbox-item.md`](../assets/outbox-item.md), [`../assets/results.md`](../assets/results.md).

Campaign id `NN-slug`: `NN` = highest existing + 1, two digits; slug names segment and market (`03-clinics-mm`).

### Resolve marketing root

Search the repository for `index.md` with frontmatter `doc_type: marketing-index`, `generated_by: running-marketing`, and `author` = **Author signature**.

| Matches | Action |
| --- | --- |
| One | Use it |
| Several | Ask which (list each `index.md` path) |
| None, on start campaign or set up measurement | **Initialize marketing root** |
| None, other intents | Stop and report that no marketing root exists |

Resolve a campaign by `@`-path, id (`03-clinics-mm`), number (`campaign 3`), or name words against `index.md` rows; several matches → ask.

### Initialize marketing root

1. Target = user-named folder, else `marketing/`.
2. Target missing, empty, or holding only `assets/` and `brand/` → use it. Otherwise ask for another path.
3. Write `index.md` from [`../assets/index.md`](../assets/index.md).

### campaign.md

| Field | Value |
| --- | --- |
| `doc_type` / `generated_by` / `author` | `marketing-campaign` / `running-marketing` / **Author signature** |
| `id`, `name` | `NN-slug`, human name |
| `state` | Per **States** |
| `segment` | Segment slug |
| `types` | Rows of [marketing-types.md](./marketing-types.md) (`outbound`, `content`, …) |
| `conversion` | The one named event this campaign counts (`signup`) |
| `goal` | The count that makes it worth repeating (`10 signups`) |
| `start`, `end` | Dates; `start` = first send |
| `end_condition` | Optional (`all 60 prospects reached 3 touches`) |
| `follows` | The campaign whose conclusion fed this idea, or `none` |
| `assets` | Asset ids from the assets root (`07-clinic-reel`) |

Body sections: **Idea**, **Target**, **Roll-out**, **Assets**, **Execution**, **Conclusion**. Each phase writes only its own section. Mirror `id`, `name`, `segment`, `state`, `start`, `end` into the `index.md` row on every change.

### States

A phase sets `state` to its own name when its output is ready and stops for review. The user's next "continue" approves it; a change request reruns that phase in place.

| State | Set by | Next on "continue" |
| --- | --- | --- |
| `ideation` | [analyzing-product.md](./analyzing-product.md) | [targeting-audience.md](./targeting-audience.md) |
| `targeting` | [targeting-audience.md](./targeting-audience.md) | [planning-rollout.md](./planning-rollout.md) |
| `rollout` | [planning-rollout.md](./planning-rollout.md) | [creating-assets.md](./creating-assets.md) |
| `assets` | [creating-assets.md](./creating-assets.md) | Pending visual asset → [creating-assets.md](./creating-assets.md); else [executing-campaign.md](./executing-campaign.md) |
| `live` | First sent item | [executing-campaign.md](./executing-campaign.md) (next batch) |
| `ended` | End date, end condition, or "end campaign" | Offer measure or conclude |
| `concluded` | [concluding-campaign.md](./concluding-campaign.md) | — |
| `dropped` | "Drop campaign", only before `live` | — |

`concluded` and `dropped` campaigns are never edited; a new campaign names them in `follows`. Measurement is a report, not a state.

### Outbox items

One file per message or post: `outbox/NNN-<channel>-<who>.md` from [`../assets/outbox-item.md`](../assets/outbox-item.md). Item code `oNNN`.

| Status | Meaning |
| --- | --- |
| `draft` | Written, waiting for approval |
| `approved` | The user approved its batch |
| `sent` | Sent or posted; `sent_at` set |
| `replied` | The person replied; no further touches |
| `skipped` | Removed by the user |

Nothing is sent or posted before its batch is `approved`.

### Sending caps

- Cold email goes from a warmed subdomain (`mail.<domain>` through Resend), never the main domain.
- ≤ 30 cold emails a day per sending domain.
- Every cold email ends with an opt-out line; an opt-out → `replied` with note `opted out`.
- ≤ 3 touches per prospect; touches stop at the first reply.
- DMs to strangers (LinkedIn, Messenger, Instagram) and group posts stay drafts the user sends by hand.

### Links and UTMs

Every link to the product goes through the measurement Worker: `https://go.<domain>/<link-id>`.

| UTM | Value |
| --- | --- |
| `utm_campaign` | Campaign id (`03-clinics-mm`) |
| `utm_medium` | Marketing type (`outbound`) |
| `utm_source` | Platform (`email`, `tiktok`, `linkedin`) |
| `utm_content` | Asset code (`a07`) for broadcast, outbox item code (`o014`) for direct messages |

Link id = campaign `NN` + `utm_content` (`03o014`, `03a07`); one per asset per platform adds the source (`03a07tt`). `links.md` holds one row per link: link id, `utm_content`, medium, source, destination, short URL. App installs link straight to the store listing; the redirect click is the count.

### Discover dependency skill

Locate `building-marketing-assets` (`id` `74d80a4e-2346-43f7-b06a-43febe401281`):

1. Explicit pointers — `AGENTS.md`, the user request, `@`-mentioned skills.
2. Project roots — glob `<root>/building-marketing-assets/SKILL.md` (`.agents/skills/`, `.cursor/skills/`, `.claude/skills/`, `.codex/skills/`, `.github/skills/`, and the other agent skill directories).
3. User-level roots — same layout under `~/`. Prefer a project copy over a user copy.
4. Custom roots named in `AGENTS.md` or by the user.
5. Read each candidate's frontmatter: accept `name` + `id`; a different `id` → skip.

Found → open its `SKILL.md` and follow its recipes by intent name. Missing → continue text-only and print: `npx skills add cedmandocdoc/awesome-skills --skill building-marketing-assets` (https://github.com/cedmandocdoc/awesome-skills/tree/main/skills/building-marketing-assets).
