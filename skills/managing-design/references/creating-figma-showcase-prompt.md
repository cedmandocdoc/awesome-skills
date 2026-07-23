# Creating Figma Showcase Prompt

## Overview

**Authoring mode.** Apply when generating a self-contained Figma Make prompt that produces a **complete design showcase** — a component library page plus a full screens page — from PRD/FRD, user stories, UI specs, and an existing `design.md`.

Produces one markdown file the user attaches to or pastes into Figma Make. Unlike the Stitch handoff (`design.md` + `prompt.md`), this prompt **embeds the design system inline** because Figma Make receives a single document.

**Prerequisites (required before generating):**

1. **`design.md`** — complete visual tokens per [creating-design.md](creating-design.md) and [`design.md`](../assets/design.md). If missing, **stop** and ask the user to generate one first via [creating-design.md](creating-design.md). Do not invent tokens or proceed without `design.md`.
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
- What is in scope vs out of scope for this Figma pass?
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

Visual decisions come from the **design.md** (prerequisite). Behavioral and structural decisions go into the prompt.

#### 4. `design.md` gate

When no `design.md` exists:

1. Tell the user a `design.md` is required before a Figma showcase prompt.
2. Offer to run [creating-design.md](creating-design.md) first.
3. Do not generate the Figma prompt until tokens, typography, spacing, radius, and elevation are defined.

### Platform and viewports

Infer platform type from PRD/FRD and UI specs. Confirm with the user when ambiguous.

| Platform type | Frames per screen | Default sizes (adjust per spec) |
| --- | --- | --- |
| **Desktop / web application** | Desktop, tablet, mobile | 1440×900 · 768×1024 · 390×844 |
| **Mobile-only application** | Mobile portrait only | 390×844 (e.g. iPhone 14) |

Record the chosen sizes in the prompt **Objective → Viewport matrix** and **Figma Make Execution Rules → Responsive rule**. For desktop/web, every primary screen gets three frames unless UI specs explicitly defer tablet or mobile for a subset.

### Delivery preference

**Ask before generating** (unless the user already specified).

| Option | When to use | Action |
| --- | --- | --- |
| **Default path** (recommended) | Standard project layout | `design/prompts/figma/<prompt-slug>.md` |
| **Custom path** | User picks location | Write to the user-chosen path |

Default slug: kebab-case from product or feature name (e.g. `avmentryx-mobile-mvp.md`).

Skip the ask only when the user gives an explicit path (e.g. "write to `docs/design/figma/checkout.md`").

On follow-up requests ("add settings screen", "update tokens"), **edit the existing file** at the agreed path — do not create duplicates unless the user asks.

**File and chat delivery:**

- Write the prompt as plain markdown on disk.
- Do not wrap the file body in chat code fences — nested markdown breaks inside fences.
- In chat, return path, summary, and gaps only — not the full file body.

### Workflow

