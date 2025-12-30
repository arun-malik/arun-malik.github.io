// Dynamic Header & Footer Component Loader
(function() {
  // Determine the correct path to _shared based on current location
  function getSharedPath() {
    const path = window.location.pathname;
    if (path === '/' || path === '/index.html') {
      return './sites/_shared/';
    }
    // Count depth by slashes to determine relative path
    const depth = (path.match(/\//g) || []).length - 1;
    if (depth === 0) return './sites/_shared/';
    return '../'.repeat(depth) + '_shared/';
  }

  // Fix links in loaded components based on site structure
  function fixComponentLinks(html) {
    const path = window.location.pathname;
    const isRoot = path === '/' || path === '/index.html';
    
    if (isRoot) {
      // Root level: use ./sites/ prefix for sub-sites
      html = html.replace(/href="\/([^"]+)"/g, (match, p1) => {
        if (p1.startsWith('#')) return match;
        return `href="./sites/${p1}"`;
      });
    } else {
      // Sub-sites: use ../ to go back
      html = html.replace(/href="\/"/g, 'href="../"');
      html = html.replace(/href="\/#([^"]+)"/g, 'href="../#$1"');
    }
    
    return html;
  }

  // Load header
  async function loadHeader() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (!headerPlaceholder) return;

    try {
      const sharedPath = getSharedPath();
      const response = await fetch(sharedPath + 'header.html');
      let html = await response.text();
      html = fixComponentLinks(html);
      headerPlaceholder.outerHTML = html;
    } catch (error) {
      console.error('Failed to load header:', error);
    }
  }

  // Load footer
  async function loadFooter() {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (!footerPlaceholder) return;

    try {
      const sharedPath = getSharedPath();
      const response = await fetch(sharedPath + 'footer.html');
      let html = await response.text();
      html = fixComponentLinks(html);
      footerPlaceholder.outerHTML = html;
      
      // Update year after footer is loaded
      const yearSpan = document.querySelector('.footer-year');
      if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
      }
    } catch (error) {
      console.error('Failed to load footer:', error);
    }
  }

  // Initialize components when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
      await Promise.all([loadHeader(), loadFooter()]);
    });
  } else {
    Promise.all([loadHeader(), loadFooter()]);
  }
})();
