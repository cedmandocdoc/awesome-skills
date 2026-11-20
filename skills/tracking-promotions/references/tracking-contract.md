# Tracking Contract

## Overview

Shared rules for every `tracking-promotions` recipe: the tracking root and its config, the promotions it reads, the two tables in D1, the statuses, the freeze, and the commands.

## Guidelines

### Author signature

Static UUID identifying files created by this skill:

```text
eb59f31b-fd99-476e-af15-8d0690701ab6
```

Every `<tracking-root>/index.md` carries this value in frontmatter `author`.

### Output layout

```text
<tracking-root>/     # default: tracking/
  index.md           # root marker and config
```

The root holds config only. Every record lives in the D1 database it names. Template: [`../assets/index.md`](../assets/index.md).

### Resolve tracking root

Search the repository for `index.md` with frontmatter `doc_type: tracking-index`, `generated_by: tracking-promotions`, and `author` = **Author signature**.

| Matches | Action |
| --- | --- |
| One | Use it |
| Several | Ask which (list each `index.md` path) |
| None, on Set up or Record | `SKILL.md` → **Setup** creates one |
| None, other intents | Stop and report that no tracking root exists |

### index.md fields

| Field | Holds | Written by |
| --- | --- | --- |
| `database` | The D1 database's name | `SKILL.md` → **Setup** |
| `account_id` | The Cloudflare account that holds it | `SKILL.md` → **Setup** |
| `board_brand` | The name in the board's header, or `none` | `SKILL.md` → **Setup** (Board look) |
| `board_theme` | Stylesheets, repository paths in load order, that dress the board, or `none`. Each overrides the board's tokens and classes by name: `--color-background`, `--color-foreground`, `--color-ink-2`, `--color-muted`, `--color-muted-foreground`, `--color-border`, `--color-input`, `--color-ring`, `--color-accent`, `--color-accent-text`, `--color-invert-*`, `--font-display`, `--font-body`, `--font-mono`, `--rounded-radius-*`, `.text-*`, `.glass` | `SKILL.md` → **Setup** (Board look) |
| `board_public` | The folder that absolute `url()`s in those stylesheets resolve against (fonts, images), or `none` | `SKILL.md` → **Setup** (Board look) |
| `board_logo` | An image beside the brand name and as the tab icon, or `none` | `SKILL.md` → **Setup** (Board look) |

### Resolve promotions roots

The input, read and never written. Search the repository for every `index.md` with frontmatter `doc_type: promotions-index` and `generated_by: building-promotion` (building-promotion's root marker).

| Part | Read as |
| --- | --- |
| Promotion | Each `NN-slug/` folder in a root with a `promotion.md` |
| Id | `<root folder>/<NN-slug>` (`crew-payroll/01-pas-cutoff-na-naman`) |
| Format | `promotion.md` frontmatter `format`; without it, `still` when the folder has `frames/`, else `video` |
| Message | The `## Message plan` section of `promotion.md`, shown as is |
| Assets | Its outputs in `renders/`: images (a JPEG over the PNG of the same frame), videos, and `renders/thumbs/` for thumbnails. A folder without them is "not rendered"; this skill never renders |

### Deliveries

A delivery is one time a promotion goes out, approved by the user. One row each in `deliveries`:

| Field | Holds |
| --- | --- |
| `id` | Given when recorded |
| `promotion` | The promotion's id |
| `kind` | `post` (public, on a channel) or `message` (one-to-one, to one target) |
| `channel` | Where it goes: `facebook`, `instagram`, `email`, … |
| `format` | A post's shape: `post`, `reel`, `story`, `carousel` |
| `label` | The caller's own name for this kind of delivery (`intro`, `follow-up`, `repost`) |
| `assets` | The promotion's files it carries, as paths inside its folder (`renders/01-4x5.jpg`) |
| `fill` | For an image that went out with its placeholders filled: `{"<placeholder>": "<value>"}`. The board shows the promotion's own render beside it |
| `target`, `target_name`, `ref` | Where it goes (an address, a page), the name to show, and the caller's own id for the target; this skill reads none of them |
| `subject`, `text` | A message's subject; the caption or the body exactly as it goes out |
| `batch` | A group the caller names (an email batch, a posting plan) |
| `status`, `link`, `error`, `note` | Per **Statuses**; the scheduler's post link or the message id; why it failed; a note |
| Times | `approved_at` (when recorded), `planned_for`, `scheduled_at`, `sent_at`, `failed_at`, `answered_at`, `cancelled_at` |

`promotions` holds one row per frozen promotion: `id`, `fingerprint`, `frozen_at`, `note`.

### Statuses

Each row keeps its latest status and the time of each step; there is no event log.

| Status | Means | Follows |
| --- | --- | --- |
| `approved` | The user approved it; it hasn't gone out | — (new) |
| `scheduled` | Queued with a scheduler | `approved`, or new |
| `sent` | Went out | `approved`, `scheduled`, or new |
| `failed` | Sending or scheduling failed; `error` says why | `approved`, `scheduled` |
| `replied`, `bounced`, `stopped` | What came back to a sent message (`stopped`: asked for no more) | `sent`; `stopped` also `replied` |
| `cancelled` | Won't go out | `approved`, `scheduled`, `failed` |

`scheduled` takes the time it is planned to go out as `planned_for`. A scheduled post shows as posted on the board once `planned_for` has passed; nothing syncs with the scheduler. A scheduled message shows as scheduled until whatever sends it records `sent` or `failed` (sending-messages' Worker writes these two on `deliveries` directly, from `scheduled` only, per the same rules).

### Freeze

- A promotion freezes at its first delivery: `promotions` gets its fingerprint and the time.
- Every later delivery of it checks the source against that fingerprint. A mismatch refuses the record: restore the source, or make the change in a new promotion folder.
- The fingerprint is a SHA-256 over every file of the folder (its path, then its bytes, sorted by path), leaving out `promotion.md`, `renders/`, `snapshots/`, `node_modules/` and every dot entry.
- On the board, a promotion is `live` (no delivery yet), `ok`, `changed`, or `missing` (frozen, its folder gone).

### Commands

Run from the repository: `node <skill>/scripts/track.mjs <command>`. JSON on stdout; an error goes to stderr with exit code 1.

| Command | Does |
| --- | --- |
| `setup` | Creates the database when the account lacks it, then its tables |
| `check` | Exits 0 when the database answers with both tables |
| `record [--file <json>\|-]` | Records deliveries from a JSON array or object (stdin by default), per [creating-delivery.md](./creating-delivery.md); writes nothing when any item is invalid |
| `update --id <n> --status <s> [--link …] [--error …] [--note …] [--planned-for <ISO time>]`, or `update --file <json>\|-` | Changes statuses per **Statuses**, per [updating-delivery.md](./updating-delivery.md); applies every change it can and lists the rest |
| `list [--kind] [--channel] [--status] [--batch] [--label] [--ref a,b] [--promotion]` | Deliveries as JSON, each filter a value or a comma list |
| `promotions` | Every promotion with its state, fingerprint and renders, as JSON |
| `backup [--dir <folder>]` | Exports the database to `<folder>/<database>-<date>.sql` (default `~/.awesome-skills/tracking-promotions/backups/`) |

`node <skill>/scripts/board.mjs [--port 4410]` serves the board, per [opening-board.md](./opening-board.md).

## Setup

`track.mjs setup` reads `database` and `account_id` from `index.md`, runs `wrangler d1 create <database>` when the account has no database of that name, then creates `promotions` and `deliveries` with their indexes. Running it again changes nothing.
