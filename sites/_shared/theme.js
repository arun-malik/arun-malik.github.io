(function () {
  const storageKey = 'theme';
  const root = document.documentElement;

  function getInitialTheme() {
    const saved = localStorage.getItem(storageKey);
    if (saved === 'light' || saved === 'dark') return saved;

    // Default to light unless OS prefers dark.
    try {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    } catch {}
    return 'light';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem(storageKey, theme); } catch {}

    const icon = document.getElementById('themeIcon');
    if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';

    const btn = document.getElementById('themeToggle');
    if (btn) btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  }

  // Apply immediately to avoid a flash.
  applyTheme(getInitialTheme());

  window.toggleTheme = function toggleTheme() {
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  };

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.toggleTheme();
    });
  });
})();
