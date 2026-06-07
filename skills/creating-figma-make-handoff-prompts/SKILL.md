---
name: creating-figma-make-handoff-prompts
description: Generates complete, copy-ready Figma Make prompts for production design handoffs from UI specifications and style guides. Use when the user wants a Figma Make prompt, Figma AI design handoff, UI-spec-to-Figma brief, or a complete design handoff package (cover, design system, components, screens, responsive, developer annotations).
---

# Creating Figma Make Handoff Prompts

Generates a single markdown document the user pastes into Figma Make to produce an engineering-ready handoff file.

**Prerequisites (required before generating):**

1. **UI specification** — flows, screens, states, validation, edge cases, interactions, content
2. **Style guide** — typography, color, spacing, elevation, radius, motion, component patterns

If either is missing, ask for it or confirm what to infer. Do not invent flows or tokens not supported by the inputs.

## Workflow

1. **Read inputs** — UI spec (authoritative for behavior/content) and style guide (authoritative for visual system).
2. **Extract inventory** — flows, screens/steps, component categories, state variants, edge cases, breakpoints, interaction timings, layout patterns.
3. **Choose scope** — include only what the spec requires: desktop, mobile, tablet, responsive doc, interaction specs, developer handoff pages.
4. **Draft the prompt** — read [prompt-template.md](references/prompt-template.md), apply its filling rules, and produce a fully expanded prompt (no bracket placeholders).
5. **Deliver** — output the full prompt inside one fenced markdown code block so the user can copy it in one action. Do not split across multiple blocks.

## Authoring rules

- **UI spec is source of truth** — state this in the prompt header. Do not reinterpret, simplify, or redesign flows.
- **Style guide is visual source of truth** — reference it in the Design System page; do not substitute a different aesthetic unless the user asks.
- **Be exhaustive for the spec** — every screen, state, and edge case in the UI spec should appear in the prompt.
- **Be specific** — name frames, components, variants, and states concretely (derived from the spec, not generic placeholders).
- **Production handoff intent** — auto layout, named layers, component variants, developer annotations, responsive behavior.
- **Aesthetic direction (optional)** — if the user or spec mentions product references (e.g. Linear, Stripe), include them as inspiration while still following the spec and style guide.

## Prompt structure

Use this page order unless the project does not need a section:

| Page | Purpose |
| --- | --- |
| 01 — Cover | Title, overview, principles, flow map |
| 02 — Design System Reference | Tokens and usage from style guide |
| 03 — Components | Variant library grouped by category |
| 04+ — Flows | Desktop, mobile, or feature-specific screen pages |
| Responsive Behavior | Breakpoints and layout shifts (when applicable) |
| Interaction Specs | Prototype flows and timing (when applicable) |
| Developer Handoff | Layout specs, component mapping, state docs |

Structure, extraction checklist, and filling rules: [prompt-template.md](references/prompt-template.md).

## Output format

Return to the user:

1. One-sentence summary of what the prompt covers.
2. Note any gaps (missing spec detail you had to flag as TBD).
3. The complete prompt in a single ` ```markdown ` fence — ready to copy into Figma Make.

Do not write to Figma directly; this skill only produces the prompt markdown.
