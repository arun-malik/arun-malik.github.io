// Handle horizontal scroll and update active navigation
(function() {
  const container = document.querySelector('.horizontal-scroll-container');
  const cards = document.querySelectorAll('.content-card[data-section]');
  const navLinks = document.querySelectorAll('.nav-link');
  const indicator = document.querySelector('.scroll-indicator');

  if (!container || cards.length === 0) return;

  // Build scroll indicator dots (if present)
  const dotsBySection = new Map();
  if (indicator) {
    indicator.innerHTML = '';
    cards.forEach((card, idx) => {
      const section = card.getAttribute('data-section');
      if (!section) return;

      const dot = document.createElement('span');
      dot.className = 'scroll-dot' + (idx === 0 ? ' active' : '');
      dot.setAttribute('aria-hidden', 'true');
      dot.dataset.section = section;
      indicator.appendChild(dot);
      dotsBySection.set(section, dot);
    });
  }

  // Convert vertical scroll to horizontal scroll with smooth animation
  let animationFrameId = null;
  let scrollVelocity = 0;
  let isAnimating = false;

  // Wheel event listener for smooth scrolling
  container.addEventListener('wheel', (e) => {
    e.preventDefault();
    scrollVelocity = e.deltaY * 1.2;
    
    if (!isAnimating) {
      isAnimating = true;
      smoothScroll();
    }
  }, { passive: false });

  // Smooth scroll animation using requestAnimationFrame
  function smoothScroll() {
    if (Math.abs(scrollVelocity) > 0.5) {
      container.scrollLeft += scrollVelocity;
      scrollVelocity *= 0.92; // Friction
      animationFrameId = requestAnimationFrame(smoothScroll);
    } else {
      isAnimating = false;
      cancelAnimationFrame(animationFrameId);
    }
  }

  // Touch swipe support
  let touchStartX = 0;
  container.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    container.style.scrollBehavior = 'auto';
  });

  container.addEventListener('touchend', () => {
    container.style.scrollBehavior = 'smooth';
  });

  // Intersection Observer to detect which card is in view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const section = entry.target.getAttribute('data-section');
        
        // Update active nav link
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('data-section') === section) {
            link.classList.add('active');
          }
        });

        // Update active dot
        if (dotsBySection.size > 0 && section) {
          dotsBySection.forEach((dot) => dot.classList.remove('active'));
          const activeDot = dotsBySection.get(section);
          if (activeDot) activeDot.classList.add('active');
        }
      }
    });
  }, {
    root: container,
    threshold: 0.5
  });

  // Observe all cards
  cards.forEach(card => {
    observer.observe(card);
  });

  // Handle nav link clicks to smooth scroll
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.getAttribute('data-section');
      const card = document.getElementById(`card-${section}`);
      
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      container.scrollBy({ left: -window.innerWidth, behavior: 'smooth' });
    } else if (e.key === 'ArrowRight') {
      container.scrollBy({ left: window.innerWidth, behavior: 'smooth' });
    }
  });
})();
