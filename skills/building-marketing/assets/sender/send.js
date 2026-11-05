// Queues approved posts in Buffer and hosts their media on R2.
// Run from the repository root: node --env-file=.env <marketing-root>/sender/send.js <command>
import { readFileSync } from 'node:fs';
import { dirname, join, resolve, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { parseArgs } from 'node:util';
import { parse } from 'yaml';

const SENDER = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(SENDER, '..');
const WRANGLER = join(SENDER, 'wrangler.toml');
const BUCKET = 'marketing-media';
const VIDEO = new Set(['.mp4', '.mov', '.webm']);

function rootIndex() {
  const m = readFileSync(join(ROOT, 'index.md'), 'utf8').match(/^---\n([\s\S]*?)\n---/);
  if (!m) throw new Error('index.md has no frontmatter');
  return parse(m[1]) ?? {};
}

async function buffer(query, variables = {}) {
  if (!process.env.BUFFER_API_KEY) throw new Error('BUFFER_API_KEY missing from .env');
  const res = await fetch('https://api.buffer.com', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.BUFFER_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.errors) throw new Error(`Buffer ${res.status}: ${JSON.stringify(json.errors ?? json)}`);
  return json.data;
}

async function verify() {
  try {
    await buffer('{ account { id } }');
    console.log('ok   buffer');
  } catch (e) {
    console.log(`fail buffer: ${e.message}`);
    process.exitCode = 1;
  }
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

// The object key mirrors the file's path under the marketing root, so each render has one stable URL.
function upload([file]) {
  if (!file) throw new Error('usage: upload <file>');
  const base = rootIndex().media_url;
  if (!base || base === 'none') throw new Error('media_url missing from index.md');
  const key = relative(ROOT, resolve(file)).split('\\').join('/');
  if (key.startsWith('..')) throw new Error(`${file} is outside the marketing root`);
  execFileSync('npx', ['wrangler', 'r2', 'object', 'put', `${BUCKET}/${key}`, '--file', file, '--remote', '-c', WRANGLER], { stdio: 'inherit' });
  console.log(`${base.replace(/\/$/, '')}/${key}`);
}

async function push(argv) {
  const { values } = parseArgs({
    args: argv,
    options: { channel: { type: 'string' }, text: { type: 'string' }, media: { type: 'string', multiple: true }, at: { type: 'string' } },
  });
  if (!values.channel || !values.text) throw new Error('usage: push --channel <name> --text <file> [--media <url>…] [--at "YYYY-MM-DD HH:MM"]');
  const channelId = rootIndex().buffer_channels?.[values.channel];
  if (!channelId) throw new Error(`channel ${values.channel} is not in buffer_channels`);
  const assets = (values.media ?? []).map((url) => (VIDEO.has(extname(new URL(url).pathname).toLowerCase()) ? { video: { url } } : { image: { url } }));
  const when = values.at ? new Date(values.at.replace(' ', 'T')) : null;
  const mode = !when ? 'addToQueue' : when > new Date() ? 'customScheduled' : 'shareNow';
  const input = { channelId, text: readFileSync(values.text, 'utf8').trim(), assets, mode, schedulingType: 'automatic', needsApproval: false };
  if (mode === 'customScheduled') input.dueAt = when.toISOString();
  const { createPost: r } = await buffer(
    'mutation($input: CreatePostInput!) { createPost(input: $input) { __typename ... on PostActionSuccess { post { id } } ... on MutationError { message } } }',
    { input },
  );
  if (!r.post) throw new Error(`${r.__typename}: ${r.message}`);
  console.log(r.post.id);
}

const [command, ...args] = process.argv.slice(2);
const commands = { verify, channels, upload, push };
if (!commands[command]) {
  console.error('usage: send.js verify | channels | upload <file> | push --channel <name> --text <file> [--media <url>…] [--at <time>]');
  process.exit(2);
}
try {
  await commands[command](args);
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
