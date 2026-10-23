(() => {
 const host = document.getElementById('signup');
 if (!host) return;
 // Move the existing embed rather than duplicating Kit's form IDs and state.
 const home = document.createComment('hero signup position');
 host.before(home);
 // Keep the hero's completed state visible while its Kit form is in the modal.
 const heroConfirmation = document.createElement('p');
 heroConfirmation.className = 'signup-hero-confirmation';
 heroConfirmation.hidden = true;
 heroConfirmation.setAttribute('aria-hidden', 'true');
 home.before(heroConfirmation);
 const dialog = document.createElement('dialog');
 dialog.id = 'notify-dialog';
 dialog.setAttribute('aria-labelledby', 'notify-title');
 dialog.setAttribute('aria-describedby', 'notify-help');
 dialog.innerHTML = `<button class="dialog-close" type="button" aria-label="close signup"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19"></path></svg></button><div class="notify-content"><h2 id="notify-title" tabindex="-1" autofocus>let’s keep you posted</h2><p id="notify-help">be the first to hear about our next pop-up and when you can book your seat</p><div class="notify-form-slot"></div></div>`;
 document.body.append(dialog);
 let opener;
 let pointerOpened = false;
 let previousOverflow = '';
 const slot = dialog.querySelector('.notify-form-slot');
 const submitLabel = () => host.querySelector('.formkit-submit > span');
 let originalSubmitLabel = 'join waitlist';
 dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
 dialog.addEventListener('close', () => {
   resetUnfinishedSignup();
   home.after(host);
   heroConfirmation.hidden = true;
   slot.style.minHeight = '';
   const label = submitLabel();
   if (label) label.textContent = originalSubmitLabel;
   document.documentElement.style.overflow = previousOverflow;
   if (pointerOpened) opener?.classList.add('signup-pointer-return');
   opener?.focus({preventScroll:true});
 });
 dialog.addEventListener('click', event => {
   if (event.target !== dialog) return;
   const box = dialog.getBoundingClientRect();
   if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
 });
 function updateModalViewport() {
   if (!dialog.open) return;
   const viewport = window.visualViewport;
   const top = viewport?.offsetTop || 0;
   const height = viewport?.height || window.innerHeight;
   dialog.style.setProperty('--notify-viewport-top', `${top}px`);
   dialog.style.setProperty('--notify-viewport-height', `${height}px`);
   requestAnimationFrame(() => {
     if (!dialog.open || !window.matchMedia('(max-width: 750px)').matches) return;
     const input = host.querySelector('input[type="email"]');
     if (input && document.activeElement === input) {
       const box = input.parentElement.getBoundingClientRect();
       const excess = box.bottom - (top + height - 24);
       if (excess > 0) dialog.scrollTop += excess;
     }
   });
 }
 window.visualViewport?.addEventListener('resize', updateModalViewport);
 window.visualViewport?.addEventListener('scroll', updateModalViewport);
 window.addEventListener('resize', updateModalViewport);
 // Each surface starts fresh; the successful subscription state stays shared.
 function resetUnfinishedSignup() {
   if (host.querySelector('.formkit-alert-success')) return;
   const input = host.querySelector('input[type="email"]');
   if (input) {
     input.blur();
     input.value = '';
     input.dataset.siteEmailStarted = 'false';
     input.removeAttribute('aria-invalid');
     input.setCustomValidity('');
   }
   host.querySelectorAll('.signup-email-error').forEach(error => { error.hidden = true; });
   host.querySelectorAll('.formkit-alert-error').forEach(error => { error.replaceChildren(); });
 }
 function validEmail(input) {
   return input.validity.valid && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
 }
 function validateEmail(input) {
   const invalid = !validEmail(input);
   const error = document.getElementById(`${input.id}-error`);
   input.setAttribute('aria-invalid', String(invalid));
   if (error) error.hidden = !invalid;
   if (invalid && dialog.open) slot.style.minHeight = '';
   updateModalViewport();
   return !invalid;
 }
 // Validate before Kit's submit handler, then preserve the successful form area's height.
 host.addEventListener('submit', event => {
   const input = host.querySelector('input[type="email"]');
   if (input && !validateEmail(input)) {
     event.preventDefault();
     event.stopImmediatePropagation();
     input.focus({preventScroll:true});
     return;
   }
   if (dialog.open) slot.style.minHeight = `${slot.getBoundingClientRect().height}px`;
 }, true);
 const successCopy = 'almost there! check your email and confirm your address to join the waitlist.';
 function enhanceForm() {
   const input = host.querySelector('input[type="email"]');
   if (input && input.dataset.siteFloatingLabel !== 'ready') {
     input.id ||= 'signup-email-address';
     input.autocomplete = 'email';
     const label = document.createElement('label');
     label.className = 'signup-email-label';
     label.htmlFor = input.id;
     label.textContent = 'email address';
     input.dataset.siteFloatingLabel = 'ready';
     input.after(label);
     input.placeholder = ' ';
     input.removeAttribute('aria-label');
     const error = document.createElement('p');
     error.id = `${input.id}-error`;
     error.className = 'signup-email-error';
     error.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M10.3 4.2 2.5 18a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0Z"></path><path d="M12 9v4m0 4h.01"></path></svg><span>please enter a valid email address.</span>';
     error.hidden = true;
     error.setAttribute('aria-live', 'polite');
     const fields = input.closest('.formkit-fields');
     if (fields) fields.after(error);
     else label.after(error);
     const description = input.getAttribute('aria-describedby');
     input.setAttribute('aria-describedby', [description, error.id].filter(Boolean).join(' '));
     input.dataset.siteEmailStarted = String(!!input.value);
     input.addEventListener('input', () => {
       input.dataset.siteEmailStarted = 'true';
       if (input.getAttribute('aria-invalid') === 'true') validateEmail(input);
     });
     input.addEventListener('blur', () => { if (input.dataset.siteEmailStarted === 'true' || input.value) validateEmail(input); });
     input.addEventListener('invalid', event => { event.preventDefault(); validateEmail(input); });
     input.addEventListener('focus', updateModalViewport);
   }
   const buttonLabel = submitLabel();
   if (buttonLabel && buttonLabel.textContent !== 'join waitlist') buttonLabel.textContent = 'join waitlist';
   host.querySelectorAll('.formkit-alert-success').forEach(message => {
     if (message.textContent !== successCopy) message.textContent = successCopy;
     message.setAttribute('role', 'status');
     message.setAttribute('aria-live', 'polite');
   });
   const completed = !!host.querySelector('.formkit-alert-success');
   if (completed && heroConfirmation.textContent !== successCopy) heroConfirmation.textContent = successCopy;
   heroConfirmation.hidden = !(dialog.open && completed);
 }
 new MutationObserver(enhanceForm).observe(host, { childList: true, subtree: true, characterData: true });
 enhanceForm();
 document.querySelectorAll('a[href="#signup"]').forEach(link => {
   link.addEventListener('blur', () => link.classList.remove('signup-pointer-return'));
   link.addEventListener('keydown', () => link.classList.remove('signup-pointer-return'));
   link.addEventListener('click', event => {
   if (typeof dialog.showModal !== 'function') return;
   event.preventDefault();
   if (dialog.open) return;
   opener = link;
   pointerOpened = event.detail > 0;
   previousOverflow = document.documentElement.style.overflow;
   const label = submitLabel();
   if (label) originalSubmitLabel = label.textContent;
   resetUnfinishedSignup();
   slot.append(host);
   dialog.showModal();
   dialog.scrollTop = 0;
   document.documentElement.style.overflow = 'hidden';
   enhanceForm();
   updateModalViewport();
   if (window.matchMedia('(max-width: 750px)').matches) {
     // Start with the heading: no close-button highlight or automatic keyboard.
     dialog.querySelector('#notify-title').focus({preventScroll:true});
   } else {
     host.querySelector('input[type="email"]')?.focus({preventScroll:true});
   }
   });
 });
})();
