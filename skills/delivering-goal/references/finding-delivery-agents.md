# Finding Delivery Agents

## Overview

**Read-only.** Checks whether required `delivering-goal` delivery agents exist before orchestration runs.

## Prerequisites

Per [goal-contract.md](./goal-contract.md) → **Subagent signature**, **Delivery agent roots**, **Discovering project skills**.

## Guidelines

### Required agents by workflow

| Workflow | Required agent ids |
| --- | --- |
| delivering-goal (loop) | `goal-planner`, `phase-decider` |
| planning-goal via subagent | `goal-planner` |
| deciding-next-phase via subagent | `phase-decider` |

### 1. Detect IDE and agent roots

Resolve candidate roots per **Delivery agent roots**.

### 2. Validate each required agent

For each required agent id:

1. Search candidate roots by filename pattern.
2. Read frontmatter from matches.
3. Accept the first file where:
   - `name` matches required id
   - `author` matches **Subagent signature**
   - `generated_by` is `delivering-goal`

Track `found_agents` and `missing_agents`.

### 3. Return one of two outcomes

If `missing_agents` is non-empty, stop immediately and reply with exactly:

`Create the subagent first by running delivering-goal creating-delivery-agents.`

If every required agent is found, continue with the calling workflow.

## Related

- [creating-delivery-agents.md](./creating-delivery-agents.md)
- [delivering-goal.md](./delivering-goal.md)
