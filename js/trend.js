// Lapisan trend v3: TANPA animasi otomatis.
// Hanya: tema malam/siang (persist) + perlindungan anti-pudar + ikon.
// Semua konten langsung tampil penuh — aman untuk semua HP.
(function () {
  var root = document.documentElement;
  var KEY = 'arab3-theme';

  function apply(t) {
    root.setAttribute('data-theme', t);
    root.classList.toggle('dark', t === 'dark');
    try { localStorage.setItem(KEY, t); } catch (e) {}
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', t === 'dark' ? '#071009' : '#eef3ee');
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

  // Guard: elemen apa pun berkelas .rv TIDAK BOLEH pudar. Dipanggil berkala singkat.
  function revealAll() {
    document.querySelectorAll('.rv:not(.in)').forEach(function (el) {
      el.classList.add('in');
    });
  }

  function refreshIcons() {
    if (window.lucide && window.lucide.createIcons) {
      try { window.lucide.createIcons(); } catch (e) {}
    }
  }

  var deb = null;
  function scheduleIcons() {
    clearTimeout(deb);
    deb = setTimeout(refreshIcons, 150);
  }

  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    revealAll();

    // Ikon refresh saat konten dinamis berubah (kartu, soal, modal)
    var mo = new MutationObserver(function () { scheduleIcons(); });
    try {
      mo.observe(document.body, { childList: true, subtree: true });
    } catch (e) {}

    // Guard interval singkat di awal + pasang berhenti sendiri
    var n = 0;
    var iv = setInterval(function () {
      revealAll();
      if (++n >= 30) clearInterval(iv); // ~30 detik lalu berhenti (app stabil)
    }, 1000);

    // Setelah 30 detik: satu observer ringan khusus menandai .rv baru
    var mo2 = new MutationObserver(function () { revealAll(); });
    try {
      mo2.observe(document.body, { childList: true, subtree: true });
    } catch (e) {}
  });

  window.Trend = { reveal: revealAll };
})();
