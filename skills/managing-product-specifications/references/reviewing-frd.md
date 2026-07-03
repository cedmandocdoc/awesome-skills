# Reviewing FRD

## Overview

**Review mode.** Read-only unless the user asks to apply edits.

## Prerequisites

Authoring standards: [creating-frd.md](./creating-frd.md) and [spec-contract.md](./spec-contract.md).

## Guidelines

### When to apply

- Reviewing `features/<slug>/frd.md` before implementation
- Checking feature scope and hub links

### Workflow

1. Resolve docs root per [spec-contract.md](./spec-contract.md) → **Finding docs root**; then resolve feature `frd.md` under `<docs-root>`
2. Read `prd.md` when linked
3. Read sibling specs if the user asked for package review
4. Run checklist; deliver output format

### Checklist

#### Frontmatter and hub

- `doc_type: frd`, `scope: feature`, `feature`, `apps`, `depends_on`, `related` present
- **Related documents** matches files on disk or TBD consistently
- `apps` matches PRD feature description

#### Content quality

- **Functional requirements** are testable and prioritized
- **Business rules** and **edge cases** cover failure modes
- **Acceptance criteria** align with requirements
- **Out of scope** prevents creep
- **Dependencies** on other features or systems are explicit

#### Upstream / downstream

- Feature fits PRD in-scope items (or documents intentional PRD drift)
- Missing user story / UI / TRD siblings flagged when build-ready review requested

## Examples

### Report template

```markdown

### Severity guidance

[Readiness for downstream specs and main recommendation]

- [...]

### Must fix
- [...]

### Should fix
- [...]

### Consider
- [...]

[e.g. create user-story.md, resolve open dependency]
```

## Related

- [creating-frd.md]
