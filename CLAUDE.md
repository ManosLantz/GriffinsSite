# Griffins Rugby Heraklion — Project Context

Static **bilingual (English / Greek)** website for **Griffins Rugby**, a rugby club in
Heraklion, Crete. Plain **HTML + CSS + a tiny vanilla JS** — no frameworks, no build step.

## Hosting & deployment
- GitHub repo: **ManosLantz/GriffinsSite**, branch **main**.
- GitHub Pages → custom domain **https://griffinsrugby.gr** (HTTPS enforced). `CNAME` file in repo.
- Deploy = commit + push to `main`; Pages auto-rebuilds (~1 min).
- If `git push` is rejected, run `git pull --rebase origin main` then push (GitHub sometimes commits the CNAME).
- Local working dir: `c:\GriifinsSite` (folder name is misspelled "Griifins" — harmless).
- **Never delete** `CNAME` or `googledf4229166551c411.html` (Google Search Console verification).

## Pages & files
- `index.html` (home: hero, training schedule + "Get directions" map link, featured news teaser, 4-photo gallery preview, CTA)
- `roster.html` (players), `supporters.html` (both data-driven)
- `rugby.html` (merged: short history of rugby + basic rules of Union vs League. Replaced the old `history.html` + `rules.html`, which are now tiny redirect stubs pointing here.)
- `news.html` (club news/announcements; home shows the latest item + a "See all news" link here)
- `gallery.html` (all photos; home shows the first 4 + a "See all photos" link here)
- `contact.html` (info + social buttons + embedded Google join form)
- `404.html` (uses **relative** asset paths so it works at the domain root)
- `style.css` (one stylesheet), `lang.js` (EN/EL toggle), `enhance.js` (optional UX: gallery lightbox + back-to-top, isolated/non-critical)
- `data/*.json` content/config: `players`, `news`, `gallery`, `supporters`, `fixtures`, `settings`
- `render-*.js` (build from the JSON at load): `players`, `news`, `gallery`, `supporters`, `fixtures`, `settings`
- `admin/` (Sveltia CMS at /admin: Players, News, Gallery, Supporters, Fixtures, Settings), `.github/` (image-optimizer Action)
- `sitemap.xml`, `robots.txt`

## Content data (rendered client-side, edited via the CMS)
- Roster, news, gallery, and supporters are **no longer hardcoded** in HTML. They live in `data/*.json`
  as objects with one top-level key (so the CMS can edit them as lists) and are rendered at page load
  by the `render-*.js` scripts, which rebuild the exact same card markup (same classes + EN/EL spans),
  so CSS and the language toggle are unaffected. Renderers accept either the keyed object or a bare array.
  - `players.json` (`{players:[...]}`): each `{nameEn,nameEl,position,gender,photo,descriptionEn,descriptionEl}`.
    Renderer sorts by English name and keeps the static "You/Εσύ" join card last. Empty `nameEl` (or equal
    to `nameEn`) => plain text, no spans (Latin-only names). Empty `photo` => crest placeholder.
    `descriptionEn/El` are optional free text (nickname, quote, etc.) shown under the position.
  - `news.json` (`{items:[...]}`): **newest first**; item 0 is the big feature on `news.html` AND the home teaser.
    Each `{categoryEn/El,titleEn/El,bodyEn/El,image,linkHref,linkEn/El}` (link optional).
  - `gallery.json` (`{photos:[...]}`): each `{image,alt,width,height}`. The home `#gallery-grid` has
    `data-limit="4"` (shows first 4 + "See all photos"); `gallery.html` shows all.
  - `supporters.json` (`{supporters:[...]}`): each `{name,roleEn/El,textEn/El}` (heart icon is fixed in JS).
  - `fixtures.json` (`{fixtures:[...]}`): each `{opponent,dateText,homeAway,competition,played,scoreUs,scoreThem}`.
    Rendered into the home "Fixtures & Results" section; empty list shows a "coming soon" note.
  - `settings.json`: single object of site-wide facts (venue, area En/El, days short/long En/El, time,
    mapsUrl, social URLs, email, phone). `render-settings.js` fills **language-aware placeholders**
    (`.js-venue` neutral, `.js-area`/`.js-daysShort`/`.js-daysLong` by EN/EL context, `.js-time` neutral)
    in the footer (every page), home training card, and contact page, plus social hrefs (matched by URL)
    and `.js-maps`. HTML keeps current values as static fallback. So training venue/time changes in ONE place.
- Editing: the **Sveltia CMS** at `/admin` (GitHub login via a Cloudflare auth Worker) gives the captain
  forms for Players / News / Gallery / Supporters with photo upload. Config: `admin/config.yml` (bilingual
  labels + per-field hints). See memory `cms-plan`. To edit by hand instead, change the JSON directly.
- **Local preview needs a server** (`python -m http.server`), not double-clicking the file:
  `fetch()` of the JSON is blocked under `file://`. On GitHub Pages (https) it works normally.
