# Figma AI Prompt — [Product / Feature] Handoff Design

> Reference the attached UI Specification document as the authoritative requirements source.
>
> Do not reinterpret, simplify, modify, or redesign the flow.
>
> Generate a complete production-ready Figma handoff design package for engineering.

---

# Objective

Create a complete Figma handoff file for [feature name / route / product area] including:

* All screens on a single Screens page (vertical stack with horizontal variants per screen)
* Component library
* Design system references
* State variants (desktop, mobile, error, empty, etc.)
* Edge cases
* Interaction specifications
* Developer annotations

[Optional: aesthetic direction from user or spec — e.g. polished SaaS inspired by Linear, Stripe while strictly following the attached UI specification and style guide.]

---

# File Structure

Create the following Figma pages:

## Cover

* Product title
* [Flow / feature] overview
* Design principles
* Flow map

---

## Design System Reference

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

## Components

Create production-ready components with variants.

Group by category. For each category:

### [Category name]

* [Every component in this category]

#### States

* [Every state/variant required — e.g. Default, Hover, Pressed, Disabled, Focus]

---

[One ### block per category until the full spec component inventory is covered]

---

## Screens

Create **one Figma page** named `Screens` containing every screen from the specification.

### Layout rules

* Stack all screens **vertically** in flow order (top to bottom).
* For each screen, lay out variants **horizontally in a single row** beside the primary frame:
  * Mobile version (when the spec defines mobile)
  * State variants (default, loading, error, empty, validation, etc.)
  * Edge-case states
* Do not create separate Desktop Flow, Mobile Flow, or Responsive Behavior pages.
* Do not document breakpoints — mobile and state coverage is per screen row.

All frames must be properly named.

---

### [Step or screen name — every step in order]

Primary frame:

* [Desktop or default layout from spec]

Horizontal variants in the same row:

* [Mobile frame — when applicable]
* [Every state/variant the spec defines for this step — e.g. Default, Keyboard open, Error, Empty]

---

[One ### block per step/screen — list all steps explicitly]

---

### Edge Cases

Include as additional rows or horizontal variants on this page:

* [Every edge case from the spec]

---

## Interaction Specs

[Include only when the spec defines interactions or motion]

Create annotated prototype flows.

Document:

* [Every interaction from the spec]

### Timing Annotations

| Interaction | Duration |
| ----------- | -------- |
| [Name from spec] | [Duration from spec] |

---

## Developer Handoff

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

### Variant Notes

Document which horizontal variants exist for each screen row (mobile, states, edge cases).

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

* 100% of screens from the attached specification on a single Screens page
* Vertical screen stack with horizontal variants (mobile, states, edge cases) per screen
* Component library
* Full variant coverage
* Edge cases
* [Motion documentation — when applicable]
* Developer annotations

Treat the attached UI specification as the single source of truth for content, behavior, validation states, layout requirements, and interaction patterns.
