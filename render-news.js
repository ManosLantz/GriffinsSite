/* Griffins Rugby — render news from data/news.json.
   Used on two pages, by which container is present:
     #news-grid  (news.html) -> all items, first one rendered as the big feature
     #home-news  (index.html) -> only the first (latest) item, as the feature teaser
   Array order = newest first (item 0 is the feature). Rebuilds the same
   .news-card markup so existing CSS and the EN/EL toggle keep working. */
(function () {
  var newsGrid = document.getElementById('news-grid');
  var homeNews = document.getElementById('home-news');
  if (!newsGrid && !homeNews) return;

  // Fill an existing node with EN/EL spans, or plain text when they match.
  function fillBilingual(node, en, el) {
    if (el && el !== en) {
      var sEn = document.createElement('span');
      sEn.setAttribute('data-lang-en', '');
      sEn.textContent = en;
      var sEl = document.createElement('span');
      sEl.setAttribute('data-lang-el', '');
      sEl.textContent = el;
      node.appendChild(sEn);
      node.appendChild(sEl);
    } else {
      node.textContent = en || '';
    }
  }

  function makeBilingual(tag, en, el, className) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    fillBilingual(node, en, el);
    return node;
  }

  // Allow only safe link schemes (block javascript:, data:, etc.).
  function safeUrl(u) {
    if (!u) return null;
    try {
      var p = new URL(u, location.origin);
      return ['http:', 'https:', 'mailto:', 'tel:'].indexOf(p.protocol) !== -1 ? u : null;
    } catch (e) { return null; }
  }
  // Build a CSS url() value, rejecting characters that could break out of url('...').
  function cssUrl(path) {
    if (!path || /["'()\\]/.test(path) || /^\s*(javascript|data):/i.test(path)) return '';
    return "url('" + encodeURI(path) + "')";
  }

  function buildCard(item, featured) {
    var card = document.createElement('article');
    card.className = 'news-card' + (featured ? ' news-feature' : '');

    var thumb = document.createElement('div');
    thumb.className = 'news-thumb';
    var thumbUrl = cssUrl(item.image);
    if (thumbUrl) {
      thumb.style.backgroundImage = thumbUrl;
      thumb.style.backgroundSize = 'cover';
      thumb.style.backgroundPosition = 'center';
    }

    var body = document.createElement('div');
    body.className = 'news-body';

    var tagline = document.createElement('p');
    tagline.className = 'news-tagline';
    var cat = document.createElement('span');
    cat.className = 'news-cat';
    fillBilingual(cat, item.categoryEn, item.categoryEl);
    tagline.appendChild(cat);
    body.appendChild(tagline);

    body.appendChild(makeBilingual('h3', item.titleEn, item.titleEl));
    body.appendChild(makeBilingual('p', item.bodyEn, item.bodyEl));

    var linkHref = safeUrl(item.linkHref);
    if (linkHref) {
      var link = document.createElement('a');
      link.className = 'read-more';
      link.href = linkHref;
      fillBilingual(link, item.linkEn, item.linkEl);
      body.appendChild(link);
    }

    card.appendChild(thumb);
    card.appendChild(body);
    return card;
  }

  fetch('data/news.json')
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (data) {
      var items = Array.isArray(data) ? data : (data.items || []);
      if (homeNews && items.length) {
        homeNews.appendChild(buildCard(items[0], true));
      }
      if (newsGrid) {
        var frag = document.createDocumentFragment();
        items.forEach(function (item, i) { frag.appendChild(buildCard(item, i === 0)); });
        newsGrid.appendChild(frag);
      }
    })
    .catch(function (err) {
      console.error('Could not load news:', err);
    });
})();