- Uploaded JPEGs are auto-downscaled/recompressed by the `.github` image-optimizer Action on push.

## CONVENTIONS — follow these exactly
- **Bilingual text:** every visible string is two spans:
  `<span data-lang-en>English</span><span data-lang-el>Ελληνικά</span>`.
  CSS shows the active one based on `<html data-lang="en|el">`. An inline `<script>` in each
  `<head>` sets the language before render (no flash); `lang.js` wires the **EN / ΕΛ** toggle in
  the nav and saves the choice in `localStorage`. If a string is identical in both languages,
  plain text (no spans) is fine. Keep EN and EL span counts balanced per file.
- **No dashes:** never use em dashes (—) or en dashes (–) in visible copy (owner finds them
  "AI-looking"). Use commas/colons. Time ranges use a plain hyphen: `17:00-19:00`.
- **Player positions stay in English** in both languages (Lock, Winger, Scrum Half, etc.) — do NOT translate.
- **Footer credit lines** (`© 2026 …` and `Built for the love of the game.`) stay **English** in both languages.
- Nav order: Home · Roster · Rugby · News · Gallery · Supporters · Contact (+ EN/ΕΛ toggle). Footer "Explore" mirrors it.
  Greek nav labels: Αρχική · Ομάδα · Το Ράγκμπι · Νέα · Φωτογραφίες · Υποστηρικτές · Επικοινωνία.
- All canonical / Open Graph / sitemap URLs use `https://griffinsrugby.gr/`.
- Theme "Black & Crimson": CSS vars in `:root` (`--bg #0D0D0D`, `--primary #C8102E`, `--accent #D4AF37` gold).
  Fonts: Montserrat (headings) + Roboto (body).

## Images
- Source folders `Roster/`, `Supporters/`, `photos/` are **gitignored** (kept local only).
- Web images live in `images/` and `images/players/`.
- Add/crop a player photo with Python+Pillow to 4:5 (~640×800, quality ~82):
  `ImageOps.exif_transpose(im)` then `ImageOps.fit(im,(640,800),Image.LANCZOS,centering=(0.5,0.35))`,
  save to `images/players/<name>.jpg`.
- Players with no photo use the crest placeholder: `<div class="player-photo player-photo--logo"></div>`.

## Roster
- Card: `<article class="player-card" data-gender="M|F">` → photo (or `player-photo--logo`) + bilingual name + English position.
- `data-gender` is stored but **NOT** used for grouping (owner may use it later).
- Last card is the **"You / Εσύ"** join card: `<a class="player-card player-card--join" href="contact.html">`.
- To add a player: add an object to `data/players.json` (the renderer auto-sorts by English name and
  keeps the You card last, so order in the file doesn't matter). Owner still keeps source material as
  `Roster/<Name>/info.txt` (Greek Name, English Name, Position, Gender) + optional photo locally.
- **Players still needing real photos:** Aggeliki Plevritaki, Anna Baxouthianaki, Dimitris Misirlis,
  Giorgos Papadakis, Ioulia P., Kostas Xristakis, Lais Margiori, Maria Daskalaki, Marinos Tountas,
  Melanie Tiemes, Oguz Baskaya, Tatiana, Vaggelis Merkouris.
  (Have photos: Alex Buzz, Giannis Geronimakis, Gonzalo Otero Seminario, Manos Lantzourakis, Vaggelis Tsakalides.)
- Open question: confirm English spelling "Kostas Xristakis" vs "Kostas Christakis".

## Contact / join
- Google Form is embedded on `contact.html` (iframe) + "open in new tab" fallback.
  Form: `https://docs.google.com/forms/d/e/1FAIpQLScpyUcZMkD7INLIcd80IRTE0Co-L3POAtTiTUV5bxaY_0U0DQ/viewform`
- Email was intentionally **removed** (club has no address yet). They have email hosting via Papaki, so
  `info@griffinsrugby.gr` could be created and added back later.

## Training info (reused across the site)
- **Lido Soccer, Heraklion. Monday & Thursday, 17:00-19:00.**

## Social
- Instagram: https://www.instagram.com/griffins_heraklion_rugby/
- Facebook: https://www.facebook.com/heraklion.rugby/

## SEO status
- Every page has `<title>` + `<meta name="description">`. Homepage also has SportsClub **JSON-LD**,
  `<link rel="canonical">`, and a `keywords` meta (note: Google ignores `keywords`).
- `sitemap.xml` + `robots.txt` are live.
- Owner to-dos (outside code): submit sitemap in Search Console, Request Indexing, create a free
  **Google Business Profile**, and link the site from IG/FB bios.

## Possible next steps
- Add more real news items to `news.html` (currently 3: field change, recruitment, site launch).
- Swap crest placeholders for real photos as they arrive.
- Add the embedded Google Map of Lido Soccer on `contact.html` (currently text + a directions link on the home training card; map URL: https://maps.app.goo.gl/PoLZoSypu89XtTer9).
