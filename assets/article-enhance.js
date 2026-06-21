// Article Enhancements: Reading Progress + Table of Contents + Back to Top
// Include in any article/post page for enhanced reader experience.

(function() {
  'use strict';

  // Only run on pages with article content
  const article = document.querySelector('.article-content') || document.querySelector('article') || document.querySelector('body');
  if (!article) return;

  // Determine if this is a content page (has headings indicating long-form content)
  const hasContent = article.querySelectorAll('h2').length >= 2;

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

    let html = '<details class="article-toc-details">';
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
      /* Code block copy button */
      .code-wrapper {
        position: relative;
      }
      .code-copy-btn {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: var(--bg, #fff);
        border: 1px solid var(--border, #e5e7eb);
        border-radius: 4px;
        padding: 0.25rem 0.5rem;
        font-size: 0.7rem;
        font-family: var(--font, sans-serif);
        color: var(--text-secondary, #6b7280);
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s;
      }
      .code-wrapper:hover .code-copy-btn { opacity: 1; }
      .code-copy-btn:hover { color: var(--accent, #2563eb); border-color: var(--accent, #2563eb); }
      .code-copy-btn.copied { color: #059669; border-color: #059669; }
      /* Figure captions */
      .article-content figure {
        margin: 1.5rem 0;
      }
      .article-content figcaption,
      .article-content .figure-caption {
        font-size: 0.8125rem;
        color: var(--text-secondary, #6b7280);
        font-style: italic;
        margin-top: 0.5rem;
        text-align: center;
      }
      /* Listen button */
      .listen-container {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 2rem;
        flex-wrap: wrap;
      }
      .listen-btn {
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
      .listen-btn:hover {
        border-color: var(--accent, #2563eb);
        color: var(--accent, #2563eb);
      }
      .listen-btn svg { flex-shrink: 0; }
      /* Collapsible references */
      .references-collapsible {
        margin-top: 2rem;
        border: 1px solid var(--border, #e5e7eb);
        border-radius: 8px;
        padding: 0.75rem 1rem;
      }
      .references-collapsible summary {
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--text, #111827);
        cursor: pointer;
        user-select: none;
      }
      .references-collapsible summary:hover { color: var(--accent, #2563eb); }
      /* Footnote tooltips */
      .footnote-tooltip {
        display: none;
        position: absolute;
        bottom: calc(100% + 8px);
        left: 50%;
        transform: translateX(-50%);
        background: var(--bg-secondary, #1e293b);
        color: var(--text, #f1f5f9);
        border: 1px solid var(--border, #334155);
        border-radius: 8px;
        padding: 0.6rem 0.8rem;
        font-size: 0.75rem;
        line-height: 1.4;
        width: 300px;
        max-width: 90vw;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 1000;
        pointer-events: none;
        font-weight: normal;
        font-style: normal;
        text-align: left;
      }
      sup:hover .footnote-tooltip,
      .footnote-ref:hover .footnote-tooltip { display: block; }
      /* Link preview tooltip */
      .link-preview-tooltip {
        display: none;
        position: absolute;
        bottom: calc(100% + 8px);
        left: 0;
        background: var(--bg, #fff);
        border: 1px solid var(--border, #e5e7eb);
        border-radius: 8px;
        padding: 0.75rem 1rem;
        font-size: 0.8rem;
        line-height: 1.4;
        width: 280px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        z-index: 1000;
        pointer-events: none;
        color: var(--text, #111827);
        font-weight: normal;
      }
      a:hover .link-preview-tooltip { display: block; }
    `;
    document.head.appendChild(style);
  }

  // --- Code Copy Buttons ---
  function addCopyButtons() {
    const codeBlocks = article.querySelectorAll('pre');
    codeBlocks.forEach(pre => {
      const wrapper = document.createElement('div');
      wrapper.className = 'code-wrapper';
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      const btn = document.createElement('button');
      btn.className = 'code-copy-btn';
      btn.textContent = 'Copy';
      btn.addEventListener('click', () => {
        const code = pre.querySelector('code') || pre;
        navigator.clipboard.writeText(code.textContent).then(() => {
          btn.textContent = 'Copied!';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.textContent = 'Copy';
            btn.classList.remove('copied');
          }, 2000);
        });
      });
      wrapper.appendChild(btn);
    });
  }

  // --- Syntax Highlighting (lightweight, using highlight.js CDN) ---
  function loadHighlightJS() {
    const codeBlocks = article.querySelectorAll('pre code');
    if (codeBlocks.length === 0) return;

    // Load highlight.js CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    link.href = isDark
      ? 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css'
      : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css';
    link.id = 'hljs-theme';
    document.head.appendChild(link);

    // Load highlight.js script
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js';
    script.onload = () => {
      codeBlocks.forEach(block => hljs.highlightElement(block));
    };
    document.head.appendChild(script);

    // Switch theme on dark mode toggle
    const observer = new MutationObserver(() => {
      const theme = document.getElementById('hljs-theme');
      if (theme) {
        const dark = document.documentElement.getAttribute('data-theme') === 'dark';
        theme.href = dark
          ? 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css'
          : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css';
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  // --- Listen to Article (Text-to-Speech) ---
  function createListenButton() {
    if (!('speechSynthesis' in window)) return;

    const meta = document.querySelector('.post-hero-banner') || document.querySelector('.article-meta') || document.querySelector('.authors') || document.querySelector('.blog-header') || document.querySelector('h1');
    if (!meta) return;

    const container = document.createElement('div');
    container.className = 'listen-container';
    container.innerHTML = `
      <button class="listen-btn" id="listenBtn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
        <span>Listen to this article</span>
      </button>
      <button class="listen-btn listen-pause" id="listenPause" style="display:none">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
        <span>Pause</span>
      </button>
      <button class="listen-btn listen-stop" id="listenStop" style="display:none">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>
        <span>Stop</span>
      </button>
    `;
    meta.after(container);

    const btnListen = document.getElementById('listenBtn');
    const btnPause = document.getElementById('listenPause');
    const btnStop = document.getElementById('listenStop');
    let utterance = null;

    function getArticleText() {
      const content = document.querySelector('.article-content') || article;
      // Get text, skip code blocks and reference lists for cleaner audio
      const clone = content.cloneNode(true);
      clone.querySelectorAll('pre, code, .references, .ref-list, table, .blog-nav, .blog-footer, nav, header, footer, script, style').forEach(el => el.remove());
      return clone.textContent.replace(/\s+/g, ' ').trim();
    }

    function startSpeaking() {
      const text = getArticleText();
      utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Try to pick a good English voice
      const voices = speechSynthesis.getVoices();
      const preferred = voices.find(v => v.name.includes('Microsoft') && v.lang.startsWith('en')) ||
                        voices.find(v => v.lang.startsWith('en-') && v.localService) ||
                        voices.find(v => v.lang.startsWith('en'));
      if (preferred) utterance.voice = preferred;

      utterance.onend = () => showPlayState();
      utterance.onerror = () => showPlayState();

      speechSynthesis.speak(utterance);
      showSpeakingState();
    }

    function showPlayState() {
      btnListen.style.display = '';
      btnPause.style.display = 'none';
      btnStop.style.display = 'none';
    }

    function showSpeakingState() {
      btnListen.style.display = 'none';
      btnPause.style.display = '';
      btnPause.querySelector('span').textContent = 'Pause';
      btnStop.style.display = '';
    }

    btnListen.addEventListener('click', () => {
      speechSynthesis.cancel();
      startSpeaking();
    });

    btnPause.addEventListener('click', () => {
      if (speechSynthesis.paused) {
        speechSynthesis.resume();
        btnPause.querySelector('span').textContent = 'Pause';
      } else {
        speechSynthesis.pause();
        btnPause.querySelector('span').textContent = 'Resume';
      }
    });

    btnStop.addEventListener('click', () => {
      speechSynthesis.cancel();
      showPlayState();
    });
  }

  // --- Collapsible References ---
  function makeReferencesCollapsible() {
    // Search the whole document (references may be outside article element)
    var refContainers = document.querySelectorAll('.references, .ref-list');
    refContainers.forEach(function(sec) {
      if (sec.closest('details')) return;
      var items = sec.querySelectorAll('li');
      var count = items.length || '...';
      
      var details = document.createElement('details');
      details.className = 'references-collapsible';
      var summary = document.createElement('summary');
      summary.textContent = 'References (' + count + ')';
      details.appendChild(summary);
      sec.parentNode.insertBefore(details, sec);
      var innerH2 = sec.querySelector('h2');
      if (innerH2) innerH2.remove();
      details.appendChild(sec);
      sec.style.marginTop = '0.75rem';
    });

    if (refContainers.length === 0) {
      var headings = document.querySelectorAll('h2');
      headings.forEach(function(h) {
        if (!/^references$/i.test(h.textContent.trim())) return;
        var elements = [];
        var sibling = h.nextElementSibling;
        while (sibling && sibling.tagName !== 'H2') {
          elements.push(sibling);
          sibling = sibling.nextElementSibling;
        }
        if (elements.length === 0) return;

        var details = document.createElement('details');
        details.className = 'references-collapsible';
        var summary = document.createElement('summary');
        summary.textContent = 'References';
        details.appendChild(summary);
        h.replaceWith(details);
        elements.forEach(function(el) { details.appendChild(el); });
      });
    }
  }

  // --- Footnote Popovers ---
  function createFootnotePopovers() {
    // Find superscript references like [1], [2], <sup>[1]</sup> etc.
    var sups = article.querySelectorAll('sup');
    var refItems = article.querySelectorAll('.ref-list li, .references li, ol.references li');

    sups.forEach(function(sup) {
      var text = sup.textContent.trim();
      var match = text.match(/\[?(\d+)\]?/);
      if (!match) return;

      var refNum = parseInt(match[1], 10);
      var refEl = refItems[refNum - 1];
      if (!refEl) return;

      var refText = refEl.textContent.trim().substring(0, 200);
      sup.style.cursor = 'pointer';
      sup.style.position = 'relative';
      sup.setAttribute('data-ref', refText);

      // Create tooltip
      var tooltip = document.createElement('span');
      tooltip.className = 'footnote-tooltip';
      tooltip.textContent = refText;
      sup.appendChild(tooltip);
    });

    // Also handle inline [1] style references
    var walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT, null, false);
    var textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    textNodes.forEach(function(node) {
      if (node.parentElement.closest('pre, code, .footnote-tooltip, sup, a')) return;
      var text = node.textContent;
      if (!/\[\d+\]/.test(text)) return;

      var span = document.createElement('span');
      span.innerHTML = text.replace(/\[(\d+)\]/g, function(match, num) {
        var idx = parseInt(num, 10) - 1;
        var refEl = refItems[idx];
        var refText = refEl ? refEl.textContent.trim().substring(0, 200) : '';
        if (!refText) return match;
        return '<sup class="footnote-ref" style="cursor:pointer;position:relative;color:var(--accent,#2563eb)">' + match + '<span class="footnote-tooltip">' + refText + '</span></sup>';
      });
      node.parentNode.replaceChild(span, node);
    });
  }

  // --- Link Previews (internal links) ---
  function createLinkPreviews() {
    if (typeof SERIES_DATA === 'undefined' && typeof STANDALONE_POSTS === 'undefined') return;

    var allPosts = [];
    if (typeof SERIES_DATA !== 'undefined') {
      SERIES_DATA.forEach(function(s) {
        s.posts.forEach(function(p) { allPosts.push(p); });
      });
    }
    if (typeof STANDALONE_POSTS !== 'undefined') {
      STANDALONE_POSTS.forEach(function(p) { allPosts.push(p); });
    }

    var links = article.querySelectorAll('a[href^="/"]');
    links.forEach(function(link) {
      var href = link.getAttribute('href');
      var post = allPosts.find(function(p) { return p.url === href; });
      if (!post) return;

      link.style.position = 'relative';
      var preview = document.createElement('span');
      preview.className = 'link-preview-tooltip';
      preview.innerHTML = '<strong>' + post.title + '</strong><br><span style="opacity:0.7">' + (post.excerpt || '').substring(0, 120) + '</span>';
      link.appendChild(preview);
    });
  }

  // Initialize
  function init() {
    if (!hasContent) return;
    injectStyles();
    createProgressBar();
    createTOC();
    createBackToTop();
    addCopyButtons();
    loadHighlightJS();
    makeReferencesCollapsible();
    createFootnotePopovers();
    createLinkPreviews();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
