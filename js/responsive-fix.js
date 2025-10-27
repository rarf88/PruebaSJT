/* responsive-fix.js — v2 — SOLO tablet/móvil. Escritorio intocable. */
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
    placeMenu(); fitWidthToContent();
  });

  window.scrollToWithOffset = function (selector) {
    const el = document.querySelector(selector);
    if (!el) return;
    const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--headerH')) || 70;
    const y = el.getBoundingClientRect().top + window.pageYOffset - (headerH + 8);
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  const menu = document.querySelector('.mobile-menu');
  const items = menu ? menu.querySelectorAll('.menu-item') : null;

  function placeMenu() {
    const h = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--headerH')) || 70;
    if (!menu) return;
    menu.style.top = h + 'px';
    menu.style.maxHeight = `calc(100vh - ${h}px - 16px)`;
  }
  function fitWidthToContent() {
    if (!menu || !items || !items.length) return;
    let max = 0;
    items.forEach(el => { max = Math.max(max, el.scrollWidth); });
    const target = Math.ceil(max + 32);
    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    menu.style.width = Math.min(target, vw - 32) + 'px';
  }
  placeMenu(); fitWidthToContent();

  let viewState = 'entidades';

  function showModulesByTarget(targetId){
    const entidades = document.querySelector('#entidades');
    entidades && entidades.classList.add('hidden');
    document.querySelectorAll('.bloque-modulos').forEach(b=>b.classList.add('hidden'));
    const target = document.querySelector(targetId);
    if (target) target.classList.remove('hidden');
    const cont = document.querySelector('#modulos');
    cont && cont.classList.remove('hidden');
    viewState = 'modulos';
    if (!document.querySelector('#modulos-anchor')){
      const anchor = document.createElement('div');
      anchor.id = 'modulos-anchor';
      (cont && cont.parentNode) ? cont.parentNode.insertBefore(anchor, cont) : document.body.prepend(anchor);
    }
    window.scrollToWithOffset('#modulos-anchor');
  }

  document.querySelectorAll('.gestion-item, .btn-gestion').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      e.preventDefault();
      const targetId = btn.getAttribute('data-target');
      if (targetId) showModulesByTarget(targetId);
    });
  });
  document.querySelectorAll('.ver-modulos, .link-ver-modulos').forEach(link=>{
    link.addEventListener('click', (e)=>{
      e.preventDefault();
      const targetId = link.getAttribute('data-target');
      if (targetId) showModulesByTarget(targetId);
    });
  });

  document.addEventListener('click', ()=>{
    if (viewState === 'modulos'){
      const entidades = document.querySelector('#entidades');
      entidades && entidades.classList.add('hidden');
    }
  }, true);

  if (window.$ && typeof $ === 'function' && $('.slider').slick){
    try { $('.slider').slick('slickSetOption', { centerMode: false, centerPadding: '0px' }, true); } catch(e){}
  }
})();
