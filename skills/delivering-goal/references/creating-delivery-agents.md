# Creating Delivery Agents

## Overview

**Docs only.** Creates or refreshes `phase-deliverer` when the user asks to run `delivering-goal creating-delivery-agents`.

## Prerequisites

Per [goal-contract.md](./goal-contract.md) → **Subagent signature**, **Delivery agents**.

## Guidelines

### 1. Pick the target root

Use the first existing project root from **Delivery agents**. None → create `.agents/agents/`.

### 2. Write the agent

Template: [`../assets/agents/phase-deliverer.md`](../assets/agents/phase-deliverer.md).

1. Destination from the IDE filename pattern.
2. Write the IDE’s required frontmatter (`name`, `description`, model fields) plus `author` (**Subagent signature**) and `generated_by: delivering-goal`, then the template body.
3. Keep user-customized fields that do not conflict; refresh an unmodified managed body that diverges from the template.
4. Report retired agents found (`goal-planner`, `phase-decider`, `task-planner`, `task-triager`, `task-implementer`) so the user can delete them.

### 3. Confirm to the user

Reply with the target root and created / refreshed / skipped files (with reason). End with: `Delivery agent is ready. Re-run the original delivering-goal command.`
