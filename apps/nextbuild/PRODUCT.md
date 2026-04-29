# PRODUCT — NextBuild (nextbuild.com)

## Register

**brand** — pre-launch landing page for an AI-builder community / playbook product. Design IS the product right now; it's the entire customer-facing surface. Single conversion goal: capture email for early access.

## What it is

NextBuild is positioned as "AI playbooks, tools, and community for builders and founders." The site is currently a single landing page promising early access to:

- AI Playbooks (step-by-step implementation guides)
- Tool Reviews (honest, no-affiliate)
- Founder Stories
- Weekly Briefing
- Early Access to Tools
- A Builder Community

Hosted in the same Astro project as jasonclewis.com; this brand is the default when `PUBLIC_BRAND` is unset or `nextbuild`. Lives at [src/pages/index.astro](src/pages/index.astro).

## Audience

**Builders and founders** — people who want to ship AI products, not study AI.

Specifically:
- Solo founders / indie hackers / "solopreneurs" using AI as leverage.
- Early-stage founders evaluating which AI capabilities to bet on.
- Operators inside small teams who'll be the ones actually building, not delegating.

Common thread: action-biased. Tired of demo culture, tutorial videos, and AI-tool listicles. They want to compress the distance from idea to revenue.

## Tone

- Punchy, builder-energy, second-person ("you").
- Imperatives: "Stop researching. Start building." "Pick a Playbook. Follow the Steps. Ship & Iterate."
- Anti-hype but not anti-AI. The position is "AI is real, most people are stuck — here's the bridge."
- Confident, slightly irreverent toward "tutorial hell" and "information overload."
- No buzzword density. No "synergy," "revolutionize," "10x," "game-changing."

The voice should feel like a founder talking to other founders, not a marketer talking to a persona.

## Strategic principles

1. **Single CTA: get early access.** Hero form, mid-page, and bottom form all collect the same email. POST to `/api/subscribe` (handled in [src/pages/api/subscribe.ts](src/pages/api/subscribe.ts)).
2. **Promise specificity, not access.** The differentiation is "playbooks > tutorials" and "real builders > pundits." Every benefit on the page should pass the test: *would this also describe a generic AI Substack?* If yes, sharpen it.
3. **No social proof yet — don't fake it.** Pre-launch product. Resist the urge to add fabricated testimonials, fake logos, or "trusted by 10,000 founders" bars. Earn proof, don't print it.
4. **Visual energy without theatrics.** Hero uses subtle grid + radial glow orbs in the brand orange. It should feel built-by-builders, not marketing-team-stock.
5. **Mobile-first reality check.** Founders read this on their phones at 11pm. Forms must be one-thumb. Sections must breathe on a 375px viewport.

## Anti-references (do not become these)

- "AI for everyone" SaaS landing pages with three-column hero metrics ("10x faster," "50% cheaper," "100k+ users") and a gradient hero.
- Indie-hacker template clones: vertical timeline → screenshot carousel → pricing table → FAQ.
- Newsletter-pretending-to-be-product pages: a giant Substack embed with a hero above it.
- Crypto / web3 aesthetic: neon, glassmorphism stacks, glowing 3D shapes.
- Generic "build with AI" pages that all use the same Inter / Plus Jakarta + purple gradient combo.
- Dashboard-shaped marketing pages with fake metric cards and chart placeholders.
- Identical 6-card feature grids with stock Lucide icons. (The current page has six features in a grid — when iterating, vary the layout: at least one should break the rhythm rather than reinforce it.)

## Strategic principles for visual treatment

- **Bold, not loud.** Orange (`#ff6b35`) is the signature. Use it with conviction in CTAs, accents, and selectively in display copy. Don't pastel it. Don't dilute it.
- **Light surface, warm neutral background.** `#f5f5f5` body with white cards. Never `#fff`/`#000`. The whole palette should tilt warm by 1–2°.
- **Display = Audiowide.** Geometric, tech-adjacent, distinctive. Body = system-ui. Don't add a third display font.
- **Motion is reveal, not decoration.** Sections fade-up on scroll via `IntersectionObserver`. No parallax, no scroll-jacking, no sticky carousel.

## Constraints

- **Stack**: static Astro 6, single `.astro` page at [src/pages/index.astro](src/pages/index.astro), shared layout in [src/layouts/LandingLayout.astro](src/layouts/LandingLayout.astro). Brand theme is in [src/lib/brands.ts](src/lib/brands.ts) under the `nextbuild` key.
- **Subscribe**: POST to `/api/subscribe` — server route handles the actual list write. Don't introduce a second list. Don't add a popup, no exit-intent modal, no scroll-percentage dialog.
- **Performance**: prerendered, deployed via `@astrojs/vercel`. Inline-styles only via Astro's `<style>`. No client framework, no React, no Tailwind runtime — keep it that way.
- **Insights archive**: `/insights` and `/insights/[slug]` are shared with the jcl brand. Any change there affects both sites.
- **Analytics**: GA via `PUBLIC_GA_MEASUREMENT_ID`. Don't add more.

## Out of scope (for now)

- Pricing, checkout, paid tiers — pre-launch, no commerce.
- Login, member area, gated content. Email-only capture.
- Multi-language. English only.
- A blog under nextbuild.com (insights are currently shared and not branded as NextBuild content). Revisit if NextBuild gets its own publication track.

## What "done well" looks like for the next redesign pass

- The hero passes the *category-reflex* test: a builder seeing it can't immediately guess the category from the colors and type alone. (Today the orange + Audiowide combo passes; lazy iterations toward "AI tech blue" would fail.)
- The six feature cards are no longer six identical cards.
- The form micro-copy still reads "Free to join. No spam. Just early access." — that line is doing real work.
- A founder who lands on the page on mobile understands within 3 seconds: *what it is, who it's for, what to do next.*
