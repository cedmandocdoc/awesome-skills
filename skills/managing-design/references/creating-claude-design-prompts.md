# Creating Claude Design Prompts

## Overview

**Authoring mode.** Apply when generating an ordered folder of paste-ready prompts for [Claude Design](https://claude.ai/design) — design system setup, UI kit, layout shells, then feature screens — from PRD/FRD, user stories, UI specs, and an existing style guide.

Produces a **multi-file folder**, not one megaprompt. Claude Design is conversational and design-system-first; phased passes keep each chat turn focused and prevent whole-app invention.

## Prerequisites

**Prerequisites (required before generating):**

1. **Style guide** — complete visual tokens per [creating-style-guide.md](creating-style-guide.md) and [`style-guide.md`](../assets/style-guide.md). If missing, **stop** and ask the user to generate one first via [creating-style-guide.md](creating-style-guide.md). Do not invent tokens or proceed without a style guide.
2. **PRD or FRD** — scope, requirements, acceptance criteria, feature boundaries
3. **User story** — roles, goals, behaviors, permissions
4. **UI specs** — flows, screens, states, validation, edge cases, content, layout

If PRD/FRD, user story, or UI specs are missing or too thin, **stop and gather information** before generating. Mark `[COPY TBD]` for content gaps — never fabricate flows, roles, or features.

## Guidelines

### Gap-filling (when inputs are insufficient)

Ask in this order. Wait for answers before proceeding unless the user provides everything at once.

#### 1. Product or feature expectations

Ask when PRD/FRD is missing or vague:

- What product or feature are we designing?
- What should the application do for the user?
- What is in scope vs out of scope for this Claude Design pass / handoff?
- Any hard requirements or acceptance criteria?

#### 2. User roles and behavior

Ask when user story is missing or vague:

- What are the different user roles in the app?
- What does each role need to accomplish?
- How does behavior differ per role (screens, actions, visibility)?
- Any permission or gating rules?

#### 3. UI specs and platform

Ask when UI specs are missing or vague:

- What screens, flows, and states are in scope?
- **Platform type:** desktop/web application or mobile-only? (Determines viewport matrix — see [Platform and viewports](#platform-and-viewports))
- Layout templates — auth shell, app shell, sidebar vs tabs, modal/sheet patterns
- Reference products for layout inspiration (not visual copy)

Visual decisions come from the **style guide** (prerequisite). Behavioral and structural decisions go into the guide and pass files.

#### 4. Style guide gate

When no style guide exists:

1. Tell the user a style guide is required before a Claude Design handoff.
2. Offer to run [creating-style-guide.md](creating-style-guide.md) first.
3. Do not generate the Claude Design pass folder until tokens, typography, spacing, radius, and elevation are defined.

### Platform and viewports

Infer platform type from PRD/FRD and UI specs. Confirm with the user when ambiguous.

| Platform type | Frames per screen | Default sizes (adjust per spec) |
| --- | --- | --- |
| **Desktop / web application** | Desktop, tablet, mobile | 1440×900 · 768×1024 · 390×844 |
| **Mobile-only application** | Mobile portrait only | 390×844 (e.g. iPhone 14) |

Record the chosen sizes in the guide **Viewport matrix** and each pass **Viewport** section. For desktop/web, every primary screen gets three frames unless UI specs explicitly defer tablet or mobile for a subset.

### Delivery preference

**Ask before generating** (unless the user already specified).

| Option | When to use | Action |
| --- | --- | --- |
| **Default path** (recommended) | Standard project layout | `design/prompts/claude-design/<prompt-slug>/` |
| **Custom path** | User picks location | Write the folder to the user-chosen path |

Default slug: kebab-case from product or feature name (e.g. `skycomms-mobile-mvp`).

Skip the ask only when the user gives an explicit path (e.g. "write to `docs/design/claude/checkout/`").

On follow-up requests ("add settings screen", "update tokens"), **edit the existing folder** at the agreed path — do not create duplicates unless the user asks.

**File and chat delivery:**

- Write the guide and pass files as plain markdown on disk.
- Do not wrap file bodies in chat code fences — nested markdown breaks inside fences.
- In chat, return path, summary, gaps, and usage only — not the full file bodies.

### Workflow

1. **Gate on style guide** — if missing, stop and route to [creating-style-guide.md](creating-style-guide.md).
2. **Assess inputs** — PRD/FRD, user story, UI specs; if insufficient, run gap-filling.
3. **Confirm delivery** — agree on folder path and prompt slug.
4. **Confirm platform type** — desktop/web vs mobile-only; set viewport matrix.
5. **Extract** — map inputs using [Extraction checklist](#extraction-checklist).
6. **Plan pass list** — from IA / UI specs only; typical order: design system → UI kit → shells → one pass per major flow/archetype. Do not invent screens.
7. **Fill templates** — guide from [`claude-design-guide.md`](../assets/claude-design-guide.md); each pass from [`claude-design-pass.md`](../assets/claude-design-pass.md); see [Filling rules](#filling-rules).
8. **Write folder** — save all files at the agreed path.

### What makes Claude Design succeed

Claude Design applies an org/project design system first and works best in phased chat turns. Prioritize these in every handoff:

| Priority | Section / artifact | Why |
| --- | --- | --- |
| 1 | Design system pass (`00`) | Claude Design applies org/project system first |
| 2 | Numbered pass order | Prevents whole-app megaprompts and feature inventing |
| 3 | UI kit before screens | Components reused across passes |
| 4 | Layout shells / duplicate-and-swap rule | Chrome consistency |
| 5 | Per-pass out of scope | Stops invented screens |
| 6 | Final checklist per pass + guide | Self-check before moving to next pass |

**Include when specs support them:** live/instrument screens as their own pass when they invert visual weight or hide chrome; interaction notes when UI specs define behavior; role-gated UI rules.

**Omit or shorten when specs are thin:** motion detail, exhaustive responsive tables for screens that only reflow via breakpoints, duplicate token tables in passes after `00`.

### File contract

Folder of ordered markdown files. Default:

```text
design/prompts/claude-design/<prompt-slug>/
├── README.md              # or 00-guide.md — how to run; pass index
├── 00-design-system.md    # Design systems setup (embedded tokens)
├── 01-ui-kit.md           # component inventory + states
├── 02-shells.md           # auth shell + app chrome
└── 03-….md … NN-….md      # one major flow / archetype per pass
```

| File | Role |
| --- | --- |
| `README.md` (or `00-guide.md`) | How to use in Claude Design; pass order; platform; out of scope summary; list of pass files |
| `00-design-system.md` | Content for Claude Design **Design systems** setup — embed exact tokens from the style guide; do/don't; brand constraints |
| `01-*.md` … `NN-*.md` | Numbered pass prompts in strict order |

**Typical pass order** (adjust from IA / UI specs; do not invent screens):

1. `01-ui-kit.md` — component inventory + states
2. `02-shells.md` — auth shell + app chrome (e.g. tab bar)
3. Then one pass per major flow/archetype (home, library, settings, etc.)

**Critical difference from Figma:** each pass file must be usable alone in one Claude Design chat turn (or sequential message), with instructions to keep the design system from `00` applied. Passes after `01` must say: reuse components from the UI kit; do not redraw chrome.

Templates: [`claude-design-guide.md`](../assets/claude-design-guide.md), [`claude-design-pass.md`](../assets/claude-design-pass.md).

### Filling rules

1. **Replace every `[...]` placeholder** with concrete names from PRD/FRD, user story, and UI specs. Never ship unresolved bracket placeholders except intentional `[COPY TBD]`.
2. **Embed design system in `00` only** — copy exact hex, px, font family, and shadow values from the style guide into `00-design-system.md`. Later passes remind token discipline; they do not re-embed full tables.
3. **One concern per pass** — kit, shells, or one flow/archetype. Never pack the whole app into a single pass file.
4. **Depends-on chain** — each pass lists prior pass IDs it assumes complete.
5. **Reuse rule after kit** — screen and shell passes instruct: use UI kit components; duplicate shells; swap only the main content region.
6. **Coverage** — list every in-scope component, shell, screen, sheet, state, and role variant from inputs by name across the pass set. Expand fully; do not summarize with "repeat for all screens."
7. **Explicit out of scope** — every pass and the guide include out-of-scope bullets from PRD/FRD exclusions.
8. **Viewport matrix** — match platform type. Desktop/web gets three frames per screen; mobile-only gets one.
9. **Be specific** — hierarchical component names (`Button/Primary`, `Input/Text/Error`), screen names, and exact copy from UI specs.

### Extraction checklist

Before filling templates, confirm you have:

| From PRD/FRD | Maps to |
| --- | --- |
| Feature scope & boundaries | Guide → Objective, Product Scope |
| Requirements & acceptance criteria | Pass content, Final Deliverable Checklist |
| In/out of scope | Guide + every pass Out of scope |

| From user story | Maps to |
| --- | --- |
| Roles | Guide → User Roles; pass role notes |
| Goals per role | Pass objectives, navigation |
| Permission rules | Guide role rules; gated UI in relevant passes |

| From UI specs | Maps to |
| --- | --- |
| User flows | Guide → IA / flow map; pass list |
| Screens and routes | Feature passes (`03+`) |
| Layout shells | `02-shells.md` (or equivalent) |
| Component inventory | `01-ui-kit.md` |
| Validation & error states | Kit states + screen pass variants |
| Edge cases | Relevant pass Screens / states |
| Copy & content | Pass Content & copy |
| Responsive behavior | Guide Viewport matrix; pass Viewport |

| From style guide | Maps to |
| --- | --- |
| §1 Visual theme | `00-design-system.md` theme / do-don't |
| §2 Colors | `00` color tokens |
| §3 Typography | `00` typography |
| §4–§6 Spacing & grid | `00` spacing / grid |
| §7 Depth | `00` elevation |
| §8 Radius | `00` radius |
| §9 Breakpoints | Guide viewport matrix; `00` breakpoints |
| Component atoms | `00` recipes + `01` kit inventory |

### Authoring rules

- **Style guide is source of truth for visuals** — embed values in `00`; do not paraphrase tokens into vague adjectives.
- **User story drives role coverage** — every role with distinct behavior gets explicit coverage in the relevant passes.
- **Phased, not monolithic** — folder of ordered passes beats one megaprompt for Claude Design.
- **Self-contained per turn** — each pass works as a single paste with design system already applied; do not tell Claude Design to "see the PRD."

### Confirm to the user

Return in chat:

1. **Path** — absolute or repo-relative path to the folder.
2. **Summary** — one sentence: platform type, pass count (including `00`).
3. **Gaps** — any `[COPY TBD]` or missing spec detail.
4. **Usage** — run `00` (Design systems) → `01` → `02` → … in order in Claude Design.

### Follow-up updates

When the user revises the handoff:

1. Read the existing folder at the agreed path.
2. Apply requested changes — add/edit numbered passes; update the guide pass-order table.
3. If the style guide changed, sync `00-design-system.md` embedded tables.
4. Overwrite files in the same folder unless the user asks for a new path.

Do not write to Claude Design directly; this recipe only produces the markdown folder.

## Related

- [creating-style-guide.md](creating-style-guide.md) — prerequisite visual tokens
- [creating-figma-showcase-prompt.md](creating-figma-showcase-prompt.md) — parallel single-file Figma Make showcase
- [creating-stitch-prompts.md](creating-stitch-prompts.md) — parallel handoff for Google Stitch (`design.md` + `prompt.md`)

## Examples

**Missing style guide:** User asks for a Claude Design prompt but has no tokens. Stop → offer [creating-style-guide.md](creating-style-guide.md) → resume this recipe after style guide exists.

**Mobile MVP:** User shares PRD, user stories, UI specs, and style guide for a mobile-only app. Write `design/prompts/claude-design/<slug>/` with `README` + `00` + kit + shells + one pass per in-scope flow; mobile-only viewport matrix.

**Desktop SaaS:** Same inputs for a web app. Viewport matrix includes desktop, tablet, and mobile. Shell pass includes sidebar chrome.

**Update:** User says "add settings screen." Read existing folder → add next numbered pass → update guide pass-order table → overwrite in place.
