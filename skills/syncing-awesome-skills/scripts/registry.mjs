#!/usr/bin/env node
// Registry and skill sync helper for syncing-awesome-skills. Zero dependencies.
// Run with no arguments in a terminal for an interactive menu; `help` lists commands.

import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import {
  cpSync, existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, realpathSync, rmSync, writeFileSync,
} from 'node:fs';
import { homedir } from 'node:os';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { createInterface } from 'node:readline/promises';

const SOURCE_ID = 'cedmandocdoc/awesome-skills';
const SOURCE_URL = 'https://github.com/cedmandocdoc/awesome-skills.git';
const CONFIG = process.env.AWESOME_SKILLS_SYNC_CONFIG || join(homedir(), '.config/awesome-skills/sync.json');
// Managed clone for users without their own: init clones it, plan fast-forwards it. Never edited by hand.
const CACHE = join(homedir(), '.cache/awesome-skills');
const BRANCH_PREFIX = 'chore/sync-awesome-skills-';

// ---------- helpers ----------

const tilde = (p) => (p.startsWith(homedir()) ? '~' + p.slice(homedir().length) : p);
const expand = (p) => resolve(p.replace(/^~(?=$|\/)/, homedir()));

function fail(msg) {
  console.error(`error: ${msg}`);
  process.exit(1);
}

function git(cwd, args, { allowFail = false } = {}) {
  try {
    return execFileSync('git', ['-C', cwd, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  } catch (e) {
    if (allowFail) return null;
    throw new Error(`git ${args.join(' ')} failed in ${tilde(cwd)}: ${(e.stderr || e.message).trim()}`);
  }
}

function loadConfig({ required = true } = {}) {
  if (!existsSync(CONFIG)) {
    if (required) fail(`no registry at ${tilde(CONFIG)}; run: registry.mjs init [--source <awesome-skills clone>]`);
    return null;
  }
  return JSON.parse(readFileSync(CONFIG, 'utf8'));
}

function saveConfig(cfg) {
  mkdirSync(dirname(CONFIG), { recursive: true });
  writeFileSync(CONFIG, JSON.stringify(cfg, null, 2) + '\n');
}

function findRepo(cfg, name) {
  const repo = cfg.repos.find((r) => r.name === name);
  if (!repo) fail(`"${name}" is not in the registry (have: ${cfg.repos.map((r) => r.name).join(', ') || 'none'})`);
  return repo;
}

function readLock(repoPath) {
  const file = join(repoPath, 'skills-lock.json');
  if (!existsSync(file)) return null;
  return JSON.parse(readFileSync(file, 'utf8'));
}

function sourceSkillsOf(lock) {
  return Object.entries(lock?.skills || {})
    .filter(([, v]) => v.source === SOURCE_ID)
    .map(([name]) => name)
    .sort();
}

// Same algorithm as the `skills` CLI computeSkillFolderHash: sorted relative paths + contents, sha256.
function hashFiles(files) {
  const sorted = [...files].sort((a, b) => a.rel.localeCompare(b.rel));
  const h = createHash('sha256');
  for (const f of sorted) {
    h.update(f.rel);
    h.update(f.content);
  }
  return h.digest('hex');
}

function walk(base, dir = base, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === '.git' || e.name === 'node_modules') continue;
      walk(base, p, out);
    } else if (e.isFile()) {
      out.push({ rel: relative(base, p).split('\\').join('/'), content: readFileSync(p) });
    }
  }
  return out;
}

// Tracked files only, so untracked junk (.DS_Store) in the source clone never ships.
function sourceFiles(source, skill) {
  const prefix = `skills/${skill}/`;
  const listed = git(source, ['ls-files', '-z', '--', prefix]).split('\0').filter(Boolean);
  return listed.map((p) => ({ rel: p.slice(prefix.length), abs: join(source, p), content: readFileSync(join(source, p)) }));
}

