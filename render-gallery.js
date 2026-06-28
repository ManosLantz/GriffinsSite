/* Griffins Rugby — render the home gallery from data/gallery.json.
   Builds the same .gallery-item figures, with width/height to avoid layout
   shift and lazy loading. Edited via the CMS later; for now it's just data. */
(function () {
  var grid = document.getElementById('gallery-grid');
  if (!grid) return;

  fetch('data/gallery.json')
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (data) {
      var photos = Array.isArray(data) ? data : (data.photos || []);
      // A container can set data-limit (e.g. the home page shows only the first few).
      var limit = parseInt(grid.getAttribute('data-limit'), 10);
      if (!isNaN(limit)) photos = photos.slice(0, limit);
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
