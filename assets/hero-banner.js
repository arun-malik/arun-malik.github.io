// Hero Banner - theme-aware, consistent placement
(function() {
  'use strict';
  function run() {
    var ogImage = document.querySelector('meta[property="og:image"]');
    if (!ogImage) return;
    var imageUrl = ogImage.getAttribute('content');
    if (!imageUrl || imageUrl.includes('og-default')) return;
    var displayUrl = imageUrl.replace('.png', '.svg');

    var style = document.createElement('style');
    style.textContent = [
      '.post-hero-banner{display:block;width:100%;max-width:900px;height:240px;margin:1.5rem auto;border-radius:12px;background:url(' + displayUrl + ') center/cover no-repeat;opacity:0.95}',
      // Light mode: add shadow and border to frame the dark image
      ':root:not([data-theme="dark"]) .post-hero-banner{box-shadow:0 2px 16px rgba(0,0,0,0.12);border:1px solid #e5e7eb}',
      // Dark mode: seamless blend
      '[data-theme="dark"] .post-hero-banner{box-shadow:none;border:1px solid #1e293b}',
      '@media(max-width:640px){.post-hero-banner{height:160px;border-radius:0;margin:0 auto 1.5rem}}'
    ].join('');
    document.head.appendChild(style);

    var hero = document.createElement('div');
    hero.className = 'post-hero-banner';

    var nav = document.querySelector('nav');
    if (nav) {
      var wrapper = nav.parentElement;
      if (wrapper && wrapper.tagName === 'HEADER') {
        wrapper.insertAdjacentElement('afterend', hero);
      } else {
        nav.insertAdjacentElement('afterend', hero);
      }
    } else {
      document.body.insertAdjacentElement('afterbegin', hero);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else { run(); }
})();