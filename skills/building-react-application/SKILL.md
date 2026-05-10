---
name: building-react-application
description: Guides building React web applications with TypeScript using consistent patterns for effects, data fetching, component structure, shared JS utilities, and date handling. Use when implementing or reviewing React UI, hooks, side effects, or utility usage in browser-based apps.
version: 1.0.0
---

# React (web)

Opinionated patterns for React web apps: effects, async work, and conventions that keep hooks predictable and lint-friendly.

## When to use

- New or existing React web projects (TypeScript) where side effects and async flows should follow shared conventions
- Code review or implementation questions about `useEffect` and promise-based work
- Choosing or reviewing general-purpose JS utilities (debounce, chunk, object picks, lodash-style helpers) or date/time handling alongside React code
- Adding or extending reference docs for topics this skill covers (routing, forms, data fetching libraries, etc.)

## Utilities

Prefer established libraries over ad-hoc helpers. Import specific functions so bundlers can tree-shake.

| Focus                  | Doc / resources                                                                      | When to use                                                                                                                                                  |
| ---------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **General-purpose JS** | [es-toolkit](https://github.com/toss/es-toolkit)                                     | Debounce, chunk, object helpers; TypeScript-first types; optional **`es-toolkit/compat`** for lodash-shaped APIs; strong performance vs older utility stacks |
| **Dates and time**     | [date-fns](https://github.com/date-fns/date-fns) · [API docs](https://date-fns.org/) | Format, parse, compare, and manipulate native `Date` values; locale-specific formatting via `date-fns/locale`; first-class time zone support in v4+          |

**Agent skill (es-toolkit, recommended):** install the upstream skill so tooling has es-toolkit-specific guidance:

```bash
npx skills add toss/es-toolkit
```

Use that skill together with this one when adding or refactoring utilities (imports, compat migration, or picking functions over hand-rolled helpers).

## Hook implementation references

| Task / scenario                   | Doc                                                                             | When to use                                                         |
| --------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| **Handling async in `useEffect`** | [handling-async-in-use-effect.md](./references/handling-async-in-use-effect.md) | Promises in effects; `.then` / `.catch` vs `async` effect callbacks |

### Managing forms (TanStack Form)

TanStack Form guides (linked below use the **Solid** doc tree; for React web, use the same paths under `framework/react/guides/…` and [`@tanstack/react-form`](https://tanstack.com/form/latest/docs/framework/react/overview)).

| Topic                    | Doc                                                                                                          | When to use                                                                                  |
| ------------------------ | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| **Concepts**             | [Basic concepts](https://tanstack.com/form/latest/docs/framework/solid/guides/basic-concepts.md)             | Form options, instances, fields, field state/meta, validation basics, arrays                 |
| **Validation**           | [Form and field validation](https://tanstack.com/form/latest/docs/framework/solid/guides/validation.md)      | When to validate, field vs form validators, async + debounce, Standard Schema, submit gating |
| **Composition**          | [Form composition](https://tanstack.com/form/latest/docs/framework/solid/guides/form-composition.md)         | `createFormHook`, pre-bound fields/forms, `withForm` / `withFieldGroup`, lazy + tree-shaking |
| **Dynamic validation**   | [Dynamic validation](https://tanstack.com/form/latest/docs/framework/solid/guides/dynamic-validation.md)     | `onDynamic`, `revalidateLogic`, mode before/after first submit                               |
| **Async initial values** | [Async initial values](https://tanstack.com/form/latest/docs/framework/solid/guides/async-initial-values.md) | Loading remote defaults; pairing with TanStack Query                                         |
| **Linked fields**        | [Linked fields](https://tanstack.com/form/latest/docs/framework/solid/guides/linked-fields.md)               | Re-validate when another field changes (`onChangeListenTo` / `onBlurListenTo`)               |
| **Arrays**               | [Arrays](https://tanstack.com/form/latest/docs/framework/solid/guides/arrays.md)                             | List fields, `mode="array"`, nested keys, add/remove items                                   |
