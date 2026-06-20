// Site Search - Lightweight client-side search
// Indexes titles, excerpts, and tags from series-data.js
// Usage: Include after series-data.js. Adds search icon to nav.

(function() {
  'use strict';

  // Build search index from available data
  function buildIndex() {
    const items = [];

    if (typeof SERIES_DATA !== 'undefined') {
      SERIES_DATA.forEach(series => {
        // Add series landing page
        items.push({
          title: series.title,
          excerpt: series.description,
          url: '/series/' + series.id + '/',
          tags: series.tags || [],
          type: 'series'
        });
        // Add published posts
        series.posts.filter(p => p.published).forEach(post => {
          items.push({
            title: post.title,
            excerpt: post.excerpt,
            url: post.url,
            tags: post.tags || [],
            type: 'post'
          });
        });
      });
    }

    if (typeof STANDALONE_POSTS !== 'undefined') {
      STANDALONE_POSTS.forEach(post => {
        items.push({
          title: post.title,
          excerpt: post.excerpt,
          url: post.url,
          tags: post.tags || [],
          type: 'post'
        });
      });
    }

    return items;
  }

  // Search function
  function search(query, index) {
    if (!query || query.length < 2) return [];
    const terms = query.toLowerCase().split(/\s+/);
    return index
      .map(item => {
        const text = (item.title + ' ' + item.excerpt + ' ' + item.tags.join(' ')).toLowerCase();
        const score = terms.reduce((s, term) => s + (text.includes(term) ? 1 : 0), 0);
        return { ...item, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }

  // Create search UI
  function createSearchUI() {
    // Add search button to nav
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    const searchBtn = document.createElement('button');
    searchBtn.className = 'search-btn';
    searchBtn.title = 'Search';
    searchBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
    navLinks.insertBefore(searchBtn, navLinks.querySelector('.theme-btn'));

    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'search-overlay';
    overlay.innerHTML = `
      <div class="search-modal">
        <input type="text" id="search-input" placeholder="Search posts, series, topics..." autocomplete="off">
        <div id="search-results"></div>
        <div class="search-hint">Press Esc to close</div>
      </div>
    `;
    document.body.appendChild(overlay);

    const input = document.getElementById('search-input');
    const results = document.getElementById('search-results');
    const index = buildIndex();

    // Toggle overlay
    function openSearch() {
      overlay.classList.add('active');
      input.focus();
      input.value = '';
      results.innerHTML = '';
    }
    function closeSearch() {
      overlay.classList.remove('active');
    }

    searchBtn.addEventListener('click', openSearch);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeSearch();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && !overlay.classList.contains('active') && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        openSearch();
      }
      if (e.key === 'Escape') closeSearch();
    });

    // Search on input
    input.addEventListener('input', () => {
      const matches = search(input.value, index);
      if (matches.length === 0 && input.value.length >= 2) {
        results.innerHTML = '<div class="search-empty">No results found</div>';
      } else {
        results.innerHTML = matches.map(m => `
          <a href="${m.url}" class="search-result">
            <span class="search-result-type">${m.type}</span>
            <span class="search-result-title">${m.title}</span>
          </a>
        `).join('');
      }
    });
  }

  // Inject styles
  function injectStyles() {
    if (document.getElementById('search-styles')) return;
    const style = document.createElement('style');
    style.id = 'search-styles';
    style.textContent = `
      .search-btn {
        background: none; border: none; cursor: pointer;
        color: var(--text-secondary, #6b7280); padding: 0.25rem;
        transition: color 0.2s;
      }
      .search-btn:hover { color: var(--text, #111827); }
      #search-overlay {
        position: fixed; inset: 0; z-index: 10000;
        background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
        display: none; align-items: flex-start; justify-content: center;
        padding-top: 15vh;
      }
      #search-overlay.active { display: flex; }
      .search-modal {
        background: var(--bg, #fff); border: 1px solid var(--border, #e5e7eb);
        border-radius: 12px; width: 90%; max-width: 540px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.2); overflow: hidden;
      }
      #search-input {
        width: 100%; padding: 1rem 1.25rem; border: none; outline: none;
        font-size: 1.0625rem; font-family: inherit;
        background: var(--bg, #fff); color: var(--text, #111827);
        border-bottom: 1px solid var(--border, #e5e7eb);
      }
      #search-input::placeholder { color: var(--text-secondary, #6b7280); }
      #search-results { max-height: 50vh; overflow-y: auto; }
      .search-result {
        display: flex; align-items: center; gap: 0.75rem;
        padding: 0.75rem 1.25rem; text-decoration: none;
        transition: background 0.1s;
      }
      .search-result:hover { background: var(--bg-secondary, #f9fafb); }
      .search-result-type {
        font-size: 0.6875rem; font-weight: 600; text-transform: uppercase;
        letter-spacing: 0.04em; color: var(--accent, #2563eb);
        background: color-mix(in srgb, var(--accent, #2563eb) 10%, transparent);
        padding: 0.125rem 0.5rem; border-radius: 3px; white-space: nowrap;
      }
      .search-result-title {
        font-size: 0.9rem; color: var(--text, #111827); font-weight: 500;
      }
      .search-empty {
        padding: 1.5rem 1.25rem; text-align: center;
        color: var(--text-secondary, #6b7280); font-size: 0.9rem;
      }
      .search-hint {
        padding: 0.5rem 1.25rem; font-size: 0.75rem;
        color: var(--text-secondary, #6b7280); text-align: right;
        border-top: 1px solid var(--border, #e5e7eb);
      }
    `;
    document.head.appendChild(style);
  }

  function init() {
    injectStyles();
    createSearchUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
