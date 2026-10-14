// Pushes approved outbox items through Buffer or SMTP and syncs their results back.
// Run from the repository root: node --env-file=.env <marketing-root>/sender/send.js <command>
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { parse } from 'yaml';
import nodemailer from 'nodemailer';
import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const WRANGLER = join(ROOT, 'measurement', 'wrangler.toml');
const BUCKET = 'marketing-media';
const EMAIL_CAP = 30;
const MAX_TOUCH = 3;
const env = process.env;

const pad = (n) => String(n).padStart(2, '0');
const stamp = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
const format = (v) => (v == null ? 'none' : /^[\w.@-]+$/.test(String(v)) ? String(v) : JSON.stringify(String(v)));
const isSet = (v) => v != null && v !== 'none' && v !== '';

function readItem(path) {
  const text = readFileSync(path, 'utf8');
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error(`${path}: no frontmatter`);
  return { path, text, fm: parse(m[1]) ?? {}, body: m[2] };
}

// Rewrites only the named frontmatter lines, so the rest of the file stays as written.
function setFields(item, fields) {
  let [, head, rest] = item.text.match(/^---\n([\s\S]*?)\n---(\n?[\s\S]*)$/);
  for (const [key, value] of Object.entries(fields)) {
    const line = `${key}: ${format(value)}`;
    const re = new RegExp(`^${key}:.*$`, 'm');
    head = re.test(head) ? head.replace(re, () => line) : `${head}\n${line}`;
  }
  item.text = `---\n${head}\n---${rest}`;
  writeFileSync(item.path, item.text);
  Object.assign(item.fm, fields);
}

function message(item) {
  const body = item.body.split(/^## Reply/m)[0].trim();
  const m = body.match(/^Subject:\s*(.*)\n+/);
  return { subject: m ? m[1].trim() : '', text: m ? body.slice(m[0].length).trim() : body };
}

function outboxItems() {
  const dir = join(ROOT, 'campaigns');
  return readdirSync(dir).flatMap((c) => {
    const outbox = join(dir, c, 'outbox');
    return existsSync(outbox) ? readdirSync(outbox).filter((f) => f.endsWith('.md')).map((f) => readItem(join(outbox, f))) : [];
  });
}

async function buffer(query, variables = {}) {
  if (!env.BUFFER_API_KEY) throw new Error('BUFFER_API_KEY missing from .env');
  const res = await fetch('https://api.buffer.com', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.BUFFER_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.errors) throw new Error(`Buffer ${res.status}: ${JSON.stringify(json.errors ?? json)}`);
  return json.data;
}

const smtp = () =>
  nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT),
    secure: Number(env.SMTP_PORT) === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });

const imap = () =>
  new ImapFlow({
    host: env.IMAP_HOST,
    port: Number(env.IMAP_PORT),
    secure: true,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    logger: false,
  });

// Buffer fetches media by URL at publish time, so a local render goes to the public R2 bucket first.
function hostMedia(item, base) {
  if (isSet(item.fm.media_url)) return item.fm.media_url;
  if (!isSet(base)) throw new Error('media_url missing from index.md');
  const key = `${basename(dirname(dirname(item.path)))}/${basename(item.path, '.md')}-${basename(item.fm.media)}`;
  execFileSync('npx', ['wrangler', 'r2', 'object', 'put', `${BUCKET}/${key}`, '--file', item.fm.media, '--remote', '-c', WRANGLER], { stdio: 'inherit' });
  const url = `${base.replace(/\/$/, '')}/${key}`;
  setFields(item, { media_url: url });
  return url;
}

async function pushPost(item, root) {
  const channelId = root.buffer_channels?.[item.fm.channel];
  if (!channelId) throw new Error(`channel ${item.fm.channel} is not in buffer_channels`);
  const assets = isSet(item.fm.media) ? [{ video: { url: hostMedia(item, root.media_url) } }] : [];
  const when = isSet(item.fm.scheduled) ? new Date(String(item.fm.scheduled).replace(' ', 'T')) : null;
  const mode = !when ? 'addToQueue' : when > new Date() ? 'customScheduled' : 'shareNow';
  const input = { channelId, text: message(item).text, assets, mode, schedulingType: 'automatic', needsApproval: false };
  if (mode === 'customScheduled') input.dueAt = when.toISOString();
  const { createPost: r } = await buffer(
    'mutation($input: CreatePostInput!) { createPost(input: $input) { __typename ... on PostActionSuccess { post { id } } ... on MutationError { message } } }',
    { input },
  );
  if (!r.post) throw new Error(`${r.__typename}: ${r.message}`);
  setFields(item, { status: 'queued', external_id: r.post.id, error: 'none' });
}

