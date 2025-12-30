(function () {
  const cfg = window.__ANALYTICS_CONFIG__ || {};

  // Microsoft Clarity loader
  if (cfg.clarityProjectId) {
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r);
      t.async = 1;
      t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", cfg.clarityProjectId);
  }

  // Google Analytics 4 loader (gtag)
  if (cfg.ga4MeasurementId) {
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(cfg.ga4MeasurementId)}`;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    function gtag(){ window.dataLayer.push(arguments); }
    window.gtag = window.gtag || gtag;
    gtag('js', new Date());
    gtag('config', cfg.ga4MeasurementId, {
      // You can tune privacy settings here later if needed.
      anonymize_ip: true,
    });
  }
})();
