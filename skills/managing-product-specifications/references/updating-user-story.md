# Updating a user story

**Docs only.** Amends existing `user-story.md` or `user-story-<app>.md`.

## 1. Resolve path

Per [spec-contract.md](./spec-contract.md) → **Resolve docs root**, **Finding docs root**, and **Path resolution**. If missing → [creating-user-story.md](./creating-user-story.md).

## 2. Read current state

1. Read target file and inheritance chain
2. Read `prd.md` or `frd.md` as scope doc
3. Skim related `ui-specs*.md` if present (journey alignment)

## 3. Gather changes

- New stories, journey steps, acceptance criteria, alternate paths

Ask **at most one** clarifying question if ambiguous.

## 4. Update file

1. Bump `spec_revision`; append **Spec changelog**
2. Preserve section order unless restructure requested
3. Keep shared vs app-specific concerns in the correct file (do not move web-only steps into shared file without user request)
4. Sync `frd.md` `related` if feature-scoped

## 5. Flag downstream drift

List `ui-specs*.md` and `trd*.md` that may need review after journey changes.

## 6. Confirm to the user

Reply with `spec_revision`, changelog summary, downstream review list.

**Stop without implementing** application code.
