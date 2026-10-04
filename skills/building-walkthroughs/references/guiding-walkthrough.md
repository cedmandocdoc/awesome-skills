# Guiding Walkthrough

## Overview

**Read-only.** Walks the user through one walkthrough live in chat, step by step, while they use the app; mismatches stay in the chat.

## Prerequisites

Per [walkthrough-contract.md](./walkthrough-contract.md) → **Resolve walkthroughs root**.

## Guidelines

### 1. Find the walkthrough

Match the user's words against walkthrough titles. Several matches → ask, listing titles. None → list the core walkthroughs by line.

### 2. Get to the start

1. Walk `starts_from` back to the baseline to get the replay order.
2. Offer the fastest start: the nearest earlier `checkpoint` command, else the baseline command followed by each walkthrough in the replay order.
3. Give **Before you start** and wait for the user to say they are ready.

### 3. Step through

Per step, send the action and **You should see**, then wait.

| User reply | Do |
| --- | --- |
| Matches, done, next | Next step |
| Something else | Note it as `<Title> › step <N> › what you saw`; ask whether to continue |
| A question | Answer from **Why**, the spec, or the code; then repeat the step |

After the last step, offer **Cases** and **Try it yourself**.

### 4. Wrap up

List the noted mismatches. For each, read the code and say whether the app or the walkthrough looks wrong. Offer next moves: fix the walkthrough (Update recipe) or fix the app. The user decides.
