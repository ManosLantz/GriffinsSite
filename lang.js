/* Griffins Rugby — EN/EL language switcher.
   The active language is set instantly in <head> (inline script) to avoid a flash;
   this file wires up the toggle button and remembers the choice in localStorage. */
(function () {
  var KEY = 'griffins-lang';

  function current() {
    return document.documentElement.getAttribute('data-lang') || 'en';
  }

  function setActive(lang) {
    var opts = document.querySelectorAll('[data-lang-opt]');
    for (var i = 0; i < opts.length; i++) {
      opts[i].classList.toggle('is-active', opts[i].getAttribute('data-lang-opt') === lang);
    }
  }

  function setLang(lang) {
    document.documentElement.setAttribute('data-lang', lang);
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    setActive(lang);
  }

  document.addEventListener('DOMContentLoaded', function () {
    setActive(current());
    var btns = document.querySelectorAll('[data-lang-toggle]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function () {
        setLang(current() === 'en' ? 'el' : 'en');
      });
    }
  });
})();
