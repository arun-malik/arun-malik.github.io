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
  function init() {
    var actionRow = document.querySelector('.action-row');
    if (!actionRow) return;

    var btn = document.createElement('button');
    btn.className = 'ab-btn explain-trigger';
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9 9a3 3 0 0 1 6 0c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Explain';
    btn.title = 'Explain any section at your level';
    actionRow.appendChild(btn);

    // Level picker dropdown
    var picker = document.createElement('div');
    picker.className = 'explain-picker';
    picker.innerHTML = [
      '<div class="explain-picker-title">Explain as...</div>',
      '<button data-level="beginner">🌱 Beginner</button>',
      '<button data-level="technical">⚙️ Technical</button>',
      '<button data-level="leadership">📊 Leadership</button>',
      '<button data-level="nontechnical">💡 Non-Technical</button>',
      '<div class="explain-picker-hint">Then click any section or select text</div>'
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
        picker.style.display = 'none';
        btn.classList.add('active');
        btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9 9a3 3 0 0 1 6 0c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Explaining as ' + levelLabel(CURRENT_LEVEL);
        document.body.classList.add('explain-mode');
        showToast('Click any section or select text to explain');
      });
    });

    // Event: click on content in explain mode
    document.addEventListener('click', function(e) {
      if (!EXPLAIN_MODE) return;
      if (e.target.closest('.explain-panel, .explain-picker, .explain-trigger, .action-row')) return;

      var target = e.target.closest('p, li, blockquote, h2, h3, td, .abstract, figcaption');
      if (target) {
        e.preventDefault();
        explainContent(target.textContent.trim());
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
    document.body.classList.remove('explain-mode');
    btn.classList.remove('active');
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9 9a3 3 0 0 1 6 0c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Explain';
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
        content.innerHTML = '<div class="explain-loading">Downloading AI model (one-time, ~2GB)...<br><small>This enables private, offline explanations.</small></div>';
        var webllm = await import('https://esm.run/@mlc-ai/web-llm');
        ENGINE = await webllm.CreateMLCEngine('Phi-3.5-mini-instruct-q4f16_1-MLC', {
          initProgressCallback: function(progress) {
            content.innerHTML = '<div class="explain-loading">' + progress.text + '</div>';
          }
        });
        MODEL_LOADED = true;
      } catch (err) {
        content.innerHTML = '<div class="explain-error">Could not load AI model. Your browser may not support WebGPU.<br><small>' + err.message + '</small></div>';
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
      '.explain-picker{position:absolute;top:calc(100% + .5rem);left:0;background:var(--bg,#fff);border:1px solid var(--border,#e5e7eb);border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.12);padding:0.5rem;z-index:200;min-width:180px}',
      '.explain-picker-title{font-size:0.75rem;font-weight:600;color:var(--text-secondary,#6b7280);padding:0.25rem 0.5rem;text-transform:uppercase;letter-spacing:0.04em}',
      '.explain-picker button{display:block;width:100%;text-align:left;padding:0.5rem 0.75rem;border:none;background:none;font-size:0.8125rem;color:var(--text,#111827);cursor:pointer;border-radius:4px;font-family:-apple-system,sans-serif}',
      '.explain-picker button:hover{background:var(--bg-secondary,#f9fafb);color:var(--accent,#2563eb)}',
      '.explain-picker-hint{font-size:0.7rem;color:var(--text-secondary,#6b7280);padding:0.5rem 0.5rem 0.25rem;border-top:1px solid var(--border,#e5e7eb);margin-top:0.25rem}',
      '.explain-mode p:hover,.explain-mode li:hover,.explain-mode blockquote:hover,.explain-mode h2:hover,.explain-mode h3:hover{outline:2px solid var(--accent,#2563eb);outline-offset:4px;border-radius:4px;cursor:pointer}',
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
