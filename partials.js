/* Griffins Rugby - single source for the shared header (nav) and footer.
   Every page carries only <div id="site-header-mount"></div> and
   <div id="site-footer-mount"></div> plus <body data-page="X.html">. This script
   replaces those mounts with the real markup, so the nav/footer are edited in ONE
   place instead of in every HTML file. Runs as a deferred script (DOM is parsed),
   before the language toggle and settings scripts wire themselves up.

   A <noscript> nav lives in the mount as a fallback for the rare no-JS visitor. */
(function () {
  var header =
    '<header class="site-header">' +
      '<nav class="nav container" aria-label="Primary">' +
        '<a class="brand" href="/">' +
          '<img class="brand-logo" src="images/logo.png" alt="Griffins Rugby Heraklion crest" width="42" height="50">' +
          '<span class="brand-text">Griffins<strong>Rugby</strong></span>' +
        '</a>' +
        '<input type="checkbox" id="nav-toggle" class="nav-toggle">' +
        '<label for="nav-toggle" class="nav-toggle-label" aria-label="Toggle navigation menu">' +
          '<span></span><span></span><span></span>' +
        '</label>' +
        '<ul class="nav-menu">' +
          '<li><a href="/"><span data-lang-en>Home</span><span data-lang-el>Αρχική</span></a></li>' +
          '<li><a href="/roster"><span data-lang-en>Roster</span><span data-lang-el>Ομάδα</span></a></li>' +
          '<li><a href="/rugby"><span data-lang-en>Rugby</span><span data-lang-el>Το Ράγκμπι</span></a></li>' +
          '<li><a href="/news"><span data-lang-en>News</span><span data-lang-el>Νέα</span></a></li>' +
          '<li><a href="/gallery"><span data-lang-en>Gallery</span><span data-lang-el>Φωτογραφίες</span></a></li>' +
          '<li><a href="/supporters"><span data-lang-en>Supporters</span><span data-lang-el>Υποστηρικτές</span></a></li>' +
          '<li><a href="/merch"><span data-lang-en>Merch</span><span data-lang-el>Merchandise</span></a></li>' +
          '<li><a href="/contact" class="nav-cta"><span data-lang-en>Contact</span><span data-lang-el>Επικοινωνία</span></a></li>' +
        '</ul>' +
        '<button class="lang-toggle" type="button" data-lang-toggle aria-label="Switch language / Αλλαγή γλώσσας">' +
          '<span class="lang-opt" data-lang-opt="en">EN</span><span class="lang-sep">/</span><span class="lang-opt" data-lang-opt="el">ΕΛ</span>' +
        '</button>' +
      '</nav>' +
    '</header>';

  var IG =
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>';
  var FB =
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>';

  function navList() {
    return '<ul>' +
      '<li><a href="/"><span data-lang-en>Home</span><span data-lang-el>Αρχική</span></a></li>' +
      '<li><a href="/roster"><span data-lang-en>Roster</span><span data-lang-el>Ομάδα</span></a></li>' +
      '<li><a href="/rugby"><span data-lang-en>Rugby</span><span data-lang-el>Το Ράγκμπι</span></a></li>' +
      '<li><a href="/news"><span data-lang-en>News</span><span data-lang-el>Νέα</span></a></li>' +
      '<li><a href="/gallery"><span data-lang-en>Gallery</span><span data-lang-el>Φωτογραφίες</span></a></li>' +
      '<li><a href="/supporters"><span data-lang-en>Supporters</span><span data-lang-el>Υποστηρικτές</span></a></li>' +
      '<li><a href="/merch"><span data-lang-en>Merch</span><span data-lang-el>Merchandise</span></a></li>' +
      '<li><a href="/contact"><span data-lang-en>Contact</span><span data-lang-el>Επικοινωνία</span></a></li>' +
    '</ul>';
  }

  var footer =
    '<footer class="site-footer">' +
      '<div class="container footer-grid">' +
        '<div class="footer-brand">' +
          '<img class="footer-logo" src="images/logo.png" alt="Griffins Rugby Heraklion crest" width="62" height="74">' +
          '<p><span data-lang-en>Heraklion\'s home of rugby. Open to all fitness levels</span><span data-lang-el>Το σπίτι του ράγκμπι στο Ηράκλειο. Ανοιχτό σε όλα τα επίπεδα φυσικής κατάστασης.</span></p>' +
        '</div>' +
        '<div class="footer-col">' +
          '<h4><span data-lang-en>Explore</span><span data-lang-el>Πλοήγηση</span></h4>' +
          navList() +
        '</div>' +
        '<div class="footer-col">' +
          '<h4><span data-lang-en>Training</span><span data-lang-el>Προπόνηση</span></h4>' +
          '<p><span data-lang-en><span class="js-venue">Lido Soccer</span>, <span class="js-area">Heraklion</span><br><span class="js-daysShort">Mon &amp; Thu</span><br><span class="js-time">17:00-19:00</span></span><span data-lang-el><span class="js-venue">Lido Soccer</span>, <span class="js-area">Ηράκλειο</span><br><span class="js-daysShort">Δευτ &amp; Πέμ</span><br><span class="js-time">17:00-19:00</span></span></p>' +
        '</div>' +
        '<div class="footer-col">' +
          '<h4><span data-lang-en>Follow us</span><span data-lang-el>Ακολουθήστε μας</span></h4>' +
          '<div class="footer-social">' +
            '<a href="https://www.instagram.com/griffins_heraklion_rugby/" target="_blank" rel="noopener noreferrer" aria-label="Griffins Rugby on Instagram">' + IG + '</a>' +
            '<a href="https://www.facebook.com/heraklion.rugby/" target="_blank" rel="noopener noreferrer" aria-label="Griffins Rugby on Facebook">' + FB + '</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="footer-bottom container">' +
        '<p>&copy; 2026 Griffins Rugby Heraklion. All rights reserved.</p>' +
        '<p>Grassroots rugby in Heraklion.</p>' +
        '<button type="button" class="cookie-settings-link js-cookie-settings" data-cookie-settings style="display:none"><span data-lang-en>Cookie settings</span><span data-lang-el>Ρυθμίσεις cookies</span></button>' +
      '</div>' +
    '</footer>';

  var hm = document.getElementById('site-header-mount');
  if (hm) hm.outerHTML = header;
  var fm = document.getElementById('site-footer-mount');
  if (fm) fm.outerHTML = footer;

  // Highlight the current page's nav link from <body data-page="X.html">.
  var page = (document.body.getAttribute('data-page') || '').toLowerCase();
  if (page) {
    var link = document.querySelector('.site-header .nav-menu a[href="' + page + '"]');
    if (link) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  }
})();
