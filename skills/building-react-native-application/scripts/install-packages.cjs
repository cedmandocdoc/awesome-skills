#!/usr/bin/env node
/**
 * Install npm packages using the project's detected package manager.
 *
 * Usage (from your Expo app root):
 *   node <path-to-skill>/scripts/install-packages.cjs [options] [<pkg> ...]
 *
 * No package args runs a lockfile install (`pnpm install` / `npm install` / …).
 *
 * Options:
 *   --root <dir>              App package root (default: cwd); PM detection walks up
 *   --pm <npm|pnpm|yarn|bun>  Package manager override
 *   --dev                     Save as devDependency (ignored for lockfile install)
 *   --dry-run                 Print resolved command without executing
 *
 * For Expo SDK-pinned installs, use run-package.cjs -- expo install <pkg> instead.
 */

const { execFileSync } = require("child_process");
const path = require("path");
const { detectPackageManager, VALID_PM } = require("./detect-pm.cjs");

function resolveInstallCommand(pm, { dev = false, packages = [] } = {}) {
  if (!packages.length) {
    if (pm === "pnpm") return { file: "pnpm", args: ["install"] };
    if (pm === "yarn") return { file: "yarn", args: ["install"] };
    if (pm === "bun") return { file: "bun", args: ["install"] };
    return { file: "npm", args: ["install"] };
  }

  if (pm === "pnpm") {
    return {
      file: "pnpm",
      args: dev ? ["add", "-D", ...packages] : ["add", ...packages],
    };
  }
  if (pm === "yarn") {
    return {
      file: "yarn",
      args: dev ? ["add", "-D", ...packages] : ["add", ...packages],
    };
  }
  if (pm === "bun") {
    return {
      file: "bun",
      args: dev ? ["add", "-d", ...packages] : ["add", ...packages],
    };
  }
  return {
    file: "npm",
    args: dev
      ? ["install", "--save-dev", ...packages]
      : ["install", ...packages],
  };
}

function parseArgs(argv) {
  const args = {
    root: process.cwd(),
    pm: null,
    dev: false,
    dryRun: false,
    packages: [],
  };

  for (let i = 2; i < argv.length; i += 1) {
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
    } else if (a === "--dev") {
      args.dev = true;
    } else if (a === "--dry-run") {
      args.dryRun = true;
    } else if (!a.startsWith("-")) {
      args.packages.push(a);
    }
  }

  return args;
}

function installPackages(projectRoot, pm, options) {
  const { file, args } = resolveInstallCommand(pm, options);
  if (options.dryRun) {
    console.log(JSON.stringify({ pm, file, args }, null, 2));
    return;
  }
  execFileSync(file, args, { cwd: projectRoot, stdio: "inherit" });
}

function main() {
  const parsed = parseArgs(process.argv);
  const projectRoot = path.resolve(parsed.root);
  const pm = detectPackageManager(projectRoot, { pmOverride: parsed.pm });
  console.error(`[install-packages] package manager: ${pm}`);

  installPackages(projectRoot, pm, {
    dev: parsed.dev,
    packages: parsed.packages,
    dryRun: parsed.dryRun,
  });
}

module.exports = {
  resolveInstallCommand,
  installPackages,
};

if (require.main === module) {
  main();
}
