/*
 * Data stories: thin wrapper around Apache ECharts (Apache-2.0, vendored in
 * /assets/vendor/echarts/). Each chart is an ECharts option stored as inline
 * JSON next to its container, so pages render without fetches (works from
 * file:// too).
 *
 *   <div class="ds-chart" data-spec="spec-id" style="height:440px"></div>
 *   <script type="application/json" id="spec-id">{"option": {...}, "magic": ["bar","line","stack"], "zoom": "x"}</script>
 *   magic: chart-type switcher; "stack"/"tiled" on authored-stacked bars adds a stacked / side by side toggle, and Line always unstacks. zoom: "x" adds scroll/drag plus a slider, "xy" adds scroll/drag on both axes plus box zoom.
 *
 * JSON cannot hold functions, so any "formatter" / "valueFormatter" whose value
 * is "fmt:<name>" is turned into a function (see FORMATS).
 */
(function () {
  "use strict";

  var INK = "#1f2328", MUTED = "#57606a", RULE = "#d0d7de", GRID = "#eaeef2";
  var PALETTE = ["#1d4ed8", "#c2410c", "#0f766e", "#7c3aed", "#b45309", "#475569"];

  function axis(text, line, grid, size) {
    return {
      axisLine: { lineStyle: { color: line } },
      axisTick: { lineStyle: { color: line } },
      axisLabel: { color: text, fontSize: size },
      nameTextStyle: { color: text, fontSize: size },
      splitLine: { lineStyle: { color: grid } }
    };
  }

  function theme(o) {
    return {
      color: PALETTE,
      backgroundColor: o.bg,
      textStyle: { color: o.text, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontSize: o.size },
      legend: { textStyle: { color: o.text, fontSize: o.size }, inactiveColor: o.grid },
      tooltip: { backgroundColor: o.tipBg, borderColor: o.line, textStyle: { color: o.tipText, fontSize: 13 } },
      categoryAxis: axis(o.muted, o.line, o.grid, o.size),
      valueAxis: axis(o.muted, o.line, o.grid, o.size),
      logAxis: axis(o.muted, o.line, o.grid, o.size),
      timeAxis: axis(o.muted, o.line, o.grid, o.size),
      toolbox: { iconStyle: { borderColor: o.muted }, emphasis: { iconStyle: { borderColor: o.text } } },
      dataZoom: { textStyle: { color: o.muted }, borderColor: o.line, fillerColor: o.fill, handleStyle: { color: o.bg, borderColor: o.muted } },
      visualMap: { textStyle: { color: o.text } },
      title: { textStyle: { color: o.text }, subtextStyle: { color: o.muted } },
      markLine: { label: { color: o.text } },
      calendar: {
        itemStyle: { color: o.cell, borderColor: o.page },
        dayLabel: { color: o.muted }, monthLabel: { color: o.text }, yearLabel: { color: o.muted }
      },
      bar: { label: { textBorderWidth: 0 } },
      line: { label: { textBorderWidth: 0 }, markPoint: { label: { color: o.text, textBorderWidth: 0 } } },
      pie: { label: { color: o.text, textBorderWidth: 0 } }
    };
  }

  var THEMES = {
    "ds-light": theme({ bg: "transparent", text: INK, muted: MUTED, line: RULE, grid: GRID, size: 12, tipBg: "#ffffff", tipText: INK, fill: "rgba(29,78,216,.12)", cell: "#f3f4f6", page: "#ffffff" }),
    "ds-dark": theme({ bg: "transparent", text: "#e6edf3", muted: "#a0a9b5", line: "#3d444d", grid: "#262c34", size: 12, tipBg: "#161b22", tipText: "#e6edf3", fill: "rgba(121,184,255,.18)", cell: "#1c2128", page: "#0d1117" }),
    // Static cards are always light and sized for a 1200px-wide image viewed on a phone.
    "ds-card": theme({ bg: "transparent", text: INK, muted: "#3d444d", line: "#afb8c1", grid: GRID, size: 22, tipBg: "#ffffff", tipText: INK, fill: "transparent", cell: "#f0f1f3", page: "#fcfcfa" })
  };

  function num(v, digits) {
    return Number(v).toLocaleString("en-US", { maximumFractionDigits: digits == null ? 1 : digits });
  }

  var FORMATS = {
    int: function (v) { return num(v, 0); },
    num: function (v) { return num(v, 1); },
    pct: function (v) { return num(v, 1) + "%"; },
    pct1: function (v) { return Number(v).toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + "%"; },
    year: function (v) { return String(v); },
    twh: function (v) { return num(v, 0) + " TWh"; }
  };

  // Label formatters receive params; pull the numeric value out of dataset rows.
  function valueOf(p) {
    var v = p.value;
    if (!Array.isArray(v)) return v;
    var e = p.encode || {}, dims = [].concat(e.value || [], e.y || [], e.x || []);
    for (var i = 0; i < dims.length; i++) if (typeof v[dims[i]] === "number") return v[dims[i]];
    return v[v.length - 1];
  }

  function revive(node, key) {
    if (typeof node === "string" && node.indexOf("tpl:") === 0) {
      // "tpl:{name} {0} {1}" -> tooltip/label formatter reading p.name and p.value[i]
      var tpl = node.slice(4);
      return function (p) {
        var v = Array.isArray(p.value) ? p.value : [p.value];
        return tpl.replace(/\{(name|\d+)\}/g, function (_, k) { return k === "name" ? p.name : (v[+k] == null ? "" : v[+k]); });
      };
    }
    if (typeof node === "string" && node.indexOf("fmt:") === 0) {
      var f = FORMATS[node.slice(4)];
      if (!f) return node;
      return key === "valueFormatter" || key === "axisFormatter" ? f : function (p) { return typeof p === "object" ? f(valueOf(p)) : f(p); };
    }
    if (Array.isArray(node)) return node.map(function (x) { return revive(x); });
    if (node && typeof node === "object") {
      var out = {};
      Object.keys(node).forEach(function (k) {
        var v = node[k];
        if (k === "axisLabel" && v && typeof v.formatter === "string" && v.formatter.indexOf("fmt:") === 0) {
          v = Object.assign({}, v, { formatter: revive(v.formatter, "axisFormatter") });
          out[k] = v;
          return;
        }
        out[k] = revive(v, k);
      });
      return out;
    }
    return node;
  }

  function merge(a, b) {
    if (Array.isArray(a) && Array.isArray(b)) {
      return a.map(function (x, i) { return i < b.length ? merge(x, b[i]) : x; });
    }
    if (!b || typeof b !== "object" || Array.isArray(b)) return b === undefined ? a : b;
    var out = Object.assign({}, a);
    Object.keys(b).forEach(function (k) {
      out[k] = a && a[k] && typeof a[k] === "object" ? merge(a[k], b[k]) : b[k];
    });
    return out;
  }

  function build(spec, mode, rec) {
    var o = revive(JSON.parse(JSON.stringify(spec.option)));
    o.aria = merge({ enabled: true }, o.aria || {});
    if (mode === "static") {
      o = merge(o, revive(spec.static || {}));
      delete o.toolbox;
      delete o.dataZoom;
      o.animation = false;
      return o;
    }
    if (o.toolbox !== false) {
      var feature = {
        dataView: { readOnly: true, title: "Data", lang: ["Data behind this chart", "Close", "Refresh"] },
        restore: { title: "Reset" },
        saveAsImage: { title: "Save PNG", pixelRatio: 2, backgroundColor: "#ffffff", name: spec.id || "chart" }
      };
      if (spec.magic && spec.magic.length) {
        // Stacked lines read as totals, so the Line view always unstacks and Bars restores the authored stack.
        var stacks = (o.series || []).map(function (s) { return s.stack || ""; });
        var stackName = stacks.filter(Boolean)[0];
        var types = spec.magic.filter(function (t) { return t !== "tiled" && !(t === "stack" && stackName); });
        if (types.length) {
          var magicOpt = stackName ? { line: { stack: "" }, bar: { stack: stackName } } : {};
          feature = Object.assign({ magicType: { type: types, option: magicOpt, title: { line: "Line", bar: "Bars", stack: "Stack" } } }, feature);
        }
        // ECharts 6 has no "tiled" magic type, so authored-stacked bars get their own stacked / side by side toggle.
        if (stackName && rec && (spec.magic.indexOf("tiled") >= 0 || spec.magic.indexOf("stack") >= 0)) {
          feature = Object.assign({ myTiled: {
            title: "Stacked / side by side",
            icon: "path://M2,15h3V7H2zM7,15h3V3H7zM12,15h3V10H12z",
            onclick: function () {
              var cur = rec.chart.getOption().series;
              if (cur[0] && cur[0].type === "line") return;
              var tile = !!cur[0].stack, n = cur.length;
              rec.chart.setOption({ series: cur.map(function (s, i) {
                var w = (o.series[i] || {}).barWidth;
                var out = { stack: tile ? "" : stacks[i] };
                var pct = typeof w === "string" && /%$/.test(w);
                if (typeof w === "number" || pct) {
                  var v = parseFloat(w), t = Math.max(pct ? 1 : 4, Math.floor(v / n));
                  out.barWidth = tile ? (pct ? t + "%" : t) : w;
                }
                return out;
              }) });
            }
          } }, feature);
        }
      }
      if (spec.zoom) {
        var xy = spec.zoom === "xy", dz = [{ type: "inside", xAxisIndex: 0, filterMode: "none" }];
        if (xy) {
          dz.push({ type: "inside", yAxisIndex: 0, filterMode: "none" });
          feature = Object.assign({ dataZoom: { title: { zoom: "Box zoom", back: "Undo zoom" } } }, feature);
        } else {
          dz.push({ type: "slider", xAxisIndex: 0, filterMode: "none", height: 22, bottom: 6 });
          o.grid = o.grid || {};
          o.grid.bottom = (typeof o.grid.bottom === "number" ? o.grid.bottom : 40) + 44;
        }
        o.dataZoom = dz;
      }
      o.toolbox = merge({ right: 0, top: 0, itemSize: 16, itemGap: 12, feature: feature }, o.toolbox || {});
    } else {
      delete o.toolbox;
    }
    return o;
  }

  function isDark() { return document.documentElement.getAttribute("data-theme") === "dark"; }

  function register() {
    if (!window.echarts) return false;
    Object.keys(THEMES).forEach(function (k) { window.echarts.registerTheme(k, THEMES[k]); });
    return true;
  }

  var charts = [];

  function draw(rec) {
    if (rec.chart) rec.chart.dispose();
    rec.chart = window.echarts.init(rec.el, isDark() ? "ds-dark" : "ds-light", { renderer: "canvas" });
    rec.chart.setOption(build(rec.spec, "interactive", rec));
  }

  function mountAll(root) {
    if (!register()) return;
    (root || document).querySelectorAll(".ds-chart[data-spec]").forEach(function (el) {
      var src = document.getElementById(el.getAttribute("data-spec"));
      if (!src || el.__ds) return;
      var rec = { el: el, spec: JSON.parse(src.textContent) };
      el.__ds = rec;
      charts.push(rec);
      draw(rec);
      if (window.ResizeObserver) new ResizeObserver(function () { rec.chart && rec.chart.resize(); }).observe(el);
    });
    new MutationObserver(function () { charts.forEach(draw); })
      .observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  }

  // Used by the card renderer: light theme, no controls, no animation.
  function renderStatic(el, spec, themeName) {
    register();
    var chart = window.echarts.init(el, themeName || "ds-card", { renderer: "canvas", devicePixelRatio: 2 });
    chart.on("finished", function () { window.__dsReady = (window.__dsReady || 0) + 1; });
    chart.setOption(build(spec, "static"));
    return chart;
  }

  window.DataStory = { mountAll: mountAll, renderStatic: renderStatic, build: build, FORMATS: FORMATS };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { mountAll(); });
  else mountAll();
})();