// Committed entries named <any agent dir>/skills/<skill> at ref (trees and symlinks), so every layout the
// `skills` CLI writes — .agents, .claude, .agent, .windsurf, … — is found without a hard-coded agent list.
function skillEntries(repoPath, ref, skill) {
  const listing = execFileSync('git', ['-C', repoPath, 'ls-tree', '-r', '-t', '-z', ref], { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
  return listing.split('\0').filter(Boolean).map((line) => {
    const [meta, path] = line.split('\t');
    const [mode, type] = meta.split(' ');
    return { mode, type, path };
  }).filter((e) => !e.path.split('/').includes('node_modules')
    && (e.type === 'tree' || e.mode === '120000')
    && e.path.split('/').slice(-2).join('/') === `skills/${skill}`);
}

// Real (non-symlink) install folders of a skill inside a repo's working tree. Symlinks point at one of these.
function installDirs(repoPath, skill) {
  const root = realpathSync(repoPath);
  const dirs = [];
  for (const { path } of skillEntries(repoPath, 'HEAD', skill)) {
    const p = join(repoPath, path);
    if (!existsSync(p)) continue;
    const real = realpathSync(p);
    if (real.startsWith(root + '/') && lstatSync(real).isDirectory() && !dirs.includes(real)) dirs.push(real);
  }
  return dirs;
}

// origin's default branch as `origin/<name>`, or null.
function defaultBranch(repoPath) {
  const head = git(repoPath, ['symbolic-ref', '--short', 'refs/remotes/origin/HEAD'], { allowFail: true });
  if (head) return head;
  for (const b of ['origin/main', 'origin/master']) {
    if (git(repoPath, ['rev-parse', '--verify', '--quiet', b], { allowFail: true })) return b;
  }
  return null;
}

// Drift against the working tree at repoPath (used by apply inside a worktree).
function skillDrift(source, repoPath) {
  return driftFrom(source, readLock(repoPath), (skill) => installDirs(repoPath, skill).map((d) => hashFiles(walk(d))));
}

// Drift against a committed ref (used by plan, so the table reflects origin/<default>, not the local checkout).
function skillDriftAtRef(source, repoPath, ref) {
  const lockText = git(repoPath, ['show', `${ref}:skills-lock.json`], { allowFail: true });
  const lock = lockText ? JSON.parse(lockText) : null;
  return driftFrom(source, lock, (skill) => installDirsAtRef(repoPath, ref, skill).map((d) => hashFiles(treeFiles(repoPath, ref, d))));
}

function driftFrom(source, lock, installedHashes) {
  const stale = [];
  const missing = [];
  for (const skill of sourceSkillsOf(lock)) {
    if (!existsSync(join(source, 'skills', skill, 'SKILL.md'))) {
      missing.push(skill);
      continue;
    }
    const want = hashFiles(sourceFiles(source, skill));
    const have = installedHashes(skill);
    if (have.length === 0 || have.some((h) => h !== want)) stale.push(skill);
  }
  return { skills: sourceSkillsOf(lock), stale, missing };
}

// Real install folders of a skill in a ref's tree; committed symlinks are resolved to their in-repo target.
function installDirsAtRef(repoPath, ref, skill) {
  const dirs = [];
  for (const { mode, path } of skillEntries(repoPath, ref, skill)) {
    let target = path;
    if (mode === '120000') {
      const link = git(repoPath, ['cat-file', 'blob', `${ref}:${path}`]);
      target = join(dirname(path), link).split('\\').join('/');
      if (target.startsWith('..') || target.startsWith('/')) continue;
      if (git(repoPath, ['ls-tree', ref, '--', target], { allowFail: true })?.split(/\s+/)[1] !== 'tree') continue;
    }
    if (!dirs.includes(target)) dirs.push(target);
  }
  return dirs;
}

// Regular files under dir at ref, as { rel, content } — same set the CLI hash walks.
function treeFiles(repoPath, ref, dir) {
  const listing = execFileSync('git', ['-C', repoPath, 'ls-tree', '-r', '-z', ref, '--', `${dir}/`], { encoding: 'utf8' });
  const entries = listing.split('\0').filter(Boolean).map((line) => {
    const [meta, path] = line.split('\t');
    const [mode, , sha] = meta.split(' ');
    return { mode, sha, path };
  }).filter((e) => e.mode === '100644' || e.mode === '100755');
  if (entries.length === 0) return [];
  const out = execFileSync('git', ['-C', repoPath, 'cat-file', '--batch'], {
    input: entries.map((e) => e.sha).join('\n') + '\n', maxBuffer: 256 * 1024 * 1024,
  });
  const files = [];
  let pos = 0;
  for (const e of entries) {
    const nl = out.indexOf(0x0a, pos);
    const size = Number(out.subarray(pos, nl).toString().split(' ')[2]);
    files.push({ rel: e.path.slice(dir.length + 1), content: out.subarray(nl + 1, nl + 1 + size) });
    pos = nl + 1 + size + 1;
  }
  return files;
}

// Unpushed local commits on the default branch would be missing from the sync PR.
function divergence(repoPath, base) {
  const local = base.replace(/^origin\//, '');
  if (!git(repoPath, ['rev-parse', '--verify', '--quiet', local], { allowFail: true })) return [];
  const [behind, ahead] = git(repoPath, ['rev-list', '--left-right', '--count', `${base}...${local}`]).split(/\s+/).map(Number);
  if (!ahead) return [];
  return [`local ${local} is ${ahead} ahead${behind ? ` and ${behind} behind` : ''} of ${base} — push or reconcile first`];
}

// Every awesome-skills skill must have at least one install folder (any agent dir) at ref.
function layoutProblems(repoPath, ref, skills) {
  const off = skills.filter((s) => installDirsAtRef(repoPath, ref, s).length === 0);
  return off.length ? [`no install folder in any agent skills dir: ${off.join(', ')}`] : [];
}

// An earlier sync still in flight: a local sync branch (worktrees hold one too) or an open sync PR.
function leftovers(repoPath) {
  const found = [];
  const branches = git(repoPath, ['branch', '--list', `${BRANCH_PREFIX}*`, '--format=%(refname:short)']).split('\n').filter(Boolean);
  if (branches.length) found.push(`sync branch exists: ${branches.join(', ')}`);
  let prs;
  try {
    prs = JSON.parse(execFileSync('gh', ['pr', 'list', '--state', 'open', '--limit', '200', '--json', 'headRefName,url'], {
      cwd: repoPath, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
    }));
  } catch {
    return [...found, 'gh cannot list PRs (check gh auth status)'];
  }
  const open = prs.filter((p) => p.headRefName.startsWith(BRANCH_PREFIX)).map((p) => p.url);
  if (open.length) found.push(`sync PR open: ${open.join(', ')}`);
  return found;
}

// Source problems visible without the network: branch, uncommitted tracked changes, untracked files under skills/.
function localSourceProblems(source) {
  const branch = git(source, ['rev-parse', '--abbrev-ref', 'HEAD']);
  const problems = [];
  if (branch !== 'main') problems.push(`source is on "${branch}", not main`);
  if (git(source, ['status', '--porcelain', '--untracked-files=no']) !== '') problems.push('source has uncommitted changes');
  const untracked = git(source, ['ls-files', '--others', '--exclude-standard', '--', 'skills/'])
    .split('\n').filter((p) => p && basename(p) !== '.DS_Store');
  if (untracked.length) problems.push(`source has untracked files under skills/: ${untracked.slice(0, 5).join(', ')}${untracked.length > 5 ? ' …' : ''}`);
  return { branch, problems };
}

// Moves the managed clone to origin/main; a user's own clone is only checked, never moved.
function refreshCache(source) {
  if (source !== CACHE) return;
  git(source, ['fetch', '--quiet', 'origin']);
  git(source, ['checkout', '--quiet', '-B', 'main', 'origin/main']);
  git(source, ['reset', '--quiet', '--hard', 'origin/main']);
}

function sourceState(source) {
  refreshCache(source);
  const { branch, problems } = localSourceProblems(source);
  git(source, ['fetch', '--quiet', 'origin'], { allowFail: true });
  const head = git(source, ['rev-parse', 'HEAD']);
  const remote = git(source, ['rev-parse', 'origin/main'], { allowFail: true });
  if (remote && head !== remote) problems.push('source HEAD does not match origin/main (push or pull first)');
  if (!remote) problems.push('could not read origin/main');
  return { path: source, branch, sha: head, short: head.slice(0, 7), ok: problems.length === 0, problems };
}

function candidates(cfg, root) {
  const known = new Set(cfg.repos.map((r) => r.path));
  return readdirSync(root, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => join(root, e.name))
    .filter((p) => p !== cfg.source && !known.has(p) && existsSync(join(p, '.git')))
    .filter((p) => sourceSkillsOf(readLock(p)).length > 0);
}

// ---------- commands ----------

function cmdInit(args) {
  const i = args.indexOf('--source');
  if (i >= 0 && !args[i + 1]) fail('usage: init [--source <path to awesome-skills clone>]');
  const source = i >= 0 ? expand(args[i + 1]) : CACHE;
  if (source === CACHE && !existsSync(CACHE)) {
    mkdirSync(dirname(CACHE), { recursive: true });
    execFileSync('git', ['clone', '--quiet', SOURCE_URL, CACHE], { stdio: ['ignore', 'pipe', 'pipe'] });
  }
  if (!existsSync(join(source, 'skills'))) fail(`${tilde(source)} has no skills/ folder`);
  const cfg = loadConfig({ required: false }) || { repos: [] };
  cfg.source = source;
  saveConfig(cfg);
  console.log(`registry: ${tilde(CONFIG)}\nsource:   ${tilde(source)}`);
}

function cmdAdd(args) {
  const cfg = loadConfig();
  const k = args.indexOf('--in');
  const root = expand(k >= 0 && args[k + 1] ? args[k + 1] : process.cwd());
  const paths = args.filter((a, j) => !a.startsWith('--') && (k < 0 || j !== k + 1));
  if (paths.length === 0) {
    const found = candidates(cfg, root);
    if (args.includes('--json')) return console.log(JSON.stringify(found.map((p) => ({ name: basename(p), path: p }))));
    if (found.length === 0) return console.log(`No unregistered repos using awesome-skills in ${tilde(root)}.`);
    console.log('Unregistered repos using awesome-skills:');
    for (const p of found) console.log(`  ${basename(p).padEnd(20)} ${tilde(p)}`);
    console.log('\nAdd with: registry.mjs add <path> [<path> …]');
    return;
  }
  for (const raw of paths) {
    const path = expand(raw);
    if (!existsSync(join(path, '.git'))) {
      console.log(`skip  ${tilde(path)} (not a git repository)`);
      continue;
    }
    const skills = sourceSkillsOf(readLock(path));
    if (skills.length === 0) {
      console.log(`skip  ${tilde(path)} (no skills-lock.json entries from ${SOURCE_ID})`);
      continue;
    }
    const name = basename(path);
    if (cfg.repos.some((r) => r.name === name || r.path === path)) {
      console.log(`skip  ${name} (already registered)`);
      continue;
    }
    cfg.repos.push({ name, path, status: 'active' });
    console.log(`added ${name} (${skills.length} awesome-skills skills)`);
  }
  cfg.repos.sort((a, b) => a.name.localeCompare(b.name));
  saveConfig(cfg);
}

function cmdDelete([name]) {
  if (!name) fail('usage: delete <name>');
  const cfg = loadConfig();
  findRepo(cfg, name);
  cfg.repos = cfg.repos.filter((r) => r.name !== name);
  saveConfig(cfg);
  console.log(`deleted ${name} from the registry (repo files untouched)`);
}

function cmdHold(args) {
  const name = args[0];
  if (!name) fail('usage: hold <name> [--reason <text>]');
  const i = args.indexOf('--reason');
  const reason = i >= 0 ? args.slice(i + 1).join(' ') : args.slice(1).join(' ');
  const cfg = loadConfig();
  const repo = findRepo(cfg, name);
  repo.status = 'hold';
  if (reason) repo.reason = reason;
  else delete repo.reason;
  saveConfig(cfg);
  console.log(`hold  ${name}${reason ? ` — ${reason}` : ''}`);
}

function cmdResume([name]) {
  if (!name) fail('usage: resume <name>');
  const cfg = loadConfig();
  const repo = findRepo(cfg, name);
  repo.status = 'active';
  delete repo.reason;
  saveConfig(cfg);
  console.log(`active ${name}`);
}

// A repo is synced only when it passes every precondition; anything else is skipped with a reason.
function buildPlan(cfg) {
  const source = sourceState(cfg.source);
  const repos = cfg.repos.map((r, i) => {
    const base = { n: i + 1, name: r.name, path: r.path, status: r.status, reason: r.reason || null };
    if (!existsSync(r.path)) return { ...base, error: 'path missing' };
    try {
      const url = git(r.path, ['remote', 'get-url', 'origin'], { allowFail: true });
      if (!url) return { ...base, skip: 'no origin remote' };
      if (!/github\.com[:/]/.test(url)) return { ...base, skip: `origin is not on GitHub (${url})` };
      if (git(r.path, ['fetch', '--quiet', 'origin'], { allowFail: true }) === null) return { ...base, error: 'git fetch origin failed' };
      const ref = defaultBranch(r.path);
      if (!ref) return { ...base, skip: 'no origin/HEAD, origin/main, or origin/master — push main first' };
      const drift = skillDriftAtRef(cfg.source, r.path, ref);
      const skips = [...layoutProblems(r.path, ref, drift.skills), ...divergence(r.path, ref), ...leftovers(r.path)];
      return { ...base, base: ref, branch: BRANCH_PREFIX + source.short, ...drift, skip: skips.join('; ') || null };
    } catch (e) {
      return { ...base, error: e.message };
    }
  });
  for (const r of repos) r.eligible = source.ok && r.status === 'active' && !r.error && !r.skip && r.stale.length > 0;
  return { source, registry: CONFIG, repos };
}

function cmdPlan(args) {
  const cfg = loadConfig();
  const plan = buildPlan(cfg);
  if (args.includes('--json')) return console.log(JSON.stringify(plan, null, 2));
  printPlan(plan);
}

function printPlan(plan) {
  const s = plan.source;
  console.log(`source ${tilde(s.path)} @ ${s.short} ${s.ok ? '✓' : '✗ ' + s.problems.join('; ')}`);
  console.log('');
  console.log(`${'#'.padEnd(3)} ${'repo'.padEnd(14)} ${'status'.padEnd(8)} out-of-date`);
  for (const r of plan.repos) {
    let detail;
    if (r.error) detail = `error: ${r.error}`;
    else if (r.status === 'hold') detail = `held${r.reason ? ` — ${r.reason}` : ''}`;
    else if (r.skip) detail = `skip: ${r.skip}`;
    else if (r.stale.length === 0) detail = 'up to date';
    else detail = `${r.stale.length}: ${r.stale.join(', ')}`;
    if (r.missing?.length) detail += `  (not in source: ${r.missing.join(', ')})`;
    console.log(`${String(r.n).padEnd(3)} ${r.name.padEnd(14)} ${r.status.padEnd(8)} ${detail}`);
  }
}

function cmdList(args) {
  const cfg = loadConfig();
  if (args.includes('--json')) return console.log(JSON.stringify(cfg, null, 2));
  console.log(`source ${tilde(cfg.source)}\n`);
  if (cfg.repos.length === 0) return console.log('No repos registered. Run: registry.mjs add');
  for (const r of cfg.repos) console.log(`${r.name.padEnd(14)} ${r.status.padEnd(7)} ${tilde(r.path)}${r.reason ? `  — ${r.reason}` : ''}`);
}

// Copies every stale awesome-skills skill into <dir> (a worktree) and updates skills-lock.json hashes.
// Refuses unless the source is still clean and on the commit the plan saw.
function cmdApply(args) {
  const i = args.indexOf('--sha');
  const sha = i >= 0 ? args[i + 1] : null;
  const dir = args.find((a, j) => !a.startsWith('--') && (i < 0 || j !== i + 1));
  if (!dir || !sha || sha.length < 7) fail('usage: apply <worktree path> --sha <source sha from plan>');
  const cfg = loadConfig();
  const head = git(cfg.source, ['rev-parse', 'HEAD']);
  const { problems } = localSourceProblems(cfg.source);
  if (!head.startsWith(sha)) problems.push(`source HEAD is ${head.slice(0, 7)}, plan saw ${sha.slice(0, 7)} — rerun plan`);
  if (problems.length) fail(problems.join('; '));
  const path = expand(dir);
  const lock = readLock(path);
  if (!lock) fail(`${tilde(path)} has no skills-lock.json`);
  const { stale, missing } = skillDrift(cfg.source, path);
  const targets = stale.map((skill) => ({ skill, dirs: installDirs(path, skill) }));
  const bare = targets.filter((t) => t.dirs.length === 0).map((t) => t.skill);
  if (bare.length) fail(`no install folder in ${tilde(path)} for: ${bare.join(', ')}`);
  const changed = [];
  for (const { skill, dirs } of targets) {
    const files = sourceFiles(cfg.source, skill);
    for (const d of dirs) {
      rmSync(d, { recursive: true, force: true });
      for (const f of files) {
        mkdirSync(dirname(join(d, f.rel)), { recursive: true });
        cpSync(f.abs, join(d, f.rel));
      }
    }
    lock.skills[skill].computedHash = hashFiles(files);
    changed.push({ skill, dirs: dirs.map((d) => relative(path, d)) });
  }
  if (changed.length) writeFileSync(join(path, 'skills-lock.json'), JSON.stringify(lock, null, 2) + '\n');
  console.log(JSON.stringify({ path, sourceSha: head, changed, missing }, null, 2));
}

function help() {
  console.log(`syncing-awesome-skills registry  (${tilde(CONFIG)})

  init [--source <path>]        set your awesome-skills clone; no path clones one into
                                ${tilde(CACHE)}, fast-forwarded on every plan
  list [--json]                 registered repos
  add [path …] [--in <dir>] [--json]
                                register repos; no path lists candidates in <dir> (default: cwd)
  delete <name>                 remove a repo from the registry
  hold <name> [--reason <text>] keep listed, skip in syncs
  resume <name>                 undo hold
  plan [--json]                 fetch, check preconditions, then out-of-date skills per repo
                                on origin/<default>; failing repos show "skip: <reason>"
  apply <path> --sha <sha>      copy stale skills into <path>, update skills-lock.json;
                                refuses unless the source is clean and still at <sha>

Run with no arguments in a terminal for an interactive menu.`);
}

// ---------- interactive menu ----------

async function menu() {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const ask = async (q) => (await rl.question(q)).trim();
  try {
    if (!loadConfig({ required: false })) {
      const src = await ask(`Your awesome-skills clone (blank: clone into ${tilde(CACHE)}): `);
      cmdInit(src ? ['--source', src] : []);
    }
    for (;;) {
      console.log('');
      const cfg = loadConfig();
      cmdList([]);
      console.log('\n[p]lan  [a]dd  [d]elete  [h]old  [r]esume  [q]uit');
      const choice = (await ask('> ')).toLowerCase()[0];
      if (!choice || choice === 'q') break;
      if (choice === 'p') printPlan(buildPlan(cfg));
      else if (choice === 'a') {
        const dir = (await ask(`Folder to scan [${tilde(process.cwd())}]: `)) || process.cwd();
        const found = candidates(cfg, expand(dir));
        if (found.length === 0) {
          const p = await ask('No candidates found. Path to add (blank to cancel): ');
          if (p) cmdAdd([p]);
          continue;
        }
        found.forEach((p, i) => console.log(`  ${i + 1}. ${basename(p).padEnd(14)} ${tilde(p)}`));
        const pick = await ask('Numbers to add (e.g. 1,3), "all", or a path: ');
        if (!pick) continue;
        if (pick === 'all') cmdAdd(found);
        else if (/^[\d,\s]+$/.test(pick)) cmdAdd(pick.split(/[,\s]+/).filter(Boolean).map((n) => found[Number(n) - 1]).filter(Boolean));
        else cmdAdd([pick]);
      } else if ('dhr'.includes(choice)) {
        const name = await ask('Repo name: ');
        if (!name || !cfg.repos.some((r) => r.name === name)) {
          console.log('Unknown repo.');
          continue;
        }
        if (choice === 'd') {
          if ((await ask(`Delete ${name} from the registry? [y/N] `)).toLowerCase() === 'y') cmdDelete([name]);
        } else if (choice === 'h') cmdHold([name, '--reason', await ask('Reason (optional): ')]);
        else cmdResume([name]);
      }
    }
  } finally {
    rl.close();
  }
}

// ---------- main ----------

const [cmd, ...args] = process.argv.slice(2);
const commands = { init: cmdInit, list: cmdList, add: cmdAdd, delete: cmdDelete, hold: cmdHold, resume: cmdResume, plan: cmdPlan, apply: cmdApply, help };

try {
  if (!cmd) {
    if (process.stdin.isTTY) await menu();
    else help();
  } else if (commands[cmd]) {
    commands[cmd](args);
  } else {
    fail(`unknown command "${cmd}"; run: registry.mjs help`);
  }
} catch (e) {
  fail(e.message);
}
