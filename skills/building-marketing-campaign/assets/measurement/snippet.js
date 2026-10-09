// Marketing measurement: keeps the last campaign touch for 30 days and records landings and
// conversions. Call mkCapture() on every page load; conversion('<event>') once the event is
// confirmed. With a consent banner, call both only after the visitor accepts its analytics or
// marketing category.

const MK_ENDPOINT = 'https://m.example.com';
const MK_DOMAIN = ''; // '.example.com' when the landing site and the app are on different subdomains
const MK_COOKIE = 'mk';
const MK_DAYS = 30;
const UTMS = ['campaign', 'medium', 'source', 'content'];

function mkRead() {
  const raw = document.cookie.split('; ').find((c) => c.startsWith(`${MK_COOKIE}=`));
  if (!raw) return null;
  try {
    return JSON.parse(decodeURIComponent(raw.slice(MK_COOKIE.length + 1)));
  } catch {
    return null;
  }
}

function mkSend(body) {
  fetch(`${MK_ENDPOINT}/e`, {
    method: 'POST',
    mode: 'no-cors',
    keepalive: true,
    headers: { 'content-type': 'text/plain' },
    body: JSON.stringify(body),
  });
}

function mkLand() {
  const params = new URLSearchParams(location.search);
  if (!params.get('utm_campaign')) return;

  const utm = Object.fromEntries(UTMS.map((k) => [k, params.get(`utm_${k}`)]));
  const mk = mkRead();
  if (mk && UTMS.every((k) => mk[k] === utm[k])) return;

  const touch = { visitor: mk?.visitor ?? crypto.randomUUID(), ...utm };
  const domain = MK_DOMAIN ? `; Domain=${MK_DOMAIN}` : '';
  document.cookie = `${MK_COOKIE}=${encodeURIComponent(JSON.stringify(touch))}; Max-Age=${MK_DAYS * 86400}; Path=/; SameSite=Lax; Secure${domain}`;
  mkSend({ ...touch, event: 'landing' });
}

export function mkCapture() {
  if (navigator.webdriver) return;
  if (document.visibilityState === 'visible') return mkLand();
  document.addEventListener('visibilitychange', function shown() {
    if (document.visibilityState !== 'visible') return;
    document.removeEventListener('visibilitychange', shown);
    mkLand();
  });
}

export function conversion(event) {
  const touch = mkRead();
  if (touch) mkSend({ ...touch, event });
}
