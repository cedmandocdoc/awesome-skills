# Creating Design Prompts

## Overview

**Authoring mode.** Generates a **shared** application-design prompt folder from PRD/FRD, user stories, UI specs, and an existing `design.md`. The same passes work on Claude Design, Google Stitch, and Figma Make. Platform differences live only in the task `README.md` adapters.

Produces screen/flow passes — not a UI-kit or empty-shell generation phase. Chrome rules and component **names** sit in the README; each pass designs real screens.

## Prerequisites

**Required before generating:**

1. **`design.md`** — complete visual tokens per [creating-design.md](creating-design.md). If missing, **stop** and offer to create it first. Do not invent tokens.
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
- What is in scope vs out of scope for this prompt task?
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
- **Platform type:** desktop/web application or mobile-only?
- Layout chrome — auth vs app navigation (sidebar, tabs, header)
- Reference products for layout inspiration (not visual copy)

Visual decisions come from **`design.md`**. Behavioral and structural decisions go into the README and pass files.

#### 4. `design.md` gate

When no `design.md` exists:

1. Tell the user a `design.md` is required before design prompts.
2. Offer to run [creating-design.md](creating-design.md) first.
3. Do not generate the prompt folder until tokens are defined.

### Platform and viewports

Infer platform type from PRD/FRD and UI specs. Confirm with the user when ambiguous.

| Platform type | Frames per screen | Default sizes (adjust per spec) |
| --- | --- | --- |
| **Desktop / web application** | Desktop, tablet, mobile | 1440×900 · 768×1024 · 390×844 |
| **Mobile-only application** | Mobile portrait only | 390×844 (e.g. iPhone 14) |

Record sizes in the README viewport matrix and each pass **Viewport** section.

### Delivery preference

**Always ask before generating** (unless the user already gave an explicit path).

| Path | Default | Notes |
| --- | --- | --- |
| **`design.md`** | `design/design.md` | Created or updated via [creating-design.md](creating-design.md) |
| **Prompt task folder** | `design/prompts/<task>/` | `<task>` = kebab-case slug from intent (`mvp`, `checkout-v2`, `landing-v2`) |

Confirm both the design root (if not using `design/`) and the task slug. Skip the ask only when the user already specified paths (e.g. "write to `docs/design/prompts/checkout-v2/`").

On follow-up requests ("add settings screen", "update checkout prompts"), **edit the existing task folder** — do not create duplicates unless the user asks.

**File and chat delivery:**

- Write README and pass files as plain markdown on disk.
- Do not wrap file bodies in chat code fences — nested markdown breaks inside fences.
- In chat, return paths, summary, gaps, and usage only — not full file bodies.

### Workflow

