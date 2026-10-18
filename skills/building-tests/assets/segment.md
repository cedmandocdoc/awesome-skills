---
doc_type: test-segment
id: "[segment-id, same as the filename]"
title: "[Actor + intent, e.g. Customer approves a proposed price]"
status: ready
actor: "[persona role, or system]"
surfaces: ["[surface-id]"]
given: "[state-id or none]"
then: "[state-id or none]"
params: { "[role or key]": "[persona id or value]" }
covers: ["[code path or glob]"]
cases:
  - { id: happy, status: ready, source: "[user | path#heading | draft]" }
  - { id: "[case-id]", status: pending, source: "[…]", then: "[override, optional]" }
---

# [Title]

[One line: what the actor gets done.]

## Given

[The Given state in plain words; who is signed in.]

## When

1. [Action in the actor's words, no selectors]

## Then

- [What the actor sees]
- [The Then state in plain words]

## Cases

| Case | Differs by | Then |
| --- | --- | --- |
| happy | — | As above |
| [case-id] | [input or condition] | [what differs] |
