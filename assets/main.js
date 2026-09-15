(function () {
  'use strict';

  var EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================
     ローディング：ロゴを線で描く → 消す → カーテンが開く
     初回のみ（sessionStorage で判定）
     ============================================================ */
  var loading = document.getElementById('loading');
  var bodyBg = document.querySelector('.body-bg');
  var header = document.getElementById('header');

  /* カーテンを開く。
     ・3枚は「重ねて」置く（横並びだと、動いた瞬間に隙間からサイトが覗く）
     ・最前面（span3）から順に右へ抜く。
       左へ抜くとパネルの後端が左へ去るので【右側から】露出してしまう。
       右へ抜けば左端から順に現れ、視線の流れとサイドバーの出現方向に揃う。
     ・1枚抜けても下に次の面があるため、最後の1枚が抜けきるまでサイトは見えない。 */
  function revealSite(delay, instant) {
    var panels = bodyBg ? [].slice.call(bodyBg.querySelectorAll('span')).reverse() : [];

    if (instant) {
      if (bodyBg) bodyBg.classList.add('is-done');
      if (header) header.classList.add('is-in');
      return;
    }

    panels.forEach(function (p, i) {
      p.style.transition = 'transform .8s ' + EASE;
      setTimeout(function () { p.style.transform = 'translateX(100%)'; }, delay + i * 110);
    });
    setTimeout(function () {
      if (bodyBg) bodyBg.classList.add('is-done');
    }, delay + panels.length * 110 + 900);

    // サイドバーは最後の1枚が抜けきる頃に合わせて出す
    setTimeout(function () {
      if (header) {
        header.style.transition = 'transform .8s ' + EASE;
        header.classList.add('is-in');
      }
    }, delay + panels.length * 110 + 200);
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
      revealSite(0, true);   // 2回目以降は演出なしで即表示
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
    // rAF はバックグラウンドタブでは発火しない。演出が始まらずローディングが
    // 居座るのを避けるため、タイマー側のフォールバックも張る。
    var fired = false;
    var go = function () { if (fired) return; fired = true; runLoading(); };
    requestAnimationFrame(function () { requestAnimationFrame(go); });
    setTimeout(go, 120);
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
