// Tema ditentukan di <head> untuk mencegah kilatan saat halaman pertama kali tampil.
(function () {
  const root = document.documentElement;
  const themeKey = 'arab3-theme';

  function applyTheme(theme, persist = true) {
    const nextTheme = theme === 'light' ? 'light' : 'dark';
    root.setAttribute('data-theme', nextTheme);
    root.classList.toggle('dark', nextTheme === 'dark');
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) metaThemeColor.setAttribute('content', nextTheme === 'dark' ? '#071009' : '#eef3ee');
    if (persist) {
      try {
        window.localStorage.setItem(themeKey, nextTheme);
      } catch (error) {
        // Tema tetap dapat diubah selama halaman terbuka meski storage diblokir.
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('theme-toggle-btn');
    if (!button) return;
    button.addEventListener('click', () => {
      applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  }, { once: true });

  window.Trend = { applyTheme };
})();
