# Managing Date

## Overview

Use [date-fns](https://github.com/date-fns/date-fns) for parsing, formatting, comparing, and manipulating dates. Keep API and storage boundaries on ISO 8601 strings; convert to `Date` (or `TZDate` when time zones matter) at feature and UI boundaries through shared helpers in `src/libs/date-utils/`.

## Prerequisites

- [managing-project-structure.md](./managing-project-structure.md) — `src/libs/` placement and import rules

## Guidelines

### Library choice

- Use **date-fns** for all date logic. Import only the functions each module needs so bundlers can tree-shake.
- Use native `Date` as the in-memory type.
- When a dependency returns non-ISO strings, wrap parsing in `date-utils`.

### Placement

- Put shared date helpers in `src/libs/date-utils/` (file or folder with `index.ts` per [managing-project-structure.md](./managing-project-structure.md)).
- Import from app code as `@/libs/date-utils`.
- Keep format tokens, locale defaults, and parse rules in `date-utils`; features call named helpers from `date-utils`.
- Feature components may call date-fns directly for one-off cases; promote repeated patterns into `date-utils`.

### API and storage boundaries

- Transmit and persist **ISO 8601 strings** (`2024-03-15T14:30:00.000Z` or date-only `2024-03-15` when the API contract is calendar dates).
- Parse API strings with `parseISO` and validate with `isValid` before use.
- Serialize outbound payloads with `toISOString()` on a validated `Date`, or a project helper that matches the API contract.

### Formatting and locales

- Centralize display format strings in `date-utils` (for example `DISPLAY_DATE`, `DISPLAY_DATETIME`).
- Pass an explicit locale to `format`, `formatDistance`, and `formatRelative` when the app is not English-only:

```ts
import { format } from "date-fns";
import { enUS } from "date-fns/locale";

format(date, "PPP", { locale: enUS });
```

- Import locales from `date-fns/locale`; include only locales the app ships.

### Comparisons and intervals

- Use `isAfter`, `isBefore`, `isEqual`, `isWithinInterval`, and `compareAsc` for ordering and range checks.
- Use `startOfDay`, `endOfDay`, `addDays`, `subDays`, `differenceInDays`, and related helpers for calendar math.

### Time zones

- For **UTC-only** or **device-local** display, native `Date` plus date-fns is enough.
- When a specific IANA time zone matters (scheduling, reporting, “office hours”), use **date-fns v4** time zone support via `@date-fns/tz` and `TZDate`.
- Store and exchange instants as UTC ISO strings; convert to the user or resource time zone only for display and input.

### Forms and UI

- Keep form state as `Date | null` or an ISO string — pick one per form and document it in the feature; convert at submit with `date-utils` helpers.
- Native date/time pickers (for example `@react-native-community/datetimepicker`) supply `Date` values; wire them through the same parse/format helpers as API data.
- For relative labels (“3 days ago”), use `formatDistanceToNow` with `{ addSuffix: true }`.

### Testing

- Use fixed ISO strings and `parseISO` in tests when asserting formatted output.
- Construct `TZDate` with an explicit zone when testing time zones.

## Setup

### Install date-fns

```bash
node ../scripts/run-package.cjs -- expo install date-fns
```

### Install time zone support (when needed)

```bash
node ../scripts/install-packages.cjs @date-fns/tz
```

## Examples

### `src/libs/date-utils/index.ts`

```ts
export {
  DISPLAY_DATE,
  DISPLAY_DATETIME,
  formatDisplayDate,
  formatDisplayDateTime,
  formatRelativeToNow,
  parseApiDateTime,
  toApiDateTimeString,
} from "./format";
```

### Parse and format API values

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

### Compare and sort

```ts
import { compareAsc, parseISO } from "date-fns";

const items = [...rows].sort((a, b) =>
  compareAsc(parseISO(a.startsAt), parseISO(b.startsAt)),
);
```

### Relative time in a component

```tsx
import { Text } from "react-native";
import { formatRelativeToNow } from "@/libs/date-utils";

export function UpdatedAt({ iso }: { iso: string }) {
  const label = formatRelativeToNow(iso);
  return <Text accessibilityLabel={iso}>{label}</Text>;
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
- [creating-form-component.md](./creating-form-component.md) — date fields in forms

## References

- [date-fns on GitHub](https://github.com/date-fns/date-fns)
- [date-fns documentation](https://date-fns.org/docs/Getting-Started)
