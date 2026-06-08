# Creating a PRD

**Docs only.** Writes `<docs-root>/prd.md`. Do not create companion specs unless the user explicitly asks.

## 1. Resolve docs root

Per [spec-contract.md](./spec-contract.md) → **Resolve docs root** and **Finding existing specs**.

If `prd.md` already exists → stop; direct the user to [updating-prd.md](./updating-prd.md) unless they confirm overwrite.

## 2. Gather context

| Source | What to extract |
| --- | --- |
| User input | Product vision, users, goals, constraints |
| `README.md`, `AGENTS.md` | Product name, existing feature names |
| Existing specs | Related PRDs or partial docs in the repo |

Ask **at most one** clarifying question if product scope or audience is ambiguous.

## 3. Choose tier

Per [spec-contract.md](./spec-contract.md) → **Tier**. Default: **standard**.

## 4. Write `prd.md`

Use [`../assets/prd.md`](../assets/prd.md). Required:

- Full YAML frontmatter per contract (`doc_type: prd`, `scope: product`, `spec_revision: 1`)
- All template sections; omit or shorten sections per tier
- **Features** table: link each row to `features/<slug>/frd.md` only for features the user named; use TBD for planned features without FRDs yet
- **Related documents** table for product-level companions (mark TBD if not created)

Do not invent metrics, personas, or features unsupported by user input.

## 5. Confirm to the user

Reply with:

- Path to `prd.md`
- One-line summary
- Tier used
- Suggested next docs (e.g. `ui-specs.md` for visual language, `trd-web.md` for web baseline, first FRD) — **do not create them**

**Stop without implementing** application code.
