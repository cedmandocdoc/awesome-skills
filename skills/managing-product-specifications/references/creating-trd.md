# Creating a TRD

**Docs only.** Writes product or feature TRD: `trd.md` or `trd-<app>.md`.

## 1. Resolve target path

Per [spec-contract.md](./spec-contract.md) → **Path resolution**.

Determine from user message:

| Scope | Examples | Path |
| --- | --- | --- |
| Product platform | "system architecture" | `<docs-root>/trd.md` |
| Product app baseline | "web app TRD", "API stack" | `<docs-root>/trd-<app>.md` |
| Feature shared | "checkout technical design" | `<docs-root>/features/<slug>/trd.md` |
| Feature per app | "checkout web TRD" | `<docs-root>/features/<slug>/trd-<app>.md` |

If file exists → direct to [updating-trd.md](./updating-trd.md) unless overwrite confirmed.

## 2. Read prerequisites

Per [spec-contract.md](./spec-contract.md) → **Prerequisites** and **Inheritance**.

| Target | Read first |
| --- | --- |
| Product `trd.md` | `prd.md` |
| Product `trd-<app>.md` | `prd.md`; `trd.md` if present |
| Feature `trd.md` | `frd.md`; product `trd.md` if present |
| Feature `trd-<app>.md` | `frd.md`; product `trd-<app>.md`; feature `trd.md` if present |

Do not duplicate app baseline content in feature TRDs — reference and extend.

## 3. Choose tier

Default: **standard**. Use **comprehensive** when user requests full architecture package.

## 4. Write TRD

Use [`../assets/trd.md`](../assets/trd.md). Required:

- Frontmatter: `doc_type: trd`, correct `scope`, `feature` / `app` as applicable, `depends_on`, `inherits_from`
- Mermaid diagrams for architecture and communication flows (minimum one diagram at standard tier)
- Stack table, contracts, security, environments, tradeoffs per tier

## 5. Sync FRD hub

If feature-scoped and `frd.md` exists → update `related.trd` or `related.trd_by_app` and **Related documents** table.

## 6. Confirm to the user

Reply with:

- Path written
- Upstream docs read
- Diagrams included
- Suggested next docs (e.g. other `trd-<app>.md` for remaining apps)

**Stop without implementing** application code.
