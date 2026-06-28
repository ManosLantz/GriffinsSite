/* Griffins Rugby - interactive pitch map on the Rugby page.
   Each numbered marker on the pitch maps (via data-pos) to a detail block; the
   content lives in static HTML (good for no-JS / SEO), this just toggles which
   one is shown and highlights the active marker. */
(function () {
  var map = document.getElementById('pitch-map');
  if (!map) return;
  var markers = map.querySelectorAll('.pos-marker');
  var details = document.querySelectorAll('.pos-detail');

  function select(key) {
    for (var i = 0; i < details.length; i++) {
      details[i].hidden = details[i].getAttribute('data-pos') !== key;
    }
    for (var j = 0; j < markers.length; j++) {
      var on = markers[j].getAttribute('data-pos') === key;
      markers[j].classList.toggle('is-active', on);
      markers[j].setAttribute('aria-pressed', on ? 'true' : 'false');
    }
  }

  for (var k = 0; k < markers.length; k++) {
    (function (m) {
      m.addEventListener('click', function () { select(m.getAttribute('data-pos')); });
      m.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          select(m.getAttribute('data-pos'));
        }
      });
    })(markers[k]);
  }

  // Start on the fly-half (10), the playmaker.
  select('10');
})();
