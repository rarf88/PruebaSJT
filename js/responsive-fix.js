
/* responsive-fix.js — v3 — SOLO móvil/tablet (site-tailored) */
(function(){
  if(!window.matchMedia || !window.matchMedia("(max-width: 991px)").matches) return;
  const root = document.documentElement;
  const header = document.querySelector('.site-header, header, .navbar');
  function setH(){
    if(!header) return;
    const h = header.getBoundingClientRect().height || 64;
    root.style.setProperty('--headerH', Math.round(h) + 'px');
  }
  setH();
  window.addEventListener('resize', ()=>{
    if(!window.matchMedia("(max-width: 991px)").matches) return;
    setH(); placeMenu(); fitMenuWidth();
  }, {passive:true});
  window.addEventListener('scroll', ()=>{
    requestAnimationFrame(setH);
  }, {passive:true});

  // Utilidad: scroll compensado
  function scrollToWithOffset(el){
    if(!el) return;
    const headerH = parseInt(getComputedStyle(root).getPropertyValue('--headerH')) || 70;
    const y = el.getBoundingClientRect().top + window.pageYOffset - (headerH + 8);
    window.scrollTo({top:y, behavior:'smooth'});
  }

  // ===== Menú hamburguesa =====
  const mobileMenus = document.querySelectorAll('.mobile-menu, .menu-mobile, .site-header .mobile');
  function placeMenu(){
    const h = parseInt(getComputedStyle(root).getPropertyValue('--headerH')) || 70;
    mobileMenus.forEach(menu=>{
      menu.style.top = h + 'px';
      menu.style.maxHeight = `calc(100vh - ${h}px - 16px)`;
    });
  }
  function fitMenuWidth(){
    mobileMenus.forEach(menu=>{
      const items = menu.querySelectorAll('a, .menu-item, li');
      let max = 0;
      items.forEach(el=>{ max = Math.max(max, el.scrollWidth); });
      const vw = Math.max(document.documentElement.clientWidth, window.innerWidth||0);
      menu.style.width = Math.min(Math.ceil(max + 32), vw - 32) + 'px';
    });
  }
  placeMenu(); fitMenuWidth();

  // ===== Productos: al elegir gestión, mostrar módulos y hacer scroll =====
  function hookProductos(){
    const contMod = document.getElementById('modulos-grid') || document.getElementById('modulos') || document.querySelector('.productos-modulos-below');
    if(!contMod) return;
    // Gestion-item botones
    document.querySelectorAll('.gestion-item').forEach(btn=>{
      btn.addEventListener('click', ()=>{ setTimeout(()=>scrollToWithOffset(contMod), 50); }, {passive:true});
    });
  }
  function onReady(fn){ if(document.readyState!=="loading") fn(); else document.addEventListener("DOMContentLoaded", fn); }
  onReady(hookProductos);
})();
