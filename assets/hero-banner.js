// Hero Header Background
// Adds the post's OG image as a subtle background banner at the top of article pages.
// Reads the og:image meta tag to determine which image to use.

(function() {
  'use strict';

  function init() {
    var ogImage = document.querySelector('meta[property="og:image"]');
    if (!ogImage) return;

    var imageUrl = ogImage.getAttribute('content');
    if (!imageUrl || imageUrl.includes('og-default')) return;

    // Create hero banner
    var hero = document.createElement('div');
    hero.className = 'post-hero-banner';
    hero.style.cssText = 'width:100%;height:200px;background:url(' + imageUrl + ') center/cover no-repeat;margin-bottom:2rem;border-radius:8px;opacity:0.85;';

    // Insert after header or at top of main
    var main = document.querySelector('main');
    var header = document.querySelector('header');
    if (main && main.firstChild) {
      main.insertBefore(hero, main.firstChild);
    } else if (header) {
      header.after(hero);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
