# Invocation Contract

## Overview

How a skill loads and which standing rule it writes into the project. Every skill answers two independent questions, **Loads** and **Standing rule**. The answers fix the frontmatter `description`, the Agent workflow intro, `agents/openai.yaml`, and `SKILL.md` → **Setup**. Changing either answer is a minor version bump.

## Guidelines

### Loads

| Answer | Pick when | Skill gets |
| --- | --- | --- |
| **Explicit** | The skill owns files under a marked root, or the user decides when it runs | **Explicit trigger** wording in `description` and the Agent workflow intro; `default_prompt` matches |
| **Implicit** | Work reaches the skill's task or stack without naming it | `description` names the task or stack fingerprint (packages, config files, platform), never generic words (UI, state, design, session); `default_prompt` matches |

A plain-name mention counts as a trigger for both answers: standing rules, task files, and a second skill in one message name skills in plain text.

### Explicit trigger

`description`:

```text
Use only when the user names this skill (`/<name>`, `$<name>`, or "<name>"), or references a file under a marked <thing> root (`@<root>/<example>`).
```

Agent workflow intro:

```text
Follow this skill when the user names it, or references a file under a <thing> root marked by an `index.md` with this skill's author signature.
```

Drop the file clause when the skill owns no files.

| Explicit skill also | Add |
| --- | --- |
| Owns files to reference | Marked root: `<root>/index.md` with frontmatter `doc_type`, `generated_by`, and `author` = the skill's author signature UUID |
| Takes over the chat | Hard block: `disable-model-invocation: true` in frontmatter and `policy.allow_implicit_invocation: false` in `agents/openai.yaml`. Only `/<name>` or `$<name>` loads it; the intro says so. |

### Standing rule

| Answer | Pick when | Line |
| --- | --- | --- |
| **None** | Work without the skill needs nothing from it | — |
| **Pointer** | Work without the skill must follow it | `- <scope> follows <name>; load it before <work>.` |
| **Keep-true** | The skill's files describe something that changes outside it | `- When a change alters <what>, run the <name> <recipe> recipe in the same work.` |

A Pointer or Keep-true answer adds one `SKILL.md` → **Setup** row; the Agent workflow intro resolves **Setup** before recipes:

```markdown
| Item | Required | When | How |
| --- | --- | --- | --- |
| Standing rule | required | <recipe or entry that first creates the root, app, or workspace> | Add `<line>` to root `AGENTS.md` (create when missing) and to root `CLAUDE.md` when it exists without importing `AGENTS.md`; skip a file that has it |
```

The line names the skill by plain name. That recipe's Confirm step reports the instruction files changed.

### Checklist

- [ ] `description`, Agent workflow intro, and `default_prompt` state the same trigger for the **Loads** answer
- [ ] Hard-block flags appear together, only on an explicit skill that takes over the chat
- [ ] An explicit trigger with a file clause has a marked root
- [ ] **Standing rule** Pointer or Keep-true ⇔ exactly one **Standing rule** Setup row, and its recipe's Confirm reports the instruction files

## Related

- [skill-contract.md](./skill-contract.md) — frontmatter, sections, `agents/openai.yaml`
