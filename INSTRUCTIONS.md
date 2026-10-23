# Griffins Rugby website: handover notes

Hi Dimitris, welcome on board. This note explains how the site is put together, how to change things, and what breaks if you're not careful. Written by Manos (the original builder).

You have free rein on design and code. The rules below are either about not breaking things, or the house style so far, which you're welcome to evolve.

> **Everything in this repo is public.** GitHub Pages also serves every file in it, so this note is readable at griffinsrugby.gr/INSTRUCTIONS.md. Never put passwords, tokens or private info in any file here.

---

## 1. The short version

- **Live site:** https://griffinsrugby.gr (English / Greek, toggle top right)
- **Code:** https://github.com/ManosLantz/GriffinsSite, branch `main`
- **Hosting:** GitHub Pages. Every push to `main` goes live in about 1-2 minutes. There is no build step and no server.
- **Content editor:** https://griffinsrugby.gr/admin (log in with your GitHub account)
- **Stack:** plain HTML, one CSS file, a bit of vanilla JavaScript. No frameworks. Content such as players, news and photos lives in `data/*.json` and is drawn onto the pages by the `render-*.js` scripts.

There are two ways to change things:

| You want to... | Use | Skill needed |
|---|---|---|
| Add a player, post news, upload photos, add a sponsor, change training time | **The Content Manager at /admin** | None |
| Change layout, design, page text, add a new page | **Edit the code** (section 4) | HTML/CSS, git |

Most day-to-day work is the first one.

---

## 2. Getting access (one time)

