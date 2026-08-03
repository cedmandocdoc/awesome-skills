# Reviewing Skill Leanness

## Overview

**Review mode.** Read-only leanness audit of a skill document. Delivers a findings report; applies edits only when the user asks, then follows [updating-skill-leanness.md](./updating-skill-leanness.md).

## Prerequisites

Categories, scope levels, and strategies per [lean-contract.md](./lean-contract.md).

## Guidelines

### 1. Read the target

Read the full `SKILL.md` and every linked reference in the skill under review. Note the document's declared instructions and scope — the leanness test is relative to them.

### 2. Scan per category

Pass through the document once per finding category. For each finding record:

- Location (file, heading, line range)
- Category and scope level (phrase / section / document)
- Quoted excerpt
- Suggested lean rewrite, or "delete" when nothing replaces it

### 3. Assess structure

Beyond line-level findings, check the document against the strategy table:

- [ ] Repeated instructions extracted to one place and linked
- [ ] Each rule lives under exactly one heading
- [ ] Global constraints stated once (mode line or intro)
- [ ] Active voice throughout
- [ ] Lists, tables, or diagrams used where prose describes enumerable or branching content

### 4. Deliver the report

Report findings grouped by category using the template below, then structural recommendations, then an estimated size reduction. Stop after the report.

## Examples

### Report template

```markdown
# Leanness review — <skill-name>

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

- [updating-skill-leanness.md](./updating-skill-leanness.md) — apply the findings
