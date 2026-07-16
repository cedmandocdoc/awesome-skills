# Findings Contract

## Overview

**Validation rules** for spike handoff document `findings.md`. Structure comes from [`../assets/findings.md`](../assets/findings.md) (skeleton only). Use this contract when writing or completing a spike — not when executing ordinary implementation tasks.

## Guidelines

### Purpose

Use for tasks whose primary output is feasibility discovery, requirement clarification, or investigation synthesis.

### Location and naming

- File path: `<tasks-root>/<NNN>-<slug>/findings.md`
- One findings document per spike task folder
- Keep the file stable as the decision artifact for handoff

### Frontmatter

Every `findings.md` includes YAML frontmatter:

| Field | Purpose |
| --- | --- |
| `doc_type` | Must be `task-findings` |
| `generated_by` | Must be `managing-tasks` |
| `task_type` | Must be `spike` |
| `recommendation` | `feasible` \| `not feasible` \| `conditional` |
| `confidence` | `low` \| `medium` \| `high` |
| `last_updated` | Date in `YYYY-MM-DD` |

### Required sections

`findings.md` must include all of the following:

| Section | Required content |
| --- | --- |
| `## Overview` | What was investigated, boundaries, and context needed by the next reader |
| `## Feasibility` | Explicit recommendation label (`feasible`, `not feasible`, or `conditional`) and rationale |
| `## Deliverables` | Comprehensive, actionable list of outputs needed after this investigation |

### Deliverables rules

Deliverables must be concrete enough for immediate follow-up planning:

- Use checklist items with clear outcomes
- Include dependencies, approvals, and unresolved risks when relevant
- Identify what should become a new implementation task versus prerequisite work
- Avoid duplicate narrative already covered in `Overview` or `Feasibility`

### Feasibility decision rules

| Label | Use when |
| --- | --- |
| `feasible` | Constraints and dependencies are acceptable for proceeding |
| `not feasible` | Constraints, risk, or cost make the proposal unsuitable now |
| `conditional` | Feasible only if specific prerequisites or decisions are met |

When using `conditional`, list each condition in `## Feasibility` and mirror them as action items in `## Deliverables`.

### Handoff quality checklist

Before considering a spike complete:

- Recommendation label is explicit and matches frontmatter
- Rationale cites key assumptions and tradeoffs
- Deliverables can be translated into one or more follow-up tasks without additional interpretation
- Open risks or blockers are visible in deliverables
