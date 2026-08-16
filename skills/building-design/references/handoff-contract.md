# Handoff Contract

## Overview

Shared rules for static design handoff. [creating-design-prompts.md](creating-design-prompts.md) and [creating-design-previews.md](creating-design-previews.md) both follow this contract. Neither renderer is the source of truth for the other.

## Guidelines

### Sources of truth

| Source | Owns |
| --- | --- |
| `design.md` | Visual tokens — colors, type, spacing, radius, elevation, components |
| PRD / FRD, user stories, UI specs | Screens, flows, roles, copy, states, chrome, in/out of scope |

Prompts under `prompts/<task>/` and HTML under `previews/<task>/` are optional projections of those sources. Generate either without the other. When a prompt folder exists, a preview recipe may use it as a hint; specs win on conflict.

Invent neither screens, flows, roles, features, nor copy. Unspecified copy is `[COPY TBD]`.

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

Infer platform from specs; confirm when ambiguous.

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

### Gate and gather

1. Confirm `design.md` exists (default `design/design.md`). If not, offer [creating-design.md](creating-design.md) and stop.
2. Assess PRD/FRD, user story, UI specs. When thin, ask in this order and wait unless the user provides everything at once:

| Gap | Ask |
| --- | --- |
| Product / feature | What product or feature? What should it do? In vs out of scope? Hard requirements / acceptance criteria? |
| Roles | Roles? Goals per role? Behavior differences (screens, actions, visibility)? Permission / gating rules? |
| UI / platform | Screens, flows, states in scope? **Platform:** desktop/web or mobile-only? Layout chrome (auth vs app nav)? Reference products for layout inspiration (not visual copy)? |

Visual decisions come from `design.md`. Structural decisions come from the specs.

### Chrome and components

Derive from specs and `design.md` — do not invent a parallel inventory.

| Derive | From |
| --- | --- |
| Shells (auth / app / modal) | UI specs layout; same chrome on every frame that uses that shell |
| Component names | `design.md` YAML `components:` plus UI spec control names (`Button/Primary`) |
| States to frame | Distinct UI spec view states — extra frames, not toggles |

## Related

- [creating-design.md](creating-design.md) — `design.md` tokens
- [creating-design-prompts.md](creating-design-prompts.md) — third-party paste prompts
- [creating-design-previews.md](creating-design-previews.md) — HTML screen boards
