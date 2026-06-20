// Hero Banner - Dynamic theme-aware generative art
// Renders inline SVG using CSS variables so it adapts to light/dark mode.
// Each page gets a unique pattern based on its URL slug.

(function() {
  'use strict';

  // Simple hash from string to get consistent random seed per page
  function hashCode(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  // Seeded pseudo-random number generator
  function seededRandom(seed) {
    var s = seed;
    return function() {
      s = (s * 16807 + 0) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }

  // Generate abstract geometric SVG based on seed
  function generateArt(seed) {
    var rand = seededRandom(seed);
    var w = 1200, h = 300;
    var parts = [];

    // Use CSS variable references (works because SVG is inline)
    var stroke = 'var(--accent, #2563eb)';
    var strokeLight = 'var(--hero-stroke-light, rgba(96,165,250,0.3))';
    var fill = 'var(--hero-fill, rgba(37,99,235,0.08))';
    var dot = 'var(--accent, #2563eb)';

    // Layer 1: Large flowing ellipses (background texture)
    for (var i = 0; i < 4; i++) {
      var cx = 200 + rand() * 800;
      var cy = 50 + rand() * 200;
      var rx = 150 + rand() * 300;
      var ry = 80 + rand() * 150;
      var rot = -30 + rand() * 60;
      parts.push('<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" transform="rotate('+rot.toFixed(1)+' '+cx+' '+cy+')" fill="none" stroke="'+stroke+'" stroke-width="0.8" opacity="0.12"/>');
    }

    // Layer 2: Geometric polygon mesh
    var nodes = [];
    var nodeCount = 12 + Math.floor(rand() * 8);
    for (var i = 0; i < nodeCount; i++) {
      nodes.push({ x: 50 + rand() * (w - 100), y: 20 + rand() * (h - 40) });
    }

    // Connect nearby nodes with lines
    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var dx = nodes[i].x - nodes[j].x;
        var dy = nodes[i].y - nodes[j].y;
        var dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 250) {
          var opacity = (0.08 + (1 - dist/250) * 0.15).toFixed(3);
          parts.push('<line x1="'+nodes[i].x.toFixed(1)+'" y1="'+nodes[i].y.toFixed(1)+'" x2="'+nodes[j].x.toFixed(1)+'" y2="'+nodes[j].y.toFixed(1)+'" stroke="'+stroke+'" stroke-width="1" opacity="'+opacity+'"/>');
        }
      }
    }

    // Layer 3: Some filled triangles (select triads)
    for (var i = 0; i < nodes.length - 2; i += 3) {
      if (rand() > 0.5) {
        var a = nodes[i], b = nodes[i+1], c = nodes[i+2];
        parts.push('<polygon points="'+a.x.toFixed(1)+','+a.y.toFixed(1)+' '+b.x.toFixed(1)+','+b.y.toFixed(1)+' '+c.x.toFixed(1)+','+c.y.toFixed(1)+'" fill="'+fill+'" stroke="none"/>');
      }
    }

    // Layer 4: Node dots
    for (var i = 0; i < nodes.length; i++) {
      var r = 1.5 + rand() * 2.5;
      var opacity = (0.2 + rand() * 0.4).toFixed(2);
      parts.push('<circle cx="'+nodes[i].x.toFixed(1)+'" cy="'+nodes[i].y.toFixed(1)+'" r="'+r.toFixed(1)+'" fill="'+dot+'" opacity="'+opacity+'"/>');
    }

    // Layer 5: Flowing curves
    for (var i = 0; i < 2; i++) {
      var y0 = 50 + rand() * 200;
      var cp1y = rand() * h;
      var cp2y = rand() * h;
      var yEnd = 50 + rand() * 200;
      parts.push('<path d="M0,'+y0.toFixed(0)+' Q400,'+cp1y.toFixed(0)+' 600,'+((y0+yEnd)/2).toFixed(0)+' T1200,'+yEnd.toFixed(0)+'" fill="none" stroke="'+stroke+'" stroke-width="1.5" opacity="0.1"/>');
    }

    return '<svg xmlns="http://www.w3.org/2000/svg" width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'" style="width:100%;height:100%;display:block">' +
           '<rect width="'+w+'" height="'+h+'" fill="var(--bg-secondary, #f9fafb)"/>' +
           parts.join('') +
           '</svg>';
  }

  function run() {
    var ogImage = document.querySelector('meta[property="og:image"]');
    if (!ogImage) return;
    var imageUrl = ogImage.getAttribute('content');
    if (!imageUrl || imageUrl.includes('og-default')) return;

    // Get unique seed from page URL
    var path = window.location.pathname.replace(/\/$/, '');
    var slug = path.split('/').pop() || 'home';
    var seed = hashCode(slug);

    // Inject theme-aware CSS variables
    var style = document.createElement('style');
    style.textContent = [
      ':root { --hero-stroke-light: rgba(37,99,235,0.15); --hero-fill: rgba(37,99,235,0.06); }',
      '[data-theme="dark"] { --hero-stroke-light: rgba(96,165,250,0.2); --hero-fill: rgba(96,165,250,0.08); }',
      '.post-hero-banner { display:block; width:100%; max-width:900px; height:240px; margin:1.5rem auto; border-radius:12px; overflow:hidden; border:1px solid var(--border,#e5e7eb); }',
      '@media(max-width:640px) { .post-hero-banner { height:160px; border-radius:0; margin:0 auto 1.5rem; } }'
    ].join('');
    document.head.appendChild(style);

    // Create banner with inline SVG
    var hero = document.createElement('div');
    hero.className = 'post-hero-banner';
    hero.innerHTML = generateArt(seed);

    // Insert after nav
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else { run(); }
})();