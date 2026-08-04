# Creating Design Prompts

## Overview

**Authoring mode.** Generates a shared application-design prompt folder from PRD/FRD, user stories, UI specs, and an existing `design.md`. The same passes run on Claude Design, Google Stitch, and Figma Make; platform differences live only in README adapters.

Produces screen/flow passes. Chrome rules and component names sit in the README; each pass designs real screens.

## Prerequisites

| Input | Rule |
| --- | --- |
| `design.md` | Complete visual tokens per [creating-design.md](creating-design.md). If missing, stop and offer to create it first |
| PRD or FRD | Scope, requirements, acceptance criteria, feature boundaries |
| User story | Roles, goals, behaviors, permissions |
| UI specs | Flows, screens, states, validation, edge cases, content, layout |

If PRD/FRD, user story, or UI specs are missing or too thin, stop and gather (gap-filling below) before generating. Mark `[COPY TBD]` for content gaps — invent neither flows, roles, nor features.

## Guidelines

### 1. Gate and gather

1. Confirm `design.md` exists (default path `design/design.md`). If not, offer [creating-design.md](creating-design.md) and stop.
2. Assess PRD/FRD, user story, UI specs. When thin, ask in this order and wait for answers unless the user provides everything at once:

| Gap | Ask |
| --- | --- |
| Product / feature | What product or feature? What should it do? In vs out of scope? Hard requirements / acceptance criteria? |
| Roles | Roles? Goals per role? Behavior differences (screens, actions, visibility)? Permission / gating rules? |
| UI / platform | Screens, flows, states in scope? **Platform:** desktop/web or mobile-only? Layout chrome (auth vs app nav)? Reference products for layout inspiration (not visual copy)? |

Visual decisions come from `design.md`. Behavioral and structural decisions go into the README and pass files.

### 2. Confirm delivery and platform

Ask before generating unless the user already gave paths.

| Path | Default |
| --- | --- |
| `design.md` | `design/design.md` |
| Prompt task folder | `design/prompts/<task>/` (`<task>` = kebab-case slug: `mvp`, `checkout-v2`, …) |

Confirm design root (if not `design/`) and task slug. On follow-ups ("add settings screen"), edit the existing task folder unless the user asks for a new path.

| Platform type | Frames per screen | Default sizes |
| --- | --- | --- |
| Desktop / web | Desktop, tablet, mobile | 1440×900 · 768×1024 · 390×844 |
| Mobile-only | Mobile portrait only | 390×844 |

Infer platform from specs; confirm when ambiguous. Record sizes in the README viewport matrix and each pass **Viewport** section.

### 3. Extract and plan passes

Map inputs with the extraction checklist, then plan one pass per major flow or screen group from IA / UI specs only — invent neither screens nor kit-only / empty-shell passes.

| From | Maps to |
| --- | --- |
| PRD/FRD feature scope & boundaries | README → Objective, Product Scope |
| Requirements & acceptance criteria | Pass content, Done checklist |
| In/out of scope | README + every pass Out of scope |
| User story roles / goals / permissions | README → User Roles; pass role notes and gated UI |
| UI flows / screens / routes | README IA; numbered passes |
| Layout chrome | README → Chrome rules |
| Component inventory | README → Component reference (names) |
| Validation, errors, edge cases | Pass Screens / states |
| Copy & content | Pass Content & copy |
| Responsive behavior | README + pass Viewport |
| `design.md` path, Overview, Do's/Don'ts, YAML keys | README visual source; pass design-system reminder and token lines |

Include when specs support them: role-gated UI, interaction notes, live/instrument screens as their own pass when they invert chrome.

### 4. Fill and write

Templates: [`prompts-readme.md`](../assets/prompts-readme.md), [`design-pass.md`](../assets/design-pass.md).

```text
design/
├── design.md
└── prompts/
    └── <task>/
        ├── README.md
        ├── 01-<flow>.md
        └── 02-<flow>.md …
```

| File | Role |
| --- | --- |
| `README.md` | Product scope, roles, IA, chrome rules, component names, platform adapters, pass index |
| `01-*.md` … `NN-*.md` | Numbered screen/flow passes in strict order |

**Filling rules:**

1. Replace every `[...]` placeholder with concrete names from inputs; ship unresolved brackets only as intentional `[COPY TBD]`
2. Passes reference `design.md` token **keys** and short do/don't reminders — not full hex/px tables
3. One major flow or tightly related screen group per pass
4. Chrome rules and component names belong in the README; passes build real screens that apply those rules
5. Each pass lists prior pass IDs it assumes complete
6. List every in-scope screen, sheet, state, and role variant from inputs by name across the pass set
7. README and every pass include out-of-scope bullets from PRD/FRD exclusions
8. Viewport matrix matches platform type (three frames desktop/web; one mobile-only)
9. Keep the three README adapter sections (Claude Design, Google Stitch, Figma Make); adjust only paths and scope wording
10. Use hierarchical component names (`Button/Primary`), screen names, and exact copy from UI specs
11. `design.md` is source of truth for visuals — reference keys, not vague adjectives
12. Every role with distinct behavior gets explicit coverage in the relevant passes
13. Each pass is self-contained for one paste with `design.md` already applied — point tools at the pass, not the PRD
14. Structure output as product screens; Figma Components/Screens showcase only when the user asks for that deliverable

Write README and pass files as plain markdown on disk. In chat, return paths, summary, gaps, and usage only — nested markdown breaks inside fences.

This recipe produces markdown files only — it does not write into Claude Design, Stitch, or Figma.

### 5. Confirm to the user

1. **Paths** — `design.md` and prompt task folder
2. **Summary** — platform type, task slug, pass count
3. **Gaps** — `[COPY TBD]` or missing spec detail
4. **Usage** — open `README.md` → apply `design.md` on the chosen platform → run `01` → `02` → … in order

### Follow-up updates

1. Read the existing folder at the agreed path
2. Add/edit numbered passes; update the README pass-order table
3. If `design.md` changed, confirm the README path and refresh do/don't reminders
4. Overwrite in the same folder unless the user asks for a new path or task slug

## Related

- [creating-design.md](creating-design.md) — prerequisite visual tokens

## Examples

**Missing design.md:** Stop → offer [creating-design.md](creating-design.md) → resume after tokens exist.

**Mobile MVP:** Confirm `design/prompts/mvp/` → README + one pass per in-scope flow; mobile-only viewport matrix.

**Desktop SaaS slice:** Confirm `design/prompts/checkout-v2/` → three viewports; chrome rules in README; passes build checkout screens only.

**Update:** "Add settings screen" → next numbered pass → update README pass-order → overwrite in place.
