#!/usr/bin/env node
/**
 * Detect the package manager for a project root.
 *
 * Resolution order: explicit override → package.json#packageManager → lockfiles → npm.
 */

const fs = require("fs");
const path = require("path");

const VALID_PM = new Set(["npm", "pnpm", "yarn", "bun"]);

function readPackageManagerField(projectRoot) {
  try {
    const pkgPath = path.join(projectRoot, "package.json");
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

/** Prefer explicit override, then package.json#packageManager, then lockfiles. */
function detectPackageManager(projectRoot, { pmOverride = null } = {}) {
  if (pmOverride && VALID_PM.has(pmOverride)) return pmOverride;

  const fromPkg = readPackageManagerField(projectRoot);
  if (fromPkg) return fromPkg;
  if (fs.existsSync(path.join(projectRoot, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(projectRoot, "yarn.lock"))) return "yarn";
  if (
    fs.existsSync(path.join(projectRoot, "bun.lockb")) ||
    fs.existsSync(path.join(projectRoot, "bun.lock"))
  ) {
    return "bun";
  }
  return "npm";
}

module.exports = {
  VALID_PM,
  detectPackageManager,
};
