// Series Navigation Component
// Include this script (after series-data.js) in any series post.
// It reads the current URL to determine the series and post index,
// then injects a header banner and footer navigation.

(function() {
  'use strict';

  // Determine current post from URL
  function getCurrentContext() {
    const path = window.location.pathname;
    // Match /series/{seriesId}/{postSlug}/ pattern
    const match = path.match(/\/series\/([^/]+)\/([^/]+)\/?$/);
    if (!match) return null;

    const seriesId = match[1];
    const postSlug = match[2];

    const series = SERIES_DATA.find(s => s.id === seriesId);
    if (!series) return null;

    const postIndex = series.posts.findIndex(p => p.slug === postSlug);
    if (postIndex === -1) return null;

    return { series, postIndex, post: series.posts[postIndex] };
  }

  // Render series header banner
  function renderHeader(ctx) {
    const el = document.getElementById('series-header');
    if (!el) return;

    const { series, postIndex } = ctx;
    const total = series.posts.length;
    const partNum = postIndex + 1;

    el.innerHTML = `
      <div class="series-banner">
        <a href="/series/${series.id}/" class="series-banner-link">
          <span class="series-banner-label">Part ${partNum} of ${total}</span>
          <span class="series-banner-title">${series.title}</span>
        </a>
      </div>
    `;
  }

  // Render series footer with prev/next navigation and TOC
  function renderFooter(ctx) {
    const el = document.getElementById('series-footer');
    if (!el) return;

    const { series, postIndex } = ctx;
    const posts = series.posts;
    const prev = postIndex > 0 ? posts[postIndex - 1] : null;
    const next = postIndex < posts.length - 1 ? posts[postIndex + 1] : null;

    let navHtml = '<div class="series-nav-footer">';

    // Prev/Next links
    navHtml += '<div class="series-prev-next">';
    if (prev && prev.published) {
      navHtml += `<a href="${prev.url}" class="series-nav-link series-prev">
        <span class="series-nav-dir">&larr; Previous</span>
        <span class="series-nav-title">${prev.title}</span>
      </a>`;
    } else {
      navHtml += '<span class="series-nav-link series-prev series-nav-disabled"></span>';
    }
    if (next && next.published) {
      navHtml += `<a href="${next.url}" class="series-nav-link series-next">
        <span class="series-nav-dir">Next &rarr;</span>
        <span class="series-nav-title">${next.title}</span>
      </a>`;
    } else if (next) {
      navHtml += `<span class="series-nav-link series-next series-nav-disabled">
        <span class="series-nav-dir">Next</span>
        <span class="series-nav-title">${next.title} (coming soon)</span>
      </span>`;
    }
    navHtml += '</div>';

    // Collapsible TOC
    navHtml += `
      <details class="series-toc">
        <summary>All posts in this series (${posts.length})</summary>
        <ol class="series-toc-list">
          ${posts.map((p, i) => {
            const isCurrent = i === postIndex;
            const isPublished = p.published;
            if (isCurrent) {
              return `<li class="series-toc-item series-toc-current"><strong>${p.title}</strong> (you are here)</li>`;
            } else if (isPublished) {
              return `<li class="series-toc-item"><a href="${p.url}">${p.title}</a></li>`;
            } else {
              return `<li class="series-toc-item series-toc-upcoming">${p.title} <span class="series-toc-soon">coming soon</span></li>`;
            }
          }).join('')}
        </ol>
      </details>
    `;

    navHtml += '</div>';
    el.innerHTML = navHtml;
  }

  // Inject styles
  function injectStyles() {
    if (document.getElementById('series-nav-styles')) return;
    const style = document.createElement('style');
    style.id = 'series-nav-styles';
    style.textContent = `
      .series-banner {
        background: var(--bg-secondary, #f9fafb);
        border: 1px solid var(--border, #e5e7eb);
        border-radius: 8px;
        padding: 0.875rem 1.25rem;
        margin-bottom: 2rem;
      }
      .series-banner-link {
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .series-banner-link:hover .series-banner-title { color: var(--accent, #2563eb); }
      .series-banner-label {
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--accent, #2563eb);
        background: color-mix(in srgb, var(--accent, #2563eb) 10%, transparent);
        padding: 0.2rem 0.6rem;
        border-radius: 4px;
        white-space: nowrap;
      }
      .series-banner-title {
        font-size: 0.9rem;
        font-weight: 500;
        color: var(--text-secondary, #6b7280);
        transition: color 0.2s;
      }
      .series-nav-footer {
        margin-top: 3rem;
        padding-top: 2rem;
        border-top: 1px solid var(--border, #e5e7eb);
      }
      .series-prev-next {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 2rem;
      }
      .series-nav-link {
        display: flex;
        flex-direction: column;
        padding: 1rem 1.25rem;
        border: 1px solid var(--border, #e5e7eb);
        border-radius: 8px;
        text-decoration: none;
        transition: border-color 0.2s, background 0.2s;
      }
      .series-nav-link:hover {
        border-color: var(--accent, #2563eb);
        background: var(--bg-secondary, #f9fafb);
      }
      .series-nav-link.series-next { text-align: right; }
      .series-nav-link.series-nav-disabled {
        opacity: 0.4;
        pointer-events: none;
      }
      .series-nav-dir {
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: var(--accent, #2563eb);
        margin-bottom: 0.25rem;
      }
      .series-nav-title {
        font-size: 0.9rem;
        color: var(--text, #111827);
        font-weight: 500;
      }
      .series-toc {
        border: 1px solid var(--border, #e5e7eb);
        border-radius: 8px;
        padding: 1rem 1.25rem;
      }
      .series-toc summary {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--text, #111827);
        cursor: pointer;
        user-select: none;
      }
      .series-toc summary:hover { color: var(--accent, #2563eb); }
      .series-toc-list {
        margin-top: 1rem;
        padding-left: 1.5rem;
        list-style: decimal;
      }
      .series-toc-item {
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
        line-height: 1.5;
      }
      .series-toc-item a {
        color: var(--text, #111827);
        text-decoration: none;
      }
      .series-toc-item a:hover { color: var(--accent, #2563eb); }
      .series-toc-current {
        color: var(--accent, #2563eb);
      }
      .series-toc-upcoming {
        color: var(--text-secondary, #6b7280);
      }
      .series-toc-soon {
        font-size: 0.7rem;
        font-style: italic;
        opacity: 0.7;
      }
      @media (max-width: 640px) {
        .series-prev-next { grid-template-columns: 1fr; }
        .series-nav-link.series-next { text-align: left; }
      }
    `;
    document.head.appendChild(style);
  }

  // Initialize
  function init() {
    const ctx = getCurrentContext();
    if (!ctx) return;
    injectStyles();
    renderHeader(ctx);
    renderFooter(ctx);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
