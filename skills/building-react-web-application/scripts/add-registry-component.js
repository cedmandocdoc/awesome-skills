#!/usr/bin/env node
/**
 * Add or inspect a shadcn/ui registry component for a Vite React web app (primitives in src/ui).
 * Extra cssVars from the registry append to src/theme.css (see setting-up-theming.md).
 *
 * Usage (from your project root):
 *   node <path-to-skill>/scripts/add-registry-component.js <component-name-or-url> [more...] [--root <dir>] [--pm npm|pnpm|yarn|bun]
 *
 * Examples:
 *   node .../add-registry-component.js button
 *   node .../add-registry-component.js https://ui.shadcn.com/r/styles/new-york/button.json
 *
 * Options:
 *   --root <dir>              Project root (default: cwd)
 *   --pm <npm|pnpm|yarn|bun>  Package manager (default: detect from lockfile or package.json#packageManager)
 *
 * Uses: npx | pnpm dlx | yarn dlx | bunx — shadcn@latest view <name-or-url>
 * Yarn 1 (no .yarnrc.yml): view uses npx; installs still use yarn add.
 * Schema: https://ui.shadcn.com/schema/registry-item.json
 */

const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const VALID_PM = new Set(["npm", "pnpm", "yarn", "bun"]);

function parseArgs(argv) {
  const args = { root: process.cwd(), urls: [], pm: null };
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
    } else if (!a.startsWith("-")) {
      args.urls.push(a);
    }
  }
  return args;
}

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

