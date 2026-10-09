// Marketing measurement Worker: POST /e records one event — a landing or a named conversion —
// from the app's snippet. The endpoint is public: it checks the origin and the fields, and only inserts.

const empty = (status) => new Response(null, { status });

function originAllowed(request, env) {
  const origin = request.headers.get('origin');
  return Boolean(origin) && env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()).includes(origin);
}

async function readEvent(request) {
  try {
    return JSON.parse(await request.text());
  } catch {
    return null;
  }
}

async function record(request, env) {
  if (!originAllowed(request, env)) return empty(403);

  const e = await readEvent(request);
  if (!e?.visitor || !e?.event || !e?.campaign) return empty(400);

  await env.DB.prepare(
    'INSERT OR IGNORE INTO events (id, visitor, event, campaign, medium, source, content) VALUES (?, ?, ?, ?, ?, ?, ?)',
  )
    .bind(crypto.randomUUID(), e.visitor, e.event, e.campaign, e.medium ?? null, e.source ?? null, e.content ?? null)
    .run();
  return empty(204);
}

export default {
  async fetch(request, env) {
    const path = new URL(request.url).pathname;
    if (request.method === 'POST' && path === '/e') return record(request, env);
    return empty(404);
  },
};
