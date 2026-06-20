// Article Enhancements: Reading Progress + Table of Contents + Back to Top
// Include in any article/post page for enhanced reader experience.

(function() {
  'use strict';

  // Only run on pages with article content
  const article = document.querySelector('.article-content') || document.querySelector('article');
  if (!article) return;

  // --- Reading Progress Bar ---
  function createProgressBar() {
    const bar = document.createElement('div');
    bar.id = 'reading-progress';
    bar.innerHTML = '<div id="reading-progress-fill"></div>';
    document.body.prepend(bar);

    function updateProgress() {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const progress = docHeight > 0 ? (scrolled / docHeight) * 100 : 0;
      document.getElementById('reading-progress-fill').style.width = progress + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // --- Table of Contents ---
  function createTOC() {
    const headings = article.querySelectorAll('h2');
    if (headings.length < 3) return; // Only show TOC for posts with 3+ sections

    const tocContainer = document.getElementById('article-toc');
    if (!tocContainer) return;

    let html = '<details class="article-toc-details" open>';
    html += '<summary>Table of Contents</summary>';
    html += '<nav class="article-toc-nav"><ol>';

    headings.forEach((h, i) => {
      const id = h.id || 'section-' + i;
      h.id = id;
      html += `<li><a href="#${id}">${h.textContent}</a></li>`;
    });

    html += '</ol></nav></details>';
    tocContainer.innerHTML = html;
  }

  // --- Back to Top Button ---
  function createBackToTop() {
    const btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.innerHTML = '&uarr;';
    btn.title = 'Back to top';
    document.body.appendChild(btn);

    function toggleVisibility() {
      btn.classList.toggle('visible', window.scrollY > 500);
    }

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    toggleVisibility();
  }

  // --- Inject Styles ---
  function injectStyles() {
    if (document.getElementById('article-enhance-styles')) return;
    const style = document.createElement('style');
    style.id = 'article-enhance-styles';
    style.textContent = `
      #reading-progress {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: transparent;
        z-index: 9999;
      }
      #reading-progress-fill {
        height: 100%;
        width: 0%;
        background: var(--accent, #2563eb);
        transition: width 0.1s linear;
      }
      .article-toc-details {
        background: var(--bg-secondary, #f9fafb);
        border: 1px solid var(--border, #e5e7eb);
        border-radius: 8px;
        padding: 1rem 1.25rem;
        margin-bottom: 2rem;
      }
      .article-toc-details summary {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--text, #111827);
        cursor: pointer;
        user-select: none;
      }
      .article-toc-details summary:hover { color: var(--accent, #2563eb); }
      .article-toc-nav ol {
        margin: 0.75rem 0 0 1.25rem;
        padding: 0;
        list-style: decimal;
      }
      .article-toc-nav li {
        margin-bottom: 0.375rem;
        font-size: 0.875rem;
        line-height: 1.5;
      }
      .article-toc-nav a {
        color: var(--text-secondary, #6b7280);
        text-decoration: none;
      }
      .article-toc-nav a:hover { color: var(--accent, #2563eb); }
      #back-to-top {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--accent, #2563eb);
        color: #fff;
        border: none;
        font-size: 1.25rem;
        cursor: pointer;
        opacity: 0;
        transform: translateY(10px);
        transition: opacity 0.3s, transform 0.3s;
        z-index: 1000;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      }
      #back-to-top.visible {
        opacity: 1;
        transform: translateY(0);
      }
      #back-to-top:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      }
    `;
    document.head.appendChild(style);
  }

  // Initialize
  function init() {
    injectStyles();
    createProgressBar();
    createTOC();
    createBackToTop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
