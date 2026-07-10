/*
 * analytics.js - custom Clarity (and GA4) instrumentation.
 *
 * Base page views, heatmaps and recordings come from the inline Clarity + GA4
 * snippets in each page head. This file adds the things those do not capture:
 * per-page context tags, reading depth, outbound clicks, theme changes, and
 * scrollytelling progress. Everything is guarded so it is a no-op if a tracker
 * or a feature is absent on a given page.
 */
(function () {
  "use strict";

  function clarityReady() { return typeof window.clarity === "function"; }
  function gtagReady() { return typeof window.gtag === "function"; }

  // Set a Clarity custom tag (used for filtering/segmenting sessions).
  function tag(key, value) {
    if (value == null || value === "") return;
    if (clarityReady()) { try { window.clarity("set", key, String(value)); } catch (e) {} }
  }

  // Fire a named event to both Clarity and GA4.
  function track(name, params) {
    if (clarityReady()) { try { window.clarity("event", name); } catch (e) {} }
    if (gtagReady()) { try { window.gtag("event", name, params || {}); } catch (e) {} }
  }

  // ---- 1. Page context tags -------------------------------------------------
  function firstText(sel) {
    var el = document.querySelector(sel);
    return el ? el.textContent.trim() : "";
  }

  function setContext() {
    var path = location.pathname.replace(/\/+$/, "") || "/";
    var parts = path.split("/").filter(Boolean);
    var pageType = "other", slug = "", series = "";

    if (path === "/") { pageType = "home"; }
    else if (path === "/posts") { pageType = "writing-index"; }
    else if (path === "/series") { pageType = "series-index"; }
    else if (parts[0] === "about") { pageType = "about"; }
    else if (parts[0] === "contact") { pageType = "contact"; }
    else if (parts[0] === "posts") { pageType = "post"; slug = parts[1] || ""; }
    else if (parts[0] === "series") {
      series = parts[1] || "";
      if (parts.length >= 3) { pageType = "series-post"; slug = parts[2]; }
      else { pageType = "series-landing"; }
    }

    tag("page_type", pageType);
    if (slug) tag("post", slug);
    if (series) tag("series", series);

    // content type label (Essay / Paper / Series / Security ...) from the page.
    var label = firstText(".blog-meta .tag") || firstText(".card-tag");
    if (label) tag("content_type", label);

    // current theme (light / dark)
    tag("theme", document.documentElement.getAttribute("data-theme") ||
                 document.body.getAttribute("data-theme") || "light");

    return { pageType: pageType, slug: slug };
  }

  var ctx = setContext();
  var isArticle = ctx.pageType === "post" || ctx.pageType === "series-post";

  // ---- 2. Reading depth (articles only) ------------------------------------
  if (isArticle) {
    var marks = [25, 50, 75, 100], hit = {};
    var onScroll = function () {
      var doc = document.documentElement;
      var scrollable = doc.scrollHeight - doc.clientHeight;
      if (scrollable <= 0) return;
      var pct = (doc.scrollTop || document.body.scrollTop) / scrollable * 100;
      marks.forEach(function (m) {
        if (pct >= m && !hit[m]) { hit[m] = true; track("read_" + m, { post: ctx.slug }); }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("load", onScroll);
  }

  // ---- 3. Outbound link clicks ---------------------------------------------
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a");
    if (!a) return;
    var href = a.getAttribute("href") || "";
    if (!/^https?:\/\//i.test(href)) return;
    try {
      var host = new URL(href, location.href).hostname;
      if (host === location.hostname) return; // internal
      if (/arxiv\.org/i.test(host)) track("outbound_arxiv", { url: href });
      else if (/(twitter|x)\.com|linkedin\.com|github\.com|mastodon|bsky/i.test(host)) track("outbound_social", { url: href });
      else track("outbound_link", { url: href });
    } catch (err) {}
  }, true);

  // ---- 4. Theme changes -----------------------------------------------------
  var themeBtn = document.getElementById("themeToggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      // read after the toggle handler has run
      setTimeout(function () {
        var t = document.documentElement.getAttribute("data-theme") || "light";
        tag("theme", t);
        track("theme_toggled", { theme: t });
      }, 0);
    });
  }

  // ---- 5. Scrollytelling progress ------------------------------------------
  var scenes = document.querySelectorAll(".scene[data-scene]");
  if (scenes.length) {
    var total = scenes.length, seen = {}, completed = false;
    var obs = new MutationObserver(function (muts) {
      muts.forEach(function (mu) {
        var el = mu.target;
        if (!el.classList || !el.classList.contains("is-active")) return;
        var n = el.getAttribute("data-scene");
        if (n && !seen[n]) {
          seen[n] = true;
          track("scrolly_scene", { scene: Number(n), post: ctx.slug });
          if (!completed && Number(n) >= total) {
            completed = true;
            track("scrolly_completed", { post: ctx.slug, scenes: total });
          }
        }
      });
    });
    scenes.forEach(function (s) {
      obs.observe(s, { attributes: true, attributeFilter: ["class"] });
    });
  }
  // ---- 6. Post / series card clicks (home + listing grids) -----------------
  // Which posts get opened from the home grid, listing, and series pages.
  document.addEventListener("click", function (e) {
    var card = e.target.closest && e.target.closest("a.post-card, a.featured-card");
    if (!card) return;
    var href = card.getAttribute("href") || "";
    var titleEl = card.querySelector(".card-title, .featured-title");
    var title = titleEl ? titleEl.textContent.trim() : "";
    track("card_click", { target: href, title: title, from: ctx.pageType });
  }, true);
})();
