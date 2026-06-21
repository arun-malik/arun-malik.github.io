// Hero Banner - loads curated SVG art inline with dynamic theme colors
// Fetches the post-specific SVG, injects it inline, and swaps
// hardcoded colors for CSS variables so it adapts to light/dark mode.

(function() {
  'use strict';

  function run() {
    var ogImage = document.querySelector('meta[property="og:image"]');
    if (!ogImage) return;
    var imageUrl = ogImage.getAttribute('content');
    if (!imageUrl || imageUrl.includes('og-default')) return;

    // Get SVG URL from the PNG OG reference
    var svgUrl = imageUrl.replace('.png', '.svg');

    // Inject styles
    var style = document.createElement('style');
    style.textContent = [
      '.post-hero-banner { display:block; width:100%; max-width:900px; height:240px; margin:1.5rem auto; border-radius:12px; overflow:hidden; border:1px solid var(--border,#e5e7eb); }',
      '.post-hero-banner svg { width:100%; height:100%; display:block; }',
      '@media(max-width:640px) { .post-hero-banner { height:160px; border-radius:0; margin:0 auto 1.5rem; } }'
    ].join('');
    document.head.appendChild(style);

    // Create banner container
    var hero = document.createElement('div');
    hero.className = 'post-hero-banner';

    // Insert into page
    var nav = document.querySelector('nav');
    if (nav) {
      var wrapper = nav.parentElement;
      if (wrapper && wrapper.tagName === 'HEADER') {
        wrapper.insertAdjacentElement('afterend', hero);
      } else {
        nav.insertAdjacentElement('afterend', hero);
      }
    } else {
      document.body.insertAdjacentElement('afterbegin', hero);
    }

    // Fetch SVG and inject inline with dynamic colors
    fetch(svgUrl)
      .then(function(r) { return r.text(); })
      .then(function(svgText) {
        hero.innerHTML = makeThemeAware(svgText);
        // Re-apply on theme change (only if not owned by dynamic art)
        var observer = new MutationObserver(function() {
          if (hero.getAttribute('data-dynamic')) return;
          hero.innerHTML = makeThemeAware(svgText);
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
      })
      .catch(function() {
        // Fallback: use as background image
        hero.style.background = 'url(' + svgUrl + ') center/cover no-repeat';
      });
  }

  function makeThemeAware(svgText) {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    if (isDark) {
      // Dark mode: keep original dark background, brighten strokes slightly
      return svgText;
    } else {
      // Light mode: swap dark bg for light, adjust stroke colors
      return svgText
        .replace(/#0f172a/g, '#f8fafc')         // dark bg -> light bg
        .replace(/#0f172a/gi, '#f8fafc')
        .replace(/#1e293b/g, '#e2e8f0')         // dark secondary -> light secondary
        .replace(/fill="#e2e8f0"/g, 'fill="#334155"')  // light elements -> darker for contrast
        .replace(/stroke="#e2e8f0"/g, 'stroke="#475569"')
        .replace(/fill="#f1f5f9"/g, 'fill="#1e293b"')
        .replace(/stroke="#f1f5f9"/g, 'stroke="#1e293b"')
        .replace(/fill="#c4b5fd"/g, 'fill="#6d28d9"')
        .replace(/stroke="#c4b5fd"/g, 'stroke="#6d28d9"')
        .replace(/fill="#a5b4fc"/g, 'fill="#4338ca"')
        .replace(/stroke="#a5b4fc"/g, 'stroke="#4338ca"')
        .replace(/fill="#93c5fd"/g, 'fill="#2563eb"')
        .replace(/stroke="#93c5fd"/g, 'stroke="#2563eb"')
        .replace(/fill="#6ee7b7"/g, 'fill="#047857"')
        .replace(/stroke="#6ee7b7"/g, 'stroke="#047857"')
        .replace(/fill="#67e8f9"/g, 'fill="#0e7490"')
        .replace(/stroke="#67e8f9"/g, 'stroke="#0e7490"')
        .replace(/fill="#fbbf24"/g, 'fill="#b45309"')
        .replace(/stroke="#fbbf24"/g, 'stroke="#b45309"')
        .replace(/fill="#c7d2fe"/g, 'fill="#4338ca"')
        .replace(/stroke="#c7d2fe"/g, 'stroke="#4338ca"')
        .replace(/fill="#818cf8"/g, 'fill="#4f46e5"')
        .replace(/stroke="#818cf8"/g, 'stroke="#4f46e5"')
        .replace(/fill="#ddd6fe"/g, 'fill="#6d28d9"')
        .replace(/opacity="0\.15"/g, 'opacity="0.25"')
        .replace(/opacity="0\.1"/g, 'opacity="0.2"')
        .replace(/opacity="0\.12"/g, 'opacity="0.2"');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else { run(); }
})();