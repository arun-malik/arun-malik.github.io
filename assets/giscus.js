// Giscus Reactions & Comments - powered by GitHub Discussions
// Free, no database, data lives in your own repo.
// 
// SETUP (one-time, 2 minutes):
// 1. Go to https://github.com/arun-malik/arun-malik.github.io/settings
//    Scroll to Features > check "Discussions"
// 2. Go to https://github.com/apps/giscus and install on your repo
// 3. That's it! Reactions and comments will work.

(function() {
  'use strict';

  function init() {
    // Only add to content pages
    var headings = document.querySelectorAll('h2');
    if (headings.length < 2) return;

    // Don't add if already exists
    if (document.querySelector('.giscus')) return;

    // Create container
    var container = document.createElement('div');
    container.style.cssText = 'max-width:900px;margin:3rem auto 2rem;padding:0 1.5rem';

    // Add a section heading
    var heading = document.createElement('h3');
    heading.textContent = 'Reactions & Comments';
    heading.style.cssText = 'font-size:1rem;font-weight:600;color:var(--text-secondary,#6b7280);margin-bottom:1rem;font-family:-apple-system,sans-serif';
    container.appendChild(heading);

    // Giscus script
    var script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'arun-malik/arun-malik.github.io');
    script.setAttribute('data-repo-id', 'R_kgDOOcKxag');
    script.setAttribute('data-category', 'Announcements');
    script.setAttribute('data-category-id', 'DIC_kwDOOcKxas4C_k1P');
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-lang', 'en');
    script.setAttribute('data-loading', 'lazy');
    script.crossOrigin = 'anonymous';
    script.async = true;

    // Theme-aware
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    script.setAttribute('data-theme', isDark ? 'dark_dimmed' : 'light');

    container.appendChild(script);

    // Insert before footer
    var footer = document.querySelector('footer');
    if (footer) {
      footer.insertAdjacentElement('beforebegin', container);
    } else {
      document.body.appendChild(container);
    }

    // Update theme on toggle
    var observer = new MutationObserver(function() {
      var iframe = document.querySelector('iframe.giscus-frame');
      if (iframe) {
        var dark = document.documentElement.getAttribute('data-theme') === 'dark';
        var msg = { giscus: { setConfig: { theme: dark ? 'dark_dimmed' : 'light' } } };
        iframe.contentWindow.postMessage(msg, 'https://giscus.app');
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(init, 300); });
  } else { setTimeout(init, 300); }
})();
