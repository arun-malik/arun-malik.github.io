// Explain at My Level - Browser LLM powered content explanation
// Uses WebLLM (Phi-3-mini) to re-explain selected content at different audience levels.
// Opt-in: downloads model on first use (~2GB, cached permanently).

(function() {
  'use strict';

  var MODEL_LOADED = false;
  var ENGINE = null;
  var CURRENT_LEVEL = null;
  var EXPLAIN_MODE = false;

  // Add explain button to action bar
  var SELECTED_TEXTS = [];

  function init() {
    var actionRow = document.querySelector('.action-row');
    if (!actionRow) return;

    // Check WebGPU support - hide feature on unsupported devices
    if (!navigator.gpu) return;

    // Verify GPU adapter is actually available (async check)
    navigator.gpu.requestAdapter().then(function(adapter) {
      if (!adapter) return;
      showExplainButton(actionRow);
    }).catch(function() {});
  }

  function showExplainButton(actionRow) {

    var btn = document.createElement('button');
    btn.className = 'ab-btn explain-trigger';
    btn.textContent = 'Explain';
    btn.title = 'Re-explain any section at your level using a private AI model running in your browser';
    actionRow.appendChild(btn);

    // Level picker dropdown
    var picker = document.createElement('div');
    picker.className = 'explain-picker';
    picker.innerHTML = [
      '<div class="explain-picker-title">Explain at My Level</div>',
      '<div class="explain-picker-desc">Select your perspective. Then click any section or highlight text to get it re-explained by an AI running privately in your browser.</div>',
      '<button data-level="beginner">Beginner</button>',
      '<button data-level="technical">Technical</button>',
      '<button data-level="leadership">Leadership</button>',
      '<button data-level="nontechnical">Non-Technical</button>',
    ].join('');
    picker.style.display = 'none';
    btn.parentElement.style.position = 'relative';
    btn.after(picker);

    // Explanation output panel
    var panel = document.createElement('div');
    panel.className = 'explain-panel';
    panel.style.display = 'none';
    panel.innerHTML = '<div class="explain-panel-header"><span>Explanation</span><button class="explain-close">&times;</button></div><div class="explain-content"></div>';
    document.body.appendChild(panel);

    // Styles
    injectStyles();

    // Event: toggle picker
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      picker.style.display = picker.style.display === 'none' ? 'block' : 'none';
    });

    // Event: select level
    picker.querySelectorAll('[data-level]').forEach(function(levelBtn) {
      levelBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        CURRENT_LEVEL = this.getAttribute('data-level');
        EXPLAIN_MODE = true;
        SELECTED_TEXTS = [];
        picker.style.display = 'none';
        btn.classList.add('active');
        btn.textContent = 'Explaining as ' + levelLabel(CURRENT_LEVEL);
        document.body.classList.add('explain-mode');
        showSelectionBar();
        showToast('Click sections to select them, then press "Explain Selected"');
      });
    });

    // Selection bar (shows count + explain button)
    function showSelectionBar() {
      if (document.querySelector('.explain-selection-bar')) return;
      var bar = document.createElement('div');
      bar.className = 'explain-selection-bar';
      bar.innerHTML = '<span class="selection-count">0 selected</span><button class="selection-explain-btn">Explain Selected</button><button class="selection-clear-btn">Clear</button><button class="selection-exit-btn">Exit</button>';
      document.body.appendChild(bar);

      bar.querySelector('.selection-explain-btn').addEventListener('click', function() {
        if (SELECTED_TEXTS.length === 0) { showToast('Click at least one section first'); return; }
        explainContent(SELECTED_TEXTS.join('\n\n'));
      });
      bar.querySelector('.selection-clear-btn').addEventListener('click', function() {
        SELECTED_TEXTS = [];
        document.querySelectorAll('.explain-selected').forEach(function(el) { el.classList.remove('explain-selected'); });
        updateSelectionCount();
      });
      bar.querySelector('.selection-exit-btn').addEventListener('click', function() {
        exitExplainMode(btn);
      });
    }

    function updateSelectionCount() {
      var count = document.querySelector('.selection-count');
      if (count) count.textContent = SELECTED_TEXTS.length + ' selected';
    }

    function removeSelectionBar() {
      var bar = document.querySelector('.explain-selection-bar');
      if (bar) bar.remove();
      document.querySelectorAll('.explain-selected').forEach(function(el) { el.classList.remove('explain-selected'); });
    }

    // Event: click on content in explain mode (multi-select)
    document.addEventListener('click', function(e) {
      if (!EXPLAIN_MODE) return;
      if (e.target.closest('.explain-panel, .explain-picker, .explain-trigger, .action-row, .explain-selection-bar')) return;

      var target = e.target.closest('p, li, blockquote, h2, h3, td, .abstract, figcaption');
      if (target) {
        e.preventDefault();
        if (target.classList.contains('explain-selected')) {
          // Deselect
          target.classList.remove('explain-selected');
          var text = target.textContent.trim();
          SELECTED_TEXTS = SELECTED_TEXTS.filter(function(t) { return t !== text; });
        } else {
          // Select
          target.classList.add('explain-selected');
          SELECTED_TEXTS.push(target.textContent.trim());
        }
        updateSelectionCount();
      }
    });

    // Event: text selection
    document.addEventListener('mouseup', function() {
      if (!EXPLAIN_MODE) return;
      var selection = window.getSelection().toString().trim();
      if (selection.length > 20) {
        explainContent(selection);
      }
    });

    // Close panel
    panel.querySelector('.explain-close').addEventListener('click', function() {
      panel.style.display = 'none';
    });

    // Close picker on outside click
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.explain-trigger, .explain-picker')) {
        picker.style.display = 'none';
      }
    });

    // ESC to exit explain mode
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && EXPLAIN_MODE) {
        exitExplainMode(btn);
      }
    });
  }

  function exitExplainMode(btn) {
    EXPLAIN_MODE = false;
    CURRENT_LEVEL = null;
    SELECTED_TEXTS = [];
    document.body.classList.remove('explain-mode');
    btn.classList.remove('active');
    btn.textContent = 'Explain';
    btn.title = 'Re-explain any section at your level using a private AI model running in your browser';
    // Clean up
    var bar = document.querySelector('.explain-selection-bar');
    if (bar) bar.remove();
    document.querySelectorAll('.explain-selected').forEach(function(el) { el.classList.remove('explain-selected'); });
  }

  async function explainContent(text) {
    var panel = document.querySelector('.explain-panel');
    var content = panel.querySelector('.explain-content');
    panel.style.display = 'block';

    if (text.length > 2000) text = text.substring(0, 2000) + '...';

    var levelPrompt = {
      beginner: 'You are explaining a technical concept to someone new to technology - a student, career switcher, or someone simply curious. Use everyday analogies, avoid all jargon, and explain step by step as if teaching a friend over coffee.',
      technical: 'You are explaining to a software engineer or architect. Be precise, focus on architecture decisions, tradeoffs, and implementation details. They understand distributed systems, cloud, and AI fundamentals.',
      leadership: 'You are explaining to a CTO, VP of Engineering, or engineering manager. Focus on business impact, risk, strategic implications, team decisions, and ROI. Skip implementation details, emphasize outcomes and what decisions need to be made.',
      nontechnical: 'You are explaining to a non-technical professional - a product manager, investor, journalist, or business stakeholder. Use zero jargon, focus on the "why it matters" and real-world impact. Use metaphors from everyday life.'
    };

    content.innerHTML = '<div class="explain-loading">Loading AI model...</div>';

    if (!MODEL_LOADED) {
      try {
        content.innerHTML = '<div class="explain-loading">Loading AI model (~300MB, one-time download)...</div>';
        var webllm = await import('https://esm.run/@mlc-ai/web-llm');
        ENGINE = await webllm.CreateMLCEngine('SmolLM2-135M-Instruct-q4f16_1-MLC', {
          initProgressCallback: function(progress) {
            content.innerHTML = '<div class="explain-loading">' + progress.text + '</div>';
          }
        });
        MODEL_LOADED = true;
      } catch (err) {
        content.innerHTML = '<div class="explain-error">Could not load AI model.<br><br><small>This feature requires a browser with WebGPU support and a compatible GPU. Try Chrome or Edge on a desktop/laptop with a dedicated GPU.<br><br>Error: ' + (err.message || err) + '</small></div>';
        return;
      }
    }

    content.innerHTML = '<div class="explain-loading">Thinking...</div>';

    try {
      var messages = [
        { role: 'system', content: levelPrompt[CURRENT_LEVEL] },
        { role: 'user', content: 'Explain this:\n\n' + text }
      ];

      var response = await ENGINE.chat.completions.create({
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
        stream: true
      });

      content.innerHTML = '';
      for await (var chunk of response) {
        var delta = chunk.choices[0].delta.content || '';
        content.innerHTML += delta.replace(/\n/g, '<br>');
      }
    } catch (err) {
      content.innerHTML = '<div class="explain-error">Error generating explanation: ' + err.message + '</div>';
    }
  }

  function levelLabel(level) {
    return { beginner: 'Beginner', technical: 'Technical', leadership: 'Leadership', nontechnical: 'Non-Technical' }[level] || level;
  }

  function showToast(msg) {
    var toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;top:4rem;left:50%;transform:translateX(-50%);background:var(--accent,#2563eb);color:#fff;padding:0.5rem 1rem;border-radius:6px;font-size:0.8125rem;font-family:-apple-system,sans-serif;z-index:10000;opacity:0;transition:opacity 0.3s';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(function() { toast.style.opacity = '1'; }, 10);
    setTimeout(function() { toast.style.opacity = '0'; setTimeout(function() { toast.remove(); }, 300); }, 3000);
  }

  function injectStyles() {
    var style = document.createElement('style');
    style.textContent = [
      '.explain-trigger.active{border-color:var(--accent,#2563eb);color:var(--accent,#2563eb);background:color-mix(in srgb, var(--accent) 8%, transparent)}',
      '.explain-picker{position:absolute;top:calc(100% + .5rem);left:0;background:var(--bg,#fff);border:1px solid var(--border,#e5e7eb);border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.12);padding:0.75rem;z-index:200;min-width:240px}',
      '.explain-picker-title{font-size:0.875rem;font-weight:600;color:var(--text,#111827);padding:0.25rem 0.5rem}',
      '.explain-picker-desc{font-size:0.75rem;color:var(--text-secondary,#6b7280);padding:0.25rem 0.5rem 0.5rem;line-height:1.4;border-bottom:1px solid var(--border,#e5e7eb);margin-bottom:0.375rem}',
      '.explain-picker button{display:block;width:100%;text-align:left;padding:0.5rem 0.75rem;border:none;background:none;font-size:0.8125rem;color:var(--text,#111827);cursor:pointer;border-radius:4px;font-family:-apple-system,sans-serif}',
      '.explain-picker button:hover{background:var(--bg-secondary,#f9fafb);color:var(--accent,#2563eb)}',
      '.explain-mode p:hover,.explain-mode li:hover,.explain-mode blockquote:hover,.explain-mode h2:hover,.explain-mode h3:hover{outline:2px dashed var(--accent,#2563eb);outline-offset:4px;border-radius:4px;cursor:pointer}',
      '.explain-selected{outline:2px solid var(--accent,#2563eb)!important;outline-offset:4px;border-radius:4px;background:color-mix(in srgb, var(--accent,#2563eb) 6%, transparent)}',
      '.explain-selection-bar{position:fixed;bottom:1rem;left:50%;transform:translateX(-50%);background:var(--bg,#fff);border:1px solid var(--border,#e5e7eb);border-radius:8px;padding:0.5rem 1rem;display:flex;gap:0.75rem;align-items:center;box-shadow:0 4px 16px rgba(0,0,0,.12);z-index:9999;font-family:-apple-system,sans-serif;font-size:0.8125rem}',
      '.selection-count{color:var(--text-secondary,#6b7280);min-width:70px}',
      '.selection-explain-btn{background:var(--accent,#2563eb);color:#fff;border:none;border-radius:5px;padding:0.375rem 0.75rem;font-size:0.8125rem;cursor:pointer;font-family:inherit;font-weight:500}',
      '.selection-explain-btn:hover{opacity:0.9}',
      '.selection-clear-btn,.selection-exit-btn{background:none;border:1px solid var(--border,#e5e7eb);border-radius:5px;padding:0.375rem 0.6rem;font-size:0.75rem;cursor:pointer;color:var(--text-secondary,#6b7280);font-family:inherit}',
      '.selection-clear-btn:hover,.selection-exit-btn:hover{border-color:var(--text-secondary,#6b7280)}',
      '.explain-panel{position:fixed;bottom:1.5rem;right:1.5rem;width:380px;max-height:60vh;background:var(--bg,#fff);border:1px solid var(--border,#e5e7eb);border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,.15);z-index:10000;overflow:hidden;display:flex;flex-direction:column;font-family:-apple-system,sans-serif}',
      '.explain-panel-header{display:flex;justify-content:space-between;align-items:center;padding:0.75rem 1rem;border-bottom:1px solid var(--border,#e5e7eb);font-size:0.8125rem;font-weight:600;color:var(--text,#111827)}',
      '.explain-panel-header button{background:none;border:none;font-size:1.25rem;cursor:pointer;color:var(--text-secondary,#6b7280);padding:0 0.25rem}',
      '.explain-content{padding:1rem;overflow-y:auto;font-size:0.875rem;line-height:1.6;color:var(--text,#111827)}',
      '.explain-loading{color:var(--text-secondary,#6b7280);font-style:italic}',
      '.explain-error{color:#dc2626;font-size:0.8125rem}',
      '@media(max-width:640px){.explain-panel{left:0.5rem;right:0.5rem;width:auto;bottom:0.5rem}}'
    ].join('');
    document.head.appendChild(style);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(init, 300); });
  } else { setTimeout(init, 300); }
})();
