// Dynamic Header & Footer Component Loader
(function() {
  // GitHub Pages deploy copies `sites/_shared/*` to `/_shared/*`.
  // Always use the deployed absolute path to avoid 404s.
  function getSharedPath() {
    return '/_shared/';
  }

  // Load header
  async function loadHeader() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (!headerPlaceholder) return;

    try {
      const sharedPath = getSharedPath();
      const response = await fetch(sharedPath + 'header.html');
      if (!response.ok) throw new Error(`Header fetch failed: ${response.status}`);
      let html = await response.text();
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
      if (!response.ok) throw new Error(`Footer fetch failed: ${response.status}`);
      let html = await response.text();
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
