# Prompt template

Copy this skeleton when drafting. Replace bracketed placeholders with spec-derived content. Remove sections that do not apply.

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

* [Desktop flows — if applicable]
* [Mobile flows — if applicable]
* Component library
* Design system references
* State variants
* Edge cases
* [Responsive behavior — if applicable]
* Interaction specifications
* Developer annotations

[Optional aesthetic line: The output should feel like a polished [product type] inspired by [references] while strictly following the attached UI specification and style guide.]

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
* [Blur treatments — if in style guide]
* Focus ring styles
* [Motion specifications — if in style guide]

Include token usage examples.

---

## 03 — Components

Create production-ready components with variants.

Group by category.

### [Category — e.g. Navigation]

* [Component list from spec]

#### States

* [State list — e.g. Default, Hover, Pressed, Disabled, Focus]

---

### [Category — e.g. Inputs]

* [Component list]

#### States

* [State list — e.g. Empty, Filled, Focus, Error, Disabled, Loading]

---

[Repeat ### categories until all spec components are covered]

---

## 04 — [Desktop Flow / Primary Flow]

[Layout description — e.g. two-column with wizard + live preview]

### [Step or Screen Name]

Create:

* [Variant list from spec]

---

[Repeat ### for every step/screen in order]

---

### Edge Cases

Create dedicated screens:

* [Edge case list from spec]

---

## 05 — Mobile Flow

[Omit entire section if not required]

Design every step for mobile.

### Requirements

* [Mobile requirements from spec — e.g. one step per screen, safe area, sticky footer]

Create:

* [Target device frames]

For every step include:

* [Required variants — e.g. Default, Keyboard open, Error]

---

## 06 — Responsive Behavior

[Omit if not required]

Show:

* Desktop
* Tablet
* Mobile

Document:

* Breakpoints
* [Layout shift rules from spec]

---

## 07 — Interaction Specs

[Omit if spec has no interaction detail]

Create annotated prototype flows.

Document:

* [Interaction list from spec]

### Timing Annotations

| Interaction | Duration |
| ----------- | -------- |
| [Name]      | [ms]     |

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

* [Category/Component/State examples from this project]

---

# Layer Organization

Every frame must be organized as:

[Tree pattern from spec — e.g. Screen → Background → Main Panel → Sections → Actions]

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
* [Motion documentation — if applicable]
* [Responsive documentation — if applicable]
* Developer annotations

Treat the attached UI specification as the single source of truth for content, behavior, validation states, layout requirements, and interaction patterns.
```

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
