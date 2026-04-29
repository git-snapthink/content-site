# content-site

pnpm monorepo containing two Astro apps:

- `apps/jcl` → [jasonclewis.com](https://jasonclewis.com) (spec-bar nav, lime accent)
- `apps/nextbuild` → [nextbuild.com](https://nextbuild.com) (floating-pill nav, orange accent)

The two sites share no code — only Directus as a shared CMS, with each app filtering articles by its own `brand` field.

## Project structure

```
content-site/
├── apps/
│   ├── jcl/                 # @content-site/jcl
│   └── nextbuild/           # @content-site/nextbuild
├── pnpm-workspace.yaml
├── package.json             # workspace orchestration scripts
└── pnpm-lock.yaml
```

## Commands

Run from the repo root:

| Command | Action |
| --- | --- |
| `pnpm install` | Install all workspace dependencies |
| `pnpm dev:jcl` | Start `apps/jcl` dev server on `localhost:4321` |
| `pnpm dev:nextbuild` | Start `apps/nextbuild` dev server on `localhost:4321` |
| `pnpm build:jcl` | Build `apps/jcl` |
| `pnpm build:nextbuild` | Build `apps/nextbuild` |
| `pnpm build` | Build both apps (recursive) |

Each app also accepts direct invocation, e.g. `pnpm --filter @content-site/jcl astro check`.

## Environment

Each app has its own `.env` (gitignored) and `.env.example`. Copy the example, fill values, and run.

- `apps/jcl/.env` → `DIRECTUS_URL`, `DIRECTUS_TOKEN`, `PUBLIC_GA_MEASUREMENT_ID`
- `apps/nextbuild/.env` → same plus `RESEND_API_KEY`

## Deployment

Two Vercel projects, both linked to this repo:

| Project | Domain | Root Directory |
| --- | --- | --- |
| `jasonclewis` | jasonclewis.com | `apps/jcl` |
| `nextbuild` | nextbuild.com | `apps/nextbuild` |

Each app's `vercel.json` overrides install/build commands to use pnpm workspace filters. Env vars are configured per project via `vercel env add`.

## Adding articles

Articles live in Directus. Each article has a `brand` field; set it to either `jason-c-lewis` or `nextbuild` to control which site renders the article at `/insights/<slug>`.
