// Nav Active Link - Highlights the current section in navigation
// Works on all page types by checking the URL path.

(function() {
  'use strict';

  function init() {
    var path = window.location.pathname;

    // Determine which nav link to highlight
    var activeHref = null;
    if (path.indexOf('/posts/') === 0) {
      activeHref = '/posts/';
    } else if (path.indexOf('/series/') === 0) {
      activeHref = '/series/';
    } else if (path.indexOf('/about/') === 0) {
      activeHref = '/about/';
    } else if (path.indexOf('/contact/') === 0) {
      activeHref = '/contact/';
    }

    if (!activeHref) return;

    // Find and highlight matching nav links
    var links = document.querySelectorAll('nav a, .nav-links a, .nav-right a');
    links.forEach(function(link) {
      var href = link.getAttribute('href');
      if (href === activeHref) {
        link.style.color = 'var(--text, #111827)';
        link.style.fontWeight = '600';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
