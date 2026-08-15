# Lean Contract

## Overview

Shared definitions for all managing-skills recipes: what counts as a finding, at what scope, and which strategies produce a lean document. Recipes cite these categories and strategies by name.

## Guidelines

### Leanness test

A line earns its place when removing it would change what the agent does. Apply this test to every sentence; the categories below name the common ways a line fails it.

### Finding categories

| Category | Definition | Signals |
| --- | --- | --- |
| Noise | Content that does not change agent behavior given the document's stated instructions and scope | Background on concepts the agent already knows, restated context, sections outside the declared scope |
| Redundancy | Restates an instruction already given clearly elsewhere in the document | Same rule under two headings, a summary that repeats the steps, per-section repetition of a global constraint |
| Negative redundancy | Negative reconfirmation of a positive rule — "Do only X, Y, Z. Do not do A, B, C." | A "do not" clause whose content is already excluded by the positive rule. Keep the negative only when the exception is easy to miss or safety-critical |
| Motivational filler | Encouragement or importance claims that carry no instruction | "This is critical!", "Remember, quality matters", "Always strive for excellence" |
| Commentary | Narration about the document or its authoring rationale | "This section explains…", "We chose this approach because…", meta-notes to the reader |
| Duplicate phrases | Verbatim or near-verbatim phrase repetition | Same sentence in Overview and Guidelines, the same qualifier appended to every bullet |

### Finding scope

Record each finding at the narrowest level that contains it:

- **Phrase** — a clause or sentence within an otherwise lean section
- **Section** — a whole heading whose content fails the leanness test
- **Document** — the entire file duplicates another document or falls outside the skill's scope

### Lean writing strategies

| Strategy | Practice |
| --- | --- |
| Extract shared instructions | Move instructions repeated across sections into one reference doc (or one section) and link from each place that needs them |
| Categorize | Group rules under clear headings so each rule lives in exactly one place; route with tables instead of restating |
| State constraints once | Put a boundary in a mode line or intro instead of repeating it per section |
| Active voice | Imperative, present tense; state what to do directly. Pair a positive with a negative only when the exception is easy to miss or safety-critical |
| Representational formats | Match the content shape to a format (table below). Prose only for what a structure cannot express |
| Progressive disclosure | `SKILL.md` routes. Detail lives in `references/` linked one level deep |
| Style | Short sentences. Backticks for inline code, commands, and paths. Blank lines between sections |

### Content shape

| Content shape | Format |
| --- | --- |
| Ordered procedure | Numbered steps |
| Enumerable facts, options, routing | Table |
| Branching decision | Decision tree or mermaid diagram |
| Unordered rules | Bullet list |
| Anything a structure cannot express | Short prose |

### Prefer

| Prefer | Instead of |
| --- | --- |
| “Read exactly one recipe for the user’s intent.” | “Read exactly one recipe. Do not load other recipes.” |
| “Ask the user when multiple candidates exist.” | “Do not guess when multiple candidates exist.” |
| “Stop without implementing unless the user also asks to implement.” | “Do not write application code unless …” (when the mode line already says **Planning only**) |

## Related

- [skill-contract.md](./skill-contract.md) — layout, naming, independence
