---
doc_type: trd
scope: {{product|feature}}
feature: {{FEATURE_SLUG_OR_OMIT}}
app: {{APP_SLUG_OR_OMIT}}
tier: standard
spec_revision: 1
generated_by: managing-product-specifications
depends_on:
  - {{UPSTREAM_PATHS}}
inherits_from:
  - {{PARENT_TRD_PATHS}}
---

# {{TRD_TITLE}}

## Overview

{{SCOPE_AND_PURPOSE}}

## Technology stack

| Layer | Choice | Notes |
| --- | --- | --- |
| {{LAYER_1}} | {{TECH_1}} | {{NOTES_1}} |

## Architecture

{{MERMAID_ARCHITECTURE_DIAGRAM}}

## Data model and contracts

| Entity / endpoint | Description |
| --- | --- |
| {{ENTITY_1}} | {{DESCRIPTION_1}} |

## Communication flows

{{MERMAID_SEQUENCE_OR_FLOW_DIAGRAM}}

## Infrastructure

{{MERMAID_INFRA_DIAGRAM_OR_DESCRIPTION}}

## Security and authentication

- {{SECURITY_1}}

## Environments and deployment

| Environment | Purpose | Notes |
| --- | --- | --- |
| {{ENV_1}} | {{PURPOSE_1}} | {{NOTES_1}} |

## Tradeoffs and risks

| Decision | Rationale | Risk |
| --- | --- | --- |
| {{DECISION_1}} | {{RATIONALE_1}} | {{RISK_1}} |

## Open questions

- {{QUESTION_1}}
