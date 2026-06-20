// Share Button Component
// Adds a share button to pages. Uses Web Share API on mobile,
// dropdown with social links on desktop.

(function() {
  'use strict';

  function init() {
    injectStyles();
    createShareButton();
  }

  function createShareButton() {
    var pageTitle = document.title.replace(' - Arun Malik', '');
    var pageUrl = window.location.href;

    // Build the share button HTML
    var shareHTML = '<div class="share-widget">' +
      '<button class="share-btn" type="button">' +
        '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>' +
        ' Share' +
      '</button>' +
      '<div class="share-dropdown">' +
        '<a class="share-option share-copy" href="#">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>' +
          ' Copy link</a>' +
        '<a class="share-option" href="https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(pageUrl) + '" target="_blank" rel="noopener">' +
          '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M13.6 1H2.4C1.6 1 1 1.6 1 2.4v11.2c0 .8.6 1.4 1.4 1.4h11.2c.8 0 1.4-.6 1.4-1.4V2.4c0-.8-.6-1.4-1.4-1.4zM5.4 13H3.2V6.4h2.2V13zM4.3 5.5c-.7 0-1.3-.6-1.3-1.3s.6-1.3 1.3-1.3 1.3.6 1.3 1.3-.6 1.3-1.3 1.3zM13 13h-2.2V9.8c0-.8 0-1.7-1.1-1.7s-1.2.8-1.2 1.7V13H6.4V6.4h2.1v.9c.3-.6 1-1.1 2.1-1.1 2.2 0 2.6 1.5 2.6 3.4V13z"/></svg>' +
          ' LinkedIn</a>' +
        '<a class="share-option" href="https://twitter.com/intent/tweet?url=' + encodeURIComponent(pageUrl) + '&text=' + encodeURIComponent(pageTitle) + '" target="_blank" rel="noopener">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>' +
          ' X / Twitter</a>' +
        '<a class="share-option" href="https://wa.me/?text=' + encodeURIComponent(pageTitle + ' ' + pageUrl) + '" target="_blank" rel="noopener">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>' +
          ' WhatsApp</a>' +
        '<a class="share-option" href="mailto:?subject=' + encodeURIComponent(pageTitle) + '&body=' + encodeURIComponent('Check this out: ' + pageUrl) + '">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' +
          ' Email</a>' +
      '</div>' +
    '</div>';

    // Find where to insert
    var listenContainer = document.querySelector('.listen-container');
    if (listenContainer) {
      listenContainer.insertAdjacentHTML('beforeend', shareHTML);
    } else {
      var target = document.querySelector('.article-meta') ||
                   document.querySelector('.authors') ||
                   document.querySelector('.bio') ||
                   document.querySelector('h1');
      if (!target) return;
      target.insertAdjacentHTML('afterend', '<div class="listen-container">' + shareHTML + '</div>');
    }

    // Event handlers
    var widget = document.querySelector('.share-widget');
    var btn = widget.querySelector('.share-btn');
    var dropdown = widget.querySelector('.share-dropdown');
    var copyLink = widget.querySelector('.share-copy');

    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
        navigator.share({ title: pageTitle, url: pageUrl }).catch(function(){});
      } else {
        dropdown.classList.toggle('active');
      }
    });

    document.addEventListener('click', function(e) {
      if (!widget.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });

    copyLink.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      navigator.clipboard.writeText(pageUrl).then(function() {
        copyLink.textContent = ' Copied!';
        setTimeout(function() { copyLink.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy link'; }, 2000);
      });
      dropdown.classList.remove('active');
    });
  }

  function injectStyles() {
    if (document.getElementById('share-styles')) return;
    var style = document.createElement('style');
    style.id = 'share-styles';
    style.textContent = '.share-widget{position:relative;display:inline-block}.share-btn{display:inline-flex;align-items:center;gap:.4rem;background:var(--bg-secondary,#f9fafb);border:1px solid var(--border,#e5e7eb);border-radius:6px;padding:.5rem .875rem;font-size:.8125rem;font-weight:500;font-family:inherit;color:var(--text-secondary,#6b7280);cursor:pointer;transition:border-color .2s,color .2s}.share-btn:hover{border-color:var(--accent,#2563eb);color:var(--accent,#2563eb)}.share-dropdown{display:none;position:absolute;top:calc(100% + .5rem);left:0;background:var(--bg,#fff);border:1px solid var(--border,#e5e7eb);border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);min-width:160px;z-index:100;overflow:hidden}.share-dropdown.active{display:block}.share-option{display:flex;align-items:center;gap:.6rem;padding:.625rem 1rem;font-size:.8125rem;color:var(--text,#111827);text-decoration:none;cursor:pointer;transition:background .1s}.share-option:hover{background:var(--bg-secondary,#f9fafb)}.share-option svg{flex-shrink:0;color:var(--text-secondary,#6b7280)}';
    document.head.appendChild(style);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();