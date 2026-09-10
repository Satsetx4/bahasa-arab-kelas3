// Lapisan trend: tema malam/siang, animasi masuk, tilt kartu, count-up.
// Tidak mengubah logika belajar — hanya rasa.
(function () {
  var root = document.documentElement;
  var KEY = 'arab3-theme';

  function apply(t) {
    root.setAttribute('data-theme', t);
    root.classList.toggle('dark', t === 'dark');
    try { localStorage.setItem(KEY, t); } catch (e) {}
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', t === 'dark' ? '#07120d' : '#ecfdf5');
  }

  function initTheme() {
    var t = 'dark';
    try { t = localStorage.getItem(KEY) || 'dark'; } catch (e) {}
    if (t !== 'dark' && t !== 'light') t = 'dark';
    apply(t);
    document.addEventListener('click', function (e) {
      var b = e.target && e.target.closest ? e.target.closest('#theme-toggle-btn') : null;
      if (!b) return;
      apply(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  }

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var io = null;

  function observeRv(scope) {
    var box = scope || document;
    if (reduceMotion) {
      box.querySelectorAll('.rv:not(.in)').forEach(function (el) { el.classList.add('in'); });
      return;
    }
    if (!('IntersectionObserver' in window)) {
      // Tanpa observer: tampilkan langsung, jangan biarkan pudar selamanya.
      box.querySelectorAll('.rv:not(.in)').forEach(function (el) { el.classList.add('in'); });
      return;
    }
    if (!io) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            io.unobserve(en.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    }
    box.querySelectorAll('.rv:not(.in)').forEach(function (el) { io.observe(el); });
  }

  function attachTilt(container) {
    if (reduceMotion) return;
    if (!window.matchMedia || !window.matchMedia('(pointer: fine)').matches) return;
    if (container.__tiltBound) return;
    container.__tiltBound = true;
    container.addEventListener('pointermove', function (e) {
      var c = e.target && e.target.closest ? e.target.closest('.trend-card') : null;
      if (!c) return;
      var r = c.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      c.style.transform = 'translateY(-6px) rotateX(' + (-y * 5).toFixed(2) + 'deg) rotateY(' + (x * 6).toFixed(2) + 'deg)';
    });
    container.addEventListener('pointerout', function (e) {
      var c = e.target && e.target.closest ? e.target.closest('.trend-card') : null;
      if (c) c.style.transform = '';
    });
  }

  function enhanceCards(container) {
    if (!container) return;
    // Kartu konten TIDAK pakai animasi pudar (.rv) — soal & kosakata wajib
    // langsung tampil penuh. Hanya efek angkat saat hover (CSS .trend-card).
    var kids = container.querySelectorAll(':scope > div:not(.trend-card)');
    kids.forEach(function (k) {
      k.classList.add('trend-card');
      k.classList.remove('rv');
      k.classList.add('in');
      k.style.removeProperty('--rd');
    });
    attachTilt(container);
  }

  function countUp(el) {
    var end = parseFloat(el.getAttribute('data-count') || '0');
    if (!end || reduceMotion || !window.requestAnimationFrame) {
      el.textContent = end;
      return;
    }
    var t0 = performance.now();
    var D = 1100;
    function frame(t) {
      var p = Math.min(1, (t - t0) / D);
      var e2 = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * e2);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function initStats() {
    var els = document.querySelectorAll('[data-count]');
    if (!('IntersectionObserver' in window)) {
      els.forEach(countUp);
      return;
    }
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          countUp(en.target);
          so.unobserve(en.target);
        }
      });
    }, { threshold: 0.4 });
    els.forEach(function (el) { so.observe(el); });
  }

  function refreshIcons() {
    if (window.lucide && window.lucide.createIcons) {
      try { window.lucide.createIcons(); } catch (e) {}
    }
  }

  var deb = null;
  function scheduleIcons() {
    clearTimeout(deb);
    deb = setTimeout(refreshIcons, 120);
  }

  // Safety net: kartu di tab aktif TIDAK BOLEH nyangkut pudar. Dipanggil tiap tab dibuka.
  function revealActiveTab() {
    document.querySelectorAll('.tab-section:not(.hidden) .rv:not(.in)').forEach(function (el, i) {
      el.style.setProperty('--rd', (Math.min(i % 9, 8) * 40) + 'ms');
      requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('in'); }); });
    });
  }

  function watch() {
    var cardBoxes = ['vocab-list-container', 'quiz-questions-list', 'exam-questions-container'];
    var mo = new MutationObserver(function (muts) {
      var touchedCards = false;
      var touched = false;
      muts.forEach(function (m) {
        cardBoxes.forEach(function (id) {
          var n = document.getElementById(id);
          if (n && (m.target === n || n.contains(m.target))) touchedCards = true;
        });
        touched = true;
      });
      if (!touched) return;
      cardBoxes.forEach(function (id) {
        var n = document.getElementById(id);
        if (n && n.querySelector(':scope > div:not(.trend-card)')) enhanceCards(n);
      });
      if (touchedCards) observeRv(document);
      scheduleIcons();
    });
    mo.observe(document.body, { childList: true, subtree: true });
    cardBoxes.forEach(function (id) {
      var n = document.getElementById(id);
      if (n) enhanceCards(n);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    document.querySelectorAll('main > section').forEach(function (s) { s.classList.add('rv'); });
    document.querySelectorAll('.hero-mesh').forEach(function (el) { el.classList.add('rv'); });
    observeRv(document);
    watch();
    initStats();
    refreshIcons();
    // Hook ke switchTab bawaan app: tiap tab dibuka, paksa kartu tampil.
    if (window.switchTab) {
      var origSwitch = window.switchTab;
      window.switchTab = function (id) {
        origSwitch(id);
        setTimeout(revealActiveTab, 60);
      };
    }
    document.querySelectorAll('[data-tab-target]').forEach(function (b) {
      b.addEventListener('click', function () { setTimeout(revealActiveTab, 120); });
    });
    setTimeout(revealActiveTab, 400);
  });

  window.Trend = { observe: observeRv, refresh: refreshIcons };
})();
