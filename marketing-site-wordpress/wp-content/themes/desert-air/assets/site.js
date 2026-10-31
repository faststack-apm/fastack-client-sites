// Mobile navigation toggle.
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.nav-toggle');
  if (!btn) return;
  const nav = document.getElementById('primary-nav');
  const open = nav.classList.toggle('is-open');
  btn.setAttribute('aria-expanded', String(open));
});
