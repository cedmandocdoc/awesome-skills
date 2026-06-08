---
doc_type: user-story
scope: {{product|feature}}
feature: {{FEATURE_SLUG_OR_OMIT}}
app: {{APP_SLUG_OR_OMIT}}
tier: standard
spec_revision: 1
generated_by: managing-product-specifications
depends_on:
  - {{UPSTREAM_PATHS}}
inherits_from:
  - {{PARENT_USER_STORY_PATHS}}
---

# {{USER_STORY_TITLE}}

## Context

{{LINK_TO_PRD_OR_FRD_AND_BRIEF_CONTEXT}}

## Personas

| Persona | Goal in this flow |
| --- | --- |
| {{PERSONA_1}} | {{GOAL_1}} |

## User journey

| Step | User action | System response |
| --- | --- | --- |
| 1 | {{ACTION_1}} | {{RESPONSE_1}} |

## Stories

### {{STORY_GROUP_1}}

**As a** {{PERSONA}}, **I want** {{WANT}}, **so that** {{BENEFIT}}.

**Acceptance criteria:**

- [ ] {{AC_1}}

## Alternate and error paths

| Path | Trigger | Expected outcome |
| --- | --- | --- |
| {{ALT_PATH_1}} | {{TRIGGER_1}} | {{OUTCOME_1}} |

## Open questions

- {{QUESTION_1}}
