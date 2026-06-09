# Google Stitch Prompt — [Product / Feature]

> **Source of truth hierarchy:**
> 1. PRD/FRD — scope, requirements, acceptance criteria
> 2. User story — roles, goals, behaviors
> 3. UI specs — flows, screens, states, content, validation
> 4. `design.md` — visual language, tokens, layout, elevation, breakpoints
>
> Do not reinterpret, simplify, or redesign flows. Follow `design.md` for all visual decisions.

---

## Objective

Generate a complete UI package for **[feature / product name]** including:

- Component library (all variants and states)
- Every screen and page from the specification
- Role-specific views where user stories define different experiences
- State variants (loading, empty, error, validation, success)
- Edge cases and permission-gated UI

**Delivery scope:** [e.g. full product MVP, single feature slice, onboarding flow only]

---

## User Roles & Contexts

From user stories — define who sees what and how behavior differs.

| Role | Goals | Key screens | Permissions / constraints |
| --- | --- | --- | --- |
| [Role name] | [What they need to accomplish] | [Screen list] | [What they can/cannot do] |

### Role-specific UI rules

- [e.g. Admin sees audit log; Member does not]
- [e.g. Guest sees read-only preview; Authenticated user sees edit controls]

---

## Information Architecture

### Primary navigation

| Item | Route / ID | Roles | Notes |
| --- | --- | --- | --- |
| [Nav label] | [path] | [roles] | [badge, nested items, etc.] |

### Flow map

```
[Entry] → [Screen A] → [Screen B] → [Success]
              ↓
         [Error / alternate]
```

[List every major flow from PRD/FRD and UI specs as explicit paths]

---

## Component Library

Build these components **before** screens. Use token names from `design.md` only — colors (§2), typography (§3), spacing (§4), grid (§5), elevation (§7), roundness (§8).

### [Category — e.g. Buttons]

| Component | Variants | States | Token references | Notes |
| --- | --- | --- | --- | --- |
| [Component name] | [e.g. Primary, Secondary, Destructive, Ghost] | [Default, Hover, Pressed, Disabled, Focus, Loading] | [e.g. `primary`, `radius-md`, `space-3`] | [Size variants, icon slots, etc.] |

### [Category — e.g. Inputs]

| Component | Variants | States | Token references | Notes |
| --- | --- | --- | --- | --- |
| [Component name] | [e.g. Text, Password, Select, Textarea] | [Default, Focus, Filled, Error, Disabled] | [e.g. `input`, `ring`, `text-label`] | [Validation message slot, etc.] |

[One ### block per category until the full component inventory from UI specs is covered]

### Shared patterns

- [e.g. All form fields: label above, helper below, error replaces helper]
- [e.g. Empty states: illustration slot + `text-heading-md` title + `text-body-sm` description + primary CTA]

---

## Stitch Generation Plan

Numbered build order for Google Stitch. Execute in sequence — each step references components from the library above and tokens from `design.md`.

1. **[Step name — e.g. Core buttons]** — [variants and states to generate; token refs]
2. **[Step name — e.g. Form inputs]** — [variants and states to generate; token refs]
3. **[Step name — e.g. Navigation shell]** — [layout regions; breakpoint behavior from `design.md` §9]
4. **[Step name — e.g. Screen: Login]** — [layout, content summary, component refs, states]
5. [Continue until every screen and state variant from UI specs has a numbered step]

---

## Screens & Pages

Organize screens into logical sections. Each screen lists layout, content, components used, and variants.

### Section: [e.g. Authentication]

#### [Screen name — e.g. Login]

**Route:** [path or modal ID]
**Roles:** [who can access]
**Purpose:** [one sentence from user story / FRD]
**Stitch step:** [number from Stitch Generation Plan]

**Layout:**

- [Structure — e.g. centered card, split hero + form, full-width dashboard]
- [Regions — header, main, sidebar, footer]
- [Spacing and grid — reference tokens from `design.md` §4–§6]

**Content:**

- [Headings, labels, placeholder copy, CTA text — exact strings from UI specs]
- [Data displayed — fields, columns, cards]

**Components used:**

- [Component/Variant — e.g. Input/Text, Button/Primary, Link/Ghost]

**States to generate (horizontal variants):**

- Default
- [Loading — if applicable]
- [Validation error — list fields]
- [Empty — if applicable]
- [Success / post-action — if applicable]
- [Mobile layout — if applicable]

**Interactions:**

- [e.g. Submit → navigate to Dashboard on success]
- [e.g. "Forgot password" → Forgot Password screen]

**Edge cases:**

- [e.g. Account locked, SSO-only tenant, rate-limited]

---

[Repeat #### block for every screen in this section]

### Section: [e.g. Dashboard]

#### [Screen name]

[Same structure as above]

---

[One ### Section block per logical area until every screen from UI specs is listed]

---

## Cross-Cutting States

Apply these patterns consistently across all screens:

| Pattern | Screens affected | Behavior |
| --- | --- | --- |
| Loading (skeleton) | [list] | [skeleton layout description] |
| Empty | [list] | [copy + CTA from spec] |
| Error (global) | [list] | [banner, toast, or inline] |
| Permission denied | [list] | [redirect or inline message] |
| Offline / degraded | [list] | [if in spec] |

---

## Responsive Variants

Per `design.md` §9. For each screen that has a distinct mobile layout, generate a mobile variant alongside the desktop frame.

| Screen | Mobile changes |
| --- | --- |
| [Screen name] | [e.g. stack columns, hide sidebar, bottom sheet modal] |

---

## Constraints & Non-Goals

- Do not add screens, flows, or features not in PRD/FRD or UI specs
- Do not invent copy — use spec text or mark `[COPY TBD]` only when spec explicitly defers
- Do not use colors, fonts, spacing, elevation, or radius outside `design.md` tokens
- Do not merge or split screens unless the spec defines responsive variants
- [Project-specific constraints]

---

## Final Deliverable Checklist

- [ ] Every component from UI specs with full variant and state coverage
- [ ] Every screen from UI specs with named frames
- [ ] All role-specific views and permission-gated elements
- [ ] Loading, empty, error, and validation states per spec
- [ ] Mobile variants where `design.md` §9 or UI specs require them
- [ ] All visual values traceable to `design.md` tokens
- [ ] Stitch Generation Plan steps cover every screen and component
