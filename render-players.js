/* Griffins Rugby — render the roster from data/players.json.
   Builds the same .player-card markup the page used to have hardcoded, so the
   existing CSS and EN/EL language toggle keep working unchanged. Players are
   sorted alphabetically by English name; the static "You / Εσύ" join card in the
   grid is always kept last. Edited via the CMS later; for now it's just data. */
(function () {
  var grid = document.getElementById('roster-grid');
  if (!grid) return;
  var joinCard = grid.querySelector('.player-card--join');

  // <h3 class="player-name">: two spans when the Greek name differs, else plain text.
  function buildName(en, el) {
    var h3 = document.createElement('h3');
    h3.className = 'player-name';
    if (el && el !== en) {
      var sEn = document.createElement('span');
      sEn.setAttribute('data-lang-en', '');
      sEn.textContent = en;
      var sEl = document.createElement('span');
      sEl.setAttribute('data-lang-el', '');
      sEl.textContent = el;
      h3.appendChild(sEn);
      h3.appendChild(sEl);
    } else {
      h3.textContent = en;
    }
    return h3;
  }

  function buildCard(p) {
    var card = document.createElement('article');
    card.className = 'player-card';
    if (p.gender) card.setAttribute('data-gender', p.gender);

    var photo = document.createElement('div');
    if (p.photo) {
      photo.className = 'player-photo';
      photo.style.backgroundImage = "url('" + p.photo + "')";
      photo.style.backgroundSize = 'cover';
      photo.style.backgroundPosition = 'center top';
    } else {
      photo.className = 'player-photo player-photo--logo';
    }

    var info = document.createElement('div');
    info.className = 'player-info';
    info.appendChild(buildName(p.nameEn, p.nameEl));

    var pos = document.createElement('p');
    pos.className = 'player-position';
    pos.textContent = p.position || '';
    info.appendChild(pos);

    card.appendChild(photo);
    card.appendChild(info);
    return card;
  }

  fetch('data/players.json', { cache: 'no-cache' })
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (players) {
      players.sort(function (a, b) {
        return (a.nameEn || '').localeCompare(b.nameEn || '', 'en', { sensitivity: 'base' });
      });
      var frag = document.createDocumentFragment();
      players.forEach(function (p) { frag.appendChild(buildCard(p)); });
      grid.insertBefore(frag, joinCard);
    })
    .catch(function (err) {
      console.error('Could not load roster:', err);
    });
})();
