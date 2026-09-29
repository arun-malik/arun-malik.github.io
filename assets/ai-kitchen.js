(function () {
  'use strict';

  var button = document.getElementById('themeToggle');
  if (!button) return;
  var preference = window.matchMedia('(prefers-color-scheme: dark)');
  var saved;
  try { saved = localStorage.getItem('theme'); } catch (_) {}

  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.getElementById('sunIcon').style.display = theme === 'dark' ? 'block' : 'none';
    document.getElementById('moonIcon').style.display = theme === 'dark' ? 'none' : 'block';
    button.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' theme');
    button.title = button.getAttribute('aria-label');
  }

  apply(saved === 'dark' || saved === 'light' ? saved : preference.matches ? 'dark' : 'light');
  button.hidden = false;
  button.addEventListener('click', function () {
    saved = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    apply(saved);
    try { localStorage.setItem('theme', saved); } catch (_) {}
  });
  preference.addEventListener('change', function (event) {
    if (!saved) apply(event.matches ? 'dark' : 'light');
  });
})();