1. **Gate on `design.md`** — if missing, stop and route to [creating-design.md](creating-design.md).
2. **Assess inputs** — PRD/FRD, user story, UI specs; if insufficient, run gap-filling.
3. **Confirm delivery** — agree on path and prompt slug.
4. **Confirm platform type** — desktop/web vs mobile-only; set viewport matrix.
5. **Extract** — map inputs using [Extraction checklist](#extraction-checklist).
6. **Embed design system** — copy token tables and theme prose from the design.md into the prompt **Design System** section (exact values, not token-key references alone).
7. **Draft prompt** — use [`figma-showcase-prompt.md`](../assets/figma-showcase-prompt.md); see [Filling rules](#filling-rules).
8. **Write file** — save at agreed path.

### What makes Figma Make succeed

Figma Make needs stricter structure than a human designer. Prioritize these in every prompt:

| Priority | Section | Why |
| --- | --- | --- |
| 1 | **Figma Make Execution Rules** | Two-page file structure, variables, auto-layout, instance usage |
| 2 | **Build Plan** | Strict numbered order — components → layout templates → screens |
| 3 | **Layout templates** | Duplicate-and-swap rule prevents chrome drift between screens |
| 4 | **Component Library + recipes** | Component sets with named variant properties before screens |
| 5 | **Out of scope** | Stops invented screens and feature creep |
| 6 | **Final Deliverable Checklist** | Verification Figma Make can self-check against |

**Include when specs support them:** motion annotations, accessibility table, component recipe rows, per-screen state variants.

**Omit or shorten when specs are thin:** motion tokens, exhaustive responsive tables for screens that only reflow via breakpoints, duplicate prose that repeats the Build Plan verbatim.

### File contract

Single self-contained markdown file. Fixed section order:

| § | Section | Purpose |
| --- | --- | --- |
| — | Header + how to use | Self-contained; paste into Figma Make |
| 1 | Objective | Deliverables, viewport matrix, frame naming, build rule |
| 2 | Figma Make Execution Rules | Two pages, variables, auto-layout, layout-template discipline |
| 3 | Design System | **Embedded** design.md — colors, type, spacing, radius, elevation, recipes |
| 4 | Product Scope | In scope / out of scope |
| 5 | User Roles & Contexts | Role table + UI rules |
| 6 | Information Architecture | Layout templates, navigation, flow map |
| 7 | Component Library | Full inventory with variants and states |
| 8 | Build Plan | Numbered phases — Components page → layouts → screens |
| 9 | Screens & Pages | Per-screen layout, content, components, states, interactions |
| 10 | Cross-Cutting States | Loading, empty, error, offline patterns |
| 11 | Responsive Variants | Per-viewport or narrow-phone reflow rules |
| 12 | Interaction & Accessibility | Optional — include when UI specs define behavior |
| 13 | Constraints & Content Rules | Non-goals and token discipline |
| 14 | Final Deliverable Checklist | Figma-specific verification |

Template: [`figma-showcase-prompt.md`](../assets/figma-showcase-prompt.md).

### Filling rules

1. **Replace every `[...]` placeholder** with concrete names from PRD/FRD, user story, and UI specs. Never ship bracket placeholders in the output.
2. **Embed design system values** — copy exact hex, px, font family, and shadow values from the design.md into **Design System** tables. Figma Make does not receive a separate design.md file.
3. **Two Figma pages** — state explicitly in Execution Rules and Objective: `Components` page first, `Screens` page second.
4. **Components before screens** — Build Plan Phase 1 lists every component set; Phases 2+ reference layout duplication. Screen steps never precede component steps.
5. **Layout templates** — define at least one shell per auth/app/modal pattern before feature screens. Every screen in a flow names which template it duplicates.
6. **Coverage** — list every component category, screen, sheet, variant, validation state, error state, edge case, and role variant from inputs by name. Expand repeat sections fully; do not summarize with "repeat for all screens."
7. **Build Plan** — numbered steps covering every component, layout template, screen, and state variant, in execution order. Reference build step numbers in **Screens & Pages**.
8. **Viewport matrix** — match platform type. Desktop/web gets three frames per screen; mobile-only gets one.
9. **Out of scope** — explicit bullet list from PRD/FRD exclusions. Figma Make invents features when this section is weak.
10. **Be specific** — hierarchical component names (`Button/Primary`, `Input/Text/Error`), frame names (`Screen/Home`, `Sheet/Confirm`), and exact copy from UI specs.

### Extraction checklist

Before filling the template, confirm you have:

| From PRD/FRD | Maps to |
| --- | --- |
| Feature scope & boundaries | Objective, Product Scope |
| Requirements & acceptance criteria | Screen content, checklist |
| In/out of scope | Product Scope out-of-scope list, Constraints |

| From user story | Maps to |
| --- | --- |
| Roles | User Roles & Contexts table |
| Goals per role | Screen purpose, navigation |
| Permission rules | Role-specific UI rules |

| From UI specs | Maps to |
| --- | --- |
| User flows | Information Architecture, flow map |
| Screens and routes | Screens & Pages, Build Plan |
| Layout shells | Layout templates, duplicate-and-swap rule |
| Component inventory | Component Library, component recipes |
| Validation & error states | Component states, screen variants |
| Edge cases | Screen edge cases, Cross-Cutting States |
| Copy & content | Screen content blocks |
| Responsive behavior | Responsive Variants, viewport matrix |

| From design.md | Maps to |
| --- | --- |
| Overview | Design System → Visual theme |
| YAML `colors:` + Colors | Design System → Color tokens |
| YAML `typography:` + Typography | Design System → Typography |
| YAML `spacing:` + Layout | Design System → Spacing / grid |
| Elevation & Depth | Design System → Elevation |
| YAML `rounded:` + Shapes | Design System → Radius |
| Layout breakpoints (`bp-*`) | Design System → Breakpoints, Responsive Variants |
| Components (+ motion) | Design System → Component recipes, Component Library |

### Authoring rules

- **design.md is source of truth for visuals** — embed values; do not paraphrase tokens into vague adjectives.
- **User story drives role coverage** — every role with distinct behavior gets explicit screen coverage.
- **Production intent** — named components, full variant coverage, layout-template discipline, Figma instance usage.
- **Self-contained** — the prompt must work with no attachments. Do not tell Figma Make to "see design.md" or "see PRD."

### Confirm to the user

Return in chat:

1. **Path** — absolute or repo-relative path to the prompt file.
2. **Summary** — one sentence: platform type, screen count, component scope.
3. **Gaps** — any `[COPY TBD]` or missing spec detail.
4. **Usage** — open the file, attach or paste full contents into Figma Make.

### Follow-up updates

When the user revises the prompt:

1. Read the existing file at the agreed path.
2. Apply requested changes.
3. If the design.md changed, sync **Design System** embedded tables.
4. Overwrite the same file unless the user asks for a new path.

Do not write to Figma directly; this recipe only produces the markdown prompt.

## Related

- [creating-design.md](creating-design.md) — prerequisite visual tokens
- [creating-stitch-prompts.md](creating-stitch-prompts.md) — parallel handoff for Google Stitch (split `design.md` + `prompt.md`)

## Examples

**Missing design.md:** User asks for a Figma Make prompt but has no tokens. Stop → offer [creating-design.md](creating-design.md) → resume this recipe after design.md exists.

**Mobile MVP:** User shares PRD, user stories, UI specs, and design.md for a mobile-only app. Embed design system → full Build Plan with Components page + Screens page → write `design/prompts/figma/<slug>.md` with mobile-only viewport matrix.

**Desktop SaaS:** Same inputs for a web app. Viewport matrix includes desktop, tablet, and mobile frames per screen. Layout templates include sidebar shell.

**Update:** User says "add offline state to dashboard." Read existing prompt → add screen variant and Build Plan step → overwrite same file.
