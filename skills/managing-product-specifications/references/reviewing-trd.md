# Reviewing TRD

## Overview

**Review mode.** Read-only unless the user asks to apply edits.

## Prerequisites

Authoring standards: [creating-trd.md](./creating-trd.md) and [spec-contract.md](./spec-contract.md).

## Guidelines

### When to apply

- Reviewing TRD before implementation
- Checking technical completeness against FRD and product TRD

### Workflow

1. Resolve docs root per [spec-contract.md](./spec-contract.md) → **Finding docs root**; resolve TRD path under `<docs-root>`; read `inherits_from` chain fully
2. Read scope doc (`prd.md` or `frd.md`)
3. Run checklist; deliver output format

### Checklist

#### Structure and frontmatter

- `doc_type: trd`, `scope`, `depends_on`, `inherits_from` correct
- App baseline vs feature TRD scope is clear (no duplicated baseline prose)

#### Technical content

- **Stack** choices justified
- **Architecture** diagrams match described components
- **Data model / contracts** align with FRD functional requirements
- **Communication flows** cover happy path and material error paths
- **Security** and **environments** addressed when relevant
- **Tradeoffs** document meaningful decisions

#### Consistency

- Feature TRD does not contradict product `trd-<app>.md` baseline
- Cross-app feature TRDs agree on shared contracts (`trd.md` at feature level)

## Examples

### Report template

```markdown

### Severity guidance

[Implementation readiness and main recommendation]

- [...]

### Must fix
- [Architecture gaps, contract mismatches, missing security]

### Should fix
- [Diagram clarity, weak tradeoffs, incomplete flows]

### Consider
- [...]

[...]
```

## Related

- [creating-trd.md]
