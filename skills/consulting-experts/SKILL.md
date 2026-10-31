---
name: consulting-experts
id: 158dc23a-6a08-4149-afee-e60992c7edea
description: >-
  Assembles the experts any goal needs — research, verification, analysis of a
  design or prototype, a UI prototype, or anything else. Declares the goal, the
  output, and the team (each expert's job, whether a subagent or the main agent
  plays it, and the order), confirms them with the user, runs the team, and
  delivers the output in the form and place the user asked for. Use only when
  the user names this skill (`/consulting-experts`, `$consulting-experts`, or
  "consulting-experts").
version: 1.0.0
---

# Consulting Experts

## Setup

| Item | Kind | Required | When | Done when | How |
| --- | --- | --- | --- | --- | --- |
| Subagents | user | optional | All | The harness offers a subagent tool | Run in a harness with subagents, such as Claude Code |

## Workflow

1. **Setup** — for each **Setup** row whose When covers the request, in order: Done when holds → skip; `user` → stop and print its How when required, continue without it when optional; `ask` → fill what the request answers, ask the rest together in one message, record each answer; `auto` and `static` → run.
2. **Recipe** — match one **Recipes** row; open every doc in its Read column.

- Runs no expert before the user confirms the team.

## Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Set up | "Set up consulting-experts", "Is consulting-experts ready?" | **Setup** — run Workflow step 1 for every row, then report each row's state |
| Consult | "/consulting-experts based on my prototype, am I heading the right way for a general HRIS + payroll?", "/consulting-experts research what a clinic booking app must handle" | [executing-consultation.md](references/executing-consultation.md) |
