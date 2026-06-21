// Reading Progress Save - saves and restores scroll position per page
// Uses localStorage, zero backend needed.

(function() {
  'use strict';

  var key = 'reading-progress:' + window.location.pathname;

  function saveProgress() {
    var scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    if (scrollPercent > 0.05 && scrollPercent < 0.95) {
      localStorage.setItem(key, JSON.stringify({
        y: window.scrollY,
        percent: Math.round(scrollPercent * 100),
        timestamp: Date.now()
      }));
    } else if (scrollPercent >= 0.95) {
      // Finished reading - clear saved position
      localStorage.removeItem(key);
    }
  }

  function restoreProgress() {
    var saved = localStorage.getItem(key);
    if (!saved) return;

    var data = JSON.parse(saved);
    // Only restore if saved within last 7 days
    if (Date.now() - data.timestamp > 7 * 24 * 60 * 60 * 1000) {
      localStorage.removeItem(key);
      return;
    }

    // Show a subtle "Continue reading" prompt
    var prompt = document.createElement('div');
    prompt.style.cssText = 'position:fixed;bottom:1.5rem;left:50%;transform:translateX(-50%);background:var(--bg,#fff);border:1px solid var(--border,#e5e7eb);border-radius:8px;padding:0.625rem 1rem;font-size:0.8125rem;font-family:-apple-system,sans-serif;color:var(--text-secondary,#6b7280);box-shadow:0 4px 12px rgba(0,0,0,0.1);z-index:1000;display:flex;align-items:center;gap:0.75rem;cursor:pointer;transition:opacity 0.3s';
    prompt.innerHTML = 'Continue where you left off (' + data.percent + '%)' +
      '<button style="background:var(--accent,#2563eb);color:#fff;border:none;border-radius:4px;padding:0.25rem 0.6rem;font-size:0.75rem;cursor:pointer;font-family:inherit">Resume</button>' +
      '<button style="background:none;border:none;color:var(--text-secondary,#6b7280);cursor:pointer;font-size:1rem;padding:0 0.25rem">&times;</button>';

    document.body.appendChild(prompt);

    prompt.querySelector('button').addEventListener('click', function() {
      window.scrollTo({ top: data.y, behavior: 'smooth' });
      prompt.remove();
    });

    prompt.querySelector('button:last-child').addEventListener('click', function() {
      prompt.remove();
      localStorage.removeItem(key);
    });

    // Auto-dismiss after 8 seconds
    setTimeout(function() {
      if (prompt.parentNode) {
        prompt.style.opacity = '0';
        setTimeout(function() { prompt.remove(); }, 300);
      }
    }, 8000);
  }

  // Save progress periodically
  var saveTimeout;
  window.addEventListener('scroll', function() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(saveProgress, 1000);
  }, { passive: true });

  // Restore on page load (only on content pages)
  if (document.querySelectorAll('h2').length >= 2) {
    setTimeout(restoreProgress, 500);
  }
})();
