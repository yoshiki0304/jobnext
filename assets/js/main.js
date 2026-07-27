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
