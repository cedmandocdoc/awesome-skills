# Updating a PRD

**Docs only.** Amends existing `<docs-root>/prd.md`.

## 1. Resolve path

Per [spec-contract.md](./spec-contract.md) → **Resolve docs root** and **Finding docs root**. Target: `<docs-root>/prd.md`.

If missing → direct the user to [creating-prd.md](./creating-prd.md).

## 2. Read current state

1. Read full `prd.md` (frontmatter + body)
2. Note `spec_revision`, Features table, Related documents, open questions

## 3. Gather changes

From the user message, determine:

- New or changed goals, personas, scope, features, NFRs
- Features to add, rename, or mark out of scope

Ask **at most one** clarifying question if the amend scope is ambiguous.

## 4. Update `prd.md`

1. Bump `spec_revision` in frontmatter
2. Append **Spec changelog** per [spec-contract.md](./spec-contract.md)
3. Edit sections; **preserve heading order** unless the user requests restructure
4. Sync **Features** table:
   - New feature → add row with link to `features/<slug>/frd.md` (create FRD only if user also asked)
   - Renamed feature → update slug and links; flag orphaned `features/` folders
5. Sync **Related documents** if product companions were created elsewhere

## 5. Flag downstream drift

List specs that may need review after this PRD change (FRDs, product `user-story.md`, `ui-specs.md`, `trd*.md`).

## 6. Confirm to the user

Reply with:

- `spec_revision` and changelog summary
- What changed vs preserved
- Downstream docs to review

**Stop without implementing** application code.