async function pushEmail(item, all) {
  const to = String(item.fm.to).match(/[^\s<>,"]+@[^\s<>,"]+/)?.[0];
  if (!to) throw new Error(`no email address in to: ${item.fm.to}`);
  const today = stamp(new Date()).slice(0, 10);
  if (all.filter((i) => i.fm.send === 'smtp' && String(i.fm.sent_at).startsWith(today)).length >= EMAIL_CAP) {
    throw new Error(`daily cap of ${EMAIL_CAP} emails reached`);
  }
  if (Number(item.fm.touch) > MAX_TOUCH) throw new Error(`touch ${item.fm.touch} is over ${MAX_TOUCH}`);
  const thread = isSet(item.fm.prospect)
    ? all.filter((i) => i.path !== item.path && dirname(i.path) === dirname(item.path) && i.fm.prospect === item.fm.prospect)
    : [];
  if (thread.some((i) => i.fm.status === 'replied')) throw new Error(`${item.fm.prospect} already replied`);
  const earlier = thread
    .filter((i) => Number(i.fm.touch) < Number(item.fm.touch) && isSet(i.fm.external_id))
    .sort((a, b) => a.fm.touch - b.fm.touch)
    .map((i) => i.fm.external_id);
  const { subject, text } = message(item);
  const info = await smtp().sendMail({
    from: env.MAIL_FROM,
    to,
    subject,
    text,
    ...(earlier.length && { inReplyTo: earlier.at(-1), references: earlier }),
  });
  setFields(item, { status: 'sent', sent_at: stamp(new Date()), external_id: info.messageId, error: 'none' });
}

async function verify() {
  const root = readItem(join(ROOT, 'index.md')).fm;
  let ok = true;
  const check = async (name, fn) => {
    try {
      await fn();
      console.log(`ok   ${name}`);
    } catch (e) {
      ok = false;
      console.log(`fail ${name}: ${e.message}`);
    }
  };
  if ((root.send_posts ?? []).length) await check('buffer', () => buffer('{ account { id } }'));
  if (root.send_email === 'smtp') {
    await check('smtp', () => smtp().verify());
    await check('imap', async () => {
      const client = imap();
      await client.connect();
      await client.logout();
    });
  }
  if (!ok) process.exitCode = 1;
}

async function channels() {
  const { account } = await buffer('{ account { organizations { id } } }');
  for (const org of account.organizations) {
    const { channels } = await buffer('query($input: ChannelsInput!) { channels(input: $input) { id service name isDisconnected } }', {
      input: { organizationId: org.id },
    });
    for (const c of channels) console.log([c.id, c.service, c.name, c.isDisconnected ? 'disconnected' : ''].join('\t'));
  }
}

async function push(paths) {
  const root = readItem(join(ROOT, 'index.md')).fm;
  const all = outboxItems();
  for (const p of paths) {
    const item = all.find((i) => i.path === resolve(p)) ?? readItem(resolve(p));
    if (item.fm.status !== 'approved' || !['buffer', 'smtp'].includes(item.fm.send)) {
      console.log(`${item.fm.code} not pushed: status ${item.fm.status}, send ${item.fm.send}`);
      continue;
    }
    try {
      await (item.fm.send === 'buffer' ? pushPost(item, root) : pushEmail(item, all));
      console.log(`${item.fm.code} ${item.fm.status}`);
    } catch (e) {
      setFields(item, { error: e.message });
      console.log(`${item.fm.code} failed: ${e.message}`);
    }
  }
}

// Moves Buffer posts that went out to sent, and prints replies to sent emails for the agent to record.
async function sync() {
  const all = outboxItems();
  for (const item of all.filter((i) => i.fm.status === 'queued')) {
    const { post } = await buffer('query($input: PostInput!) { post(input: $input) { status sentAt error { message } } }', {
      input: { id: item.fm.external_id },
    });
    if (post.status === 'sent') setFields(item, { status: 'sent', sent_at: stamp(new Date(post.sentAt)) });
    else if (post.status === 'error') setFields(item, { status: 'approved', error: post.error?.message ?? 'Buffer error' });
    console.log(`${item.fm.code} ${item.fm.status}`);
  }
  const sent = all.filter((i) => i.fm.send === 'smtp' && i.fm.status === 'sent' && isSet(i.fm.external_id));
  if (!sent.length || !env.IMAP_HOST) return;
  const replies = [];
  const client = imap();
  await client.connect();
  const lock = await client.getMailboxLock('INBOX');
  try {
    for (const item of sent) {
      const uids = new Set();
      for (const header of ['in-reply-to', 'references']) {
        for (const uid of (await client.search({ header: { [header]: item.fm.external_id } }, { uid: true })) || []) uids.add(uid);
      }
      for (const uid of uids) {
        const { source } = await client.fetchOne(String(uid), { source: true }, { uid: true });
        const mail = await simpleParser(source);
        replies.push({ code: item.fm.code, path: item.path, from: mail.from?.text, date: mail.date, text: (mail.text ?? '').slice(0, 1000) });
      }
    }
  } finally {
    lock.release();
    await client.logout();
  }
  console.log(JSON.stringify({ replies }, null, 2));
}

async function unqueue(paths) {
  for (const p of paths) {
    const item = readItem(resolve(p));
    if (item.fm.status !== 'queued') continue;
    const { deletePost: r } = await buffer(
      'mutation($input: DeletePostInput!) { deletePost(input: $input) { __typename ... on MutationError { message } } }',
      { input: { id: item.fm.external_id } },
    );
    if (r.message) throw new Error(`${item.fm.code}: ${r.message}`);
    setFields(item, { status: 'approved', external_id: 'none' });
    console.log(`${item.fm.code} unqueued`);
  }
}

const [command, ...args] = process.argv.slice(2);
const commands = { verify, channels, push: () => push(args), sync, unqueue: () => unqueue(args) };
if (!commands[command]) {
  console.error('usage: send.js verify | channels | push <item.md>... | sync | unqueue <item.md>...');
  process.exit(2);
}
await commands[command]();
