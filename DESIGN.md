# Design

> Visual system for **Griffins Rugby Heraklion**. Direction: **"The Pitch"** — a floodlit
> ground at night, raw and aggressive, built from rugby-pitch markings (chalk lines, touchlines,
> jersey numbers 1-15). Aesthetic family: high-contrast technical athletic, anti-corporate.
> Source of truth lives in `:root` of `style.css`; this file documents it. Strategy in
> [PRODUCT.md](PRODUCT.md).

## Theme

- **Mode:** dark, always. The page is a floodlit pitch at night, not a light surface dimmed.
- **Scene:** a newcomer opens the site on a phone, often outdoors, and should feel they're
  looking onto a ground under floodlights: near-black ground, chalk lines, crimson touchline.
- **Color strategy:** *Committed.* Near-black carries the surface; crimson is the single
  saturated identity color used with intent; chalk white draws all structure. No gold (dropped
  on purpose), no second accent hue.
- **Texture/depth:** flat true-black panels with hairline cold borders and chalk rules. Depth
  comes from contrast and a single large shadow, not gradients-on-everything or glass.

## Color

OKLCH-friendly but authored as hex tokens in `:root`. Do not introduce colors outside this set.

| Token | Hex | Role |
|---|---|---|
| `--bg` | `#080A09` | Page ground (floodlit pitch at night) |
| `--bg-elev` | `#10130F` | Cards / elevated panels |
| `--bg-elev-2` | `#181C16` | Hover / nested panels |
| `--primary` | `#C8102E` | **Crimson — sacred team mark.** Touchlines, CTAs, active states, accents |
| `--primary-dark` | `#8E0B20` | Crimson pressed / hover |
| `--accent` | `#F2F4EF` | **Chalk white** — pitch lines, outline buttons, focus ring (replaced gold) |
| `--grass` | `#1C2A1E` | Faint pitch-marking green (sparingly) |
| `--text` | `#F4F5F1` | Primary text |
| `--muted` | `#99A197` | Secondary text (cold grey) |
| `--border` | `#23291F` | Hairline borders (cold) |

**Brand source:** the crest is oxblood/maroon wing + crimson + near-black shield + chalk
lettering. `#C8102E` is the canonical team crimson and is **non-negotiable**.

**Usage rules**
- Crimson is an accent, not a field. It marks the touchline (hero/page-header bottom border),
  primary buttons, the active nav underline, category tags, and `.text-accent`. Resist
  spraying it across whole surfaces.
- Chalk (`--accent`) is for *lines and structure*: the `.title-rule`, outline-button borders,
  the focus ring. It is the "drawn on the grass" color.
- Gold is intentionally absent. Do not reintroduce it.

**Contrast (WCAG AA, must verify, never assume)**
- `--text` on `--bg`/`--bg-elev`: passes comfortably (chalk-on-black).
- **Watch-outs:** `--muted` (`#99A197`) on elevated panels — keep for secondary text only,
  never body copy at small sizes; crimson text on dark — fine for large/bold, verify for
  anything < 18px. Never use crimson as body text on `--bg-elev`.
- Win/loss and other state must carry **text or shape, not color alone**.

## Typography

Three families on a deliberate contrast axis (brutal display vs condensed utility vs humanist
body). Loaded via one identical Google Fonts `<link>` in every page `<head>`.

| Token | Family | Use |
|---|---|---|
| `--ff-display` | **Anton** (400) | The biggest hits only: hero h1, `.section-title`, big jersey numbers, scoreboard digits. Brutal condensed display, used with restraint. |
| `--ff-head` | **Saira Condensed** (700/800) | Utility/scoreboard: h1-h4, nav, buttons, eyebrows, labels, pills, player names. |
| `--ff-body` | **IBM Plex Sans** | Body copy, paragraphs, descriptions. Humanist, highly readable bilingually. |

**Rules**
- Display (Anton) is uppercase, near-zero tracking, line-height ~1.04. Reserve it; if every
  heading is Anton it stops hitting. Section titles: `clamp(2.1rem, 5.4vw, 3.6rem)`.
- Headings/utility (Saira) are uppercase with tight-to-normal tracking; buttons/nav use
  `letter-spacing: 0.02em–0.1em`.
- Body line length capped ~65-75ch (`.article` 74ch, `.section-head` 60ch).
- `text-wrap: balance` on display/section headings; `pretty` on long prose.
- **Bilingual:** every visible string is twin `data-lang-en` / `data-lang-el` spans (or plain
  text if identical). Greek runs longer — headings and buttons must not overflow in EL at any
  breakpoint. Player positions stay in English in both languages. Footer credit lines stay
  English. (Full rules in CLAUDE.md.)
- **No dashes in visible copy.** No em/en dashes (owner finds them "AI-looking"); use commas or
  colons. Time ranges use a plain hyphen: `17:00-19:00`.

## Layout & Spacing

- **Container:** `--maxw: 1180px`, fluid inline padding `clamp(1.1rem, 4vw, 2rem)`.
- **Section rhythm:** `clamp(3.25rem, 7vw, 6rem)` block padding (`--section--tight` for less).
  Vary spacing for rhythm; don't pad everything uniformly.
