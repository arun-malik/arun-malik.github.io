// Nav Active Link - Highlights the current section in navigation
// Works on all page types by checking the URL path.

(function() {
  'use strict';

  function init() {
    var path = window.location.pathname;

    document.querySelectorAll('nav .nav-links').forEach(function(navLinks) {
      var writingLink = navLinks.querySelector('a[href="/posts/"]');
      if (writingLink) writingLink.remove();
      var seriesLink = navLinks.querySelector('a[href="/series/"]');
      if (seriesLink && !navLinks.querySelector('a[href="/talks/"]')) {
        var link = document.createElement('a');
        link.href = '/talks/';
        link.textContent = 'Presentations';
        link.style.cssText = seriesLink.style.cssText;
        seriesLink.insertAdjacentElement('afterend', link);
      }
      navLinks.style.flexWrap = 'wrap';
      var nav = navLinks.closest('nav');
      nav.style.flexWrap = 'wrap';
      nav.style.gap = '1rem';
    });

    // Determine which nav link to highlight
    var activeHref = null;
    if (path.indexOf('/series/') === 0) {
      activeHref = '/series/';
    } else if (path.indexOf('/talks/') === 0) {
      activeHref = '/talks/';
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
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
