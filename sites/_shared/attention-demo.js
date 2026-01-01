(() => {
  const LEVELS = [
    { min: 0.45, cls: "attn-3" },
    { min: 0.2, cls: "attn-2" },
    { min: 0.08, cls: "attn-1" },
  ];

  // Toy (hand-authored) attention weights per focus token.
  // Keys are token indices; values sum to ~1.
  function buildToyWeights(tokens) {
    const idx = (t) => tokens.findIndex((x) => x.toLowerCase() === t.toLowerCase());

    const iJake = idx("Jake");
    const iLearned = idx("learned");
    const iAI = idx("AI");
    const iEven = idx("even");
    const iThough = idx("though");
    const iIt = idx("it");
    const iWas = idx("was");
    const iDifficult = idx("difficult");

    const weights = new Map();

    // Helper: create mostly-uniform weights if unknown
    function uniform() {
      const n = tokens.length;
      const w = Array.from({ length: n }, () => 1 / n);
      return w;
    }

    // Focus: it -> mostly AI, some difficult/was.
    if (iIt >= 0) {
      const w = Array.from({ length: tokens.length }, () => 0);
      const set = (i, v) => {
        if (i >= 0) w[i] = v;
      };
      set(iAI, 0.58);
      set(iDifficult, 0.16);
      set(iWas, 0.08);
      set(iLearned, 0.06);
      set(iJake, 0.04);
      set(iEven, 0.03);
      set(iThough, 0.03);
      // distribute remainder to self (or punctuation)
      const sum = w.reduce((a, b) => a + b, 0);
      const rem = Math.max(0, 1 - sum);
      set(iIt, (w[iIt] || 0) + rem);
      weights.set(iIt, w);
    }

    // Focus: learned -> subject Jake and object AI
    if (iLearned >= 0) {
      const w = Array.from({ length: tokens.length }, () => 0);
      const set = (i, v) => {
        if (i >= 0) w[i] = v;
      };
      set(iJake, 0.46);
      set(iAI, 0.36);
      set(iIt, 0.06);
      set(iDifficult, 0.05);
      set(iWas, 0.03);
      const sum = w.reduce((a, b) => a + b, 0);
      const rem = Math.max(0, 1 - sum);
      set(iLearned, (w[iLearned] || 0) + rem);
      weights.set(iLearned, w);
    }

    // Focus: difficult -> was / it
    if (iDifficult >= 0) {
      const w = Array.from({ length: tokens.length }, () => 0);
      const set = (i, v) => {
        if (i >= 0) w[i] = v;
      };
      set(iWas, 0.44);
      set(iIt, 0.28);
      set(iAI, 0.14);
      set(iThough, 0.06);
      set(iEven, 0.04);
      const sum = w.reduce((a, b) => a + b, 0);
      const rem = Math.max(0, 1 - sum);
      set(iDifficult, (w[iDifficult] || 0) + rem);
      weights.set(iDifficult, w);
    }

    return {
      getWeightsForIndex: (focusIndex) => weights.get(focusIndex) || uniform(),
    };
  }

  function tokenize(sentence) {
    // Keep punctuation tokens (.) as separate.
    return sentence
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((t) => t);
  }

  function levelClass(weight) {
    for (const l of LEVELS) {
      if (weight >= l.min) return l.cls;
    }
    return "";
  }

  function renderWeights(container, tokens, weights, focusIndex) {
    container.innerHTML = "";

    const pairs = tokens
      .map((tok, i) => ({ tok, i, w: weights[i] ?? 0 }))
      .sort((a, b) => b.w - a.w);

    pairs.forEach(({ tok, i, w }) => {
      const row = document.createElement("div");
      row.className = "attn-row";

      const label = document.createElement("div");
      label.className = "attn-token";
      label.textContent = tok;

      const bar = document.createElement("div");
      bar.className = "attn-bar";
      bar.style.setProperty("--w", `${Math.round(w * 100)}%`);

      const pct = document.createElement("div");
      pct.className = "attn-pct";
      pct.textContent = `${Math.round(w * 100)}%`;

      if (i === focusIndex) {
        row.classList.add("is-focus");
      }

      row.appendChild(label);
      row.appendChild(bar);
      row.appendChild(pct);
      container.appendChild(row);
    });
  }

  function updateTokenHighlights(strip, weights, focusIndex) {
    const chips = Array.from(strip.querySelectorAll(".token-chip"));
    chips.forEach((chip, i) => {
      chip.classList.remove("is-focus", "attn-1", "attn-2", "attn-3");

      if (i === focusIndex) {
        chip.classList.add("is-focus");
        return;
      }

      const cls = levelClass(weights[i] ?? 0);
      if (cls) chip.classList.add(cls);
    });
  }

  function initDemo(root) {
    const sentence = root.getAttribute("data-sentence") || "";
    const tokens = tokenize(sentence);

    const strip = root.querySelector("[data-token-strip]");
    const focusLabel = root.querySelector("[data-focus-label]");
    const weightsEl = root.querySelector("[data-attn-weights]");

    if (!strip || !focusLabel || !weightsEl || tokens.length === 0) return;

    const model = buildToyWeights(tokens);

    strip.innerHTML = "";
    tokens.forEach((tok, i) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "token-chip";
      chip.textContent = tok;
      chip.dataset.index = String(i);
      chip.setAttribute("aria-label", `Focus token: ${tok}`);
      strip.appendChild(chip);
    });

    let focusIndex = Math.max(0, tokens.findIndex((t) => t.toLowerCase() === "it"));

    function render() {
      const weights = model.getWeightsForIndex(focusIndex);
      focusLabel.textContent = tokens[focusIndex] || "(none)";
      renderWeights(weightsEl, tokens, weights, focusIndex);
      updateTokenHighlights(strip, weights, focusIndex);
    }

    strip.addEventListener("click", (e) => {
      const btn = e.target instanceof Element ? e.target.closest(".token-chip") : null;
      if (!btn) return;
      const idx = Number(btn.dataset.index);
      if (!Number.isFinite(idx)) return;
      focusIndex = idx;
      render();
    });

    render();
  }

  function initAll() {
    document.querySelectorAll("[data-attention-demo]").forEach((root) => initDemo(root));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();
