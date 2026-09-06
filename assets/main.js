(function () {
  'use strict';

  /* --- header: transparent over hero, solid after --- */
  var header = document.getElementById('siteHeader');
  var hero = document.querySelector('.hero');

  if (header && hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      header.classList.toggle('is-solid', !entries[0].isIntersecting);
    }, { rootMargin: '-70px 0px 0px 0px' }).observe(hero);
  } else if (header) {
    header.classList.add('is-solid');
  }

  /* --- mobile nav --- */
  var toggle = document.getElementById('navToggle');
  var nav = document.querySelector('.site-header__nav');

  function closeNav() {
    if (!nav) return;
    nav.classList.remove('is-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') closeNav();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* --- scroll reveal --- */
  var targets = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });
    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* --- swap in real images when the file exists ---
     Elements carry data-img="images/foo.jpg". If the file is missing
     (not committed yet) the placeholder stays visible. --- */
  document.querySelectorAll('[data-img]').forEach(function (el) {
    var src = el.getAttribute('data-img');
    if (!src) return;
    var probe = new Image();
    probe.onload = function () {
      el.style.backgroundImage = 'url("' + src + '")';
      el.classList.add('has-img');
      var ph = el.querySelector('.hero__placeholder');
      if (ph) ph.remove();
    };
    probe.src = src;
  });
})();
