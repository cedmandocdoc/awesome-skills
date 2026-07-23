# Figma Make Prompt — [Product / Feature Name]

> **How to use:** Attach this file or paste its full contents into Figma Make. This prompt is **complete and self-contained** — no other documents are required.
>
> Do not reinterpret, simplify, or redesign flows. Follow the design system and screen specifications in this document exactly.

---

## Objective

Generate the complete **[product / feature name]** UI showcase in Figma:

- **Page `Components`** — full component library with variant properties and interactive states
- **Page `Screens`** — every screen, sheet, and layout template listed in this document
- **Layout templates** — reusable shells (e.g. `AuthShell`, `AppShell`) duplicated per screen; swap only the main content region
- **State variants** — loading, empty, error, validation, offline, and success states per spec
- **Responsive frames** — [see Viewport matrix below]

**Product context:** [One paragraph from PRD — audience, problem, MVP boundaries]

**Delivery scope:** [e.g. full mobile MVP, admin dashboard slice, onboarding flow only]

**Viewport matrix:**

| Platform type | Frames to generate per screen |
| --- | --- |
| **Desktop / web application** | Desktop `[width × height]` · Tablet `[width × height]` · Mobile `[width × height]` |
| **Mobile-only application** | Mobile `[width × height]` only |

**Frame naming:** `Screen/<Name>`, `Sheet/<Name>`, `Layout/<Name>`, `Components/<Category>/<Name>`

**Critical build rule:** Execute the **Build Plan** in strict numerical order. Build all components on the **Components** page before any screen frame. Each screen step duplicates the designated layout frame and swaps only the main content region. Do not redesign chrome between screens.

---

## Figma Make Execution Rules

### File structure

| Page | Contents |
| --- | --- |
| **`Components`** | All component sets, organized by category (`Components/Buttons`, `Components/Inputs`, …) |
| **`Screens`** | Layout templates, screen frames, sheet overlays, and state variants |

Place **Components** page first in the file. Screens must use **component instances** from the Components page — never detached copies or one-off redraws.

### Build discipline

- Create **Figma variables** (or local styles) for every token in the **Design System** section — use exact values defined there; do not invent ad-hoc hex, px, or font values.
- Build **component sets** with explicit variant properties (`State`, `Type`, `Selected`, `Size`, etc.) before any screen frame.
- Use **auto-layout** for all interactive rows, cards, buttons, navigation chrome, and sheet bodies.
- Apply elevation, blur, and shadow tokens only where the Design System specifies — do not add decorative depth elsewhere.
- Enforce **minimum touch target 44 × 44 pt** on all tappable elements (mobile and compact tablet).
- Name every frame and component set predictably so the Build Plan steps map 1:1 to Figma layers.

### Layout template rule

Authenticated and unauthenticated flows each get a **base layout frame** on the Screens page. Every screen in that flow **duplicates** the base frame and replaces **only** the scrollable main content region. Tab bars, headers, sidebars, and navigation chrome stay identical across screens in the same shell.

### Responsive rule

- **Desktop / web:** group each screen's desktop, tablet, and mobile frames in a horizontal row on the Screens page; label `Desktop`, `Tablet`, `Mobile`.
- **Mobile-only:** one portrait frame per screen; annotate narrow-phone layout swaps in **Responsive Variants** where content reflows.

---

## Design System

> Embedded from the project `design.md`. Figma Make must not deviate from these values.

### Visual theme

