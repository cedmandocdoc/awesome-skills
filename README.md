# awesome-skills

A catalog of installable [agent skills](https://www.npmjs.com/package/skills) for coding agents such as Cursor, Claude Code, Codex, and OpenCode. Each skill lives under `skills/` and is self-contained — copy or install only what you need.

## Install

Install skills from this repository with the [skills CLI](https://www.npmjs.com/package/skills):

```bash
npx skills add cedmandocdoc/awesome-skills
```

The CLI walks you through which skills to install and where to put them (project or global). To see what is available without installing:

```bash
npx skills add cedmandocdoc/awesome-skills --list
```

### Common options

| Option | Description |
| --- | --- |
| `-g, --global` | Install to your user directory instead of the current project |
| `-s, --skill <name>` | Install one or more skills by folder name (repeat or pass multiple) |
| `-a, --agent <agent>` | Target a specific agent (e.g. `cursor`) |
| `-y, --yes` | Skip confirmation prompts |
| `--copy` | Copy files instead of symlinking |

Examples:

```bash
# Install only the task-management skill
npx skills add cedmandocdoc/awesome-skills --skill managing-tasks

# Install to Cursor globally, non-interactive
npx skills add cedmandocdoc/awesome-skills -g -a cursor -y

# Try a skill without installing (pipes a prompt to your agent)
npx skills use cedmandocdoc/awesome-skills@managing-tasks --agent cursor
```

Source formats also work: full GitHub URL, a path to a single skill, or a local clone (`npx skills add ./awesome-skills`). See the [skills package README](https://www.npmjs.com/package/skills) for the full CLI reference.

## Available skills

| Skill | What it does |
| --- | --- |
| [`managing-tasks`](skills/managing-tasks/) | Structured task folders (`plan.md`, `status.md`) for cross-session agent handoff — create, execute, triage, block, verify, and archive work on disk. |
| [`building-product-specifications`](skills/building-product-specifications/) | Create and amend product specs (PRD, FRD, TRD, user stories, UI specs with view states) with consistent layout and frontmatter — docs only, no implementation. |
| [`managing-design`](skills/managing-design/) | Produce design.md visual systems and Google Stitch / Figma / Claude Design handoffs from PRDs, user stories, and UI specs. |
| [`building-react-web-application`](skills/building-react-web-application/) | Build Vite + React SPAs with a fixed stack: Tailwind v4, TanStack Router/Query, Zustand, Axios, and shadcn-style UI in `src/ui`. |
| [`building-react-native-application`](skills/building-react-native-application/) | Build Expo/React Native apps with NativeWind, React Navigation, TanStack Query, Zustand, Axios, and reusable primitives in `src/ui`. |
| [`deploying-cloudflare-web-application`](skills/deploying-cloudflare-web-application/) | Deploy static web apps to Cloudflare via Workers Builds and GitHub integration — discovery, `wrangler.toml`, and dashboard settings. |
| [`deploying-supabase-application`](skills/deploying-supabase-application/) | Prepare Supabase backends for production — validate migrations and Edge Functions, connect GitHub integration, document dashboard settings. |
| [`deploying-expo-native-application`](skills/deploying-expo-native-application/) | Prepare Expo iOS/Android apps for EAS Build — discover the app package, configure `eas.json` profiles and EAS secrets, and validate release readiness. |

After installation, your agent loads skills from its configured skills directory (for example `.cursor/skills/` or `~/.cursor/skills/`). Invoke a skill by describing the task in natural language; the agent reads `SKILL.md` and follows the linked recipes.

## Complementary skills

These external skill collections pair well with skills in this catalog. Install them the same way with the [skills CLI](https://www.npmjs.com/package/skills):

| Collection | Install | Pairs with |
| --- | --- | --- |
| [antfu/skills](https://github.com/antfu/skills) — `pnpm` | `npx skills add antfu/skills --skill pnpm` | [`building-react-web-application`](skills/building-react-web-application/), [`building-react-native-application`](skills/building-react-native-application/) |
| [supabase/agent-skills](https://github.com/supabase/agent-skills) | `npx skills add supabase/agent-skills` | [`deploying-supabase-application`](skills/deploying-supabase-application/) |
| [expo/skills](https://github.com/expo/skills) — `expo-cicd-workflows`, `expo-deployment`, `expo-dev-client` | `npx skills add expo/skills --skill expo-cicd-workflows --skill expo-deployment --skill expo-dev-client` | [`building-react-native-application`](skills/building-react-native-application/), [`deploying-expo-native-application`](skills/deploying-expo-native-application/) |

Examples:

```bash
# pnpm conventions for Vite and Expo projects
npx skills add antfu/skills --skill pnpm

# Supabase development and Postgres best practices
npx skills add supabase/agent-skills

# EAS workflows, store deployment, and dev-client builds
npx skills add expo/skills --skill expo-cicd-workflows --skill expo-deployment --skill expo-dev-client
```

## Contributing

See [`AGENTS.md`](AGENTS.md) for how skills in this catalog are structured and written.
