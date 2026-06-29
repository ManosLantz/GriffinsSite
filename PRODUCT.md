# Product

## Register

brand

## Users

**Primary: prospective players in Heraklion, Crete.** A mix of locals and the city's
international/expat community, many of whom have never played rugby. They arrive curious
("is there a rugby club here? can I just show up?") on a phone, often in Greek or English,
and need three things fast: that the club is real and active, when/where training is, and a
frictionless way to say "I'm in." Some are experienced players (returning expats, students)
who want to know the level and vibe.

**Secondary:**
- **Current players & supporters** who treat the site as the club's public face and source of
  pride: roster, photos, fixtures, results.
- **Sponsors, venues, and the federation** who size the club up for credibility before
  partnering. The site has to look like a real, established outfit, not a hobby page.
- **The captain** (non-technical) who edits players/news/photos/fixtures through the Sveltia
  CMS at `/admin`.

Everyone is served bilingually (English / Greek), toggled in-page; the language choice is
first-class, not an afterthought.

## Product Purpose

Get more people to training. Griffins Rugby is a real club in Heraklion that needs bodies on
the pitch, so the site's job is recruitment first: turn a curious visitor into someone who
shows up Monday or Thursday at Lido Soccer, 17:00-19:00. Everything else (club identity,
sponsor-grade legitimacy, news, photos) exists to make that conversion believable and to keep
the people who already belong feeling like the badge means something.

Success looks like: a newcomer lands, immediately gets that this is a genuine, intense,
welcoming club, finds training details without scrolling for them, and hits the join form, all
in whichever language they read. Secondary success: a sponsor or partner takes the club
seriously on first impression.

## Brand Personality

Raw, aggressive, athletic. Three words: **intense, grounded, proud.**

The voice is a contact sport, not a corporate team. Confident and direct, never salesy or
cute. It speaks like a club that trains hard and means it: short lines, present tense, an open
door ("show up", "you're in") rather than marketing fluff. Bilingual copy stays human and plain
in both languages. The crest, an eagle clutching a ball over a near-black shield, is the
emotional anchor: it should feel like walking onto a floodlit ground at night.

Emotional goals, in order: **belonging** (you could be on this team), **respect** (these people
are serious), **adrenaline** (this is a hard, physical game and that's the appeal).

## Anti-references

- **Corporate SaaS / startup look (the explicit no).** No soft gradients, rounded friendly
  cards, pastel palettes, floaty illustrations, or generic "modern template" polish. If it
  could be a B2B dashboard landing page, it's wrong.
- **Cute / amateur local-club page.** No clip-art, mascot kitsch, or over-friendly tone that
  undercuts the athletic edge.
- **Premium/luxury minimalism.** Not quiet, airy, or gold-on-cream refined; this is a contact
  sport, restraint that reads as "boutique" is off-brand.
- **Cluttered sports-portal / fan-forum.** No dense, ad-heavy, everything-everywhere chaos.

## Design Principles

1. **Recruitment is the spine.** Every page earns its place by moving a curious visitor toward
   training or the join form. Schedule, location, and the "You / Εσύ" join card are never more
   than a glance away. When a design choice and conversion conflict, conversion wins.
2. **Earn the aggression.** The raw/athletic energy comes from structure and contrast (chalk
   lines, crimson touchlines, brutal display type, true blacks), not from gimmicks. Skew
   tricks, hatch textures, and decorative slants were already cut as slop and stay cut.
3. **Crimson is sacred, black is home, chalk is the line.** `#C8102E` is the team mark, used
   with intent, not sprayed everywhere. Black is the ground. Chalk white draws the structure.
   Gold was deliberately dropped.
4. **Bilingual by construction, never bolted on.** EN and EL are equal citizens. Layouts must
   survive both languages (Greek runs longer); no string is second-class.
5. **Real club, no build step.** Plain HTML/CSS/vanilla JS, content driven by `data/*.json` and
   edited by a non-technical captain. Craft has to hold up without a framework, and changes
   must stay safe for someone editing JSON, not code.

## Accessibility & Inclusion

Target **WCAG 2.1 AA.**
- Body text ≥ 4.5:1 against its background; large/bold text ≥ 3:1. The dark theme makes this
  easy for chalk-white text on near-black; the watch-outs are crimson text on dark and muted
  grey on elevated panels, which must be verified, not assumed.
- Full keyboard operability with a visible focus ring (already a 3px chalk outline).
- Every animation needs a `prefers-reduced-motion: reduce` alternative (the hero draw-on and
  rise-in are already motion-safe); keep that discipline for anything new.
- Bilingual support is itself an inclusion feature: both languages get equal, fully readable
  treatment, and the toggle is keyboard-reachable.
- No information conveyed by color alone (e.g. fixture win/loss must also carry text).
