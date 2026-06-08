---
name: {{TASK_TITLE}}
overview: {{ONE_LINE_OVERVIEW}}
generated_by: managing-tasks
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

## Non-goals

- {{OUT_OF_SCOPE_1}}
- {{OUT_OF_SCOPE_2}}

## Context

- **Area:** {{package, app, or subsystem}}
- **Primary files:** {{paths}}
- **Skills to load:** {{skill names, or "none"}}
- **References:** {{basenames from chosen skill(s) — recipes, index, or references/ — e.g. creating-feature or skill-name/creating-feature — or "none"}}
- **Related tasks:** {{links to sibling task folders, or "none"}}

## Current vs target

{{Brief bullet diff or mermaid diagram if helpful}}

## Phases

### Phase 1 — {{TITLE}}

{{Concrete steps with file paths and patterns to follow.}}

### Phase 2 — {{TITLE}}

{{...}}

## Verification checklist

- [ ] {{acceptance criterion 1}}
- [ ] {{acceptance criterion 2}}
- [ ] Typecheck / lint passes for affected packages
- [ ] Manual smoke: {{flow}}

## Risks

| Risk | Mitigation |
| --- | --- |
| {{risk}} | {{mitigation}} |
