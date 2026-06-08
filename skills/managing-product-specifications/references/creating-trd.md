# Creating a TRD

**Docs only.** Writes product or feature TRD: `trd.md` or `trd-<app>.md`.

## 1. Resolve docs root

Per [spec-contract.md](./spec-contract.md) → **Resolve docs root**, **Finding docs root**, and **Initialize docs root** (if needed).

## 2. Resolve target path

Per [spec-contract.md](./spec-contract.md) → **Path resolution**.

Determine from user message:

| Scope | Examples | Path |
| --- | --- | --- |
| Product platform | "system architecture" | `<docs-root>/trd.md` |
| Product app baseline | "web app TRD", "API stack" | `<docs-root>/trd-<app>.md` |
| Feature shared | "checkout technical design" | `<docs-root>/features/<slug>/trd.md` |
| Feature per app | "checkout web TRD" | `<docs-root>/features/<slug>/trd-<app>.md` |

If file exists → direct to [updating-trd.md](./updating-trd.md) unless overwrite confirmed.

## 3. Read prerequisites

Per [spec-contract.md](./spec-contract.md) → **Prerequisites** and **Inheritance**.

| Target | Read first |
| --- | --- |
| Product `trd.md` | `prd.md` |
| Product `trd-<app>.md` | `prd.md`; `trd.md` if present |
| Feature `trd.md` | `frd.md`; product `trd.md` if present |
| Feature `trd-<app>.md` | `frd.md`; product `trd-<app>.md`; feature `trd.md` if present |

Do not duplicate app baseline content in feature TRDs — reference and extend.

## 4. Choose tier

Default: **standard**. Use **comprehensive** when user requests full architecture package.

## 5. Write TRD

Use [`../assets/trd.md`](../assets/trd.md). Required:

- Frontmatter: `doc_type: trd`, correct `scope`, `feature` / `app` as applicable, `depends_on`, `inherits_from`
- Mermaid diagrams for architecture and communication flows (minimum one diagram at standard tier)
- Stack table, contracts, security, environments, tradeoffs per tier

## 6. Sync FRD hub

If feature-scoped and `frd.md` exists → update `related.trd` or `related.trd_by_app` and **Related documents** table.

## 7. Confirm to the user

Reply with:

- Docs root path and file path written
- Upstream docs read
- Diagrams included
- Suggested next docs (e.g. other `trd-<app>.md` for remaining apps)

**Stop without implementing** application code.
