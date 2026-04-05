# Handling Async in useEffect

## Overview

Use this guide when a component runs async work inside `useEffect` (API calls, deferred IO, etc.). Keep the effect callback synchronous, handle the promise with `.then()` and `.catch()`, and clean up so state updates do not run after unmount.

For server-backed lists and mutations, prefer **TanStack Query** (or similar) so fetching and caching stay out of raw effects when that fits the app.

## Guidelines

### Effect callback

- Do not mark the `useEffect` callback as `async`. An `async` function returns a `Promise`; React expects `undefined` or a **cleanup function**.
- Prefer chaining on the promise with `.then()`, `.catch()`, and `.finally()` when needed, inside a normal synchronous effect body.

### Cleanup and state updates

- Guard `setState` after async work with a **cancellation flag** in the cleanup, or use **`AbortController`** when the API supports it (for example `fetch` with `signal`).
- Ignore or skip handling **`AbortError`** in `.catch()` when abort is expected on unmount.

### Async/await inside the effect

- Avoid an inner `async` IIFE (`void (async () => { ... })()`). This stack prefers explicit `.then()` / `.catch()` in effects for consistency.

## Examples

### Promise chain with a cancellation flag

```tsx
useEffect(() => {
  let cancelled = false;

  fetchData(id)
    .then((data) => {
      if (!cancelled) {
        setData(data);
      }
    })
    .catch((err) => {
      if (!cancelled) {
        setError(err);
      }
    });

  return () => {
    cancelled = true;
  };
}, [id]);
```

### `fetch` with `AbortController`

```tsx
useEffect(() => {
  const controller = new AbortController();

  fetch(`/api/items/${id}`, { signal: controller.signal })
    .then((res) => {
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    })
    .then((data) => setData(data))
    .catch((err) => {
      if (err.name === "AbortError") return;
      setError(err);
    });

  return () => controller.abort();
}, [id]);
```

### Avoid async effect callback

```tsx
// Avoid
useEffect(async () => {
  const data = await fetchData(id);
  setData(data);
}, [id]);
```

### Avoid async IIFE inside the effect

```tsx
// Avoid (prefer .then / .catch)
useEffect(() => {
  void (async () => {
    try {
      const data = await fetchData(id);
      setData(data);
    } catch (e) {
      setError(e);
    }
  })();
}, [id]);
```
