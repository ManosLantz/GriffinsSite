/* Griffins Rugby - progressive enhancements: image lightbox + back-to-top.
   Fully optional and self-contained: it runs in its own try/catch blocks, so if
   anything here fails, the rest of the site (content rendering, language toggle)
   keeps working normally. */
(function () {
  'use strict';

  /* ---------------- Back to top ---------------- */
  function initBackToTop() {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" ' +
      'stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.body.appendChild(btn);

    var shown = false;
    function onScroll() {
      var should = window.pageYOffset > 600;
      if (should !== shown) {
        shown = should;
        btn.classList.toggle('is-visible', shown);
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------------- Lightbox ---------------- */
  function initLightbox() {
    if (!document.querySelector('.gallery-grid')) return;

    var box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-hidden', 'true');
    box.innerHTML =
      '<button class="lightbox-btn lightbox-close" type="button" aria-label="Close">×</button>' +
      '<button class="lightbox-btn lightbox-prev" type="button" aria-label="Previous">‹</button>' +
      '<button class="lightbox-btn lightbox-next" type="button" aria-label="Next">›</button>' +
      '<figure class="lightbox-figure"><img alt=""><figcaption class="lightbox-caption"></figcaption></figure>';
    document.body.appendChild(box);

    var imgEl = box.querySelector('img');
    var capEl = box.querySelector('.lightbox-caption');
    var figEl = box.querySelector('.lightbox-figure');
    var items = [];
    var index = 0;
    var lastFocus = null;

    function show(i) {
      if (!items.length) return;
      index = (i + items.length) % items.length;
      imgEl.src = items[index].src;
      imgEl.alt = items[index].alt || '';
      capEl.textContent = items[index].alt || '';
    }
    function open(fromImg) {
      items = Array.prototype.slice.call(document.querySelectorAll('.gallery-grid img'));
      index = items.indexOf(fromImg);
      if (index < 0) index = 0;
      lastFocus = document.activeElement;
      show(index);
      box.classList.add('is-open');
      box.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      box.querySelector('.lightbox-close').focus();
    }
    function close() {
      box.classList.remove('is-open');
      box.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      imgEl.src = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    document.addEventListener('click', function (e) {
      var img = e.target && e.target.closest ? e.target.closest('.gallery-grid img') : null;
      if (img) { e.preventDefault(); open(img); }
    });
    box.querySelector('.lightbox-close').addEventListener('click', close);
    box.querySelector('.lightbox-prev').addEventListener('click', function () { show(index - 1); });
    box.querySelector('.lightbox-next').addEventListener('click', function () { show(index + 1); });
    box.addEventListener('click', function (e) {
      if (!figEl.contains(e.target) && !(e.target.closest && e.target.closest('.lightbox-btn'))) close();
    });
    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(index - 1);
      else if (e.key === 'ArrowRight') show(index + 1);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    try { initBackToTop(); } catch (e) { /* non-critical */ }
    try { initLightbox(); } catch (e) { /* non-critical */ }
  });
})();
