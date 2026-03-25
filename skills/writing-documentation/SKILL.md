---
name: writing-documentation
description: Guides creating and updating concise, clear Markdown documentation with consistent structure and tone. Use when writing or editing .md files, Cursor skills (SKILL.md), rules (e.g. .cursor/rules), AGENTS.md, or other AI-facing documentation.
---

# Writing documentation

## When to apply

- Creating or updating Markdown documentation in the project
- Creating or updating AI-facing content: skills (`SKILL.md`), rules, similar instructional docs

## New documentation: template first

**Before drafting new documentation**, do not proceed with a full write-up until one of the following is satisfied:

1. **User provides a template** — follow it for structure and sections.
2. **No template given** — propose 1–2 concrete outline options (or a minimal default template: title, overview, sections matching the doc type) and confirm or adjust with the user before writing the body.

Updates to existing docs do not require this step unless the user is effectively starting a new doc from scratch.

## Core principles

1. **Clarity** — Easy to read and understand.
2. **Conciseness** — Brief, precise language; omit fluff.
3. **Structure** — Logical headings and subheadings.
4. **Consistency** — Same terminology, formatting, and tone across the project.

## Writing style

- **Active voice**, **present tense**, **third person** (descriptions and instructional text).
- Define jargon briefly when it cannot be avoided.
- Prefer bullets and tables for scannability.
- Short sentences.

## Formatting (Markdown)

- Correct heading/list/code-fence syntax.
- Backticks for inline code, commands, and file paths.
- **Bold** for emphasis; *italics* for first introduction of a technical term when helpful.
- Blank lines between sections.

## Skills and rules-specific notes

- **Skills**: Include YAML frontmatter with `name` and `description` when authoring `SKILL.md`; keep the body focused; use progressive disclosure (link to `reference.md` / `examples.md` only when needed).
- **Rules**: Match the project’s rule format (e.g. frontmatter if used); keep instructions actionable and scoped.
