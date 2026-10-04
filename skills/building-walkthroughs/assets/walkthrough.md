---
doc_type: walkthrough
id: "[slug — same as the filename]"
title: "[Outcome in the user's words, e.g. Send an invoice]"
kind: "[core | branch]"
line: "[line id — core only]"
starts_from: "[baseline:<id> | walkthrough id]"
ends_with:
  - "[Fact true when this walkthrough finishes]"
actors: ["[Person]", "[App]"]
minutes: [5–15]
facets:
  "[key]": "[value]"
checkpoint: "[command that reaches this walkthrough's end state — optional]"
covers:
  - "[path/glob or spec#section this journey depends on]"
---

# [Title]

By the end, [what the user has done and seen].

## Before you start

- [Start from: the baseline command, or "finish [Walkthrough](walkthrough-id.md)"]
- [Who is logged in, on which surface]
- About [N] minutes

## Journey

```mermaid
sequenceDiagram
  actor P as [Person]
  participant A as [App]
  P->>A: [Action]
  A-->>P: [Visible result]
```

## Steps

### [Actor]

1. [One action] — click **[Exact label]**.
   - You should see: [something observable].
   - Why: [one or two sentences; link the spec section when there is one].

## Cases

| Case | Do | You should see |
| --- | --- | --- |
| [Variant input] | [What differs] | [The one observable difference] |

## Try it yourself

- [An open-ended variation to explore]

## Something looks wrong?

Report it as `[Title] › step [N] › what you saw`.
