# Creating an FRD

**Docs only.** Writes `<docs-root>/features/<slug>/frd.md`. Do not auto-create sibling specs.

## 1. Resolve docs root and slug

Per [spec-contract.md](./spec-contract.md) → docs root, **Feature slug**.

If `frd.md` already exists → stop; direct to [updating-frd.md](./updating-frd.md) unless the user confirms overwrite.

## 2. Gather context

| Source | What to extract |
| --- | --- |
| User input | Feature behavior, rules, apps involved, acceptance criteria |
| `prd.md` | Personas, product scope, feature placement — **read if present** |
| Related FRDs | Adjacent features for dependency notes |

If `prd.md` is missing → ask once: create PRD first, or proceed with TBD upstream references.

Determine `apps` list (e.g. `[web]`, `[web, api]`). Ask **at most one** question if apps are ambiguous in a monorepo.

## 3. Choose tier

Per [spec-contract.md](./spec-contract.md) → **Tier**. Default: **standard**.

## 4. Write `frd.md`

Use [`../assets/frd.md`](../assets/frd.md). Required:

- Frontmatter: `doc_type: frd`, `scope: feature`, `feature`, `apps`, `depends_on` → `../../prd.md`
- Initialize `related` with sibling paths; mark missing siblings as TBD in **Related documents** body
- All template sections per tier

Do not invent behavior unsupported by user input or PRD.

## 5. Sync PRD feature index

If `prd.md` exists → add or update the Features table row linking to this FRD. If the user did not ask to update PRD, note the suggested PRD edit in the confirmation message.

## 6. Confirm to the user

Reply with:

- Path to `frd.md`
- `apps` list
- One-line summary
- Suggested next docs in dependency order: `user-story.md` → `ui-specs.md` / `ui-specs-<app>.md` → `trd.md` / `trd-<app>.md`

**Stop without implementing** application code.
