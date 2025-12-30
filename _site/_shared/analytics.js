(function () {
  const cfg = window.__ANALYTICS_CONFIG__ || {};

  const now = () => (typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now());

  const state = {
    startedAt: now(),
    lastActiveAt: now(),
    activeMs: 0,
    lastTickAt: now(),

    // sectionName -> ms
    sectionMs: Object.create(null),
    currentSection: null,
    currentSectionSince: null,

    interacted: false,
  };

  const isPageActive = () => document.visibilityState === 'visible';

  const tick = () => {
    const t = now();
    const dt = t - state.lastTickAt;
    state.lastTickAt = t;

    // Only count time when tab is visible.
    if (!isPageActive()) return;

    // Only count as "active" if there was user interaction recently.
    // This avoids overstating time when the page is left open.
    const idleCutoffMs = 30_000;
    if (t - state.lastActiveAt <= idleCutoffMs) {
      state.activeMs += dt;

      if (state.currentSection && state.currentSectionSince != null) {
        const sdt = t - state.currentSectionSince;
        state.sectionMs[state.currentSection] = (state.sectionMs[state.currentSection] || 0) + sdt;
        state.currentSectionSince = t;
      }
    }
  };

  const markActive = () => {
    state.interacted = true;
    state.lastActiveAt = now();
  };

  // Minimal interaction signals
  ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach((evt) => {
    window.addEventListener(evt, markActive, { passive: true });
  });

  // Section tracking
  const setSection = (name) => {
    if (!cfg.trackSections) return;
    if (!name) return;

    const t = now();

    // Close previous section window without double-counting.
    state.currentSection = name;
    state.currentSectionSince = t;
  };

  const makeSectionName = (el) => {
    const explicit = el.getAttribute('data-track-section');
    if (explicit) return explicit;

    if (cfg.autoTrackHeadings) {
      if (el.matches('h2, h3')) {
        const text = (el.textContent || '').trim();
        if (!text) return null;
        return text.toLowerCase().replace(/\s+/g, '-').slice(0, 60);
      }
    }

    return null;
  };

  if (cfg.trackSections) {
    const candidates = [];

    document.querySelectorAll('[data-track-section]').forEach((el) => candidates.push(el));

    if (cfg.autoTrackHeadings) {
      document.querySelectorAll('h2, h3').forEach((el) => candidates.push(el));
    }

    // Choose the most visible section as "current".
    const visibility = new Map();

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const name = makeSectionName(entry.target);
          if (!name) continue;
          visibility.set(name, entry.intersectionRatio);
        }

        let best = null;
        let bestRatio = 0;
        for (const [name, ratio] of visibility.entries()) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = name;
          }
        }

        if (best && best !== state.currentSection) {
          setSection(best);

          // Fire a lightweight event for providers that support it.
          try {
            if (typeof window.clarity === 'function') window.clarity('event', 'section_enter');
            if (typeof window.gtag === 'function') window.gtag('event', 'section_enter', { section: best });
          } catch {}
        }
      },
      {
        root: null,
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    candidates.forEach((el) => io.observe(el));
  }

  // Page view event (providers usually do this automatically, but this helps for custom reporting)
  const trackPageView = () => {
    try {
      if (typeof window.clarity === 'function') {
        window.clarity('set', 'page_path', location.pathname);
      }
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'page_view', { page_path: location.pathname });
      }
    } catch {}
  };

  // Flush analytics on leave
  const flush = () => {
    tick();

    const payload = {
      path: location.pathname,
      activeMs: Math.round(state.activeMs),
      interacted: state.interacted,
      sectionMs: state.sectionMs,
    };

    // For free hosted providers we can only send via their JS APIs.
    // Clarity supports key/value tags; GA4 supports event params.
    try {
      if (typeof window.clarity === 'function') {
        window.clarity('set', 'active_ms', String(payload.activeMs));
        window.clarity('set', 'interacted', payload.interacted ? '1' : '0');
      }
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'engagement_summary', {
          page_path: payload.path,
          active_ms: payload.activeMs,
          interacted: payload.interacted,
        });
      }
    } catch {}

    // If you later add your own endpoint, you can sendBeacon(payload) here.
  };

  // Keep ticking while page is open.
  const interval = window.setInterval(tick, 1000);

  document.addEventListener('visibilitychange', () => {
    tick();
    if (!isPageActive()) flush();
  });

  window.addEventListener('pagehide', () => {
    window.clearInterval(interval);
    flush();
  });

  trackPageView();
})();
