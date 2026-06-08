# Creating UI specs

**Docs only.** Writes product or feature UI specs: `ui-specs.md` or `ui-specs-<app>.md`.

## 1. Resolve target path

Per [spec-contract.md](./spec-contract.md) → **Path resolution**.

| Scope | Examples | Path |
| --- | --- | --- |
| Product visual language | "design system", "product UI language" | `<docs-root>/ui-specs.md` |
| Product per app | "web UI conventions" | `<docs-root>/ui-specs-<app>.md` |
| Feature shared | "checkout UX intent" | `<docs-root>/features/<slug>/ui-specs.md` |
| Feature per app | "checkout web screens" | `<docs-root>/features/<slug>/ui-specs-<app>.md` |

If file exists → [updating-ui-specs.md](./updating-ui-specs.md) unless overwrite confirmed.

## 2. Read prerequisites

| Target | Read first |
| --- | --- |
| Product `ui-specs*.md` | `prd.md` |
| Feature `ui-specs*.md` | `frd.md`; feature `user-story*.md`; product `ui-specs*.md` chain per inheritance |

Product `ui-specs.md` = brand, tokens, visual direction. Feature `ui-specs-<app>.md` = screens and interactions. Inherit tokens; do not redefine without reason.

## 3. Choose tier

Default: **standard**. Feature per-app docs include screen inventory at standard tier.

## 4. Write UI specs

Use [`../assets/ui-specs.md`](../assets/ui-specs.md). Required:

- Frontmatter per contract
- **Visual direction** (modern, flat, round, etc.) — product or inherited
- **Design tokens** table when product-level or comprehensive tier
- **Screens** with layout, content, states (empty, loading, error) for feature per-app docs
- **Accessibility** minimum at standard tier

Do not invent flows or visuals unsupported by user story / FRD.

## 5. Sync FRD hub

If feature-scoped → update `frd.md` `related.ui_specs` or `ui_specs_by_app`.

## 6. Confirm to the user

Reply with path, upstream docs read, suggested next docs (typically `trd-<app>.md` or Figma handoff if applicable).

**Stop without implementing** application code.
