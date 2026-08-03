# Creating Lean Skill

## Overview

**Authoring mode.** Writes a new skill document that is lean from the first draft: structure planned before prose, every line passing the leanness test.

## Prerequisites

Categories and strategies per [lean-contract.md](./lean-contract.md).

## Guidelines

### 1. Gather intent

Confirm with the user: purpose, trigger scenarios, target location, and any verbatim wording to preserve. Verbatim user text goes in unchanged.

### 2. Plan structure first

Before writing prose, outline headings and decide the format of each section:

| Content shape | Format |
| --- | --- |
| Ordered procedure | Numbered steps |
| Enumerable facts, options, routing | Table |
| Branching decision | Decision tree or mermaid diagram |
| Unordered rules | Bullet list |
| Anything a structure cannot express | Short prose |

Place each rule under exactly one heading. Put instructions needed by multiple sections in a shared reference (or contract) and link to it.

### 3. Write lean

- State each constraint once — mode line or intro, not per section
- Active voice, imperative, present tense
- Skip background the agent already knows; write only what changes behavior
- State positive rules without negative reconfirmation unless the exception is easy to miss or safety-critical

### 4. Self-review

Run one pass per finding category from the contract over the draft. Fix findings before delivering. Keep `SKILL.md` under ~500 lines; move detail to references linked one level deep.

### 5. Confirm to the user

Report the created paths, section map, and where shared instructions were extracted.

## Related

- [reviewing-skill-leanness.md](./reviewing-skill-leanness.md) — deeper audit of the result
