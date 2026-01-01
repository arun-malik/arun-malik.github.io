(function () {
  'use strict';

  function normalizeHash(hash) {
    if (!hash) return '';
    return hash.replace(/^#/, '').trim();
  }

  function initDeck(deckEl) {
    const slides = Array.from(deckEl.querySelectorAll('[data-slide]'));
    if (!slides.length) return;

    const indicator = document.querySelector('[data-deck-indicator]');
    const prevBtn = document.querySelector('[data-deck-prev]');
    const nextBtn = document.querySelector('[data-deck-next]');
    const progressEl = document.querySelector('[data-deck-progress]');

    let currentIndex = 0;

    function setActive(index, opts) {
      const options = opts || {};
      const clamped = Math.max(0, Math.min(slides.length - 1, index));
      currentIndex = clamped;

      slides.forEach((slide, i) => {
        slide.classList.toggle('is-active', i === currentIndex);
        slide.setAttribute('aria-hidden', i === currentIndex ? 'false' : 'true');
      });

      if (prevBtn) prevBtn.classList.toggle('disabled', currentIndex === 0);
      if (nextBtn) nextBtn.classList.toggle('disabled', currentIndex === slides.length - 1);

      if (progressEl) {
        progressEl.textContent = (currentIndex + 1) + ' / ' + slides.length;
      }

      if (indicator) {
        const dots = Array.from(indicator.querySelectorAll('[data-deck-dot]'));
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === currentIndex);
          dot.setAttribute('aria-current', i === currentIndex ? 'true' : 'false');
        });
      }

      const slide = slides[currentIndex];
      const hash = slide.getAttribute('data-hash') || '';
      if (options.updateHash && hash) {
        history.replaceState(null, '', '#' + hash);
      }

      // Accessibility: move focus to slide heading if present
      if (options.focus) {
        const heading = slide.querySelector('h1, h2, [data-slide-title]');
        if (heading && typeof heading.focus === 'function') {
          heading.focus();
        }
      }
    }

    function buildIndicator() {
      if (!indicator) return;
      indicator.innerHTML = '';
      slides.forEach((slide, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'deck-dot' + (i === currentIndex ? ' active' : '');
        btn.setAttribute('data-deck-dot', '');
        btn.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        btn.addEventListener('click', () => setActive(i, { updateHash: true, focus: true }));
        indicator.appendChild(btn);
      });
    }

    function loadFromHash() {
      const hash = normalizeHash(location.hash);
      if (!hash) return false;
      const idx = slides.findIndex((s) => (s.getAttribute('data-hash') || '') === hash);
      if (idx >= 0) {
        setActive(idx, { updateHash: false });
        return true;
      }
      return false;
    }

    function go(direction) {
      setActive(currentIndex + direction, { updateHash: true, focus: false });
    }

    if (prevBtn) prevBtn.addEventListener('click', () => go(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => go(1));

    document.addEventListener('keydown', (e) => {
      // Avoid hijacking typing in inputs/textarea
      const t = e.target;
      const isTyping = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
      if (isTyping) return;

      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    });

    window.addEventListener('hashchange', () => {
      loadFromHash();
    });

    // Exercises
    const exercises = Array.from(deckEl.querySelectorAll('[data-exercise]'));
    exercises.forEach((exerciseEl) => {
      const type = exerciseEl.getAttribute('data-exercise');
      const feedback = exerciseEl.querySelector('[data-exercise-feedback]');

      function setFeedback(msg) {
        if (!feedback) return;
        feedback.textContent = msg;
      }

      if (type === 'mcq') {
        const options = Array.from(exerciseEl.querySelectorAll('[data-option]'));
        options.forEach((btn) => {
          btn.addEventListener('click', () => {
            const correct = btn.getAttribute('data-correct') === 'true';
            options.forEach((b) => b.classList.remove('is-selected'));
            btn.classList.add('is-selected');
            setFeedback(correct ? 'Correct.' : 'Not quite — try again.');
          });
        });
      }

      if (type === 'text-check') {
        const input = exerciseEl.querySelector('input, textarea');
        const checkBtn = exerciseEl.querySelector('[data-check]');
        const answersAttr = exerciseEl.getAttribute('data-answers') || '';
        const answers = answersAttr
          .split('|')
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean);

        if (checkBtn && input) {
          checkBtn.addEventListener('click', () => {
            const val = String(input.value || '').trim().toLowerCase();
            if (!val) {
              setFeedback('Type an answer first.');
              return;
            }
            const ok = answers.includes(val);
            setFeedback(ok ? 'Correct.' : 'Close — try again.');
          });
        }
      }

      if (type === 'tokenize') {
        const input = exerciseEl.querySelector('input, textarea');
        const out = exerciseEl.querySelector('[data-tokenize-output]');
        const btn = exerciseEl.querySelector('[data-tokenize]');
        if (btn && input && out) {
          btn.addEventListener('click', () => {
            const text = String(input.value || '');
            // simple demo tokenizer: words + punctuation
            const tokens = text
              .match(/[A-Za-z0-9]+|[^\sA-Za-z0-9]/g) || [];
            out.textContent = tokens.join(' · ');
            setFeedback('Tokens: ' + tokens.length);
          });
        }
      }
    });

    buildIndicator();

    // Initial selection
    const loaded = loadFromHash();
    if (!loaded) {
      setActive(0, { updateHash: true });
    } else {
      // Ensure indicator state matches
      setActive(currentIndex, { updateHash: false });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const deckEl = document.querySelector('[data-deck]');
    if (deckEl) initDeck(deckEl);
  });
})();
