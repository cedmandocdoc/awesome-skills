# Executing Ideation

## Overview

**Planning only.** Shapes the idea in conversation; writes no files and no code. Runs from invocation until every branch in [idea-contract.md](./idea-contract.md) → **Idea tree** is resolved or parked, or the user asks to wrap up.

## Prerequisites

Per [idea-contract.md](./idea-contract.md) → **Idea tree**, **Branch states**, **Summary format**.

## Guidelines

### 1. Open the idea

1. Restate the idea in one line.
2. Resolve every branch the user's message, the chat, or the codebase already answers.
3. Show the tree in one compact line per branch (state and decision) and start the loop at the first open branch.

When the user gives no idea yet, ask for it in one sentence and stop.

### 2. Run the turn loop

Each turn takes the first open branch whose dependencies are met and picks one move:

| Situation | Move |
| --- | --- |
| Codebase, docs, or earlier chat answers it | **Look up** — state the finding and resolve the branch. Confirm only when it contradicts the user. |
| A conventional or easily reversed default exists | **Suggest** — propose the decision with a one-line reason; resolve it as `agent` unless the user objects. |
| Depends on the user's goals, taste, audience, business, or private constraints | **Ask** — one question with 2–4 options, the recommended option first and marked. |

Turn shape: one line acknowledging the last decision, then the move. Batch up to three related suggestions in one turn; ask one question per turn.

### Steering

- Contribute, not just collect: propose features, flows, or angles the user has not mentioned when they strengthen the core loop.
- Challenge scope: any feature that does not serve the core loop goes to **Out** unless the user argues it in.
- When the user jumps ahead (colors, naming, tech choice before the core loop), record the point under its branch and steer back to the open dependency. Follow the user if they insist.
- Surface a contradiction the moment it appears; reopen the affected branches per **Branch states**.

### Handling answers

| User says | Do |
| --- | --- |
| Picks or states an answer | Resolve as `user` |
| "You decide" | Take the recommendation; resolve as `agent` |
| "Not sure" | Give the recommendation with its trade-off; park the branch if still unsure |
| "Skip" / "later" | Park with the user's reason |
| "Recap" | Show the tree as in step 1.3 |

Show the tree unprompted after every five resolved branches.

### 3. Wrap up

1. When every branch is resolved or parked, or the user asks, print the summary per [idea-contract.md](./idea-contract.md) → **Summary format**.
2. **Next steps** lists the first concrete actions that follow from the decisions (for example a spec, a design, or a spike for the riskiest assumption).
3. After the summary, a later change reopens its branch and resumes the loop.
