# Sending Contract

## Overview

Shared rules for every `sending-messages` recipe: the sending root and its config, the outbox, how send times are planned, what the Worker does, the optional link to tracking-promotions, and the commands.

## Guidelines

### Author signature

Static UUID identifying files created by this skill:

```text
e174974e-3680-4d3d-b926-27cf069d9f5f
```

Every `<sending-root>/index.md` carries this value in frontmatter `author`.

### Output layout

```text
<sending-root>/     # default: sending/
  index.md          # root marker and config
```

The root holds config only. Messages live in the D1 outbox, attachments in KV until sent. Template: [`../assets/index.md`](../assets/index.md).

### Resolve sending root

Search the repository for `index.md` with frontmatter `doc_type: sending-index`, `generated_by: sending-messages`, and `author` = **Author signature**.

| Matches | Action |
| --- | --- |
| One | Use it |
| Several | Ask which (list each `index.md` path) |
| None, on Set up | `SKILL.md` → **Setup** creates one |
| None, other intents | Stop and report that no sending root exists |

### index.md fields

| Field | Required | Holds |
| --- | --- | --- |
| `account_id` | yes | The Cloudflare account for the database, namespace and Worker |
| `database` | yes | The outbox's D1 database name (default `sending-messages`) |
| `kv_id` | — | The attachments' KV namespace; written by `outbox.mjs setup` |
| `worker` | yes | The Worker's name (default `sending-messages`) |
| `from` | yes | The sender, `Name <address>` |
| `smtp_host`, `smtp_port` | yes | The SMTP server; port 465 is TLS from the start, any other uses STARTTLS (never 25) |
| `env_file`, `smtp_user_var`, `smtp_pass_var` | — | The env file (relative to the main checkout) and the two variables `outbox.mjs secrets` reads the SMTP login from |
| `list_unsubscribe` | — | A `mailto:` or URL for the List-Unsubscribe header, or `none` |
| `timezone` | yes | An IANA zone (`Asia/Manila`) the window and `--start` are read in |
| `days`, `hours` | yes | The send window: day names (`mon-sat`, `mon,wed,fri`) and hours (`9-17`: from 9:00, before 17:00) |
| `daily_cap` | yes | Most messages sent on one local day, counting every batch |
| `gap_minutes` | yes | The random gap between two messages (`3-8`) |
| `tracking_database` | — | tracking-promotions' D1 database (same account), or `none` |

A change to any field but `kv_id` and the env fields takes effect after `outbox.mjs deploy`.

### Outbox

One row per message in `outbox`: `id`, `batch`, `delivery` (a tracking id or null), `to_addr`, `to_name`, `subject`, `text`, `attachments` (KV keys with file name and type), `status`, `send_at`, `queued_at`, `sent_at`, `failed_at`, `cancelled_at`, `message_id`, `error`.

| Status | Means |
| --- | --- |
| `queued` | Waiting for its `send_at` |
| `sent` | Went out; `message_id` is its Message-ID |
| `failed` | The SMTP server refused it; `error` says why. It never retries: a new go queues it again |
| `cancelled` | Withdrawn before it went |
| `skipped` | Its tracking delivery was no longer `scheduled` when it came due (cancelled, or marked elsewhere) |

A message's attachments are deleted from KV once it is sent, failed, cancelled or skipped.

### Planning

- Each message gets a `send_at` from `--start` (default now, rounded up to 5 minutes): the first free minute inside the window on a day still under `daily_cap`, then a random gap from `gap_minutes` to the next.
- Days already holding queued or sent messages count toward their cap, so batches never stack past it.
- The gaps are seeded by the messages and the start, so the plan shown and the plan queued on the go match.

### Worker

Every 5 minutes, inside the window and under the day's cap, it sends up to 2 queued messages whose `send_at` has passed, oldest first, through SMTP with the SMTP login stored as its secrets `SMTP_USER` and `SMTP_PASS`. Plain text, each attachment, a fresh Message-ID, and the List-Unsubscribe header when set. It has no public URL. A message late for any reason goes at the next run inside the window.

### Tracking

With `tracking_database` set, a message may carry `delivery`: a tracking-promotions delivery id of kind `message`.

| Step | Does |
| --- | --- |
| Go (`schedule --yes`) | Refuses unless each delivery is `approved`; once queued, each becomes `scheduled` with `planned_for` = its `send_at`, through tracking-promotions' CLI |
| Due | The Worker sends it only while its delivery is still `scheduled`; else the message is `skipped` |
| Result | The Worker writes `sent` (`link` = Message-ID) or `failed` (`error`) on the delivery directly, only from `scheduled` |
| Cancel | `outbox.mjs cancel` also cancels the delivery; a delivery cancelled in tracking-promotions is skipped when due |

### Discover dependency skill

| Skill | Needed for |
| --- | --- |
| [tracking-promotions](https://github.com/cedmandocdoc/awesome-skills/tree/main/skills/tracking-promotions) `1f308488-2ec0-4a45-aaf5-a9fa2af7d03b` | Messages that carry a delivery id |

1. Explicit pointers — `AGENTS.md`, the user request, `@`-mentioned skills.
2. Project roots — glob `<root>/<skill-name>/SKILL.md` (`.agents/skills/`, `.cursor/skills/`, `.claude/skills/`, `.codex/skills/`, `.github/skills/`, and the other agent skill directories).
3. User-level roots — same layout under `~/` (for example `~/.cursor/skills/`, `~/.agents/skills/`). Prefer a project copy over a user copy of the same `name`.
4. Custom roots named in `AGENTS.md` or by the user.
5. Read each candidate `SKILL.md` frontmatter. This catalog: accept `name` + `id`; a different `id` → skip; deduplicate by `id` (then `name`). A row without `id` (third-party or legacy): accept a unique `name`.

### Commands

Run from the repository: `node <skill>/scripts/outbox.mjs <command>`. JSON on stdout; an error goes to stderr with exit code 1.

| Command | Does |
| --- | --- |
| `setup` | Creates the database and its table, and the KV namespace (writing `kv_id`), when missing; installs and deploys the Worker; reports whether its secrets are set |
| `deploy` | Deploys the Worker again with the current `index.md` |
| `secrets` | Reads the two variables from `env_file` and stores them as the Worker's secrets, printing neither |
| `check` | Exits 0 when the table, `kv_id`, the Worker and both secrets are there |
| `schedule [--file <json>\|-] [--start "YYYY-MM-DD HH:MM"] [--batch <name>] [--yes]` | Plans the messages (a JSON array, stdin by default) and prints the plan; with `--yes`, uploads their attachments and queues them |
| `list [--batch …] [--status …]` | Outbox rows with their local time, without attachments |
| `cancel --ids a,b \| --batch <name>` | Cancels queued messages and their deliveries |

A message: `{ "to", "to_name"?, "subject", "text", "attachments"?: ["<file path>"], "delivery"?: <id>, "batch"? }`. Attachment files are read at the go; the caller may delete them afterwards.

## Setup

`outbox.mjs setup` reads the account, database and Worker name from `index.md`, runs `wrangler d1 create` when the account has no such database, creates `outbox` and its indexes, creates the namespace `<worker>-files` when `kv_id` is `none`, installs the Worker's one dependency (`worker-mailer`) beside it, and deploys it with a 5-minute cron. Running it again changes nothing but the deploy.