/** Prefer explicit --pm, then package.json#packageManager, then lockfiles. */
function detectPackageManager(projectRoot) {
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

function isYarnBerry(projectRoot) {
  return fs.existsSync(path.join(projectRoot, ".yarnrc.yml"));
}

function shadcnViewArgs(pm, projectRoot, nameOrUrl) {
  if (pm === "pnpm") {
    return { file: "pnpm", args: ["dlx", "shadcn@latest", "view", nameOrUrl] };
  }
  if (pm === "bun") {
    return { file: "bunx", args: ["shadcn@latest", "view", nameOrUrl] };
  }
  if (pm === "yarn") {
    if (isYarnBerry(projectRoot)) {
      return {
        file: "yarn",
        args: ["dlx", "shadcn@latest", "view", nameOrUrl],
      };
    }
    return { file: "npx", args: ["shadcn@latest", "view", nameOrUrl] };
  }
  return { file: "npx", args: ["shadcn@latest", "view", nameOrUrl] };
}

function packageInstall(projectRoot, deps, dev, pm) {
  if (!deps || deps.length === 0) return;
  let file;
  let args;
  if (pm === "pnpm") {
    file = "pnpm";
    args = dev ? ["add", "-D", ...deps] : ["add", ...deps];
  } else if (pm === "yarn") {
    file = "yarn";
    args = dev ? ["add", "-D", ...deps] : ["add", ...deps];
  } else if (pm === "bun") {
    file = "bun";
    args = dev ? ["add", "-d", ...deps] : ["add", ...deps];
  } else {
    file = "npm";
    args = dev ? ["install", "--save-dev", ...deps] : ["install", ...deps];
  }
  execFileSync(file, args, {
    cwd: projectRoot,
    stdio: "inherit",
  });
}

function parseRegistryJson(raw) {
  const trimmed = raw.trim();
  const fence = trimmed.match(/^```(?:json)?\s*([\s\S]*?)```$/m);
  const jsonText = fence ? fence[1].trim() : trimmed;
  return JSON.parse(jsonText);
}

function runView(nameOrUrl, cwd, pm) {
  const { file, args } = shadcnViewArgs(pm, cwd, nameOrUrl);
  return execFileSync(file, args, {
    cwd,
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"],
  });
}

/**
 * Registry dependency slug from shadcn metadata: pass through URLs; otherwise treat as component name for `shadcn view`.
 */
function resolveDependencyRef(dep) {
  if (/^https?:\/\//i.test(dep)) return dep;
  if (dep.startsWith("@")) {
    throw new Error(
      `Namespaced registry dependency "${dep}" needs an explicit URL; add it manually.`,
    );
  }
  return dep.replace(/\.json$/i, "").replace(/^\//, "");
}

function transformSource(content, fromFilePath, componentsDir) {
  let out = content;

  // cn → cx on imports and calls; registry targets a utils `cn` module, this stack uses CVA `cx`
  out = out.replace(
    /import\s*\{\s*cn\s*\}\s*from\s*['"][^'"]+['"]\s*;/g,
    'import { cx } from "class-variance-authority";',
  );
  out = out.replace(/\bcn\s*\(/g, "cx(");

  const relDir = path.dirname(fromFilePath);

  function toRelativeImport(spec) {
    const clean = spec.replace(/\.tsx?$/, "");
    const target = path.join(componentsDir, clean);
    let rel = path.relative(relDir, target);
    if (!rel.startsWith(".")) rel = `./${rel}`;
    return rel.replace(/\\/g, "/");
  }

  // Legacy RN registry paths
  out = out.replace(
    /from\s*['"]@\/registry\/nativewind\/components\/ui\/([^'"]+)['"]/g,
    (_, spec) => `from '${toRelativeImport(spec)}'`,
  );

  // Default shadcn: @/components/ui/* -> relative under src/ui
  out = out.replace(
    /from\s*['"]@\/components\/ui\/([^'"]+)['"]/g,
    (_, spec) => `from '${toRelativeImport(spec)}'`,
  );

  // Projects that alias ui to @/ui/* already
  out = out.replace(
    /from\s*['"]@\/ui\/([^'"]+)['"]/g,
    (_, spec) => `from '${toRelativeImport(spec)}'`,
  );

  return out;
}

/** e.g. button, my-button, myButton -> Button, MyButton */
function toPascalCaseStem(stem) {
  const withBoundaries = stem.replace(/([a-z\d])([A-Z])/g, "$1-$2");
  return withBoundaries
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join("");
}

/** Component files (.ts/.tsx) are saved with a PascalCase basename. */
function normalizeComponentFileName(filePath) {
  const ext = path.extname(filePath);
  if (!/\.tsx?$/i.test(ext)) return filePath;
  const dir = path.dirname(filePath);
  const stem = path.basename(filePath, ext);
  const pascal = toPascalCaseStem(stem);
  return path.join(dir, pascal + ext);
}

function targetPathForFile(projectRoot, fileMeta) {
  let full;
  if (fileMeta.target) {
    full = path.join(projectRoot, fileMeta.target.replace(/^\~\//, ""));
  } else {
    const p = fileMeta.path || "";
    const baseName = path.basename(p);
    full = path.join(projectRoot, "src/ui", baseName);
  }
  return normalizeComponentFileName(full);
}

/** Registry cssVars merges append to src/theme.css (same as RN skill’s theme.css). */
function themeCssPath(projectRoot) {
  return path.join(projectRoot, "src/theme.css");
}

function appendCssVars(projectRoot, cssVars) {
  if (!cssVars) return;
  const themePath = themeCssPath(projectRoot);
  const blocks = [];
  if (cssVars.theme && Object.keys(cssVars.theme).length) {
    blocks.push(
      `/* registry merge: theme */\n  :root {\n${Object.entries(cssVars.theme)
        .map(([k, v]) => `    --${k}: ${v};`)
        .join("\n")}\n  }`,
    );
  }
  if (cssVars.light && Object.keys(cssVars.light).length) {
    blocks.push(
      `/* registry merge: light */\n  :root {\n${Object.entries(cssVars.light)
        .map(([k, v]) => `    --${k}: ${v};`)
        .join("\n")}\n  }`,
    );
  }
  if (cssVars.dark && Object.keys(cssVars.dark).length) {
    blocks.push(
      `/* registry merge: dark */\n  .dark {\n${Object.entries(cssVars.dark)
        .map(([k, v]) => `    --${k}: ${v};`)
        .join("\n")}\n  }`,
    );
  }
  if (blocks.length === 0) return;
  const banner = "\n\n@layer base {\n" + blocks.join("\n\n") + "\n}\n";
  fs.mkdirSync(path.dirname(themePath), { recursive: true });
  if (fs.existsSync(themePath)) {
    fs.appendFileSync(themePath, banner, "utf8");
  } else {
    fs.writeFileSync(
      themePath,
      `/* Registry merge — review and fold into src/theme.css per setting-up-theming.md */\n${banner}`,
      "utf8",
    );
  }
}

function logTailwindPatch(projectRoot, item) {
  if (!item.tailwind && !item.css) return;
  const patchDir = path.join(projectRoot, "src/.registry-patches");
  fs.mkdirSync(patchDir, { recursive: true });
  const safeName = String(item.name || "item").replace(/[^a-z0-9-_]/gi, "_");
  const out = path.join(patchDir, `${safeName}.json`);
  fs.writeFileSync(
    out,
    JSON.stringify({ tailwind: item.tailwind, css: item.css }, null, 2),
    "utf8",
  );
  console.warn(
    `[add-registry-component] Wrote tailwind/css fragment to ${out} — merge into src/theme.css or global.css / Vite+Tailwind if needed.`,
  );
}

function processRegistryRef(ref, projectRoot, visited, summary, pm) {
  if (visited.has(ref)) return;
  visited.add(ref);

  console.error(`[add-registry-component] view ${ref}`);
  let raw;
  try {
    raw = runView(ref, projectRoot, pm);
  } catch (e) {
    console.error(e.stderr?.toString?.() || e.message);
    throw new Error(`shadcn view failed for ${ref}`);
  }

  const parsed = parseRegistryJson(raw);
  const registryItems = Array.isArray(parsed) ? parsed : [parsed];
  const componentsDir = path.join(projectRoot, "src/ui");

  for (const item of registryItems) {
    if (!item || typeof item !== "object") continue;
    summary.items.push(item.name || ref);

    packageInstall(projectRoot, item.dependencies, false, pm);
    packageInstall(projectRoot, item.devDependencies, true, pm);
    appendCssVars(projectRoot, item.cssVars);
    logTailwindPatch(projectRoot, item);

    if (Array.isArray(item.files)) {
      for (const file of item.files) {
        const content = file.content;
        if (!content) {
          console.warn(
            `[add-registry-component] Skip file without content: ${file.path || file.target || "?"}`,
          );
          continue;
        }
        const dest = targetPathForFile(projectRoot, file);
        const transformed = transformSource(content, dest, componentsDir);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, transformed, "utf8");
        summary.filesWritten.push(dest);
      }
    }
  }

  const depSet = new Set();
  for (const it of registryItems) {
    if (!it || typeof it !== "object") continue;
    for (const d of it.registryDependencies || []) depSet.add(d);
  }
  const deps = [...depSet];
  for (const dep of deps) {
    let depRef;
    try {
      depRef = resolveDependencyRef(dep);
    } catch (err) {
      console.warn(`[add-registry-component] ${err.message}`);
      summary.skippedDeps.push(dep);
      continue;
    }
    const baseName = path.basename(depRef, ".json");
    const pascalBase = toPascalCaseStem(baseName.split("/").pop() || baseName);
    const tsx = path.join(componentsDir, `${pascalBase}.tsx`);
    const ts = path.join(componentsDir, `${pascalBase}.ts`);
    if (fs.existsSync(tsx) || fs.existsSync(ts)) {
      console.error(
        `[add-registry-component] skip existing ${pascalBase} in src/ui`,
      );
      continue;
    }
    processRegistryRef(depRef, projectRoot, visited, summary, pm);
  }
}

function main() {
  const { root, urls, pm: pmFlag } = parseArgs(process.argv);
  if (urls.length === 0) {
    console.error(
      "Usage: node add-registry-component.js <component-name|url> [more...] [--root <project-dir>] [--pm npm|pnpm|yarn|bun]",
    );
    process.exit(1);
  }

  const visited = new Set();
  const summary = { items: [], filesWritten: [], skippedDeps: [] };
  const projectRoot = path.resolve(root);
  const pm = pmFlag || detectPackageManager(projectRoot);
  console.error(`[add-registry-component] package manager: ${pm}`);

  for (const u of urls) {
    const ref = /^https?:\/\//i.test(u)
      ? u
      : u.replace(/\.json$/i, "").replace(/^\//, "");
    processRegistryRef(ref, projectRoot, visited, summary, pm);
  }

  console.log(JSON.stringify(summary, null, 2));
}

main();