1. **Gate on `design.md`** — if missing, stop and route to [creating-design.md](creating-design.md). Confirm path (default `design/design.md`).
2. **Assess inputs** — PRD/FRD, user story, UI specs; if insufficient, run gap-filling.
3. **Confirm delivery** — agree on design root and `design/prompts/<task>/` slug.
4. **Confirm platform type** — desktop/web vs mobile-only; set viewport matrix.
5. **Extract** — map inputs using [Extraction checklist](#extraction-checklist).
6. **Plan pass list** — one pass per major flow or screen group from IA / UI specs only. Do not invent screens. Do **not** add kit-only or empty-shell passes.
7. **Fill templates** — README from [`prompts-readme.md`](../assets/prompts-readme.md); each pass from [`design-pass.md`](../assets/design-pass.md); see [Filling rules](#filling-rules).
8. **Write folder** — save all files at the agreed path.

### What makes prompts succeed

| Priority | Artifact | Why |
| --- | --- | --- |
| 1 | `design.md` applied first | Native visual contract on every platform |
| 2 | One flow/screen group per pass | Matches how design AIs generate accurately |
| 3 | README chrome + component names | Consistency without a separate kit/shell phase |
| 4 | Per-pass out of scope | Stops invented screens |
| 5 | Platform adapters in README | Same content; correct run instructions |
| 6 | Numbered pass order | Prevents whole-app megaprompts |

**Include when specs support them:** role-gated UI, interaction notes, live/instrument screens as their own pass when they invert chrome.

**Omit by default:** dedicated UI-kit passes, empty layout-shell passes, Figma Components/Screens showcase structure, embedding full token tables into every pass.

### File contract

```text
design/
├── design.md                      # visual system (creating-design)
└── prompts/
    └── <task>/                    # e.g. mvp, checkout-v2
        ├── README.md              # scope, IA, chrome, adapters
        ├── 01-<flow>.md           # first screen/flow pass
        └── 02-<flow>.md …         # further passes
```

| File | Role |
| --- | --- |
| `README.md` | Product scope, roles, IA, chrome rules, component name inventory, **platform adapters**, pass index |
| `01-*.md` … `NN-*.md` | Numbered screen/flow passes in strict order |

Templates: [`prompts-readme.md`](../assets/prompts-readme.md), [`design-pass.md`](../assets/design-pass.md).

### Filling rules

1. **Replace every `[...]` placeholder** with concrete names from PRD/FRD, user story, and UI specs. Never ship unresolved brackets except intentional `[COPY TBD]`.
2. **Reference `design.md`** — passes use token **keys** and short do/don't reminders. Do not re-embed full hex/px tables in every pass.
3. **One concern per pass** — one major flow or tightly related screen group. Never pack the whole app into a single pass.
4. **No kit/shell-only passes** — chrome rules and component names belong in the README; passes build real screens that apply those rules.
5. **Depends-on chain** — each pass lists prior pass IDs it assumes complete.
6. **Coverage** — list every in-scope screen, sheet, state, and role variant from inputs by name across the pass set. Expand fully; do not summarize with "repeat for all screens."
7. **Explicit out of scope** — README and every pass include out-of-scope bullets from PRD/FRD exclusions.
8. **Viewport matrix** — match platform type. Desktop/web gets three frames per screen; mobile-only gets one.
9. **Platform adapters** — keep the three README adapter sections (Claude Design, Google Stitch, Figma Make). Adjust only paths and scope wording — not the shared pass model.
10. **Be specific** — hierarchical component names (`Button/Primary`, `Input/Text/Error`), screen names, and exact copy from UI specs.

### Extraction checklist

Before filling templates, confirm you have:

| From PRD/FRD | Maps to |
| --- | --- |
| Feature scope & boundaries | README → Objective, Product Scope |
| Requirements & acceptance criteria | Pass content, Done checklist |
| In/out of scope | README + every pass Out of scope |

| From user story | Maps to |
| --- | --- |
| Roles | README → User Roles; pass role notes |
| Goals per role | Pass objectives, navigation |
| Permission rules | README role rules; gated UI in relevant passes |

| From UI specs | Maps to |
| --- | --- |
| User flows | README → IA / flow map; pass list |
| Screens and routes | Numbered passes |
| Layout chrome | README → Chrome rules |
| Component inventory | README → Component reference (names) |
| Validation & error states | Pass Screens / states |
| Edge cases | Relevant pass |
| Copy & content | Pass Content & copy |
| Responsive behavior | README + pass Viewport |

| From design.md | Maps to |
| --- | --- |
| Path | README visual source link |
| Overview + Do's and Don'ts | Pass design-system reminder |
| YAML token keys | Pass token reference lines |

### Authoring rules

- **`design.md` is source of truth for visuals** — reference keys; do not paraphrase into vague adjectives.
- **User story drives role coverage** — every role with distinct behavior gets explicit coverage in the relevant passes.
- **Shared prompts, adapter README** — one pass set for all platforms; platform how-to only in README.
- **Application design, not showcase** — prompts design product screens. Do not structure output as a Figma Components + Screens library showcase unless the user explicitly asks for that separate deliverable.
- **Self-contained per turn** — each pass works as a single paste with `design.md` already applied; do not tell the tool to "see the PRD."

### Confirm to the user

Return in chat:

1. **Paths** — `design.md` path and prompt task folder path.
2. **Summary** — one sentence: platform type, task slug, pass count.
3. **Gaps** — any `[COPY TBD]` or missing spec detail.
4. **Usage** — open `README.md` → apply `design.md` on the chosen platform → run `01` → `02` → … in order.

### Follow-up updates

When the user revises the handoff:

1. Read the existing folder at the agreed path.
2. Apply requested changes — add/edit numbered passes; update the README pass-order table.
3. If `design.md` changed, confirm README still points at the correct path; refresh do/don't reminders if needed.
4. Overwrite files in the same folder unless the user asks for a new path or task slug.

Do not write into Claude Design, Stitch, or Figma directly; this recipe only produces markdown files.

## Related

- [creating-design.md](creating-design.md) — prerequisite visual tokens (`design/design.md`)

## Examples

**Missing design.md:** User asks for design prompts but has no tokens. Stop → offer [creating-design.md](creating-design.md) → resume after `design/design.md` exists.

**Mobile MVP:** User shares PRD, user stories, UI specs, and design.md. Ask to confirm `design/prompts/mvp/`. Write README + one pass per in-scope flow; mobile-only viewport matrix.

**Desktop SaaS slice:** Same inputs for checkout. Confirm `design/prompts/checkout-v2/`. Desktop/tablet/mobile viewports. Chrome rules describe sidebar shell in README; passes build checkout screens only.

**Update:** User says "add settings screen." Read existing task folder → add next numbered pass → update README pass-order table → overwrite in place.