- **Radius:** `--radius: 2px`. Near-square. Athletic/technical, not soft. Buttons are
  `border-radius: 0`. Never round things "to be friendly."
- **Grids:** responsive without breakpoints via `repeat(auto-fit, minmax(280px, 1fr))` for
  roster/news/supporters. Flexbox for 1D rows. Two-column splits (`.pitch-layout`,
  `.contact-grid`) collapse to one column under ~880px.
- **Z-index scale:** header `50`, lightbox `90`+, back-to-top below modals. Keep semantic; no
  `9999`.
- **Signature structural motifs (reuse, don't reinvent):**
  - **Touchline:** a 4px crimson `border-bottom` on the hero and a crimson bar via
    `.page-header::before` echoing it on every interior page header.
  - **Chalk pitch lines:** faint `--accent` vertical lines in the hero (`.pitch-line--halfway`,
    `--22`) that draw on load.
  - **Title rule:** `.title-rule` — a chalk hairline led by a crimson segment under section
    headings. This is the house "underline," not a generic divider.
  - **Eyebrow:** `.eyebrow` exists (crimson, tracked, with a leading crimson dash) — it is part
    of the established system, but **do not stamp it above every section by reflex**; use it
    where a kicker genuinely helps.

## Components

Established vocabulary in `style.css` — extend these, match their idiom, don't invent parallel ones.

- **Buttons** (`.btn` + `.btn-primary` / `.btn-outline` / `.btn-ghost`, `.btn-lg`): square,
  uppercase Saira, tracked. Primary = crimson fill; outline = chalk border that inverts on
  hover; ghost = translucent white. Hover lifts `-2px`; primary adds a crimson glow ring.
- **Nav** (`.site-header`, `.nav-menu`): sticky, blurred near-black bar, hairline bottom border.
  Links get a crimson underline that scales in on hover; active link underline is chalk.
  `.nav-cta` is a solid crimson pill. Mobile = pure-CSS checkbox toggle.
- **Hero** (`.hero` + `.hero-pitch`): darkened action-shot background reading as floodlit
  ground, chalk pitch lines, 4px crimson touchline, Anton headline, draw-on/rise-in load.
- **Training card** (`.training-card`, `.training-pill`, `.map-link`): the recruitment
  centerpiece — venue/days/time as pills + a "Get directions" map link. Highest-priority block.
- **News cards** (`.news-card`, `.news-feature` spans full width), **gallery** (`.gallery-item`
  hover-zoom, lightbox via `enhance.js`), **CTA band** (`.cta-band`), **player cards**
  (`.player-card` with `.player-number` jersey badge, crimson top-border on info, crest
  placeholder `--player-photo--logo`, and the terminal **"You / Εσύ" join card**
  `.player-card--join`).
- **Supporters** (`.supporter-card` + heart icon), **rugby page** (`.rules-grid`,
  `.scoring-table`, interactive `.pitch-svg` / `.pos-marker` / `.pos-panel` driven by
  `pitch.js`), **contact** (`.info-list`, `.social-btn`, embedded form `.form-embed`).
- **Footer** (`.site-footer`): four-column grid, crest, mirrored "Explore" nav, social,
  English-only credit lines.

**Cards caveat:** cards are used where they're the right affordance (roster, news, supporters).
Don't reach for a card grid as the default layout, and never nest cards.

## Motion

- **Tokens:** `--ease: cubic-bezier(.2,.7,.3,1)` (ease-out, no bounce/elastic), `--shadow:
  0 18px 40px rgba(0,0,0,.55)`.
- **Established:** hero chalk lines draw in (`@keyframes drawY`, scaleY 0→1) staggered; hero
  content rises in (`riseIn`). Nav underline scales from left. Buttons lift on hover. Gallery
  items zoom on hover. Read-more arrow nudges.
- **Rules:** ease-out only; animate transform/opacity (and the existing scaleY draw), not
  layout. Motion is part of the build, not sprinkled on. Reveals must enhance already-visible
  content (never gate visibility on a JS class).
- **Reduced motion is mandatory.** Every animation needs a `@media (prefers-reduced-motion:
  reduce)` fallback (crossfade or instant). The hero draw/rise are already guarded; keep that
  discipline for anything new.

## Accessibility

Target **WCAG 2.1 AA** (see PRODUCT.md).
- Body ≥ 4.5:1, large/bold ≥ 3:1, placeholders 4.5:1. Verify crimson-on-dark and muted-on-elev.
- Focus ring: 3px `--accent` chalk outline, 2px offset — keep it visible, never remove.
- Keyboard-operable nav, lang toggle, lightbox; no color-only meaning (fixtures carry text).
- Reduced-motion alternatives for all motion.

## Constraints (project)

- Plain **HTML + CSS + vanilla JS**, no framework, **no build step**. One stylesheet
  (`style.css`), tokens in `:root`.
- **Cache-bust:** bump `style.css?v=` site-wide on every CSS change or GitHub Pages/browsers
  serve stale CSS.
- Content is data-driven (`data/*.json` → `render-*.js`) and CMS-edited; visual changes must not
  break the JSON-to-card markup contract (same classes + EN/EL spans).
- Header/footer are single-sourced in `partials.js` (404 stays inline). Edit chrome there.
