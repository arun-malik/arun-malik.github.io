// Action Bar - Unified component for all page-level UI elements
// Handles: Breadcrumbs, Reading Time, Listen, Share
// Consistent placement on ALL pages.

(function() {
  'use strict';

  function init() {
    setTimeout(createComponents, 150);
  }

  function createComponents() {
    if (document.querySelector('.page-toolbar')) return;

    var pageTitle = document.title.replace(' - Arun Malik', '');
    var pageUrl = window.location.href;
    var path = window.location.pathname;
    var hasContent = document.querySelectorAll('h2').length >= 2;
    if (!hasContent) return;

    // Inject styles
    var style = document.createElement('style');
    style.textContent = [
      '.page-toolbar{max-width:900px;margin:0 auto;padding:0 1.5rem}',
      '.breadcrumb-bar{display:flex;align-items:center;gap:0.5rem;margin-bottom:1rem;font-size:0.8125rem;font-family:-apple-system,sans-serif;color:var(--text-secondary,#6b7280)}',
      '.breadcrumb-bar a{color:var(--text-secondary,#6b7280);text-decoration:none}',
      '.breadcrumb-bar a:hover{color:var(--accent,#2563eb)}',
      '.breadcrumb-bar .sep{opacity:0.5}',
      '.action-row{display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;margin-bottom:1.5rem}',
      '.action-row .ab-btn{display:inline-flex;align-items:center;gap:0.4rem;background:var(--bg-secondary,#f9fafb);border:1px solid var(--border,#e5e7eb);border-radius:6px;padding:0.5rem 0.875rem;font-size:0.8125rem;font-weight:500;font-family:-apple-system,sans-serif;color:var(--text-secondary,#6b7280);cursor:pointer;transition:border-color .2s,color .2s;text-decoration:none}',
      '.action-row .ab-btn:hover{border-color:var(--accent,#2563eb);color:var(--accent,#2563eb)}',
      '.reading-badge{font-size:0.75rem;color:var(--text-secondary,#6b7280);font-family:var(--font-mono,"SF Mono",monospace);padding:0.3rem 0.7rem;background:var(--bg-secondary,#f9fafb);border:1px solid var(--border,#e5e7eb);border-radius:20px}',
      '.share-popup{display:none;position:absolute;top:calc(100% + .5rem);left:0;background:var(--bg,#fff);border:1px solid var(--border,#e5e7eb);border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);min-width:160px;z-index:100;overflow:hidden}',
      '.share-popup.open{display:block}',
      '.share-popup a{display:flex;align-items:center;gap:.6rem;padding:.625rem 1rem;font-size:.8125rem;color:var(--text,#111827);text-decoration:none;cursor:pointer;transition:background .1s;font-family:-apple-system,sans-serif}',
      '.share-popup a:hover{background:var(--bg-secondary,#f9fafb)}',
      // Hide old meta/date/time elements immediately to prevent flash
      '.blog-meta{display:none!important}',
      '.article-meta .article-date{display:none!important}',
      '.article-meta .reading-time{display:none!important}'
    ].join('');
    document.head.appendChild(style);

    // Container
    var toolbar = document.createElement('div');
    toolbar.className = 'page-toolbar';

    // 1. BREADCRUMBS
    var crumbs = buildBreadcrumbs(path, pageTitle);
    if (crumbs) {
      toolbar.appendChild(crumbs);
    }

    // 2. ACTION ROW (Listen + Share + Reading Time)
    var row = document.createElement('div');
    row.className = 'action-row';

    // Listen button
    if ('speechSynthesis' in window) {
      var listenBtn = createButton('listen', '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg> Listen');
      var pauseBtn = createButton('pause', '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Pause');
      var stopBtn = createButton('stop', '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg> Stop');
      pauseBtn.style.display = 'none';
      stopBtn.style.display = 'none';
      row.appendChild(listenBtn);
      row.appendChild(pauseBtn);
      row.appendChild(stopBtn);
      setupListen(listenBtn, pauseBtn, stopBtn);
    }

    // Share button
    var shareWrap = document.createElement('span');
    shareWrap.style.cssText = 'position:relative;display:inline-block';
    var shareBtn = createButton('share', '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> Share');
    var popup = document.createElement('div');
    popup.className = 'share-popup';
    popup.innerHTML = '<a class="copy-link" href="#">Copy link</a>' +
      '<a href="https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(pageUrl) + '" target="_blank">LinkedIn</a>' +
      '<a href="https://twitter.com/intent/tweet?url=' + encodeURIComponent(pageUrl) + '&text=' + encodeURIComponent(pageTitle) + '" target="_blank">X / Twitter</a>' +
      '<a href="https://wa.me/?text=' + encodeURIComponent(pageTitle + ' ' + pageUrl) + '" target="_blank">WhatsApp</a>' +
      '<a href="mailto:?subject=' + encodeURIComponent(pageTitle) + '&body=' + encodeURIComponent('Check this out: ' + pageUrl) + '">Email</a>';
    shareWrap.appendChild(shareBtn);
    shareWrap.appendChild(popup);
    row.appendChild(shareWrap);
    setupShare(shareBtn, popup, shareWrap, pageTitle, pageUrl);

    // Date published pill - find date by looking for year pattern in meta elements
    var dateText = findDate();
    if (dateText) {
      var dateBadge = document.createElement('span');
      dateBadge.className = 'reading-badge';
      dateBadge.textContent = dateText;
      row.appendChild(dateBadge);
    }

    // Reading time pill (always show, calculated fresh)
    var minutes = calcReadingTime();
    if (minutes) {
      var badge = document.createElement('span');
      badge.className = 'reading-badge';
      badge.textContent = minutes + ' min read';
      row.appendChild(badge);
    }

    // Hide old reading time / date / meta elements in page content
    document.querySelectorAll('.blog-meta, .article-meta .article-date, .article-meta .reading-time').forEach(function(el) {
      el.style.display = 'none';
    });

    toolbar.appendChild(row);

    // Insert after hero banner
    var hero = document.querySelector('.post-hero-banner');
    if (hero) {
      hero.insertAdjacentElement('afterend', toolbar);
    } else {
      var nav = document.querySelector('header') || document.querySelector('nav');
      if (nav) {
        var wrapper = nav.closest('header') || nav;
        wrapper.insertAdjacentElement('afterend', toolbar);
      }
    }

    // Remove old elements
    document.querySelectorAll('.listen-container, .share-widget, .action-bar').forEach(function(el) { el.remove(); });
  }

  function createButton(id, html) {
    var btn = document.createElement('button');
    btn.className = 'ab-btn';
    btn.setAttribute('data-action', id);
    btn.innerHTML = html;
    return btn;
  }

  function buildBreadcrumbs(path, title) {
    var parts = path.replace(/\/$/, '').split('/').filter(Boolean);
    if (parts.length < 2) return null;

    var bar = document.createElement('nav');
    bar.className = 'breadcrumb-bar';
    bar.setAttribute('aria-label', 'Breadcrumb');

    var links = [{ label: 'Home', href: '/' }];
    if (parts[0] === 'posts') {
      links.push({ label: 'Writing', href: '/posts/' });
    } else if (parts[0] === 'series') {
      links.push({ label: 'Series', href: '/series/' });
      if (parts.length > 2) {
        var seriesName = parts[1].replace(/-/g, ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); });
        links.push({ label: seriesName, href: '/series/' + parts[1] + '/' });
      }
    } else if (parts[0] === 'about') {
      links.push({ label: 'About', href: '/about/' });
    }

    links.forEach(function(link, i) {
      if (i > 0) {
        var sep = document.createElement('span');
        sep.className = 'sep';
        sep.textContent = '/';
        bar.appendChild(sep);
      }
      var a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.label;
      bar.appendChild(a);
    });

    return bar;
  }

  function calcReadingTime() {
    var content = document.querySelector('.article-content') || document.querySelector('article') || document.body;
    var clone = content.cloneNode(true);
    clone.querySelectorAll('pre, code, script, style, nav, header, footer, .action-row, .page-toolbar, .post-hero-banner, .breadcrumb-bar').forEach(function(el) { el.remove(); });
    var words = clone.textContent.replace(/\s+/g, ' ').trim().split(' ').length;
    return Math.max(1, Math.round(words / 200));
  }

  function findDate() {
    // Try explicit date elements first
    var dateEl = document.querySelector('.article-date, .post-date');
    if (dateEl) return dateEl.textContent.trim();

    // Search through blog-meta spans for one containing a year
    var metaSpans = document.querySelectorAll('.blog-meta span');
    for (var i = 0; i < metaSpans.length; i++) {
      var text = metaSpans[i].textContent.trim();
      if (/\b20\d{2}\b/.test(text) && !/min\s*read/i.test(text)) {
        return text;
      }
    }

    // Search through any element with "Preprint" or date-like text
    var candidates = document.querySelectorAll('.conference, [style*="text-align:center"]');
    for (var i = 0; i < candidates.length; i++) {
      var text = candidates[i].textContent;
      var match = text.match(/((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+20\d{2})/);
      if (match) return match[1];
      match = text.match(/(20\d{2}-\d{2}-\d{2})/);
      if (match) return match[1];
    }

    // Try meta tag
    var pubTime = document.querySelector('meta[property="article:published_time"]');
    if (pubTime) return pubTime.content.split('T')[0];

    return null;
  }

  function setupListen(listenBtn, pauseBtn, stopBtn) {
    listenBtn.addEventListener('click', function() {
      speechSynthesis.cancel();
      var content = document.querySelector('.article-content') || document.querySelector('article') || document.body;
      var clone = content.cloneNode(true);
      clone.querySelectorAll('pre, code, .references, .ref-list, table, nav, header, footer, script, style, .page-toolbar, .breadcrumb-bar').forEach(function(el) { el.remove(); });
      var text = clone.textContent.replace(/\s+/g, ' ').trim();
      var utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      var voices = speechSynthesis.getVoices();
      var pref = voices.find(function(v) { return v.name.indexOf('Microsoft') >= 0 && v.lang.indexOf('en') === 0; }) || voices.find(function(v) { return v.lang.indexOf('en-') === 0; });
      if (pref) utterance.voice = pref;
      utterance.onend = function() { showPlay(); };
      speechSynthesis.speak(utterance);
      listenBtn.style.display = 'none';
      pauseBtn.style.display = '';
      stopBtn.style.display = '';
    });
    pauseBtn.addEventListener('click', function() {
      if (speechSynthesis.paused) { speechSynthesis.resume(); pauseBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Pause'; }
      else { speechSynthesis.pause(); pauseBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg> Resume'; }
    });
    stopBtn.addEventListener('click', function() { speechSynthesis.cancel(); showPlay(); });
    function showPlay() { listenBtn.style.display = ''; pauseBtn.style.display = 'none'; stopBtn.style.display = 'none'; }
  }

  function setupShare(btn, popup, wrap, title, url) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
        navigator.share({ title: title, url: url }).catch(function(){});
      } else {
        popup.classList.toggle('open');
      }
    });
    document.addEventListener('click', function(e) {
      if (!wrap.contains(e.target)) popup.classList.remove('open');
    });
    var copyLink = popup.querySelector('.copy-link');
    copyLink.addEventListener('click', function(e) {
      e.preventDefault(); e.stopPropagation();
      navigator.clipboard.writeText(url).then(function() {
        copyLink.textContent = 'Copied!';
        setTimeout(function() { copyLink.textContent = 'Copy link'; }, 2000);
      });
      popup.classList.remove('open');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();