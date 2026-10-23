(() => {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const close = menu.querySelector('.menu-close');
  const links = [...menu.querySelectorAll('nav a')];
  const mobile = window.matchMedia('(max-width: 750px)');
  let priorOverflow = '';
  function dismiss() { if (menu.open) menu.close(); }
  toggle.addEventListener('click', () => {
    if (!mobile.matches) return;
    priorOverflow = document.documentElement.style.overflow;
    menu.showModal();
    toggle.setAttribute('aria-expanded', 'true');
    document.documentElement.style.overflow = 'hidden';
    menu.querySelector('#menu-label').focus({ preventScroll: true });
  });
  close.addEventListener('click', dismiss);
  menu.addEventListener('close', () => {
    toggle.setAttribute('aria-expanded', 'false');
    document.documentElement.style.overflow = priorOverflow;
    if (mobile.matches) toggle.focus();
  });
  links.forEach(link => link.addEventListener('click', () => {
    dismiss();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
    }
  }));
  mobile.addEventListener('change', () => { if (!mobile.matches) dismiss(); });
})();
