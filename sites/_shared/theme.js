(function () {
  const storageKey = 'theme';

  function getInitialTheme() {
    const saved = localStorage.getItem(storageKey);
    if (saved === 'light' || saved === 'dark') return saved;
    return 'light';
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
    try { localStorage.setItem(storageKey, theme); } catch {}

    const icon = document.getElementById('themeIcon');
    if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';

    const btn = document.getElementById('themeToggle');
    if (btn) btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  }

  // Apply immediately to avoid a flash.
  applyTheme(getInitialTheme());

  window.toggleTheme = function toggleTheme() {
    const current = document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  };

  // Use event delegation on document to catch dynamically loaded buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('#themeToggle');
    if (btn) {
      e.preventDefault();
      window.toggleTheme();
    }
  });
})();
