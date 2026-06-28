/* Griffins Rugby - fill site-wide club settings (training venue/days/time, social
   links, optional contact) from data/settings.json, so they can be changed in ONE
   place via the CMS instead of in every page.

   Progressive enhancement: the HTML already contains the current values as static
   fallback text; this just overwrites them. Text placeholders carry a class:
     .js-venue (neutral)   .js-time (neutral)
     .js-area .js-daysShort .js-daysLong   (language-aware: EN or EL by context)
   Social links are matched by their current URL; map links use .js-maps. */
(function () {
  function langOf(el) {
    return (el.closest && el.closest('[data-lang-el]')) ? 'el' : 'en';
  }
  function setText(selector, enVal, elVal) {
    if (enVal == null && elVal == null) return;
    var nodes = document.querySelectorAll(selector);
    for (var i = 0; i < nodes.length; i++) {
      var v = (elVal !== undefined && langOf(nodes[i]) === 'el') ? elVal : enVal;
      if (v != null) nodes[i].textContent = v;
    }
  }
  function setHref(selector, url) {
    if (!url) return;
    var nodes = document.querySelectorAll(selector);
    for (var i = 0; i < nodes.length; i++) nodes[i].setAttribute('href', url);
  }
  function applyContact(kind, value, scheme) {
    var row = document.querySelector('.js-' + kind + '-row');
    if (!row) return;
    if (!value) { row.style.display = 'none'; return; }
    var link = row.querySelector('.js-' + kind);
    if (link) {
      link.textContent = value;
      link.setAttribute('href', scheme + value.replace(/\s+/g, ''));
    }
    row.style.display = '';
  }

  fetch('data/settings.json', { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(function (s) {
      setText('.js-venue', s.venue);
      setText('.js-time', s.time);
      setText('.js-area', s.areaEn, s.areaEl);
      setText('.js-daysShort', s.daysShortEn, s.daysShortEl);
      setText('.js-daysLong', s.daysLongEn, s.daysLongEl);

      setHref('.js-maps', s.mapsUrl);
      setHref('a[href*="instagram.com/griffins"]', s.instagramUrl);
      setHref('a[href*="facebook.com/heraklion"]', s.facebookUrl);

      applyContact('email', s.email, 'mailto:');
      applyContact('phone', s.phone, 'tel:');
    })
    .catch(function (e) { console.error('Could not load settings:', e); });
})();
