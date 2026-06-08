# Reviewing UI specs

**Review mode.** Read-only unless the user asks to apply edits.

## When to apply

- Reviewing UI specs before design handoff or FE implementation
- Checking visual consistency across apps

**Standards:** [creating-ui-specs.md](./creating-ui-specs.md) and [spec-contract.md](./spec-contract.md).

## Workflow

1. Resolve docs root per [spec-contract.md](./spec-contract.md) → **Finding docs root**; resolve target path; read inheritance chain (product `ui-specs.md` first)
2. Read `user-story*.md` and `frd.md` when feature-scoped
3. Run checklist; deliver output format

## Checklist

### Structure

- Frontmatter complete; product vs feature vs `-<app>` scope is correct
- Tokens inherited from product specs, not duplicated inconsistently

### Content quality

- **Visual direction** is explicit and coherent
- **Screens** define layout, content, and states (empty, loading, error)
- **Interaction and motion** specified where UX depends on them
- **Responsive** and **accessibility** covered at standard tier for per-app feature docs
- No screens or flows missing from user story journeys

### Consistency

- Terminology matches FRD and user story
- Feature UI specs do not contradict product visual language
- Web vs mobile deltas are intentional, not accidental drift

## Output format

```markdown
## Summary
[...]

## Strengths
- [...]

## Issues
### Must fix
- [Missing states, broken inheritance, journey gaps]

### Should fix
- [Token gaps, weak screen specs, a11y omissions]

### Consider
- [...]

## Suggested next steps
[...]
```
