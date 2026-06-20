// Site Header - Consistent navigation across ALL pages
// Replaces any existing nav with the standard site header.
// Includes: site name, nav links, search button, theme toggle.

(function() {
  'use strict';

  var STANDARD_NAV = [
    '<div style="max-width:900px;margin:0 auto;padding:0 1.5rem">',
    '<header style="padding:2rem 0 1.5rem;border-bottom:1px solid var(--border,#e5e7eb);margin-bottom:2rem">',
    '<nav class="site-nav" style="display:flex;align-items:center;justify-content:space-between">',
    '<a href="/" style="font-size:1.125rem;font-weight:700;color:var(--text,#111827);text-decoration:none;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif">Arun Malik</a>',
    '<div style="display:flex;gap:1.5rem;align-items:center">',
    '<a href="/posts/" style="color:var(--text-secondary,#6b7280);text-decoration:none;font-size:0.875rem;font-weight:500;font-family:-apple-system,sans-serif">Writing</a>',
    '<a href="/series/" style="color:var(--text-secondary,#6b7280);text-decoration:none;font-size:0.875rem;font-weight:500;font-family:-apple-system,sans-serif">Series</a>',
    '<a href="/about/" style="color:var(--text-secondary,#6b7280);text-decoration:none;font-size:0.875rem;font-weight:500;font-family:-apple-system,sans-serif">About</a>',
    '<a href="/contact/" style="color:var(--text-secondary,#6b7280);text-decoration:none;font-size:0.875rem;font-weight:500;font-family:-apple-system,sans-serif">Contact</a>',
    '<button class="theme-btn" id="themeToggle" title="Toggle theme" style="background:none;border:none;cursor:pointer;font-size:1.125rem;color:var(--text-secondary,#6b7280);padding:0.25rem">',
    '<svg id="sunIcon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
    '<svg id="moonIcon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
    '</button>',
    '</div>',
    '</nav>',
    '</header>',
    '</div>'
  ].join('');

  function init() {
    // Check if this page needs the standard header
    var existingTheme = document.getElementById('themeToggle');
    var existingSearch = document.querySelector('.search-btn');
    
    // If page already has both theme toggle and is using standard nav, skip
    if (existingTheme && existingSearch) return;

    // Find and remove old nav elements (paper-style pages)
    var oldNavs = document.querySelectorAll('nav.blog-nav, nav.nav-bar, nav.top-nav');
    var oldPrintBtns = document.querySelectorAll('.print-btn');
    
    if (oldNavs.length === 0) return; // Page has standard <header><nav> already

    // Remove old navs and print buttons
    oldNavs.forEach(function(n) { n.remove(); });
    oldPrintBtns.forEach(function(b) { b.remove(); });

    // Insert standard header at top of body
    document.body.insertAdjacentHTML('afterbegin', STANDARD_NAV);

    // Initialize theme toggle
    var toggle = document.getElementById('themeToggle');
    var sun = document.getElementById('sunIcon');
    var moon = document.getElementById('moonIcon');

    function setTheme(dark) {
      document.documentElement.setAttribute('data-theme', dark ? 'dark' : '');
      if (sun) sun.style.display = dark ? 'block' : 'none';
      if (moon) moon.style.display = dark ? 'none' : 'block';
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    }

    var saved = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(saved === 'dark' || (!saved && prefersDark));

    if (toggle) {
      toggle.addEventListener('click', function() {
        var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        setTheme(!isDark);
      });
    }

    // Add dark mode CSS vars if not already present
    if (!document.querySelector('style[data-site-theme]')) {
      var themeStyle = document.createElement('style');
      themeStyle.setAttribute('data-site-theme', '1');
      themeStyle.textContent = [
        '[data-theme="dark"] { --bg:#0f172a; --bg-secondary:#1e293b; --text:#f1f5f9; --text-secondary:#94a3b8; --accent:#60a5fa; --border:#334155; }',
        '[data-theme="dark"] body { background:#0f172a; color:#f1f5f9; }',
        '[data-theme="dark"] h1, [data-theme="dark"] h2, [data-theme="dark"] h3 { color:#f1f5f9; }',
        '[data-theme="dark"] a { color:#60a5fa; }',
        '[data-theme="dark"] table th { background:#1e293b; }',
        '[data-theme="dark"] table td, [data-theme="dark"] table th { border-color:#334155; }',
        '[data-theme="dark"] pre, [data-theme="dark"] code { background:#1e293b; }',
        '[data-theme="dark"] .abstract, [data-theme="dark"] blockquote { background:#1e293b; border-color:#334155; }',
        '[data-theme="dark"] .blog-footer { border-color:#334155; color:#94a3b8; }',
        '[data-theme="dark"] .blog-footer a { color:#94a3b8; }'
      ].join('');
      document.head.appendChild(themeStyle);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
