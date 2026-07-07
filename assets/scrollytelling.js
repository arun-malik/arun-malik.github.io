// Scrollytelling engine — reusable across posts.
//
// Markup contract:
//   <div class="scrolly" data-scrolly>
//     <div class="scrolly-graphic">           <!-- sticky visual -->
//       <div class="scene" data-scene="1">...</div>
//       <div class="scene" data-scene="2">...</div>
//       ...
//     </div>
//     <div class="scrolly-steps">
//       <div class="step" data-scene="1">...narrative...</div>
//       <div class="step" data-scene="2">...narrative...</div>
//       ...
//     </div>
//   </div>
//
// The engine marks the step nearest the viewport center as `.is-active`, and
// activates the matching graphic `.scene` (by data-scene). It dispatches a
// `scrolly:change` CustomEvent on the root so page code can lazily build charts
// or trigger scene-specific animation.
//
// Progressive enhancement:
//   - Without JS, the first scene stays visible (see CSS) and all narrative text
//     remains fully readable in normal flow.
//   - Respects prefers-reduced-motion (handled in CSS; the engine only toggles
//     classes/attributes, it never animates directly).

(function () {
  'use strict';

  function initRoot(root) {
    var graphic = root.querySelector('.scrolly-graphic');
    var steps = Array.prototype.slice.call(root.querySelectorAll('.scrolly-steps .step'));
    if (!graphic || steps.length === 0) return;

    var scenes = Array.prototype.slice.call(graphic.querySelectorAll('.scene'));
    root.classList.add('scrolly-enabled');

    var current = null;

    function activate(step) {
      if (!step || step === current) return;
      current = step;

      steps.forEach(function (s) { s.classList.toggle('is-active', s === step); });

      var scene = step.getAttribute('data-scene');
      scenes.forEach(function (sc) {
        sc.classList.toggle('is-active', sc.getAttribute('data-scene') === scene);
      });

      var index = steps.indexOf(step);
      root.dispatchEvent(new CustomEvent('scrolly:change', {
        detail: { root: root, step: step, scene: scene, index: index }
      }));
    }

    // Activate the step whose center-band crosses the viewport middle.
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) activate(entry.target);
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

    steps.forEach(function (s) { observer.observe(s); });

    // Prime the first scene so the graphic is never blank on load.
    activate(steps[0]);
  }

  function init() {
    var roots = document.querySelectorAll('[data-scrolly]');
    if (!roots.length) return;
    if (!('IntersectionObserver' in window)) return; // graceful: CSS shows scene 1
    Array.prototype.forEach.call(roots, initRoot);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