[Overview + Do's and Don'ts from `design.md` — mood, do/don't, aesthetic direction]

### Color tokens

| Token | Value | Role |
| --- | --- | --- |
| [`token-name`] | [hex or rgba] | [usage] |

[One row per color token from YAML `colors:`]

### Typography

| Token | Size | Line height | Letter spacing | Family | Weight | Usage |
| --- | --- | --- | --- | --- | --- | --- |
| [`text-*`] | [px] | [px] | [px] | [family] | [weight] | [usage] |

[Pairing rules from `design.md` Overview when defined]

### Spacing

| Token | Value | Usage |
| --- | --- | --- |
| [`space-*`] | [px] | [usage] |

[Grid and margin rules from `design.md` Layout]

### Radius

| Token | Value | Usage |
| --- | --- | --- |
| [`radius-*`] | [px] | [usage] |

### Elevation and depth

| Token | Value | Usage |
| --- | --- | --- |
| [`elevation-*`] | [value] | [usage] |

### Breakpoints

| Token | Width | Behavior |
| --- | --- | --- |
| [`bp-*`] | [range] | [layout behavior] |

### Component recipes

Use these specs when building component sets:

| Component | Background | Text | Radius | Padding | Height / notes |
| --- | --- | --- | --- | --- | --- |
| [Component/Variant] | [token or hex] | [token or hex] | [token] | [token] | [constraints] |

[One row per atomic component from YAML `components:` or UI specs inventory]

---

## Product Scope

### In scope

- [Feature or flow from PRD/FRD]
- [Feature or flow from PRD/FRD]

### Out of scope — do not generate

- [Explicit exclusion from PRD/FRD]
- [Feature the user or spec marked deferred]

---

## User Roles & Contexts

| Role | Goals | Key screens | Constraints |
| --- | --- | --- | --- |
| [Role name] | [What they accomplish] | [Screen list] | [Permissions, gating] |

### Role-specific UI rules

- [e.g. Unauthenticated users see AuthShell only — no app navigation]
- [e.g. Admin role sees audit log; Member does not]

---

## Information Architecture

### Layout templates

Identify layout templates **before** building feature screens. Build each as a frame on the Screens page.

#### Template A — `Layout/[ShellName]`

**Used by:** [screen list]

```
[ASCII wireframe of regions — header, main, footer, sidebar, tab bar]
```

- [Chrome rules — what is fixed vs swappable]
- [Token fills and spacing for each region]

#### Template B — `Layout/[ShellName]`

[Repeat for each distinct shell — auth, app, modal overlay, etc.]

### Primary navigation

| Item | Route / ID | Position | Notes |
| --- | --- | --- | --- |
| [Nav label] | [route] | [tab / sidebar / header] | [badges, nesting] |

### Flow map

```
[Entry] → [Screen A] → [Screen B]
              ↓
         [Alternate / error path]
```

---

## Component Library

Build all items in the Build Plan component phase **on the Components page** before any screen frame.

### [Category — e.g. Buttons]

| Component | Variants | States | Spec | Notes |
| --- | --- | --- | --- | --- |
| [Component/Name] | [variant props] | [Default, Pressed, Disabled, Loading, …] | [token refs or recipe row] | [size, icon slots] |

[One ### block per category until the full UI-spec inventory is covered]

### Shared patterns

- [e.g. All form fields: label above, helper below, error replaces helper in destructive color]
- [e.g. All loading states: centered spinner — no skeleton unless spec requires]
- [e.g. All empty states: illustration slot + title + body + primary CTA]

---

## Build Plan

**Execute in strict order.** Phase 1 builds the Components page. Phase 2 builds layout templates on Screens. Phase 3+ builds feature screens by duplicating templates.

### Phase 1 — Component library (Components page)

1. **[Component/Name]** — [variants and states]
2. **[Component/Name]** — [variants and states]
3. [Continue until every component category from UI specs has a numbered step]

### Phase 2 — Layout templates (Screens page)

[N]. **`Layout/[ShellName]`** — [empty shell with placeholder content region; base for steps [N+1]–[M]]
[N+1]. **`Layout/[ShellName]`** — [second shell if needed]

### Phase 3 — [Feature area name] (duplicate layout template)

[M]. **`Screen/[Name]`** — Duplicate step [layout step] → [content summary]; states: [list]
[M+1]. **`Screen/[Name]/[State]`** — Content-region variant
[Continue until every screen, sheet, and state variant from UI specs has a numbered step]

[Add phases per major flow — Auth, Main tabs, Settings, Global overlays, etc.]

---

## Screens & Pages

### Section: [e.g. Layout templates]

#### Layout/[ShellName]

**Route:** template only · **Build step:** [N]
**Purpose:** [one sentence]
**Layout:** [region diagram reference]
**States:** [tab-active variants, collapsed sidebar, etc.]

---

### Section: [e.g. Authentication]

#### [ScreenName]

**Route:** `[routeId]` · **Roles:** [roles] · **Build step:** [N]
**Purpose:** [one sentence from user story]
**Layout:** Duplicate `Layout/[ShellName]`
**Content:**

- [Headings, fields, CTAs — exact copy from UI specs]
- [Data displayed]

**Components:** [Component/Variant list]
**States:** [Default, Loading, Error, Validation, …]
**Interactions:** [navigation and side effects]

[Repeat #### block for every screen]

---

## Cross-Cutting States

| Pattern | Screens affected | Behavior |
| --- | --- | --- |
| Loading | [list] | [spinner / skeleton per spec] |
| Empty | [list] | [copy + CTA] |
| Error | [list] | [inline / full-screen / retry] |
| Offline | [list] | [banner behavior] |
| Permission denied | [list] | [redirect or inline] |

---

## Responsive Variants

| Screen | Desktop → tablet | Tablet → mobile | Mobile narrow (<[width]px) |
| --- | --- | --- | --- |
| [Screen name] | [layout change] | [layout change] | [reflow rules] |

[For mobile-only apps, use a single column: Screen | Narrow-phone changes]

---

## Interaction & Accessibility Notes

| Interaction | Behavior | Duration |
| --- | --- | --- |
| [e.g. Tab switch] | [behavior] | [ms] |

**Accessibility:**

- [Grouped labels, live regions, focus order, reduced-motion behavior from UI specs]

---

## Constraints & Content Rules

- Do not add screens, flows, or features not defined in this document
- Do not invent copy beyond UI specs; use `[COPY TBD]` only when content is genuinely unspecified
- Do not use colors, fonts, spacing, elevation, or radius outside the Design System section
- Do not redesign shell chrome per screen — duplicate layout templates only
- [Project-specific constraints from PRD/FRD]

---

## Final Deliverable Checklist

- [ ] Figma variables (or styles) for all Design System tokens
- [ ] **Components** page with every component set, full variant and state coverage
- [ ] **Screens** page with all layout templates built before feature screens
- [ ] Every screen duplicates the correct layout template — only content region changes
- [ ] Screen frames use component **instances** from the Components page
- [ ] Viewport matrix satisfied — [desktop + tablet + mobile | mobile only] per platform type
- [ ] All screens, sheets, and state variants with named frames
- [ ] Loading, empty, error, validation, and offline states as defined
- [ ] Build Plan steps executed in order without skipping
- [ ] Out-of-scope items not generated
