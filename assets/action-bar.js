// Action Bar - Consistent Listen + Share placement on ALL pages
// Always renders right after the hero banner.
// Consolidates listen and share into one row.

(function() {
  'use strict';

  function init() {
    // Wait a tick for hero-banner.js to create the banner first
    setTimeout(createActionBar, 100);
  }

  function createActionBar() {
    // Don't create if already exists
    if (document.querySelector('.action-bar')) return;

    var pageTitle = document.title.replace(' - Arun Malik', '');
    var pageUrl = window.location.href;
    var hasContent = document.querySelectorAll('h2').length >= 2;
    if (!hasContent) return;

    // Inject styles
    var style = document.createElement('style');
    style.textContent = '.action-bar{display:flex;gap:0.5rem;flex-wrap:wrap;max-width:900px;margin:0 auto 1.5rem;padding:0 1.5rem}.action-bar .ab-btn{display:inline-flex;align-items:center;gap:0.4rem;background:var(--bg-secondary,#f9fafb);border:1px solid var(--border,#e5e7eb);border-radius:6px;padding:0.5rem 0.875rem;font-size:0.8125rem;font-weight:500;font-family:-apple-system,sans-serif;color:var(--text-secondary,#6b7280);cursor:pointer;transition:border-color .2s,color .2s;text-decoration:none}.action-bar .ab-btn:hover{border-color:var(--accent,#2563eb);color:var(--accent,#2563eb)}.share-popup{display:none;position:absolute;top:calc(100% + .5rem);left:0;background:var(--bg,#fff);border:1px solid var(--border,#e5e7eb);border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);min-width:160px;z-index:100;overflow:hidden}.share-popup.open{display:block}.share-popup a{display:flex;align-items:center;gap:.6rem;padding:.625rem 1rem;font-size:.8125rem;color:var(--text,#111827);text-decoration:none;cursor:pointer;transition:background .1s;font-family:-apple-system,sans-serif}.share-popup a:hover{background:var(--bg-secondary,#f9fafb)}';
    document.head.appendChild(style);

    // Build action bar HTML
    var bar = document.createElement('div');
    bar.className = 'action-bar';

    // Listen button (only if speech synthesis available)
    if ('speechSynthesis' in window) {
      var listenBtn = document.createElement('button');
      listenBtn.className = 'ab-btn';
      listenBtn.id = 'ab-listen';
      listenBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg> Listen to this article';
      bar.appendChild(listenBtn);

      var pauseBtn = document.createElement('button');
      pauseBtn.className = 'ab-btn';
      pauseBtn.id = 'ab-pause';
      pauseBtn.style.display = 'none';
      pauseBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Pause';
      bar.appendChild(pauseBtn);

      var stopBtn = document.createElement('button');
      stopBtn.className = 'ab-btn';
      stopBtn.id = 'ab-stop';
      stopBtn.style.display = 'none';
      stopBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg> Stop';
      bar.appendChild(stopBtn);

      // Listen logic
      listenBtn.addEventListener('click', function() {
        speechSynthesis.cancel();
        var content = document.querySelector('.article-content') || document.querySelector('article') || document.body;
        var clone = content.cloneNode(true);
        clone.querySelectorAll('pre, code, .references, .ref-list, table, nav, header, footer, script, style, .action-bar, .series-banner, .series-nav-footer, .article-toc-details').forEach(function(el) { el.remove(); });
        var text = clone.textContent.replace(/\s+/g, ' ').trim();
        var utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        var voices = speechSynthesis.getVoices();
        var pref = voices.find(function(v) { return v.name.indexOf('Microsoft') >= 0 && v.lang.indexOf('en') === 0; }) ||
                   voices.find(function(v) { return v.lang.indexOf('en-') === 0; });
        if (pref) utterance.voice = pref;
        utterance.onend = function() { showPlay(); };
        speechSynthesis.speak(utterance);
        listenBtn.style.display = 'none';
        pauseBtn.style.display = '';
        stopBtn.style.display = '';
      });

      pauseBtn.addEventListener('click', function() {
        if (speechSynthesis.paused) {
          speechSynthesis.resume();
          pauseBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Pause';
        } else {
          speechSynthesis.pause();
          pauseBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg> Resume';
        }
      });

      stopBtn.addEventListener('click', function() { speechSynthesis.cancel(); showPlay(); });

      function showPlay() {
        listenBtn.style.display = '';
        pauseBtn.style.display = 'none';
        stopBtn.style.display = 'none';
      }
    }

    // Share button
    var shareWrap = document.createElement('span');
    shareWrap.style.position = 'relative';
    shareWrap.style.display = 'inline-block';
    var shareBtn = document.createElement('button');
    shareBtn.className = 'ab-btn';
    shareBtn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> Share';

    var popup = document.createElement('div');
    popup.className = 'share-popup';
    popup.innerHTML = '<a id="ab-copy" href="#">Copy link</a>' +
      '<a href="https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(pageUrl) + '" target="_blank">LinkedIn</a>' +
      '<a href="https://twitter.com/intent/tweet?url=' + encodeURIComponent(pageUrl) + '&text=' + encodeURIComponent(pageTitle) + '" target="_blank">X / Twitter</a>' +
      '<a href="https://wa.me/?text=' + encodeURIComponent(pageTitle + ' ' + pageUrl) + '" target="_blank">WhatsApp</a>' +
      '<a href="mailto:?subject=' + encodeURIComponent(pageTitle) + '&body=' + encodeURIComponent('Check this out: ' + pageUrl) + '">Email</a>';

    shareWrap.appendChild(shareBtn);
    shareWrap.appendChild(popup);
    bar.appendChild(shareWrap);

    shareBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
        navigator.share({ title: pageTitle, url: pageUrl }).catch(function(){});
      } else {
        popup.classList.toggle('open');
      }
    });

    document.addEventListener('click', function(e) {
      if (!shareWrap.contains(e.target)) popup.classList.remove('open');
    });

    var copyLink = popup.querySelector('#ab-copy');
    copyLink.addEventListener('click', function(e) {
      e.preventDefault();
      navigator.clipboard.writeText(pageUrl).then(function() {
        copyLink.textContent = 'Copied!';
        setTimeout(function() { copyLink.textContent = 'Copy link'; }, 2000);
      });
      popup.classList.remove('open');
    });

    // Insert after hero banner, or after first nav/header
    var hero = document.querySelector('.post-hero-banner');
    if (hero) {
      hero.insertAdjacentElement('afterend', bar);
    } else {
      var nav = document.querySelector('header') || document.querySelector('nav');
      if (nav) {
        var wrapper = nav.closest('header') || nav;
        wrapper.insertAdjacentElement('afterend', bar);
      }
    }

    // Remove old listen-container and share-widget elements
    document.querySelectorAll('.listen-container, .share-widget').forEach(function(el) { el.remove(); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
