/* Rally Point Title — site behavior
   v3: Trust & Authority refinements
*/
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Sticky header shadow ---------- */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile nav ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        menu.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const expanded = q.getAttribute('aria-expanded') === 'true';
      q.closest('.faq').querySelectorAll('.faq-q').forEach(o => {
        if (o !== q) o.setAttribute('aria-expanded', 'false');
      });
      q.setAttribute('aria-expanded', String(!expanded));
    });
  });

  /* ---------- Audience tabs ---------- */
  const tabs = document.querySelectorAll('.audience-tab');
  if (tabs.length) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.target;
        tabs.forEach(t => t.classList.toggle('is-active', t === tab));
        document.querySelectorAll('.audience-panel').forEach(p => {
          p.classList.toggle('is-active', p.id === target);
        });
      });
    });
  }

  /* ---------- Forms (demo) ---------- */
  document.querySelectorAll('form[data-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = form.querySelector('.form-status');
      const required = form.querySelectorAll('[required]');
      let ok = true;
      let firstInvalid = null;
      required.forEach(f => {
        const valid = f.type === 'checkbox' ? f.checked : !!f.value.trim();
        if (!valid) {
          ok = false;
          f.style.borderColor = 'var(--error)';
          if (!firstInvalid) firstInvalid = f;
        } else {
          f.style.borderColor = '';
        }
      });
      if (!ok) {
        if (status) { status.className = 'form-status error'; status.textContent = 'Please complete all required fields.'; }
        if (firstInvalid) firstInvalid.focus();
        return;
      }
      if (status) { status.className = 'form-status success'; status.textContent = 'Thanks — we have received your request. A team member will reach out within one business day.'; }
      form.reset();
    });
  });

  /* ---------- Reveal on scroll ---------- */
  const revealTargets = document.querySelectorAll('.card, .testimonial, .step, .value, .contact-block, .post, .form-row, .faq-video, [data-reveal]');
  revealTargets.forEach(el => el.setAttribute('data-reveal', ''));

  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(el => io.observe(el));
    // Safety: reveal everything after 3s in case IO never fires
    setTimeout(() => revealTargets.forEach(el => el.classList.add('is-in')), 3000);
  } else {
    revealTargets.forEach(el => el.classList.add('is-in'));
  }

  /* ---------- Animated stat counter ----------
     Any [data-count="N"] increments from 0 → N when scrolled into view.
     Optional [data-suffix] / [data-prefix].
     Decimals respected (e.g. 4.7).
  */
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    if (isNaN(target)) return;
    const decimals = (String(target).split('.')[1] || '').length;
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1100;
    const start = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    function tick(now) {
      const p = Math.min(1, (now - start) / duration);
      const v = target * ease(p);
      el.textContent = prefix + (decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString()) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = prefix + (decimals ? target.toFixed(decimals) : target.toLocaleString()) + suffix;
    }
    requestAnimationFrame(tick);
  }

  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      counters.forEach(el => {
        const target = parseFloat(el.dataset.count);
        const decimals = (String(target).split('.')[1] || '').length;
        el.textContent = (el.dataset.prefix || '') + (decimals ? target.toFixed(decimals) : target.toLocaleString()) + (el.dataset.suffix || '');
      });
    } else {
      const cio = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            animateCount(e.target);
            cio.unobserve(e.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(c => { c.textContent = (c.dataset.prefix || '') + '0' + (c.dataset.suffix || ''); cio.observe(c); });
    }
  }

  /* ---------- Year in footer ---------- */
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
})();
