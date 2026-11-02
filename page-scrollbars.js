(() => {
  const root = document.documentElement;
  const indicator = document.createElement('div');
  indicator.id = 'page-scroll-indicator';
  indicator.setAttribute('aria-hidden', 'true');
  document.body.append(indicator);
  let idleTimer;
  const update = () => {
    const viewport = window.innerHeight;
    const total = root.scrollHeight;
    const height = Math.max(24, viewport * viewport / total);
    indicator.style.height = `${height}px`;
    indicator.style.transform = `translateY(${(viewport - height) * window.scrollY / Math.max(1, total - viewport)}px)`;
  };
  window.addEventListener('scroll', () => {
    update();
    root.classList.add('is-scrolling');
    window.clearTimeout(idleTimer);
    idleTimer = window.setTimeout(() => root.classList.remove('is-scrolling'), 900);
  }, {passive: true});
  window.addEventListener('resize', update, {passive: true});
})();
