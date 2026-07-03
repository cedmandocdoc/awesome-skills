# Reviewing PRD

## Overview

**Review mode.** Read-only unless the user asks to apply edits.

## Prerequisites

Authoring standards: [creating-prd.md](./creating-prd.md) and [spec-contract.md](./spec-contract.md).

## Guidelines

### When to apply

- Reviewing `prd.md` before build or stakeholder sign-off
- Checking product scope completeness

### Workflow

1. Resolve docs root per [spec-contract.md](./spec-contract.md) → **Finding docs root**; then read `<docs-root>/prd.md`
2. Read the full document (or scoped sections if the user limited the review)
3. Run the checklist below
4. Deliver feedback using the output format

### Checklist

#### Frontmatter and structure

- `doc_type: prd`, `scope: product`, `generated_by`, `spec_revision` present
- Required sections exist for the stated tier
- Features table links use valid `features/<slug>/frd.md` paths

#### Content quality

- **Problem** and **goals** are clear and measurable where claimed
- **Personas** match stated audience; no orphan features
- **In scope / out of scope** are explicit and non-contradictory
- **NFRs** cover security, performance, or compliance when the product requires them
- **Open questions** are honest gaps, not hidden decisions

#### Consistency

- Feature names match linked FRD titles (if FRDs exist)
- Related documents table reflects files on disk or marks TBD consistently
- Terminology stable across sections

## Examples

### Report template

```markdown

### Severity guidance

[One short paragraph: readiness and main recommendation]

- [What meets standards]

### Must fix
- [Blocking gaps, contradictions, broken links]

### Should fix
- [Clarity, metrics, missing NFRs, weak scope boundaries]

### Consider
- [Optional polish]

[Ordered list: e.g. create FRD for X, resolve open question Y]
```


## Related

- [creating-prd.md]
