# Handoff Contract

## Overview

Shared rules for static design handoff. [creating-design-prompts.md](creating-design-prompts.md) and [creating-design-previews.md](creating-design-previews.md) both follow this contract. Neither renderer is the source of truth for the other.

## Guidelines

### Inputs

Prompt and preview recipes fill this table. `design.md` is an artifact this skill owns. Other rows are facts from the user prompt.

| Need | Required | Enough when |
| --- | --- | --- |
| Visual system | yes | `design.md` exists (default `design/design.md`) |
| Screen list | yes | Named screens in this task |
| Screen content | yes | Layout, fields, CTAs, copy or `[COPY TBD]` |
| Screen states | yes | Distinct visual states per screen (idle, empty, error, …) |
| Platform | yes | Desktop/web or mobile-only |
| Scope | yes | In vs out |
| Roles | if UI differs | Who sees which screens / variants |
| Chrome | if shells are shared | Which screens share auth vs app nav |

Fill from the user prompt (including files they attached). When a prompt folder exists, a preview recipe may use it as a hint; filled Inputs win on conflict.

Invent neither screens, flows, roles, features, nor copy. Unspecified copy is `[COPY TBD]`.

### Fill inputs

1. Confirm `design.md` exists (default `design/design.md`). If not, offer [creating-design.md](creating-design.md) and stop.
2. Collect **Inputs** from the user prompt.
3. Ask for every empty **yes** row. Wait unless the user provided everything at once.
4. Skip Roles or Chrome asks when the UI does not split by role and screens do not share shells.

When both prompt and preview recipes run this turn, run steps 1–4 once. Each recipe then confirms its own paths and writes.

Visual decisions come from `design.md`. Structural decisions come from filled Inputs.

### Handoff deliverable

Static screen board — not a working app, prototype, or routed product.

- One labeled **frame** per screen × viewport, plus one frame per distinct state (idle, loading, empty, error, …)
- Chrome is drawn **inside** each frame; keep it identical per shell
- Controls are visual only — no routing, live validation, or APIs
- CSS `:hover` / `:focus` is allowed
- Light-first (YAML mode). Add dark frames only when `design.md` defines dark and the user asks

### Viewport matrix

| Platform type | Frames per screen (and per state) | Default sizes |
| --- | --- | --- |
| Desktop / web | Desktop, tablet, mobile | 1440×900 · 768×1024 · 390×844 |
| Mobile-only | Mobile portrait only | 390×844 |

Infer platform from Inputs; confirm when ambiguous.

### Paths

Confirm with the user unless already given. `<task>` is a kebab-case slug (`mvp`, `auth-login`, `checkout-v2`) — do not number the folder.

| Path | Default |
| --- | --- |
| Visual system | `design/design.md` |
| Prompt task folder | `design/prompts/<task>/` |
| Preview task folder | `design/previews/<task>/` |

Use the same `<task>` slug when both renderers exist for one slice. A one-screen task still uses a folder.

```text
design/
├── design.md
├── prompts/
│   └── <task>/
│       ├── README.md
│       └── 01-….md …
└── previews/
    └── <task>/
        └── <screen>.html …     # login.html, home.html — not numbered
```

### Chrome and components

Derive from Inputs and `design.md` — do not invent a parallel inventory.

| Derive | From |
| --- | --- |
| Shells (auth / app / modal) | Chrome input; same chrome on every frame that uses that shell |
| Component names | `design.md` YAML `components:` plus control names in Screen content |
| States to frame | Screen states — extra frames, not toggles |

## Related

- [creating-design.md](creating-design.md) — `design.md` tokens
- [creating-design-prompts.md](creating-design-prompts.md) — third-party paste prompts
- [creating-design-previews.md](creating-design-previews.md) — HTML screen boards
