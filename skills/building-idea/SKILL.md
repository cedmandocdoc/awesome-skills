---
name: building-idea
id: c8cd6566-5342-40cd-bca7-f270308159e7
description: >-
  Builds out an application or feature idea with the user through a steered
  conversation — each turn asks one question, suggests a default, or looks the
  answer up, walking an idea tree from problem to MVP scope, flows, data, and
  stack until every branch is decided or parked. Use only when the user names
  this skill (`/building-idea` or `$building-idea`).
version: 1.2.0
disable-model-invocation: true
---

# Building Idea

## Setup

None.

## Workflow

1. **Setup** — for each **Setup** row whose When covers the request, in order: Done when holds → skip; `user` → stop and print its How when required, continue without it when optional; `ask` → fill what the request answers, ask the rest together in one message, record each answer; `auto` and `static` → run.
2. **Contract** — read [idea-contract.md](references/idea-contract.md).
3. **Recipe** — match one **Recipes** row; open every doc in its Read column.

- Once invoked, it steers the rest of the chat.

## Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Build an idea | "/building-idea a habit tracker for remote teams", "/building-idea" | [executing-ideation.md](references/executing-ideation.md) |
