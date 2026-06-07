---
name: creating-figma-make-handoff-prompts
description: Generates complete Figma Make prompts for production design handoffs from UI specifications and style guides. Writes plain markdown files (folder or single file) for reliable copy-paste into Figma Make. Use when the user wants a Figma Make prompt, design handoff brief, UI-spec-to-Figma prompt, or follow-up updates to an existing handoff prompt.
---

# Creating Figma Make Handoff Prompts

Generates a markdown file the user copies into Figma Make to produce an engineering-ready handoff file.

**Prerequisites (required before generating):**

1. **UI specification** — flows, screens, states, validation, edge cases, interactions, content
2. **Style guide** — typography, color, spacing, elevation, radius, motion, component patterns

If either is missing, ask for it or confirm what to infer. Do not invent flows or tokens not supported by the inputs.

## Delivery preference

**Ask before generating** (unless the user already specified). Prompts are long and nested markdown breaks when wrapped in chat code fences.

| Option | When to use | Action |
| --- | --- | --- |
| **Folder** (recommended) | Follow-up updates, iteration, versioned prompts | Create `[path]/figma-make-prompts/<feature-slug>/prompt.md` (confirm path and slug with user) |
| **Single file** | One-off prompt, user picks location | Write `[user-chosen-path].md` as plain markdown |

Default suggestion if the user has no preference: folder at `figma-make-prompts/<feature-slug>/prompt.md` in the project root.

On follow-up requests ("add mobile section", "update step 5"), **edit the existing file** at the agreed path — do not create a duplicate unless the user asks.

Skip the ask only when the user gives an explicit path (e.g. "write to `docs/figma/register-prompt.md`").

## Workflow

1. **Confirm delivery** — folder vs single file; agree on path and filename.
2. **Read inputs** — UI spec (authoritative for behavior/content) and style guide (authoritative for visual system).
3. **Extract inventory** — flows, screens/steps, component categories, state variants, edge cases, breakpoints, interaction timings, layout patterns.
4. **Choose scope** — include only what the spec requires: desktop, mobile, tablet, responsive doc, interaction specs, developer handoff pages.
5. **Draft the prompt** — read [prompt-template.md](references/prompt-template.md), apply its filling rules, and produce a fully expanded prompt (no bracket placeholders).
6. **Write the file** — save as plain `.md` on disk at the agreed path. Do not wrap the file body in chat code fences.

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

Return to the user in chat (not the full prompt body):

1. **Path** — absolute or repo-relative path to the written `.md` file.
2. **Summary** — one sentence on what the prompt covers.
3. **Gaps** — any spec detail marked TBD or missing.
4. **Copy instruction** — tell the user to open the file and copy all contents into Figma Make.

**Do not** paste the full prompt inside chat code fences — tables, blockquotes, and headings break fence parsing and produce a broken copy.

If the user insists on in-chat delivery, write the file anyway, then say copying from the file is the reliable method. Only paste inline as a last resort if they explicitly refuse a file and the prompt has no content that conflicts with markdown fencing.

## Follow-up updates

When the user revises the prompt:

1. Read the existing file at the agreed path.
2. Apply requested changes.
3. Overwrite the same file unless the user asks for a new path or versioned copy.

Do not write to Figma directly; this skill only produces the prompt markdown file.
