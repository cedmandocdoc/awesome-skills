# Promoting Feature

## Overview

Use this guide to decide when and how to recategorize a feature component — either promoting it to `src/ui/` or extracting it into a new feature module.

## Guidelines

### Promotion changes categorization

When a "feature component" grows into something reusable, the module often needs to be recategorized:

- If it becomes **presentation-only**, promote it to a shared UI primitive in `src/ui/`.
- If it becomes **domain behavior used across multiple routes**, extract it into a new feature module under `src/features/`.
- If it stays tightly coupled to one route flow, keep it inside that route’s feature module.

Promotion should be reflected in folder placement *and* in the feature's export contract.

### When to promote to `src/ui/`

Promote when the component:

- Is presentation-only.
- Accepts props and renders UI.
- Does not decide routing, fetch data, or manage feature state.

### When to extract into a new `src/features/` module

Extract when the shared part:

- Encapsulates domain behavior that multiple routes use.
- Includes hooks/state/derived behavior that callers would otherwise duplicate.
- Needs its own feature boundary so it does not leak internal complexity into routes.

### How to keep boundaries consistent after extraction

- Routes compose features; features compose smaller features.
- Internal modules inside `src/features/<feature-name>/` may import each other freely.
- Other modules import through the feature barrel so internal paths stay encapsulated.

### Route interaction (typical flow)

1. `src/routes/...` route modules stay thin: they read route params (if any) and compose feature exports.
2. `src/features/<feature-name>/` owns the behavior: hooks, derived state, event handlers, and feature-specific UI composition.
3. `src/ui/` provides shared primitives used by feature components when presentation-only reuse is needed.

If the route ends up repeating the same composition in multiple places, that repetition usually belongs in a reusable feature module.

## Examples

### List-fetch-render (isolated feature)

- Feature: `src/features/workshop-list/`
- Exports: `WorkshopList` as the primary component, plus supporting `useWorkshops` and `Workshop` type.
- Route: `src/routes/workshops.index.tsx` (or equivalent) composes `<WorkshopList />`.

### Workflow grouping (grouped feature)

- Feature: `src/features/workshop-toolbar/`
- Exports: related components and helpers that callers need together.
- Routes remain under `src/routes/`; the feature supplies workshop-specific pieces.

### Promotion from route-specific to shared feature

- Initially: the block lives inside a per-route feature module.
- When reuse starts appearing: extract the shared behavior into `src/features/<new-shared-feature>/`.
- If the extracted part is presentation-only, promote it to `src/ui/` instead.
