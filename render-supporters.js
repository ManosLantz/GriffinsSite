/* Griffins Rugby - render sponsors and supporters from data/supporters.json.
   One file, two lists, one fetch. Sponsors render as wide .sponsor-row blocks
   (logo + tier + name + optional blurb + link); supporters keep the existing
   .supporter-card markup (photo or heart icon + name + bilingual role and
   thank-you text), so CSS and the EN/EL toggle keep working. Both edited via the
   CMS. If the sponsors list is empty the whole sponsor section is removed, so no
   bare heading is left behind. */
(function () {
  var sponsorList = document.getElementById('sponsor-list');
  var sponsorSection = document.getElementById('sponsors-section');
  var grid = document.getElementById('supporter-grid');
  if (!sponsorList && !grid) return;

  var HEART_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg>';

  // Allow only safe link schemes (block javascript:, data:, etc.).
  function safeUrl(u) {
    if (!u) return null;
    try {
      var p = new URL(u, location.origin);
      return ['http:', 'https:', 'mailto:', 'tel:'].indexOf(p.protocol) !== -1 ? u : null;
    } catch (e) { return null; }
  }
  // Same idea for an <img src>: local or remote http(s) only, never javascript:/data:.
  function safeImg(path) {
    if (!path) return null;
    try {
      var p = new URL(path, location.origin);
      return ['http:', 'https:'].indexOf(p.protocol) !== -1 ? path : null;
    } catch (e) { return null; }
  }
  // Build a CSS url() value, rejecting characters that could break out of url('...').
  function cssUrl(path) {
    if (!path || /["'()\\]/.test(path) || /^\s*(javascript|data):/i.test(path)) return '';
    return "url('" + encodeURI(path) + "')";
  }

  function fillBilingual(node, en, el) {
    if (en && el && el !== en) {
      var sEn = document.createElement('span');
      sEn.setAttribute('data-lang-en', '');
      sEn.textContent = en;
      var sEl = document.createElement('span');
      sEl.setAttribute('data-lang-el', '');
      sEl.textContent = el;
      node.appendChild(sEn);
      node.appendChild(sEl);
    } else {
      node.textContent = en || el || '';
    }
  }

  /* ---------- Sponsors: wide rows, logo left, detail right ---------- */
  function buildSponsorRow(s) {
    var row = document.createElement('article');
    row.className = 'sponsor-row';

    var src = safeImg(s.logo);
    if (src) {
      var figure = document.createElement('div');
      figure.className = 'sponsor-logo';
      var img = document.createElement('img');
      img.src = src;
      img.alt = (s.name || '') + ' logo';
      img.loading = 'lazy';
      img.decoding = 'async';
      figure.appendChild(img);
      row.appendChild(figure);
    }

    var body = document.createElement('div');
    body.className = 'sponsor-body';

    var tier = document.createElement('p');
    tier.className = 'sponsor-tier';
    fillBilingual(tier, s.tierEn || 'Sponsor', s.tierEl || 'Χορηγός');
    body.appendChild(tier);

    var name = document.createElement('h3');
    name.className = 'sponsor-name';
    name.textContent = s.name || '';
    body.appendChild(name);

    if (s.blurbEn || s.blurbEl) {
      var blurb = document.createElement('p');
      blurb.className = 'sponsor-blurb';
      fillBilingual(blurb, s.blurbEn, s.blurbEl);
      body.appendChild(blurb);
    }

    // Name goes inside the link text so each link is distinct in a screen
    // reader's link list, not a page full of identical "Visit website".
    var link = safeUrl(s.link);
    if (link) {
      var a = document.createElement('a');
      a.className = 'btn btn-outline sponsor-link';
      a.href = link;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      fillBilingual(a, 'Visit ' + (s.name || 'website'),
                       'Επισκέψου το ' + (s.name || 'site'));
      body.appendChild(a);
    }

    row.appendChild(body);
    return row;
  }

  /* ---------- Supporters: existing centered cards ---------- */
  function buildCard(s) {
    var card = document.createElement('article');
    card.className = 'supporter-card';

    var photoUrl = cssUrl(s.photo);
    if (photoUrl) {
      var photo = document.createElement('div');
      photo.className = 'supporter-photo';
      photo.style.backgroundImage = photoUrl;
      card.appendChild(photo);
    } else {
      var icon = document.createElement('div');
      icon.className = 'supporter-icon';
      icon.innerHTML = HEART_SVG;
      card.appendChild(icon);
    }

    var name = document.createElement('h3');
    var link = safeUrl(s.link);
    if (link) {
      var a = document.createElement('a');
      a.className = 'supporter-name';
      a.href = link;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = s.name || '';
      name.appendChild(a);
    } else {
      name.textContent = s.name || '';
    }
    card.appendChild(name);

    var role = document.createElement('p');
    role.className = 'supporter-role';
    fillBilingual(role, s.roleEn, s.roleEl);
    card.appendChild(role);

    var text = document.createElement('p');
    fillBilingual(text, s.textEn, s.textEl);
    card.appendChild(text);

    return card;
  }

  fetch('data/supporters.json')
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (data) {
      // Accept the keyed object, or a bare array for backwards compatibility.
      var sponsors = Array.isArray(data) ? [] : (data.sponsors || []);
      var supporters = Array.isArray(data) ? data : (data.supporters || []);

      if (sponsorList && sponsors.length) {
        var sFrag = document.createDocumentFragment();
        sponsors.forEach(function (s) { sFrag.appendChild(buildSponsorRow(s)); });
        sponsorList.appendChild(sFrag);
      } else if (sponsorSection) {
        // No sponsors yet: drop the whole section rather than leave a bare heading.
        sponsorSection.remove();
      }

      if (grid) {
        var frag = document.createDocumentFragment();
        supporters.forEach(function (s) { frag.appendChild(buildCard(s)); });
        grid.appendChild(frag);
      }
    })
    .catch(function (err) {
      console.error('Could not load sponsors and supporters:', err);
    });
})();
