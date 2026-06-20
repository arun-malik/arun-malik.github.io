// Site Footer - Consistent footer across ALL pages
// Replaces or adds a standard footer with links and copyright.

(function() {
  'use strict';

  var FOOTER_HTML = [
    '<footer style="margin-top:4rem;padding:2rem 0;border-top:1px solid var(--border,#e5e7eb);text-align:center;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif">',
    '<div style="display:flex;justify-content:center;gap:1.5rem;margin-bottom:0.75rem">',
    '<a href="https://github.com/arun-malik" target="_blank" style="color:var(--text-secondary,#6b7280);text-decoration:none;font-size:0.8125rem">GitHub</a>',
    '<a href="https://www.linkedin.com/in/malik-arun/" target="_blank" style="color:var(--text-secondary,#6b7280);text-decoration:none;font-size:0.8125rem">LinkedIn</a>',
    '<a href="/feed.xml" style="color:var(--text-secondary,#6b7280);text-decoration:none;font-size:0.8125rem">RSS</a>',
    '</div>',
    '<p style="font-size:0.8125rem;color:var(--text-secondary,#6b7280)">&copy; 2026 Arun Malik</p>',
    '</footer>'
  ].join('');

  function init() {
    // Remove old footers (various formats)
    var oldFooters = document.querySelectorAll('footer, .blog-footer');
    oldFooters.forEach(function(f) { f.remove(); });

    // Add standard footer at end of body
    document.body.insertAdjacentHTML('beforeend', FOOTER_HTML);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
