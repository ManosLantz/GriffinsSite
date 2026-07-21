/* Griffins Rugby - render merch from data/merch.json.
   Rebuilds the same .merch-card markup (photo + title + price + description)
   so CSS and the EN/EL toggle keep working. Edited via the CMS. Items have no
   photo => crest placeholder, same idiom as player-photo--logo. Empty list =>
   a "coming soon" note instead of an empty grid. */
(function () {
  var grid = document.getElementById('merch-grid');
  var empty = document.getElementById('merch-empty');
  if (!grid) return;

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

  // Build a CSS url() value, rejecting characters that could break out of url('...').
  function cssUrl(path) {
    if (!path || /["'()\\]/.test(path) || /^\s*(javascript|data):/i.test(path)) return '';
    return "url('" + encodeURI(path) + "')";
  }

  function buildCard(item) {
    var card = document.createElement('article');
    card.className = 'merch-card';

    var photo = document.createElement('div');
    var thumbUrl = cssUrl(item.image);
    if (thumbUrl) {
      photo.className = 'merch-photo';
      photo.style.backgroundImage = thumbUrl;
    } else {
      photo.className = 'merch-photo merch-photo--logo';
    }
    if (item.price) {
      var price = document.createElement('span');
      price.className = 'merch-price';
      price.textContent = item.price;
      photo.appendChild(price);
    }
    card.appendChild(photo);

    var body = document.createElement('div');
    body.className = 'merch-body';
    body.appendChild(fillTag('h3', item.titleEn, item.titleEl));
    if (item.descriptionEn || item.descriptionEl) {
      body.appendChild(fillTag('p', item.descriptionEn, item.descriptionEl));
    }
    card.appendChild(body);

    return card;
  }

  function fillTag(tag, en, el) {
    var node = document.createElement(tag);
    fillBilingual(node, en, el);
    return node;
  }

  fetch('data/merch.json')
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (data) {
      var items = Array.isArray(data) ? data : (data.items || []);
      if (!items.length) {
        if (empty) empty.style.display = '';
        return;
      }
      var frag = document.createDocumentFragment();
      items.forEach(function (item) { frag.appendChild(buildCard(item)); });
      grid.appendChild(frag);
    })
    .catch(function (err) {
      console.error('Could not load merch:', err);
    });
})();
