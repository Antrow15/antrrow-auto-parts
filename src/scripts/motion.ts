const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initReveal() {
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal], [data-stagger] > *');
  if (!('IntersectionObserver' in window) || reduceMotion) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );

  targets.forEach((el) => observer.observe(el));
}

/** Children of [data-stagger] reveal one after another. */
function initStagger() {
  document.querySelectorAll<HTMLElement>('[data-stagger]').forEach((group) => {
    const step = Number(group.dataset['stagger']) || 90;
    Array.from(group.children).forEach((child, i) => {
      if (!(child instanceof HTMLElement)) return;
      child.style.setProperty('--reveal-delay', `${i * step}ms`);
    });
  });
}

function animateCount(el: HTMLElement) {
  const target = Number(el.dataset['count']);
  const suffix = el.dataset['suffix'] ?? '';
  if (!Number.isFinite(target)) return;
  const duration = 1600;
  const start = performance.now();

  const tick = (now: number) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    el.textContent = `${Math.round(target * eased)}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function initCounters() {
  const counters = document.querySelectorAll<HTMLElement>('[data-count]');
  if (reduceMotion || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        animateCount(entry.target as HTMLElement);
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.6 },
  );
  counters.forEach((el) => observer.observe(el));
}

function initHeader() {
  const header = document.querySelector<HTMLElement>('[data-site-header]');
  if (!header) return;
  let ticking = false;
  const update = () => {
    header.toggleAttribute('data-scrolled', window.scrollY > 12);
    ticking = false;
  };
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  update();
}

initStagger();
initReveal();
initCounters();
initHeader();
