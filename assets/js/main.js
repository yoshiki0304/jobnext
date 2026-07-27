(() => {
  'use strict';

  const header = document.querySelector('.site-header');
  const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

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
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      const offset = window.innerWidth <= 760 ? 12 : 92;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  const linePopup = document.getElementById('linePopup');
  const linePopupClose = linePopup?.querySelector('.line-popup-close');
  let linePopupShown = false;

  const hideLinePopup = () => {
    if (!linePopup) return;
    linePopup.classList.remove('is-visible');
    linePopup.setAttribute('aria-hidden', 'true');
    sessionStorage.setItem('linePopupDismissed', '1');
  };

  const showLinePopup = () => {
    if (!linePopup || linePopupShown || sessionStorage.getItem('linePopupDismissed') === '1') return;
    linePopup.classList.add('is-visible');
    linePopup.setAttribute('aria-hidden', 'false');
    linePopupShown = true;
  };

  const checkLinePopup = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return;
    const progress = window.scrollY / scrollable;
    if (progress >= 0.6) showLinePopup();
  };

  linePopupClose?.addEventListener('click', hideLinePopup);
  window.addEventListener('scroll', checkLinePopup, { passive: true });
  window.addEventListener('load', checkLinePopup);

  const form = document.querySelector('.entry-form');
  if (!form) return;

  const markError = (field, hasError) => {
    const row = field.closest('.form-row');
    if (row) row.classList.toggle('has-error', hasError);
    field.setAttribute('aria-invalid', String(hasError));
  };

  form.addEventListener('submit', (event) => {
    let valid = true;
    const required = form.querySelectorAll('[required]');

    required.forEach((field) => {
      const empty = field.type === 'checkbox' ? !field.checked : !field.value.trim();
      markError(field, empty);
      if (empty) valid = false;
    });

    const tel = form.querySelector('#tel');
    if (tel && tel.value) {
      const normalized = tel.value.replace(/[\s()-]/g, '');
      const invalidTel = !/^0\d{9,10}$/.test(normalized);
      markError(tel, invalidTel);
      if (invalidTel) valid = false;
    }

    if (!valid) {
      event.preventDefault();
      const firstError = form.querySelector('[aria-invalid="true"]');
      firstError?.focus();
    }
  });

  form.querySelectorAll('input, select').forEach((field) => {
    field.addEventListener('input', () => markError(field, false));
    field.addEventListener('change', () => markError(field, false));
  });
})();
