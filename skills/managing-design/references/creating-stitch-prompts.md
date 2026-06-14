# Creating Google Stitch prompts

**Authoring mode.** Apply when generating or updating `design.md` and `prompt.md` for Google Stitch.

Produces two markdown files the user feeds into Google Stitch:

| File | Recipe | Purpose |
| --- | --- | --- |
| `design.md` | [creating-stitch-design.md](creating-stitch-design.md) | Official [DESIGN.md spec](https://stitch.withgoogle.com/docs/design-md/specification.md) — YAML tokens + canonical sections from [`design.md`](../assets/design.md) |
| `prompt.md` | This recipe | Screen plan, component library, and numbered Stitch build order |

**Prerequisites (required before generating):**

1. **PRD or FRD** — scope, requirements, acceptance criteria, feature boundaries
2. **User story** — roles, goals, behaviors, permissions
3. **UI specs** — flows, screens, states, validation, edge cases, content, layout

If any input is missing or too thin, **stop and gather information** before generating. Mark `[TBD]` for gaps — never fabricate flows, roles, copy, or visual tokens.

## Gap-filling (when inputs are insufficient)

Ask in this order. Wait for answers before proceeding to the next tier unless the user provides everything at once.

### 1. Product or feature expectations

Ask when PRD/FRD is missing or vague:

- What product or feature are we designing?
- What should the application do for the user?
- What is in scope vs out of scope for this Stitch pass?
- Any hard requirements or acceptance criteria?

### 2. User roles and behavior

Ask when user story is missing or vague:

- What are the different user roles in the app?
- What does each role need to accomplish?
- How does behavior differ per role (screens, actions, visibility)?
- Any permission or gating rules?

### 3. UI specs and visual direction

Ask when UI specs or style guide is missing or vague:

- What is the desired visual style? (e.g. modern minimal, glassmorphism, flat, editorial)
- Color palette or brand colors?
- Typography preferences or existing design system?
- Reference products for inspiration?
- Density: compact vs spacious?
- Mobile-first or desktop-first?

Capture answers in notes. Visual decisions become a style guide via [creating-style-guide.md](creating-style-guide.md), then `design.md` via [creating-stitch-design.md](creating-stitch-design.md). Behavioral decisions go into `prompt.md`. List any remaining gaps as `[TBD]` in the delivery summary.

## Delivery preference

**Ask before generating** (unless the user already specified).

| Option | When to use | Action |
| --- | --- | --- |
| **Folder** (recommended) | Follow-up updates, iteration, versioned prompts | Create `stitch/<feature-slug>/design.md` and `prompt.md` (confirm path and slug with user) |
| **Custom path** | User picks location | Write both files to the user-chosen directory |

Default if the user has no preference: `stitch/<feature-slug>/` in the project root.

Skip the ask only when the user gives an explicit path (e.g. "write to `docs/design/checkout/`").

On follow-up requests ("add checkout screen", "update color tokens"), **edit the existing files** at the agreed path — do not create duplicates unless the user asks.

**File and chat delivery:**

- Write `design.md` and `prompt.md` as plain markdown on disk at the agreed path.
- Do not wrap file bodies in chat code fences — nested markdown breaks inside fences.
- In chat, return paths, summary, and gaps only — not the full file bodies. If the user insists on in-chat delivery, write the files anyway and say copying from the files is the reliable method.

## Workflow

1. **Assess inputs** — prerequisites above; if insufficient, run gap-filling.
2. **Confirm delivery** — agree on directory path and feature slug.
3. **Extract** — map inputs using [Extraction checklist](#extraction-checklist) below.
4. **Generate style guide** — see [Generating visual tokens](#generating-visual-tokens).
5. **Generate `design.md`** — see [Generating `design.md`](#generating-designmd).
6. **Draft `prompt.md`** — use [`prompt.md`](../assets/prompt.md); see [Filling rules](#filling-rules).
7. **Write files** — save at agreed path per Delivery preference.

When `design.md` already exists and the user only asks for visual token updates, re-run [Generating visual tokens](#generating-visual-tokens) and [Generating `design.md`](#generating-designmd); sync `prompt.md` token references if needed.

## Generating visual tokens

This step produces the **internal style guide** used as input to Stitch `design.md`. Invoke [creating-style-guide.md](creating-style-guide.md) — it does not know about Stitch.

1. **Read** [creating-style-guide.md](creating-style-guide.md) — conventions, parsing, filling rules, and [output contract](creating-style-guide.md#output-contract).
2. **Gather visual inputs** — UI specs, gap-filling answers, and any user-supplied style guide.
3. **Produce content** — follow that recipe's workflow; structure from [`style-guide.md`](../assets/style-guide.md).
4. **Hold in memory or temp** — do not write `style-guide.md` to disk unless the user asks; this is intermediate content for the next step.

## Generating `design.md`

Transform the style guide into official Stitch format via [creating-stitch-design.md](creating-stitch-design.md).

1. **Read** [creating-stitch-design.md](creating-stitch-design.md) — token mapping, spec compliance, and [output contract](creating-stitch-design.md#output-contract).
2. **Parse style guide** — all nine sections from the previous step.
3. **Produce `design.md`** — YAML front matter + canonical sections per [`design.md`](../assets/design.md).
4. **Write to disk** — save as `design.md` at the agreed path. Do **not** paste the full body in chat.
5. **Summarize in chat** — paths, one-line summary, and gaps only.

## File contracts

### `design.md`

Official Stitch DESIGN.md produced by [creating-stitch-design.md](creating-stitch-design.md) from a style guide. YAML tokens plus eight canonical sections per the [specification](https://stitch.withgoogle.com/docs/design-md/specification.md). Template: [`design.md`](../assets/design.md). See [creating-stitch-design.md](creating-stitch-design.md#output-contract) for required content.

### `prompt.md`

Generation prompt for Google Stitch. Fixed section order:

| § | Section | Purpose |
| --- | --- | --- |
| — | Header + source hierarchy | PRD/FRD, user story, UI specs, `design.md` precedence |
| 1 | Objective | What to build; delivery scope |
| 2 | User Roles & Contexts | Role table + role-specific UI rules |
| 3 | Information Architecture | Navigation + flow map |
| 4 | Component Library | Full inventory with variants, states, and token references |
| 5 | Stitch Generation Plan | Numbered build order for Google Stitch |
| 6 | Screens & Pages | Sections → screens with layout, content, components, states, interactions |
| 7 | Cross-Cutting States | Loading, empty, error, permission patterns |
| 8 | Responsive Variants | Per-screen mobile changes |
| 9 | Constraints & Non-Goals | What Stitch must not invent or change |
| 10 | Final Deliverable Checklist | Verification list |

Template: [`prompt.md`](../assets/prompt.md). Populate the header source hierarchy from the template — do not restate it elsewhere in the file.

## Filling rules

### `design.md`

Follow all filling rules in [creating-stitch-design.md](creating-stitch-design.md). Style guide conventions come from [creating-style-guide.md](creating-style-guide.md) upstream.

### `prompt.md`

1. **Replace every `[...]` placeholder** with concrete names from PRD/FRD, user story, and UI specs. Never ship bracket placeholders in the output.
2. **Reference `design.md`** — all visual decisions point to YAML token keys and prose section names in the design file (`colors.*`, `typography.*`, `spacing.*`, `rounded.*`, `components.*`), not inline hex, px, or font values.
3. **Coverage** — list every component category, screen, variant, validation state, error state, edge case, and role variant from inputs by name. Expand repeat sections fully; do not summarize with "repeat for all screens."
4. **Components before screens** — component library must be complete before screen sections and Stitch Generation Plan reference them.
5. **Stitch Generation Plan** — numbered steps covering every component category and every screen/state variant from inputs, in build order.
6. **Be specific** — use hierarchical component names (`Input/Text/Error`, `Button/Primary/Hover`) derived from specs.

## Extraction checklist

Before filling templates, confirm you have:

| From PRD/FRD | Maps to |
| --- | --- |
| Feature scope & boundaries | Objective, Constraints |
| Requirements & acceptance criteria | Screen content, checklist |
| In/out of scope | Constraints & Non-Goals |

| From user story | Maps to |
| --- | --- |
| Roles | User Roles & Contexts table |
| Goals per role | Screen purpose, navigation |
| Permission rules | Role-specific UI rules, gated elements |

| From UI specs | Maps to |
| --- | --- |
| User flows | Information Architecture, flow map |
| Screens and routes | Screens & Pages, Stitch Generation Plan |
| Component inventory | Component Library |
| Validation & error states | Component states, screen variants |
| Edge cases | Screen edge cases, Cross-Cutting States |
| Layout descriptions | Screen layout blocks |
| Copy & content | Screen content blocks |
| Mobile layouts | Responsive Variants table |

| From UI specs / gap-filling | Style guide (via [creating-style-guide.md](creating-style-guide.md)) | `design.md` (via [creating-stitch-design.md](creating-stitch-design.md)) |
| --- | --- | --- |
| Brand / aesthetic direction | §1 Visual Theme & Atmosphere | `## Overview`, `## Do's and Don'ts` |
| Color palette | §2 Color Palette & Roles | YAML `colors:`, `## Colors` |
| Type scale | §3 Typography | YAML `typography:`, `## Typography` |
| Spacing, density, grid | §4–§6 | YAML `spacing:`, `## Layout` |
| Shadow, blur, focus | §7 Depth & Elevation | `## Elevation & Depth` |
| Corner radii | §8 Roundness | YAML `rounded:`, `## Shapes` |
| Breakpoints | §9 Breakpoints & Responsive Behavior | `## Layout` (breakpoints subsection) |
| Component atoms | UI specs component inventory | YAML `components:`, `## Components` |

## Authoring rules

- **User story drives role coverage** — every role with distinct behavior gets explicit screen/view coverage.
- **Production intent** — named components, full variant coverage, role-aware views.

## Output format

Return to the user in chat per **File and chat delivery** in Delivery preference:

1. **Paths** — absolute or repo-relative paths to `design.md` and `prompt.md`.
2. **Summary** — one sentence on what the prompt covers.
3. **Gaps** — any detail marked TBD or missing from inputs.
4. **Copy instruction** — tell the user to open both files and use them with Google Stitch (`design.md` as visual reference; `prompt.md` as generation prompt).

## Follow-up updates

When the user revises either file:

1. Read the existing files at the agreed path.
2. Apply requested changes.
3. Keep both files consistent — token changes in `design.md` (via [creating-stitch-design.md](creating-stitch-design.md), optionally updating the upstream style guide) may require updates in `prompt.md` references and the Stitch Generation Plan.
4. Overwrite the same files unless the user asks for a new path or versioned copy.

Do not write to Google Stitch directly; this recipe only produces the markdown files.
