# Reviewing a user story

**Review mode.** Read-only unless the user asks to apply edits.

## When to apply

- Reviewing user story docs before UI specs or implementation
- Checking journeys against FRD acceptance criteria

**Standards:** [creating-user-story.md](./creating-user-story.md) and [spec-contract.md](./spec-contract.md).

## Workflow

1. Resolve path; read inheritance chain and scope doc (`prd.md` or `frd.md`)
2. Read paired `ui-specs*.md` if user requested end-to-end review
3. Run checklist; deliver output format

## Checklist

### Structure

- Frontmatter complete; shared vs `-<app>` split is correct
- Stories use As / I want / So that with testable acceptance criteria

### Content quality

- Journeys cover happy path and material alternate/error paths
- Personas match PRD / FRD
- No implementation detail leaked (stays behavioral)
- App-specific file does not duplicate shared outcomes unnecessarily

### Consistency

- Acceptance criteria trace to FRD functional requirements
- Journey steps align with UI specs screens when both exist

## Output format

```markdown
## Summary
[...]

## Strengths
- [...]

## Issues
### Must fix
- [...]

### Should fix
- [...]

### Consider
- [...]

## Suggested next steps
[...]
```
