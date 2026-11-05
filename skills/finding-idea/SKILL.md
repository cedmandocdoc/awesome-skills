---
name: finding-idea
id: 96497f95-a4aa-4cbd-a080-cd0b1ec348b8
description: >-
  Finds app ideas worth building by searching for real problems: researches where
  an industry or audience complains and asks for help, writes each problem as who
  struggles, with what, and today's workaround with quoted evidence, ranks them by
  pain, frequency, willingness to pay, and buildability, and proposes the top apps
  with their core features and hero flow. Use only when the user names this skill
  (`/finding-idea`, `$finding-idea`, or "finding-idea").
version: 1.0.0
---

# Finding Idea

## Setup

| Item | Kind | Required | When | Done when | How |
| --- | --- | --- | --- | --- | --- |
| Web search and fetch | user | required | All | The harness offers web search and page fetch tools | Run in a harness with web access, such as Claude Code |

## Workflow

1. **Setup** — for each **Setup** row whose When covers the request, in order: Done when holds → skip; `user` → stop and print its How when required, continue without it when optional; `ask` → fill what the request answers, ask the rest together in one message, record each answer; `auto` and `static` → run.
2. **Recipe** — match one **Recipes** row; open every doc in its Read column.

## Recipes

| Intent | Example phrasing | Read |
| --- | --- | --- |
| Set up | "Set up finding-idea", "Is finding-idea ready?" | **Setup** — run Workflow step 1 for every row, then report each row's state |
| Find ideas | "/finding-idea dentist clinics in Metro Manila", "/finding-idea apps for salons", "/finding-idea" | [searching-problems.md](references/searching-problems.md) |
