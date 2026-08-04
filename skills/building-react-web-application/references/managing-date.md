# Managing Date

## Overview

Handles date parsing, formatting, comparison, and manipulation with [date-fns](https://github.com/date-fns/date-fns). Keeps API and storage boundaries on ISO 8601 strings; converts to `Date` (or `TZDate` for time zones) at feature and UI boundaries through shared helpers in `src/libs/date-utils/`.

## Prerequisites

- [managing-project-structure.md](./managing-project-structure.md) — `src/libs/` placement and import rules

## Guidelines

### Library choice

- Use **date-fns** for all date logic. Import only the functions each module needs for tree-shaking.
- Use native `Date` as the in-memory type.
- When a dependency returns non-ISO strings, wrap parsing in `date-utils`.

### Placement

- Put shared date helpers in `src/libs/date-utils/` (file or folder with `index.ts` per [managing-project-structure.md](./managing-project-structure.md)).
- Import from app code as `@/libs/date-utils`.
- Keep format tokens, locale defaults, and parse rules in `date-utils`; features call named helpers.
- Feature components may call date-fns directly for one-off cases; promote repeated patterns into `date-utils`.

### API and storage boundaries

- Transmit and persist **ISO 8601 strings** (`2024-03-15T14:30:00.000Z` or date-only `2024-03-15` when the API contract is calendar dates).
- Parse API strings with `parseISO` and validate with `isValid` before use.
- Serialize outbound payloads with `toISOString()` on a validated `Date`, or a project helper matching the API contract.

### Formatting and locales

- Centralize display format strings in `date-utils` (e.g. `DISPLAY_DATE`, `DISPLAY_DATETIME`).
- Pass an explicit locale from `date-fns/locale` to `format`, `formatDistance`, and `formatRelative` when the app is not English-only; include only locales the app ships.

### Comparisons and calendar math

Use date-fns helpers for ordering, range checks, and calendar arithmetic.

### Time zones

- For **UTC-only** or **device-local** display, native `Date` plus date-fns is enough.
- When a specific IANA time zone matters (scheduling, reporting), use `@date-fns/tz` and `TZDate`.
- Store and exchange instants as UTC ISO strings; convert to the target time zone only for display and input.

### Forms and UI

Keep form state as `Date | null` or an ISO string — pick one per form; convert at submit with `date-utils` helpers. Date pickers supply `Date` values; wire them through the same parse/format helpers as API data.

## Setup

### Install date-fns

```bash
node ../scripts/install-packages.cjs date-fns
```

### Install time zone support (when needed)

```bash
node ../scripts/install-packages.cjs @date-fns/tz
```

## Examples

### Parse and format helpers (`src/libs/date-utils/format.ts`)

```ts
import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";

export const DISPLAY_DATE = "MMM d, yyyy";
export const DISPLAY_DATETIME = "MMM d, yyyy h:mm a";

export function parseApiDateTime(value: string | null | undefined): Date | null {
  if (!value) return null;
  const date = parseISO(value);
  return isValid(date) ? date : null;
}

export function formatDisplayDate(date: Date | null | undefined): string {
  if (!date) return "";
  return format(date, DISPLAY_DATE);
}

export function toApiDateTimeString(date: Date): string {
  return date.toISOString();
}
```

### Time zone–aware display

```ts
import { format } from "date-fns";
import { TZDate } from "@date-fns/tz";

export function formatInTimeZone(iso: string, timeZone: string): string {
  return format(new TZDate(iso, timeZone), "MMM d, yyyy h:mm a zzz");
}
```

## Related

- [managing-project-structure.md](./managing-project-structure.md) — `src/libs/date-utils/` placement
- [creating-api.md](./creating-api.md) — request/response typing for date fields
- [creating-form-component.md](./creating-form-component.md) — date fields in forms

## References

- [date-fns on GitHub](https://github.com/date-fns/date-fns)
- [date-fns documentation](https://date-fns.org/docs/Getting-Started)
