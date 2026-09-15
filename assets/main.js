(function () {
  'use strict';

  var EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================
     ローディング：ロゴを線で描く → 消す → カーテンが開く
     初回のみ（sessionStorage で判定）
     ============================================================ */
  var loading = document.getElementById('loading');
  var header = document.getElementById('header');

  function revealSite(delay) {
    // サイドバーを滑り込ませる
    setTimeout(function () {
      if (header) {
        header.style.transition = 'transform .8s ' + EASE;
        header.classList.add('is-in');
      }
    }, delay);
  }

  function hideLoading() {
    if (!loading) return;
    loading.style.transition = 'opacity 1s ' + EASE;
    loading.style.opacity = '0';
    setTimeout(function () { loading.classList.add('is-hidden'); }, 1000);
  }

  function runLoading() {
    var paths = loading ? loading.querySelectorAll('.lp') : [];
    var seen = false;
    try { seen = sessionStorage.getItem('bananaVisited') === '1'; } catch (e) { seen = false; }

    // 2回目以降 / モーション低減設定 → 即表示
    if (seen || reduceMotion || !paths.length) {
      hideLoading();
      revealSite(0);
      if (!header) return;
      return;
    }

    try { sessionStorage.setItem('bananaVisited', '1'); } catch (e) {}

    // 各パスに dasharray/offset を仕込む
    var lens = [];
    paths.forEach(function (p) {
      var len = 0;
      try { len = p.getTotalLength(); } catch (e) { len = 400; }
      lens.push(len);
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
    });

    // 1) 描く
    paths.forEach(function (p, i) {
      setTimeout(function () {
        p.style.transition = 'stroke-dashoffset .55s ' + EASE;
        p.style.strokeDashoffset = '0';
      }, 100 + i * 55);
    });

    // 2) 消す
    var eraseStart = 100 + paths.length * 55 + 300;
    paths.forEach(function (p, i) {
      setTimeout(function () {
        p.style.transition = 'stroke-dashoffset .5s ' + EASE;
        p.style.strokeDashoffset = -lens[i];
      }, eraseStart + i * 45);
    });

    // 3) ローディングを畳んで、サイトを開く
    var done = eraseStart + paths.length * 45 + 320;
    setTimeout(hideLoading, done);
    revealSite(done + 200);
  }

  /* 起動。
     window.load は地図iframeなどに引きずられて数秒遅れることがあるため待たない。
     DOMが使える時点で .preload を外し、次のフレームで演出を始める。
     （.preload は transition を止めているので、外す前に始めると演出が飛ぶ） */
  var started = false;
  function boot() {
    if (started) return;
    started = true;
    document.body.classList.remove('preload');
    requestAnimationFrame(function () {
      requestAnimationFrame(runLoading);
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  setTimeout(boot, 800); // 保険

  /* ============================================================
     ヘッダーロゴのホバー：線を消して描き直す
     ============================================================ */
  var logo = document.querySelector('.js-logo');
  if (logo && window.matchMedia('(any-hover: hover)').matches && !reduceMotion) {
    var lpaths = logo.querySelectorAll('.lp');
    var busy = false;
    logo.addEventListener('mouseenter', function () {
      if (busy) return;
      busy = true;
      lpaths.forEach(function (p, i) {
        var len;
        try { len = p.getTotalLength(); } catch (e) { len = 400; }
        p.style.strokeDasharray = len;
        setTimeout(function () {
          p.style.transition = 'stroke-dashoffset .5s ' + EASE;
          p.style.strokeDashoffset = -len;
        }, i * 60);
        setTimeout(function () {
          p.style.strokeDashoffset = '0';
        }, 420 + i * 60);
      });
      setTimeout(function () { busy = false; }, 1200);
    });
  }

  /* ============================================================
     モバイルメニュー
     ============================================================ */
  var toggle = document.getElementById('navToggle');
  var menuMobile = document.getElementById('menuMobile');

  function closeMenu() {
    if (!menuMobile) return;
    menuMobile.classList.remove('is-open');
    if (header) header.classList.remove('is-open');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'メニューを開く');
      var t = toggle.querySelector('.header-button_text');
      if (t) t.textContent = 'MENU';
    }
  }

  if (toggle && menuMobile) {
    toggle.addEventListener('click', function () {
      var open = menuMobile.classList.toggle('is-open');
      if (header) header.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
      var t = toggle.querySelector('.header-button_text');
      if (t) t.textContent = open ? 'CLOSE' : 'MENU';
    });
    menuMobile.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ============================================================
     現在地のハイライト（サイドバー / 下部バー共通）
     ============================================================ */
  var navLinks = document.querySelectorAll('.menu-item[href^="#"], .navigation-item[href^="#"]');
  if (navLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    navLinks.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      if (!map[id]) map[id] = [];
      map[id].push(a);
    });
    var ids = Object.keys(map);
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.remove('is-current'); });
        (map[entry.target.id] || []).forEach(function (a) { a.classList.add('is-current'); });
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }

  /* ============================================================
     NEWS のタグ絞り込み
     ============================================================ */
  var pills = document.querySelectorAll('.filter-pill');
  var cards = document.querySelectorAll('#newsList .card');
  var emptyMsg = document.getElementById('newsEmpty');

  function applyFilter(tag) {
    var shown = 0;
    cards.forEach(function (c) {
      var tags = (c.getAttribute('data-tags') || '').split(/\s+/);
      var hit = tag === 'all' || tags.indexOf(tag) !== -1;
      c.classList.toggle('is-hidden', !hit);
      if (hit) shown++;
    });
    pills.forEach(function (p) {
      p.classList.toggle('is-active', p.getAttribute('data-filter') === tag);
    });
    if (emptyMsg) emptyMsg.hidden = shown !== 0;
  }

  pills.forEach(function (p) {
    p.addEventListener('click', function () {
      applyFilter(p.getAttribute('data-filter'));
    });
  });

  // トップのタグをクリック → NEWS へ飛んで絞り込む
  document.querySelectorAll('#heroTags a[data-tag]').forEach(function (a) {
    a.addEventListener('click', function () {
      applyFilter(a.getAttribute('data-tag'));
    });
  });

  /* ============================================================
     写真が置かれたら差し替える（無ければプレースホルダのまま）
     ============================================================ */
  document.querySelectorAll('[data-img]').forEach(function (el) {
    var src = el.getAttribute('data-img');
    if (!src) return;
    var probe = new Image();
    probe.onload = function () {
      el.style.backgroundImage = 'url("' + src + '")';
      el.classList.add('has-img');
    };
    probe.src = src;
  });
})();
