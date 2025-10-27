
/* responsive-fix.js — SOLO tablet/móvil. Escritorio intocable. */
(function () {
  if (!window.matchMedia || !window.matchMedia("(max-width: 991px)").matches) return;

  const root = document.documentElement;
  const header = document.querySelector('header.sticky, header.fixed, .header.sticky, .header.fixed, header');
  function updateHeaderVar() {
    if (!header) return;
    const h = header.getBoundingClientRect().height;
    root.style.setProperty('--headerH', Math.round(h) + 'px');
  }
  updateHeaderVar();
  let rafId = null;
  window.addEventListener('scroll', () => {
    if (rafId) return;
    rafId = requestAnimationFrame(() => { updateHeaderVar(); rafId = null; });
  }, { passive: true });
  window.addEventListener('resize', () => {
    if (!window.matchMedia("(max-width: 991px)").matches) return;
    updateHeaderVar();
  });

  // Scroll con offset para anclas internas
  window.scrollToWithOffset = function (selector) {
    const el = document.querySelector(selector);
    if (!el) return;
    const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--headerH')) || 70;
    const y = el.getBoundingClientRect().top + window.pageYOffset - (headerH + 8);
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  // Productos: click en Gestión muestra módulos sin volver a Entidades
  const gestionItems = document.querySelectorAll('.gestion-item');
  if (gestionItems.length) {
    gestionItems.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const entidades = document.querySelector('#entidades');
        entidades && entidades.classList.add('hidden');
        const targetId = btn.getAttribute('data-target'); // Ej: "#modulos-financiera"
        document.querySelectorAll('.bloque-modulos').forEach(b => b.classList.add('hidden'));
        const target = document.querySelector(targetId);
        target && target.classList.remove('hidden');
        if (!document.querySelector('#modulos-anchor')) {
          const anchor = document.createElement('div');
          anchor.id = 'modulos-anchor';
          const modulos = document.querySelector('#modulos') || target;
          if (modulos && modulos.parentNode) modulos.parentNode.insertBefore(anchor, modulos);
        }
        window.scrollToWithOffset('#modulos-anchor');
      });
    });
  }

  // Menú hamburguesa: evitar que quede tapado por el header
  const mobileMenu = document.querySelector('.mobile-menu');
  if (mobileMenu) {
    function placeMenu() {
      const h = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--headerH')) || 70;
      mobileMenu.style.top = h + 'px';
      mobileMenu.style.maxHeight = `calc(100vh - ${h}px)`;
    }
    placeMenu();
    window.addEventListener('resize', () => {
      if (!window.matchMedia("(max-width: 991px)").matches) return;
      placeMenu();
    });
  }
})();
