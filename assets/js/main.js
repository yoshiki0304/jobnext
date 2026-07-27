(() => {
  'use strict';

  const header = document.querySelector('.site-header');
  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 10);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -45px' });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('in-view'));
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const selector = link.getAttribute('href');
      if (!selector || selector === '#') return;
      const target = document.querySelector(selector);
      if (!target) return;
      event.preventDefault();
      const offset = window.innerWidth <= 760 ? 10 : 86;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  const popup = document.getElementById('linePopup');
  const popupClose = popup?.querySelector('.line-popup-close');
  let popupShown = false;

  const showPopup = () => {
    if (!popup || popupShown || sessionStorage.getItem('linePopupClosed') === '1') return;
    popup.classList.add('is-visible');
    popup.setAttribute('aria-hidden', 'false');
    popupShown = true;
  };

  const checkPopupPosition = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return;
    if (window.scrollY / scrollable >= 0.6) showPopup();
  };

  popupClose?.addEventListener('click', () => {
    popup.classList.remove('is-visible');
    popup.setAttribute('aria-hidden', 'true');
    sessionStorage.setItem('linePopupClosed', '1');
  });

  window.addEventListener('scroll', checkPopupPosition, { passive: true });
  window.addEventListener('load', checkPopupPosition);

  const form = document.querySelector('.entry-form');
  if (!form) return;

  const setError = (field, hasError) => {
    const row = field.closest('.form-row');
    row?.classList.toggle('has-error', hasError);
    field.setAttribute('aria-invalid', String(hasError));
  };

  form.addEventListener('submit', (event) => {
    let valid = true;
    form.querySelectorAll('[required]').forEach((field) => {
      const empty = field.type === 'checkbox' ? !field.checked : !field.value.trim();
      setError(field, empty);
      if (empty) valid = false;
    });

    const tel = form.querySelector('#tel');
    if (tel?.value) {
      const normalized = tel.value.replace(/[\s()-]/g, '');
      const invalid = !/^0\d{9,10}$/.test(normalized);
      setError(tel, invalid);
      if (invalid) valid = false;
    }

    if (!valid) {
      event.preventDefault();
      form.querySelector('[aria-invalid="true"]')?.focus();
    }
  });

  form.querySelectorAll('input,select').forEach((field) => {
    field.addEventListener('input', () => setError(field, false));
    field.addEventListener('change', () => setError(field, false));
  });
})();
