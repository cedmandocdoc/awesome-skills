CREATE TABLE IF NOT EXISTS links (
  id TEXT PRIMARY KEY,
  campaign TEXT NOT NULL,
  medium TEXT NOT NULL,
  source TEXT NOT NULL,
  content TEXT NOT NULL,
  destination TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE TABLE IF NOT EXISTS clicks (
  id TEXT PRIMARY KEY,
  link_id TEXT NOT NULL REFERENCES links(id),
  country TEXT,
  ts TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE TABLE IF NOT EXISTS visits (
  id TEXT PRIMARY KEY,
  cid TEXT NOT NULL,
  campaign TEXT NOT NULL,
  medium TEXT,
  source TEXT,
  content TEXT,
  path TEXT,
  ts TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE TABLE IF NOT EXISTS conversions (
  id TEXT PRIMARY KEY,
  event TEXT NOT NULL,
  cid TEXT NOT NULL,
  campaign TEXT NOT NULL,
  medium TEXT,
  source TEXT,
  content TEXT,
  server INTEGER NOT NULL DEFAULT 0,
  ts TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE INDEX IF NOT EXISTS links_campaign ON links(campaign);
CREATE INDEX IF NOT EXISTS visits_campaign ON visits(campaign);
CREATE INDEX IF NOT EXISTS conversions_campaign ON conversions(campaign, event);
