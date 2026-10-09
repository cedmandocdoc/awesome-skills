SELECT content, medium, source,
  SUM(event = 'landing') AS landings,
  SUM(event = '{{EVENT}}') AS conversions
FROM events
WHERE campaign = '{{CAMPAIGN}}' AND ts <= '{{UNTIL}}'
GROUP BY content, medium, source
ORDER BY conversions DESC, landings DESC;
