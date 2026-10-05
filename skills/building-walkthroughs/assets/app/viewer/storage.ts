// The only per-viewer state: the theme and whether the first-visit About page was dismissed.
// Every access may throw (private mode, blocked storage), so each is guarded.
const PREFIX = "walkthroughs:";

export function load<T>(key: "theme" | "about-dismissed", fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw == null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function save(key: "theme" | "about-dismissed", value: unknown): void {
  try {
    if (value == null) localStorage.removeItem(PREFIX + key);
    else localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage unavailable: the preference lives for this page view only.
  }
}
