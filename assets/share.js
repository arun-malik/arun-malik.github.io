// Share Button Component
// Adds a share button to any page. Uses Web Share API where available,
// falls back to copy-link + social links.

(function() {
  'use strict';

  function createShareButton() {
    // Find insertion point: after .article-meta, .listen-container, .authors, h1, or .bio
    const insertAfter = document.querySelector('.listen-container') ||
                        document.querySelector('.article-meta') ||
                        document.querySelector('.authors') ||
                        document.querySelector('.bio') ||
                        document.querySelector('h1');
    if (!insertAfter) return;

    const pageTitle = document.title.replace(' - Arun Malik', '');
    const pageUrl = window.location.href;

    const container = document.createElement('div');
    container.className = 'share-container';
    container.innerHTML = `
      <button class="share-btn" id="shareBtn">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
        <span>Share</span>
      </button>
      <div class="share-dropdown" id="shareDropdown">
        <a class="share-option" id="shareCopy">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          Copy link
        </a>
        <a class="share-option" href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}" target="_blank" rel="noopener">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M13.6 1H2.4C1.6 1 1 1.6 1 2.4v11.2c0 .8.6 1.4 1.4 1.4h11.2c.8 0 1.4-.6 1.4-1.4V2.4c0-.8-.6-1.4-1.4-1.4zM5.4 13H3.2V6.4h2.2V13zM4.3 5.5c-.7 0-1.3-.6-1.3-1.3s.6-1.3 1.3-1.3 1.3.6 1.3 1.3-.6 1.3-1.3 1.3zM13 13h-2.2V9.8c0-.8 0-1.7-1.1-1.7s-1.2.8-1.2 1.7V13H6.4V6.4h2.1v.9c.3-.6 1-1.1 2.1-1.1 2.2 0 2.6 1.5 2.6 3.4V13z"/></svg>
          LinkedIn
        </a>
        <a class="share-option" href="https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(pageTitle)}" target="_blank" rel="noopener">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          X / Twitter
        </a>
      </div>
    `;

    insertAfter.after(container);

    const btn = document.getElementById('shareBtn');
    const dropdown = document.getElementById('shareDropdown');
    const copyBtn = document.getElementById('shareCopy');

    // Toggle dropdown or use native share
    btn.addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({ title: pageTitle, url: pageUrl }).catch(() => {});
      } else {
        dropdown.classList.toggle('active');
      }
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });

    // Copy link
    copyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(pageUrl).then(() => {
        copyBtn.querySelector('span') || (copyBtn.textContent = '');
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = copyBtn.innerHTML.replace('Copy link', 'Copied!');
        setTimeout(() => { copyBtn.innerHTML = originalText; }, 2000);
      });
      dropdown.classList.remove('active');
    });
  }

  function injectStyles() {
    if (document.getElementById('share-styles')) return;
    const style = document.createElement('style');
    style.id = 'share-styles';
    style.textContent = `
      .share-container {
        position: relative;
        display: inline-block;
        margin-bottom: 1.5rem;
      }
      .share-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        background: var(--bg-secondary, #f9fafb);
        border: 1px solid var(--border, #e5e7eb);
        border-radius: 6px;
        padding: 0.5rem 0.875rem;
        font-size: 0.8125rem;
        font-weight: 500;
        font-family: inherit;
        color: var(--text-secondary, #6b7280);
        cursor: pointer;
        transition: border-color 0.2s, color 0.2s;
      }
      .share-btn:hover {
        border-color: var(--accent, #2563eb);
        color: var(--accent, #2563eb);
      }
      .share-dropdown {
        display: none;
        position: absolute;
        top: calc(100% + 0.5rem);
        left: 0;
        background: var(--bg, #fff);
        border: 1px solid var(--border, #e5e7eb);
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        min-width: 160px;
        z-index: 100;
        overflow: hidden;
      }
      .share-dropdown.active { display: block; }
      .share-option {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        padding: 0.625rem 1rem;
        font-size: 0.8125rem;
        color: var(--text, #111827);
        text-decoration: none;
        cursor: pointer;
        transition: background 0.1s;
      }
      .share-option:hover { background: var(--bg-secondary, #f9fafb); }
      .share-option svg { flex-shrink: 0; color: var(--text-secondary, #6b7280); }
    `;
    document.head.appendChild(style);
  }

  function init() {
    // Only add share to pages with substantial content (2+ headings)
    const headings = document.querySelectorAll('h2');
    if (headings.length < 2) return;
    injectStyles();
    createShareButton();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
