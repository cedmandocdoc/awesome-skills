SELECT content, medium, source,
  SUM(clicks) AS clicks,
  SUM(visits) AS visits,
  SUM(conversions) AS conversions
FROM (
  SELECT l.content, l.medium, l.source, 1 AS clicks, 0 AS visits, 0 AS conversions
    FROM clicks k JOIN links l ON l.id = k.link_id
    WHERE l.campaign = '{{CAMPAIGN}}' AND k.ts <= '{{UNTIL}}'
  UNION ALL
  SELECT content, medium, source, 0, 1, 0
    FROM visits
    WHERE campaign = '{{CAMPAIGN}}' AND ts <= '{{UNTIL}}'
  UNION ALL
  SELECT content, medium, source, 0, 0, 1
    FROM conversions
    WHERE campaign = '{{CAMPAIGN}}' AND event = '{{EVENT}}' AND ts <= '{{UNTIL}}'
)
GROUP BY content, medium, source
ORDER BY conversions DESC, clicks DESC;
