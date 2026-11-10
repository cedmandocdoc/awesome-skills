// Queues approved posts in Buffer and hosts their media on R2.
// Run from the repository root: node --env-file="$env" <skill>/scripts/send.js <command>, $env = the main worktree's .env
import { readFileSync } from 'node:fs';
import { dirname, join, resolve, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { parseArgs } from 'node:util';

const WRANGLER = join(dirname(fileURLToPath(import.meta.url)), 'wrangler.toml');
const VIDEO = new Set(['.mp4', '.mov', '.webm']);

// index.md frontmatter holds `key: value` lines and one-level maps (`buffer_channels:`, then `  <name>: <id>` lines).
function rootIndex(root) {
  const m = readFileSync(join(root, 'index.md'), 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) throw new Error('index.md has no frontmatter');
  const out = {};
  let map = null;
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(\s*)([^\s#:][^:]*):\s*(.*)$/);
    if (!kv) continue;
    const [, indent, key, raw] = kv;
    const value = raw.replace(/\s+#.*$/, '').trim().replace(/^(['"])(.*)\1$/, '$2');
    if (indent) {
      if (map) map[key.trim()] = value;
    } else {
      map = value === '' || value === '{}' ? {} : null;
      out[key.trim()] = map ?? value;
    }
  }
  return out;
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

// The object key mirrors the file's path from the repository root (the working directory), so each file has one stable URL.
function upload(argv) {
  const { values, positionals } = parseArgs({ args: argv, options: { root: { type: 'string' } }, allowPositionals: true });
  const [file] = positionals;
  if (!values.root || !file) throw new Error('usage: upload --root <posts-root> <file>');
  const { media_url: base, media_bucket: bucket } = rootIndex(values.root);
  if (!base || base === 'none') throw new Error('media_url missing from index.md');
  if (!bucket || bucket === 'none') throw new Error('media_bucket missing from index.md');
  const key = relative(process.cwd(), resolve(file)).split('\\').join('/');
  if (key.startsWith('..')) throw new Error(`${file} is outside the repository`);
  execFileSync('npx', ['wrangler', 'r2', 'object', 'put', `${bucket}/${key}`, '--file', file, '--remote', '-c', WRANGLER], { stdio: 'inherit' });
  console.log(`${base.replace(/\/$/, '')}/${key}`);
}

async function push(argv) {
  const { values } = parseArgs({
    args: argv,
    options: {
      root: { type: 'string' },
      channel: { type: 'string' },
      text: { type: 'string' },
      media: { type: 'string', multiple: true },
      at: { type: 'string' },
    },
  });
  if (!values.root || !values.channel || values.text !== '-') {
    throw new Error('usage: push --root <posts-root> --channel <name> --text - [--media <url>…] [--at "YYYY-MM-DD HH:MM"] < caption');
  }
  const channelId = rootIndex(values.root).buffer_channels?.[values.channel];
  if (!channelId) throw new Error(`channel ${values.channel} is not in buffer_channels`);
  const text = readFileSync(0, 'utf8').trim();
  if (!text) throw new Error('no caption on stdin');
  const assets = (values.media ?? []).map((url) => (VIDEO.has(extname(new URL(url).pathname).toLowerCase()) ? { video: { url } } : { image: { url } }));
  const when = values.at ? new Date(values.at.replace(' ', 'T')) : null;
  const mode = !when ? 'addToQueue' : when > new Date() ? 'customScheduled' : 'shareNow';
  const input = { channelId, text, assets, mode, schedulingType: 'automatic', needsApproval: false };
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
  console.error('usage: send.js verify | channels | upload --root <dir> <file> | push --root <dir> --channel <name> --text - [--media <url>…] [--at <time>]');
  process.exit(2);
}
try {
  await commands[command](args);
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
