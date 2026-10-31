# Executing Consultation

## Overview

**Execution mode.** Declares the team of experts a goal needs, confirms it with the user, runs it, and delivers the output. The declaration keeps one shape; the experts, their jobs, and the output follow the goal.

## Guidelines

### 1. Read the goal

Take the goal from the request and the chat, then read what it points at. With no goal, ask for it in one sentence and stop.

### 2. Declare the team

Reason out the expertise the goal needs and show this in one message, asking the user to confirm or edit it:

```markdown
**Goal:** <what the user wants, in one line>
**Output:** <what the user gets> → <where it goes>

| Expert | Job | Runs as | Order |
| --- | --- | --- | --- |
| <expertise> | <what it answers or produces> | Subagent or Main agent | <number> |
```

| Field | Rule |
| --- | --- |
| Output | The form and place the request names, else one assumption for the user to correct |
| Expert | One row per job. Split the work by its parts so no two jobs overlap. The goal sets the count |
| Runs as | `Subagent` when the job stands alone. `Main agent` when it needs every earlier result, needs the user, or the harness has no subagents |
| Order | Rows with the same number run together. A row that reads another row's result gets a later number |

When the output will claim something holds, the last row is a `Challenger` that tries to prove it wrong.

### 3. Brief each subagent

A brief is a general subagent's spawn prompt. Each brief holds:

| Part | Content |
| --- | --- |
| Role | The expert it plays and the team's goal |
| Context | What its job needs, as paths or content; it knows nothing else |
| User | What the user can and can't judge |
| Job | Its row. Where the job touches another expert's, it names the connection and stops |
| Stance | Establish how things really are, then check the work against that; defend nothing |
| Evidence | Outside facts carry a primary source with URL and date; the rest is marked `UNVERIFIED` |
| Skills | It loads any installed skill its job needs |
| Files | Read-only unless its job produces files |
| Return | A format and a word limit, the same format across rows of one Order |

A `Challenger` brief gets the result without the reasoning behind it, and adds:

- Prove the result wrong with concrete cases from outside what the team examined.
- Work out expected answers from outside sources or by hand, never from the work under test.
- Separate real breaks from what only needs filling in.
- Return the breaks ranked by damage, and what held up.

### 4. Run the team

Run each Order after the previous one finishes. Main-agent rows follow the same **Stance** and **Evidence**.

After each Order, check the claims later work rests on against their source or the project before using them.

When a result calls for an expert not on the table, show its row and wait for the user before running it.

### 5. Deliver

1. Check each `Challenger` break, then fix the real ones or record them as open in the output.
2. Write the output in the confirmed form and place, framed for what the user can judge. Every source and `UNVERIFIED` mark stays on its fact.

### 6. Confirm to the user

Reply with:

- Where the output is
- The decisions left to the user
- What nobody outside the team confirmed: `UNVERIFIED` claims, anything no practitioner, real data, or real user has tested, and a `Challenger` the main agent played