1. Make a free GitHub account if you don't have one, and send Manos your username.
2. Manos invites you as a collaborator. You get an email from GitHub. **Accept it within 7 days** (or open https://github.com/ManosLantz/GriffinsSite/invitations).
3. Go to https://griffinsrugby.gr/admin, click **Sign in with GitHub**, and authorize the app the first time.

That's it. As a collaborator you can edit content and push code. Repo settings (GitHub Pages, adding more people, deleting the repo) stay with Manos as the owner.

---

## 3. Editing content at /admin

The Content Manager is a form-based editor (Sveltia CMS). Every field has a hint in Greek telling you what to write. When you hit **Save**, it commits straight to `main` and the site updates in 1-2 minutes. Hard-refresh (Ctrl+F5) if you don't see it.

| Section | What it controls |
|---|---|
| 👥 Players | The roster page. Sorted automatically by English name. |
| 📰 News | News page + the home page teaser. **The top item is the featured one.** Drag to reorder. |
| 📷 Gallery | All photos. The first 4 also show on the home page. |
| 🤝 Sponsors & Supporters | Supporters page + the credits strip in every page's footer. Sponsors show first. |
| 🛍️ Merch | Merch page. Catalog only, no online shop. Empty = "coming soon" note. |
| 🏉 Fixtures | "Fixtures & Results" on the home page. Next/most recent match on top. |
| ⚙️ Settings | Training venue, days, time, map link, socials, email, phones, Google Analytics ID. **Changing it here updates the whole site at once.** |

### Content rules (please keep these)

- **Fill in both languages.** English and Greek fields sit next to each other.
- **No long dashes (— or –) anywhere.** Use a comma or colon instead. Time ranges use a normal hyphen: `17:00-19:00`.
- **Player positions stay in English** in both languages (Lock, Winger, Scrum Half...).
- **Photos:** players = vertical face photo; news = horizontal (landscape). Big phone photos are fine: a GitHub Action shrinks JPEGs automatically after upload (you'll see an "Auto-optimize images" commit appear).
- **Sponsor logos must be white logos on a transparent background (PNG).** The site is dark, so a JPEG logo shows up as a white box.
- **A supporter with no link does not appear in the footer strip** (only on the Supporters page). Add a link and they show up.
- Leave the **Google Analytics ID** alone unless you know why you're changing it. Emptying it switches analytics and the cookie banner off.

---

## 4. Editing the code

Only needed for design or structural changes.

### Setup

You need **git** and **Python 3**.

```
git clone https://github.com/ManosLantz/GriffinsSite.git
cd GriffinsSite
python _serve.py
```

Then open http://localhost:8000.

Use `_serve.py`, **not** `python -m http.server`. The site uses clean URLs (`/roster`, not `/roster.html`), and only `_serve.py` handles them the way GitHub Pages does. Double-clicking `index.html` doesn't work either, because the browser blocks loading the JSON files from disk.

### Every time you work

```
git pull                      # ALWAYS first: content edits from /admin land on main too
# ...make your changes, check them on localhost...
git add -A
git commit -m "Short description of what you changed"
git push
```

If `git push` is rejected, someone (or the CMS, or the image bot) pushed in the meantime. Run `git pull --rebase origin main`, then `git push` again.

### Where things stand (worth a read first)

- **`CLAUDE.md`**: the full technical brief. Every file, every data format, every convention. (If you use Claude Code, it reads this file automatically.) If you change how something works, update it here too.
- **`DESIGN.md`**: the current visual system ("The Pitch"): colours, fonts, spacing. Crimson `#C8102E` on near-black, square corners. If you redesign, update this file so it stays true.
- **`PRODUCT.md`**: who the site is for. Main job: **recruit new players.**
- `README.md` is older and partly out of date. Trust the three files above.

### Code conventions (house style so far)

- **Every visible piece of text exists twice:**
  `<span data-lang-en>English</span><span data-lang-el>Ελληνικά</span>`
  If you add or remove one, add or remove its partner. A missing pair is the most common way the language toggle breaks.
- **Nav and footer** live in `partials.js` (one place for all pages). The exception is `404.html`, which has its own copy, so update both when the menu changes.
- **Cache busting:** after changing `style.css` or `partials.js`, bump the `?v=` number on **every page that links it** (search the repo for `style.css?v=` / `partials.js?v=`), otherwise visitors keep the old version.
- Same no-dash rule as above, in all visible text.

---

## 5. Do not touch

| File / thing | Why |
|---|---|
| `CNAME` | Connects griffinsrugby.gr to GitHub Pages. Delete it and the domain breaks. |
| `googledf4229166551c411.html` | Google Search Console verification. |
| `admin/config.yml`, the `backend:` part at the top | The CMS login. Fields and labels below it are safe to edit if you know YAML. |
| `.github/` | The image-optimizer bot. |
| `.nojekyll` | Tells GitHub Pages to serve files as-is. |

---

## 6. Accounts and who holds them

| Service | What it's for | Held by |
|---|---|---|
| GitHub repo | Code + hosting (Pages) | Manos (owner), you (collaborator) |
| Cloudflare Worker `sveltia-cms-auth` | Makes "Sign in with GitHub" work on /admin | Manos |
| Domain griffinsrugby.gr + DNS | The web address. Registered at **Papaki**, which also hosts the domain's email. Renews yearly; first renewal due around **June 2027**. | Manos |
| Google Analytics (`G-289T990WLP`) | Visitor stats | Manos, ask for access |
| Google Search Console | Google search presence | Manos, ask for access |
| Google Form (join form on Contact page) | New player sign-ups | Vaggelis (coach) |
| Instagram / Facebook | Socials linked from the site | Vaggelis (coach) |
| Heraklion.Rugby@outlook.com.gr | Contact email shown on the site | Vaggelis (coach) |

---

## 7. When something goes wrong

| Problem | Fix |
|---|---|
| /admin says you have no access, or login fails | Check you accepted the GitHub invite. Then log out and back in at /admin. |
| I saved but the site didn't change | Wait 2 minutes, then Ctrl+F5. Check the commit appeared on GitHub. |
| A page looks broken / unstyled on localhost | You're using `python -m http.server`. Use `python _serve.py`. |
| Language toggle shows both languages or none | A `data-lang-en` / `data-lang-el` pair got broken in the HTML you edited. |
| Push rejected | `git pull --rebase origin main`, then `git push`. |
| Site shows a Papaki or "domain expired" page | The domain wasn't renewed. Tell Manos straight away. |
| Something broke after a change | Every change is a git commit, so nothing is lost. On GitHub, find the last good commit, or ask Manos to revert. |

---

## 8. Open to-dos

- **Privacy policy page.** Analytics is live and the cookie banner refers to a policy that doesn't exist yet. This is the most important gap.
- **Player photos** still missing for several players (they show the club crest instead). Add them via /admin > Players.
- **Merch:** no items yet. Add them via /admin > Merch.
- **Google Map** embed of Lido Soccer on the Contact page.
- Ask supporters for **white-on-transparent PNG logos**, so the footer can show logos instead of names.

Questions: ask Manos.
