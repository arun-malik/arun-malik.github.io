// Hero Banner - consistent placement on ALL pages
// Rule: Always insert after the first <nav> element (the site navigation)
// Every page has a top nav as its first <nav> element.

(function() {
  'use strict';

  function run() {
    var ogImage = document.querySelector('meta[property="og:image"]');
    if (!ogImage) return;
    var imageUrl = ogImage.getAttribute('content');
    if (!imageUrl || imageUrl.includes('og-default')) return;

    // Use SVG for on-page rendering (better quality), OG tag has PNG for social cards
    var displayUrl = imageUrl.replace('.png', '.svg');

    // Inject styles
    var style = document.createElement('style');
    style.textContent = '.post-hero-banner{display:block;width:100%;max-width:900px;height:180px;margin:1.5rem auto;border-radius:10px;background:url(' + displayUrl + ') center/cover no-repeat;opacity:0.9}@media(max-width:640px){.post-hero-banner{height:120px;border-radius:0;margin:0 auto 1.5rem}}';
    document.head.appendChild(style);

    // Create banner
    var hero = document.createElement('div');
    hero.className = 'post-hero-banner';

    // Find the first nav element - this is ALWAYS the site nav bar
    var nav = document.querySelector('nav');

    if (nav) {
      // If nav is inside a <header> wrapper, insert after the header
      var wrapper = nav.parentElement;
      if (wrapper && wrapper.tagName === 'HEADER') {
        wrapper.insertAdjacentElement('afterend', hero);
      } else {
        nav.insertAdjacentElement('afterend', hero);
      }
    } else {
      // No nav exists (some paper pages) - insert at top of body
      document.body.insertAdjacentElement('afterbegin', hero);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();