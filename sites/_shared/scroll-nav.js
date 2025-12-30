// Compact navigation on scroll
(function() {
  const header = document.querySelector('.top');
  if (!header) return;

  let lastScroll = 0;
  const scrollThreshold = 50;

  function handleScroll() {
    const currentScroll = window.scrollY;
    
    if (currentScroll > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  }

  // Throttle scroll events for performance
  let ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Check initial state
  handleScroll();
})();
