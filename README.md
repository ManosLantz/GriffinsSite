# Griffins Rugby Heraklion — Website

Static website for **Griffins Rugby**, a rugby club based in Heraklion, Crete.
Plain HTML + CSS (no frameworks), hosted on GitHub Pages.

🔗 **Live site:** https://griffinsrugby.gr/

## Pages
| File | Purpose |
|------|---------|
| `index.html` | Home, training schedule, latest news teaser, photo gallery |
| `roster.html` | Team roster (grid of player cards) |
| `rugby.html` | History of rugby + Union vs League rules (one page) |
| `news.html` | Club news and announcements |
| `contact.html` | Contact details, social links, embedded join form |
| `404.html` | Friendly "page not found" page |
| `style.css` | Single stylesheet for the whole site |

## Editing tips
- **Add a player:** copy a `.player-card` block in `roster.html` and set a photo via the inline style shown in the comment there.
- **Add news:** copy a `.news-card` block in `news.html` and change the `.news-thumb` background image.
- **Images:** web-optimized images live in `images/`. The original full-size photos are kept in `photos/` (ignored by git).

## Local preview
Just open `index.html` in a browser, or run a tiny local server from this folder:
```
python -m http.server 8000
```
then visit http://localhost:8000

## Deployment
Pushed to the `main` branch and served by GitHub Pages (Settings → Pages → Deploy from branch → `main` / root).
