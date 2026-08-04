# Managing API Error

## Overview

Keeps **user-facing error copy** in `src/api/`. Every failed API call throws `ApiError`; feature hooks pass it through; routes and components show `error.message`.

## Prerequisites

- [creating-api.md](./creating-api.md) — structure and layer boundaries

## Guidelines

### `ApiError` contract

One class in `src/libs/ApiError.ts` extending `Error`.

| Field | Role |
| ----- | ---- |
| `message` | User-facing copy. UI reads this only. |
| `status` | Optional HTTP status (logging, API-layer branching). |
| `code` | Optional app-level domain enum. |
| `cause` | Optional original error for debugging. |

### Layer responsibilities

| Layer | Owns | Does not own |
| ----- | ---- | ------------- |
| **`src/api/`** | Map transport failures to `ApiError`; finalize `message`. | React, routing, toast layout. |
| **Feature hooks** | Call API functions; let failures propagate. | Rewriting messages. |
| **Routes / components** | Show `error.message`; retry via `refetch`. | Parsing transport errors. |

### Mapping rules

1. Reuse backend user copy when the payload already has a safe message.
2. Map only when needed — missing payload, network failure, or non-user-facing text. Use a short generic fallback.
3. Always throw `ApiError` from exported module functions.
4. Fall back to `toApiError(err)` when no special case matches.

Export `FALLBACK_MESSAGE` from `utils.ts` so UI fallbacks stay aligned.

### App codes vs transport codes

| Aspect | Transport | App (`models` + `ApiError.code`) |
| --- | --- | --- |
| Parsed in | `modules/<domain>.ts` `catch` | `new ApiError(…, { code: DomainError.… })` |
| UI usage | Never branch on raw transport strings | Branch on domain enum only when layout differs; otherwise use `message` |

### Custom mapping (uncommon)

| Situation | Approach |
| --------- | -------- |
| Safe user copy on the payload | `throw toApiError(err)` |
| Non-user-facing transport signal | Inline map → domain enum + `message`, then `throw new ApiError(…)` |
| Pre-request validation | `throw new ApiError("…", { code: … })` before the network call |

### TanStack Query display rules

- `queryFn` / `mutationFn` call API functions directly.
- On failure, `query.error` / `mutation.error` is `ApiError`.
- **Initial load:** show `query.error.message` in error UI.
- **Background refetch:** keep cached data visible; optional toast is placement only.
- **Mutations:** show `mutation.error.message` beside the control or in a toast.

## Examples

### Inline custom mapping

```ts
} catch (err) {
  if (axios.isAxiosError(err) && err.response?.status === 409) {
    throw new ApiError("This handle is already taken.", {
      status: 409,
      code: ProfileError.HandleTaken,
      cause: err,
    });
  }
  throw toApiError(err);
}
```

### Display in route or feature UI

```tsx
if (workshops.isError) {
  return (
    <div>
      <QueryError error={workshops.error} />
      <button type="button" onClick={() => void workshops.refetch()}>
        Try again
      </button>
    </div>
  );
}
```

```tsx
function QueryError({ error }: { error: unknown }) {
  const message =
    error instanceof ApiError ? error.message : FALLBACK_MESSAGE;
  return <p role="alert">{message}</p>;
}
```
