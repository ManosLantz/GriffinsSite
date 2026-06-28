/* Griffins Rugby - render supporters from data/supporters.json.
   Rebuilds the same .supporter-card markup (heart icon + name + bilingual role
   and thank-you text) so CSS and the EN/EL toggle keep working. Edited via the
   CMS. */
(function () {
  var grid = document.getElementById('supporter-grid');
  if (!grid) return;

  var HEART_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg>';

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

  function buildCard(s) {
    var card = document.createElement('article');
    card.className = 'supporter-card';

    var icon = document.createElement('div');
    icon.className = 'supporter-icon';
    icon.innerHTML = HEART_SVG;
    card.appendChild(icon);

    var name = document.createElement('h3');
    name.textContent = s.name || '';
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

  fetch('data/supporters.json', { cache: 'no-cache' })
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (data) {
      var supporters = Array.isArray(data) ? data : (data.supporters || []);
      var frag = document.createDocumentFragment();
      supporters.forEach(function (s) { frag.appendChild(buildCard(s)); });
      grid.appendChild(frag);
    })
    .catch(function (err) {
      console.error('Could not load supporters:', err);
    });
})();
