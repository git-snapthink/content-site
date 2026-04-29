# PRODUCT — Jason C. Lewis (jasonclewis.com)

## Register

**brand** — long-form personal site for a newsletter ("Operator's Log"). Design IS the product. The site sells the perspective and the credibility behind it. No app surface, no dashboard, no logged-in state. Subscribe is the only conversion.

## What it is

A weekly AI newsletter ("Operator's Log") authored by Jason C. Lewis, delivered via Substack. The site is the landing page that earns the subscribe. Companion `/insights` index hosts longer pieces.

Hosted in the same Astro project as nextbuild.com; this brand is selected when `PUBLIC_BRAND=jason-c-lewis` and the root path rewrites to `/jcl` (see [src/middleware.ts](src/middleware.ts)).

## Audience

Four named reader segments (verbatim from the page's FAQ):

1. **The AI Startup Founder** — seed to Series C, building an AI-native company.
2. **The Corporate AI Leader** — VP / SVP / C-suite at a 500–50,000+ employee company, accountable for AI strategy.
3. **The Rising Tech Leader** — senior IC to director in tech, positioning for an AI-fluent next move.
4. **The AI-Aware Professional** — manager-to-VP who knows AI matters but is overwhelmed by the noise.

Common thread: people **making real decisions** about AI. Not learners, not tutorial-seekers, not dopamine readers. They have budget, headcount, or career capital on the line.

## Author / voice

Jason is the product. Surface his credentials prominently — they are the differentiation, not a footnote.

- **AWS** — Head of Premium Support, Startups, North America (current). Sees what ships in production across the most consequential AI startups.
- **Gartner** — former Director, Global Data & Analytics Practice. Advised 14,000+ organizations.
- **Founder / Operator** — multiple ventures from founding to exit, full-stack developer who still ships.

The "operator's seat" framing is load-bearing — it's what separates Jason from analysts and journalists. Don't soften it. Don't replace it with a generic "thought leader" framing.

## Tone

- Direct, plain-spoken, confident without bravado.
- Operator vocabulary: ships, breaks at scale, reversible vs. adaptable, debt vs. progress, signal-to-noise.
- One-line punches that close paragraphs ("If you can't answer that, you're not building. You're borrowing.").
- Earned skepticism toward hype, not contrarian-for-sport.
- Never breathless. Never marketing-pitch. The text reads like Jason talking.

## Strategic principles

1. **Credibility before promise.** The hero, the headshot, the credentials all front-load proof. The newsletter promise is calm, not loud.
2. **One CTA: subscribe.** Hero, mid-page, and final CTA all push the same email-capture form. Substack is the destination — direct browser POST to `https://jasonclewis.substack.com/api/v1/free`, fallback to opening the Substack subscribe page.
3. **Show, don't claim.** "Read before you subscribe" section embeds two real recent pieces ("Progress Above, Debt Below" and "Project Glasswing"). New iterations should swap in fresh samples, not generic testimonials.
4. **Reject the AI-newsletter cliché.** Most AI newsletters are watch-and-summarize. The site explicitly contrasts against that ("This is not for you if you want '5 ChatGPT hacks to 10x your productivity'"). Keep the contrast list sharp.
5. **No pressure, no spam, no obligation.** The micro-copy under every form repeats this. It's a tonal commitment, not legal cover.

## Anti-references (do not become these)

- Generic AI-newsletter landing pages with neon-on-black "the future is here" hero copy.
- Influencer-style pages with "100,000+ subscribers" social-proof bars and rotating-tweet testimonials.
- Productivity-bro pages: countdown timers, urgency banners, "limited spots", emoji-laden bullets.
- Dashboard-shaped layouts (metric cards, chart placeholders) on what is really a content site.
- Substack default theme. The site exists *because* the Substack default doesn't carry the credibility.
- Generic "AI advisor" consultant pages that sell calls. This sells a free newsletter — a higher-trust, lower-friction commitment.

## Visual identity (current state, summarized — see [DESIGN.md](DESIGN.md) for tokens)

- **Display fonts**: Orbitron (headings) and Audiowide (eyebrows, labels, brand mark). Body: Chakra Petch.
- **Accent**: `#c1d42f` — a sharp lime/chartreuse. Reads as "instrument panel" not "soft tech". Used as full background on CTA buttons and as borders/spines, never as gradient text.
- **Hero treatment**: dark surface (`#111113`), large headshot card with animated tactical-bracket frame ("light rails" tracing the corners). Cyan diffuse glow blobs in opposite corners. Distinctive — should not be flattened.
- **Sections**: alternate `bg-primary` (warm off-white `#fafaf8`) and `bg-card` (white). Final CTA returns to dark. Rhythm = light → light alt → dark.
- **Pills and labels**: Audiowide uppercase tracked pills are the recurring eyebrow. Don't replace them with generic chips.

## Constraints

- **Stack**: static Astro 6, single `.astro` page at [src/pages/jcl.astro](src/pages/jcl.astro), inline `<style is:inline>`. Edits land in that one file.
- **Subscribe path**: direct browser POST to Substack's `api/v1/free`. CORS fallback opens the Substack subscribe URL in a new tab. Don't replace this with a backend route — Substack is the source of truth for the list.
- **Performance budget**: it's content, prerendered, on Vercel. Avoid heavy JS. The animated bracket frame is pure CSS keyframes and respects `prefers-reduced-motion`.
- **Insights archive**: `/insights` and `/insights/[slug]` are shared across both brands. Anything global affects both.
- **Analytics**: GA via `PUBLIC_GA_MEASUREMENT_ID`. No other third-party trackers should be added.

## Out of scope

- E-commerce, paid tiers, course sales, lead magnets, gated content. The product is the free newsletter.
- A members area or login. Substack handles delivery and management.
- Multi-language. English only.
