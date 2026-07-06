#!/usr/bin/env node
/**
 * Run a package via npx, pnpm dlx, yarn dlx, or bunx.
 *
 * Usage (from your Expo app root):
 *   node <path-to-skill>/scripts/run-package.cjs [options] -- <pkg> [args...]
 *
 * Examples:
 *   node .../run-package.cjs -- shadcn@latest view https://example.com/button.json
 *   node .../run-package.cjs -- expo install tailwindcss-animate lucide-react-native
 *
 * Options:
 *   --root <dir>              Project root (default: cwd)
 *   --pm <npm|pnpm|yarn|bun>  Package manager override
 *   --dry-run                 Print resolved command without executing
 *
 * Yarn 1 (no .yarnrc.yml): uses npx for dlx-style runs.
 */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { detectPackageManager, VALID_PM } = require("./detect-pm.cjs");

function isYarnBerry(projectRoot) {
  return fs.existsSync(path.join(projectRoot, ".yarnrc.yml"));
}

function resolveDlxCommand(pm, projectRoot, pkg, runArgs = []) {
  if (pm === "pnpm") {
    return { file: "pnpm", args: ["dlx", pkg, ...runArgs] };
  }
  if (pm === "bun") {
    return { file: "bunx", args: [pkg, ...runArgs] };
  }
  if (pm === "yarn" && isYarnBerry(projectRoot)) {
    return { file: "yarn", args: ["dlx", pkg, ...runArgs] };
  }
  return { file: "npx", args: [pkg, ...runArgs] };
}

function isExpoInstall(pkg, runArgs) {
  return pkg === "expo" && runArgs[0] === "install";
}

function parseArgs(argv) {
  const args = {
    root: process.cwd(),
    pm: null,
    dryRun: false,
    pkg: null,
    runArgs: [],
  };

  let i = 2;
  for (; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--root") {
      args.root = path.resolve(argv[i + 1] || "");
      i += 1;
    } else if (a === "--pm") {
      const v = (argv[i + 1] || "").toLowerCase();
      i += 1;
      if (!VALID_PM.has(v)) {
        console.error(
          `Invalid --pm "${v}". Use one of: ${[...VALID_PM].join(", ")}`,
        );
        process.exit(1);
      }
      args.pm = v;
    } else if (a === "--dry-run") {
      args.dryRun = true;
    } else {
      break;
    }
  }

  if (i < argv.length && argv[i] === "--") i += 1;
  if (i < argv.length) {
    args.pkg = argv[i];
    args.runArgs = argv.slice(i + 1);
  }

  return args;
}

function runPackage(projectRoot, pm, pkg, runArgs, { dryRun = false } = {}) {
  const { file, args } = resolveDlxCommand(pm, projectRoot, pkg, runArgs);
  if (dryRun) {
    console.log(JSON.stringify({ pm, file, args }, null, 2));
    return null;
  }

  if (isExpoInstall(pkg, runArgs)) {
    execFileSync(file, args, { cwd: projectRoot, stdio: "inherit" });
    return null;
  }

  return execFileSync(file, args, {
    cwd: projectRoot,
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function main() {
  const parsed = parseArgs(process.argv);
  if (!parsed.pkg) {
    console.error(
      "Usage: node run-package.cjs [options] -- <pkg> [args...]\n" +
        "Options: --root <dir> --pm npm|pnpm|yarn|bun --dry-run",
    );
    process.exit(1);
  }

  const projectRoot = path.resolve(parsed.root);
  const pm = detectPackageManager(projectRoot, { pmOverride: parsed.pm });
  console.error(`[run-package] package manager: ${pm}`);

  try {
    const output = runPackage(
      projectRoot,
      pm,
      parsed.pkg,
      parsed.runArgs,
      { dryRun: parsed.dryRun },
    );
    if (output != null) process.stdout.write(output);
  } catch (e) {
    console.error(e.stderr?.toString?.() || e.message);
    process.exit(1);
  }
}

module.exports = {
  isYarnBerry,
  isExpoInstall,
  resolveDlxCommand,
  runPackage,
};

if (require.main === module) {
  main();
}
