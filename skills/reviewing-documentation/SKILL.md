---
name: reviewing-documentation
description: Reviews Markdown and AI-facing documentation for clarity, structure, style, and formatting against project writing standards. Use when reviewing docs, doc PRs, SKILL.md or rules, or when the user asks whether documentation is well written or needs improvement.
---

# Reviewing documentation

## When to apply

- Reviewing `.md` files, skills (`SKILL.md`), rules, `AGENTS.md`, or similar instructional docs
- Answering whether documentation reads well or meets quality expectations
- Suggesting edits before merge or publication

**Authoring standards** (full detail): [writing-documentation](../writing-documentation/SKILL.md). This skill turns those expectations into a review workflow.

## Review workflow

1. **Identify doc type** — User guide, reference, skill, rule, changelog, etc. Apply type-appropriate expectations (e.g. skills need frontmatter and progressive disclosure).
2. **Read the full document** (or the changed sections if the user scoped a diff). Note audience and purpose.
3. **Run the checklist** below. Cite concrete locations (headings, bullets, or short quotes) when flagging issues.
4. **Deliver feedback** using the output format in the next section.

## Checklist (aligned with writing-documentation)

### Core principles

- **Clarity** — Main ideas obvious; steps and terms understandable on first read.
- **Conciseness** — No filler, repetition, or vague throat-clearing; every section earns its place.
- **Structure** — Logical heading hierarchy; sections match the doc’s goal; scannable flow.
- **Consistency** — Same terms for the same concepts; parallel structure in lists; tone stable throughout.

### Writing style

- **Active voice**, **present tense**, **third person** for descriptions and instructions.
- Jargon defined or avoided unless the audience is clearly expert.
- **Scannability** — Bullets and tables where they help; short sentences.
- Instructional text is **actionable** (clear who does what and when).

### Markdown formatting

- Valid heading levels, lists, and code fences; no broken nesting.
- Inline **code**, commands, and paths use backticks; emphasis used sparingly and consistently.
- Blank lines between block-level elements for readability.

### New documentation (greenfield)

If the doc presents as **new** (not a small update): flag when neither a user-provided template nor an agreed outline appears to have been followed before the body was written.

### Skills (`SKILL.md`)

- YAML frontmatter includes `name` and `description` (non-empty, discovery-friendly description).
- Body stays focused; deep detail lives in linked `reference.md` / `examples.md` when appropriate, not pasted inline.

### Rules and AI-facing docs

- Matches expected rule format for the project (e.g. frontmatter if used).
- Instructions scoped and executable; no contradictory or overlapping bullets without hierarchy.

## Output format

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

## Examples

**Input:** User pastes a skill draft and asks if it is well written.

**Output:** Summary states whether it meets writing-documentation; checklist results; Must fix if `description` is vague or body is a wall of text without reference split; Should fix for passive voice or missing backticks on paths.

**Input:** PR that only tweaks one section.

**Output:** Scope review to changed lines plus consistency with surrounding sections; avoid re-reviewing unrelated pages unless the user asks.
