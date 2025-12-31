(() => {
  const STEPS = [
    {
      id: "ml-goal",
      title: "ML is a mapping",
      body: "Most of ML is: learn a function that maps inputs to outputs. The ‘magic’ is learning useful intermediate representations.",
      nodes: ["ml-goal", "neural-network", "task-output"],
    },
    {
      id: "sequential-data",
      title: "Sequences need context",
      body: "Language is sequential: each token’s meaning depends on surrounding tokens (context).",
      nodes: ["sequential-data"],
    },
    {
      id: "rnn-lstm",
      title: "RNN/LSTM bottleneck",
      body: "RNNs/LSTMs process one token at a time. That makes training hard to parallelize and can weaken long-range memory.",
      nodes: ["rnn-lstm", "rnn-problems"],
    },
    {
      id: "transformer-2017",
      title: "Transformer’s key move",
      body: "Replace strict step-by-step recurrence with attention: a communication layer where tokens can exchange information directly.",
      nodes: ["transformer-2017", "all-to-all", "why-won"],
    },
    {
      id: "block-attention",
      title: "Inside a block: Attention",
      body: "Attention mixes information across tokens — it’s where ‘who should talk to whom’ is learned.",
      nodes: ["block-attention"],
    },
    {
      id: "block-mlp",
      title: "Inside a block: MLP",
      body: "The feed-forward network refines each token independently (no cross-token mixing here).",
      nodes: ["block-mlp"],
    },
    {
      id: "block-stability",
      title: "Residuals + LayerNorm",
      body: "Residual connections preserve signal flow; LayerNorm stabilizes scale. Together they make deep stacks train reliably.",
      nodes: ["block-stability"],
    },
    {
      id: "tokenizer",
      title: "Tokenizer",
      body: "Convert text into tokens. Tokens are the discrete units the model actually processes.",
      nodes: ["tokenizer"],
    },
    {
      id: "embedding",
      title: "Embedding",
      body: "Turn each token id into a vector. This is the model’s continuous ‘starting point’ for meaning.",
      nodes: ["embedding"],
    },
    {
      id: "positional",
      title: "Positional information",
      body: "Because attention isn’t inherently ordered, we add position info so ‘token 3’ is distinguishable from ‘token 30’.",
      nodes: ["positional"],
    },
    {
      id: "stacked-blocks",
      title: "Stacked blocks",
      body: "Repeat the same block many times. Each layer refines representations using attention + MLP.",
      nodes: ["stacked-blocks"],
    },
    {
      id: "contextual-vectors",
      title: "Contextual vectors",
      body: "After the stack, each token’s vector now contains information from relevant other tokens — it’s contextual.",
      nodes: ["contextual-vectors"],
    },
    {
      id: "task-head",
      title: "Task head",
      body: "A small final module converts representations into outputs: next-token probabilities, a class label, etc.",
      nodes: ["task-head"],
    },
    {
      id: "q",
      title: "Attention: Q, K, V",
      body: "Each token produces Q (what I’m looking for), K (what I offer for matching), and V (the content to share).",
      nodes: ["q", "k", "v"],
    },
    {
      id: "scores",
      title: "Similarity scores",
      body: "Compare each query against all keys (often via dot products). Higher score = more relevant.",
      nodes: ["scores"],
    },
    {
      id: "softmax",
      title: "Weights",
      body: "Softmax turns scores into attention weights (a probability-like distribution).",
      nodes: ["softmax"],
    },
    {
      id: "weighted-sum",
      title: "Weighted sum",
      body: "Use the weights to blend values (V). The result is a new representation that ‘pulled in’ relevant information.",
      nodes: ["weighted-sum"],
    },
  ];

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function unique(arr) {
    return Array.from(new Set(arr));
  }

  function findNearestDiagramForNodes(nodeEls) {
    for (const el of nodeEls) {
      const diagram = el.closest(".diagram");
      if (diagram) return diagram;
    }
    return null;
  }

  function clearAllFocus() {
    document.querySelectorAll(".diagram-box.is-focus").forEach((el) => el.classList.remove("is-focus"));
    document.querySelectorAll(".diagram.is-dimming").forEach((el) => el.classList.remove("is-dimming"));
  }

  function focusStep(step, opts = {}) {
    const { scroll = true } = opts;
    clearAllFocus();

    const nodeEls = unique(step.nodes)
      .map((nodeId) => document.querySelector(`.diagram-box[data-node=\"${CSS.escape(nodeId)}\"]`))
      .filter(Boolean);

    nodeEls.forEach((el) => el.classList.add("is-focus"));

    const diagram = findNearestDiagramForNodes(nodeEls);
    if (diagram) diagram.classList.add("is-dimming");

    if (scroll) {
      const first = nodeEls[0];
      if (first) {
        const contentCard = first.closest(".content-card");
        // Keep focus inside the card (it scrolls)
        first.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" });
        if (contentCard) {
          // no-op: scrollIntoView handles it; this is just a future hook.
        }
      }
    }
  }

  function initTour() {
    const root = document.querySelector("[data-diagram-tour]");
    if (!root) return;

    const titleEl = root.querySelector("[data-tour-title]");
    const bodyEl = root.querySelector("[data-tour-body]");
    const progressEl = root.querySelector("[data-tour-progress]");
    const prevBtn = root.querySelector("[data-tour-prev]");
    const nextBtn = root.querySelector("[data-tour-next]");

    if (!titleEl || !bodyEl || !progressEl || !prevBtn || !nextBtn) return;

    let index = 0;

    function render() {
      index = clamp(index, 0, STEPS.length - 1);
      const step = STEPS[index];

      titleEl.textContent = step.title;
      bodyEl.textContent = step.body;
      progressEl.textContent = `${index + 1} / ${STEPS.length}`;

      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === STEPS.length - 1;

      focusStep(step);
    }

    function setStepByNode(nodeId) {
      const targetIndex = STEPS.findIndex((s) => s.nodes.includes(nodeId));
      if (targetIndex >= 0) {
        index = targetIndex;
        render();
        return true;
      }
      return false;
    }

    prevBtn.addEventListener("click", () => {
      index -= 1;
      render();
    });

    nextBtn.addEventListener("click", () => {
      index += 1;
      render();
    });

    document.addEventListener("click", (e) => {
      const box = e.target instanceof Element ? e.target.closest(".diagram-box[data-node]") : null;
      if (!box) return;
      const nodeId = box.getAttribute("data-node");
      if (!nodeId) return;

      if (!setStepByNode(nodeId)) {
        // Fallback: show box title/sub if it isn't in the tour list.
        const title = box.querySelector(".diagram-title")?.textContent?.trim();
        const sub = box.querySelector(".diagram-sub")?.textContent?.trim();
        titleEl.textContent = title || "Selected";
        bodyEl.textContent = sub || "";
        progressEl.textContent = "—";
        clearAllFocus();
        box.classList.add("is-focus");
        const diagram = box.closest(".diagram");
        if (diagram) diagram.classList.add("is-dimming");
        box.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" });
      }
    });

    // Good default: start at the most important step.
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTour);
  } else {
    initTour();
  }
})();
