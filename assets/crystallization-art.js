(() => {
  'use strict';
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!motion.matches) {
    document.querySelectorAll('[data-crystallization-art]').forEach(art => {
      art.classList.add('pc-motion');
    });
  }
  motion.addEventListener('change', () => {
    if (motion.matches) {
      document.querySelectorAll('[data-crystallization-art]').forEach(art => {
        art.classList.remove('pc-motion');
      });
    }
  });
})();
