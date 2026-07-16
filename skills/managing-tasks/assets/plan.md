---
name: {{TASK_TITLE}}
overview: {{ONE_LINE_OVERVIEW}}
generated_by: managing-tasks
task_type: {{implementation|spike}}
plan_revision: 1
todos:
  - id: {{STEP_ID_1}}
    content: "{{STEP_DESCRIPTION_1}}"
    status: pending
  - id: {{STEP_ID_2}}
    content: "{{STEP_DESCRIPTION_2}}"
    status: pending
  - id: verify
    content: "{{VERIFICATION_STEP}}"
    status: pending
---

# {{TASK_TITLE}} ({{TASK_ID}})

## Goal

{{WHAT_DONE_LOOKS_LIKE}}

## Requirements

- **Sources:** {{URLs, ticket/PRD paths, Figma/design links, screenshots, @-mentioned docs — or "none"}}
- **Scope:** {{components, screens, packages, platforms named by the user}}
- **Constraints:** {{style guide, reuse rules, stack limits, "ask before…" — or "none"}}
- **Acceptance:** {{done criteria from the user}}

## Non-goals

- {{OUT_OF_SCOPE_1}}
- {{OUT_OF_SCOPE_2}}

## Context

- **Area:** {{package, app, or subsystem}}
- **Primary files:** {{paths}}
- **Skills to load:** {{skill names, or "none"}}
- **References:** {{skill reference basenames, e.g. creating-feature or skill-name/creating-feature — or "none"}}
- **Depends on:** {{prerequisite task folder names under the tasks root, e.g. `001-auth-schema` — or "none"}}
- **Related tasks:** {{informational sibling task folder links — or "none"}}

## Approach

{{STRATEGY_OR_RESEARCH_QUESTIONS_OR_OMIT}}

## Current vs target

{{BRIEF_DIFF_OR_OMIT}}

## Phases

### Phase 1 — {{TITLE}}

{{STEPS_WITH_FILE_PATHS}}

### Phase 2 — {{TITLE}}

{{STEPS_WITH_FILE_PATHS}}

## Verification checklist

- [ ] {{ACCEPTANCE_1}}
- [ ] {{ACCEPTANCE_2}}
- [ ] Typecheck / lint passes for affected packages
- [ ] Manual smoke: {{flow}}

## Risks

| Risk | Mitigation |
| --- | --- |
| {{risk}} | {{mitigation}} |
