#!/usr/bin/env node
/**
 * Detect the package manager for an app package root.
 *
 * Resolution order: explicit override → walk up from the package root for
 * package.json#packageManager or lockfiles → npm.
 * Install/run cwd stays at the package root (--root); only detection walks up.
 */

const fs = require("fs");
const path = require("path");

const VALID_PM = new Set(["npm", "pnpm", "yarn", "bun"]);

function readPackageManagerField(dir) {
  try {
    const pkgPath = path.join(dir, "package.json");
    const raw = fs.readFileSync(pkgPath, "utf8");
    const pkg = JSON.parse(raw);
    const spec = pkg.packageManager;
    if (typeof spec !== "string") return null;
    const name = spec.split("@")[0];
    return VALID_PM.has(name) ? name : null;
  } catch {
    return null;
  }
}

function detectFromDir(dir) {
  const fromPkg = readPackageManagerField(dir);
  if (fromPkg) return fromPkg;
  if (fs.existsSync(path.join(dir, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(dir, "yarn.lock"))) return "yarn";
  if (
    fs.existsSync(path.join(dir, "bun.lockb")) ||
    fs.existsSync(path.join(dir, "bun.lock"))
  ) {
    return "bun";
  }
  return null;
}

/** Nearest ancestor path (inclusive) that contains `fileName`, or null. */
function findUpFile(startDir, fileName) {
  let dir = path.resolve(startDir);
  while (true) {
    const candidate = path.join(dir, fileName);
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

/**
 * Prefer explicit override, then nearest packageManager/lockfile walking up
 * from the app package root (monorepo-safe).
 */
function detectPackageManager(projectRoot, { pmOverride = null } = {}) {
  if (pmOverride && VALID_PM.has(pmOverride)) return pmOverride;

  let dir = path.resolve(projectRoot);
  while (true) {
    const detected = detectFromDir(dir);
    if (detected) return detected;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return "npm";
}

module.exports = {
  VALID_PM,
  detectPackageManager,
  findUpFile,
};
