/* Griffins Rugby - Google Analytics (GA4), gated behind cookie consent.
   Reads gaId from data/settings.json (set once via the CMS Settings screen).
   If gaId is empty, this script does nothing at all: no banner, no requests
   to Google, nothing stored. Once a real Measurement ID is set:
     - first visit with no stored choice -> show the consent banner
     - "Accept" -> load gtag.js and start tracking, remember the choice
     - "Decline" -> remember the choice, never load anything
   The footer "Cookie settings" link (added by partials.js, hidden by default)
   is revealed once analytics is configured, so a visitor can change their mind
   later. This keeps the club on the safe side of GDPR/Greek DPA rules: no
   analytics cookie is set before explicit consent. */
(function () {
  var STORAGE_KEY = 'griffins-consent';
  var gaId = '';
  var banner = null;

  function getConsent() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function setConsent(v) {
    try { localStorage.setItem(STORAGE_KEY, v); } catch (e) { /* private mode etc: just skip persisting */ }
  }

  function loadGtag(id) {
    if (window.__griffinsGtagLoaded) return;
    window.__griffinsGtagLoaded = true;
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', id, { anonymize_ip: true });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.appendChild(s);
  }

  function buildBanner() {
    banner = document.createElement('div');
    banner.className = 'cookie-consent';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Cookie consent');
    // Static markup only (no user/remote data interpolated), same idiom as partials.js.
    banner.innerHTML =
      '<div class="cookie-consent-inner">' +
        '<p class="cookie-consent-text">' +
          '<strong><span data-lang-en>We use cookies.</span><span data-lang-el>Χρησιμοποιούμε cookies.</span></strong> ' +
          '<span data-lang-en>We use Google Analytics to see how people use the site. Nothing is tracked without your OK.</span>' +
          '<span data-lang-el>Χρησιμοποιούμε το Google Analytics για να δούμε πώς χρησιμοποιείται η σελίδα. Καμία παρακολούθηση χωρίς τη συγκατάθεσή σου.</span>' +
        '</p>' +
        '<div class="cookie-consent-actions">' +
          '<button type="button" class="btn btn-outline" data-consent="decline"><span data-lang-en>Decline</span><span data-lang-el>Απόρριψη</span></button>' +
          '<button type="button" class="btn btn-primary" data-consent="accept"><span data-lang-en>Accept</span><span data-lang-el>Αποδοχή</span></button>' +
        '</div>' +
      '</div>';
    banner.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('[data-consent]') : null;
      if (!btn) return;
      var accepted = btn.getAttribute('data-consent') === 'accept';
      setConsent(accepted ? 'accepted' : 'declined');
      hideBanner();
      if (accepted) loadGtag(gaId);
    });
    document.body.appendChild(banner);
  }

  function showBanner() {
    if (!banner) buildBanner();
    banner.classList.add('is-visible');
  }
  function hideBanner() {
    if (banner) banner.classList.remove('is-visible');
  }

  fetch('data/settings.json')
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (s) {
      gaId = (s && s.gaId ? String(s.gaId) : '').trim();
      if (!gaId) return; // Analytics not set up yet: stay completely inert.

      var consent = getConsent();
      if (consent === 'accepted') {
        loadGtag(gaId);
      } else if (consent !== 'declined') {
        showBanner();
      }

      var settingsLinks = document.querySelectorAll('.js-cookie-settings');
      for (var i = 0; i < settingsLinks.length; i++) {
        settingsLinks[i].style.display = '';
        settingsLinks[i].addEventListener('click', showBanner);
      }
    })
    .catch(function (err) {
      console.error('Could not load analytics settings:', err);
    });
})();
