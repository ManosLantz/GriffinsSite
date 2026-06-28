/* Griffins Rugby — render the home gallery from data/gallery.json.
   Builds the same .gallery-item figures, with width/height to avoid layout
   shift and lazy loading. Edited via the CMS later; for now it's just data. */
(function () {
  var grid = document.getElementById('gallery-grid');
  if (!grid) return;

  fetch('data/gallery.json', { cache: 'no-cache' })
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (data) {
      var photos = Array.isArray(data) ? data : (data.photos || []);
      var frag = document.createDocumentFragment();
      photos.forEach(function (ph) {
        var fig = document.createElement('figure');
        fig.className = 'gallery-item';
        var img = document.createElement('img');
        img.src = ph.image;
        img.alt = ph.alt || '';
        if (ph.width) img.width = ph.width;
        if (ph.height) img.height = ph.height;
        img.loading = 'lazy';
        fig.appendChild(img);
        frag.appendChild(fig);
      });
      grid.appendChild(frag);
    })
    .catch(function (err) {
      console.error('Could not load gallery:', err);
    });
})();
