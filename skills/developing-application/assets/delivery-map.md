---
doc_type: delivery-map
generated_by: developing-application
author: c3f5a7b9-4d2e-6f8a-0b1c-5e7d9f2a4c6b
map_revision: 1
delivery: "{{DELIVERY_NAME}}"
goal: "{{DELIVERY_GOAL}}"
---

# Delivery map — {{DELIVERY_NAME}}

## Goal

{{WHAT_DONE_LOOKS_LIKE_FOR_THIS_DELIVERY}}

## Sources

- {{PRD_PATH_OR_EQUIVALENT}}
- {{TRD_OR_HOW_PATH}}
- {{OTHER_SPEC_OR_DESIGN_PATHS}}

## Skills detected

- {{DOMAIN_SKILL_NAME_OR_none}}

## Current state

{{SURVEY_PARAGRAPH_GREENFIELD_OK}}

## Waves

Index only — full briefs live under `waves/`.

| Id | Title | Status | Depends on | Wave file | Task ids |
| --- | --- | --- | --- | --- | --- |
| 01-{{slug}} | {{TITLE}} | pending | none | none | none |
| 02-{{slug}} | {{TITLE}} | pending | 01-{{slug}} | none | none |

## Carry forward

- {{REUSE_REFACTOR_NOTES_OR_none}}

## Verification

Milestone smoke (no automated tests unless the project requires them):

- [ ] {{SMOKE_FLOW_1}}
- [ ] {{SMOKE_FLOW_2}}
- [ ] Typecheck / lint / build succeed for affected packages

## Changelog

| Rev | Date | Summary |
| --- | --- | --- |
| 1 | {{YYYY-MM-DD}} | Initial map |
