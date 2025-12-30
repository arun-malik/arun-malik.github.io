// Configure analytics IDs here.
//
// Microsoft Clarity (free): https://clarity.microsoft.com/
// - After creating a project, you’ll get a "Clarity Project ID".
//
// Google Analytics 4 (free): https://analytics.google.com/
// - Measurement ID looks like: G-XXXXXXXXXX
//
// You can leave either empty to disable it.
window.__ANALYTICS_CONFIG__ = {
  clarityProjectId: "",
  ga4MeasurementId: "",

  // Optional: enable section engagement tracking.
  // Add `data-track-section="some-name"` to any element you want timed.
  trackSections: true,

  // Optional: treat headings (h2/h3) as sections automatically.
  // This is helpful for article-like pages.
  autoTrackHeadings: false,
};
