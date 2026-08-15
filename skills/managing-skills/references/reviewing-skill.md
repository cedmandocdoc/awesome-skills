# Reviewing Skill

## Overview

**Review mode.** Read-only audit of a skill against the catalog contract and the leanness test. Delivers a findings report; applies edits only when the user asks, then follows [updating-skill.md](./updating-skill.md).

Scope to leanness when the user asks only to trim or audit verbosity. Scope to structure when they ask only about layout, sections, or the contract. Default: both.

## Prerequisites

[skill-contract.md](./skill-contract.md). [lean-contract.md](./lean-contract.md).

## Guidelines

### 1. Read the target

Per [skill-contract.md](./skill-contract.md) → **Resolve target skill**. Read the full `SKILL.md` and every linked reference. Note the document’s declared instructions and scope — the leanness test is relative to them.

### 2. Contract pass

When structure is in scope, run [skill-contract.md](./skill-contract.md) → **Checklist**. Record each miss with file, heading, and the checklist row it fails.

### 3. Leanness pass

When leanness is in scope, pass through the document once per finding category. For each finding record:

- Location (file, heading, line range)
- Category and scope level (phrase / section / document)
- Quoted excerpt
- Suggested lean rewrite, or "delete" when nothing replaces it

Then check the strategy table:

- [ ] Repeated instructions extracted to one place and linked
- [ ] Each rule lives under exactly one heading
- [ ] Global constraints stated once (mode line or intro)
- [ ] Active voice throughout
- [ ] Lists, tables, or diagrams used where prose describes enumerable or branching content

### 4. Deliver the report

Report contract misses first, then findings grouped by category using the template below, then structural recommendations, then an estimated size reduction. Stop after the report.

## Examples

### Report template

```markdown
# Skill review — <skill-name>

## Contract
- `SKILL.md`: missing `id` in frontmatter.
- `references/foo.md`: uses a top-level section not in the reference section list.

## Findings

### Noise
- `SKILL.md` › Overview (lines 10–14, section): explains what markdown is. Delete.

### Negative redundancy
- `references/creating-x.md` › Guidelines (line 32, phrase): "Read exactly one recipe.
  Do not load other recipes." → keep the first sentence only.

## Structure
- The retry rule appears in 3 recipes; extract to the contract and link.
- Steps section is prose; convert to a numbered list.

## Estimate
~180 → ~120 lines (-33%)
```

## Related

- [updating-skill.md](./updating-skill.md) — apply the findings
- [creating-skill.md](./creating-skill.md) — new skill instead of a review
