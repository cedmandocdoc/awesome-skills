// Marketing measurement Worker: GET /<link-id> records a click and redirects with UTMs;
// POST /v records a first landing; POST /c records a conversion.

const empty = (status) => new Response(null, { status });

function originAllowed(request, env) {
  const origin = request.headers.get('origin');
  return Boolean(origin) && env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()).includes(origin);
}

async function readTouch(request) {
  try {
    return JSON.parse(await request.text());
  } catch {
    return null;
  }
}

async function record(request, env, kind) {
  const server = Boolean(env.SERVER_KEY) && request.headers.get('authorization') === `Bearer ${env.SERVER_KEY}`;
  if (!server && !originAllowed(request, env)) return empty(403);

  const t = await readTouch(request);
  if (!t?.cid || !t?.campaign || (kind === 'c' && !t.event)) return empty(400);

  if (kind === 'v') {
    await env.DB.prepare(
      'INSERT INTO visits (id, cid, campaign, medium, source, content, path) VALUES (?, ?, ?, ?, ?, ?, ?)',
    )
      .bind(crypto.randomUUID(), t.cid, t.campaign, t.medium ?? null, t.source ?? null, t.content ?? null, t.path ?? null)
      .run();
  } else {
    await env.DB.prepare(
      'INSERT INTO conversions (id, event, cid, campaign, medium, source, content, server) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    )
      .bind(crypto.randomUUID(), t.event, t.cid, t.campaign, t.medium ?? null, t.source ?? null, t.content ?? null, server ? 1 : 0)
      .run();
  }
  return empty(204);
}

async function redirect(request, env, ctx, linkId) {
  const link = await env.DB.prepare('SELECT * FROM links WHERE id = ?').bind(linkId).first();
  if (!link) return new Response('Not found', { status: 404 });

  const cid = crypto.randomUUID();
  ctx.waitUntil(
    env.DB.prepare('INSERT INTO clicks (id, link_id, country) VALUES (?, ?, ?)')
      .bind(cid, link.id, request.cf?.country ?? null)
      .run(),
  );

  const to = new URL(link.destination);
  to.searchParams.set('utm_campaign', link.campaign);
  to.searchParams.set('utm_medium', link.medium);
  to.searchParams.set('utm_source', link.source);
  to.searchParams.set('utm_content', link.content);
  to.searchParams.set('mk_cid', cid);
  return Response.redirect(to.toString(), 302);
}

export default {
  async fetch(request, env, ctx) {
    const path = new URL(request.url).pathname.slice(1);
    if (request.method === 'POST' && (path === 'v' || path === 'c')) return record(request, env, path);
    if (request.method === 'GET' && path && !path.includes('/')) return redirect(request, env, ctx, path);
    return empty(404);
  },
};
