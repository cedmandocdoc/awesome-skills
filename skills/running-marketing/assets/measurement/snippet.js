// Marketing measurement: keeps the first campaign touch for 30 days, reports the landing,
// and reports conversions. Call mkCapture() on every page load; conversion('<event>') when
// the event is confirmed.

const MK_ENDPOINT = 'https://go.example.com';
const MK_DOMAIN = ''; // '.example.com' when the landing site and the app are on different subdomains
const MK_COOKIE = 'mk';
const MK_DAYS = 30;

function mkRead() {
  const raw = document.cookie.split('; ').find((c) => c.startsWith(`${MK_COOKIE}=`));
  if (!raw) return null;
  try {
    return JSON.parse(decodeURIComponent(raw.slice(MK_COOKIE.length + 1)));
  } catch {
    return null;
  }
}

function mkSend(path, body) {
  fetch(`${MK_ENDPOINT}/${path}`, {
    method: 'POST',
    mode: 'no-cors',
    keepalive: true,
    headers: { 'content-type': 'text/plain' },
    body: JSON.stringify(body),
  });
}

export function mkCapture() {
  if (mkRead()) return;
  const params = new URLSearchParams(location.search);
  const campaign = params.get('utm_campaign');
  if (!campaign) return;

  const touch = {
    cid: params.get('mk_cid') || crypto.randomUUID(),
    campaign,
    medium: params.get('utm_medium'),
    source: params.get('utm_source'),
    content: params.get('utm_content'),
  };
  const domain = MK_DOMAIN ? `; Domain=${MK_DOMAIN}` : '';
  document.cookie = `${MK_COOKIE}=${encodeURIComponent(JSON.stringify(touch))}; Max-Age=${MK_DAYS * 86400}; Path=/; SameSite=Lax; Secure${domain}`;
  mkSend('v', { ...touch, path: location.pathname });
}

export function conversion(event) {
  const touch = mkRead();
  if (touch) mkSend('c', { ...touch, event });
}
