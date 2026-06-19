# Managing API Error

## Overview

Use this guide to keep **user-facing error copy** in `src/api/`. Every failed API call throws **`ApiError`**; feature hooks pass it through; screens and async wrappers only choose **where** and **when** to show `error.message`.

## Prerequisites

- [creating-api.md](./creating-api.md)
- [setting-up-axios.md](./setting-up-axios.md)

## Guidelines

### `ApiError` contract

Use one class in `src/libs/ApiError.ts` that extends `Error`.

| Field | Role |
| ----- | ---- |
| `message` | User-facing copy. UI reads this only. |
| `status` | Optional HTTP status (logging, API-layer branching—not new UI copy). |
| `code` | Optional app-level code (domain enum). Not raw transport strings in UI. |
| `cause` | Optional original error for debugging. |

### Structure

```text
src/libs/ApiError.ts

src/api/<backend-name>/
├── client.ts
├── env.ts
├── utils.ts        # toApiError, FALLBACK_MESSAGE
├── models/         # types; <Domain>Error enum when needed
└── modules/        # endpoint functions; inline custom mapping in catch
```

- Put domain error enums in `models/<Domain>.ts` only when UI needs a stable app code.
- Keep `toApiError` in `utils.ts` for the default path.
- Put rare, endpoint-specific mapping **inline** in that function’s `catch`—no separate `*.errors.ts` files.

### Layer responsibilities

| Layer | Owns | Does not own |
| ----- | ---- | ------------- |
| **`src/api/`** | Map transport failures to `ApiError`; finalize `message` (reuse backend copy when safe; else fallback). | React, navigation, toast vs inline layout. |
| **Feature hooks** | Call API functions; let failures propagate. | Rewriting messages for display. |
| **Screens / async UI** | Pass `query.error` through; show `error.message` on initial failure. | Parsing Axios or duplicating fallback strings. |

### Mapping rules

1. Reuse backend user copy when the payload already has a safe message (`response.data.message`, documented `error` field, etc.).
2. Map only when needed—missing payload, network offline, or non-user-facing text. Use a short generic fallback (for example “Something went wrong. Please try again.”).
3. Always throw `ApiError` from exported module functions.
4. Fall back to `toApiError(err)` when no special case matches.

Export `FALLBACK_MESSAGE` from `utils.ts` so UI fallbacks stay aligned with the API layer.

### App codes vs transport codes

| Aspect | Transport | App (`models` + `ApiError.code`) |
| --- | --- | --- |
| Parsed in | `modules/<domain>.ts` `catch` | `new ApiError(…, { code: ProfileError.… })` |
| UI usage | Never branch on raw transport strings | Branch on domain enum only when layout/flow differs; otherwise use `message` |

### Custom mapping (uncommon)

Use only when `toApiError` cannot produce the right `message` or `code` for that endpoint.

| Situation | Approach |
| --------- | -------- |
| Safe user copy on the payload | `throw toApiError(err)` |
| Non-user-facing transport signal | Inline map → domain enum + `message`, then `throw new ApiError(…)` |
| Pre-request validation | `throw new ApiError("…", { code: … })` before the network call |

### TanStack Query

- `queryFn` / `mutationFn` call API functions directly; do not catch and reword for display.
- On failure, `query.error` / `mutation.error` is `ApiError` in normal operation.
- **Initial load error:** show `query.error.message` in async wrappers (see [creating-async-component.md](./creating-async-component.md)).
- **Pull-to-refresh / background refetch:** keep cached data visible; do not replace the screen with a new error layout.
- **Mutations:** show `mutation.error.message` beside the control or in a toast.

## Examples

### Default module function

```ts
export async function getWorkshops(client: AxiosInstance): Promise<Workshop[]> {
  try {
    return await responseData(client.get<Workshop[]>("/workshops"));
  } catch (err) {
    throw toApiError(err);
  }
}
```

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

### Wire into async UI

```tsx
<AsyncView
  isLoading={workshops.isLoading}
  error={workshops.isError ? workshops.error : undefined}
  reload={() => void workshops.refetch()}
>
  {/* ... */}
</AsyncView>
```

```tsx
function ErrorMessage({ error }: { error: unknown }) {
  const message =
    error instanceof ApiError ? error.message : FALLBACK_MESSAGE;
  return <Text className="text-center text-destructive">{message}</Text>;
}
```
