// Card Theme - Makes thumbnail images on listing pages theme-aware
// Fetches SVGs inline and applies light/dark color swapping.

(function() {
  'use strict';

  function init() {
    var thumbs = document.querySelectorAll('.post-thumb, .card-img, .featured-img');
    if (thumbs.length === 0) return;

    thumbs.forEach(function(el) {
      var bg = el.style.background || el.style.backgroundImage || '';
      var match = bg.match(/url\(([^)]+)\)/);
      if (!match) return;

      var svgUrl = match[1].replace(/['"]/g, '');
      if (!svgUrl.endsWith('.svg')) return;

      // Fetch SVG and inject inline
      fetch(svgUrl)
        .then(function(r) { return r.text(); })
        .then(function(svgText) {
          el.style.background = 'none';
          el.innerHTML = applyTheme(svgText);
          el.querySelector('svg').style.cssText = 'width:100%;height:100%;display:block;border-radius:inherit';
        })
        .catch(function() {});
    });

    // Re-apply on theme change
    var observer = new MutationObserver(function() {
      document.querySelectorAll('.post-thumb svg, .card-img svg, .featured-img svg').forEach(function(svg) {
        var parent = svg.parentElement;
        var original = parent.getAttribute('data-svg');
        if (original) {
          parent.innerHTML = applyTheme(original);
          parent.querySelector('svg').style.cssText = 'width:100%;height:100%;display:block;border-radius:inherit';
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // Store original SVG for theme switching
    setTimeout(function() {
      document.querySelectorAll('.post-thumb, .card-img, .featured-img').forEach(function(el) {
        var svg = el.querySelector('svg');
        if (svg && !el.getAttribute('data-svg')) {
          el.setAttribute('data-svg', svg.outerHTML);
        }
      });
    }, 1000);
  }

  function applyTheme(svgText) {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) return svgText;

    return svgText
      .replace(/#0f172a/gi, '#f8fafc')
      .replace(/#1e293b/gi, '#e2e8f0')
      .replace(/#1a237e/gi, '#dbeafe')
      .replace(/#0d47a1/gi, '#bfdbfe')
      .replace(/#164e63/gi, '#cffafe')
      .replace(/fill="#e2e8f0"/gi, 'fill="#334155"')
      .replace(/stroke="#e2e8f0"/gi, 'stroke="#475569"')
      .replace(/fill="#f1f5f9"/gi, 'fill="#1e293b"')
      .replace(/stroke="#f1f5f9"/gi, 'stroke="#1e293b"')
      .replace(/fill="#94a3b8"/gi, 'fill="#475569"')
      .replace(/stroke="#94a3b8"/gi, 'stroke="#475569"')
      .replace(/opacity="0\.15"/g, 'opacity="0.25"')
      .replace(/opacity="0\.1"/g, 'opacity="0.18"')
      .replace(/opacity="0\.12"/g, 'opacity="0.2"');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
