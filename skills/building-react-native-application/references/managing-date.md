# Managing Date

## Overview

Use date-fns for parsing, formatting, comparing, and manipulating dates. Keep API and storage boundaries on ISO 8601 strings; convert to `Date` (or `TZDate` when time zones matter) at feature and UI boundaries through shared helpers in `src/libs/date-utils/`.

## Prerequisites

- [managing-project-structure.md](./managing-project-structure.md) — `src/libs/` placement and import rules

## Guidelines

### Library choice

- Use **date-fns** for all date logic. Import only the functions each module needs.
- Use native `Date` as the in-memory type.
- When a dependency returns non-ISO strings, wrap parsing in `date-utils`.

### Placement

- Shared date helpers go in `src/libs/date-utils/`. Import as `@/libs/date-utils`.
- Keep format tokens, locale defaults, and parse rules in `date-utils`.
- Feature components may call date-fns directly for one-off cases; promote repeated patterns into `date-utils`.

### API and storage boundaries

- Transmit and persist **ISO 8601 strings** (`2024-03-15T14:30:00.000Z` or date-only `2024-03-15`).
- Parse API strings with `parseISO` and validate with `isValid` before use.
- Serialize outbound payloads with `toISOString()` on a validated `Date`.

### Formatting and locales

- Centralize display format strings in `date-utils` (e.g. `DISPLAY_DATE`, `DISPLAY_DATETIME`).
- Pass an explicit locale to `format`, `formatDistance`, and `formatRelative` when the app is not English-only.
- Import locales from `date-fns/locale`; include only locales the app ships.

### Comparisons

Use `isAfter`, `isBefore`, `isEqual`, `isWithinInterval`, `compareAsc` for ordering. Use `startOfDay`, `endOfDay`, `addDays`, `differenceInDays` for calendar math.

### Time zones

- For UTC-only or device-local display, native `Date` plus date-fns is enough.
- When a specific IANA time zone matters, use `@date-fns/tz` and `TZDate`.
- Store and exchange instants as UTC ISO strings; convert to user time zone only for display and input.

### Forms and UI

- Keep form state as `Date | null` or ISO string — pick one per form; convert at submit with `date-utils`.
- Wire native date pickers through the same parse/format helpers as API data.
- For relative labels, use `formatDistanceToNow` with `{ addSuffix: true }`.

### Testing

Use fixed ISO strings and `parseISO` in tests. Construct `TZDate` with an explicit zone when testing time zones.

## Setup

```bash
node ../scripts/run-package.cjs -- expo install date-fns
```

Time zone support (when needed):

```bash
node ../scripts/install-packages.cjs @date-fns/tz
```

## Examples

### Parse and format helpers

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

export function formatDisplayDateTime(date: Date | null | undefined): string {
  if (!date) return "";
  return format(date, DISPLAY_DATETIME);
}

export function toApiDateTimeString(date: Date): string {
  return date.toISOString();
}

export function formatRelativeToNow(iso: string): string {
  const date = parseISO(iso);
  if (!isValid(date)) return "";
  return formatDistanceToNow(date, { addSuffix: true });
}
```

### Time zone–aware display

```ts
import { format } from "date-fns";
import { TZDate } from "@date-fns/tz";

const DISPLAY_IN_TZ = "MMM d, yyyy h:mm a zzz";

export function formatInTimeZone(iso: string, timeZone: string): string {
  const date = new TZDate(iso, timeZone);
  return format(date, DISPLAY_IN_TZ);
}
```

## Related

- [managing-project-structure.md](./managing-project-structure.md) — `src/libs/date-utils/` placement
- [creating-api.md](./creating-api.md) — request/response typing for date fields

## References

- [date-fns on GitHub](https://github.com/date-fns/date-fns)
- [date-fns documentation](https://date-fns.org/docs/Getting-Started)
