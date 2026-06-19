// Post Links - Cross-referencing component
// Include after series-data.js in any post (series or standalone).
// Renders: related posts, backlinks, and enriches data-ref links with tooltips.

(function() {
  'use strict';

  // Get the current post slug from URL
  function getCurrentSlug() {
    const path = window.location.pathname.replace(/\/$/, '');
    const segments = path.split('/');
    return segments[segments.length - 1];
  }

  // Enrich inline data-ref links with tooltips
  function enrichRefLinks() {
    const refLinks = document.querySelectorAll('a[data-ref]');
    refLinks.forEach(link => {
      const slug = link.getAttribute('data-ref');
      const post = findPostBySlug(slug);
      if (!post) return;

      // Set href if not already set
      if (!link.getAttribute('href') || link.getAttribute('href') === '#') {
        link.setAttribute('href', post.url);
      }

      // Add tooltip
      link.classList.add('ref-link');
      link.setAttribute('title', post.excerpt || post.title);

      // Create tooltip element
      const tooltip = document.createElement('span');
      tooltip.className = 'ref-tooltip';
      tooltip.innerHTML = `
        <strong>${post.title}</strong>
        ${post.excerpt ? `<br><span class="ref-tooltip-excerpt">${post.excerpt}</span>` : ''}
      `;
      link.style.position = 'relative';
      link.appendChild(tooltip);
    });
  }

  // Render related posts section
  function renderRelatedPosts(slug) {
    const container = document.getElementById('related-posts');
    if (!container) return;

    const related = getRelatedByTags(slug, 4);
    const backlinks = getBacklinks(slug).filter(p => p.published !== false);

    if (related.length === 0 && backlinks.length === 0) return;

    let html = '<div class="post-links-section">';

    if (related.length > 0) {
      html += '<h3 class="post-links-heading">Related Reading</h3>';
      html += '<ul class="post-links-list">';
      related.forEach(p => {
        const seriesLabel = p.seriesTitle ? `<span class="post-links-series">${p.seriesTitle}</span>` : '';
        html += `<li class="post-links-item">
          <a href="${p.url}" class="post-links-link">
            <span class="post-links-title">${p.title}</span>
            ${seriesLabel}
          </a>
        </li>`;
      });
      html += '</ul>';
    }

    if (backlinks.length > 0) {
      html += '<h3 class="post-links-heading">Referenced By</h3>';
      html += '<ul class="post-links-list">';
      backlinks.forEach(p => {
        const seriesLabel = p.seriesTitle ? `<span class="post-links-series">${p.seriesTitle}</span>` : '';
        html += `<li class="post-links-item">
          <a href="${p.url}" class="post-links-link">
            <span class="post-links-title">${p.title}</span>
            ${seriesLabel}
          </a>
        </li>`;
      });
      html += '</ul>';
    }

    html += '</div>';
    container.innerHTML = html;
  }

  // Inject styles
  function injectStyles() {
    if (document.getElementById('post-links-styles')) return;
    const style = document.createElement('style');
    style.id = 'post-links-styles';
    style.textContent = `
      .post-links-section {
        margin-top: 2.5rem;
        padding-top: 2rem;
        border-top: 1px solid var(--border, #e5e7eb);
      }
      .post-links-heading {
        font-size: 0.8125rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--text-secondary, #6b7280);
        margin-bottom: 1rem;
      }
      .post-links-list {
        list-style: none;
        padding: 0;
        margin: 0 0 1.5rem 0;
      }
      .post-links-item {
        margin-bottom: 0.75rem;
      }
      .post-links-link {
        display: flex;
        flex-direction: column;
        text-decoration: none;
        padding: 0.75rem 1rem;
        border: 1px solid var(--border, #e5e7eb);
        border-radius: 6px;
        transition: border-color 0.2s, background 0.2s;
      }
      .post-links-link:hover {
        border-color: var(--accent, #2563eb);
        background: var(--bg-secondary, #f9fafb);
      }
      .post-links-title {
        font-size: 0.9rem;
        font-weight: 500;
        color: var(--text, #111827);
      }
      .post-links-series {
        font-size: 0.75rem;
        color: var(--text-secondary, #6b7280);
        margin-top: 0.25rem;
      }
      /* Ref link tooltips */
      .ref-link {
        color: var(--accent, #2563eb);
        text-decoration: underline;
        text-decoration-style: dotted;
        text-underline-offset: 3px;
      }
      .ref-tooltip {
        display: none;
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: var(--bg-secondary, #1e293b);
        color: var(--text, #f1f5f9);
        border: 1px solid var(--border, #334155);
        border-radius: 8px;
        padding: 0.75rem 1rem;
        font-size: 0.8rem;
        line-height: 1.4;
        width: 280px;
        max-width: 90vw;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        pointer-events: none;
      }
      .ref-link:hover .ref-tooltip { display: block; }
      .ref-tooltip-excerpt {
        color: var(--text-secondary, #94a3b8);
        font-size: 0.75rem;
      }
    `;
    document.head.appendChild(style);
  }

  // Initialize
  function init() {
    const slug = getCurrentSlug();
    if (!slug) return;
    injectStyles();
    enrichRefLinks();
    renderRelatedPosts(slug);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
