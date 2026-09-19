# Idea Contract

## Overview

Governs the idea tree the session walks, the state of each branch, and the wrap-up summary format.

## Guidelines

### Idea tree

Walk branches in this order. A branch opens once every branch it depends on is resolved or parked.

| # | Branch | Resolved when | Depends on |
| --- | --- | --- | --- |
| 1 | Problem | One sentence: who struggles, with what, and today's workaround | — |
| 2 | Users | Primary user named; secondary users listed or `none` | 1 |
| 3 | Core loop | The repeated action that delivers value: trigger → action → payoff | 2 |
| 4 | MVP scope | **In** list, each item serving the core loop; **Out** list for later | 3 |
| 5 | Key flows | Each **In** item as steps from entry to done, plus first run | 4 |
| 6 | Data | Entities, key fields, relationships, who owns each record | 5 |
| 7 | Platform and stack | Surfaces (web, mobile, API), auth, integrations, hosting constraints | 4 |
| 8 | Risks | Riskiest assumption, cheapest test for it, success signal | 3 |

For a feature inside an existing app, resolve **Platform and stack** and existing **Data** from the codebase first.

### Branch states

| State | Meaning |
| --- | --- |
| Open | No decision yet |
| Resolved | Meets its **Resolved when** criteria; records the decision and who made it (`user` or `agent`) |
| Parked | Deliberately deferred by the user; records why |

A later answer that contradicts a resolved branch reopens that branch and every branch that depends on it.

### Summary format

Self-contained: readable without the chat.

```markdown
## Idea: <one-line pitch>

### Decisions

| Branch | Decision | By |
| --- | --- | --- |
| Problem | … | user |

### MVP scope

- **In:** …
- **Out:** …

### Parked

- <branch or topic> — <why>

### Open risks

- <assumption> — <cheapest test>

### Next steps

1. …
```
