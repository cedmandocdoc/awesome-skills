# Prompt template

Read this file when drafting a Figma Make prompt. The markdown block below is the **output shape** — not copy-paste boilerplate.

## Filling rules

The final prompt must be **complete and copy-ready**. The user pastes it directly into Figma Make.

1. **Replace every `[...]` placeholder** with concrete names, routes, components, states, and variants from the UI spec and style guide.
2. **Never ship bracket placeholders** (`[Component list from spec]`, `[Repeat ### ...]`, etc.) in the output.
3. **Expand repeat sections fully** — list every component category, every screen/step, and every variant the spec defines. Do not summarize with "repeat for all steps."
4. **Omit inapplicable sections entirely** — do not include `[Omit if not required]` notes or empty pages. Renumber pages if you drop sections (e.g. skip Mobile Flow → Responsive becomes 05).
5. **Be exhaustive** — every screen, validation state, error state, and edge case in the UI spec must appear by name.
6. **Be specific** — use hierarchical component names (`Input/Text/Error`, `Button/Primary/Hover`) derived from the spec.
7. **Include timing rows** only for interactions the spec defines; omit the table if there is no motion detail.

## Extraction checklist

Before filling the template, confirm you have:

| From UI spec | Maps to |
| --- | --- |
| User flows / steps | Cover flow map, screen pages |
| Screens and routes | Desktop / mobile flow sections |
| Component inventory | Components page |
| Validation & error states | Component states, screen variants |
| Edge cases | Edge case screens |
| Layout descriptions | Flow layout, layer organization |
| Interactions & timing | Interaction specs table |
| Breakpoints | Responsive behavior page |

| From style guide | Maps to |
| --- | --- |
| Type scale | Design system — typography |
| Color palette / tokens | Design system — colors |
| Spacing, radius, shadow | Design system sections |
| Component styling rules | Component states, token examples |

## Output template

Fill in and output this structure. Adapt headings and page numbers to the project.

```markdown
# Figma AI Prompt — [Product / Feature] Handoff Design

> Reference the attached UI Specification document as the authoritative requirements source.
>
> Do not reinterpret, simplify, modify, or redesign the flow.
>
> Generate a complete production-ready Figma handoff design package for engineering.

---

# Objective

Create a complete Figma handoff file for [feature name / route / product area] including:

* [Include only what applies — e.g. Desktop flows, Mobile flows]
* Component library
* Design system references
* State variants
* Edge cases
* [Responsive behavior — when applicable]
* Interaction specifications
* Developer annotations

[Optional: aesthetic direction from user or spec — e.g. polished SaaS inspired by Linear, Stripe while strictly following the attached UI specification and style guide.]

---

# File Structure

Create the following Figma pages:

## 01 — Cover

* Product title
* [Flow / feature] overview
* Design principles
* Flow map

---

## 02 — Design System Reference

Reference the attached style guide.

Include:

* Typography hierarchy
* Color tokens
* Elevation system
* Radius system
* Spacing system
* Shadows
* [Blur treatments — when in style guide]
* Focus ring styles
* [Motion specifications — when in style guide]

Include token usage examples.

---

## 03 — Components

Create production-ready components with variants.

Group by category. For each category:

### [Category name]

* [Every component in this category]

#### States

* [Every state/variant required — e.g. Default, Hover, Pressed, Disabled, Focus]

---

[One ### block per category until the full spec component inventory is covered]

---

## 04 — [Primary flow name — e.g. Desktop Flow]

[Persistent layout for this flow — e.g. two-column: wizard left, live preview right]

All frames must be properly named.

---

### [Step or screen name — every step in order]

Create:

* [Every variant the spec defines for this step]

---

[One ### block per step/screen — list all steps explicitly]

---

### Edge Cases

Create dedicated screens:

* [Every edge case from the spec]

---

## 05 — Mobile Flow

[Include this page only when the spec or user requires mobile]

Design every step for mobile.

### Requirements

* [Mobile layout rules from spec]

Create:

* [Target device frames from spec or user]

For every step include:

* [Every required mobile variant — e.g. Default, Keyboard open, Error]

---

## 06 — Responsive Behavior

[Include only when breakpoints or responsive behavior are specified]

Show:

* Desktop
* Tablet
* Mobile

Document:

* Breakpoints
* [Layout shift rules — preview behavior, stacking, collapse]

---

## 07 — Interaction Specs

[Include only when the spec defines interactions or motion]

Create annotated prototype flows.

Document:

* [Every interaction from the spec]

### Timing Annotations

| Interaction | Duration |
| ----------- | -------- |
| [Name from spec] | [Duration from spec] |

---

## 08 — Developer Handoff

For every screen provide:

### Layout Specs

* Widths
* Heights
* Spacing
* Radius
* Elevation

### Component References

Map every screen element back to component names.

### State Documentation

Show which variants are used.

### Responsive Notes

Document behavior at each breakpoint.

---

# Auto Layout Requirements

Use Auto Layout everywhere.

Requirements:

* No detached layers
* No absolute positioning unless necessary
* Proper nested component structure
* Reusable variants
* Consistent naming

### Naming Examples

* [Project-specific examples — e.g. Input/Text/Default, Input/Text/Error, Button/Primary/Hover]

---

# Layer Organization

Every frame must be organized as:

[Layer tree from spec — e.g. Screen → Background → Main Panel → Section Cards → Inputs → Actions → Preview Panel]

Requirements:

* No unnamed layers
* No generic frame names ("Frame 1", "Frame 2", etc.)

---

# Final Deliverable

Produce a complete engineering-ready Figma handoff file with:

* 100% of screens from the attached specification
* [Desktop and Mobile — as applicable]
* Component library
* Full variant coverage
* Edge cases
* [Motion documentation — when applicable]
* [Responsive documentation — when applicable]
* Developer annotations

Treat the attached UI specification as the single source of truth for content, behavior, validation states, layout requirements, and interaction patterns.
```
