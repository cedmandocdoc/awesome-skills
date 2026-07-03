# Reviewing Documentation

## Overview

**Review mode.** Read-only unless the user asks to apply edits. Reviews `.md` files, skills (`SKILL.md`), rules, `AGENTS.md`, or similar instructional docs for quality before merge or publication.

## Prerequisites

Authoring standards: [creating-documentation.md](./creating-documentation.md).

## Guidelines

### Workflow

1. **Identify doc type** — User guide, reference, skill, rule, changelog, etc. Apply type-appropriate expectations (e.g. skills need frontmatter and progressive disclosure).
2. **Read the full document** (or the changed sections if the user scoped a diff). Note audience and purpose.
3. **Run the checklist** below. Cite concrete locations (headings, bullets, or short quotes) when flagging issues.
4. **Deliver feedback** using the report template in **Examples**.

### Checklist — core principles

- **Clarity** — Main ideas obvious; steps and terms understandable on first read.
- **Conciseness** — No filler, repetition, or vague throat-clearing; every section earns its place.
- **Structure** — Logical heading hierarchy; sections match the doc's goal; scannable flow.
- **Consistency** — Same terms for the same concepts; parallel structure in lists; tone stable throughout.

### Checklist — writing style

- **Active voice**, **present tense**, **third person** for descriptions and instructions.
- Jargon defined or avoided unless the audience is clearly expert.
- **Scannability** — Bullets and tables where they help; short sentences.
- Instructional text is **actionable** (clear who does what and when).

### Checklist — Markdown formatting

- Valid heading levels, lists, and code fences; no broken nesting.
- Inline **code**, commands, and paths use backticks; emphasis used sparingly and consistently.
- Blank lines between block-level elements for readability.

### Checklist — new documentation (greenfield)

If the doc presents as **new** (not a small update): flag when neither a user-provided template nor an agreed outline appears to have been followed before the body was written.

### Checklist — skills (`SKILL.md`)

- YAML frontmatter includes `name` and `description` (non-empty, discovery-friendly description).
- Body stays focused; deep detail lives in linked `reference.md` / `examples.md` when appropriate, not pasted inline.

### Checklist — rules and AI-facing docs

- Matches expected rule format for the project (e.g. frontmatter if used).
- Instructions scoped and executable; no contradictory or overlapping bullets without hierarchy.

## Examples

### Report template

Use this structure so feedback is easy to act on:

```markdown
## Summary
[One short paragraph: overall quality and main recommendation]

## Strengths
- [What already meets the standards]

## Issues
### Must fix
- [Clarity, correctness, broken Markdown, missing required frontmatter, etc.]

### Should fix
- [Structure, consistency, conciseness, style]

### Consider
- [Optional polish: tone, extra scannability, minor wording]

## Suggested next steps
[Ordered list of edits or a single consolidated rewrite direction if simpler]
```

Severity names are guidance: **Must fix** blocks correctness or standards; **Should fix** improves quality materially; **Consider** is optional refinement.

### Full-doc review

User pastes a skill draft and asks if it reads well. Deliver Summary → Strengths → Issues → Suggested next steps. Flag Must fix when `description` is vague or the body is a wall of text without reference split; Should fix for passive voice or missing backticks on paths.

### Scoped review (PR diff)

User shares a doc PR diff. Review changed sections plus consistency with surrounding content unless the user asks for a full-doc pass.

## Related

- [creating-documentation.md](./creating-documentation.md)
