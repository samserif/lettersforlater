(() => {
  const links = [...document.querySelectorAll('a.luma-checkout--button')];
  if (!links.length || typeof HTMLDialogElement === 'undefined') return;
  const dialog = document.createElement('dialog');
  dialog.id = 'booking-dialog';
  dialog.setAttribute('aria-labelledby', 'booking-title');
  dialog.innerHTML = `<div class="booking-toolbar"><span id="booking-title" tabindex="-1" autofocus>book your spot</span><button type="button" class="booking-close" aria-label="close booking"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19"></path></svg></button></div><div class="booking-frame-slot"></div>`;
  document.body.append(dialog);
  let opener;
  let previousOverflow = '';
  dialog.querySelector('.booking-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.documentElement.style.overflow = previousOverflow;
    dialog.querySelector('.booking-frame-slot').replaceChildren();
    opener?.focus({preventScroll: true});
  });
  links.forEach(link => link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    if (typeof dialog.showModal !== 'function') return;
    const eventId = link.dataset.lumaEventId;
    if (!eventId || dialog.open) return;
    event.preventDefault();
    opener = link;
    const frame = document.createElement('iframe');
    const src = new URL(`https://luma.com/embed/event/${encodeURIComponent(eventId)}/simple`);
    const params = new URLSearchParams(window.location.search);
    params.forEach((value, key) => {
      if (/^utm_/.test(key) || ['gclid', 'fbclid', 'li_fat_id', 'coupon'].includes(key)) src.searchParams.set(key, value);
    });
    frame.src = src.href;
    frame.title = 'Letters for Later — event details and registration';
    frame.setAttribute('allow', 'payment');
    frame.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    dialog.querySelector('.booking-frame-slot').replaceChildren(frame);
    previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    dialog.showModal();
    dialog.querySelector('#booking-title').focus({preventScroll: true});
  }));
})();
