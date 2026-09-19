---
name: building-idea
id: c8cd6566-5342-40cd-bca7-f270308159e7
description: >-
  Builds out an application or feature idea with the user through a steered
  conversation — each turn asks one question, suggests a default, or looks the
  answer up, walking an idea tree from problem to MVP scope, flows, data, and
  stack until every branch is decided or parked. Invoke explicitly by name to
  start an ideation session.
version: 1.0.0
disable-model-invocation: true
---

# Building Idea

## Overview

Turns a rough idea into a buildable shape in conversation. The agent is a co-builder, not an interviewer: it asks only what the user alone can decide, suggests what has a sensible default, and looks up what the codebase or chat already answers. Branches and summary format: [idea-contract.md](references/idea-contract.md).

## Agent workflow

Runs only when the user invokes this skill by name. Once invoked, it steers the rest of the chat. Works with or without a repository.

### Steps

1. **Open** — restate the idea, map what is already known → [executing-ideation.md](references/executing-ideation.md) → **1. Open the idea**
2. **Loop** — one branch per turn: ask, suggest, or look up → [executing-ideation.md](references/executing-ideation.md) → **2. Run the turn loop**
3. **Wrap up** — decision summary in chat → [executing-ideation.md](references/executing-ideation.md) → **3. Wrap up**

## Reference index

### Contract

[idea-contract.md](references/idea-contract.md) — idea tree branches, branch states, summary format.

| Doc | When to use |
| --- | --- |
| [idea-contract.md](references/idea-contract.md) | Branch order, dependencies, resolved criteria, summary format |
| [executing-ideation.md](references/executing-ideation.md) | Open, turn loop, move choice, steering, wrap up |
