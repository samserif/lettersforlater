(() => {
  const track = document.getElementById('postcards');
  if (!track) return;
  const cards = () => [...track.children].filter(card => !card.hidden);
  const carousel = track.closest('.postcard-carousel');
  const singleEvent = () => carousel?.hasAttribute('data-single-event') || cards().length < 2;
  const prev = document.getElementById('postcard-prev');
  const next = document.getElementById('postcard-next');
  const position = document.getElementById('postcard-position');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const controls = document.querySelector('.carousel-controls');
  const maxScroll = () => Math.max(0, track.scrollWidth - track.clientWidth);
  const destinations = () => cards().map(card => Math.min(maxScroll(), Math.max(0, card.offsetLeft - cards()[0].offsetLeft)));
  const index = () => {
    const targets = destinations();
    return targets.reduce((best, target, i) => Math.abs(target - track.scrollLeft) < Math.abs(targets[best] - track.scrollLeft) ? i : best, 0);
  };
  function sync() {
    const overflow = !singleEvent() && maxScroll() > 2;
    if (controls.hidden !== !overflow) controls.hidden = !overflow;
    const i = index();
    prev.disabled = !overflow || track.scrollLeft <= 2;
    next.disabled = !overflow || track.scrollLeft >= maxScroll() - 2;
    position.textContent = `${cards().length ? i + 1 : 0} / ${cards().length}`;
  }
  function go(delta) {
    if (singleEvent()) return;
    const targets = destinations();
    const i = Math.max(0, Math.min(cards().length - 1, index() + delta));
    track.scrollTo({ left: targets[i], behavior: reduced.matches ? 'instant' : 'smooth' });
  }
  prev.addEventListener('click', () => go(-1)); next.addEventListener('click', () => go(1));
  track.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync); window.addEventListener('load', sync);
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(sync).observe(track);
  track.addEventListener('keydown', e => { if (e.target !== track) return; if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); go(e.key === 'ArrowRight' ? 1 : -1); } });
  // Restoring the hidden postcard and removing the single-event flag reactivates the carousel.
  if (typeof MutationObserver !== 'undefined') {
    new MutationObserver(sync).observe(carousel, { attributes: true, subtree: true, attributeFilter: ['hidden', 'data-single-event'] });
  }
  sync();
})();
