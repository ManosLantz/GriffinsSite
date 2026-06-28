/* Griffins Rugby - render fixtures & results from data/fixtures.json.
   Each match: { opponent, dateText, homeAway: home|away, competition, played,
   scoreUs, scoreThem }. Array order = how they show (newest/next at the top).
   Empty list shows a friendly "coming soon" note. Edited via the CMS. */
(function () {
  var grid = document.getElementById('fixtures-grid');
  if (!grid) return;

  var T = {
    upcoming: { en: 'Upcoming', el: 'Επόμενος' },
    win: { en: 'Win', el: 'Νίκη' },
    loss: { en: 'Loss', el: 'Ήττα' },
    draw: { en: 'Draw', el: 'Ισοπαλία' },
    empty: { en: 'First fixtures coming soon.', el: 'Οι πρώτοι αγώνες έρχονται σύντομα.' }
  };

  function bilingual(en, el) {
    var frag = document.createDocumentFragment();
    var a = document.createElement('span'); a.setAttribute('data-lang-en', ''); a.textContent = en;
    var b = document.createElement('span'); b.setAttribute('data-lang-el', ''); b.textContent = el;
    frag.appendChild(a); frag.appendChild(b);
    return frag;
  }
  function team(name, isGriffins) {
    var s = document.createElement('span');
    s.className = 'fixture-team' + (isGriffins ? ' is-griffins' : '');
    s.textContent = name;
    return s;
  }
  function num(v) {
    if (v === '' || v == null) return null;
    var n = Number(v);
    return isNaN(n) ? null : n;
  }

  function buildCard(fx) {
    var us = num(fx.scoreUs), them = num(fx.scoreThem);
    var played = !!fx.played && us != null && them != null;
    var home = (fx.homeAway || 'home') !== 'away';
    var opp = fx.opponent || 'TBD';
    var result = played ? (us > them ? 'win' : (us < them ? 'loss' : 'draw')) : '';

    var card = document.createElement('article');
    card.className = 'fixture-card ' + (played ? 'fixture-card--' + result : 'fixture-card--upcoming');

    var meta = document.createElement('div');
    meta.className = 'fixture-meta';
    if (fx.competition) {
      var comp = document.createElement('span'); comp.className = 'fixture-comp'; comp.textContent = fx.competition;
      meta.appendChild(comp);
    }
    if (fx.dateText) {
      var date = document.createElement('span'); date.className = 'fixture-date'; date.textContent = fx.dateText;
      meta.appendChild(date);
    }
    if (meta.childNodes.length) card.appendChild(meta);

    var teams = document.createElement('div');
    teams.className = 'fixture-teams';
    var leftName = home ? 'Griffins' : opp;
    var rightName = home ? opp : 'Griffins';
    teams.appendChild(team(leftName, leftName === 'Griffins'));
    var mid = document.createElement('span');
    if (played) {
      mid.className = 'fixture-score';
      mid.textContent = (home ? us : them) + ' - ' + (home ? them : us);
    } else {
      mid.className = 'fixture-vs';
      mid.textContent = 'vs';
    }
    teams.appendChild(mid);
    teams.appendChild(team(rightName, rightName === 'Griffins'));
    card.appendChild(teams);

    var tag = document.createElement('div');
    tag.className = 'fixture-tag';
    var key = played ? result : 'upcoming';
    tag.appendChild(bilingual(T[key].en, T[key].el));
    card.appendChild(tag);

    return card;
  }

  fetch('data/fixtures.json', { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(function (data) {
      var list = Array.isArray(data) ? data : (data.fixtures || []);
      if (!list.length) {
        var p = document.createElement('p');
        p.className = 'fixtures-empty';
        p.appendChild(bilingual(T.empty.en, T.empty.el));
        grid.appendChild(p);
        return;
      }
      var frag = document.createDocumentFragment();
      list.forEach(function (fx) { frag.appendChild(buildCard(fx)); });
      grid.appendChild(frag);
    })
    .catch(function (e) { console.error('Could not load fixtures:', e); });
})();
