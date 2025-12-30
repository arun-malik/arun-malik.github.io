(function () {
  const btn = document.getElementById('btn');
  const out = document.getElementById('out');
  if (!btn || !out) return;

  btn.addEventListener('click', () => {
    out.textContent = 'Button clicked at ' + new Date().toLocaleString();
  });
})();
