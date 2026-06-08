# Creating Figma Make handoff prompts

**Authoring mode.** Apply when generating or updating a Figma Make handoff prompt markdown file.

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

On follow-up requests ("add mobile variant to step 5", "update Screens page"), **edit the existing file** at the agreed path — do not create a duplicate unless the user asks.

Skip the ask only when the user gives an explicit path (e.g. "write to `docs/figma/register-prompt.md`").

## Workflow

1. **Confirm delivery** — folder vs single file; agree on path and filename.
2. **Read inputs** — UI spec (authoritative for behavior/content) and style guide (authoritative for visual system).
3. **Extract inventory** — flows, screens/steps, component categories, state variants, edge cases, interaction timings, layout patterns.
4. **Choose scope** — include only what the spec requires: screen variants (desktop, mobile, states), interaction specs, developer handoff pages. Do not add a separate responsive/breakpoints page — mobile and state variants belong on the Screens page.
5. **Draft the prompt** — use [`../assets/prompt.md`](../assets/prompt.md); apply the filling rules below; produce a fully expanded prompt (no bracket placeholders).
6. **Write the file** — save as plain `.md` on disk at the agreed path. Do not wrap the file body in chat code fences.

## Filling rules

The final prompt is a **plain markdown file** on disk — not wrapped in chat code fences. The user copies the entire file into Figma Make.

1. **Replace every `[...]` placeholder** with concrete names, routes, components, states, and variants from the UI spec and style guide.
2. **Never ship bracket placeholders** (`[Component list from spec]`, `[Repeat ### ...]`, etc.) in the output.
3. **Expand repeat sections fully** — list every component category, every screen/step, and every variant the spec defines. Do not summarize with "repeat for all steps."
4. **Omit inapplicable sections entirely** — do not include `[Omit if not required]` notes or empty pages. Drop optional pages (e.g. Interaction Specs) when the spec does not require them; do not renumber remaining pages.
5. **Page names have no numeric prefix** — use `Cover`, `Design System Reference`, `Components`, `Screens`, etc. Never `01 — Cover` or `04 — Flows`.
6. **One Screens page only** — every screen, mobile variant, state, and edge case lives on a single `Screens` page. Stack screens vertically; lay out each screen's horizontal variants (mobile, states, edge cases) in a row beside the primary frame. Do not create separate Desktop Flow, Mobile Flow, or Responsive Behavior pages.
7. **Be exhaustive** — every screen, validation state, error state, and edge case in the UI spec must appear by name.
8. **Be specific** — use hierarchical component names (`Input/Text/Error`, `Button/Primary/Hover`) derived from the spec.
9. **Include timing rows** only for interactions the spec defines; omit the table if there is no motion detail.
10. **Write to the agreed path** — save as `.md` with valid markdown only (headings, lists, tables, blockquotes). No outer code-fence wrapper in the file.

## Extraction checklist

Before filling the template, confirm you have:

| From UI spec | Maps to |
| --- | --- |
| User flows / steps | Cover flow map, Screens page |
| Screens and routes | Screens page — one vertical stack |
| Mobile layouts | Horizontal variant beside each screen on Screens page |
| Component inventory | Components page |
| Validation & error states | Component states, horizontal screen variants |
| Edge cases | Horizontal variants or dedicated rows on Screens page |
| Layout descriptions | Screen row layout, layer organization |
| Interactions & timing | Interaction specs table |

| From style guide | Maps to |
| --- | --- |
| Type scale | Design system — typography |
| Color palette / tokens | Design system — colors |
| Spacing, radius, shadow | Design system sections |
| Component styling rules | Component states, token examples |

## Authoring rules

- **UI spec is source of truth** — state this in the prompt header. Do not reinterpret, simplify, or redesign flows.
- **Style guide is visual source of truth** — reference it in the Design System page; do not substitute a different aesthetic unless the user asks.
- **Be exhaustive for the spec** — every screen, state, and edge case in the UI spec should appear in the prompt.
- **Be specific** — name frames, components, variants, and states concretely (derived from the spec, not generic placeholders).
- **Production handoff intent** — auto layout, named layers, component variants, developer annotations.
- **Single Screens page** — all screens on one page, stacked vertically; each screen row scales horizontally for its mobile version, states, and variants. No separate mobile-flow or responsive-breakpoints pages.
- **Aesthetic direction (optional)** — if the user or spec mentions product references (e.g. Linear, Stripe), include them as inspiration while still following the spec and style guide.

## Prompt structure

Use this page order unless the project does not need a section:

| Page | Purpose |
| --- | --- |
| Cover | Title, overview, principles, flow map |
| Design System Reference | Tokens and usage from style guide |
| Components | Variant library grouped by category |
| Screens | All screens on one page — vertical stack; each screen row laid out horizontally for mobile, states, and variants |
| Interaction Specs | Prototype flows and timing (when applicable) |
| Developer Handoff | Layout specs, component mapping, state docs |

Page names have **no numeric prefix** (e.g. `Cover`, not `01 — Cover`). Do not create separate Desktop Flow, Mobile Flow, or Responsive Behavior pages.

Output shape: [`../assets/prompt.md`](../assets/prompt.md).

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

Do not write to Figma directly; this recipe only produces the prompt markdown file.
