# Split jasonclewis.com and nextbuild.com into a pnpm monorepo

Current state: one Astro project at the repo root, `PUBLIC_BRAND` env var picks the active brand at build time. Theme tokens, layouts, and the `/insights` route are shared. Brand-specific divergence is handled by conditionals in `BaseLayout.astro` (today's friction).

Goal: two independent Astro apps in a pnpm workspace, deploying to two Vercel projects. Each app owns its own pages, layout, theme, public assets, and `PRODUCT.md`. Shared content (Directus articles for `/insights`) lives in one workspace package.

Premise (confirmed by user): the two sites are separate products with separate roadmaps; only the article *content* is shared.

---

## Target structure

```
content-site/
├── apps/
│   ├── jcl/
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   │   ├── index.astro                  ← was src/pages/jcl.astro
│   │   │   │   └── insights/
│   │   │   │       ├── index.astro
│   │   │   │       └── [slug].astro
│   │   │   ├── layouts/Layout.astro             ← spec-bar nav, dark, jcl-specific
│   │   │   └── components/                      ← jcl-only components (incl. GoogleAnalytics)
│   │   ├── public/
│   │   │   ├── favicon.svg                      ← was favicon-jcl.svg
│   │   │   └── images/jason_tie.png
│   │   ├── PRODUCT.md                           ← was PRODUCT.jcl.md
│   │   ├── astro.config.mjs
│   │   ├── package.json
│   │   ├── vercel.json
│   │   └── .env.example
│   └── nextbuild/
│       ├── src/
│       │   ├── pages/
│       │   │   ├── index.astro                  ← was src/pages/index.astro
│       │   │   └── insights/
│       │   │       ├── index.astro
│       │   │       └── [slug].astro
│       │   ├── layouts/Layout.astro             ← floating-pill nav, light, nextbuild-specific
│       │   └── components/
│       ├── public/
│       │   └── favicon.svg
│       ├── PRODUCT.md                           ← was PRODUCT.nextbuild.md
│       ├── astro.config.mjs
│       ├── package.json
│       ├── vercel.json
│       └── .env.example
├── packages/
│   └── insights-content/
│       ├── src/
│       │   ├── client.ts                        ← Directus client (getAllArticles, getArticle, …)
│       │   └── types.ts                         ← Article, Category, etc.
│       └── package.json                         ← @content-site/insights-content
├── pnpm-workspace.yaml
├── package.json                                 ← workspace root, no app code
├── .gitignore
└── README.md
```

Drop entirely:
- `src/lib/brands.ts` (no more brand abstraction)
- `src/middleware.ts` (no more `/` → `/jcl` rewrite — each app has its own root)
- `BaseLayout.astro`'s `isJcl` branch and `.spec-mode` CSS (lifted into `apps/jcl/src/layouts/Layout.astro`)
- `PUBLIC_BRAND` env var

---

## Migration steps

Run in order. Each step should leave the repo in a buildable, deployable state.

### 1. Workspace skeleton

```bash
mkdir -p apps/jcl apps/nextbuild packages/insights-content
```

Create `pnpm-workspace.yaml`:
```yaml
packages:
  - apps/*
  - packages/*
```

Create root `package.json` (no `"main"`, just devDeps):
```json
{
  "name": "content-site",
  "private": true,
  "scripts": {
    "dev:jcl": "pnpm --filter @content-site/jcl dev",
    "dev:nextbuild": "pnpm --filter @content-site/nextbuild dev",
    "build:jcl": "pnpm --filter @content-site/jcl build",
    "build:nextbuild": "pnpm --filter @content-site/nextbuild build"
  }
}
```

### 2. Extract `packages/insights-content`

- Move `src/lib/directus.ts` → `packages/insights-content/src/client.ts`. Keep the existing function signatures (`getAllArticles`, `getArticle`, etc.) so consumer pages don't change.
- Define `Article`, `Category` interfaces in `src/types.ts`.
- `package.json`: name `@content-site/insights-content`, dependencies on `@directus/sdk` and `marked` (move from root `package.json`).
- Reads `DIRECTUS_URL` and `DIRECTUS_TOKEN` from `process.env` (or `import.meta.env` if Astro). Each app sets these in its own `.env`.

### 3. Build `apps/jcl`

- `astro.config.mjs`: copy from root, drop the middleware integration, set `site: 'https://jasonclewis.com'`.
- `package.json`: name `@content-site/jcl`, depends on `astro`, `@astrojs/mdx`, `@astrojs/vercel`, `@content-site/insights-content` (workspace).
- `src/pages/index.astro` ← `src/pages/jcl.astro`. Drop brand-conditional logic (none in this file currently).
- `src/pages/insights/index.astro` and `[slug].astro` ← copy from root, swap `import BaseLayout` for `import Layout from '../../layouts/Layout.astro'`, and `import { getAllArticles } from '@content-site/insights-content'`.
- `src/layouts/Layout.astro`: lift the spec-bar nav (currently in jcl.astro inline + BaseLayout's `.spec-mode` branch). Self-contained, no brand check, no theme tokens — hard-code the dark surface, lime accent, Audiowide nav.
- `src/components/GoogleAnalytics.astro`: copy from root.
- `public/favicon.svg` ← `public/favicon-jcl.svg`. `public/images/jason_tie.png` ← move.
- `PRODUCT.md` ← `PRODUCT.jcl.md`.
- `.env.example`: list `DIRECTUS_URL`, `DIRECTUS_TOKEN`, `PUBLIC_GA_MEASUREMENT_ID`. No `PUBLIC_BRAND`.
- `vercel.json`: framework `astro`, install/build commands compatible with pnpm + workspace (see Vercel section below).

### 4. Build `apps/nextbuild`

Same shape as `apps/jcl` but with the floating-pill nav and nextbuild theme.

- `src/pages/index.astro` ← `src/pages/index.astro` (root).
- `src/pages/insights/*` ← same source as the jcl ones; the only difference is the layout import (uses nextbuild's `Layout.astro`).
- `src/layouts/Layout.astro`: the original `BaseLayout.astro` *minus* the `isJcl` branch. Floating-pill nav stays. Hard-code the nextbuild theme (orange `#ff6b35` accent, light `#f5f5f5` bg, Audiowide). Use the inline logo SVG that's currently in `brands.ts`.
- `PRODUCT.md` ← `PRODUCT.nextbuild.md`.

### 5. Shared content strategy (open question — confirm before executing)

The user said: *"Even /insights should have shared content."* Two interpretations — picking one is required before step 4 finalizes:

**Option A (recommended): single Directus collection, brand filtering at query time.**
- Add a `brands` multi-select field on the Directus `articles` collection. Values: `["jcl"]`, `["nextbuild"]`, or both.
- `getAllArticles({ brand })` in `@content-site/insights-content` filters by `brands` containing the requested brand. Each app passes its own brand string.
- Pro: one place to author, free curation per brand.

**Option B: separate Directus collections (`articles_jcl`, `articles_nextbuild`).**
- `getAllArticles()` in the package takes a collection name.
- Pro: hard isolation; one site editing the other is impossible.
- Con: cross-posting requires duplicate entries.

If neither, treat /insights articles as fully shared (no filter) — same list on both sites.

### 6. Vercel deployment

Two Vercel projects, both pointing at this repo, distinguished by Root Directory:

| Project | Root Directory | Domain | Install Command | Build Command |
|---|---|---|---|---|
| `jasonclewis-com` | `apps/jcl` | jasonclewis.com | `cd ../.. && pnpm install --frozen-lockfile` | `pnpm --filter @content-site/jcl build` |
| `nextbuild-com` | `apps/nextbuild` | nextbuild.com | `cd ../.. && pnpm install --frozen-lockfile` | `pnpm --filter @content-site/nextbuild build` |

Output Directory: `apps/<brand>/dist` (set per project).

Env vars duplicated per project (Directus URL/token, GA ID, Resend key). Both projects deploy on push to main; each watches its app's directory via Vercel's `Ignored Build Step` + a `git diff` check (or just always-build, both are fast).

The existing project (currently jasonclewis.com) keeps its domain — just point its Root Directory at `apps/jcl`. Create the second project fresh for nextbuild.com.

### 7. Cleanup

After both apps build and deploy successfully:
- `git rm -r src/ public/ astro.config.mjs PRODUCT.jcl.md PRODUCT.nextbuild.md PRODUCT.md` (the root copies — they live in apps/ now).
- Drop root-level `package.json` deps that are now per-app (`astro`, `@astrojs/*`, `marked`, etc.).
- Update `.gitignore`: keep ignoring `.claude/`, `public/preview/`, `.impeccable-live.json`. Add `apps/*/.vercel`, `apps/*/dist`, `apps/*/.astro`.

---

## Pre-migration checks

Before starting:

1. Inventory every file currently shared between the two brands. Run:
   ```bash
   git grep -l "PUBLIC_BRAND\|getBrandTheme\|isJcl"
   ```
   Each match needs a decision: which app owns it, or does both?
2. Diff the two `/insights` rendering paths today — `src/pages/insights/index.astro` and `[slug].astro`. They use `BaseLayout` and the brand theme. After split, confirm the diff between `apps/jcl/src/pages/insights/*` and `apps/nextbuild/src/pages/insights/*` is *only* the layout import; if more diverges, capture it before splitting.
3. Confirm the Directus token currently used has read scope on whatever brand-filtering field will be added (Option A above).
4. Confirm the active Vercel project's domain alias situation — the jasonclewis.com domain must move cleanly when Root Directory changes.

---

## Risks

- **Vercel preview URLs break for in-flight PRs** during the cutover (changing Root Directory invalidates existing preview deployments). Schedule the migration when no PRs are mid-review.
- **Directus filtering**: if Option A is chosen and the existing articles don't yet have a `brands` field, every existing article must be backfilled before the jcl app's `/insights` filter is enabled — otherwise jcl shows zero articles after deploy.
- **Lockfile conflicts**: existing `package-lock.json` (npm) becomes a `pnpm-lock.yaml`. Decide whether to delete the old lockfile or keep one app on npm. Cleanest: switch entirely to pnpm.
- **`/jcl` legacy URL**: anyone with a bookmark to `jasonclewis.com/jcl` will 404 after the middleware rewrite goes away. Add a `vercel.json` redirect in `apps/jcl` from `/jcl` → `/`.

---

## Acceptance criteria

- `pnpm dev:jcl` runs `apps/jcl` on port 4321 with the spec-bar nav.
- `pnpm dev:nextbuild` runs `apps/nextbuild` on port 4321 with the floating-pill nav.
- Both apps build cleanly via `pnpm build:<brand>`.
- jasonclewis.com on Vercel points at `apps/jcl` and shows the spec-bar nav at `/` and `/insights`.
- nextbuild.com on Vercel points at `apps/nextbuild` and shows the floating-pill nav at `/` and `/insights`.
- No file outside `apps/<brand>/` references `PUBLIC_BRAND`, `getBrandTheme`, or `isJcl`.
- Editing `apps/jcl/src/layouts/Layout.astro` cannot affect nextbuild.com, and vice versa.
- `/insights` content reflects the chosen shared-content strategy (Option A or B) — verified by adding an article in Directus and seeing it appear (or not) on each app per filter.

---

## Estimated effort

Half a day for steps 1–6 if Directus already supports the filter strategy. Add a few hours if the Directus schema needs a migration (Option A backfill).
