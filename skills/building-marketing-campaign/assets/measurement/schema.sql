CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  visitor TEXT NOT NULL,
  event TEXT NOT NULL,
  campaign TEXT NOT NULL,
  medium TEXT,
  source TEXT,
  content TEXT,
  ts TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE INDEX IF NOT EXISTS events_campaign ON events(campaign, event);
CREATE UNIQUE INDEX IF NOT EXISTS events_one_conversion ON events(visitor, event) WHERE event <> 'landing';
