// Dynamic Abstract Geometric Art - generates unique pattern on each load
// Uses canvas for rich generative visuals with geometric shapes

(function() {
  'use strict';

  function init() {
    var hero = document.querySelector('.post-hero-banner');
    if (!hero) return;

    // Replace static SVG content with canvas
    hero.innerHTML = '';
    var canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 480;
    canvas.style.cssText = 'width:100%;height:100%;display:block;border-radius:inherit';
    hero.appendChild(canvas);

    var ctx = canvas.getContext('2d');
    render(ctx, canvas.width, canvas.height);

    // Re-render on theme change
    var observer = new MutationObserver(function() {
      render(ctx, canvas.width, canvas.height);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  function render(ctx, w, h) {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    var bg = isDark ? '#0f172a' : '#f8fafc';
    var strokeBase = isDark ? 'rgba(96,165,250,' : 'rgba(37,99,235,';
    var fillBase = isDark ? 'rgba(99,102,241,' : 'rgba(79,70,229,';
    var dotColor = isDark ? 'rgba(147,197,253,' : 'rgba(37,99,235,';

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    var seed = Date.now();
    var rand = seededRandom(seed);

    // Layer 1: Large flowing curves
    ctx.strokeStyle = strokeBase + '0.12)';
    ctx.lineWidth = 1.5;
    for (var i = 0; i < 5; i++) {
      ctx.beginPath();
      var y = rand() * h;
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(w*0.3, rand()*h, w*0.6, rand()*h, w, rand()*h);
      ctx.stroke();
    }

    // Layer 2: Geometric shapes (triangles, hexagons, circles)
    var shapes = 15 + Math.floor(rand() * 10);
    for (var i = 0; i < shapes; i++) {
      var x = rand() * w;
      var y = rand() * h;
      var size = 20 + rand() * 60;
      var type = Math.floor(rand() * 4);
      var opacity = 0.08 + rand() * 0.2;

      ctx.strokeStyle = strokeBase + opacity + ')';
      ctx.fillStyle = fillBase + (opacity * 0.3) + ')';
      ctx.lineWidth = 0.8 + rand() * 1.2;

      ctx.beginPath();
      if (type === 0) {
        // Triangle
        ctx.moveTo(x, y - size/2);
        ctx.lineTo(x + size/2, y + size/2);
        ctx.lineTo(x - size/2, y + size/2);
        ctx.closePath();
      } else if (type === 1) {
        // Hexagon
        for (var j = 0; j < 6; j++) {
          var angle = (Math.PI / 3) * j - Math.PI / 6;
          var px = x + (size/2) * Math.cos(angle);
          var py = y + (size/2) * Math.sin(angle);
          if (j === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
      } else if (type === 2) {
        // Circle
        ctx.arc(x, y, size/2, 0, Math.PI * 2);
      } else {
        // Diamond
        ctx.moveTo(x, y - size/2);
        ctx.lineTo(x + size/3, y);
        ctx.lineTo(x, y + size/2);
        ctx.lineTo(x - size/3, y);
        ctx.closePath();
      }
      if (rand() > 0.6) ctx.fill();
      ctx.stroke();
    }

    // Layer 3: Connected nodes (neural/network feel)
    var nodes = [];
    var nodeCount = 20 + Math.floor(rand() * 15);
    for (var i = 0; i < nodeCount; i++) {
      nodes.push({ x: rand() * w, y: rand() * h, r: 2 + rand() * 4 });
    }

    // Draw connections between nearby nodes
    ctx.strokeStyle = strokeBase + '0.08)';
    ctx.lineWidth = 0.5;
    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var dx = nodes[i].x - nodes[j].x;
        var dy = nodes[i].y - nodes[j].y;
        var dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 180) {
          ctx.globalAlpha = 1 - dist/180;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;

    // Draw nodes
    for (var i = 0; i < nodes.length; i++) {
      ctx.fillStyle = dotColor + (0.3 + rand() * 0.5) + ')';
      ctx.beginPath();
      ctx.arc(nodes[i].x, nodes[i].y, nodes[i].r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Layer 4: Concentric rings (focal point)
    var cx = w * (0.3 + rand() * 0.4);
    var cy = h * (0.3 + rand() * 0.4);
    ctx.strokeStyle = strokeBase + '0.1)';
    ctx.lineWidth = 1;
    for (var r = 30; r < 200; r += 35) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Layer 5: Scattered small particles
    for (var i = 0; i < 40; i++) {
      ctx.fillStyle = dotColor + (0.1 + rand() * 0.3) + ')';
      ctx.beginPath();
      ctx.arc(rand() * w, rand() * h, 1 + rand() * 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function seededRandom(seed) {
    var s = seed % 2147483647;
    return function() {
      s = (s * 16807 + 0) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(init, 150); });
  } else { setTimeout(init, 150); }
})();