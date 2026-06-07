# Example output

Registration wizard example. Use as a depth and specificity reference — adapt structure to each project.

```markdown
# Figma AI Prompt — Laundry Shop Registration Handoff Design

> Reference the attached UI Specification document as the authoritative requirements source.
>
> Do not reinterpret, simplify, modify, or redesign the flow.
>
> Generate a complete production-ready Figma handoff design package for engineering.

---

# Objective

Create a complete Figma handoff file for the Laundry Shop Registration Wizard (`/register/shop`) including:

* Desktop flows
* Mobile flows
* Component library
* Design system references
* State variants
* Edge cases
* Responsive behavior
* Interaction specifications
* Developer annotations

The output should feel like a polished SaaS product inspired by Linear, Stripe, Arc Browser, Vercel, and Notion Calendar while strictly following the attached UI specification.

---

# File Structure

Create the following Figma pages:

## 01 — Cover

* Product title
* Registration flow overview
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
* Blur treatments
* Focus ring styles
* Motion specifications

Include token usage examples.

---

## 03 — Components

Create production-ready components with variants.

Group by category.

### Navigation

* Progress indicator
* Back button
* Continue button
* Save Draft button
* Secondary button
* Link button

#### States

* Default
* Hover
* Pressed
* Disabled
* Focus

---

### Inputs

* Text input
* Textarea
* Phone input
* OTP input
* Time picker
* URL input
* Slug input

#### States

* Empty
* Filled
* Focus
* Error
* Disabled
* Loading

---

### Cards

* Floating panel
* Section card
* URL preview card
* Branding preview card
* Success timeline card
* Upload card

#### States

* Default
* Hover
* Loading
* Error
* Success

---

### Upload Components

#### Logo Upload

* Empty
* Dragging
* Uploading
* Success
* Failed

#### Banner Upload

* Empty
* Dragging
* Uploading
* Success
* Failed

---

### Status Components

#### Slug Checker

* Idle
* Checking
* Available
* Taken
* Reserved
* Network Error

---

### Modals

* Discard confirmation
* Session expired
* Upload failure
* Submission failure

---

## 04 — Desktop Flow

Create all steps in sequence.

Use a persistent two-column layout.

### Left

Registration wizard

### Right

Live preview panel

Preview updates according to the active step.

All frames should be properly named.

---

### Step 1 — Landing

Create:

* Default
* Hover states
* Authenticated visitor variant

---

### Step 2 — Account

Create variants:

* Empty
* Email entered
* OTP sent
* OTP verification
* Invalid OTP
* Resend available
* Network failure
* Already authenticated

---

[Steps 3–11 follow the same pattern — list every step and variant from the spec]

---

### Step 12 — Edge Cases

Create dedicated screens:

* Session expired
* Upload too large
* Network disconnected
* Slug API unavailable
* Submission failure
* Unexpected server error

---

## 05 — Mobile Flow

Design every step for mobile.

### Requirements

* One step per screen
* Safe area support
* Sticky footer actions
* Collapsible preview
* Bottom sheet preview variants

Create:

* iPhone 16 Pro frame
* Android Pixel frame

For every step include:

* Default
* Keyboard open state
* Error state

---

## 06 — Responsive Behavior

Show:

* Desktop
* Tablet
* Mobile

Document:

* Breakpoints
* Preview behavior
* Card stacking
* Bento collapse behavior

---

## 07 — Interaction Specs

Create annotated prototype flows.

Document:

* Step transitions
* Progress indicator updates
* Upload interactions
* Slug validation flow
* Success animations
* Error recovery flows

### Timing Annotations

| Interaction      | Duration |
| ---------------- | -------- |
| Step Transition  | 250ms    |
| Upload Success   | 200ms    |
| Validation Shake | 150ms    |
| Success Hero     | 500ms    |

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

* Input/Text/Default
* Input/Text/Error
* Card/Section/Default
* Button/Primary/Hover
* Upload/Logo/Uploading

---

# Layer Organization

Every frame must be organized as:

Screen
├── Background
├── Main Panel
├── Section Cards
├── Inputs
├── Actions
├── Preview Panel

Requirements:

* No unnamed layers
* No "Frame 1", "Frame 2", etc.

---

# Final Deliverable

Produce a complete engineering-ready Figma handoff file with:

* 100% of screens from the attached specification
* Desktop and Mobile
* Component library
* Full variant coverage
* Edge cases
* Motion documentation
* Responsive documentation
* Developer annotations

Treat the attached registration UI specification as the single source of truth for content, behavior, validation states, layout requirements, and interaction patterns.
```
